const Mongo = require("package:/servers/mongo")
const MySql = require("package:/servers/mysql")
const Redis = require("package:/servers/redis")
const Databases = require("package:/models/databases")

const { weeks, calculateAge, capitalize, VARIABLES } = require("package:/helpers/tools")

class PatientListModel {
    static redis = new Redis()
    static adminDB = new MySql(Databases.mysql.admin)
    static patientDB = new MySql(Databases.mysql.patient)
    static mongo = new Mongo(Databases.mongo.patient)

    async myPatients(team, group) {
        let sql = "SELECT `pid` FROM `pacientes` WHERE `eid` = " + team

        if (group !== null) {
            sql += " AND `gid` IN (" + group.join(",") + ")"
        }

        const result = await PatientListModel.adminDB.find(`${sql} GROUP BY \`pid\``)

        if (!result) return null
        if (result.length === 0) return null

        const ids = [...new Set(result.map(item => parseInt(item.pid)))]

        const patients = await PatientListModel.patientDB.find("SELECT " + this.personalData.map(e => "`" + e + "`").join(",") + " FROM `usuarios` WHERE `estado` IS NULL AND `id` IN (" + ids.join(",") + ") ORDER BY `fecha_registro` DESC")

        if (!patients) return null
        if (patients.length === 0) return null

        return patients
    }

    async patientRow(patient, keys, map = false) {
        const today = new Date()
        const week = weeks(patient.fecha_inicio)
        const inCache = await this.inCache(patient.id)

        let patientData = {}

        if (inCache) {
            // No es necesario recuperar al paciente
            patientData = await this.getFromCache(patient.id)
        } else {
            // Se recuperan los datos del paciente y se ordenan
            const record = await this.patientRecord(patient.id)

            for (const key in patient) {
                const id = VARIABLES[key]

                patientData[id] = patient[key] ?? null
            }

            patientData[VARIABLES.nombre] = `${capitalize(patient.nombre)} ${capitalize(patient.apellido)}`

            // TODO: sin revisar
            if (Object.keys(record).length > 0) {
                for (const variable in record) {
                    if (variable === "_id") continue

                    if (record[variable]) {
                        if (record[variable][0]) {
                            patientData[variable] = record[variable][0].v
                        } else if (record[variable][week]) {
                            patientData[variable] = record[variable][week].v
                        }
                    }
                }
            }

            // this.saveInCache(patient.id, patientData, { ttl: today })
        }

        // VAR ID
        if (keys.includes(VARIABLES.edad)) {
            patientData[VARIABLES.edad] = calculateAge(today, new Date(patientData[VARIABLES.nacimiento]))
        }

        patientData[VARIABLES.semana] = week

        if (map) {
            return patientData
        }

        // Se ordenan todos los datos para la respuesta, eliminando las claves y ordenando los valores poscionalmente para que luego coincidan con las claves como en un CSV, esto ahorra los bytes de las claves en la respuesta
        const items = []

        for (const key of keys) {
            items.push(patientData[key] ?? null)
        }

        return items
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
        return ["id", "nombre", "apellido", "usuario", "dni", "correo", "telefono", "nacimiento", "sexo", "fecha_inicio"]
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
