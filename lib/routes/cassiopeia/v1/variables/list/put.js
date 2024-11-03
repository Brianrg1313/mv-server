const AppModel = require("package:/models/app")
const Validator = require("package:/helpers/validator")

module.exports = async (context) => {
    const admin = context.session

    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const permissions = await admin.getPermissions()

    if (!permissions.variables.edit) {
        return context.decline(42, 403, "No tiene los permisos necesarios para editar una variable")
    }

    const validator = new Validator(context.body)

    validator.runMandatory({
        ID: true,
        TITULO: false,
        SUBTITULO: false,
        BANDERA: false,
        TIPO: false,
        FORMATO: false,
        COLECCION: false,
        ABREVIACION: false,
        POSICION: false,
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

    const id = data.id
    delete data.id

    const app = new AppModel()

    const varValidator = await app.validateVariable(id)

    if (!varValidator) {
        return context.decline(45, 404, "No existe la variable")
    }

    const lang = context.headers["accept-language"]

    if (data.titulo) {
        data[lang] = data.titulo
        delete data.titulo
    }

    if (data.subtitulo) {
        data["sub" + lang] = data.subtitulo
        delete data.subtitulo
    }

    if (data.referencia) {
        if (data.referencia === id) {
            return context.finish(null)
        }

        if (varValidator.tipo === 1 || varValidator.tipo === 2) {
            return context.decline(47, 404, "Las referencias no estan disponibles para esta variable")
        }

        const reference = await app.validateVariable(data.referencia)

        if (!reference) {
            return context.decline(46, 404, "La referencia no existe")
        }
    }

    if (data.tipo) {
        if (data.tipo === 1) {
            if (varValidator.referencia) {
                data.referencia = null
            }
            data.pattern = "a-z A-Z"
        } else if (data.tipo === 2) {
            if (varValidator.referencia) {
                data.referencia = null
            }
            data.pattern = "0-9."
        } else {
            data.pattern = "12345"
        }
    }

    app.updateVariable(data, id)

    return context.finish(null)
}
