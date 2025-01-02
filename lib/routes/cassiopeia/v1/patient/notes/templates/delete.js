const Validator = require("package:/helpers/validator")
const FastDataModel = require("package:/models/fast_data")

module.exports = async (context) => {
    // Verificar que el body de la petición no este vacío
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({ ID: true })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Hubo un error al validar los datos"
        )
    }

    const admin = context.session

    const noteValidator = await admin.getNoteTemplate(validator.data.id)

    if (!noteValidator) {
        return context.decline(51, 404, "Esta nota no existe o no está disponible")
    }

    admin.deleteNoteTemplate(noteValidator._id)

    return context.finish("")
}
