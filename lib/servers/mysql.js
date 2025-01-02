const mysql = require("mysql2/promise")
const escape = require("sqlutils/mysql/escape")

const { styleText } = require("node:util")

class MySql {
    // Mapa con Pool de conexiones, cada base de datos tiene su propio Pool
    // {"BaseDeDatos1": Pool, "BaseDeDatos2": Pool, ...}
    static connections = new Map()
    static limit = 10

    constructor(db) {
        this.database = db
    }

    // #region Connection
    async connect() {
        let currentPool = MySql.connections.get(this.database)

        if (!currentPool) {
            currentPool = mysql.createPool({
                charset: "utf8mb4",
                user: process.env.MYSQL_USER,
                database: this.database,
                host: process.env.MYSQL_HOST,
                connectionLimit: MySql.limit,
                password: process.env.MYSQL_PASSWORD,
                multipleStatements: true
            })

            MySql.connections.set(this.database, currentPool)
        }

        if (MySql.limit === currentPool.pool._allConnections.length) {
            console.log(styleText("yellow", "\n CONEXIONES DE MYSQL AGOTADAS \n"))
        }

        return await currentPool.getConnection()
    }

    // #region Query
    async multiQuery(sql) {
        const connection = await this.connect()
        if (!connection) {
            throw new Error("No se puedo conectar a la base de datos")
        }

        try {
            const [rows] = await connection.query(sql)

            return rows
        } catch (e) {
            console.error(e)
            return null
        } finally {
            connection.release()
        }
    }

    async query(sql) {
        const connection = await this.connect()
        if (!connection) {
            throw new Error("No se puedo conectar a la base de datos")
        }

        try {
            const rows = await connection.query(sql)

            return rows
        } catch (e) {
            console.error(e)
            return null
        } finally {
            connection.release()
        }
    }

    // #region Find
    // Example 1: const result = await instancia.find("SELECT * FROM `usuarios`)
    // Retorno de ejemplo 1: [{id: 1, nombre: "José", fecha: 2024-05-17 22:36:00}, {id: 2, nombre: "Miguel", fecha: 2024-05-17 22:36:00}, {id: 3, nombre: "Jesus", fecha: 2024-05-17 22:36:00}]

    // Example 2: const result = await instancia.find("SELECT * FROM `usuarios`", "nombre")
    // Retorno de ejemplo 2: ["José", "Miguel", "Jesus"]
    async find(sql, field = false) {
        const connection = await this.connect()
        if (!connection) {
            throw new Error("No se puedo conectar a la base de datos")
        }

        try {
            const [rows] = await connection.query(sql)

            if (!field) {
                return rows
            } else {
                const datos = []

                for (const item of rows) {
                    if (item[field] !== null && item[field] !== undefined) {
                        datos.push(item[field])
                    }
                }

                return datos
            }
        } catch (e) {
            console.error(e)
            return null
        } finally {
            connection.release()
        }
    }

    // #region FindOne
    // Example 1: const result = await instancia.findOne("SELECT * FROM `usuarios` WHERE `id`=1")
    // Retorno de ejemplo 1: {id: 1, nombre: "José", fecha: 2024-05-17 22:36:00}

    // Example 2: const result = await instancia.findOne("SELECT * FROM `usuarios` WHERE `id`=1", "nombre")
    // Retorno de ejemplo 2: "José"
    async findOne(sql, fields = false) {
        const connection = await this.connect()
        if (!connection) {
            throw new Error("No se puedo conectar a la base de datos")
        }

        try {
            const [rows] = await connection.query(sql + " limit 1")

            if (rows.length === 0) {
                return null
            }

            if (typeof fields === "string") {
                return rows[0][fields]
            } else {
                return rows[0]
            }
        } catch (e) {
            console.error(e)
            return null
        } finally {
            connection.release()
        }
    }

    // #region Insert
    // Example: const result = await instancia.multipleInsert({nombre: "José"}, "table")
    // Retorna: Int
    async insert(data, table) {
        const connection = await this.connect()
        if (!connection) {
            throw new Error("No se puedo conectar a la base de datos")
        }

        const dt = Object.assign({}, data)

        for (const key in dt) {
            if (dt[key] instanceof Date) {
                dt[key] = escape(dt[key].toISOString().slice(0, 19).replace("T", " "))
            } else if (typeof dt[key] === "string") {
                dt[key] = escape(dt[key])
            } else if (typeof dt[key] === "object") {
                dt[key] = escape(JSON.stringify(dt[key]))
            }
        }

        const sql = "INSERT INTO `" + table + "` (" + Object.keys(dt).map((k) => "`" + k + "`").join(",") + ") VALUES (" + Object.keys(dt).map((k) => dt[k]).join(",") + ")"

        try {
            const [rows] = await connection.query(sql)
            return rows.insertId
        } catch (e) {
            console.error(e.sqlMessage)
            return null
        } finally {
            connection.release()
        }
    }

