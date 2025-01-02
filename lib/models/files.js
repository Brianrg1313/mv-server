const Databases = require("package:/models/databases")
const MySql = require("package:/servers/mysql")

/**
 * Maneja todo los archivos y carpetas de un paciente
 */
class FilesModel {
    static mysql = new MySql(Databases.mysql.patient)

    async profilePictures(uid, week) {
        uid = 2
        const timelineFolder = await FilesModel.mysql.findOne("SELECT `id` FROM `carpetas` WHERE `uid` = " + uid + " AND `nombre` = 'timeline'", "id")

        if (!timelineFolder) return null

        const images = await FilesModel.mysql.find("SELECT `uid`,`archivo`,`semana`,`fecha_r` FROM `archivos` WHERE `uid` = " + uid + " AND `carpeta` = " + timelineFolder + " AND `semana` IN (1," + week + ",100000) ORDER BY `fecha_r` DESC")

        let initial = null
        let current = null
        let goal = null

        for (const item of images) {
            if (item.semana === 1) {
                if (initial !== null) continue
                initial = item.archivo
            }

            if (item.semana === week) {
                if (current !== null) continue
                current = item.archivo
            }

            if (item.semana === 100000) {
                if (goal !== null) continue
                goal = item.archivo
            }
        }

        return { initial, current, goal }
    }
}

module.exports = FilesModel
