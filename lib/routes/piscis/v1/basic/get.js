const FilesModel = require("package:/models/files")

/**
 * Provee al cliente con los datos básicos del paciente, la información minima necesaria para el funcionamiento correcto de cualquier aplicación a excepción de los datos de ficha medica
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
        fotos: {
            inicial: null,
            actual: null,
            meta: null
        },
        datos_personales: null
    }

    const files = new FilesModel()

    response.datos_personales = await patient.personalData()

    const images = await files.profilePictures(patient.id, patient.currentWeek)

    // TODO: la forma en que se generan los path debe actualizarse cuando se actualice el sistema de cargar archivos

    if (images) {
        if (images.initial) {
            response.fotos.inicial = `https://assets.metodovargas.app/patient/${response.datos_personales.usuario}/timeline/${images.initial}`
        }
        if (images.current) {
            response.fotos.actual = `https://assets.metodovargas.app/patient/${response.datos_personales.usuario}/timeline/${images.current}`
        }
        if (images.goal) {
            response.fotos.meta = `https://assets.metodovargas.app/patient/${response.datos_personales.usuario}/timeline/${images.goal}`
        }
    }

    return context.finish(response)
}
