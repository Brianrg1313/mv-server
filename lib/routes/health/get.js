const Redis = require("package:/servers/redis")

module.exports = (_, res) => {
    return res.status(200).json({
        status: "ok",
        server: "api",
        instance: `${process.env.INSTANCE}`,
        version: `${process.env.VERSION}`,
        redis: Redis.status,
        mysql: "connected",
        mongo: "connected"
    })
}
