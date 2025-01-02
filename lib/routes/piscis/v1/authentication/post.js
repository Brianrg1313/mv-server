const Validator = require("package:/helpers/validator")
const PatientModel = require("package:/models/patient/patient")
const CypherPassword = require("package:/helpers/cypher_password")

const createSession = require("package:/helpers/session")

const { authenticator } = require("package:/helpers/tools")

/**
 * @param {Request} context
 */
module.exports = async (context) => {
    context.body = authenticator(context.body)

    // Verificar que el body de la petición no este vació
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Métodos de inicio de sesión valido
    validator.runMandatory({
        USUARIO: false,
        CORREO: false,
        TELEFONO: false,
        CONTRASENA: true
    })

    // Verificar que se haya validado el body de la petición correctamente
    // Y si es correcto se asignan a la variable data y se verifica que se haya
    // incluido al menos un validador
    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Información de inicio de sesión invalida"
        )
    }

    const data = validator.data

    if (data.telefono || data.correo || data.usuario || data.dni) {
        // Se elimina la contraseña de la data recibida por el usuario
        // por lo que solo debería quedar el identificador
        const password = data.contrasena
        delete data.contrasena

        // Se obtiene el identificador y el tipo de identificador que se uso
        // para posteriormente realizar la búsqueda en la base de datos
        const loggerKey = Object.keys(data)[0]
        const loggerValue = data[loggerKey]

        const patient = await PatientModel.fromAuthenticator(loggerKey, loggerValue)

        if (!patient) {
            return context.decline(15, 401, `Identificador invalido (${loggerKey})`)
        }

        // TODO: Riesgo de seguridad (Se solicito que sea asi)
        if (password !== "87654321") {
            const passwordSave = await patient.findPassword()

            if (!passwordSave) {
                return context.decline(19, 500, "No hay una contraseña relacionada a este cliente")
            }

            if (passwordSave.length === 0) {
                return context.decline(19, 500, "No hay una contraseña relacionada a este cliente")
            }

            const passwordValidator = new CypherPassword(password)

            const isValid = await passwordValidator.validate(passwordSave.contrasena)

            if (!isValid) {
                return context.decline(20, 401, "Contraseña invalida")
            }
        }

        const token = await createSession(patient, context.headers.device, 1)

        if (!token) {
            return context.decline(21, 500, "No se pudo crear el token de sesión")
        }

        return context.finish(token)
    } else {
        return context.decline(5, 400, "La petición esta vacía")
    }
}
