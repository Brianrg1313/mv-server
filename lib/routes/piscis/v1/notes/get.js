const AppModel = require("package:/models/app")
const AdminModel = require("package:/models/admin/admin")
const RecordModel = require("package:/models/record/record")

/**
 * Provee al cliente con los datos de las notas de la aplicación
 * @param {Request} context
 */
module.exports = async (context) => {
    const patient = context.session

    const app = new AppModel()
    const admin = new AdminModel(undefined)
    const record = new RecordModel(patient.id)

    const notes = await record.getAllNotes()
    const groups = await app.getGroupsNotes()

    const response = {
        grupos: {
            claves: Object.values(app.groupsNotesKeys),
            valores: []
        },
        notas: {
            claves: Object.values(record.notesKeys),
            valores: []
        }
    }

    const administrators = {}

    /**
     * Se ordenan las notas y se eliminan los datos innecesarios
     * Se eliminan las claves y se ordenan los valores para mantener la estructura de la respuesta
     */
    for (const note of notes) {
        if (!note.v === 0) continue
        if (!note.p === 0) continue

        if (!administrators[note.aid]) {
            const adminData = await admin.resumeFromAID(note.aid)
            administrators[note.aid] = adminData
        }

        note.admin = `${administrators[note.aid].names.nombre} ${administrators[note.aid].names.apellido}`
        note.profession = administrators[note.aid].profession

        const newNote = []

        for (const key in record.notesKeys) {
            newNote.push(note[key])
        }

        response.notas.valores.push(newNote)
    }

    for (const group of groups) {
        const newGroup = []
        for (const key of app.groupsNotesKeys) {
            newGroup.push(group[key])
        }
        response.grupos.valores.push(newGroup)
    }

    return context.finish(response)
}
