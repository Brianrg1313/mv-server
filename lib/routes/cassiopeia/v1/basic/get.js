/**
 * Información básica del administrador
 * @param {Request} context
 * @returns
 */
module.exports = async (context) => {
    const admin = context.session

    const response = {
        version_diccionario: parseInt(process.env.DICTIONARY_VERSION),
        foto: null,
        lista_variables: null,
        datos_personales: null
    }

    response.lista_variables = await admin.variableList()
    response.datos_personales = await admin.personalData()

    return context.finish(response)
}
