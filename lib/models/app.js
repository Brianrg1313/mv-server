const MySql = require("package:/servers/mysql")
const Redis = require("package:/servers/redis")
const Databases = require("package:/models/databases")

/**
 * Maneja información relacionada con la aplicación y no con el cliente, como el diccionario de variables
 */
class AppModel {
    static mysql = new MySql(Databases.mysql.app)
    static redis = new Redis()

    async getDictionary() {
        const result = await AppModel.mysql.find("SELECT * FROM `diccionario` WHERE `estado` IS NULL ORDER BY `posicion`, `abreviacion` ASC")

        const response = {}

        for (const variable of result) {
            response[variable.id] = variable
        }

        return response
    }

    async getAllVariables(language) {
        return await AppModel.mysql.find("SELECT *, `" + language + "` as titulo, `sub" + language + "` as subtitulo FROM `diccionario` WHERE `estado` IS NULL ORDER BY `abreviacion` ASC")
    }

    async getCollection() {
        const collections = await AppModel.mysql.find("SELECT * FROM `colecciones` WHERE `estado` IS NULL ORDER BY `posicion` ASC")

        const response = {}

        for (const item of collections) {
            response[item.id] = item
        }

        return response
    }

    /**
     * Lista de variables a buscar
     * @param {Array<String>} keys
     */
    async getVarsValidator(keys, language) {
        if (keys.length === 0) {
            return {}
        }

        // TODO: le afecta el sistema de idiomas
        const result = await AppModel.mysql.find("SELECT `id`, `" + language + "` 'addr',`formato`,`min`,`max`,`pattern` FROM `diccionario` WHERE `id` IN (" + keys.map((e) => `'${e.toLowerCase()}'`).join(",") + ")")

        const response = {}

        for (const item of result) {
            response[item.id] = item
            response[item.id].key = item.id

            if (item.formato === 1) {
                response[item.id].type = "text"
            } else if (item.formato === 2) {
                response[item.id].type = "double"
            } else if (item.formato === 3) {
                response[item.id].type = "numeric"
            }
        }

        return response
    }

    async getAllCollections(language) {
        return await AppModel.mysql.find("SELECT *, `" + language + "` as titulo FROM `colecciones` WHERE `estado` IS NULL ORDER BY `posicion` ASC")
    }

    async getLetterFood() {
        const result = await AppModel.mysql.find("SELECT * FROM `menu_carta`")

        const items = {}
        const menus = {}

        for (const item of result) {
            const key = item.menu.replace(/ /g, "_").toLowerCase()

            if (menus[key] == null) {
                menus[key] = item.menu
            }

            if (items[key] == null) {
                items[key] = []
            }

            items[key].push([
                item.menu,
                item.titulo,
                item.cuerpo,
                item.imagen
            ])
        }

        const response = {
            claves: ["menu", "titulo", "cuerpo", "imagen"],
            menus,
            valores: items
        }

        return response
    }

    async getFoodMenu() {
        const result = await AppModel.mysql.find("SELECT * FROM `lista_menu`")

        const items = {}

        for (const item of result) {
            if (item.dac === "0") continue

            if (items[item.dac] == null) {
                items[item.dac] = {}
            }

            const key = item.grupo.replace(/ /g, "_").toLowerCase()

            if (items[item.dac][key] == null) {
                items[item.dac][key] = []
            }

            items[item.dac][key].push([
                item.detalle,
                item.cantidad,
                item.clasificacion,
                item.grupo
            ])
        }

        const response = {
            claves: ["detalle", "cantidad", "clasificacion", "grupo"],
            valores: items
        }

        return response
    }

    async getEmotionsHelp(language) {
        const result = await AppModel.mysql.find("SELECT `" + language + "_titulo` 'titulo',`" + language + "_descripcion` 'descripcion' FROM `ayudas_emociones`")

        const items = []

        for (const item of result) {
            items.push([
                item.titulo,
                item.descripcion
            ])
        }

        const response = {
            claves: ["titulo", "descripcion"],
            valores: items
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

    /**
     * Devuelve todas las notas de ayuda para calificar una variable
     * @param {int} vid ID de la variable
     * @returns {Promise<Array<Object>>}
     */
    async getVariablesHelp(vid) {
        const response = await AppModel.mysql.find("SELECT `id`,`aid`,`texto`,`color` FROM `variables_ayuda` WHERE `variable` = " + vid + " AND `estado` IS NULL")

        if (Object.keys(response).length === 0) return null
        return response
    }

    async getTelephone(language) {
        return await AppModel.mysql.find("SELECT `" + language + "` as titulo,`recurso`,`valor`,`minimo`,`maximo` FROM `validador_telefonos`")
    }

    async getDNI(language) {
        return await AppModel.mysql.find("SELECT `" + language + "` as titulo,`recurso`,`valor`,`minimo`,`maximo` FROM `validador_dni`")
    }

    async validateVariable(id) {
        return await AppModel.mysql.findOne("SELECT * FROM `diccionario` WHERE `id` = " + id)
    }

    async validateCollection(id) {
        return await AppModel.mysql.findOne("SELECT * FROM `colecciones` WHERE `id` = " + id)
    }

    async updateCollection(data, id) {
        if (data.estado === 1) {
            AppModel.mysql.edit({ coleccion: null }, { coleccion: id }, "diccionario")
        }

        return await AppModel.mysql.edit(data, { id }, "colecciones")
    }

    async createCollection(data) {
        return await AppModel.mysql.insert(data, "colecciones")
    }

    async updateVariable(data, id) {
        return await AppModel.mysql.edit(data, { id }, "diccionario")
    }

    async createVariable(data) {
        return await AppModel.mysql.insert(data, "diccionario")
    }

    async getLastAbbreviation() {
        return await AppModel.mysql.findOne("SELECT MAX(`abreviacion`) AS `abreviacion` FROM `diccionario`", "abreviacion")
    }

    get variables() {
        return ["id", "titulo", "subtitulo", "bandera", "formato", "editable", "visible", "coleccion", "icono", "tipo", "abreviacion", "pattern", "posicion", "min", "max"]
    }

    get collections() {
        return ["id", "titulo", "icono", "posicion"]
    }
}

module.exports = AppModel
