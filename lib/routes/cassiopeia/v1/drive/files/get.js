const Validator = require("package:/helpers/validator")
const DriveModel = require("package:/models/drive/drive")
const FastDataModel = require("package:/models/fast_data")
const PatientModel = require("package:/models/patient/patient")

module.exports = async (context) => {
    const admin = context.session

    const permissions = await admin.getPermissions()

    if (!permissions) {
        return context.decline(42, 403, "No se encontraron permisos para el administrador")
    }

    if (!permissions.drive.watch) {
        return context.decline(42, 403, "No tiene los permisos necesarios ver archivos")
    }

    if (!context.params.USUARIO) {
        delete context.params.USUARIO
    }

    const validator = new Validator(context.params)

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

    const files = await drive.getAllFilesOFFolder(validator.data.carpeta)

    const filesKeys = {
        _id: "id",
        c: "creador",
        t: "tipo",
        s: "tamano",
        d: "descripcion",
        o: "titulo",
        fecha: "fecha"
    }

    const response = {
        claves: Object.values(filesKeys),
        valores: []
    }

    const fastData = new FastDataModel()

    const adminNames = {}

    for (const file of files) {
        const item = []
        for (const key in filesKeys) {
            if (key === "t") {
                item.push("imagen")
            } else if (key === "c") {
                let names = adminNames[file.c]
                if (!names) {
                    names = await fastData.adminNames(file.c)
                    adminNames[file.c] = names
                }

                item.push(names)
            } else {
                item.push(file[key])
            }
        }
        response.valores.push(item)
    }

    return context.finish(response)
}
