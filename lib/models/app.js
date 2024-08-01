const Databases = require("package:/models/databases")
const MySql = require("package:/servers/mysql")
const Redis = require("package:/servers/redis")

/**
 * Maneja información relacionada con la aplicación y no con el cliente, como el diccionario de variables
 */
class AppModel {
    static mysql = new MySql(Databases.mysql.app)
    static redis = new Redis()

    async getDictionary() {
        if (await AppModel.redis.issetInHash(Databases.redis.app, "variables")) {
            return await AppModel.redis.findInHash(Databases.redis.app, "variables")
        }

        const variables = await AppModel.mysql.find("SELECT " + this.#variables.map((e) => "`" + e + "`").join(",") + " FROM `diccionario` ORDER BY `posicion` ASC")

        const response = {}

        for (const item of variables) {
            response[item.id] = item
        }

        AppModel.redis.insertInHash(Databases.redis.app, "variables", response)

        return response
    }

    async getCollection() {
        if (await AppModel.redis.issetInHash(Databases.redis.app, "colecciones")) {
            return await AppModel.redis.findInHash(Databases.redis.app, "colecciones")
        }

        const collections = await AppModel.mysql.find("SELECT " + this.#collections.map((e) => "`" + e + "`").join(",") + " FROM `colecciones` ORDER BY `posicion` ASC")

        const response = {}

        for (const item of collections) {
            response[item.id] = item
        }

        AppModel.redis.insertInHash(Databases.redis.app, "colecciones", response)

        return response
    }

    /**
     * Lista de variables a buscar
     * @param {Array<String>} keys
     */
    async getVarsValidator(keys, language) {
        // TODO: le afecta el sistema de idiomas
        const result = await AppModel.mysql.find("SELECT `id`, `" + language + "` 'addr',`min`,`max`,`pattern` FROM `diccionario` WHERE `id` IN (" + keys.map((e) => `'${e.toLowerCase()}'`).join(",") + ")")

        const response = {}

        for (const item of result) {
            response[item.id] = item
            response[item.id].key = item.id
        }

        return response
    }

    get groupsNotesKeys() {
        return ["id", "color", "titulo", "posicion"]
    }

    async getGroupsNotes() {
        const result = await AppModel.mysql.find("SELECT * FROM `grupos_notas` ORDER BY `posicion` ASC")

        if (!result) return null

        return result
    }

    /**
     * Obtiene los mensajes para las fallas semanales del paciente
     * @param {String} language Idioma del cliente
     * @param {Array<int>} variables Variables de las que se necesitan las fallas
     * @returns {Promise<Array<Object>>}
     */
    async getFlaws(language, variables) {
        const result = await AppModel.mysql.find("SELECT `variable`, `" + language + "_titulo` 'titulo',`" + language + "_mensaje` 'mensaje', `imagen` FROM `fallas_semanales` WHERE `variable` IN (" + variables.join(",") + ")")

        if (!result) return null

        return result
    }

    #variables = ["id", "es", "en", "subes", "suben", "coleccion", "icono", "tipo", "abreviacion", "pattern", "posicion", "min", "max"]
    get variables() {
        return ["id", "titulo", "subtitulo", "visible", "coleccion", "icono", "tipo", "abreviacion", "pattern", "posicion", "min", "max"]
    }

    #collections = ["id", "es", "en", "icono", "posicion"]
    get collections() {
        return ["id", "titulo", "icono", "posicion"]
    }
}

module.exports = AppModel
