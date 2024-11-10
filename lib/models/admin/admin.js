const Mongo = require("package:/servers/mongo")
const MySql = require("package:/servers/mysql")
const Redis = require("package:/servers/redis")
const Databases = require("package:/models/databases")
const SessionModel = require("package:/models/session")
const PermissionsModel = require("package:/models/admin/permissions")

class AdminModel {
    static redis = new Redis()
    static session = new SessionModel()
    static mysql = new MySql(Databases.mysql.admin)
    static mongo = new Mongo(Databases.mongo.admin)
    static control = new MySql(Databases.mysql.control)

    issetSession = false
    #permissions = null

    /**
     * Proporciona acceso a los datos y métodos del cliente
     * Normalmente este objeto se encuentra en context.session en los controladores
     * @param {Object} data datos del cliente
     */
    constructor(data) {
        if (data === undefined) return

        this.id = data.id
        this.team = data.eid
        this.list = data.lista ?? 1
        this.issetSession = true
        this.estado = data.estado
    }

    /**
     * Recupera la sesión del cliente usando un autentificado
     * @param {String} loggerKey El tipo de autentificador para buscar la cuenta del cliente
     * @param {String} loggerValue El autentificador del cliente
     * @returns {Promise<AdminModel>||boolean}
     */
    static async fromAuthenticator(loggerKey, loggerValue) {
        const data = await AdminModel.mysql.findOne("SELECT `id`,`eid`,`lista` FROM `administradores` WHERE `" + loggerKey + "` = '" + loggerValue + "'")

        if (!data) {
            this.issetSession = false
            return this.issetSession
        }

        return new AdminModel(data)
    }

    /**
     * @param {String} accs Token de acceso
     * @returns {Promise<number>} Identificador del usuario
     */
    static async fromAccess(accs) {
        // el parámetro 1 indica que el usuario es paciente
        const aid = await AdminModel.session.UidFromAccess(accs, 2)

        if (!aid) {
            this.issetSession = false
            return this.issetSession
        }

        const data = await AdminModel.mysql.findOne("SELECT `id`,`estado`,`eid`,`lista` FROM `administradores` WHERE `id` = " + aid)

        if (!data) {
            this.issetSession = false
            return this.issetSession
        }

        return new AdminModel(data)
    }

    /**
     * @param {Number} aid ID del administrador
     * @returns {Promise<String>} Ultima contraseña valida almacenada
     */
    async findPassword(aid = this.id) {
        return await AdminModel.mysql.findOne("SELECT * FROM `contrasenas` WHERE `uid` = " + aid + " AND `estado` IS NULL ORDER BY `fecha` DESC")
    }

    /**
     * @returns {Promise<Object>} Datos personales del administrador
     */
    async personalData() {
        const data = await Promise.all([
            AdminModel.mysql.findOne("SELECT `nombre`,`apellido`,`correo`,`usuario`,`telefono`,`tdni`,`dni`,`nacimiento`,`sexo`,`estado` FROM `administradores` WHERE `id` = " + this.id),
            AdminModel.mysql.findOne("SELECT `profesion` FROM `extras` WHERE `aid` = " + this.id)
        ])

        const result = {}

        for (const item of data) {
            if (item) {
                Object.assign(result, item)
            }
        }

        return result
    }

    async resumeFromAID(id) {
        const response = {}
        response.names = await AdminModel.mysql.findOne("SELECT `nombre`,`apellido` FROM `administradores` WHERE `id` = " + id)

        response.profession = await AdminModel.mysql.findOne("SELECT `profesion` FROM `extras` WHERE `aid` = " + id, "profesion")

        return response
    }

    async lists() {
        return await AdminModel.mysql.find("SELECT `id`,`titulo`,`color` FROM `lista_variables` WHERE `eid` = " + this.team + " ORDER BY `fecha` DESC")
    }

