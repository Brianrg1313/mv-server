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
        database: "MV_pacientes"
    }

    const c2 = {
        port: 3306,
        host: "localhost",
        user: "clientes",
        password: "l5SceytlqAT3GDc6TvxO",
        database: "MV_app"
    }

    const connection = await mysql.createConnection(c)
    const app = await mysql.createConnection(c2)

    const data = require("./ocultar.json")

    await connection.query("TRUNCATE `variables`")

    for (const item of data) {
        const [[id]] = await app.query("SELECT `id` FROM `diccionario` WHERE `variable` = '" + item.area + "'")

        if (!id) {
            continue
        }

        await connection.query("INSERT INTO `variables`(`id`, `uid`, `variable`, `visible`, `editable`) VALUES (NULL,0,'" + id.id + "',0,0)")
    }

    console.log("END")
}

main()
