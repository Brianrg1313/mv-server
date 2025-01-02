const { MongoClient } = require("mongodb")
const mysqlC = require("mysql2/promise")

async function main() {
    const c = {
        port: 3306,
        host: "localhost",
        user: "clientes",
        password: "l5SceytlqAT3GDc6TvxO",
        database: "MV_pacientes"
    }

    const mysql = await mysqlC.createConnection(c)

    const [r1] = await mysql.query("SELECT `old_id`,`id` FROM `usuarios`")

    const pacientes = {}
    for (const item of r1) {
        pacientes[item.old_id] = item.id
    }

    const client = new MongoClient("mongodb://clientes:l5SceytlqAT3GDc6TvxO@127.0.0.1:27017/", {
        maxPoolSize: 10,
        minPoolSize: 5,
        writeConcern: { w: 1 }
    })

    await client.connect()
    const ficha = client.db("MV_pacientes").collection("ficha")
    const app = client.db("MV_app").collection("diccionario")

    const r2 = await app.find({}, { projection: { _id: 1, variable: 1 } }).toArray()

    const variables = {}

    for (const item of r2) {
        variables[item.variable.toLowerCase()] = item._id
    }

    const records = require("./metodov1_api.json")

    const insertions = {}

    for (const record of records) {
        for (const item of record.data) {
            const _id = pacientes[item.id_usuario]
            const week = item.semana
            const date = item.fecha_r

            if (!_id) {
                continue
            }

            if (!insertions[_id]) {
                insertions[_id] = {}
            }

            for (const key in item) {
                if (key === "id") continue
                if (key === "fecha_r") continue
                if (key === "semana") continue
                if (key === "id_usuario") continue

                const variable = variables[key.toLowerCase()]

                if (!variable) {
                    if (item[key] !== null && item[key] !== "0") {
                        console.error(variable, key, item[key])
                    }
                    continue
                }

                let value = item[key]

                if (value === null) continue
                if (value === "") continue
                if (value === 0) continue
                if (value === "0") continue

                if (!insertions[_id][variable]) {
                    insertions[_id][variable] = {}
                }

                if (!insertions[_id][variable][week]) {
                    insertions[_id][variable][week] = {}
                }

                if (`${value}`.includes(".")) {
                    value = parseFloat(`${value}`)
                } else {
                    value = parseInt(`${value}`)
                }

                insertions[_id][variable][week].v = value
                insertions[_id][variable][week].f = date ?? new Date()
            }
        }
    }

    for (const _id in insertions) {
        await ficha.insertOne({
            _id: parseInt(_id),
            ...insertions[_id] // ESTO PARA PORDER HACER UN COMMJIT
        })
    }

    client.close()
    mysql.end()

    console.log("END")
}

main()
