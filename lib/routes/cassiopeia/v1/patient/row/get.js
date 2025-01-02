const Validator = require("package:/helpers/validator")
const PatientModel = require("package:/models/patient/patient")
const PatientListModel = require("package:/models/patient_list")

const { VARIABLES } = require("package:/helpers/tools")

module.exports = async (context) => {
    const admin = context.session
    const permissions = await admin.getPermissions()

    if (!permissions.patient.watch) {
        return context.decline(42, 403, "No tiene permisos para ver información personal de los pacientes")
    }

    // Verificar que el body de la petición no este vació
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.params)

    // Variables a registrar
    validator.runMandatory({ USUARIO: true })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "El nombre de usuario del paciente es invalido"
        )
    }

    const patient = await PatientModel.fromUsername(validator.data.usuario)

    if (!patient) {
        return context.decline(36, 404, "Este paciente no existe o no está disponible")
    }

    const validate = await admin.validatePatient(patient.id)

    if (!validate) {
        return context.decline(42, 403, "No tiene acceso a este paciente")
    }

    const patientList = new PatientListModel()

    const variables = await admin.variableList()

    // El orden de las claves es importante ya que este determina el valor de los datos enviados al cliente asignados por posicionamiento de los valores
    // ejemplo:
    // ["id", "nombre", "apellido"]
    // [ 1  , "Brian" , "Rangel"  ]
    const keys = [
        VARIABLES.nombre,
        VARIABLES.usuario,
        VARIABLES.edad,
        VARIABLES.semana,
        ...variables
    ]

    const data = await patient.personalData()
    data.id = patient.id

    const row = await patientList.patientRow(data, keys, true)

    if (!row) {
        return context.decline(44, 409, "No se pudo obtener la información del paciente")
    }

    const response = {}

    for (const key of keys) {
        response[key] = row[key] ?? null
    }

    return context.finish(response)
}
