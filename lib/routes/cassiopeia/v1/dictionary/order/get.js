const AppModel = require("package:/models/app")

const { intToAbc } = require("package:/helpers/tools")

module.exports = async (context) => {
    const admin = context.session
    const app = new AppModel()

    const variables = await app.getDictionary()
    const collections = await app.getCollection()
    const restrictions = await admin.getRestrictions()

    const lang = context.headers["accept-language"]

    const keys = {
        placeholder: "titulo",
        resource: "recurso",
        value: "valor",
        min: "minimo",
        max: "maximo"
    }

    // Respuesta
    const response = {
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

        collections[index].titulo = collections[index][lang]

        for (const key of app.collections) {
            item.push(collections[index][key])
        }

        response.colecciones.valores.push(item)
    }

    for (const key in restrictions) {
        if (!variables[key]) continue

        variables[key].visible = restrictions[key].v
        variables[key].editable = restrictions[key].e
    }

    // Se ordenan las variables
    for (const id in variables) {
        const item = []

        variables[id].titulo = variables[id][lang]
        variables[id].subtitulo = variables[id]["sub" + lang]

        for (const key of app.variables) {
            if (key === "abreviacion") {
                item.push(intToAbc(variables[id][key]))
            } else {
                item.push(variables[id][key])
            }
        }

        response.variables.valores.push(item)
    }

    // Modelo para validar los números de teléfonos disponibles
    const telefono = await app.getTelephone(lang)

    for (const items of telefono) {
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
