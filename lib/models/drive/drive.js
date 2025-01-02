const fs = require("fs")
const sharp = require("sharp")

const MySql = require("package:/servers/mysql")
const Mongo = require("package:/servers/mongo")
const Databases = require("package:/models/databases")

const { v4: uuid } = require("uuid")

class DriveModel {
    static mongo = new Mongo(Databases.mongo.files)
    static mysql = new MySql(Databases.mysql.patient)

    path = process.env.PATIENT_ASSETS

    async getAllFolders(_id) {
        let result = await DriveModel.mongo.findOne({ _id }, "carpetas")

        if (!result) {
            result = await this.createEssentials(_id)
        }

        delete result._id

        return result.carpetas
    }

    async createNewFolder(_id, data) {
        let folders = await DriveModel.mongo.findOne({ _id }, "carpetas")

        if (!folders) {
            folders = await this.createEssentials(_id)
        }

        const folder = this.createFolder({
            title: data.titulo,
            admin: data.admin,
            color: parseInt(`${data.color}`)
        })

        folders.carpetas.push(folder)

        await DriveModel.mongo.edit({ _id }, folders, "carpetas")

        return folder
    }

    async getAllIcons() {
        return await DriveModel.mongo.find({}, "iconos")
    }

    async editFolder(_id, data) {
        const folders = await DriveModel.mongo.findOne({ _id }, "carpetas")

        if (!folders) return null

        let i = null

        for (const index in folders.carpetas) {
            const folder = folders.carpetas[index]

            if (folder.id === data.uuid) {
                i = index
                break
            }
        }

        if (i === null) return null

        if (folders.carpetas[i].b) return null
        if (folders.carpetas[i].b) return null

        folders.carpetas[i].t = data.titulo ?? folders.carpetas[i].t
        folders.carpetas[i].c = parseInt(`${data.color ?? folders.carpetas[i].c}`)

        await DriveModel.mongo.edit({ _id }, folders, "carpetas")

        return folders.carpetas[i]
    }

    async deleteFolder(_id, uuid) {
        const folders = await DriveModel.mongo.findOne({ _id }, "carpetas")

        if (!folders) return null

        let i = null

        for (const index in folders.carpetas) {
            const folder = folders.carpetas[index]

            if (folder.id === uuid) {
                i = index
                break
            }
        }

        if (i === null) return null

        folders.carpetas[i].eliminado = 1

        await DriveModel.mongo.edit({ _id }, folders, "carpetas")

        return null
    }

    async createEssentials(_id) {
        const timeline = this.createFolder({
            title: "Timeline",
            bloqueado: 1,
            color: 0
        })

        const imbody = this.createFolder({
            title: "ImBody",
            bloqueado: 1,
            color: 0
        })

        const result = {
            _id,
            carpetas: [timeline, imbody]
        }

        await DriveModel.mongo.insert(result, "carpetas")

        return result
    }

    createFolder({ title, color, admin, bloqueado }) {
        const id = uuid().replace(/-/g, "").slice(0, 16)

        const folder = {
            id,
            t: title,
            c: color,
            a: admin,
            f: new Date()
        }

        if (bloqueado) {
            folder.b = 1
        }

        return folder
    }

    async validateFolder(_id, folderId) {
        const folder = await DriveModel.mongo.findOne({ _id, "carpetas.id": folderId }, "carpetas")

        if (!folder) return false

        const userDir = `${this.path}/${_id}`

        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir)
        }

        const folderDir = `${userDir}/${folderId}`

        if (!fs.existsSync(folderDir)) {
            fs.mkdirSync(folderDir)
        }

        return true
    }

    async getAllFilesOFFolder(folderId) {
        return await DriveModel.mongo.findSort({ f: folderId }, { fecha: -1 }, "imagenes")
    }

    async getImage(fileId) {
        return await DriveModel.mongo.findOne({ _id: fileId }, "imagenes")
    }

    async uploadImage(origin, data) {
        data._id = uuid().replace(/-/g, "")
        data.p = `${data.p}/${data.f}/${data._id}.webp`

        data.m = await sharp(origin).metadata()

        if (data.m.icc) {
            delete data.m.icc
        }
        if (data.m.exif) {
            delete data.m.exif
        }
        if (data.m.iptc) {
            delete data.m.iptc
        }
        if (data.m.xmp) {
            delete data.m.xmp
        }

        await DriveModel.mongo.insert(data, "imagenes")

        const image = sharp(origin).webp({ quality: 70 })

        await image.toFile(`${this.path}/${data.p}`)

        return data
    }

    async updateFile(original, newFile) {
        const image = sharp(newFile).webp({ quality: 90 })

        await image.toFile(original)
    }

    async getFile(_id) {
        const file = await DriveModel.mongo.findOne({ _id }, "imagenes")

        if (!file) return null

        return file
    }
}

module.exports = DriveModel
