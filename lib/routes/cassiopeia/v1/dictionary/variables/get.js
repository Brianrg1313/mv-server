const AppModel = require("package:/models/app")

const { intToAbc } = require("package:/helpers/tools")

/**
 * Devuelve todo el diccionario
 * @param {Request} context
 */
module.exports = async (context) => {
    const admin = context.session

    const permissions = await admin.getPermissions()

    if (!permissions.variables.watch) {
        return context.decline(42, 403, "No tiene los permisos necesarios para ver la lista de variables")
    }

    const app = new AppModel()

    const lang = context.headers["accept-language"]

    const keys = {
        placeholder: "titulo",
        resource: "recurso",
        value: "valor",
        min: "minimo",
        max: "maximo"
    }

    const variables = await app.getAllVariables(lang)
    const collections = await app.getAllCollections(lang)

    const response = {
        colecciones: {
            claves: ["id", "titulo", "icono", "posicion"],
            valores: []
        },
        variables: {
            claves: ["id", "icono", "titulo", "subtitulo", "bandera", "tipo", "formato", "editable", "referencia", "coleccion", "abreviacion", "posicion"],
            valores: []
        },
        opciones: {
            claves: Object.keys(keys),
            telefono: [],
            dni: []
        }
    }

    for (const variable of variables) {
        const item = []
        for (const key of response.variables.claves) {
            if (key === "abreviacion") {
                item.push(intToAbc(variable[key]))
            } else {
                item.push(variable[key])
            }
        }
        response.variables.valores.push(item)
    }

    for (const collection of collections) {
        const item = []
        for (const key of response.colecciones.claves) {
            item.push(collection[key])
        }
        response.colecciones.valores.push(item)
    }

    // Modelo para validar los números de teléfonos disponibles
    const telephone = await app.getTelephone(lang)

    for (const items of telephone) {
        const item = []
        for (const k of Object.values(keys)) {
            item.push(items[k])
        }
        response.opciones.telefono.push(item)
    }

    // Modelo para validar los números de DNI disponibles
    const dni = await app.getDNI(lang)

    for (const items of dni) {
        const item = []
        for (const k of Object.values(keys)) {
            item.push(items[k])
        }
        response.opciones.dni.push(item)
    }

    return context.finish(response)
}
