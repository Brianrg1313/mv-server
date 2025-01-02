const { createClient } = require("redis")

class Redis {
    static #ready = false
    static #connection = null
    static #status = false
    static status = "disabled"

    static enable = process.env.REDIS

    constructor() {
        if (Redis.enable === "false") {
            return
        }

        if (Redis.#ready) {
            return
        }

        Redis.#ready = true

        Redis.#connection = createClient()

        Redis.#connection.on("error", this.error)
        Redis.#connection.on("ready", this.ok)
        Redis.#connection.on("end", this.end)

        Redis.#connection.connect()
    }

    error(_) {
        Redis.#status = false
        Redis.status = "disconnect"
        console.error("Error en redis")
    }

    end() {
        Redis.#status = false
        Redis.status = "closed"
        console.error("Se cerro la conexión en redis")
    }

    ok() {
        Redis.status = "connected"
        Redis.#status = true
    }

    // #region SET
    async issetInSet(key, item) {
        if (!Redis.#status) {
            return false
        }

        return await Redis.#connection.sIsMember(key, item)
    }

    async insertInSet(key, item) {
        if (!Redis.#status) {
            return false
        }

        return await Redis.#connection.sAdd(key, item)
    }

    // #region HASH
    async issetInHash(table, key) {
        if (!Redis.#status) {
            return false
        }

        return await Redis.#connection.hExists(table, key)
    }

    async findInHash(table, key) {
        if (!Redis.#status) {
            return null
        }

        let data = await Redis.#connection.hGet(table, key)

        if (data) {
            data = JSON.parse(data)
        }

        return data
    }

    async insertInHash(table, key, data) {
        if (!Redis.#status) {
            return false
        }

        return await Redis.#connection.hSet(table, key, JSON.stringify(data))
    }

    async deleteInHash(table, key) {
        if (!Redis.#status) {
            return false
        }

        return await Redis.#connection.hDel(table, key)
    }

    async keysOfHash(table) {
        if (!Redis.#status) {
            return false
        }

        return await Redis.#connection.hKeys(table)
    }
}

module.exports = Redis
