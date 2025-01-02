const MySql = require("package:/servers/mysql")
const Mongo = require("package:/servers/mongo")
const Databases = require("package:/models/databases")
const SessionModel = require("package:/models/session")

const { weeks } = require("package:/helpers/tools")

class PatientModel {
    static session = new SessionModel()
    static mysql = new MySql(Databases.mysql.patient)
    static mongo = new Mongo(Databases.mongo.patient)

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
    }

    static basicData = "`id`, `estado`, `fecha_inicio`"

    /**
     * Recupera la sesión del cliente usando un autentificado
     * @param {String} loggerKey El tipo de autentificador para buscar la cuenta del cliente
     * @param {String} loggerValue El autentificador del cliente
     * @returns {Promise<PatientModel>||boolean}
     */
    static async fromAuthenticator(loggerKey, loggerValue) {
        const data = await PatientModel.mysql.findOne("SELECT " + PatientModel.basicData + " FROM `usuarios` WHERE `" + loggerKey + "` = '" + loggerValue + "'")

        if (!data) {
            this.issetSession = false
            return this.issetSession
        }

        return new PatientModel(data)
    }

    /**
     * @param {String} accs Token de acceso
     * @returns {Promise<number>} Identificador del usuario
     */
    static async fromAccess(accs) {
        // el parámetro 1 indica que el usuario es paciente
        const uid = await PatientModel.session.UidFromAccess(accs, 1)

        if (!uid) {
            this.issetSession = false
            return this.issetSession
        }

        const data = await PatientModel.mysql.findOne("SELECT " + PatientModel.basicData + " FROM `usuarios` WHERE `id` = " + uid)

        if (!data) {
            this.issetSession = false
            return this.issetSession
        }

        return new PatientModel(data)
    }

    static async fromUsername(username) {
        const data = await PatientModel.mysql.findOne("SELECT " + PatientModel.basicData + " FROM `usuarios` WHERE `usuario` = '" + username + "' AND `estado` IS NULL")

        if (!data) return null

        return new PatientModel(data)
    }

    static async validateIdentity(dni, email, username, smartphone) {
        const dniV = await PatientModel.mysql.findOne("SELECT `id` FROM `usuarios` WHERE `dni` = '" + dni + "'")
        if (dniV) return 41

        const emailV = await PatientModel.mysql.findOne("SELECT `id` FROM `usuarios` WHERE `correo` = '" + email + "'")
        if (emailV) return 39

        const usernameV = await PatientModel.mysql.findOne("SELECT `id` FROM `usuarios` WHERE `usuario` = '" + username + "'")
        if (usernameV) return 38

        const smartphoneV = await PatientModel.mysql.findOne("SELECT `id` FROM `usuarios` WHERE `telefono` = '" + smartphone + "'")
        if (smartphoneV) return 40

        return false
    }

    /**
     * Crea un nuevo paciente y devuelve un paciente
     * @param {Object} personalData Datos perosnales del paciente
     * @param {Object} extraData Datos extras del paciente
     * @returns {Promise<PatientModel>}
     */
    static async createPatient(personalData) {
        const order = require("./variables_by_table.json")

        let uid = null

        for (const table in order) {
            const insert = {}

            for (const key of order[table]) {
                if (personalData[key] !== null && personalData[key] !== undefined) {
                    insert[key] = personalData[key]
                }
            }

            if (Object.keys(insert).length === 0) continue

            if (table === "usuarios") {
                uid = await PatientModel.mysql.insert(insert, table)
            } else if (uid !== null) {
                insert.uid = uid
                await PatientModel.mysql.insert(insert, table)
            }
        }

        personalData.id = uid

        return new PatientModel(personalData)
    }

    /**
     * @param {Number} uid ID del usuario
     * @returns {Promise<String>} Ultima contraseña valida almacenada
     */
    async findPassword(uid = this.id) {
        return await PatientModel.mysql.findOne("SELECT * FROM `contrasenas` WHERE `uid` = " + uid + " AND `estado` IS NULL ORDER BY `fecha` DESC")
    }

    async personalData() {
        const data = await Promise.all([
            // Usuarios
            PatientModel.mysql.findOne("SELECT `nombre`,`apellido`,`correo`,`usuario`,`telefono`,`tdni`,`dni`,`nacimiento`,`sexo`,`estado`,`fecha_inicio` FROM `usuarios` WHERE `id` = " + this.id),
            // Complementarios
            PatientModel.mysql.findOne("SELECT `talla`,`pais`,`ciudad`,`parroquia`,`coordenadas`,`profesion`,`terminos` FROM `complementarios` WHERE `uid` = " + this.id)
        ], 1)

        const result = {}

        for (const item of data) {
            if (item) {
                Object.assign(result, item)
            }
        }

        return result
    }

    async update(data) {
        PatientModel.mysql.edit(data, { id: this.id }, "usuarios")
    }

    async updateTerms() {
        return await PatientModel.mysql.edit({ terminos: 1 }, { uid: this.id }, "complementarios")
    }

    async addNote(note) {
        return await PatientModel.mongo.insert(note, "notas", { increment: true })
    }

    async getNote(id) {
        return await PatientModel.mongo.findOne({ pid: this.id, _id: id }, "notas")
    }

    async getNotes() {
        return await PatientModel.mongo.find({ pid: this.id }, "notas")
    }

    async updateNote(note) {
        return await PatientModel.mongo.edit({ _id: note._id }, note, "notas")
    }

    async deleteNote(_id) {
        return await PatientModel.mongo.delete({ _id }, "notas")
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

module.exports = PatientModel
