const MySql = require("package:/servers/mysql")
const Redis = require("package:/servers/redis")
const Mongo = require("package:/servers/mongo")
const Databases = require("package:/models/databases")

/**
 * Maneja información relacionada con la aplicación y no con el cliente, como el diccionario de variables
 */
class AppModel {
    static mysql = new MySql(Databases.mysql.app)
    static mongo = new Mongo(Databases.mongo.app)
    static redis = new Redis()

    // TODO: mongo
    async getDictionary() {
        const result = await AppModel.mysql.find("SELECT * FROM `diccionario` WHERE `estado` IS NULL ORDER BY `posicion`, `abreviacion` ASC")

        const response = {}

        for (const variable of result) {
            response[variable.id] = variable
        }

        return response
    }

    async getCollection() {
        const collections = await AppModel.mysql.find("SELECT * FROM `colecciones` WHERE `estado` IS NULL ORDER BY `posicion` ASC")

        const response = {}

        for (const item of collections) {
            response[item.id] = item
        }

        return response
    }

    async getAllCollections(language) {
        const result = await AppModel.mysql.find("SELECT *, `" + language + "` as titulo FROM `colecciones` WHERE `estado` IS NULL ORDER BY `posicion` ASC")

        if (!result) return []

        const last = []
        const first = []

        for (const k in result) {
            if (result[k].posicion === null) {
                last.push(result[k])
            } else {
                first.push(result[k])
            }
        }

        return first.concat(last)
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

    async getVariablesNotes(patient, variable) {
        const result = await AppModel.mysql.find("SELECT * FROM `variables_notas` WHERE `pid` = " + patient + " AND `variable` = " + variable + " AND `estado` IS NULL ORDER BY `fecha` ASC")

        if (!result) return null
        if (result.length === 0) return null

        return result
    }

    /**
     * Todas las variables del diccionario
     * @returns {Promise<Array<Object>>}
     */
    async getAllVariables() {
        return await AppModel.mongo.find({}, "diccionario")
    }

    /**
     * Lista de variables a buscar
     * @param {Array<String>} keys
     */
    async getVarsValidator(keys, language) {
        if (keys.length === 0) {
            return {}
        }

        const result = await AppModel.mongo.find({ _id: { $in: keys.map((e) => parseInt(e)) } }, "diccionario")

        const response = {}

        for (const item of result) {
            response[item._id] = {
                key: item._id,
                addr: item[language],
                format: item.formato,
                min: item.min,
                max: item.max,
                pattern: item.pattern,
                type: null
            }

            if (item.formato === 1) {
                response[item._id].type = "text"
            } else if (item.formato === 2) {
                response[item._id].type = "double"
            } else if (item.formato === 3) {
                response[item._id].type = "numeric"
            }
        }

        return response
    }

    async validateVariable(id) {
        return await AppModel.mongo.findOne({ _id: id }, "diccionario")
    }

    async updateVariable(data, id) {
        return await AppModel.mongo.edit({ _id: id }, data, "diccionario")
    }

    async createVariable(data) {
        return await AppModel.mongo.insert(data, "diccionario", { increment: true })
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

    async validateCollection(id) {
        return await AppModel.mysql.findOne("SELECT * FROM `colecciones` WHERE `id` = " + id)
    }

    async updateCollection(data, id) {
        if (data.estado === 1) {
            const coll = await AppModel.mongo.query("diccionario")
            await coll.updateMany({ coleccion: id }, { $set: { coleccion: null } })
        }

        return await AppModel.mysql.edit(data, { id }, "colecciones")
    }

    async createCollection(data) {
        return await AppModel.mysql.insert(data, "colecciones")
    }

    async getLastAbbreviation() {
        const collection = await AppModel.mongo.query("diccionario")

        const [result] = await collection.find({}, { abreviacion: 1 }).sort({ abreviacion: -1 }).limit(1).toArray()

        return result.abreviacion
    }

    async updateCollectionsOrder(order) {
        const sql = []

        for (const i in order) {
            sql.push("UPDATE `colecciones` SET `posicion` = " + i + " WHERE `id` = " + order[i])
        }

        await AppModel.mysql.multiQuery(sql.join(";"))
    }

    async updateVariablesInCollections(id, order) {
        return await AppModel.mysql.edit({ variables: order }, { id }, "colecciones")
    }

    get variables() {
        return ["id", "titulo", "subtitulo", "bandera", "formato", "editable", "visible", "coleccion", "icono", "tipo", "abreviacion", "pattern", "posicion", "min", "max"]
    }

    get collections() {
        return ["id", "titulo", "icono", "posicion"]
    }
}

module.exports = AppModel
