const Mongo = require("package:/servers/mongo")
const MySql = require("package:/servers/mysql")
const Redis = require("package:/servers/redis")
const Databases = require("package:/models/databases")
const PermissionsModel = require("package:/models/admin/permissions")

class MemberModel {
    static redis = new Redis()
    static adminSql = new MySql(Databases.mysql.admin)
    static adminMg = new Mongo(Databases.mongo.admin)

    constructor(data) {
        this.id = data.id
        this.team = data.eid
        this.name = data.nombre
        this.lastName = data.apellido
        this.email = data.correo
        this.username = data.usuario
        this.phone = data.telefono
        this.tdni = data.tdni
        this.dni = data.dni
        this.birthday = data.nacimiento
        this.sex = data.sexo
        this.profession = data.profesion
    }

    static async fromUsername(username, team) {
        const user = await MemberModel.adminSql.findOne("SELECT * FROM `administradores` WHERE `usuario` = '" + username + "' AND `eid` = " + team)
        if (!user) return null

        user.aid = user.id

        return new MemberModel(user)
    }

    async groups() {
        const groups = await MemberModel.adminSql.find("SELECT `gid` FROM `grupos_administradores` WHERE `aid` = " + this.id, "gid")

        if (!groups) return []

        return groups
    }

    async updateGroups(gid) {
        const groups = await this.groups()

        if (groups.includes(gid)) {
            await MemberModel.adminSql.query("DELETE FROM `grupos_administradores` WHERE `aid` = " + this.id + " AND `gid` = " + gid)
        } else {
            await MemberModel.adminSql.insert({ aid: this.id, gid }, "grupos_administradores")
        }
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

    async getPermissions() {
        let result = await MemberModel.adminSql.findOne("SELECT * FROM `permisos` WHERE `aid` = " + this.id)

        if (!result) {
            await MemberModel.adminSql.insert({ aid: this.id, eid: this.team }, "permisos")
            result = await MemberModel.adminSql.findOne("SELECT * FROM `permisos` WHERE `aid` = " + this.id)
        }

        return new PermissionsModel(result)
    }

    async personalData() {
        const data = await Promise.all([
            MemberModel.adminSql.findOne("SELECT `nombre`,`apellido`,`correo`,`usuario`,`telefono`,`tdni`,`dni`,`nacimiento`,`sexo`,`lista`,`estado` FROM `administradores` WHERE `id` = " + this.id),
            MemberModel.adminSql.findOne("SELECT `profesion` FROM `extras` WHERE `aid` = " + this.id)
        ])

        const result = {}

        for (const item of data) {
            if (item) {
                Object.assign(result, item)
            }
        }

        return result
    }

    async updatePermissions(permission, WCED) {
        await MemberModel.adminSql.edit({ [permission]: WCED }, { aid: this.id }, "permisos")
    }

    async create(data) {
        const order = require("./variables_by_table.json")

        for (const table in order) {
            const insert = {}

            for (const key of order[table]) {
                if (data[key] !== null && data[key] !== undefined) {
                    insert[key] = data[key]
                }
            }

            if (Object.keys(insert).length === 0) continue

            if (table === "administradores") {
                this.id = await MemberModel.adminSql.insert(insert, table)
            } else if (this.id !== null) {
                insert.aid = this.id
                await MemberModel.adminSql.insert(insert, table)
            }
        }

        return true
    }

    async update(data) {
        const order = require("./variables_by_table.json")

        for (const table in order) {
            const edit = {}

            for (const key of order[table]) {
                if (data[key] !== null && data[key] !== undefined) {
                    edit[key] = data[key]
                }
            }

            if (Object.keys(edit).length === 0) continue

            if (table === "administradores") {
                await MemberModel.adminSql.edit(edit, { id: this.id }, table)
            } else {
                await MemberModel.adminSql.edit(edit, { aid: this.id }, table)
            }
        }
    }

    async updateList(lists) {
        await MemberModel.adminSql.edit({ lista: lists }, { id: this.id }, "administradores")
    }
}

module.exports = MemberModel
