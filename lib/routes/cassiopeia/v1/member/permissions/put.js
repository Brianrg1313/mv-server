const Validator = require("package:/helpers/validator")
const MemberModel = require("package:/models/member/member")

module.exports = async (context) => {
    const admin = context.session

    const permissions = await admin.getPermissions()

    if (!permissions) {
        return context.decline(42, 403, "No se encontraron permisos para el administrador")
    }

    if (!permissions.permissions.edit) {
        return context.decline(42, 403, "No tiene los permisos necesarios asignar o eliminar permisos")
    }

    // Verificar que el body de la petición no este vació
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({
        USUARIO: true,
        PERMISO: true,
        VER: false,
        EDITAR: false,
        CREAR: false,
        ELIMINAR: false
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "La información es invalida"
        )
    }

    const username = validator.data.usuario
    const permission = validator.data.permiso
    delete validator.data.usuario
    delete validator.data.permiso

    const data = validator.data

    const member = await MemberModel.fromUsername(username, admin.team)

    if (!member) {
        return context.decline(43, 404, "El administrador no existe")
    }

    if (Object.keys(data).length === 0) {
        return context.decline(53, 400, "No se encontraron datos para actualizar")
    }

    const currentPermissions = (await member.getPermissions()).toWCED()

    if (!currentPermissions) {
        return context.decline(42, 404, "No se encontraron permisos para el administrador")
    }

    if (currentPermissions[permission] === null || currentPermissions[permission] === undefined) {
        return context.decline(42, 404, "No se encontraron permisos para el administrador")
    }

    const WCED = currentPermissions[permission].toString()

    const WCEDmap = {
        watch: WCED[0],
        create: WCED[1],
        edit: WCED[2],
        delete: WCED[3]
    }

    for (const key in data) {
        WCEDmap[key] = data[key].toString()
    }

    await member.updatePermissions(permission, Object.values(WCEDmap).join(""))

    return context.finish("")
}
