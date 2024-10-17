const AppModel = require("package:/models/app")

module.exports = async (context) => {
    const admin = context.session
    const app = new AppModel()

    const variables = await app.getDictionary()
    const collections = await app.getCollection()
    const restrictions = await admin.getRestrictions()

    const keys = {
        placeholder: "titulo",
        resource: "recurso",
        value: "valor",
        min: "minimo",
        max: "maximo"
    }

    // Respuesta
    const response = {
        version: parseInt(process.env.DICTIONARY_VERSION),
        colecciones: {
            claves: app.collections,
            valores: []
        },
        variables: {
            claves: app.variables,
            valores: []
        },
        opciones: {
            claves: Object.keys(keys),
            telefono: [],
            dni: []
        }
    }

    // Se ordenan las colecciones
    for (const index in collections) {
        const item = []

        collections[index].titulo = collections[index][context.headers["accept-language"]]

        for (const key of app.collections) {
            item.push(collections[index][key])
        }

        response.colecciones.valores.push(item)
    }

    for (const key in restrictions) {
        variables[key].visible = restrictions[key].v
        variables[key].editable = restrictions[key].e
    }

    // Se ordenan las variables
    for (const id in variables) {
        const item = []

        variables[id].titulo = variables[id][context.headers["accept-language"]]
        variables[id].subtitulo = variables[id]["sub" + context.headers["accept-language"]]

        for (const key of app.variables) {
            item.push(variables[id][key])
        }

        response.variables.valores.push(item)
    }

    // Modelo para validar los números de teléfonos disponibles
    const telefono = await app.getTelephone(context.headers["accept-language"])

    for (const items of telefono) {
        const item = []
        for (const k of Object.values(keys)) {
            item.push(items[k])
        }
        response.opciones.telefono.push(item)
    }

    // Modelo para validar los números de DNI disponibles
    const dni = await app.getDNI(context.headers["accept-language"])

    for (const items of dni) {
        const item = []
        for (const k of Object.values(keys)) {
            item.push(items[k])
        }
        response.opciones.dni.push(item)
    }

    return context.finish(response)
}
