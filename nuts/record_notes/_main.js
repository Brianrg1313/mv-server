const mysql = require("mysql2/promise")

/**
 * Orderna las notas de las variables de cada paciente
 */
async function main() {
    const data = require("./record_notes.json")

    const a1 = await mysql.createConnection({
        port: 3306,
        host: "localhost",
        user: "clientes",
        password: "l5SceytlqAT3GDc6TvxO",
        database: "MV_administradores"
    })
    const p1 = await mysql.createConnection({
        port: 3306,
        host: "localhost",
        user: "clientes",
        password: "l5SceytlqAT3GDc6TvxO",
        database: "MV_pacientes"
    })
    const c1 = await mysql.createConnection({
        port: 3306,
        host: "localhost",
        user: "clientes",
        password: "l5SceytlqAT3GDc6TvxO",
        database: "MV_app"
    })

    const [rows] = await c1.query("SELECT `id`,`variable` FROM `diccionario`")
    await c1.query("TRUNCATE `variables_notas`")

    const variables = {}

    for (const item of rows) {
        variables[item.variable] = item.id
    }

    let i = 0
    for (const item of data) {
        console.clear()
        console.log(`${((i / data.length) * 100).toFixed(1)}% de 100%`)
        i++
        const [[admin]] = await a1.query("SELECT `id` FROM `administradores` WHERE `old_id` = " + item.id_creador)
        let [[patient]] = await p1.query("SELECT `id` FROM `usuarios` WHERE `old_id` = " + item.id_usuario)

        if (!patient) {
            [[patient]] = await a1.query("SELECT `id` FROM `administradores` WHERE `old_id` = " + item.id_usuario)
        }

        if (!patient) {
            continue
        }

        const variable = variables[item.area.toLowerCase()]

        if (!variable) {
            console.log(item.area)
            continue
        }

        if (item.estado === "1") {
            item.estado = "NULL"
        } else {
            item.estado = "1"
        }

        await c1.query("INSERT INTO `variables_notas`(`id`, `aid`, `pid`, `variable`, `texto`, `estado`, `fecha`) VALUES (NULL," + admin.id + "," + patient.id + "," + variable + ",'" + item.texto + "'," + item.estado + ",'" + item.fecha_r + "')")
    }

    a1.end()
    p1.end()
    c1.end()
    console.log("END")
}

main()
