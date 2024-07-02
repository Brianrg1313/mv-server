/**
 * Diccionario de bases de datos
 */
class Databases {
    static mysql = {
        app: process.env.MYSQL_APP,
        patient: process.env.MYSQL_PATIENTS,
        control: process.env.MYSQL_CONTROL,
        session: process.env.MYSQL_SESSION
    }

    static redis = {
        app: process.env.REDIS_APP,
        devices: process.env.REDIS_DEVICE,
        sessions: process.env.REDIS_SESSION
    }

    static mongo = {
        patient: process.env.MONGO_PATIENTS,
        control: process.env.MONGO_CONTROL
    }
}

module.exports = Databases
