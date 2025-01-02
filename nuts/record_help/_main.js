const mysql = require("mysql2/promise")

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

    const [rows] = await connection.query("SELECT `id`,`variable` FROM `diccionario`")
    await connection.query("TRUNCATE `variables_ayuda`;")

    const variables = {}

    for (const item of rows) {
        variables[item.variable] = item.id
    }

    for (const item of data) {
        const [[admin]] = await connection2.query("SELECT `id` FROM `administradores` WHERE `old_id` = " + item.id_creador)

        const variable = variables[item.area]

        if (!variable) {
            console.log(item.area)
            continue
        }

        if (item.estado === "1") {
            item.estado = "NULL"
        } else {
            item.estado = "1"
        }

        await connection.query("INSERT INTO `variables_ayuda`(`id`, `aid`, `variable`, `texto`, `color`, `estado`, `fecha`) VALUES (NULL," + admin.id + "," + variable + ",'" + item.texto + "'," + item.color + "," + item.estado + ",'" + item.fecha_r + "')")
    }

    connection.end()
    connection2.end()
    console.log("END")
}

main()
