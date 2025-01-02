const cors = require("cors")
const multer = require("multer")
const express = require("express")

const { styleText } = require("node:util")

class AssetsServer {
    constructor() {
        this.app = express()
        this.upload = multer({ dest: "tmp/" })
        this.server = require("http").createServer(this.app)
    }

    /**
     * Se preparan todos los middlewares del servidor que no tienes relación con la sesión del usuario
     */
    prepare() {
        this.app.use(express.json())
        this.app.use(cors())

        this.app.use(require("package:/middleware/assets_helpers"))
        this.app.use(require("package:/middleware/assets_headers"))
        this.app.use(require("package:/middleware/assets_session"))
        this.app.use(require("package:/middleware/control"))
    }

    /**
     * Analizar todas las rutas del directorio "/lib/routes/" para crear los EndPoint basados en la estructura jerárquica de estos directorios
     * @param {String} path Siguiente directorio en ser analizado
     */
    readRoutes() {
        this.app.get("/health/", require("package:/routes/health/get"))
        // Iconos publicos
        this.app.get("/lynx/icon/:icono", require("package:/routes/lynx/v1/icon/get"))
        // Banderas de países
        this.app.get("/lynx/v1/static/:image", require("package:/routes/lynx/v1/static/get"))
        // Imagenes
        this.app.get("/lynx/v1/rigel/:archivo", require("package:/routes/lynx/v1/rigel/get"))
        // Archivos originales de la aplicación
        this.app.get("/lynx/v1/:mode/alsciaukat/:archivo", require("package:/routes/lynx/v1/alsciaukat/get"))
    }

    /**
     * La aplicación empieza a escuchar peticiones HTTP
     */
    listen() {
        this.server.listen(process.env.PORT_B, () => {
            console.log(
                styleText("grey", "Assets corriendo en"),
                styleText("white", `${process.env.HOST}:${process.env.PORT_B}\n`)
            )
        })
    }
}

module.exports = AssetsServer
