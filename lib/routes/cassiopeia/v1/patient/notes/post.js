const Validator = require("package:/helpers/validator")
const FastDataModel = require("package:/models/fast_data")
const PatientModel = require("package:/models/patient/patient")

module.exports = async (context) => {
    // Verificar que el body de la petición no este vacío
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({
        USUARIO: true,
        CARPETA: false,
        PRIVADO: false,
        COLOR: false
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Hubo un error al validar los datos"
        )
    }

    if (validator.leftovers.NOTA === undefined) {
        return context.decline(5, 404, "No hay nota")
    }

    const username = validator.data.usuario
    delete validator.data.usuario

    const data = validator.data

    if (data.carpeta !== undefined) {
        if (`${data.carpeta}` === "1") {
            delete data.carpeta
        }
    }

    const patient = await PatientModel.fromUsername(username)

    if (!patient) {
        return context.decline(36, 404, "Este paciente no existe o no está disponible")
    }

    const note = {
        pid: patient.id,
        ...data,
        nota: validator.leftovers.NOTA,
        administrador: context.session.id,
        fecha: new Date()
    }

    note.id = await patient.addNote(note)
    delete note._id
    delete note.pid

    const fastData = new FastDataModel()
    note.administrador = await fastData.adminNames(note.administrador)

    return context.finish(note)
}
