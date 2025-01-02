module.exports = async (context) => {
    const admin = context.session

    const permissions = await admin.getPermissions()

    if (!permissions.lists.watch) {
        return context.decline(42, 403, "No tiene los permisos necesarios para crear una variable")
    }

    const response = {
        claves: ["id", "titulo", "color"],
        valores: []
    }

    const lists = await admin.lists()

    if (!lists) {
        return context.finish(null)
    }

    for (const list of lists) {
        const item = []
        for (const key of response.claves) {
            item.push(list[key])
        }
        item.push(await admin.variableList({ list: list.id }))
        response.valores.push(item)
    }

    response.claves.push("variables")

    return context.finish(response)
}
