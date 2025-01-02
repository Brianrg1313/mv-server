const Validator = require("package:/helpers/validator")
const PatientModel = require("package:/models/patient/patient")

module.exports = async (context) => {
    // Verificar que el body de la petición no este vacío
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({ ID: true, USUARIO: true })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Hubo un error al validar los datos"
        )
    }

    const id = validator.data.id
    const username = validator.data.usuario

    const patient = await PatientModel.fromUsername(username)

    if (!patient) {
        return context.decline(36, 404, "Este paciente no existe o no está disponible")
    }

    const noteValidator = await patient.getNote(id)

    if (!noteValidator) {
        return context.decline(51, 404, "Esta nota no existe o no está disponible")
    }

    await patient.deleteNote(id)

    return context.finish("")
}
