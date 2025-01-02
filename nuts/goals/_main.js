const { MongoClient } = require("mongodb")
const mysql = require("mysql2/promise")

/**
 * Para poder ejecutar este proceso primero debe estar en orden el diccionario
 */
async function main() {
    const c = {
        port: 3306,
        host: "localhost",
        user: "clientes",
        password: "l5SceytlqAT3GDc6TvxO",
        database: "MV_app"
    }

    const connection = await mysql.createConnection(c)

    const [rows] = await connection.query("SELECT `id`,`variable` FROM `diccionario`")
    const dict = {}

    for (const item of rows) {
        dict[item.variable] = item.id
    }

    const goals = require("./metas.json")

    const R = {}

    for (const item of goals) {
        if (!R[item.id_usuario]) {
            R[item.id_usuario] = { _id: parseInt(item.id) }
        }

        for (const key in item) {
            if (!dict[key]) continue

            const newKey = dict[key]

            if (key === "id") continue
            if (key === "id_usuario") continue
            if (key === "semanas") continue
            if (key === "semanag") continue
            if (key === "semana") continue

            let week = 0

            if (key === "semanag") {
                week = parseInt(item.grasab)
            } else {
                week = parseInt(item.semanas)
            }

            let value = parseInt(item[key])

            if (!value) {
                value = parseFloat(item[key])
            }

            if (!value) {
                value = item[key]
            }

            R[item.id_usuario][newKey] = {}

            if (week) {
                R[item.id_usuario][newKey].s = week
            }

            if (value) {
                R[item.id_usuario][newKey].m = value
            }

            R[item.id_usuario][newKey].a = 2
            R[item.id_usuario][newKey].f = new Date()
        }
    }

    const client = new MongoClient("mongodb://clientes:l5SceytlqAT3GDc6TvxO@127.0.0.1:27017/", {
        maxPoolSize: 10,
        minPoolSize: 5,
        writeConcern: { w: 1 }
    })

    await client.connect()
    const mg = client.db("MV_pacientes")
    const coll = mg.collection("metas")

    for (const uid in R) {
        await coll.insertOne(R[uid])
        console.log(uid)
    }
}

main()
