const AppModel = require("package:/models/app")
const Validator = require("package:/helpers/validator")
const RecordModel = require("package:/models/record")
const PatientModel = require("package:/models/patient")

/**
 * El admin modifica los datos de la ficha medica de un paciente
 * @param {Request} context
 */
module.exports = async (context) => {
    const admin = context.session

    // Verificar que el body de la petición no este vacío
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    // Ya que las variables de la ficha medica son dinámicas y auto generadas sus datos para ser validadas están guardadas en una base de datos
    const app = new AppModel()
    const varsToValidate = await app.getVarsValidator(Object.keys(context.body), context.headers["accept-language"])

    // El usuario se incorpora con los datos a validar
    context.body.USUARIO = context.params.patient

    // Se pasan los datos que seran validados
    const validator = new Validator(context.body)

    // El identificador del usuario no es una variable dinamica, por lo que se agrega a las reglas de validacion de forma manual
    varsToValidate.USUARIO = null

    // Si se declara la semana que se asignaran a los datos, esta tambien debe ser validada
    if (context.body.SEMANA) {
        varsToValidate.SEMANA = null
    }

    // Se validan los datos
    validator.runWithoutRules(varsToValidate)

    if (!validator.status) {
        // TODO: agregar la variable que fallo
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Hubo un error al validar los datos"
        )
    }

    const data = validator.data

    // Buscamos al paciente en la base de datos
    const patient = await PatientModel.fromUsername(data.usuario)

    if (!patient) {
        return context.decline(36, 404, "Este paciente no existe o no está disponible")
    }

    // Se verifica que el administrador tenga permisos para editar al paciente
    const patientValidator = await admin.validatePatient(patient.id)

    return context.finish(patientValidator)
}
