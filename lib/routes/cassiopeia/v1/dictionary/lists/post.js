const Validator = require("package:/helpers/validator")

module.exports = async (context) => {
    const admin = context.session

    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const permissions = await admin.getPermissions()

    if (!permissions.lists.create) {
        return context.decline(42, 403, "No tiene los permisos necesarios para crear una variable")
    }

    const validator = new Validator(context.body)

    validator.runMandatory({
        TITULO: true,
        COLOR: true
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Los datos son invalidas o falta información"
        )
    }

    const data = validator.data

    data.id = await admin.createList(data)

    return context.finish(data)
}
