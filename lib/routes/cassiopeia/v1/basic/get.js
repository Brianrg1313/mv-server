/**
 * Información básica del administrador
 * @param {Request} context
 * @returns
 */
module.exports = async (context) => {
    const admin = context.session

    const groupsKeys = {
        placeholder: "titulo",
        resource: "color",
        caption: "descripcion",
        value: "id"
    }

    const variablesKeys = {
        placeholder: "titulo",
        resource: "color",
        caption: "descripcion",
        value: "id"
    }

    const response = {
        foto: null,
        datos_personales: null,
        permisos: null,
        opciones: {
            claves: Object.keys(groupsKeys),
            variables: [],
            grupos: []
        }
    }

    const permissions = await admin.getPermissions()

    response.permisos = permissions.toMap()
    response.datos_personales = await admin.personalData()

    /// Grupos del equipo de este administrador
    const groups = await admin.groupsOfTeam()

    if (groups.length > 0) {
        for (const group of groups) {
            const items = []
            for (const key of Object.values(groupsKeys)) {
                items.push(group[key])
            }
            response.opciones.grupos.push(items)
        }
    }

    /// Listas de variables disponibles para el equipo de este administrador
    const variables = await admin.variablesOfTeam()

    if (variables.length > 0) {
        for (const variable of variables) {
            const items = []
            for (const key of Object.values(variablesKeys)) {
                items.push(variable[key])
            }
            response.opciones.variables.push(items)
        }
    }

    return context.finish(response)
}
