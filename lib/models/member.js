const Mongo = require("package:/servers/mongo")
const MySql = require("package:/servers/mysql")
const Redis = require("package:/servers/redis")
const Databases = require("package:/models/databases")

class MemberModel {
    static redis = new Redis()
    static adminSql = new MySql(Databases.mysql.admin)
    static adminMg = new Mongo(Databases.mongo.admin)

    constructor({ nombre, apellido, correo, usuario, telefono, tdni, dni, nacimiento, sexo, profesion }) {
        this.name = nombre
        this.lastName = apellido
        this.email = correo
        this.username = usuario
        this.phone = telefono
        this.tdni = tdni
        this.dni = dni
        this.birthday = nacimiento
        this.sex = sexo
        this.profession = profesion
    }

    async validateIdentity() {
        const dniV = await MemberModel.adminSql.findOne("SELECT `id` FROM `administradores` WHERE `tdni` = '" + this.tdni + "' AND `dni` = " + this.dni)
        if (dniV) return 41 // TODO: cambiar mensajes de error

        const emailV = await MemberModel.adminSql.findOne("SELECT `id` FROM `administradores` WHERE `correo` = '" + this.email + "'")
        if (emailV) return 39 // TODO: cambiar mensajes de error

        const usernameV = await MemberModel.adminSql.findOne("SELECT `id` FROM `administradores` WHERE `usuario` = '" + this.username + "'")
        if (usernameV) return 38 // TODO: cambiar mensajes de error

        const smartphoneV = await MemberModel.adminSql.findOne("SELECT `id` FROM `administradores` WHERE `telefono` = '" + this.phone + "'")
        if (smartphoneV) return 40 // TODO: cambiar mensajes de error
    }

    async create(personalData, extra) {
        personalData.id = await MemberModel.adminSql.insert(personalData, "administradores")

        if (!personalData.id) {
            return null
        }

        extra.aid = personalData.id

        await MemberModel.adminSql.insert(extra, "extras")
        await MemberModel.adminSql.insert({
            aid: personalData.id,
            eid: personalData.equipo
        }, "permisos")

        return true
    }
}

module.exports = MemberModel
