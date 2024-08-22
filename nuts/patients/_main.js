const mysql = require("mysql2/promise")

/**
 * Se insertamos todos los pacientes en la base de datos
 */
async function main() {
    const data = require("./usuarios.json")
    const complementary = require("./complementarios.json")
    const phones = require("./contacto.json")

    const c = {
        port: 3306,
        host: "localhost",
        user: "clientes",
        password: "l5SceytlqAT3GDc6TvxO",
        database: "MV_pacientes"
    }

    const connection = await mysql.createConnection(c)
    await connection.query("TRUNCATE `usuarios`")
    await connection.query("TRUNCATE `complementarios`")

    const admins = {}
    const newID = {}

    for (const item of data) {
        if (item.rool !== "1") {
            admins[item.id] = item
            continue
        }

        let status = null
        if (item.grupo === null) {
            status = null
        } else if (item.grupo.includes("0")) {
            status = 1
        }

        [newID[item.id]] = await connection.query("INSERT INTO `usuarios`(`id`, `old_id`, `nombre`, `apellido`, `correo`, `usuario`, `telefono`, `tdni`, `dni`, `nacimiento`, `sexo`, `estado`, `fecha_inicio`, `fecha_registro`) VALUES (NULL, '" + item.id + "','" + item.nombre + "','" + item.apellido + "','" + item.correo + "','" + item.usuario + "','000','" + item.tdni + "','" + item.dni + "','" + item.nacimiento + "','" + item.sexo + "'," + status + ",'" + item.fecha_inicio + "','" + item.fecha_r + "')")
    }

    for (const item of phones) {
        if (!newID[item.id_usuario]) {
            continue
        }

        const id = newID[item.id_usuario].insertId
        await connection.query("UPDATE `usuarios` SET `telefono`='" + item.telefono + "' WHERE `id` = " + id)
    }

    for (const item of complementary) {
        if (!newID[item.id_usuario]) {
            continue
        }

        const id = newID[item.id_usuario].insertId

        await connection.query("INSERT INTO `complementarios`(`uid`, `talla`, `pais`, `ciudad`, `parroquia`, `coordenadas`, `profesion`, `sangre`, `terminos`) VALUES (" + id + "," + item.talla + ",'" + item.pais + "','" + item.ciudad + "','" + item.parroquia + "',NULL,'" + item.profesion + "',NULL,0)")
    }

    console.log("END")
    connection.end()
}

main()
