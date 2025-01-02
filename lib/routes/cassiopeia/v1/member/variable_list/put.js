const Validator = require("package:/helpers/validator")
const MemberModel = require("package:/models/member/member")

module.exports = async (context) => {
    const admin = context.session

    const permissions = await admin.getPermissions()

    if (!permissions.lists.edit) {
        return context.decline(42, 403, "No tiene los permisos necesarios para crear pacientes")
    }

    // Verificar que el body de la petición no este vació
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({
        USUARIO: true,
        LISTA: true
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "La información del paciente es invalida"
        )
    }

    const member = await MemberModel.fromUsername(validator.data.usuario, admin.team)

    if (!member) {
        return context.decline(43, 404, "El administrador no existe")
    }

    member.updateList(validator.data.lista)

    return context.finish("")
}
