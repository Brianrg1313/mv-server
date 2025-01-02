const Redis = require("package:/servers/redis")
const Databases = require("package:/models/databases")
const SessionModel = require("package:/models/session")

const { validateText } = require("package:/helpers/tools")

const whiteListServer = [
    `${process.env.HOST}:${process.env.PORT_B}`,
    `192.168.1.101:${process.env.PORT_B}`,
    `192.168.1.102:${process.env.PORT_B}`,
    `192.168.1.103:${process.env.PORT_B}`,
    `192.168.1.104:${process.env.PORT_B}`,
    `192.168.68.102:${process.env.PORT_B}`,
    `192.168.101.22:${process.env.PORT_B}`,
    `192.168.101.31:${process.env.PORT_B}`,
    `192.168.68.113:${process.env.PORT_B}`,
    `192.168.1.103:${process.env.PORT_B}`
]

/**
 * @param {Request} req
 * @param {Response} _
 * @param {NextFunction} next
 */
module.exports = async (req, _, next) => {
    if (req.path === "/health/") {
        return next()
    }

    if (req.headers.device == null) {
        return req.decline(2)
    }

    const serverName = req.get("host")

    // TODO:
    // if (!whiteListServer.includes(serverName)) {
    //     return req.decline(4)
    // }

    // eslint-disable-next-line no-useless-escape
    if (!validateText(req.headers.device, "a-zA-Z0-9()\\-_.,;:\/\s}{")) {
        return req.decline(2)
    }

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
        return req.decline(2)
    }

    redis.insertInSet(Databases.redis.devices, req.headers.device)

    return next()
}
