const SessionModel = require("package:/models/session")
const RecordModel = require("package:/models/record")
const Databases = require("package:/models/databases")
const MySql = require("package:/servers/mysql")

const { weeks } = require("package:/helpers/tools")

class ClientModel {
    static session = new SessionModel()
    static mysql = new MySql(Databases.mysql.patient)

    issetSession = false

    /**
     * Proporciona acceso a los datos y métodos del cliente
     * Normalmente este objeto se encuentra en context.session en los controladores
     * @param {*} data datos del cliente
     */
    constructor(data) {
        this.id = data.id
        this.issetSession = true
        this.estado = data.estado
        this.fechaInicio = data.fecha_inicio
        this.currentWeek = weeks(this.fechaInicio)
        this.record = new RecordModel(this.id)
    }

    /**
     * Recupera la sesión del cliente usando un autentificado
     * @param {String} loggerKey El tipo de autentificador para buscar la cuenta del cliente
     * @param {String} loggerValue El autentificador del cliente
     * @returns {Promise<ClientModel>||boolean}
     */
    static async fromAuthenticator(loggerKey, loggerValue) {
        const data = await ClientModel.mysql.findOne("SELECT `id`,`estado`,`fecha_inicio` FROM `usuarios` WHERE `" + loggerKey + "` = '" + loggerValue + "'")

        if (!data) {
            this.issetSession = false
            return this.issetSession
        }

        return new ClientModel(data)
    }

    static async fromAccess(accs) {
        const uid = await ClientModel.session.UidFromAccess(accs)

        if (!uid) {
            this.issetSession = false
            return this.issetSession
        }

        const data = await ClientModel.mysql.findOne("SELECT `id`,`estado`,`fecha_inicio` FROM `usuarios` WHERE `id` = " + uid)

        if (!data) {
            this.issetSession = false
            return this.issetSession
        }

        return new ClientModel(data)
    }

    /**
     * @param {Number} uid ID del usuario
     * @returns {Promise<String>} Ultima contraseña valida almacenada
     */
    async findPassword(uid = this.id) {
        return await ClientModel.mysql.findOne("SELECT * FROM `contrasenas` WHERE `uid` = " + uid + " AND `estado` IS NULL ORDER BY `fecha` DESC")
    }

    async personalData() {
        const data = await Promise.all([
            // Usuarios
            ClientModel.mysql.findOne("SELECT `nombre`,`apellido`,`correo`,`usuario`,`telefono`,`tdni`,`dni`,`nacimiento`,`sexo`,`estado`,`fecha_inicio` FROM `usuarios` WHERE `id` = " + this.id),
            // Complementarios
            ClientModel.mysql.findOne("SELECT `pais`,`ciudad`,`parroquia`,`coordenadas`,`profesion`,`sangre` FROM `complementarios` WHERE `uid` = " + this.id)
        ], 1)

        const result = {}

        for (const item of data) {
            if (item) {
                Object.assign(result, item)
            }
        }

        return result
    }

    get restriction() {
        if (this.estado == null) {
            // Estado valido
            return false
        } else {
            // Paciente eliminado
            return true
        }
    }
}

module.exports = ClientModel
