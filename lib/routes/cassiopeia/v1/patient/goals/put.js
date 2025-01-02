const Validator = require("package:/helpers/validator")
const RecordModel = require("package:/models/record/record")
const PatientModel = require("package:/models/patient/patient")
const PatientListModel = require("package:/models/patient_list")

module.exports = async (context) => {
    // Verificar que el body de la petición no este vacío
    if (context.isEmpty()) {
        return context.decline(5, 400, "La petición esta vacía")
    }

    const validator = new Validator(context.body)

    // Variables a registrar
    validator.runMandatory({
        USUARIO: true,
        VARIABLE: true,
        VARIABLE_VALOR: false,
        SEMANA: false
    })

    if (!validator.status) {
        return context.decline(
            validator.errorCode,
            validator.serverCode,
            "Hubo un error al validar los datos"
        )
    }

    const variable = validator.data.variable
    const username = validator.data.usuario
    delete validator.data.variable
    delete validator.data.usuario

    if (Object.keys(validator.data).length === 0) {
        return context.decline(9, 400, "No se ha enviado ningun dato")
    }

    const patient = await PatientModel.fromUsername(username)

    if (!patient) {
        return context.decline(36, 404, "Este paciente no existe o no está disponible")
    }

    const record = new RecordModel(patient.id)

    let goals = await record.getAllGoals()
    let insert = false

    if (!goals) {
        insert = true
        goals = {}
    }

    if (!goals[variable]) {
        goals[variable] = {}
        goals[variable].a = context.session.id
        goals[variable].f = new Date()
    }

    if (validator.data.semana) {
        goals[variable].s = validator.data.semana
    }

    if (validator.data.value) {
        goals[variable].m = validator.data.value
    }

    await record.updateGoals(goals, { insert })

    const data = await record.getAllRecord()

    const initial = data?.[variable]?.[1]?.v ?? null

    const response = {
        meta: {
            id: variable,
            meta: goals[variable].m,
            semana: goals[variable].s
        },
        ficha: {}
    }

    if (initial) {
        // Ingresa los datos en la ficha medica
        const result = await record.update({ [variable]: initial }, 1, { admin: context.session.id })

        if (result) {
            for (const item in result) {
                if (!response.ficha[item]) {
                    response.ficha[item] = {}
                }

                for (const week in result[item]) {
                    response.ficha[item][week] = result[item][week].v
                }
            }
        }

        const patientList = new PatientListModel()

        await patientList.removeFromCache(patient.id)
    }

    return context.finish(response)
}
