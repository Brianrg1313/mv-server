const { validateText } = require("package:/helpers/tools")

class Validador {
    static #variables = require("package:/extras/rules")

    /**
     * Al finalizar la validación indica el resultado. Si uno de los datos es invalido status será falso
     */
    status = true
    /**
     * @type {Number | null}
     * Índica el código del error, este código hace referencia a los errores de "/lib/l10n/inputs/"
     */
    errorCode = null

    /**
     * @type {Number | null}
     * Indica si el error fue del cliente o del servidor (400 || 500)
     */
    serverCode = null

    /**
     * Datos validados y formateados
     */
    data = {}
    /**
     * Sin validar
     */
    inputs = {}
    /**
     * Datos inválidos no obligatorios
     */
    leftovers = {}

    /**
     * Reglas de validación globales
     */
    rules = {}

    /**
     * Reglas recibidas por el cliente para validar datos fuera de las #variables
     */
    dynamicRules = {}

    /**
     * Claves de datos obligatorios
     */
    #mandatory = []

    /**
     * Valida una lista de datos con clave y valor
     * @param {JSON} inputs Datos a validar
     */
    constructor(inputs) {
        if (inputs == null || inputs.length === 0) {
            this.status = false
            this.errorCode = 7
            this.serverCode = 400
            return
        }

        this.inputs = inputs
    }

    /**
     * Valida todos los datos de forma obligatoria
     * @param {JSON} rules Datos a validar
     */
    run(rules) {
        const newRules = {}

        for (const k of rules) {
            newRules[k] = true
        }

        this.runMandatory(newRules)
    }

    /**
     * Inicia la validación de los datos recibidos en el constructor
     * @param {*} inputRules Un objeto Clave(String) Valor(boolean) que indica cuales de los datos son obligatorios y cuales no
     */
    runMandatory(inputs) {
        if (inputs == null || inputs.length === 0) {
            this.status = false
            this.errorCode = 6
            this.serverCode = 500
            return
        }

        this.#cleanRules(inputs)
        this.#analyze()

        if (!this.status) {
            return
        }

        for (const key of this.#mandatory) {
            if (this.data[key] === undefined || this.data[key] == null) {
                this.status = false
                this.errorCode = 5
                this.serverCode = 400
                break
            }
        }
    }

    /**
     * Inicia la validación de los datos recibidos en el constructor
     * @param {*} rules Un objeto Clave(String) Valor(boolean) que indica cuales de los datos son obligatorios y cuales no
     */
    runWithoutRules(rules) {
        if (rules == null || rules.length === 0) {
            this.status = false
            this.errorCode = 6
            this.serverCode = 500
            return
        }

        for (const key in rules) {
            if (Validador.#variables[key]) continue
            this.dynamicRules[key] = rules[key]
            this.dynamicRules[key].error = 10
            rules[key] = true
        }

        this.#cleanRules(rules)
        this.#analyze()

        if (!this.status) {
            return
        }

        for (const key of this.#mandatory) {
            if (this.data[key] === undefined || this.data[key] == null) {
                this.status = false
                this.errorCode = 5
                this.serverCode = 400
                break
            }
        }
    }

    /**
     * INPUT, MANDATORY
     * @param {Object<string, bool>} rules
     */
    #cleanRules(inputs) {
        for (const input in inputs) {
            let minInput = input.toLocaleLowerCase()

            if (Validador.#variables[input] !== undefined) {
                if (Validador.#variables[input].key !== undefined) {
                    minInput = Validador.#variables[input].key
                }
            }

            if (!this.#mandatory.includes(minInput)) {
                if (inputs[input]) {
                    this.#mandatory.push(minInput)
                }
            }

            if (Validador.#variables[input]) {
                this.rules[input] = Validador.#variables[input]
            } else if (this.dynamicRules[input]) {
                this.rules[input] = this.dynamicRules[input]
            } else {
                this.status = false
                this.errorCode = 8
                this.serverCode = 500
                break
            }

            if (!this.rules[input].type) {
                this.rules[input].type = "text"
            }

            if (!this.rules[input].pattern) {
                this.rules[input].pattern = Validador.#types[this.rules[input].type].pattern
            }

            if (!this.rules[input].min) {
                this.rules[input].min = Validador.#types[this.rules[input].type].min
            }

            if (!this.rules[input].max) {
                this.rules[input].max = Validador.#types[this.rules[input].type].max
            }

            if (this.rules[input].type === "enum") {
                if (this.rules[input].pattern !== "IGNORE") {
                    const enums = this.rules[input].pattern.split(",")
                    this.rules[input].pattern = []

                    for (const i of enums) {
                        if (!this.rules[input].pattern.includes(i)) {
                            this.rules[input].pattern.push(`${i}`.trim().toUpperCase())
                        }
                    }
                }
            }

            if (this.rules[input].lowerCase === undefined) {
                this.rules[input].lowerCase = Validador.#types[this.rules[input].type].lowerCase
            }
        }
    }

