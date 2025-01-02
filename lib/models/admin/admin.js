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
            AdminModel.mysql.findOne("SELECT `nombre`,`apellido`,`correo`,`usuario`,`telefono`,`tdni`,`dni`,`nacimiento`,`sexo`,`lista`,`estado` FROM `administradores` WHERE `id` = " + this.id),
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
    
    async validateList(id) {
        return await AdminModel.mysql.findOne("SELECT * FROM `lista_variables` WHERE `id` = " + id + " AND `eid` = " + this.team)
    }

    async createList(data) {
        data.eid = this.team
        return await AdminModel.mysql.insert(data, "lista_variables")
    }

    /**
     * La lista de variables determina las variables y el orden en el que se mostraran en la table de pacientes
     * @param {Int} list ID de la lista de variables que se quiere obtener
     * @returns {Promise<Array<Object>>} Una lista con las variables ordenadas
     */
    async variableList({ list = this.list } = {}) {
        const result = await AdminModel.mongo.findOne({ _id: list }, "lista_variables")

        if (!result) return []
        if (result.length === 0) return []
        return result.variables
    }

    async updateList(data, id) {
        return await AdminModel.mysql.edit(data, { id }, "lista_variables")
    }

    async addVariableToList(list, variable) {
        const result = await AdminModel.mongo.findOne({ _id: list }, "lista_variables")

        if (!result) {
            const data = {
                _id: list,
                variables: []
            }

            data.variables.push(variable)

            return await AdminModel.mongo.insert(data, "lista_variables")
        } else {
            if (result.variables.includes(variable)) return null
            result.variables.splice(0, 0, variable)
            return await AdminModel.mongo.edit({ _id: list }, result, "lista_variables")
        }
    }

    async updateListOrder(list, order) {
        const result = await AdminModel.mongo.findOne({ _id: list }, "lista_variables")
        result.variables = order
        return await AdminModel.mongo.edit({ _id: list }, result, "lista_variables")
    }

    async removeVariableFromList(list, variable) {
        const result = await AdminModel.mongo.findOne({ _id: list }, "lista_variables")

        const index = result.variables.indexOf(variable)
        if (index === -1) return null

        result.variables.splice(index, 1)

        return await AdminModel.mongo.edit({ _id: list }, result, "lista_variables")
    }

    async removeVariableFromAll(variable) {
        const result = await AdminModel.mongo.find({ variables: variable }, "lista_variables")

        if (!result) return null
        if (result.length === 0) return null

        const process = []

        for (const item of result) {
            item.variables.splice(item.variables.indexOf(variable), 1)
            process.push(AdminModel.mongo.edit({ _id: item._id }, item, "lista_variables"))
        }

        return await Promise.all(process)
    }

    async findAGroup(id) {
        return await AdminModel.mysql.findOne("SELECT * FROM `grupos` WHERE `id` = " + id + " AND `eid` = " + this.team)
    }

    async createGroup(data) {
        data.eid = this.team
        return await AdminModel.mysql.insert(data, "grupos")
    }

    async updateGroup(id, data) {
        return await AdminModel.mysql.edit(data, { id }, "grupos")
    }

    /**
     * Un grupo es un conjuntos de pacientes agrupados específicamente
     * En un mismo grupo pueden haber varios administradores, lo que permite organizar a los pacientes dependiendo de las necesidades
     * De la misma manera, un administrador puede están en varios grupos a la vez
     * @returns {Promise<Array<Object>>} Una lista con todos los grupos en los que esta el administrador
     */
    async groupList() {
        const result = await AdminModel.mysql.find("SELECT `gid` FROM `grupos_administradores` WHERE `aid` = " + this.id, "gid")

        if (!result) return null
        if (result.length === 0) return null

        return result
    }

    async groupsOfTeam() {
        return await AdminModel.mysql.find("SELECT `id`,`titulo`,`color`,`descripcion` FROM `grupos` WHERE `eid` = " + this.team + " ORDER BY `fecha` DESC")
    }

    async groupsOfPatient(pid) {
        return await AdminModel.mysql.find("SELECT `gid` FROM `pacientes` WHERE `pid` = " + pid + " AND `gid` IS NOT NULL", "gid")
    }

    async addPatientToGroup(pid, gid) {
        return await AdminModel.mysql.insert({ pid, eid: this.team, gid }, "pacientes")
    }

    async deletePatientToGroup(pid, gid) {
        const result = await AdminModel.mysql.find("SELECT `id` FROM `pacientes` WHERE `pid` = " + pid + " AND `eid` = " + this.team + " AND `gid` = " + gid)

        if (!result) return null

        for (const item of result) {
            await AdminModel.mysql.query("DELETE FROM `pacientes` WHERE `id` = " + item.id)
        }
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

    async getNotesFolders() {
        return await AdminModel.mysql.find("SELECT `id`,`icono`,`titulo`,`color` FROM `notas_carpetas`")
    }

    async createNotesFolder(data) {
        return await AdminModel.mysql.insert(data, "notas_carpetas")
    }

    async updateNoteFolder(id, data) {
        return await AdminModel.mysql.edit(data, { id }, "notas_carpetas")
    }

    async getNoteTemplate(id) {
        return await AdminModel.mongo.findOne({ _id: id }, "notas_plantillas")
    }

    async updateNoteTemplate(data) {
        return await AdminModel.mongo.edit({ _id: data._id }, data, "notas_plantillas")
    }

    async getNoteTemplates() {
        return await AdminModel.mongo.find({}, "notas_plantillas")
    }

    async createNoteTemplate(data) {
        return await AdminModel.mongo.insert(data, "notas_plantillas", { increment: true })
    }

    async deleteNoteTemplate(_id) {
        return await AdminModel.mongo.delete({ _id }, "notas_plantillas")
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

        let result = await AdminModel.mysql.findOne("SELECT * FROM `permisos` WHERE `aid` = " + this.id + " AND `eid` = " + this.team)

        if (!result) {
            await AdminModel.mysql.insert({ aid: this.id, eid: this.team }, "permisos")
            result = await AdminModel.mysql.findOne("SELECT * FROM `permisos` WHERE `aid` = " + this.id + " AND `eid` = " + this.team)
        }

        return new PermissionsModel(result)
    }
}

module.exports = AdminModel
