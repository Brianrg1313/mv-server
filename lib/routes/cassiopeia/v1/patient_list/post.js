const PatientListModel = require("package:/models/patient_list")

const { weeks } = require("package:/helpers/tools")

/**
 * Busca la lista de todos los pacientes disponibles
 * @param {Request} context
 */
module.exports = async (context) => {
    const admin = context.session
    const patientList = new PatientListModel()

    const groups = await admin.groupList()
    const variables = await admin.variableList()
    const list = await patientList.myPatients(admin.id, admin.team, groups)

    if (!list) {
        return context.finish(null)
    }

    // Division de los pacientes por páginas
    let page = parseInt(context.params.page ?? "1")

    if (Number.isNaN(page)) {
        page = 1
    }
    const division = 50
    const pages = Math.ceil(list.length / division)

    if (page > pages) {
        page = pages
    }

    let min = (page - 1) * division
    let max = min + division

    if (max > list.length) {
        max = list.length
    }

    if (min > list.length) {
        min = list.length - division
    }

    if (min < 1) {
        min = 1
    }

    const patients = []

    // Se recuperan y ordenan los datos de los pacientes
    for (const patient of list) {
        const week = weeks(patient.fecha_inicio)
        const inCache = false
        const patientData = {}

        if (inCache) {
            console.log("REDIS")
        } else {
            const record = await patientList.patientRecord(patient.id)

            for (const key in patient) {
                patientData[key] = patient[key]
            }

            if (Object.keys(record).length > 0) {
                for (const variable in record) {
                    if (variable === "_id") continue

                    if (record[variable][week]) {
                        patientData[variable] = record[variable][week].v
                    }
                }
            }
        }1

        const items = [
            week,
            patientData.nombre,
            patientData.apellido,
            patientData.usuario,
            patientData.telefono,
            patientData.nacimiento,
            patientData.sexo
        ]

        for (const variable of variables) {
            if (patientData[variable]) {
                items.push(patientData[variable])
            } else {
                items.push(null)
            }
        }

        patients.push(items)
    }

    return context.finish(patients)
}
