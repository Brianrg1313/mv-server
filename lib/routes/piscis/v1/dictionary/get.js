const Databases = require("package:/models/databases")
const AppModel = require("package:/models/app")
const Redis = require("package:/servers/redis")

module.exports = async (context) => {
    const app = new AppModel()

    const redis = new Redis()

    let variables = null
    let collections = null

    if (await redis.issetInHash(Databases.redis.app, "variables")) {
        variables = await redis.findInHash(Databases.redis.app, "variables")
    } else {
        variables = await app.getDictionary(context.headers["accept-language"])
        redis.insertInHash(Databases.redis.app, "variables", variables)
    }

    if (await redis.issetInHash(Databases.redis.app, "collections")) {
        collections = await redis.findInHash(Databases.redis.app, "collections")
    } else {
        collections = await app.getCollection(context.headers["accept-language"])
        redis.insertInHash(Databases.redis.app, "collections", collections)
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
