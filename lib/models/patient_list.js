const Mongo = require("package:/servers/mongo")
const MySql = require("package:/servers/mysql")
const Redis = require("package:/servers/redis")
const Databases = require("package:/models/databases")

class PatientListModel {
    static redis = new Redis()
    static adminDB = new MySql(Databases.mysql.admin)
    static patientDB = new MySql(Databases.mysql.patient)
    static mongo = new Mongo(Databases.mongo.patient)

    /**
     * Busca a todos los pacientes que son visibles para el administrador
     * @param {int} aid ID del administrador
     * @param {int} team Equipo/unidad del administrador
     * @param {Array<int>} group Listas de pacientes a las que pertenece el administrador
     * @returns {Promise<Array<Object>>} Lista de pacientes
     */
    async myPatients(team, group) {
        let sql = "SELECT `pid` FROM `pacientes` WHERE `eid` = " + team

        if (group !== null) {
            sql += " AND `gid` IN (" + group.join(",") + ")"
        }

        const result = await PatientListModel.adminDB.find(`${sql}  GROUP BY \`pid\``)

        if (!result) return null
        if (result.length === 0) return null

        const ids = [...new Set(result.map(item => parseInt(item.pid)))]

        const patients = await PatientListModel.patientDB.find("SELECT " + this.personalData.map(e => "`" + e + "`").join(",") + " FROM `usuarios` WHERE `estado` IS NULL AND `id` IN (" + ids.join(",") + ") ORDER BY `fecha_inicio` DESC")

        if (!patients) return null
        if (patients.length === 0) return null

        return patients
    }

    async patientRecord(pid) {
        const response = await PatientListModel.mongo.findOne({ _id: pid }, "ficha")

        if (!response) return {}

        delete response._id

        return response
    }

    async saveInCache(pid, data) {
        await PatientListModel.redis.insertInHash("patient_list", `${pid}`, data)
    }

    async inCache(pid) {
        return await PatientListModel.redis.issetInHash("patient_list", `${pid}`)
    }

    async getFromCache(pid) {
        return await PatientListModel.redis.findInHash("patient_list", `${pid}`)
    }

    get personalData() {
        return ["id", "nombre", "apellido", "usuario", "telefono", "nacimiento", "sexo", "fecha_inicio"]
    }

    async patientData(pid) {
        const response = await PatientListModel.patientDB.findOne("SELECT " + this.personalData.map(e => "`" + e + "`").join(",") + " FROM `usuarios` WHERE `id` = " + pid)

        if (!response) return null

        return response
    }

    async removeFromCache(pid) {
        if (await PatientListModel.redis.issetInHash("patient_list", `${pid}`)) {
            await PatientListModel.redis.deleteInHash("patient_list", `${pid}`)
        }
    }
}

module.exports = PatientListModel
