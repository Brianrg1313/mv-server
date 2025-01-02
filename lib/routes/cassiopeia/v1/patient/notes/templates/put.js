const Validator = require("package:/helpers/validator")
const FastDataModel = require("package:/models/fast_data")

module.exports = async (context) => {
    // Verificar que el body de la petición no este vacío
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({
        ID: true,
        CARPETA: false,
        PRIVADO: false,
        COLOR: false
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Hubo un error al validar los datos"
        )
    }

    const data = validator.data
    const admin = context.session

    if (data.carpeta !== undefined) {
        if (`${data.carpeta}` === "1") {
            delete data.carpeta
        }
    }

    if (validator.leftovers.NOTA !== undefined && validator.leftovers.NOTA !== null) {
        data.nota = validator.leftovers.NOTA
    }

    const noteValidator = await admin.getNoteTemplate(data.id)

    if (!noteValidator) {
        return context.decline(51, 404, "Esta nota no existe o no está disponible")
    }

    for (const key in data) {
        if (key === "id") continue
        noteValidator[key] = data[key]
    }

    await admin.updateNoteTemplate(noteValidator)
    noteValidator.id = noteValidator._id
    delete noteValidator._id

    const fastData = new FastDataModel()

    noteValidator.administrador = await fastData.adminNames(noteValidator.administrador)

    return context.finish(noteValidator)
}
