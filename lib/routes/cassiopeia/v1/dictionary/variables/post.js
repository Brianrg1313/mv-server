const AppModel = require("package:/models/app")
const Validator = require("package:/helpers/validator")

const { intToAbc, nextAbbr } = require("package:/helpers/tools")

module.exports = async (context) => {
    const admin = context.session

    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const permissions = await admin.getPermissions()

    if (!permissions.variables.create) {
        return context.decline(42, 403, "No tiene los permisos necesarios para crear una variable")
    }

    const validator = new Validator(context.body)

    validator.runMandatory({
        TITULO: true,
        SUBTITULO: true,
        BANDERA: false,
        TIPO: true,
        FORMATO: true,
        COLECCION: false,
        REFERENCIA: false
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Los datos son invalidas o falta información"
        )
    }

    const data = validator.data

    data.es = data.titulo
    data.en = data.titulo
    data.subes = data.subtitulo
    data.suben = data.subtitulo
    delete data.titulo
    delete data.subtitulo

    data.min = 1

    if (data.tipo === 1) {
        data.pattern = "a-z A-Z"
        data.max = 50
    } else if (data.tipo === 2) {
        data.pattern = "0-9."
        data.max = 11
    } else {
        data.pattern = "12345"
        data.max = 1
    }

    const app = new AppModel()

    const lastAbbreviation = await app.getLastAbbreviation()

    data.abreviacion = nextAbbr(lastAbbreviation)

    data.id = await app.createVariable(data)

    return context.finish({
        id: data.id,
        icono: null,
        titulo: data[context.headers["accept-language"]],
        subtitulo: data["sub" + context.headers["accept-language"]],
        bandera: data.bandera,
        tipo: data.tipo,
        formato: data.formato,
        referencia: data.referencia,
        coleccion: data.coleccion,
        editable: 1,
        abreviacion: intToAbc(data.abreviacion),
        posicion: null
    })
}
