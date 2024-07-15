const AppModel = require("package:/models/app")
const RecordModel = require("package:/models/record")

/**
 * Provee al cliente con los datos de la ficha medica
 * @param {Request} context
 */
module.exports = async (context) => {
    const patient = context.session

    const app = new AppModel()
    const record = new RecordModel(patient.id)

    const data = await record.getAllRecord()
    const goals = await record.getAllGoals()

    const variables = await app.getDictionary(context.headers["accept-language"])
    const keys = {}

    for (const item of variables) {
        keys[item.id] = item.variable
    }

    const goalsOrder = {}
    const recordOrder = {}

    // Se ordenan las metas y se eliminan los datos innecesarios
    for (const key in goals) {
        if (goals[key].s && goals[key].m) {
            const newKey = keys[key]
            goalsOrder[newKey] = {}

            goalsOrder[newKey].semana = goals[key].s
            goalsOrder[newKey].meta = goals[key].m
        }
    }

    // Se ordenan los datos de la ficha medica y se eliminan los datos innecesarios
    for (const key in data) {
        const newKey = keys[key]
        recordOrder[newKey] = {}

        for (const week in data[key]) {
            const value = data[key][week]
            recordOrder[newKey][week] = value.v
        }
    }

    return context.finish({
        semana: patient.currentWeek,
        metas: goalsOrder,
        datos: recordOrder
    })
}
