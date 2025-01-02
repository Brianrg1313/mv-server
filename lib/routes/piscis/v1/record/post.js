const AppModel = require("package:/models/app")
const Validator = require("package:/helpers/validator")
const RecordModel = require("package:/models/record/record")

/**
 * El cliente modifica los datos de la ficha medica
 * @param {Request} context
 */
module.exports = async (context) => {
    const patient = context.session

    // Verificar que el body de la petición no este vació
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    // Ya que las variables de la ficha medica son dinámicas y auto generadas sus datos para ser validadas están guardadas en una base de datos
    const app = new AppModel()
    const varsToValidate = await app.getVarsValidator(Object.keys(context.body), context.headers["accept-language"])

    // Se validan los datos
    const validator = new Validator(context.body)

    if (context.body.SEMANA) {
        varsToValidate.SEMANA = null
    }

    // TODO: cambio el funcionamiento ahora valida variables {"CLAVE": REGLAS{}} ADAPTAR
    validator.runWithoutRules(varsToValidate)

    if (!validator.status) {
        // TODO: agregar la variable que fallo
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Hubo un error al validar los datos"
        )
    }

    const data = validator.data

    let week = patient.currentWeek

    if (data.semana) {
        week = data.semana
        delete data.semana
    }

    const record = new RecordModel(patient.id)

    // Ingresa los datos en la ficha medica
    const result = await record.update(data, week)

    const response = {}

    if (result) {
        for (const key in result) {
            if (key === "_id") continue

            response[key] = {}

            for (const week in result[key]) {
                response[key][week] = result[key][week].v
            }
        }
    }

    // TODO: Eliminar datos de la lista de pacientes del redis
    return context.finish(response)
}
