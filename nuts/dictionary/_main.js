const mysql = require("mysql2/promise")
const { intToAbc, nextAbbr } = require("../../lib/helpers/tools")

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

    const a = {
        port: 3306,
        host: "localhost",
        user: "clientes",
        password: "l5SceytlqAT3GDc6TvxO",
        database: "MV_administradores"
    }

    const connection = await mysql.createConnection(c)
    const c2 = await mysql.createConnection(a)

    await connection.query("TRUNCATE `diccionario`")
    await connection.query("TRUNCATE `colecciones`")
    await c2.query("TRUNCATE `diccionario`")

    for (const key in collections) {
        await connection.query("INSERT INTO `colecciones`(`id`, `es`,`en`) VALUES (" + collections[key].id + ",'" + collections[key].titulo + "','" + collections[key].titulo + "')")
    }

    let nAbbr = 1

    let i = 0
    for (const key in variables) {
        console.clear()
        console.log(`${i} de ${Object.keys(variables).length}`)
        i++
        const item = variables[key]

        item.sg = nAbbr

        nAbbr = nextAbbr(nAbbr)

        if (item.co === "formw") {
            continue
        }

        if (item.co === "usuarios") {
            item.co = "informacion_personal"
        }

        if (!collections[item.co]) {
            collections.informacion_personal = 22
            item.co = "informacion_personal"
        } else {
            if (collections[item.co].id) {
                collections[item.co] = collections[item.co].id
            }
        }

        if (!item.va) {
            item.va = {
                min: 1,
                max: 1,
                type: "tinyi",
                pattern: "0-5"
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

        if (!item.format) {
            if (item.va.type === "tinyi") {
                item.format = 3
            } else if (item.va.type === "double") {
                item.format = 2
            } else if (item.va.type === "text") {
                item.format = 1
            } else {
                item.format = 1
            }
        }

        if (!types[key]) {
            types[key] = 3
        }

        const [did] = await connection.query("INSERT INTO `diccionario`(`id`, `icono`, `formato`, `variable`, `es`, `en`, `subes`, `suben`, `tipo`, `coleccion`, `abreviacion`, `pattern`, `posicion`, `min`, `max`) VALUES (NULL,NULL," + item.format + ",'" + key + "','" + item.ti + "','" + item.ti + "','" + item.to + "','" + item.to + "'," + types[key] + "," + collections[item.co] + "," + item.sg + ",'" + item.va.pattern + "',NULL," + item.va.min + "," + item.va.max + ")")

        if (!item.ed) {
            await c2.query("INSERT INTO `diccionario`(`id`, `aid`, `variable`, `visible`, `editable`) VALUES (NULL,0," + did.insertId + ",0,0)")
        }
    }

    await connection.end()
    await c2.end()
}

main()
