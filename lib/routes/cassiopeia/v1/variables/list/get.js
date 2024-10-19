const AppModel = require("package:/models/app")

module.exports = async (context) => {
    const admin = context.session

    const permissions = await admin.getPermissions()

    if (!permissions.variables.watch) {
        return context.decline(42, 403, "No tiene los permisos necesarios para ver la lista de variables")
    }

    const app = new AppModel()

    const lang = context.headers["accept-language"]

    const variables = await app.getAllVariables()
    const collections = await app.getAllCollections()

    const response = {
        colecciones: {
            claves: ["id", "es", "en", "icono", "posicion"],
            valores: []
        },
        variables: {
            placeholders: ["icono", lang, `sub${lang}`, "abreviacion", "bandera", "tipo", "formato", "coleccion"],
            claves: ["id", "icono", "es", "en", "subes", "suben", "bandera", "tipo", "formato", "coleccion", "abreviacion", "posicion"],
            valores: []
        }
    }

    for (const variable of variables) {
        const item = []
        for (const key of response.variables.claves) {
            item.push(variable[key])
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

    return context.finish(response)
}
