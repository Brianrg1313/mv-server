const AppModel = require("package:/models/app")
const Validator = require("package:/helpers/validator")

module.exports = async (context) => {
    const admin = context.session
    const permissions = await admin.getPermissions()

    if (!permissions.variables.delete) {
        return context.decline(42, 403, "No tiene los permisos necesarios para eliminar variables")
    }

    const validator = new Validator(context.params)

    validator.runMandatory({ ID: true })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Los datos son invalidas o falta información"
        )
    }

    const id = validator.data.id

    const app = new AppModel()

    const varValidator = await app.validateVariable(id)

    if (!varValidator) {
        return context.decline(45, 404, "No existe la variable")
    }

    app.updateVariable(id, { estado: 1 })

    return context.finish(null)
}
