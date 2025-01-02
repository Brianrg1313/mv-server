const AppModel = require("package:/models/app")
const RecordModel = require("package:/models/record/record")

module.exports = async (context) => {
    const patient = context.session

    const app = new AppModel()
    const record = new RecordModel(patient.id)

    const variables = await app.getDictionary()
    const collections = await app.getCollection()
    const exceptions = await record.getExceptions()

    // Respuesta
    const response = {
        version: parseInt(process.env.DICTIONARY_VERSION),
        whatsapp: {
            contact: "584241892930"
        },
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

    // Se ordenan las variables
    for (const id in variables) {
        const item = []
        const exception = exceptions.get(parseInt(id)) ?? { v: 1, e: 1 }

        variables[id].titulo = variables[id][context.headers["accept-language"]]
        variables[id].subtitulo = variables[id]["sub" + context.headers["accept-language"]]
        variables[id].visible = exception.v
        variables[id].editable = exception.e

        for (const key of app.variables) {
            item.push(variables[id][key])
        }

        response.variables.valores.push(item)
    }

    return context.finish(response)
}
