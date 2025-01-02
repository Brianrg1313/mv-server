const fs = require("fs")
const Validator = require("package:/helpers/validator")
const DriveModel = require("package:/models/drive/drive")
const FastDataModel = require("package:/models/fast_data")
const PatientModel = require("package:/models/patient/patient")

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

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({
        USUARIO: false,
        CARPETA_ID: true
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "La información del usuario es invalida"
        )
    }

    let id = "e" + admin.team

    if (validator.data.usuario) {
        const patient = await PatientModel.fromUsername(validator.data.usuario)

        if (!patient) {
            return context.decline(36, 404, "Este paciente no existe o no está disponible")
        }

        id = patient.id
    }

    const drive = new DriveModel()

    const validateFolder = await drive.validateFolder(id, validator.data.carpeta)

    if (!validateFolder) {
        return context.decline(58, 404, "La carpeta no existe")
    }

    const data = {
        p: id, // paciente o grupo
        c: admin.id, // creador
        o: context.file.originalname, // original name
        t: "imagen", // tipo
        s: context.file.size, // size
        f: validator.data.carpeta, // folder
        fecha: new Date()
    }

    const file = await drive.uploadImage(temp, data)
    fs.unlinkSync(temp)

    const fastData = new FastDataModel()

    const adminNames = await fastData.adminNames(file.c)

    const response = {
        id: file._id,
        creador: adminNames,
        tipo: file.t,
        tamano: file.s,
        descripcion: file.d ?? null,
        titulo: file.o,
        fecha: file.fecha
    }

    return context.finish(response)
}
