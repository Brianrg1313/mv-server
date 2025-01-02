const mysql = require("mysql2/promise")
const { MongoClient } = require("mongodb")
const { nextAbbr } = require("../../lib/helpers/tools")

async function main() {
    // TODO: const types = require("./types")
    const variables = require("./variables")
    const collections = require("./collections")

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

    await connection.query("TRUNCATE `colecciones`")
    await c2.query("TRUNCATE `diccionario`")

    const varsInColl = {}

    for (const key in collections) {
        await connection.query("INSERT INTO `colecciones`(`id`, `es`,`en`) VALUES (" + collections[key].id + ",'" + collections[key].titulo + "','" + collections[key].titulo + "')")
        varsInColl[collections[key].id] = []
    }

    const client = new MongoClient("mongodb://clientes:l5SceytlqAT3GDc6TvxO@127.0.0.1:27017/", {
        maxPoolSize: 10,
        minPoolSize: 5,
        writeConcern: { w: 1 }
    })

    await client.connect()
    const mg = client.db("MV_app")
    const coll = mg.collection("diccionario")

    let _id = 1
    let nAbbr = 1

    let i = 0
    for (const key in variables) {
        console.clear()
        console.log(`${i} de ${Object.keys(variables).length}`)
        i++
        const item = variables[key]

        if (item.co === "formw") continue

        const insertion = {
            _id,
            variable: key,
            abreviacion: nAbbr,
            es: item.ti,
            en: item.ti,
            subes: item.to,
            suben: item.to,
            tipo: 1,
            formato: 3
        }

        nAbbr = parseInt(nextAbbr(nAbbr))

        if (item.co === "usuarios") {
            insertion.tipo = 5
            insertion.formato = 1
            insertion.editable = 0
            insertion.indexable = 0
        }

        if (item.addr) {
            insertion.bandera = item.addr
        }

        if (!item.va) {
            item.va = { min: 1, max: 1, type: "tinyi", pattern: "0-5" }
        }

        if (!item.va.min) {
            item.va.min = 1
        }

        if (!item.va.max) {
            item.va.max = 1
        }

        if (!item.va.pattern) {
            if (item.va.type === "tinyi") {
                item.va.pattern = "0-5"
            } else if (item.va.type === "double" || item.va.type === "numeric") {
                item.va.pattern = "0-9."
                insertion.formato = 2
            } else {
                item.va.pattern = "0-5"
            }
        }

        if (!item.ed) {
            insertion.editable = 0
        }

        if (item.ext) {
            insertion.tipo = 2
        }

        insertion.min = item.va.min
        insertion.max = item.va.max
        insertion.pattern = item.va.pattern

        if (item.co) {
            if (collections[item.co]) {
                if (collections[item.co].id) {
                    varsInColl[collections[item.co].id].push(_id)
                }
            }
        }

        _id++

        insertion.oid = item.id

        await coll.insertOne(insertion)
    }

    for (const key in varsInColl) {
        connection.query("UPDATE `colecciones` SET `variables`='" + JSON.stringify(varsInColl[key]) + "' WHERE `id`=" + key)
    }

    await client.close()
    await connection.end()
    await c2.end()
}

main()
