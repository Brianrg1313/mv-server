const AppModel = require("package:/models/app")
const Validator = require("package:/helpers/validator")

/**
 * Edita una variable
 * @param {Request} context
 */
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
        ICONO: false,
        TAMANO: false,
        FORMATO: false,
        EDITABLE: false,
        ABREVIACION: false,
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

        if (varValidator.tipo !== 3) {
            return context.decline(47, 404, "Las referencias no estan disponibles para esta variable")
        }

        const reference = await app.validateVariable(data.referencia)

        if (!reference) {
            return context.decline(46, 404, "La referencia no existe")
        }

        reference.hasReference = true

        app.updateVariable(reference, data.referencia)
    }

    if (data.tipo) {
        if (data.tipo === 3 || data.tipo === 5) {
            data.constante = 1
        } else {
            data.referencia = null
            data.constante = 0
        }
    }

    if (data.formato) {
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
    }

    app.updateVariable(data, id)

    return context.finish("")
}
