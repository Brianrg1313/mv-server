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
        this.team = data.equipo
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
        const data = await AdminModel.mysql.findOne("SELECT `id`,`equipo`,`lista` FROM `administradores` WHERE `" + loggerKey + "` = '" + loggerValue + "'")

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

        const data = await AdminModel.mysql.findOne("SELECT `id`,`estado`,`equipo`,`lista` FROM `administradores` WHERE `id` = " + aid)

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

    async variableList() {
        const result = await AdminModel.mongo.findOne({ _id: this.list }, "lista_variables")

        if (!result) return null

        delete result._id
        const entries = Object.entries(result)
        entries.sort((a, b) => a[1] - b[1])

        const response = entries.map(entry => entry[0])

        return response
    }

    async groupList() {
        const result = await AdminModel.mysql.find("SELECT `gid` FROM `grupos_administradores` WHERE `aid` = " + this.id)

        if (!result) return null
        if (result.length === 0) return null

        return result
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
        const result = await AdminModel.mysql.find("SELECT `nombre`,`apellido`,`correo`,`usuario`,`sexo`,`lista` FROM `administradores` WHERE `equipo` = " + this.team + " AND `estado` IS NULL")

        if (!result) return null

        return result
    }

    async createPatient(uid) {
        await AdminModel.mysql.insert({ pid: uid, eid: this.team }, "pacientes")
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
