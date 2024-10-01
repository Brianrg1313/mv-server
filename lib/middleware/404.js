module.exports = (_, res) => {
    res.status(404).json({ message: "La ruta solicitada no existe" })
}
