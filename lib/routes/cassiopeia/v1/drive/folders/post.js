const Validator = require("package:/helpers/validator")
const DriveModel = require("package:/models/drive/drive")
const FastDataModel = require("package:/models/fast_data")
const PatientModel = require("package:/models/patient/patient")

module.exports = async (context) => {
    // Verificar que el body de la petición no este vacío
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    validator.runMandatory({
        USUARIO: false,
        TITULO: true,
        COLOR: true
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

    validator.data.admin = context.session.id

    const drive = new DriveModel()
    const fastData = new FastDataModel()

    const folder = await drive.createNewFolder(id, validator.data)

    let admin = null
    if (folder.a) {
        admin = await fastData.adminNames(folder.a)
    }

    return context.finish({
        id: folder.id,
        titulo: folder.t,
        color: folder.c,
        creador: admin,
        fecha: folder.f
    })
}
