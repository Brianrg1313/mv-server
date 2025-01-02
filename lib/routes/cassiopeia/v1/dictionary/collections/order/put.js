const AppModel = require("package:/models/app")
const Validator = require("package:/helpers/validator")

module.exports = async (context) => {
    const admin = context.session

    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const permissions = await admin.getPermissions()

    if (!permissions.collections.edit) {
        return context.decline(42, 403, "No tiene los permisos necesarios para crear una variable")
    }

    const validator = new Validator(context.body)

    validator.runMandatory({
        ID: true,
        ORDEN: true,
        TIPO: true
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Los datos son invalidas o falta información"
        )
    }

    const data = validator.data
    const id = data.id
    delete data.id

    const app = new AppModel()

    const validateColl = await app.validateCollection(id)

    if (!validateColl) {
        return context.decline(49, 404, "No existe la lista")
    }

    if (data.tipo === 1) {
        app.updateCollectionsOrder(data.orden)
    } else {
        app.updateVariablesInCollections(id, data.orden)
    }

    return context.finish("")
}
