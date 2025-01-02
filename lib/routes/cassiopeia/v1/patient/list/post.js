const Validator = require("package:/helpers/validator")
const PatientListModel = require("package:/models/patient_list")

const { paginate } = require("./filters")
const { VARIABLES } = require("package:/helpers/tools")

/**
 * Busca la lista de todos los pacientes disponibles
 * @param {Request} context
 */
module.exports = async (context) => {
    const admin = context.session

    const permissions = await admin.getPermissions()

    if (!permissions.patientList.watch) {
        return context.decline(42, 403, "No se encontraron permisos para el administrador")
    }

    const patientList = new PatientListModel()

    const groups = await admin.groupList()
    const variables = await admin.variableList()

    let list = await patientList.myPatients(admin.team, groups)

    const validator = new Validator(context.body)

    validator.runMandatory({
        PAGINA: false,
        TEXTO: false,
        F_NUMERO: false,
        SEXO: false,
        VARIABLE: false,
        VARIABLE_VALOR: false,
        OPERADOR: false
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Los datos del filtro son inválidos"
        )
    }

    const filter = validator.data

    // filtros complejos
    if (filter.texto) {
        list = require("./filters").filterByText(list, filter.texto)
    }

    if (filter.sexo) {
        list = require("./filters").filterBySexo(list, filter.sexo)
    }

    if (filter.f_numero) {
        list = require("./filters").filterByNumber(list, filter.f_numero)
    }

    if (!list) return context.finish(null)

    // El orden de las claves es importante ya que este determina el valor de los datos enviados al cliente asignados por posicionamiento de los valores
    // ejemplo:
    // ["id", "nombre", "apellido"]
    // [ 1  , "Brian" , "Rangel"  ]
    const keys = [
        VARIABLES.nombre,
        VARIABLES.usuario,
        VARIABLES.edad,
        VARIABLES.semana,
        ...variables
    ]

    /// Datos de los pacientes que se enviarán al cliente ordenados por [keys]
    const values = []

    /// Datos para la paginación
    let pages, min, max, page

    /// Filtros dinámicos
    if (filter.variable) {
        if (filter.value == null || filter.value === "" || filter.value === undefined) {
            return context.decline(50, 404, "No se ha indicado el valor de la variable")
        }

        if (!keys.includes(filter.variable)) {
            keys.push(filter.variable)
        }

        if (!filter.operator) {
            filter.operator = 2
        }

        const OPERADORES = require("./filters").OPERADORES

        const newList = []

        for (const patient of list) {
            const result = await patientList.patientRow(patient, keys, true)

            if (!result) continue
            if (!result[filter.variable]) {
                if (filter.value !== 0) continue
            }

            const a = `${result[filter.variable] ?? 0}`
            const b = `${filter.value}`

            const expression = `${a} ${OPERADORES[filter.operator]} ${b}`

            // eslint-disable-next-line no-new-func
            const operation = new Function(`return ${expression}`)()

            if (operation) {
                const items = []
                for (const key of keys) {
                    items.push(result[key])
                }
                newList.push(items)
            }
        }

        // Division de los pacientes por páginas
        [pages, min, max, page] = paginate(newList, filter.page ?? 1)

        for (const patient of newList.slice(min, max)) {
            values.push(patient)
        }
    } else {
        // Division de los pacientes por páginas
        [pages, min, max, page] = paginate(list, filter.page ?? 1)

        // Se recuperan y ordenan los datos de los pacientes
        for (const patient of list.slice(min, max)) {
            const items = await patientList.patientRow(patient, keys)
            values.push(items)
        }
    }

    // Respuesta
    const response = {
        pagina: page,
        lista: admin.list,
        paginas_totales: pages,
        pacientes_totales: list.length,
        inicial: min,
        final: max,
        columnas: variables,
        claves: keys,
        valores: values
    }

    return context.finish(response)
}
