const RecordModel = require("package:/models/record/record")

/**
 * Provee al cliente con los datos de la ficha medica
 * @param {Request} context
 */
module.exports = async (context) => {
    const patient = context.session
    const record = new RecordModel(patient.id)

    const data = await record.getAllRecord()
    const goals = await record.getAllGoals()
    const weeklyFlaws = await record.getWeeklyFlaws(patient.currentWeek)

    const goalsOrder = {}
    const recordOrder = {}

    // Se ordenan las metas y se eliminan los datos innecesarios
    for (const key in goals) {
        if (goals[key].s && goals[key].m) {
            goalsOrder[key] = [goals[key].s, goals[key].m]
        }
    }

    // Se ordenan los datos de la ficha medica y se eliminan los datos innecesarios
    for (const key in data) {
        recordOrder[key] = {}

        for (const week in data[key]) {
            recordOrder[key][week] = data[key][week].v
        }
    }

    // TODO: fotos please
    return context.finish({
        semana: patient.currentWeek,
        metas: goalsOrder,
        datos: recordOrder,
        defectos: weeklyFlaws
    })
}
