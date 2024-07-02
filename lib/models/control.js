const Databases = require("package:/models/databases")
const MySql = require("package:/servers/mysql")
const Mongo = require("package:/servers/mongo")

/**
 * Lleva un registro de todas las visitas y actividad del cliente en el servidor
 */
class ControlModel {
    static mysql = new MySql(Databases.mysql.control)
    static mongo = new Mongo(Databases.mysql.control)

    /**
     * Registra las visitas a los EndPoints
     * @param {String} [ip] Dirección del cliente
     * @param {String} [accs] Token de sesión del cliente
     * @param {String} path Dirección a la que se realizo la solicitud
     * @param {String} method POST, PUT, GET o DELETE
     * @returns //TODO: no se que devuelve
     */
    async registerVisit({ ip, accs, path, method }) {
        return await ControlModel.mongo.insert({ ip, path, method, accs }, "visitas")
    }
}

module.exports = ControlModel
