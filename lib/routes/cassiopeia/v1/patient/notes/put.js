const Validator = require("package:/helpers/validator")
const FastDataModel = require("package:/models/fast_data")
const PatientModel = require("package:/models/patient/patient")

module.exports = async (context) => {
    // Verificar que el body de la petición no este vacío
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({
        ID: true,
        USUARIO: true,
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

    const username = validator.data.usuario
    delete validator.data.usuario

    const data = validator.data

    if (validator.leftovers.NOTA !== undefined && validator.leftovers.NOTA !== null) {
        data.nota = validator.leftovers.NOTA
    }

    const patient = await PatientModel.fromUsername(username)

    if (!patient) {
        return context.decline(36, 404, "Este paciente no existe o no está disponible")
    }

    const noteValidator = await patient.getNote(data.id)

    if (!noteValidator) {
        return context.decline(51, 404, "Esta nota no existe o no está disponible")
    }

    for (const key in data) {
        if (key === "id") continue
        noteValidator[key] = data[key]
    }

    await patient.updateNote(noteValidator)

    const fastData = new FastDataModel()
    noteValidator.administrador = await fastData.adminNames(noteValidator.administrador)
    noteValidator.id = noteValidator._id
    delete noteValidator._id

    return context.finish(noteValidator)
}