    #analyze() {
        for (const k in this.inputs) {
            if (this.rules[k] == null || this.rules[k] === undefined) {
                this.leftovers[k] = this.inputs[k]
                continue
            }

            if (!this.status) {
                break
            }

            switch (this.rules[k].type) {
            case "text":
                this.#validateText(k)
                break
            case "email":
                this.#validateEmail(k)
                break
            case "double":
                this.#validateDouble(k)
                break
            case "numeric":
                this.#validateNumeric(k)
                break
            case "enum":
                this.#validateEnum(k)
                break
            case "boolean":
                this.#validateBool(k)
                break
            case "list":
                this.#validateList(k)
                break

            default:
                this.#validateText(k)
                break
            }
        }
    }

    #validateList(k) {
        const value = this.inputs[k]

        if (typeof value !== "object") {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 2
            this.serverCode = 400
            return
        }

        for (const item of value) {
            if (item == null || item === undefined) {
                this.status = false
                this.errorCode = this.rules[k].error + "_" + 1
                this.serverCode = 400
                break
            }

            if (!validateText(item, this.rules[k].pattern)) {
                this.status = false
                this.errorCode = this.rules[k].error + "_" + 2
                this.serverCode = 400
                break
            }

            if (item.length < this.rules[k].min) {
                this.status = false
                this.errorCode = this.rules[k].error + "_" + 3
                this.serverCode = 400
                break
            }

            if (item.length > this.rules[k].max) {
                this.status = false
                this.errorCode = this.rules[k].error + "_" + 4
                this.serverCode = 400
                break
            }

            if (this.rules[k].key == null || this.rules[k].key === undefined) {
                this.leftovers[k] = this.inputs[k]
                break
            }

            if (!this.data[this.rules[k].key]) {
                this.data[this.rules[k].key] = []
            }

            if (this.rules[k].lowerCase) {
                this.data[this.rules[k].key].push(item.toLocaleLowerCase())
            } else {
                this.data[this.rules[k].key].push(item)
            }
        }
    }

    #validateBool(k) {
        const value = parseInt(this.inputs[k])

        if (value === 1 || value === 0) {
            this.data[this.rules[k].key] = value
            return
        }

        this.status = false
        this.errorCode = this.rules[k].error + "_" + 2
        this.serverCode = 400
    }

    #validateText(k) {
        const value = this.inputs[k]

        if (value == null || value === undefined) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 1
            this.serverCode = 400
            return
        }

        if (!validateText(value, this.rules[k].pattern)) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 2
            this.serverCode = 400
            return
        }

        if (value.length < this.rules[k].min) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 3
            this.serverCode = 400
            return
        }

        if (value.length > this.rules[k].max) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 4
            this.serverCode = 400
            return
        }

        if (this.rules[k].key == null || this.rules[k].key === undefined) {
            this.leftovers[k] = this.inputs[k]
            return
        }

        if (this.rules[k].lowerCase) {
            this.data[this.rules[k].key] = `${value}`.toLocaleLowerCase()
        } else {
            this.data[this.rules[k].key] = `${value}`
        }
    }

    #validateEmail(k) {
        const value = this.inputs[k]

        if (value == null || value === undefined) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 1
            this.serverCode = 400
            return
        }

        if (!value.includes("@")) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 4
            this.serverCode = 400
            return
        }

        if (value.split("@").length > 2) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 5
            this.serverCode = 400
            return
        }

        const username = value.split("@")[0]
        const domain = value.split("@")[1]

        if (!validateText(username, "A-Za-z0-9_\\-.")) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 6
            this.serverCode = 400
            return
        }

        if (!validateText(domain, "A-Za-z0-9_\\-.")) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 7
            this.serverCode = 400
            return
        }

        if (value.length < 7) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 3
            this.serverCode = 400
            return
        }

        if (value.length > 255) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 4
            this.serverCode = 400
            return
        }

        if (this.rules[k].key == null || this.rules[k].key === undefined) {
            this.leftovers[k] = this.inputs[k]
            return
        }

        if (this.rules[k].lowerCase) {
            this.data[this.rules[k].key] = `${value}`.toLocaleLowerCase()
        } else {
            this.data[this.rules[k].key] = `${value}`
        }
    }

    #validateDouble(k) {
        const value = this.inputs[k]

        if (value == null || value === undefined) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 1
            this.serverCode = 400
            return
        }

        if (!validateText(value, "0-9.,")) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 2
            this.serverCode = 400
            return
        }

        if (value.length < this.rules[k].min) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 3
            this.serverCode = 400
            return
        }

        if (value.length > this.rules[k].max) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 4
            this.serverCode = 400
            return
        }

        if (this.rules[k].key == null || this.rules[k].key === undefined) {
            this.leftovers[k] = parseFloat(this.inputs[k])
            return
        }

        this.data[this.rules[k].key] = parseFloat(value)
    }

    #validateNumeric(k) {
        const value = this.inputs[k]

        if (value == null || value === undefined) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 1
            this.serverCode = 400
            return
        }

        if (!validateText(value, "0-9.")) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 2
            this.serverCode = 400
            return
        }

        if (value.length < this.rules[k].min) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 3
            this.serverCode = 400
            return
        }

        if (value.length > this.rules[k].max) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 4
            this.serverCode = 400
            return
        }

        if (this.rules[k].key == null || this.rules[k].key === undefined) {
            this.leftovers[k] = parseInt(this.inputs[k])
            return
        }

        this.data[this.rules[k].key] = parseInt(value)
    }

    #validateEnum(k) {
        const value = this.inputs[k].toUpperCase()

        if (value == null || value === undefined) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 1
            this.serverCode = 400
            return
        }

        if (value.length < this.rules[k].min) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 3
            this.serverCode = 400
            return
        }

        if (value.length > this.rules[k].max) {
            this.status = false
            this.errorCode = this.rules[k].error + "_" + 4
            this.serverCode = 400
            return
        }

        if (this.rules[k].pattern !== "IGNORE") {
            if (!this.rules[k].pattern.includes(value)) {
                this.status = false
                this.errorCode = this.rules[k].error + "_" + 2
                this.serverCode = 400
                return
            }
        }

        if (this.rules[k].key == null || this.rules[k].key === undefined) {
            this.leftovers[k] = parseFloat(this.inputs[k])
            return
        }

        if (this.rules[k].lowerCase) {
            this.data[this.rules[k].key] = value.toLocaleLowerCase()
        } else {
            this.data[this.rules[k].key] = value
        }
    }

    static #types = {
        text: {
            pattern: "IGNORE",
            min: 1,
            max: 65535,
            lowerCase: true
        },
        numeric: {
            pattern: "0-9",
            min: 1,
            max: 11,
            lowerCase: false
        },
        mv: {
            pattern: "0-5",
            min: 1,
            max: 1,
            lowerCase: false
        },
        double: {
            pattern: "0-9.,",
            min: 1,
            max: 15,
            lowerCase: false
        },
        enum: {
            pattern: "IGNORE",
            min: 1,
            max: 255,
            lowerCase: true
        },
        email: {
            pattern: "A-Z@a-z0-9_\\-.",
            min: 7,
            max: 255,
            lowerCase: true
        },
        boolean: {
            pattern: "01",
            min: 1,
            max: 1,
            lowerCase: false
        }
    }
}

module.exports = Validador
