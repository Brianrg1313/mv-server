/**
 * Una petición a este EndPoint acepta los términos y condiciones de uso de parte del cliente
 * @param {Request} context
 */
module.exports = async (context) => {
    await context.session.updateTerms()
    return context.finish(null)
}
