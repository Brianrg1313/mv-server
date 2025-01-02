const AppModel = require("package:/models/app")

/**
 * Syncroniza las fallas semanales del paciente con las que se han registrado en el sistema
 * @param {Request} context
 */
module.exports = async (context) => {
    // Verificar que el body de la petición no este vació
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    // Verifica que el de la petición sea un array de enteros (ID de las variables)
    let status = true
    for (const variable of context.body) {
        if (!Number.isInteger(variable)) {
            status = false
            break
        }
    }

    if (!status) {
        return context.decline(
            34,
            400,
            "Las fallas deben ser de tipo entero"
        )
    }

    // Se obtienen los mensajes de las fallas semanales
    const app = new AppModel()
    const flaws = await app.getFlaws(context.headers["accept-language"], context.body)

    // Se ordenan los datos para ser enviados al cliente
    const keys = ["variable", "titulo", "mensaje", "imagen"]
    const values = []

    if (flaws) {
        for (const item of flaws) {
            const newItem = []

            for (const key of keys) {
                newItem.push(item[key])
            }

            values.push(newItem)
        }
    }

    return context.finish({
        claves: keys,
        valores: values
    })
}
