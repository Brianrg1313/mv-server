const Validator = require("package:/helpers/validator")
const DriveModel = require("package:/models/drive/drive")
const PatientModel = require("package:/models/patient/patient")

module.exports = async (context) => {
    // Verificar que el body de la petición no este vacío
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    validator.runMandatory({
        UUID: true,
        USUARIO: true
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Hubo un error al validar los datos"
        )
    }

    const patient = await PatientModel.fromUsername(validator.data.usuario)

    if (!patient) {
        return context.decline(36, 404, "Este paciente no existe o no está disponible")
    }

    const drive = new DriveModel()
    await drive.deleteFolder(patient.id, validator.data.uuid)

    return context.finish("")
}
