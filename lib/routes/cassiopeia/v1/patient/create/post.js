const AppModel = require("package:/models/app")
const Validator = require("package:/helpers/validator")
const RecordModel = require("package:/models/record/record")
const PatientModel = require("package:/models/patient/patient")

/**
 * Crea un nuevo paciente
 * @param {Request} context
 */
module.exports = async (context) => {
    const admin = context.session

    const permissions = await admin.getPermissions()

    if (!permissions.patient.create) {
        return context.decline(42, 403, "No tiene los permisos necesarios para crear pacientes")
    }

    // Verificar que el body de la petición no este vació
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({
        NOMBRE: true,
        APELLIDO: true,
        CORREO: true,
        USUARIO: true,
        TELEFONO: true,
        TDNI: true,
        DNI: true,
        NACIMIENTO: true,
        SEXO: true,
        FECHA_INICIO: true,
        TALLA: true,
        PAIS: false,
        CIUDAD: false,
        PARROQUIA: false,
        GRUPO: false
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "La información del paciente es invalida"
        )
    }

    const data = validator.data

    const identity = await PatientModel.validateIdentity(data.dni, data.correo, data.usuario, data.telefono)

    if (identity) {
        return context.decline(identity, 401, "El usuario ya existe")
    }

    data.nacimiento = new Date(data.nacimiento)
    data.fecha_inicio = new Date(data.fecha_inicio)

    const patient = await PatientModel.createPatient(data)

    if (!patient) {
        return context.decline(22, 309, "No se pudo crear el paciente")
    }

    const app = new AppModel()
    const varsToValidate = await app.getVarsValidator(Object.keys(validator.leftovers), context.headers["accept-language"])

    const itemValidator = new Validator(validator.leftovers)

    // TODO: cambio el funcionamiento ahora valida variables {"CLAVE": REGLAS{}} ADAPTAR
    itemValidator.runWithoutRules(varsToValidate)

    if (!itemValidator.status) {
        return context.decline(
            itemValidator.errorCode,
            itemValidator.serverCode,
            "Los datos de la ficha medica son invalidas"
        )
    }

    const record = new RecordModel(patient.id)

    record.update(itemValidator.data, 1, { admin: admin.id })
    admin.createPatient(patient.id, data.gid)

    return context.finish(data.usuario)
}
