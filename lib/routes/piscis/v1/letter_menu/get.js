const AppModel = require("package:/models/app")

/**
 * Menu alimenticio
 * @param {Request} context
 */
module.exports = async (context) => {
    const app = new AppModel()
    return context.finish(await app.getFoodMenu())
}
