const Validator = require("package:/helpers/validator")
const PatientModel = require("package:/models/patient")

/**
 * Crea un nuevo paciente
 * @param {Request} context
 */
module.exports = async (context) => {
    const admin = context.session

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

    const identity = await PatientModel.validateIdentity(data.dni, data.correo, data.usuario, data.telefono)

    if (identity) {
        return context.decline(identity, 401, "El usuario ya existe")
    }

    data.nacimiento = new Date(data.nacimiento)
    data.fecha_inicio = new Date(data.fecha_inicio)

    const extra = {
        talla: null,
        pais: null,
        ciudad: null,
        parroquia: null,
        coordenadas: null,
        profesion: null,
        sangre: null,
        terminos: 0
    }

    for (const key in data) {
        if (extra[key] === null) {
            extra[key] = data[key]
            delete data[key]
        }

        if (typeof data[key] === "string") {
            data[key] = data[key].trim().toLowerCase()
        }
    }

    const patient = await PatientModel.createPatient(data, extra)

    if (!patient) {
        return context.decline(22, 309, "No se pudo crear el paciente")
    }

    admin.createPatient(patient.id)

    return context.finish(data.usuario)
}
