const { MongoClient } = require("mongodb")
const mysql = require("mysql2/promise")

/**
 * Ordena las notas para las variables a trabajar en la semana del paciente
 */
async function main() {
    const data = require("./notas.json")

    const c = await mysql.createConnection({
        port: 3306,
        host: "localhost",
        user: "clientes",
        password: "l5SceytlqAT3GDc6TvxO",
        database: "MV_app"
    })

    await c.query("TRUNCATE `fallas_semanales`")

    for (const key in data) {
        const [[variable]] = await c.query("SELECT `id` FROM `diccionario` WHERE `variable` = '" + key + "'")
        if (!variable) {
            console.log(variable?.id, key)
            continue
        }

        await c.query("INSERT INTO `fallas_semanales`(`id`, `variable`, `es_titulo`,`en_titulo`, `es_mensaje`,`en_mensaje`, `imagen`) VALUES (NULL," + variable.id + ",'" + data[key][0] + "','en','" + data[key][1] + "','en',NULL)")
    }

    console.log("END")
}

main()
