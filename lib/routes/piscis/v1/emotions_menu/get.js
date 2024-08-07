const AppModel = require("package:/models/app")

/**
 * Ayudas del menu de emociones
 * @param {Request} context
 */
module.exports = async (context) => {
    const app = new AppModel()
    return context.finish(await app.getEmotionsHelp(context.headers["accept-language"]))
}
