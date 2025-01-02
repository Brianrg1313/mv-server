const Validator = require("package:/helpers/validator")
const MemberModel = require("package:/models/member/member")

module.exports = async (context) => {
    const admin = context.session

    const permissions = await admin.getPermissions()

    if (!permissions) {
        return context.decline(42, 403, "No se encontraron permisos para el administrador")
    }

    if (!permissions.member.edit) {
        return context.decline(42, 403, "No tiene los permisos necesarios para crear integrantes")
    }

    // Verificar que el body de la petición no este vació
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({
        USUARIO: true,
        ID: true
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "La información del nuevo integrante es invalida"
        )
    }

    const data = validator.data

    const member = await MemberModel.fromUsername(data.usuario, admin.team)

    if (!member) {
        return context.decline(43, 404, "El administrador no existe en la base de datos")
    }

    member.updateGroups(data.id)

    return context.finish("")
}
