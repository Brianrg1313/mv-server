const Validator = require("package:/helpers/validator")

module.exports = async (context) => {
    // Verificar que el body de la petición no este vacío
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({
        ID: true,
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

    if (Object.keys(validator.data).length === 0) {
        return context.finish(null)
    }

    const id = validator.data.id
    delete validator.data.id

    if (id === 1) {
        return context.finish(null)
    }

    context.session.updateNoteFolder(id, validator.data)

    return context.finish("")
}
