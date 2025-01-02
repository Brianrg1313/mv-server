const Validator = require("package:/helpers/validator")
const DriveModel = require("package:/models/drive/drive")
const FastDataModel = require("package:/models/fast_data")
const PatientModel = require("package:/models/patient/patient")

module.exports = async (context) => {
    const admin = context.session
    const validator = new Validator(context.params)

    validator.runMandatory({ USUARIO: true })

    let id = "e" + admin.team

    if (validator.status) {
        const patient = await PatientModel.fromUsername(validator.data.usuario)

        if (!patient) {
            return context.decline(36, 404, "Este paciente no existe o no está disponible")
        }

        id = patient.id
    }

    const drive = new DriveModel()
    const fastData = new FastDataModel()
    const folders = await drive.getAllFolders(id)

    const foldersKeys = {
        id: "id",
        t: "titulo",
        c: "color",
        a: "creador",
        b: "bloqueado",
        f: "fecha"
    }

    const response = {
        claves: Object.values(foldersKeys),
        valores: []
    }

    for (const folder of folders) {
        if (folder.eliminado !== undefined || folder.eliminado === null) continue
        const items = []
        for (const key of Object.keys(foldersKeys)) {
            if (key === "b") {
                items.push(folder[key] ?? 0)
            } else if (key === "a") {
                let admin = null
                if (folder[key]) {
                    admin = await fastData.adminNames(folder[key])
                }
                items.push(admin)
            } else {
                items.push(folder[key] ?? null)
            }
        }
        response.valores.push(items)
    }

    return context.finish(response)
}
