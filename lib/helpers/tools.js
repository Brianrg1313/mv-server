function validateText(texto, pattern) {
    if (pattern === "IGNORE") {
        return true
    }

    const expression = new RegExp("[" + pattern + "]")

    if (typeof texto === "number") {
        if (expression.test(texto)) {
            return true
        } else {
            return false
        }
    }

    for (let i = 0; i <= texto.length - 1; i++) {
        if (expression.test(texto.charAt(i))) {
            if (i === texto.length - 1) {
                return true
            }
        } else {
            return false
        }
    }
}

/**
 * Identifica el tipo de autentificación que uso el cliente para iniciar sesión
 * @param {Array<String>} body Una lista de datos donde se realizara la búsqueda
 * @returns {String} retorna el tipo de identificador que uso el cliente [CORREO, TELEFONO, DNI, USUARIO]
 */
function authenticator(body) {
    if (!body.AUTENTIFICADOR) {
        return null
    }

    let credential = null

    if (body.AUTENTIFICADOR.includes("@")) {
        credential = "CORREO"
    } else if (body.AUTENTIFICADOR.includes("+")) {
        credential = "TELEFONO"
    } else if (/^\d{3}\.\d{2}\.\d+/.test(body.AUTENTIFICADOR)) {
        // Terminar la validación de los dni
        // País(3).tipo(2).numero
        credential = "DNI"
    } else if (validateText(body.AUTENTIFICADOR, "0-9")) {
        credential = "TELEFONO"
    } else {
        credential = "USUARIO"
    }

    body[credential] = body.AUTENTIFICADOR
    delete body.AUTENTIFICADOR

    return body
}

// Los datos son ordenan para la respuestas, comprimiendo de esta manera se ahorra enviar la misma clave
// para cada producto y en su lugar se envían listas ordenadas por posición respecto a su clave
// {
//     "claves": ["clave1", "clave2", "clave3"],
//     "valores": [
//         ["valor1", "valor2", "valor3"],
//         ["valor1", "valor2", "valor3"],
//         ["valor1", "valor2", "valor3"]
//     ]
// }
// Formato CYV (Claves y valores)
function sortAnswers(headers, data) {
    if (!data) return

    const values = []

    for (const item of data) {
        const value = []
        for (const key in headers) {
            value.push(item[key])
        }
        values.push(value)
    }

    return {
        claves: Object.values(headers),
        valores: values
    }
}

function genToken(length = 15) {
    const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    let token = ""
    let i = 0
    while (i < length) {
        token += c.charAt(Math.floor(Math.random() * c.length))
        i++
    }

    return token
}

function weeks(dateStart, dateEnd = new Date()) {
    dateStart.setHours(0, 0, 0, 0)
    dateEnd.setHours(0, 0, 0, 0)

    let day = dateStart.getDay()

    if (day <= 6) {
        dateStart.setDate(dateStart.getDate() + (6 - day))
    } else {
        dateStart.setDate(dateStart.getDate() + (6 - day + 7))
    }

    day = dateEnd.getDay()

    if (day <= 6) {
        dateEnd.setDate(dateEnd.getDate() + (6 - day))
    } else {
        dateEnd.setDate(dateEnd.getDate() + (6 - day + 7))
    }

    const timeDifference = Math.abs(dateStart.getTime() - dateEnd.getTime())
    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    const week = Math.floor(dayDifference / 7)

    if (week === 0) {
        return 1
    }

    return week
}

function calculateAge(today, birthday) {
    let age = today.getFullYear() - birthday.getFullYear()
    const birthMonth = birthday.getMonth()
    const currentMonth = today.getMonth()

    if (currentMonth < birthMonth || (currentMonth === birthMonth && today.getDate() < birthday.getDate())) {
        age--
    }

    return age
}

function capitalize(text) {
    if (text.length === 0) return text
    return text.charAt(0).toUpperCase() + text.slice(1)
}

/* eslint-disable quote-props */
const abcDir = {
    "01": "A",
    "02": "B",
    "03": "C",
    "04": "D",
    "05": "E",
    "06": "F",
    "07": "G",
    "08": "H",
    "09": "I",
    "10": "J",
    "11": "K",
    "12": "L",
    "13": "M",
    "14": "N",
    "15": "O",
    "16": "P",
    "17": "Q",
    "18": "R",
    "19": "S",
    "20": "T",
    "21": "U",
    "22": "V",
    "23": "W",
    "24": "X",
    "25": "Y",
    "26": "Z"
}

function intToAbc(str) {
    str = str.toString()

    if ((str.length % 2) !== 0) {
        str = "0" + str
    }

    let result = ""
    for (let i = 0; i < str.length; i += 2) {
        result += abcDir[str.substr(i, 2)]
    }

    return result
}

function nextAbbr(str) {
    str = str.toString()
    if ((str.length % 2) !== 0) {
        str = "0" + str
    }

    const p = []
    for (let i = 0; i < str.length; i += 2) {
        p.push(parseInt(str.substr(i, 2)))
    }

    if (p[p.length - 1] === 26) {
        const last = p[p.length - 2]

        if (last) {
            if (last === 26) {
                p[p.length - 1] = 1
                p.push(1)
            } else {
                p[p.length - 1] = 1
                p[p.length - 2]++
            }
        } else {
            p[p.length - 1] = 1
            p.push(1)
        }
    } else {
        p[p.length - 1]++
    }

    let result = ""

    for (const abbr of p) {
        if (abbr < 10) {
            result += "0" + abbr
        } else {
            result += abbr
        }
    }

    if (result[0] === "0") {
        result = result.substr(1)
    }

    return result
}

function cleanText(text) {
    if (text === null || text === undefined) return ""
    if (typeof text !== "string") {
        text = text.toString()
    }
    let cleanedText = text.toLowerCase()
    cleanedText = cleanedText.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    cleanedText = cleanedText.trim().replace(/\s+/g, " ")
    return cleanedText
}

const VARIABLES = {
    id: 0,
    nombre: 1,
    apellido: 2,
    usuario: 4,
    dni: 6,
    correo: 3,
    telefono: 7,
    nacimiento: 8,
    sexo: 9,
    fecha_inicio: 12,
    edad: 400,
    semana: 500,
    peso: 22,
    grasa: 23
}

module.exports = {
    VARIABLES,
    authenticator,
    validateText,
    calculateAge,
    sortAnswers,
    capitalize,
    cleanText,
    genToken,
    intToAbc,
    nextAbbr,
    weeks
}
