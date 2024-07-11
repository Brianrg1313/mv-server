const Databases = require("package:/models/databases")
const MySql = require("package:/servers/mysql")
const Redis = require("package:/servers/redis")
/**
 * Maneja información relacionada con la aplicación y no con el cliente, como el diccionario de variables
 */
class AppModel {
    static mysql = new MySql(Databases.mysql.app)
    static redis = new Redis()

    variables = ["id", "variable", "titulo", "subtitulo", "coleccion", "icono", "tipo", "modo", "editable", "abreviacion", "pattern", "posicion", "min", "max"]

    collections = ["id", "titulo", "icono", "posicion"]

    async getDictionary(language) {
        // TODO: Completar sistema de traducción
        if (await AppModel.redis.issetInHash(Databases.redis.app, "variables")) {
            return await AppModel.redis.findInHash(Databases.redis.app, "variables")
        } else {
            const variables = await AppModel.mysql.find("SELECT " + this.variables.map((e) => "`" + e + "`").join(",") + " FROM `diccionario` ORDER BY `posicion`,`titulo` ASC")
            AppModel.redis.insertInHash(Databases.redis.app, "variables", variables)
            return variables
        }
    }

    async getCollection(language) {
        // TODO: Completar sistema de traducción
        if (await AppModel.redis.issetInHash(Databases.redis.app, "collections")) {
            return await AppModel.redis.findInHash(Databases.redis.app, "collections")
        } else {
            const collections = await AppModel.mysql.find("SELECT " + this.collections.map((e) => "`" + e + "`").join(",") + " FROM `colecciones` ORDER BY `posicion`,`titulo` ASC")
            AppModel.redis.insertInHash(Databases.redis.app, "collections", collections)
            return collections
        }
    }

    /**
     * Lista de variables a buscar
     * @param {Array<String>} keys
     */
    async getVarsValidator(keys) {
        // TODO: le afecta el sistema de idiomas
        const result = await AppModel.mysql.find("SELECT `id`,`variable` 'key',`titulo` 'addr',`min`,`max`,`pattern` FROM `diccionario` WHERE `variable` IN (" + keys.map((e) => `'${e.toLowerCase()}'`).join(",") + ")")

        const response = {}

        for (const item of result) {
            response[item.key.toUpperCase()] = item
            response[item.key.toUpperCase()].key = item.id
        }

        return response
    }
}

module.exports = AppModel