    // #region Edit
    // Example: const result = await instancia.edit({nombre: "Nuevo Nombre", apellido: "apellido"}, {"id": 50}, "table")
    // Retorna: int
    async edit(data, where, table) {
        const connection = await this.connect()
        if (!connection) {
            throw new Error("No se puedo conectar a la base de datos")
        }

        for (const key in data) {
            if (typeof data[key] === "string") {
                data[key] = escape(data[key])
            } else if (typeof data[key] === "object") {
                data[key] = "'" + JSON.stringify(data[key]) + "'"
            }
        }

        for (const key in where) {
            if (where[key] === null) {
                where[key] = "`" + key + "`" + " IS NULL"
            } else if (where[key] === "") {
                where[key] = "`" + key + "`" + " IS NOT NULL"
            } else if (typeof where[key] === "string") {
                where[key] = "`" + key + "`=" + escape(where[key])
            } else if (typeof where[key] === "object") {
                where[key] = "`" + key + "`=" + JSON.stringify(where[key])
            } else {
                where[key] = "`" + key + "`=" + where[key]
            }
        }

        const sql = "UPDATE `" + table + "` SET " + Object.keys(data).map((key) => "`" + key + "`=" + data[key]).join(",") + " WHERE " + Object.values(where).join(" AND ")

        try {
            const [rows] = await connection.query(sql)
            return rows.affectedRows
        } catch (e) {
            console.error(e)
            return null
        } finally {
            connection.release()
        }
    }

    // #region Isset
    // Example: const result = await instancia.isset({id: 1}, "table")
    // Retorna: Boolean
    async isset(where, table) {
        const connection = await this.connect()
        if (!connection) {
            throw new Error("No se puedo conectar a la base de datos")
        }

        for (const key in where) {
            if (where[key] === null) {
                where[key] = "`" + key + "`" + " IS NULL"
            } else if (where[key] === "") {
                where[key] = "`" + key + "`" + " IS NOT NULL"
            } else if (typeof where[key] === "string") {
                where[key] = "`" + key + "`=" + escape(where[key])
            } else if (typeof where[key] === "object") {
                where[key] = "`" + key + "`=" + JSON.stringify(where[key])
            } else {
                where[key] = "`" + key + "`=" + where[key]
            }
        }

        const sql = "SELECT " + Object.keys(where).map((e) => "`" + e + "`").join(",") + " FROM `" + table + "` WHERE " + Object.values(where).join(" AND ")

        try {
            const [rows] = await connection.query(sql)
            if (rows.length === 0) {
                return false
            } else {
                return true
            }
        } catch (e) {
            console.error(e)
            return false
        } finally {
            connection.release()
        }
    }

    // #region Multiple Insert
    // Example: const result = await instancia.multipleInsert([{nombre: "José"},{nombre: "Miguel"},{nombre: "Pedro"}], "table")
    // Retorna: Int
    async multipleInsert(multiData, table) {
        const connection = await this.connect()
        if (!connection) {
            throw new Error("No se puedo conectar a la base de datos")
        }

        const keys = Object.keys(multiData[0])
        const insert = []

        for (const keyRow in multiData) {
            const row = []

            for (const key of keys) {
                if (multiData[keyRow][key] === null) {
                    row.push("NULL")
                } else if (typeof multiData[keyRow][key] === "string") {
                    row.push(escape(multiData[keyRow][key]))
                } else if (typeof multiData[keyRow][key] === "object") {
                    row.push(JSON.stringify(multiData[keyRow][key]))
                } else if (typeof multiData[keyRow][key] === "undefined") {
                    row.push("NULL")
                } else {
                    row.push(multiData[keyRow][key])
                }
            }

            insert.push("(" + row.join(",") + ")")
        }

        const sql = "INSERT INTO `" + table + "` (" + keys.map((k) => "`" + k + "`").join(",") + ") VALUES " + insert.join(",")

        try {
            const [rows] = await connection.query(sql)
            return rows.insertId
        } catch (e) {
            console.error(e)
            return null
        } finally {
            connection.release()
        }
    }
}

module.exports = MySql