    async variableList({ list = this.list } = {}) {
        const result = await AdminModel.mysql.find("SELECT `posicion`,`variable` FROM `lista_variables_orden` WHERE `lista` = " + list + " AND `eid` = " + this.team + " ORDER BY `posicion`,`fecha` ASC")

        if (!result) return []

        const last = []
        const first = []

        for (const k in result) {
            if (result[k].posicion === null) {
                last.push(result[k].variable)
            } else {
                first.push(result[k].variable)
            }
        }

        const response = first.concat(last)

        // TODO: cache
        return response
    }

    async createList(data) {
        data.eid = this.team
        return await AdminModel.mysql.insert(data, "lista_variables")
    }

    async updateList(data, id) {
        return await AdminModel.mysql.edit(data, { id }, "lista_variables")
    }

    async updateListOrder(list, order) {
        const edits = []

        for (const i in order) {
            edits.push(AdminModel.mysql.query("UPDATE `lista_variables_orden` SET `posicion`='" + i + "' WHERE `lista` = " + list + " AND `eid` = " + this.team + " AND `variable` = '" + order[i] + "'"))
        }

        return await Promise.all(edits)
    }

    async validateList(id) {
        return await AdminModel.mysql.findOne("SELECT * FROM `lista_variables` WHERE `id` = " + id + " AND `eid` = " + this.team)
    }

    async addVariableToList(list, variable) {
        const result = await AdminModel.mysql.findOne("SELECT `id` FROM `lista_variables_orden` WHERE `lista` = " + list + " AND `variable` = " + variable + " AND `eid` = " + this.team)

        if (result) return result.id

        return await AdminModel.mysql.insert({ lista: list, variable, eid: this.team }, "lista_variables_orden")
    }

    async removeVariableFromList(list, variable) {
        return await AdminModel.mysql.query("DELETE FROM `lista_variables_orden` WHERE `lista` = " + list + " AND `eid` = " + this.team + " AND `variable` = " + variable)
    }

    async groupList() {
        const result = await AdminModel.mysql.find("SELECT `gid` FROM `grupos_administradores` WHERE `aid` = " + this.id, "gid")

        if (!result) return null
        if (result.length === 0) return null

        return result
    }

    async groupsOfTeam() {
        return await AdminModel.mysql.find("SELECT `id`,`titulo`,`color`,`descripcion` FROM `grupos` WHERE `eid` = " + this.team)
    }

    async variablesOfTeam() {
        return await AdminModel.mysql.find("SELECT `id`,`titulo`,`color` FROM `lista_variables` WHERE `eid` = " + this.team)
    }

    async validatePatient(pid) {
        return await AdminModel.mysql.findOne("SELECT `id` FROM `pacientes` WHERE `pid` = " + pid + " AND `eid` = " + this.team)
        // TODO validar que este en el grupo
    }

    async getRestrictions() {
        const result = await AdminModel.mysql.find("SELECT `variable`,`visible`,`editable` FROM `diccionario` WHERE `aid` = " + this.id + "  OR `aid` = 0")

        if (result.length === 0) return null

        const response = {}

        for (const item of result) {
            response[item.variable] = {
                v: item.visible,
                e: item.editable
            }
        }

        return response
    }

    async getTeamMembers() {
        const result = await AdminModel.mysql.find("SELECT `nombre`,`apellido`,`correo`,`usuario`,`sexo`,`lista` FROM `administradores` WHERE `eid` = " + this.team + " AND `estado` IS NULL ORDER BY `fecha_registro` DESC")

        if (!result) return null

        return result
    }

    async createPatient(uid, group = null) {
        const patient = { pid: uid, eid: this.team }
        if (group !== null) {
            patient.gid = [group]
        }

        await AdminModel.mysql.insert(patient, "pacientes")
        await AdminModel.control.insert({ pid: uid, aid: this.id }, "ingresos")
    }

    async getPermissions() {
        if (this.#permissions) return this.#permissions

        const result = await AdminModel.mysql.findOne("SELECT * FROM `permisos` WHERE `aid` = " + this.id + " AND `eid` = " + this.team)

        if (!result) return null

        return new PermissionsModel(result)
    }
}

module.exports = AdminModel
