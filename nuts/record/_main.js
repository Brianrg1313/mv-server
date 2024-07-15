const { MongoClient } = require("mongodb")
const mysql = require("mysql2/promise")

/**
 * Para poder ejecutar este proceso primero debe estar en orden el diccionario
 */
async function main() {
    const measurements = require("./mediciones.json")

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

    const R = {}

    for (const item of measurements) {
        const uid = parseInt(item.id_usuario)
        if (!R[uid]) {
            R[uid] = { _id: uid }
        }

        for (const key in item) {
            if (key === "id") continue
            if (key === "id_usuario") continue
            if (key === "fecha_r") continue
            if (key === "semana") continue
            if (!item[key]) continue
            if (item[key] === "0") continue
            if (dict[key] === undefined) continue

            const newKey = dict[key]

            if (!R[uid][newKey]) {
                R[uid][newKey] = {}
            }

            if (!R[uid][newKey][item.semana]) {
                let value = parseFloat(item[key])

                if (!value) {
                    value = item[key]
                }

                R[uid][newKey][item.semana] = {
                    v: value,
                    a: 2,
                    f: new Date(item.fecha_r)
                }
            }
            const keys = Object.keys(R[uid][newKey]).sort((a) => parseInt(a))

            const newObjet = {}
            for (const week of keys) {
                newObjet[week] = R[uid][newKey][week]
            }
            R[uid][newKey] = newObjet
        }
    }

    const client = new MongoClient("mongodb://clientes:l5SceytlqAT3GDc6TvxO@127.0.0.1:27017/", {
        maxPoolSize: 10,
        minPoolSize: 5,
        writeConcern: { w: 1 }
    })

    await client.connect()
    const mg = client.db("MV_pacientes")
    const coll = mg.collection("ficha")

    for (const uid in R) {
        await coll.insertOne(R[uid])
        console.log(uid)
    }
}

main()
