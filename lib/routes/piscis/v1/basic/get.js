const AppModel = require("package:/models/app")
const RecordModel = require("package:/models/record")

/**
 * @param {Request} context
 */
module.exports = async (context) => {
    const patient = context.session

    if (!patient.issetSession) {
        return context.decline(24, 403, "No existe la sesión")
    }

    const response = {
        version_diccionario: parseInt(process.env.DICTIONARY_VERSION),
        semana_actual: patient.currentWeek,
        terminos: null,
        privacidad: null,
        datos_personales: null,
        record: null
    }

    const record = new RecordModel(patient.id)
    const app = new AppModel()

    response.datos_personales = await patient.personalData()
    response.record = await record.getRecord()

    const termsAndPrivacy = await app.termsPrivacy(patient.id)

    if (termsAndPrivacy?.terminos) {
        response.terminos = termsAndPrivacy?.terminos
    }

    if (termsAndPrivacy?.privacidad) {
        response.privacidad = termsAndPrivacy?.privacidad
    }

    return context.finish(response)
}
