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
        datos_personales: null,
        colecciones: null
    }

    response.datos_personales = await patient.personalData()
    response.colecciones = await patient.getCollections()

    context.finish(response)
}
