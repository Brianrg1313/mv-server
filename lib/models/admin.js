const Databases = require("package:/models/databases")
const MySql = require("package:/servers/mysql")
const Redis = require("package:/servers/redis")

class AdminModel {
    static mysql = new MySql(Databases.mysql.admin)
    static redis = new Redis()

    constructor(id) {
        this.aid = id
    }

    async resumeFromAID(aid) {
        const response = {}
        response.names = await AdminModel.mysql.findOne("SELECT `nombre`,`apellido` FROM `administradores` WHERE `id` = " + aid)

        response.profession = await AdminModel.mysql.findOne("SELECT `profesion` FROM `extras` WHERE `aid` = " + aid, "profesion")

        return response
    }
}

module.exports = AdminModel
