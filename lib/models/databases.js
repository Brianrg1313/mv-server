/**
 * Diccionario de bases de datos
 */
class Databases {
    static mysql = {
        app: process.env.MYSQL_APP,
        patient: process.env.MYSQL_PATIENTS,
        control: process.env.MYSQL_CONTROL,
        session: process.env.MYSQL_SESSION,
        admin: process.env.MYSQL_ADMINS
    }

    static redis = {
        app: process.env.REDIS_APP,
        admin: process.env.REDIS_ADMIN,
        devices: process.env.REDIS_DEVICE,
        sessions: process.env.REDIS_SESSION
    }

    static mongo = {
        app: process.env.MONGO_APP,
        patient: process.env.MONGO_PATIENTS,
        control: process.env.MONGO_CONTROL,
        admin: process.env.MONGO_ADMINS,
        files: process.env.MONGO_DRIVE
    }
}

module.exports = Databases
