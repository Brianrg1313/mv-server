const PatientListModel = require("package:/models/patient_list")

const { weeks } = require("package:/helpers/tools")

/**
 * Busca la lista de todos los pacientes disponibles
 * @param {Request} context
 */
module.exports = async (context) => {
    const today = new Date()
    const admin = context.session
    const patientList = new PatientListModel()

    const groups = await admin.groupList()

    const variables = await admin.variableList()
    const list = await patientList.myPatients(admin.team, groups)

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
        min = 0
    }

    const values = []

    // El orden de las claves es importante ya que este determina el valor de los datos enviados al cliente asignados por posicionamiento de los valores
    // ejemplo:
    // ["id", "nombre", "apellido"]
    // [ 1  , "Brian" , "Rangel"  ]
    const keys = [...patientList.personalData, "edad", ...variables]

    // Se recuperan y ordenan los datos de los pacientes
    for (const patient of list.slice(min, max)) {
        const week = weeks(patient.fecha_inicio)
        const inCache = await patientList.inCache(patient.id)
        let patientData = {}

        if (inCache) {
            // No es necesario recuperar al paciente
            patientData = await patientList.getFromCache(patient.id)
        } else {
            // Se recuperan los datos del paciente y se ordenan
            const record = await patientList.patientRecord(patient.id)

            for (const key in patient) {
                patientData[key] = patient[key] ?? null
            }

            if (Object.keys(record).length > 0) {
                for (const variable in record) {
                    if (variable === "_id") continue

                    if (record[variable][week]) {
                        patientData[variable] = record[variable][week].v
                    }
                }
            }

            patientList.saveInCache(patient.id, patientData)
        }

        patientData.edad = calculateAge(today, new Date(patientData.nacimiento))

        // Se ordenan todos los datos para la respuesta, eliminando las claves y ordenando los valores poscionalmente para que luego coincidan con las claves como en un CSV, esto ahorra los bytes de las claves en la respuesta
        const items = []

        for (const key of keys) {
            items.push(patientData[key])
        }

        values.push(items)
    }

    // Respuesta
    const response = {
        pagina: page,
        paginas_totales: pages,
        pacientes_totales: list.length,
        inicial: min,
        final: max,
        claves: keys,
        valores: values
    }

    return context.finish(response)
}

function calculateAge(today, birthday) {
    let age = today.getFullYear() - birthday.getFullYear()
    const birthMonth = birthday.getMonth()
    const currentMonth = today.getMonth()

    if (currentMonth < birthMonth || (currentMonth === birthMonth && today.getDate() < birthday.getDate())) {
        age--
    }

    return age
}
