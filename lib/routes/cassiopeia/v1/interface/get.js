const AppModel = require("package:/models/app")

module.exports = async (context) => {
    const admin = context.session

    const app = new AppModel()

    const keys = ["titulo", "recurso", "valor", "minimo", "maximo"]

    const response = {
        telefono: {
            claves: keys,
            valores: []
        },
        dni: {
            claves: keys,
            valores: []
        },
        grupos: {
            claves: ["titulo", "descripcion"],
            valores: []
        },
        variables: {
            claves: ["titulo", "color", "icono"],
            valores: []
        }
    }

    // Modelo para validar los números de teléfonos disponibles
    const telefono = await app.getTelephone(context.headers["accept-language"])

    for (const key of telefono) {
        const item = []
        for (const k of keys) {
            item.push(key[k])
        }
        response.telefono.valores.push(item)
    }

    const dni = await app.getDNI(context.headers["accept-language"])

    for (const key of dni) {
        const item = []
        for (const k of keys) {
            item.push(key[k])
        }
        response.dni.valores.push(item)
    }

    const groups = await admin.groupsOfTeam()

    for (const key of groups) {
        const item = []
        for (const k of response.grupos.claves) {
            item.push(key[k])
        }
        response.grupos.valores.push(item)
    }

    const variables = await admin.variablesOfTeam()

    for (const key of variables) {
        const item = []
        for (const k of response.variables.claves) {
            item.push(key[k])
        }
        response.variables.valores.push(item)
    }

    return context.finish(response)
}
