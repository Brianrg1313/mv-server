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
    static rules = {}

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
     * @param {*} rules Un objeto Clave(String) Valor(boolean) que indica cuales de los datos son obligatorios y cuales no
     */
    runMandatory(rules) {
        if (rules == null || rules.length === 0) {
            this.status = false
            this.errorCode = 6
            this.serverCode = 500
            return
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
            Validador.#variables[key] = rules[key]
            Validador.#variables[key].error = 10
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

    #cleanRules(rules) {
        for (const rule in rules) {
            if (Validador.#variables[rule]) {
                Validador.rules[rule] = Validador.#variables[rule]

                if (Validador.rules[rule] !== undefined) {
                    continue
                }

                if (!Validador.rules[rule].type) {
                    Validador.rules[rule].type = "text"
                }

                if (!Validador.rules[rule].pattern) {
                    Validador.rules[rule].pattern = Validador.#types[Validador.rules[rule].type].pattern
                }

                if (!Validador.rules[rule].min) {
                    Validador.rules[rule].min = Validador.#types[Validador.rules[rule].type].min
                }

                if (!Validador.rules[rule].max) {
                    Validador.rules[rule].max = Validador.#types[Validador.rules[rule].type].max
                }

                if (Validador.rules[rule].type === "enum") {
                    if (Validador.rules[rule].pattern !== "IGNORE") {
                        const enums = Validador.rules[rule].pattern.split(",")
                        Validador.rules[rule].pattern = []

                        for (const i of enums) {
                            if (!Validador.rules[rule].pattern.includes(i)) {
                                Validador.rules[rule].pattern.push(`${i}`.trim().toUpperCase())
                            }
                        }
                    }
                }
            } else {
                this.status = false
                this.errorCode = 8
                this.serverCode = 500
                break
            }
        }
    }

    #analyze() {
        for (const k in this.inputs) {
            if (Validador.rules[k] == null || Validador.rules[k] === undefined) {
                this.leftovers[k] = this.inputs[k]
                continue
            }

            if (!this.status) {
                break
            }

            switch (Validador.rules[k].type) {
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
            this.errorCode = Validador.rules[k].error + "_" + 2
            this.serverCode = 400
            return
        }

        for (const item of value) {
            if (item == null || item === undefined) {
                this.status = false
                this.errorCode = Validador.rules[k].error + "_" + 1
                this.serverCode = 400
                break
            }

            if (!validateText(item, Validador.rules[k].pattern)) {
                this.status = false
                this.errorCode = Validador.rules[k].error + "_" + 2
                this.serverCode = 400
                break
            }

            if (item.length < Validador.rules[k].min) {
                this.status = false
                this.errorCode = Validador.rules[k].error + "_" + 3
                this.serverCode = 400
                break
            }

            if (item.length > Validador.rules[k].max) {
                this.status = false
                this.errorCode = Validador.rules[k].error + "_" + 4
                this.serverCode = 400
                break
            }

            if (Validador.rules[k].key == null || Validador.rules[k].key === undefined) {
                this.leftovers[k] = this.inputs[k]
                break
            }

            if (!this.data[Validador.rules[k].key]) {
                this.data[Validador.rules[k].key] = []
            }

            this.data[Validador.rules[k].key].push(item)
        }
    }

    #validateBool(k) {
        const value = this.inputs[k]

        if (value === 1 || value === 0) {
            this.data[Validador.rules[k].key] = value
            return
        }

        this.status = false
        this.errorCode = Validador.rules[k].error + "_" + 2
        this.serverCode = 400
    }

    #validateText(k) {
        const value = this.inputs[k]

        if (value == null || value === undefined) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 1
            this.serverCode = 400
            return
        }

        if (!validateText(value, Validador.rules[k].pattern)) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 2
            this.serverCode = 400
            return
        }

        if (value.length < Validador.rules[k].min) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 3
            this.serverCode = 400
            return
        }

        if (value.length > Validador.rules[k].max) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 4
            this.serverCode = 400
            return
        }

        if (Validador.rules[k].key == null || Validador.rules[k].key === undefined) {
            this.leftovers[k] = this.inputs[k]
            return
        }

        this.data[Validador.rules[k].key] = `${value}`
    }

    #validateEmail(k) {
        const value = this.inputs[k]

        if (value == null || value === undefined) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 1
            this.serverCode = 400
            return
        }

        if (!value.includes("@")) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 4
            this.serverCode = 400
            return
        }

        if (value.split("@").length > 2) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 5
            this.serverCode = 400
            return
        }

        const username = value.split("@")[0]
        const domain = value.split("@")[1]

        if (!validateText(username, "A-Za-z0-9_\\-.")) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 6
            this.serverCode = 400
            return
        }

        if (!validateText(domain, "A-Za-z0-9_\\-.")) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 7
            this.serverCode = 400
            return
        }

        if (value.length < 7) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 3
            this.serverCode = 400
            return
        }

        if (value.length > 255) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 4
            this.serverCode = 400
            return
        }

        if (Validador.rules[k].key == null || Validador.rules[k].key === undefined) {
            this.leftovers[k] = this.inputs[k]
            return
        }

        this.data[Validador.rules[k].key] = `${value}`
    }

    #validateDouble(k) {
        const value = this.inputs[k]

        if (value == null || value === undefined) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 1
            this.serverCode = 400
            return
        }

        if (!validateText(value, "0-9.,")) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 2
            this.serverCode = 400
            return
        }

        if (value.length < Validador.rules[k].min) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 3
            this.serverCode = 400
            return
        }

        if (value.length > Validador.rules[k].max) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 4
            this.serverCode = 400
            return
        }

        if (Validador.rules[k].key == null || Validador.rules[k].key === undefined) {
            this.leftovers[k] = parseFloat(this.inputs[k])
            return
        }

        this.data[Validador.rules[k].key] = parseFloat(value)
    }

    #validateNumeric(k) {
        const value = this.inputs[k]

        if (value == null || value === undefined) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 1
            this.serverCode = 400
            return
        }

        if (!validateText(value, "0-9")) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 2
            this.serverCode = 400
            return
        }

        if (value.length < Validador.rules[k].min) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 3
            this.serverCode = 400
            return
        }

        if (value.length > Validador.rules[k].max) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 4
            this.serverCode = 400
            return
        }

        if (Validador.rules[k].key == null || Validador.rules[k].key === undefined) {
            this.leftovers[k] = parseInt(this.inputs[k])
            return
        }

        this.data[Validador.rules[k].key] = parseInt(value)
    }

    #validateEnum(k) {
        const value = this.inputs[k].toUpperCase()

        if (value == null || value === undefined) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 1
            this.serverCode = 400
            return
        }

        if (value.length < Validador.rules[k].min) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 3
            this.serverCode = 400
            return
        }

        if (value.length > Validador.rules[k].max) {
            this.status = false
            this.errorCode = Validador.rules[k].error + "_" + 4
            this.serverCode = 400
            return
        }

        if (Validador.rules[k].pattern !== "IGNORE") {
            if (!Validador.rules[k].pattern.includes(value)) {
                this.status = false
                this.errorCode = Validador.rules[k].error + "_" + 2
                this.serverCode = 400
                return
            }
        }

        if (Validador.rules[k].key == null || Validador.rules[k].key === undefined) {
            this.leftovers[k] = parseFloat(this.inputs[k])
            return
        }

        this.data[Validador.rules[k].key] = value
    }

    static #types = {
        text: {
            pattern: "IGNORE",
            min: 1,
            max: 65535
        },
        numeric: {
            pattern: "0-9",
            min: 1,
            max: 11
        },
        mv: {
            pattern: "0-5",
            min: 1,
            max: 1
        },
        double: {
            pattern: "0-9.,",
            min: 1,
            max: 15
        },
        enum: {
            pattern: "IGNORE",
            min: 1,
            max: 255
        },
        email: {
            pattern: "A-Z@a-z0-9_\\-.",
            min: 7,
            max: 255
        },
        boolean: {
            pattern: "01",
            min: 1,
            max: 1
        }
    }
}

module.exports = Validador
