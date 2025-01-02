const AppModel = require("package:/models/app")

/**
 * Carta de menú
 * @param {Request} context
 */
module.exports = async (context) => {
    const app = new AppModel()
    return context.finish(await app.getLetterFood())
}
