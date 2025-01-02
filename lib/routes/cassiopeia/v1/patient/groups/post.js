const Validator = require("package:/helpers/validator")
const PatientModel = require("package:/models/patient/patient")

module.exports = async (context) => {
    const admin = context.session

    // Verificar que el body de la petición no este vacío
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({
        USUARIO: true,
        GRUPO: true
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Hubo un error al validar los datos"
        )
    }

    const patient = await PatientModel.fromUsername(validator.data.usuario)

    if (!patient) {
        return context.decline(36, 404, "Este paciente no existe o no está disponible")
    }

    admin.addPatientToGroup(patient.id, validator.data.gid)

    return context.finish("")
}
