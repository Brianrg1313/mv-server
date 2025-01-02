const fs = require("fs")
const Validator = require("package:/helpers/validator")
const DriveModel = require("package:/models/drive/drive")

const fileType = require("file-type")

module.exports = async (context) => {
    if (!context.file) {
        return context.decline(56, 400, "El archivo no esta enviado")
    }

    const type = await fileType.fromBuffer(context.file.buffer)

    if (!type || !["image/jpeg", "image/png", "image/gif"].includes(type.mime)) {
        return context.decline(57, 400, "El archivo no es una imagen")
    }

    const temp = `${process.env.TEMP_ASSETS}/${context.file.originalname}`

    fs.writeFileSync(temp, context.file.buffer)

    const admin = context.session

    const permissions = await admin.getPermissions()

    if (!permissions) {
        return context.decline(42, 403, "No se encontraron permisos para el administrador")
    }

    if (!permissions.drive.create) {
        return context.decline(42, 403, "No tiene los permisos necesarios para cargar archivos")
    }

    // Verificar que el body de la petición no este vació
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.params)

    // Variables a registrar
    validator.runMandatory({
        UUID: true
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "La información del usuario es invalida"
        )
    }

    const drive = new DriveModel()

    const file = await drive.getFile(validator.data.uuid)

    if (!file) {
        return context.decline(59, 404, "El archivo no existe")
    }

    await drive.updateFile(`${process.env.PATIENT_ASSETS}/${file.p}`, temp)
    fs.unlinkSync(temp)

    return context.finish("")
}
