const { cleanText } = require("package:/helpers/tools")

function filterByText(list, text) {
    const response = []

    for (const patient of list) {
        if (cleanText(`${patient.nombre} ${patient.apellido}`).includes(cleanText(text))) {
            response.push(patient)
        } else if (cleanText(patient.usuario).includes(cleanText(text))) {
            response.push(patient)
        } else if (cleanText(patient.correo).includes(cleanText(text))) {
            response.push(patient)
        }
    }

    return response
}

function filterBySexo(list, sexo) {
    const response = []

    for (const patient of list) {
        if (patient.sexo === sexo) {
            response.push(patient)
        }
    }

    return response
}

function filterByNumber(list, number) {
    const response = []

    number = number.toString()

    for (const patient of list) {
        if (patient.dni.includes(number)) {
            response.push(patient)
        } else if (patient.telefono.includes(number)) {
            response.push(patient)
        }
    }

    return response
}

function paginate(list, page) {
    if (Number.isNaN(page)) {
        page = 1
    }

    const division = 200
    const pages = Math.ceil(list.length / division)

    if (page > pages) {
        page = pages
    }

    let min = (page - 1) * division
    let max = min + division

    if (max > list.length) {
        max = list.length
    }

    if (min > list.length) {
        min = list.length - division
    }

    if (min < 1) {
        min = 0
    }

    return [pages, min, max, page]
}

const OPERADORES = {
    1: "<=",
    2: "==",
    3: ">="
}

module.exports = {
    OPERADORES,
    paginate,
    filterByNumber,
    filterByText,
    filterBySexo
}
