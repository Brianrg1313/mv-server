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

    return week
}

module.exports = {
    authenticator,
    validateText,
    sortAnswers,
    genToken,
    weeks
}
