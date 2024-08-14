const SessionModel = require("package:/models/session")
const Databases = require("package:/models/databases")
const MySql = require("package:/servers/mysql")
const Redis = require("package:/servers/redis")

class AdminModel {
    static session = new SessionModel()
    static mysql = new MySql(Databases.mysql.admin)
    static redis = new Redis()

    issetSession = false

    /**
     * Proporciona acceso a los datos y métodos del cliente
     * Normalmente este objeto se encuentra en context.session en los controladores
     * @param {Object} data datos del cliente
     */
    constructor(data) {
        this.id = data.id
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
        const data = await AdminModel.mysql.findOne("SELECT `id` FROM `administradores` WHERE `" + loggerKey + "` = '" + loggerValue + "'")

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

        const data = await AdminModel.mysql.findOne("SELECT `id`,`estado` FROM `administradores` WHERE `id` = " + aid)

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

    async resumeFromAID(id) {
        const response = {}
        response.names = await AdminModel.mysql.findOne("SELECT `nombre`,`apellido` FROM `administradores` WHERE `id` = " + id)

        response.profession = await AdminModel.mysql.findOne("SELECT `profesion` FROM `extras` WHERE `aid` = " + id, "profesion")

        return response
    }
}

module.exports = AdminModel
