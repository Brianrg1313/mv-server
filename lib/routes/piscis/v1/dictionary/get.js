const AppModel = require("package:/models/app")

module.exports = async (context) => {
    const app = new AppModel()

    const variables = await app.getDictionary(context.headers["accept-language"])
    const collections = await app.getCollection(context.headers["accept-language"])

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
    for (const item of collections) {
        const collection = []

        for (const key of app.collections) {
            collection.push(item[key])
        }

        response.colecciones.valores.push(collection)
    }

    // Se ordenan las variables
    for (const item of variables) {
        const variable = []

        for (const key of app.variables) {
            variable.push(item[key])
        }

        response.variables.valores.push(variable)
    }

    return context.finish(response)
}
