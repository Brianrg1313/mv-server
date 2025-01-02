const Validator = require("package:/helpers/validator")
const FastDataModel = require("package:/models/fast_data")

module.exports = async (context) => {
    // Verificar que el body de la petición no este vacío
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({
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

    const data = validator.data

    if (data.carpeta !== undefined) {
        if (`${data.carpeta}` === "1") {
            delete data.carpeta
        }
    }

    const note = {
        ...data,
        nota: validator.leftovers.NOTA,
        administrador: context.session.id,
        fecha: new Date()
    }

    note.id = await context.session.createNoteTemplate(note)
    delete note._id

    const fastData = new FastDataModel()

    note.administrador = await fastData.adminNames(note.administrador)

    return context.finish(note)
}
