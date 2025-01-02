const fs = require("fs")

const { styleText } = require("node:util")

/**
 * Se adjuntan algunas funcionalidades a la petición del cliente
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
module.exports = async (req, res, next) => {
    req.isEmpty = () => {
        // TODO: no valida bien
        if (req.method === "GET") {
            return Object.keys(req.params).length === 0
        } else {
            if ((Object.keys(req.params).length === 0) && (Object.keys(req.body).length === 0)) {
                return true
            } else {
                return false
            }
        }
    }

    req.decline = (code, status, devTails) => {
        const response = { code, message: null }

        if (`${code}`.includes("_")) {
            code = code.split("_")

            const errors = require(`package:/l10n/inputs/${code[0]}.json`)
            response.message = errors[req.headers["accept-language"]][code[1]]
        } else {
            const errors = require(`package:/l10n/${code}.json`)
            response.message = errors[req.headers["accept-language"]]
        }

        if (process.env.DEV) {
            const line = new Error().stack.split("\n")[2]
                .replace("at", "")
                .replace("module.exports ", "")
                .replace(process.env.BASE, "\\")
                .trim()

            response.line = line
            response.devTails = devTails
        }

        if (status > 499) {
            fs.readdir("./lib/l10n/reports/", (error, files) => {
                console.error(error)
                if (error) { return }

                const report = new Error().stack.split("\n")[2]
                    .replace("at", "")
                    .replace("module.exports ", "")
                    .replace(process.env.BASE, "\\")
                    .trim()

                const data = {
                    code,
                    status,
                    serverName: req.get("host"),
                    url: req.url,
                    file: report,
                    headers: req.headers,
                    body: req.body,
                    devTails: response.devTails
                }

                fs.writeFile("./lib/l10n/reports/" + (files.length + 1) + ".json", JSON.stringify(data, null, 2), (_e, _a) => { })

                console.alert(styleText("red", "Error reportado como: " + (files.length + 1)))
            })
        }

        res.status(status).json(response)

        return res.end()
    }

    req.finish = (data, { status = 200 } = {}) => {
        res.status(status).json(data)
        return res.end()
    }

    return next()
}
