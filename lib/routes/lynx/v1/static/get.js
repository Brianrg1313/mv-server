const fs = require("fs")

module.exports = async (context) => {
    let path = `${process.env.STATIC_ASSETS}/static/${context.params.image}.webp`

    fs.access(path, fs.constants.F_OK, (exists) => {
        if (exists) {
            path = `${process.env.STATIC_ASSETS}/${context.params.mode}/error3.png`
        }

        return context.finish(path)
    })
}
