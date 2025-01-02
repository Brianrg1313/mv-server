const { MongoClient } = require("mongodb")
const mysql = require("mysql2/promise")

/**
 * Ordena las listas de variables de cada administrador
 */
async function main() {
    const lists = require("./list.json")
    const variables = require("../dictionary/variables.json")
    const collections = require("../dictionary/collections.json")

    const c = {
        port: 3306,
        host: "localhost",
        user: "clientes",
        password: "l5SceytlqAT3GDc6TvxO",
        database: "MV_app"
    }

    const connection = await mysql.createConnection(c)
    await connection.query("TRUNCATE `colecciones`")

    const inserts = {}

    for (const key in collections) {
        const collection = collections[key]
        inserts[key] = {}
        inserts[key].id = collection.id
        inserts[key].es = collection.titulo
        inserts[key].en = collection.titulo
        inserts[key].icono = null
        inserts[key].posicion = collection.id - 1
        inserts[key].variables = []
    }

    const client = new MongoClient("mongodb://clientes:l5SceytlqAT3GDc6TvxO@127.0.0.1:27017/", {
        maxPoolSize: 10,
        minPoolSize: 5,
        writeConcern: { w: 1 }
    })

    await client.connect()
    const coll = client.db("MV_app").collection("diccionario")
    const listC = client.db("MV_administradores").collection("lista_variables")

    const v = await coll.find({}).toArray()

    const variablesID = {}

    for (const item of v) {
        variablesID[item.variable] = item._id
    }

    for (const key in variables) {
        const variable = variables[key]

        if (inserts[variable.co]) {
            inserts[variable.co].variables.push(variablesID[key])
        }
    }

    for (const key in inserts) {
        inserts[key].variables = JSON.stringify(inserts[key].variables)
        await connection.query("INSERT INTO `colecciones`(`id`, `es`, `en`, `icono`, `posicion`, `variables`) VALUES (" + inserts[key].id + ",'" + inserts[key].es + "','" + inserts[key].en + "',NULL,'" + inserts[key].posicion + "','" + inserts[key].variables + "')")
    }

    for (const id_ in lists) {
        const id = parseInt(id_)
        const items = {
            _id: id,
            variables: []
        }

        for (const variable of lists[id]) {
            if (variablesID[variable]) {
                items.variables.push(variablesID[variable])
            }
        }

        await listC.insertOne(items)
    }

    console.log("END")

    client.close()
    connection.close()
}

main()
