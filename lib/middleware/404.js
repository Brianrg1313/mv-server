module.exports = (request, res) => {
    if (process.env.DEV) {
        res.status(404).json({ message: "La ruta solicitada no existe" })
    } else {
        res.status(404).json({ message: "La ruta solicitada no existe", devTails: request.url })
    }
}
