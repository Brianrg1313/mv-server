const Databases = require("package:/models/databases")
const MySql = require("package:/servers/mysql")
/**
 * Maneja información relacionada con la aplicación y no con el cliente, como el diccionario de variables
 */
class AppModel {
    static mysql = new MySql(Databases.mysql.app)

    variables = ["titulo", "subtitulo", "coleccion", "icono", "tipo", "modo", "editable", "abreviacion", "pattern", "posicion", "min", "max"]

    collections = ["id", "titulo", "icono", "posicion"]

    async getDictionary(language) {
        // TODO: Completar sistema de traducción
        return await AppModel.mysql.find("SELECT " + this.variables.map((e) => "`" + e + "`").join(",") + " FROM `diccionario` ORDER BY `posicion`,`titulo` ASC")
    }

    async getCollection(language) {
        // TODO: Completar sistema de traducción
        return await AppModel.mysql.find("SELECT " + this.collections.map((e) => "`" + e + "`").join(",") + " FROM `colecciones` ORDER BY `posicion`,`titulo` ASC")
    }

    async termsPrivacy(uid) {
        // TODO: Completar sistema de traducción
        return await AppModel.mysql.findOne("SELECT `terminos`,`privacidad` FROM `terminos` WHERE `uid` = " + uid)
    }
}

module.exports = AppModel
