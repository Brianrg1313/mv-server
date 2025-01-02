const SessionModel = require("package:/models/session")
const Databases = require("package:/models/databases")
const Redis = require("package:/servers/redis")

const { genToken } = require("package:/helpers/tools")

/**
 * Se crea token de sesión que identificará al cliente en futuras peticiones
 * @param {PatientModel} client Modelo que da acceso a los datos y métodos del cliente
 * @param {String} deviceToken Identificador del dispositivo en el que se inicia sesión
 * @returns {Promise<String>} Token de sesión ACCESS
 */
module.exports = async (client, deviceToken, type) => {
    const session = new SessionModel()

    const { id } = await session.findDeviceByToken(deviceToken)

    if (!id) {
        return null
    }

    const redis = new Redis()
    let token = null

    while (true) {
        token = [
            "$SSL", // TIPO DE CIFRADO (Manual)
            genToken(), // TOKEN DE REDIS (Automático)
            `${type}48`, // TIPO DE TOKEN Y SU VERSION (Manual)
            genToken(40) // TOKEN DE MYSQL (Automático)
        ]

        if (await redis.issetInHash(Databases.redis.sessions, token[1])) {
            continue
        }

        if (!(await session.issetSession(token.join("-")))) {
            break
        }
    }

    /// Estado del A2F
    /// Al final del token se ingresa un identificador que indica el estado de la sesión.
    /// Ya que este token se envía al usuario y con cada interacción con la API debe enviar
    /// enviarlo de vuelta para relacionar su sesión, el identificador del token solo se usa
    /// como referencia para la propia aplicación del cliente, mientras que el servidor solo se
    /// fiara del estado de la sesión en la base de datos
    /// X0 : sesión validada
    /// X1 : sesión sin validar
    /// X2 : sesión vencida
    /// X3 : sesión destruida
    token.push("X0")

    session.createSession({ tipo: type, uid: client.id, accs: token[3], dispositivo: id })

    return token.join("-")
}
