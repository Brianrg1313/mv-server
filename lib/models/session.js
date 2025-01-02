const Databases = require("package:/models/databases")
const MySql = require("package:/servers/mysql")

class SessionModel {
    static mysql = new MySql(Databases.mysql.session)

    async idFromAccess(accs) {
        return await SessionModel.mysql.findOne("SELECT `id` FROM `sesiones` WHERE `accs` = '" + this.getToken(accs) + "'", "id")
    }

    async UidFromAccess(accs, type) {
        return await SessionModel.mysql.findOne("SELECT `uid` FROM `sesiones` WHERE `accs` = '" + this.getToken(accs) + "' AND `tipo` = " + type + " AND `estado` IS NULL", "uid")
    }

    async issetSession(accs) {
        return await SessionModel.mysql.isset({ accs: this.getToken(accs), estado: null }, "sesiones")
    }

    async createSession(data) {
        return await SessionModel.mysql.insert(data, "sesiones")
    }

    async findDeviceByToken(device) {
        return await SessionModel.mysql.findOne("SELECT `id`,`blq` FROM `dispositivos` WHERE `dis` = '" + device + "'")
    }

    async saveDevice(device) {
        return await SessionModel.mysql.insert({ dis: device }, "dispositivos")
    }

    getToken(accs) {
        return accs.split("-")[3]
    }
}

module.exports = SessionModel
