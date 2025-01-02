const fs = require("fs")

const compression = require("compression")
const express = require("express")
const multer = require("multer")
const cors = require("cors")

const { styleText } = require("node:util")

/**
 * Maneja las peticiones HTTP del cliente
 */
class ExpressServer {
    constructor() {
        this.app = express()
        this.server = require("http").createServer(this.app)
    }

    storage = multer.memoryStorage()

    /**
     * Métodos permitidos para construir los controladores
     */
    methods = ["get.js", "post.js", "put.js", "delete.js"]

    /**
     * Middlewares que se aplican a los controladores relacionados a la sesión cliente
     */
    middlewares = {
        sessionValidator: require("package:/middleware/validate_session")
    }

    /**
     * Se preparan todos los middlewares del servidor que no tienes relación con la sesión del usuario
     */
    prepare() {
        this.app.use(cors())
        this.app.use(compression())
        this.app.use(express.json())

        this.app.use(require("package:/middleware/request_helpers"))
        this.app.use(require("package:/middleware/headers"))
        this.app.use(require("package:/middleware/control"))

        this.upload = multer({ storage: this.storage })
    }

    /**
     * Analizar todas las rutas del directorio "/lib/routes/" para crear los EndPoint basados en la estructura jerárquica de estos directorios
     * @param {String} path Siguiente directorio en ser analizado
     */
    readRoutes(path) {
        const elements = fs.readdirSync(path)

        for (const element of elements) {
            const stats = fs.statSync(path + "/" + element)

            if (stats.isDirectory()) {
                this.readRoutes(path + "/" + element)
            } else {
                this.listenFile(path, element)
            }
        }
    }

    /**
     * Se analizan los archivos para determinar el método de llamada al EndPoint que se construyen basándose en la estructura jerárquica de los directorios que lo contienen
     * @param {String} path Directorio en el cual se buscaran los controladores de la petición
     * @param {String} file Controlador o configuración de la petición
     */
    listenFile(path, file) {
        if (!this.methods.includes(file)) {
            return
        }

        let url = path.replace("./lib/routes", "")
        const method = file.split(".")[0].toUpperCase()

        /**
         * Para conocer la configuración de los archivos "config.json" lea "/dev/config_file.notes"
         */
        let options = null
        if (fs.existsSync(`${path}/config.json`)) {
            options = require(`${path.replace("./lib/", "package:/")}/config.json`)
            options = options[method]
        }

        url = options?.rewrite ?? url

        // Se cargan todos los middlewares que este controlador necesita
        const middlewares = []

        for (const middleware in this.middlewares) {
            // El middleware businessValidator solo se aplica a los administradores
            if (middleware === "businessValidator") {
                // TODO: cambiar a que si no tiene el nombre de administrador debe saltárselo
                if (url.includes(`/${process.env.CLIENT_NAME}/`)) {
                    continue
                }
            }

            if (!options?.exclude) {
                middlewares.push(this.middlewares[middleware])
            } else {
                if (!options.exclude.includes(middleware)) {
                    middlewares.push(this.middlewares[middleware])
                }
            }

            if (options?.fileManager) {
                middlewares.push(this.upload.single("ARCHIVO"))
            }
        }

        if (options?.params) {
            url = `${url}/:${options.params.join("/:")}`
        }

        switch (method) {
        case "GET":
            this.app.get(url, middlewares, require(`${path.replace("./lib/", "package:/")}/${file}`))
            break
        case "POST":
            this.app.post(url, middlewares, require(`${path.replace("./lib/", "package:/")}/${file}`))
            break
        case "PUT":
            this.app.put(url, middlewares, require(`${path.replace("./lib/", "package:/")}/${file}`))
            break
        case "DELETE":
            this.app.delete(url, middlewares, require(`${path.replace("./lib/", "package:/")}/${file}`))
            break
        }
    }

    /**
     * La aplicación empieza a escuchar peticiones HTTP
     */
    listen() {
        this.app.use(require("package:/middleware/404"))
        this.server.listen(process.env.PORT_A, () => {
            console.log(
                styleText("grey", "Express corriendo en"),
                styleText("white", `${process.env.HOST}:${process.env.PORT_A}\n`)
            )
        })
    }
}

module.exports = ExpressServer
