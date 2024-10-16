const Validator = require("package:/helpers/validator")
const MemberModel = require("package:/models/member")

module.exports = async (context) => {
    const admin = context.session

    const permissions = await admin.getPermissions()

    if (!permissions) {
        return context.decline(42, 403, "No se encontraron permisos para el administrador")
    }

    if (!permissions.member.create) {
        return context.decline(42, 403, "No tiene los permisos necesarios para crear integrantes")
    }

    // Verificar que el body de la petición no este vació
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({
        NOMBRE: true,
        APELLIDO: true,
        CORREO: true,
        USUARIO: true,
        TELEFONO: true,
        TDNI: true,
        DNI: true,
        NACIMIENTO: true,
        SEXO: true,
        PAIS: false,
        CIUDAD: false,
        PARROQUIA: false,
        PROFESION: true
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "La información del nuevo integrante es invalida"
        )
    }

    const data = validator.data

    const member = new MemberModel(data)

    const identity = await member.validateIdentity()

    if (identity) { // TODO: no se si funciona aun
        return context.decline(identity, 401, "Uno de los identificadores ya esta siendo usado por otro usuario")
    }

    data.nacimiento = new Date(data.nacimiento)
    data.equipo = admin.team

    const extra = {
        pais: null,
        ciudad: null,
        parroquia: null,
        coordenadas: null,
        profesion: null,
        terminos: 0
    }

    for (const key in data) {
        if (extra[key] === null) {
            extra[key] = data[key]
            delete data[key]
        }

        if (typeof data[key] === "string") {
            data[key] = data[key].trim().toLowerCase()
        }
    }

    const patient = await member.create(data, extra)

    if (!patient) {
        return context.decline(22, 309, "No se pudo crear al administrador")
    }

    return context.finish(member.username)
}
