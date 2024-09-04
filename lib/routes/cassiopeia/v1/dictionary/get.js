const AppModel = require("package:/models/app")

module.exports = async (context) => {
    const admin = context.session
    const app = new AppModel()

    const variables = await app.getDictionary()
    const collections = await app.getCollection()
    const restrictions = await admin.getRestrictions()

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

    return context.finish(response)
}
