const Validator = require("package:/helpers/validator")
const FastDataModel = require("package:/models/fast_data")
const PatientModel = require("package:/models/patient/patient")

/**
 * Obtiene todas las notas y las carpetas de un paciente
 * @param {Resquest} context
 */
module.exports = async (context) => {
    const admin = context.session

    // Verificar que el body de la petición no este vació
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.params)

    // Variables a registrar
    validator.runMandatory({ USUARIO: true })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "La información del paciente es invalida"
        )
    }

    // Buscamos al paciente en la base de datos
    const patient = await PatientModel.fromUsername(validator.data.usuario)

    if (!patient) {
        return context.decline(36, 404, "Este paciente no existe o no está disponible")
    }

    const response = {
        carpetas: {
            claves: ["id", "titulo", "color"],
            valores: []
        },
        notas: {
            claves: ["id", "color", "carpeta", "fecha", "administrador", "privado", "editada", "nota"],
            valores: []
        },
        plantillas: {
            claves: ["id", "color", "carpeta", "fecha", "administrador", "privado", "editada", "nota"],
            valores: []
        }
    }

    const admins = {}
    const fastData = new FastDataModel()

    const folders = await admin.getNotesFolders()

    for (const folder of folders) {
        const item = []
        for (const key of response.carpetas.claves) {
            item.push(folder[key])
        }
        response.carpetas.valores.push(item)
    }

    const notes = await patient.getNotes()

    for (const note of notes) {
        const item = []
        for (const key of response.notas.claves) {
            if (key === "id") {
                item.push(note._id)
            } else if (key === "privada") {
                item.push(note[key] ?? 0)
            } else if (key === "administrador") {
                if (!admins[note[key]]) {
                    admins[note[key]] = await fastData.adminNames(note[key])
                }

                item.push(admins[note[key]])
            } else if (key === "editada") {
                item.push(note[key] ?? 0)
            } else {
                item.push(note[key])
            }
        }
        response.notas.valores.push(item)
    }

    const templates = await admin.getNoteTemplates()

    for (const note of templates) {
        const item = []
        for (const key of response.plantillas.claves) {
            if (key === "id") {
                item.push(note._id)
            } else if (key === "privada") {
                item.push(note[key] ?? 0)
            } else if (key === "administrador") {
                if (!admins[note[key]]) {
                    admins[note[key]] = await fastData.adminNames(note[key])
                }

                item.push(admins[note[key]])
            } else if (key === "editada") {
                item.push(note[key] ?? 0)
            } else {
                item.push(note[key])
            }
        }
        response.plantillas.valores.push(item)
    }

    return context.finish(response)
}
