const fs = require("fs")

const compression = require("compression")
const express = require("express")
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

    /**
     * Valida la sesión de los clientes
     */
    validateSession = require("package:/middleware/validate_session")

    /// Métodos permitidos para construir los endPoints
    entryDelete = ["get.js", "post.js", "put.js", "delete.js", "path.js"]

    /// EndPoint que no necesitan validar sesiones de empresa
    noBusiness = require("package:/extras/no_business.json")

    /// EndPoint que no necesitan validar sesiones de usuario
    noSession = require("package:/extras/no_session.json")

    /**
     * Se configuran todos los middlewares del servidor que no tienes relación con la sesión del usuario
     */
    middlewares() {
        this.app.use(express.json())
        this.app.use(compression())
        this.app.use(cors())

        this.app.use(require("package:/middleware/request_helpers"))
        this.app.use(require("package:/middleware/headers"))
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
    /// Los endpoint que requieren parámetros incrustados en la url de la petición se
    /// se construyen basándose en el nombre del directorio, estos parámetros se pueden
    /// incluir encapsulados en corchetes "[]" y los parámetros que sean opcionales
    /// se marcan un signo de gato "#" al final del parámetro
    /// en este ejemplo se construye un endpoint que recibe un ID de producto y un
    /// código de barras opcional.
    /// PATH del directorio: ./lib/routes/productos[id][código#]
    /// URL final del endpoint: /productos/:ID/:CÓDIGO?
    listenFile(path, file) {
        if (file.split(".")[1] !== "js") return
        console.log(file)

        let url = path.replace("./lib/routes", "")

        for (const iterator of this.entryDelete) {
            if (path.includes(iterator)) {
                url = url.replace(iterator, "")
                break
            }
        }

        if (url.includes("[")) {
            url = url.replace(/\[/g, "/:").replace(/\]/g, "")
                // eslint-disable-next-line no-useless-escape
                .substring(0, url.length - 1).replace(/\#/g, "?")
                .replace(/\/:(\w+)/g, (_, palabra) => "/:" + palabra.toUpperCase())
        }

        const middlewares = []

        /// Si el endpoint necesita validar una sesión de USUARIO se incluye el middleware a la solicitud
        let excludeSession = this.noSession.includes(`${file.toUpperCase().replace(".JS", "")} - ${url}`)

        if (!excludeSession) {
            excludeSession = this.noSession.includes(url)
        }

        if (!excludeSession) {
            middlewares.push(this.validateSession)
        }

        /// Si el endpoint necesita validar una sesión de EMPRESA se incluye el middleware a la solicitud
        if (url.includes(`/${process.env.CLIENT_VERSION}/`)) {
            let excludeBusiness = this.noBusiness.includes(`${file.toUpperCase().replace(".JS", "")} - ${url}`)

            if (!excludeBusiness) {
                excludeBusiness = this.noBusiness.includes(url)
            }

            if (!excludeBusiness) {
                // middlewares.push(validateBusiness)
            }
        }

        const endPoint = require(path.replace("./lib/", "package:/"))

        switch (file) {
        case "get.js":
            this.app.get(url, middlewares, endPoint)
            break
        case "post.js":
            this.app.post(url, middlewares, endPoint)
            break
        case "put.js":
            this.app.put(url, middlewares, endPoint)
            break
        case "delete.js":
            this.app.delete(url, middlewares, endPoint)
            break
        case "path.js":
            this.app.delete(url, middlewares, endPoint)
            break
        }
    }

    listen() {
        this.server.listen(process.env.PORT, () => {
            console.log(
                styleText("grey", "Express corriendo en"),
                styleText("white", `${process.env.HOST}:${process.env.PORT}\n`)
            )
        })
    }
}

module.exports = ExpressServer
