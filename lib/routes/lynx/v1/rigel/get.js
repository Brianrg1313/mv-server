const fs = require("fs")

const DriveModel = require("package:/models/drive/drive")

module.exports = async (context) => {
    const drive = new DriveModel()

    if (!context.params.archivo) {
        return context.decline(5)
    }

    const image = await drive.getImage(context.params.archivo)

    let path = `${drive.path}/${image.p}`

    fs.access(path, fs.constants.F_OK, (exists) => {
        if (exists) {
            path = `${process.env.STATIC_ASSETS}/${context.params.mode}/error3.png`
        }

        return context.finish(path)
    })
}
