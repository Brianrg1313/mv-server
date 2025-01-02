const Validator = require("package:/helpers/validator")

module.exports = async (context) => {
    const admin = context.session

    const permissions = await admin.getPermissions()

    if (!permissions) {
        return context.decline(42, 403, "No se encontraron permisos para el administrador")
    }

    if (!permissions.groups.create) {
        return context.decline(42, 403, "No tiene los permisos necesarios para crear integrantes")
    }

    // Verificar que el body de la petición no este vació
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({
        ID: true,
        COLOR: false,
        TITULO: false,
        DESCRIPCION: false
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Error al validar los datos"
        )
    }

    const data = validator.data

    const gruop = await admin.findAGroup(data.id)

    if (!gruop) {
        return context.decline(55, 500, "No se encontro el grupo")
    }

    admin.updateGroup(gruop.id, data)

    return context.finish("")
}
