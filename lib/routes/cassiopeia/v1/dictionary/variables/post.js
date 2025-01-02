const AppModel = require("package:/models/app")
const Validator = require("package:/helpers/validator")

const { intToAbc, nextAbbr } = require("package:/helpers/tools")

/**
 * Permite crear nuevas variables
 * @param {Request} context
 */
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

    if (data.formato === 1) {
        data.pattern = "IGNORE"
        data.max = 50
    } else if (data.formato === 2) {
        data.pattern = "0-9."
        data.max = 11
    } else {
        data.pattern = "0-5"
        data.max = 1
    }

    if (data.referencia) {
        if (data.tipo !== 3) {
            return context.decline(47, 404, "Las referencias no estan disponibles para esta variable")
        }

        const app = new AppModel()
        const reference = await app.validateVariable(data.referencia)

        if (!reference) {
            return context.decline(46, 404, "La referencia no existe")
        }

        reference.referenciada = true

        app.updateVariable(reference, data.referencia)
    }

    if (data.tipo) {
        if (data.tipo === 3 || data.tipo === 5) {
            data.constante = 1
        }
    }

    const app = new AppModel()

    const lastAbbreviation = await app.getLastAbbreviation()

    data.abreviacion = parseInt(nextAbbr(lastAbbreviation))

    data.id = await app.createVariable(data)

    return context.finish({
        id: data.id,
        titulo: data[context.headers["accept-language"]],
        subtitulo: data["sub" + context.headers["accept-language"]],
        bandera: data.bandera,
        tipo: data.tipo,
        formato: data.formato,
        referencia: data.referencia,
        abreviacion: intToAbc(data.abreviacion)
    })
}
