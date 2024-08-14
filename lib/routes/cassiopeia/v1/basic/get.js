module.exports = (context) => {
    const admin = context.session

    const response = {
        version_diccionario: parseInt(process.env.DICTIONARY_VERSION),
        semana_actual: admin.currentWeek,
        fotos: {
            inicial: null,
            actual: null,
            meta: null
        },
        datos_personales: null
    }

    return context.finish(response)
}
