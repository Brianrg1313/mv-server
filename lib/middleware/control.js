const ControlModel = require("package:/models/control")

/**
 * Lleva un registro de la actividad del cliente
 * @param {Request} req
 * @param {Response} _
 * @param {NextFunction} next
 */
module.exports = async (req, _, next) => {
    next()

    const control = new ControlModel()

    control.registerVisit({
        ip: req.connection.remoteAddress,
        path: req.path,
        method: req.method,
        accs: req.headers.access
    })
}
