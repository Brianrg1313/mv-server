const Validator = require("package:/helpers/validator")
const RecordModel = require("package:/models/record/record")
const PatientModel = require("package:/models/patient/patient")

const { calculateAge, capitalize } = require("package:/helpers/tools")

module.exports = async (context) => {
    const admin = context.session

    // Verificar que el body de la petición no este vacío
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    // El usuario se incorpora con los datos a validar
    context.body.USUARIO = context.params.patient

    // Se pasan los datos que seran validados
    const validator = new Validator(context.body)

    // TODO: cambio el funcionamiento ahora valida variables {"CLAVE": REGLAS{}} ADAPTAR
    // Se validan los datos
    validator.runWithoutRules(context.body)

    if (!validator.status) {
        // TODO: agregar la variable que fallo
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Hubo un error al validar los datos"
        )
    }

    // Buscamos al paciente en la base de datos
    const patient = await PatientModel.fromUsername(validator.data.usuario)

    if (!patient) {
        return context.decline(36, 404, "Este paciente no existe o no está disponible")
    }

    // Se verifica que el administrador tenga permisos para editar al paciente
    const patientValidator = await admin.validatePatient(patient.id)

    if (!patientValidator) {
        return context.decline(37, 403, "No tiene permisos para editar este paciente")
    }

    const record = new RecordModel(patient.id)

    const data = await record.getAllRecord()
    const goals = await record.getAllGoals()
    const personalData = await patient.personalData()

    const goalsOrder = []
    const recordOrder = {}

    personalData.nombre = capitalize(personalData.nombre)
    personalData.apellido = capitalize(personalData.apellido)
    personalData.edad = calculateAge(new Date(), new Date(personalData.nacimiento))

    const groups = await admin.groupsOfPatient(patient.id)

    // Se ordenan las metas y se eliminan los datos innecesarios
    for (const key in goals) {
        if (goals[key].s || goals[key].m) {
            goalsOrder.push([parseInt(key), goals[key].s, goals[key].m])
        }
    }

    // Se ordenan los datos de la ficha medica y se eliminan los datos innecesarios
    for (const key in data) {
        recordOrder[key] = {}

        for (const week in data[key]) {
            recordOrder[key][week] = data[key][week].v
        }
    }

    return context.finish({
        semana: patient.currentWeek,
        informacion: personalData,
        metas: {
            key: ["id", "semana", "meta"],
            value: goalsOrder
        },
        datos: recordOrder,
        grupos: groups
    })
}
