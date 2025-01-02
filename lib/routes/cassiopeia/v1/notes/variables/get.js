const AppModel = require("package:/models/app")
const Validator = require("package:/helpers/validator")
const PatientModel = require("package:/models/patient/patient")
const FastDataModel = require("package:/models/fast_data")

/**
 * Devuelve al cliente las notas de ayuda para calificar una variable
 * @param {Request} context
 */
module.exports = async (context) => {
    const admin = context.session
    // Verificar que el body de la petición no este vacío
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    // Se pasan los datos que seran validados
    const validator = new Validator(context.params)

    // Se validan los datos
    validator.runMandatory(context.params)

    if (!validator.status) {
        // TODO: agregar la variable que fallo
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Hubo un error al validar la variable recibida en los params"
        )
    }

    const data = validator.data

    // Buscamos al paciente en la base de datos
    const patient = await PatientModel.fromUsername(data.usuario)

    if (!patient) {
        return context.decline(36, 404, "Este paciente no existe o no está disponible")
    }

    delete data.usuario

    // Se verifica que el administrador tenga permisos para editar al paciente
    const patientValidator = await admin.validatePatient(patient.id)

    if (!patientValidator) {
        return context.decline(37, 403, "No tiene permisos para editar este paciente")
    }

    const app = new AppModel()

    const varValidator = await app.validateVariable(data.variable)

    if (!varValidator) {
        return context.decline(45, 404, "No existe la variable")
    }

    const variableNotes = await app.getVariablesNotes(patient.id, data.variable)

    if (!variableNotes) {
        return context.finish(null)
    }

    const fastData = new FastDataModel()

    const response = {
        claves: ["id", "admin", "texto", "fecha"],
        valores: []
    }

    for (const item of variableNotes) {
        item.admin = await fastData.adminNames(item.aid)

        response.valores.push([
            item.id,
            item.admin,
            item.texto,
            item.fecha
        ])
    }

    return context.finish(response)
}
