const fs = require("fs")

module.exports = async (context) => {
    if (context.params.mode !== "dark" && context.params.mode !== "light") {
        return context.decline(5)
    }

    let path = `${process.env.STATIC_ASSETS}/${context.params.mode}/${context.params.archivo}.webp`

    fs.access(path, fs.constants.F_OK, (exists) => {
        if (exists) {
            path = `${process.env.STATIC_ASSETS}/${context.params.mode}/error3.png`
        }

        return context.finish(path)
    })
}
