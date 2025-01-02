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

    const [[pp]] = await connection.query("SELECT id FROM diccionario WHERE variable = 'pp'")
    const [[peso]] = await connection.query("SELECT id FROM diccionario WHERE variable = 'peso'")
    const [[gp]] = await connection.query("SELECT id FROM diccionario WHERE variable = 'gp'")
    const [[grasa]] = await connection.query("SELECT id FROM diccionario WHERE variable = 'grasab'")

    const client = new MongoClient("mongodb://clientes:l5SceytlqAT3GDc6TvxO@127.0.0.1:27017/", {
        maxPoolSize: 10,
        minPoolSize: 5,
        writeConcern: { w: 1 }
    })

    await client.connect()
    const mg = client.db("MV_pacientes")
    const goalsColl = mg.collection("metas")

    const goalsP = {}
    const goalsG = {}
    const data = await goalsColl.find({}).toArray()

    for (const item of data) {
        goalsP[item._id] = item[peso.id]
        goalsG[item._id] = item[grasa.id]
    }

    const weightColl = mg.collection("ficha")

    const record = await weightColl.find({}).toArray()

    for (const item of record) {
        if (item[peso.id] ? [1] : false) {
            if (item[peso.id][1] ? ["v"] : false) {
                if (goalsP[item._id]) {
                    const initial = item[peso.id][1].v
                    const goal = goalsP[item._id]

                    const weightExtra = (initial - goal.m) / goal.s

                    item[pp.id] = {}

                    for (let week = 1; week <= goal.s; week++) {
                        item[pp.id][week] = {
                            v: initial - (weightExtra * week),
                            a: 2,
                            f: new Date()
                        }
                    }
                }
            }
        }

        if (item[grasa.id] ? [1] : false) {
            if (item[grasa.id] ? [1] : false) {
                if (goalsG[item._id]) {
                    if (item[grasa.id][1]) {
                        const initial = item[grasa.id][1].v
                        const goal = goalsG[item._id]

                        const graseExtra = (initial - goal.m) / goal.s

                        item[gp.id] = {}

                        for (let week = 1; week <= goal.s; week++) {
                            item[gp.id][week] = {
                                v: initial - (graseExtra * week),
                                a: 2,
                                f: new Date()
                            }
                        }
                    }
                }
            }
        }

        await weightColl.updateOne({ _id: item._id }, { $set: item })
        console.log("END")
    }
}

main()
