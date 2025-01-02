const ControlModel = require("package:/models/control")

const { validateText } = require("package:/helpers/tools")
/**
 * LLeva un registros de las secciones de la aplicación que mas son usadas
 * @param {Request} context
 * @returns
 */
module.exports = async (context) => {
    const patient = context.session

    // Verificar que el body de la petición no este vació
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    let status = true
    for (const key in context.body) {
        if (!validateText(key, "a-z_0-9")) {
            status = false
        }

        if (!validateText(context.body[key], "0-9")) {
            status = false
        }

        context.body[key] = parseInt(context.body[key])
    }

    if (!status) {
        return context.decline(
            35,
            400,
            "Los datos recibidos no son válidos"
        )
    }

    const control = new ControlModel()

    const result = await control.registerActivityApp(patient.id, context.body)

    return context.finish(result)
}
