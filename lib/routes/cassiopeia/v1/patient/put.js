const Validator = require("package:/helpers/validator")
const PatientModel = require("package:/models/patient/patient")
const PatientListModel = require("package:/models/patient_list")

/**
 * Editar la información de un paciente
 * @param {Request} context
 */
module.exports = async (context) => {
    // TODO permisos para crear pacientes

    // Verificar que el body de la petición no este vació
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    // El usuario se incorpora con los datos a validar
    context.body.USUARIO = context.params.patient

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({
        USUARIO: true,
        NOMBRE: false,
        APELLIDO: false,
        CORREO: false,
        TELEFONO: false,
        TDNI: false,
        DNI: false,
        NACIMIENTO: false,
        SEXO: false,
        FECHA_INICIO: false,
        TALLA: false,
        PAIS: false,
        CIUDAD: false,
        PARROQUIA: false
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "La información del paciente es invalida"
        )
    }

    const data = validator.data

    // Buscamos al paciente en la base de datos
    const patient = await PatientModel.fromUsername(data.usuario)

    if (!patient) {
        return context.decline(36, 404, "Este paciente no existe o no está disponible")
    }

    delete data.usuario

    const identity = await PatientModel.validateIdentity(data.dni, data.correo, data.usuario, data.telefono)

    if (identity) {
        return context.decline(identity, 401, "El usuario ya existe")
    }

    if (Object.keys(data).length === 0) {
        return context.finish("")
    }

    patient.update(data)

    const patientList = new PatientListModel()

    await patientList.removeFromCache(patient.id)

    return context.finish(data)
}
