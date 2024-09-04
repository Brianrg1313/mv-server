const MySql = require("package:/servers/mysql")
const Redis = require("package:/servers/redis")
const Databases = require("package:/models/databases")
const { capitalize } = require("package:/helpers/tools")

class FastDataModel {
    static redis = new Redis()
    static admin = new MySql(Databases.mysql.admin)
    static patient = new MySql(Databases.mysql.patient)

    static adminNames = new Map()

    async adminNames(aid) {
        if (FastDataModel.adminNames.has(aid)) {
            return FastDataModel.adminNames.get(aid)
        }

        if (await FastDataModel.redis.issetInHash("admin_names", `${aid}`)) {
            const names = await FastDataModel.redis.findInHash("admin_names", `${aid}`)
            FastDataModel.adminNames.set(aid, names)
            return names
        }

        const result = await FastDataModel.admin.findOne("SELECT `nombre`,`apellido` FROM `administradores` WHERE `id` = " + aid)

        const name = capitalize(result.nombre) + " " + capitalize(result.apellido)

        FastDataModel.redis.insertInHash("admin_names", `${aid}`, name)
        FastDataModel.adminNames.set(aid, name)

        return name
    }
}

module.exports = FastDataModel
