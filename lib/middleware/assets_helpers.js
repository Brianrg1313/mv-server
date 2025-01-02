/**
 * Se agregan algunas funcionalidades a la petición del cliente
 * @param {Request} req
 * @param {Response} _
 * @param {NextFunction} next
 */
module.exports = async (req, res, next) => {
    req.decline = (code) => {
        return res.sendFile(`${process.env.STATIC_ASSETS}/error${code}.png`, () => res.end())
    }

    req.finish = (path) => {
        return res.sendFile(path, () => res.end())
    }

    return next()
}
