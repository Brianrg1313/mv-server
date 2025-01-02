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

    async registerActivityApp(uid, data) {
        const result = await ControlModel.mysql.find("SELECT `id`,`widget`,`visitas` FROM `app_pacientes` WHERE `uid` = " + uid + " AND `widget` IN (" + Object.keys(data).map((e) => "'" + e + "'").join(",") + ")")

        const order = {}

        if (result) {
            for (const item of result) {
                order[item.widget] = {
                    id: item.id,
                    total: item.visitas
                }
            }
        }

        const inserts = []
        const edits = []

        for (const key in data) {
            if (order[key] == null) {
                inserts.push({
                    uid,
                    widget: key,
                    visitas: data[key]
                })
            } else {
                edits.push(ControlModel.mysql.edit(
                    { visitas: data[key] + order[key].total },
                    { id: order[key].id },
                    "app_pacientes"
                ))
            }
        }

        if (inserts.length !== 0) {
            await ControlModel.mysql.multipleInsert(inserts, "app_pacientes")
        }

        if (edits.length !== 0) {
            await Promise.all(edits)
        }

        return true
    }
}

module.exports = ControlModel
