const fs = require('fs');
const path = require('path');

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

    fs.readdir("./nuts/static_images/", async (_, files) => {
        for (const file of files) {
            const [[variable]] = await connection.query("SELECT `id` FROM `diccionario` WHERE `variable` = '" + file.split(".")[0] + "'")

            if (!variable) continue

            fs.rename(`./nuts/static_images/${file}`, `./nuts/static_images/${variable.id}_flaw.webp`, (error) => {
                if (error) throw error
            })
        }
    })
}

main()
