const RecordModel = require("package:/models/record")
const AppModel = require("package:/models/app")

/**
 * Provee al cliente con los datos de la ficha medica
 * @param {Request} context
 */
module.exports = async (context) => {
    const patient = context.session

    const app = new AppModel()
    const record = new RecordModel(patient.id)

    const data = await record.getAllRecord()

    const variables = await app.getDictionary(context.headers["accept-language"])
    const keys = {}

    for (const item of variables) {
        keys[item.id] = item.variable
    }

    const response = {}

    for (const key in data) {
        const newKey = keys[key]
        response[newKey] = {}

        for (const week in data[key]) {
            const value = data[key][week]
            response[newKey][week] = value.v
        }
    }

    return context.finish({
        semana: patient.currentWeek,
        datos: response
    })
}
