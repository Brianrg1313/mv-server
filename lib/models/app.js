const Databases = require("package:/models/databases")
const MySql = require("package:/servers/mysql")

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
}

module.exports = AppModel
