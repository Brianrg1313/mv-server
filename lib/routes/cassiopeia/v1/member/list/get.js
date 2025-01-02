/**
 * @param {Request} context
 */
module.exports = async (context) => {
    const admin = context.session

    const teamMembers = await admin.getTeamMembers()

    if (Object.values(teamMembers).length === 0) {
        return context.finish(null)
    }

    const keys = ["foto", "nombre", "apellido", "correo", "usuario", "sexo", "lista"]
    const values = []

    for (const patient of teamMembers) {
        const items = []
        for (const key of keys) {
            items.push(patient[key])
        }
        values.push(items)
    }

    return context.finish({
        claves: keys,
        valores: values
    })
}
