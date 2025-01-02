const Databases = require("package:/models/databases")
const SessionModel = require("package:/models/session")

const acceptedLanguages = require("package:/extras/accepted_languages")
const Redis = require("package:/servers/redis")

const { validateText } = require("package:/helpers/tools")

const whiteListServer = [
    `${process.env.HOST}:${process.env.PORT_A}`,
    `192.168.1.101:${process.env.PORT_A}`,
    `192.168.1.102:${process.env.PORT_A}`,
    `192.168.1.103:${process.env.PORT_A}`,
    `192.168.1.104:${process.env.PORT_A}`,
    `192.168.68.102:${process.env.PORT_A}`,
    `192.168.101.22:${process.env.PORT_A}`,
    `192.168.101.31:${process.env.PORT_A}`,
    `192.168.68.113:${process.env.PORT_A}`,
    `192.168.1.103:${process.env.PORT_A}`
]

/**
 * Se validan las cabeceras de esta petición, todas las peticiones deben incluir un identificador único que se usa para identificar el dispositivo del cual se está conectando un usuario. En navegadores web el identificador es generado del lado del cliente, en el resto de aplicaciones se usa un código identificador de dispositivo como el serial de fábrica.
 * @param {Request} req
 * @param {Response} _
 * @param {NextFunction} next
 */
module.exports = async (req, _, next) => {
    if (req.path === "/health/") {
        return next()
    }

    if (req.headers["accept-language"] == null) {
        req.headers["accept-language"] = "es"
    } else if (!acceptedLanguages.includes(req.headers["accept-language"])) {
        req.headers["accept-language"] = "es"
    }

    if (req.headers.device == null) {
        return req.decline(1, 401, "Falta el identificador del dispositivo")
    }

    // eslint-disable-next-line no-useless-escape
    if (!validateText(req.headers.device, "a-zA-Z0-9()\\-_.,;:\/\s}{")) {
        return req.decline(2, 401, "El identificador del dispositivo es invalido")
    }

    const serverName = req.get("host")

    // TODO:
    // if (!whiteListServer.includes(serverName)) {
    //     return req.decline(4, 403, "El origen de la petición no tiene permisos para acceder a los datos")
    // }

    const redis = new Redis()

    if (await redis.issetInSet(Databases.redis.devices, req.headers.device)) {
        return next()
    }

    const deviceModel = new SessionModel()

    let device = await deviceModel.findDeviceByToken(req.headers.device)

    if (device == null) {
        device = {}
        device.id = await deviceModel.saveDevice(req.headers.device)
        device.blq = null
    }

    if (device.blq !== null) {
        return req.decline(3, 403, "El dispositivo fue bloqueado")
    }

    redis.insertInSet(Databases.redis.devices, req.headers.device)

    return next()
}
