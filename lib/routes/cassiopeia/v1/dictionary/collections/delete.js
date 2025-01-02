const AppModel = require("package:/models/app")
const Validator = require("package:/helpers/validator")

module.exports = async (context) => {
    const admin = context.session

    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const permissions = await admin.getPermissions()

    if (!permissions.variables.delete) {
        return context.decline(42, 403, "No tiene los permisos necesarios para eliminar una colección")
    }

    const validator = new Validator(context.params)

    validator.runMandatory(context.params)

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "El id de la variable no es valido"
        )
    }

    const app = new AppModel()

    const collValidator = await app.validateCollection(validator.data.variable)

    if (!collValidator) {
        return context.decline(48, 404, "No existe la colección")
    }

    app.updateCollection({ estado: 1 }, validator.data.variable)

    return context.finish("")
}
