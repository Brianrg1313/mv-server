const AppModel = require("package:/models/app")
const Validator = require("package:/helpers/validator")
const FastDataModel = require("package:/models/fast_data")

/**
 * Devuelve al cliente las notas de ayuda para calificar una variable
 * @param {Request} context
 */
module.exports = async (context) => {
    // Verificar que el body de la petición no este vacío
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    // Se pasan los datos que seran validados
    const validator = new Validator(context.params)

    // Se validan los datos
    validator.runMandatory(context.params)

    if (!validator.status) {
        // TODO: agregar la variable que fallo
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Hubo un error al validar la variable recibida en los params"
        )
    }

    const app = new AppModel()
    const variableHelp = await app.getVariablesHelp(validator.data.variable)

    if (!variableHelp) {
        return context.finish(null)
    }

    const fastData = new FastDataModel()

    const response = {
        claves: ["id", "admin", "texto", "color"],
        valores: []
    }

    for (const item of variableHelp) {
        item.admin = await fastData.adminNames(item.aid)

        response.valores.push([
            item.id,
            item.admin,
            item.texto,
            item.color
        ])
    }

    return context.finish(response)
}
