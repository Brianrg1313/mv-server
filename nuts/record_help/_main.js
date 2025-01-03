const mysql = require("mysql2/promise")
const { MongoClient } = require("mongodb")

/**
 * Orderna la ayuda de las variables
 */
async function main() {
    const data = require("./record_help.json")

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
    const connection2 = await mysql.createConnection(a)

    await connection.query("TRUNCATE `variables_ayuda`;")

    const client = new MongoClient("mongodb://clientes:l5SceytlqAT3GDc6TvxO@127.0.0.1:27017/", {
        maxPoolSize: 10,
        minPoolSize: 5,
        writeConcern: { w: 1 }
    })

    await client.connect()
    const mg = client.db("MV_app")
    const diccionario = mg.collection("diccionario")

    const rows = await diccionario.find({}, "diccionario").toArray()

    const variables = {}

    for (const item of rows) {
        if (!item.variable) continue
        variables[item.variable] = item._id
    }

    const admins = {}

    for (const item of data) {
        if (!admins[item.id_creador]) {
            const [[admin]] = await connection2.query("SELECT `id` FROM `administradores` WHERE `old_id` = " + item.id_creador)
            admins[item.id_creador] = parseInt(admin.id)
        }

        const variable = variables[item.area]

        if (!variable) {
            console.log(item.area)
            continue
        }

        if (item.estado === "1") {
            item.estado = "NULL"
        } else {
            item.estado = 1
        }

        await connection.query("INSERT INTO `variables_ayuda`(`id`, `aid`, `variable`, `texto`, `color`, `estado`, `fecha`) VALUES (NULL," + admins[item.id_creador] + "," + variable + ",'" + item.texto + "'," + parseInt(item.color) + "," + item.estado + ",'" + item.fecha_r + "')")
    }

    connection.end()
    connection2.end()
    client.close()
    console.log("END")
}

main()
