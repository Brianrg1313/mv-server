const AppModel = require("package:/models/app")
const Validator = require("package:/helpers/validator")

module.exports = async (context) => {
    const admin = context.session

    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const permissions = await admin.getPermissions()

    if (!permissions.variables.edit) {
        return context.decline(42, 403, "No tiene los permisos necesarios para editar una colección")
    }

    const validator = new Validator(context.body)

    validator.runMandatory({
        ID: true,
        TITULO: false,
        ICONO: false
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Los datos son invalidas o falta información"
        )
    }

    const data = validator.data

    const app = new AppModel()

    const collValidator = await app.validateCollection(data.id)

    if (!collValidator) {
        return context.decline(48, 404, "No existe la colección")
    }

    const edit = {}

    if (data.titulo) {
        edit[context.headers["accept-language"]] = data.titulo
    } else if (data.icono) {
        edit.icono = data.icono
    } else {
        return context.decline(5, 400, "La petición esta vacía")
    }

    app.updateCollection(edit, data.id)

    return context.finish("")
}
