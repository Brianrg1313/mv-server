const Databases = require("package:/models/databases")
const MySql = require("package:/servers/mysql")

class DevicesModel {
    static mysql = new MySql(Databases.mysql.session)

    async findByToken(device) {
        return await DevicesModel.mysql.findOne("SELECT `id`,`blq` FROM `dispositivos` WHERE `dis` = '" + device + "'")
    }

    async saveDevice(device) {
        return await DevicesModel.mysql.insert({ dis: device }, "dispositivos")
    }
}

module.exports = DevicesModel
