const PatientListModel = require("package:/models/patient_list")

/**
 * Busca la lista de todos los pacientes disponibles
 * @param {Request} context
 */
module.exports = async (context) => {
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
    const division = 200
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

    const variablesOrder = ["-", ...variables]

    const values = []

    // El orden de las claves es importante ya que este determina el valor de los datos enviados al cliente asignados por posicionamiento de los valores
    // ejemplo:
    // ["id", "nombre", "apellido"]
    // [ 1  , "Brian" , "Rangel"  ]
    // TODO: Eliminar las variables escritas en texto
    const keys = [...patientList.personalData, "semana", ...variables]

    if (!keys.includes("edad")) {
        keys.push("edad")
    }

    // Se recuperan y ordenan los datos de los pacientes
    for (const patient of list.slice(min, max)) {
        const items = await patientList.patientRow(patient, keys)
        values.push(items)
    }

    // Respuesta
    const response = {
        pagina: page,
        paginas_totales: pages,
        pacientes_totales: list.length,
        inicial: min,
        final: max,
        columnas: variablesOrder,
        claves: keys,
        valores: values
    }

    return context.finish(response)
}
