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
        USUARIO: false,
        TITULO: false,
        COLOR: false
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Hubo un error al validar los datos"
        )
    }

    let id = "e" + context.session.team

    if (validator.data.usuario) {
        const patient = await PatientModel.fromUsername(validator.data.usuario)

        if (!patient) {
            return context.decline(36, 404, "Este paciente no existe o no está disponible")
        }

        id = patient.id
    }

    const drive = new DriveModel()
    const folder = await drive.editFolder(id, validator.data)

    if (!folder) {
        return context.decline(52, 404, "Esta carpeta no existe o no está disponible")
    }

    return context.finish("")
}
