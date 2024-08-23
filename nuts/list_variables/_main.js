const { MongoClient } = require("mongodb")
const mysql = require("mysql2/promise")

/**
 * Ordena las listas de variables de cada administrador
 */
async function main() {
    const data = require("./list.json")

    const c = {
        port: 3306,
        host: "localhost",
        user: "clientes",
        password: "l5SceytlqAT3GDc6TvxO",
        database: "MV_app"
    }

    const connection = await mysql.createConnection(c)

    const [variables] = await connection.query("SELECT `id`,`variable` FROM `diccionario`")

    const dictionary = {}

    for (const item of variables) {
        if (!dictionary[item.variable]) {
            dictionary[item.variable] = item.id
        }
    }

    const client = new MongoClient("mongodb://clientes:l5SceytlqAT3GDc6TvxO@127.0.0.1:27017/", {
        maxPoolSize: 10,
        minPoolSize: 5,
        writeConcern: { w: 1 }
    })

    await client.connect()
    const mg = client.db("MV_admin")
    const coll = mg.collection("lista_variables")

    for (const id in data) {
        const insert = {
            _id: parseInt(id)
        }

        for (const position in data[id]) {
            const key = data[id][position]
            let newKey = dictionary[key]

            if (!newKey) {
                newKey = key
            }

            insert[newKey] = parseInt(position)
        }

        await coll.insertOne(insert)
    }

    client.close()
    connection.close()
}

main()
