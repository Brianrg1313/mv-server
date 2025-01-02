const DriveModel = require("package:/models/drive/drive")

module.exports = async (context) => {
    const drive = new DriveModel()
    const icons = await drive.getAllIcons()

    const response = {
        claves: ["id", "titulo"],
        valores: []
    }

    for (const icon of icons) {
        response.valores.push([icon._id, icon.t])
    }

    return context.finish(response)
}
