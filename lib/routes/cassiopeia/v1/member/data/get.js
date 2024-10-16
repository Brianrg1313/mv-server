const Validator = require("package:/helpers/validator")
const AdminModel = require("package:/models/admin/admin")

module.exports = async (context) => {
    const admin = context.session
    const permissions = await admin.getPermissions()

    if (!permissions) {
        return context.decline(42, 403, "No se encontraron permisos para el administrador")
    }

    if (!permissions.member.watch) {
        return context.decline(42, 403, "No tiene los permisos necesarios para ver información personal de los integrantes")
    }

    // Verificar que el body de la petición no este vació
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.params)
    validator.runMandatory({ USUARIO: true })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "La información del nuevo integrante es invalida"
        )
    }

    const data = validator.data

    const member = await AdminModel.fromAuthenticator("usuario", data.usuario)

    if (!member) {
        return context.decline(43, 404, "El administrador no existe en la base de datos")
    }

    const response = {
        data: await member.personalData(),
        permissions: permissions.toMap()
    }

    return context.finish(response)
}
