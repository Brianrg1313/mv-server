const mysql = require("mysql2/promise")

async function main() {
    const collections = require("./collections")
    const variables = require("./variables")
    const types = require("./types")

    const c = {
        port: 3306,
        host: "localhost",
        user: "clientes",
        password: "l5SceytlqAT3GDc6TvxO",
        database: "MV_app"
    }

    const connection = await mysql.createConnection(c)

    await connection.query("TRUNCATE `diccionario`")
    await connection.query("TRUNCATE `colecciones`")

    for (const key in collections) {
        await connection.query("INSERT INTO `colecciones`(`id`, `es`,`en`) VALUES (" + collections[key].id + ",'" + collections[key].titulo + "','" + collections[key].titulo + "')")
    }

    for (const key in variables) {
        const item = variables[key]

        if (!item.sg) {
            item.sg = "NULL"
        } else {
            item.sg = "'" + item.sg + "'"
        }

        if (item.co === "formw") {
            continue
        }

        if (!collections[item.co]) {
            continue
        } else {
            if (collections[item.co].id) {
                collections[item.co] = collections[item.co].id
            }
        }

        if (!item.va) {
            item.va = {
                min: 1,
                max: 1,
                pattern: 1
            }
        }

        if (!item.va.min) {
            item.va.min = 1
        }

        if (!item.va.max) {
            if (item.va.type === "tinyi") {
                item.va.max = 1
            } else if (item.va.type === "double") {
                item.va.max = 11
            } else {
                item.va.max = 1
            }
        }

        if (!item.va.pattern) {
            if (item.va.type === "tinyi") {
                item.va.pattern = "0-5"
            } else if (item.va.type === "double") {
                item.va.pattern = "0-9."
            } else {
                item.va.pattern = "0-5"
            }
        }

        if (!types[key]) {
            types[key] = 3
        }

        await connection.query("INSERT INTO `diccionario`(`id`, `icono`, `variable`, `es`, `en`, `subes`, `suben`, `tipo`, `modo`, `coleccion`, `editable`, `abreviacion`, `pattern`, `posicion`, `min`, `max`) VALUES (NULL,NULL,'" + key + "','" + item.ti + "','" + item.ti + "','" + item.to + "','" + item.to + "'," + types[key] + ",1," + collections[item.co] + ",1," + item.sg + ",'" + item.va.pattern + "',NULL," + item.va.min + "," + item.va.max + ")")
    }

    await connection.end()
}

main()
