const bcrypt = require("bcrypt")

class CypherPassword {
    userPassword
    salt = 12

    /**
     * @param {String} userPassword Contraseña sin cifrar
     */
    constructor(userPassword) {
        this.userPassword = userPassword
    }

    /**
     * @returns {Promise<String>} Devuelve la contraseña cifrada
     */
    async encrypt() {
        return new Promise((_resolve, _reject) => {
            bcrypt.hash(this.userPassword, this.salt, (__, hash) => _resolve(hash))
        })
    }

    /**
     * Valida si la contraseña pasada en el constructor y passwordSave son correctas
     * @param {String} passwordSave Contraseña cifrada
     * @returns {Promise<boolean>}
     */
    async validate(passwordSave) {
        return new Promise((_resolve, _reject) => {
            bcrypt.compare(this.userPassword, passwordSave, (__, result) => {
                if (result) {
                    return _resolve(true)
                } else {
                    return _resolve(false)
                }
            })
        })
    }
}

module.exports = CypherPassword
