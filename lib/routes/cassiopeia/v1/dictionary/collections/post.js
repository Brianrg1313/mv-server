const AppModel = require("package:/models/app")
const Validator = require("package:/helpers/validator")

module.exports = async (context) => {
    const admin = context.session

    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const permissions = await admin.getPermissions()

    if (!permissions.variables.create) {
        return context.decline(42, 403, "No tiene los permisos necesarios para crear una colección")
    }

    const validator = new Validator(context.body)

    validator.runMandatory({ TITULO: true })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Los datos son invalidas o falta información"
        )
    }

    const app = new AppModel()

    const data = {}
    data.es = validator.data.titulo
    data.en = validator.data.titulo

    const id = await app.createCollection(data)

    return context.finish({
        id,
        titulo: validator.data.titulo
    })
}
