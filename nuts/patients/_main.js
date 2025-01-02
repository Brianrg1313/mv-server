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
    const a = {
        port: 3306,
        host: "localhost",
        user: "clientes",
        password: "l5SceytlqAT3GDc6TvxO",
        database: "MV_administradores"
    }

    const cnn1 = await mysql.createConnection(c)
    const cnn2 = await mysql.createConnection(a)
    await cnn1.query("TRUNCATE `usuarios`")
    await cnn1.query("TRUNCATE `complementarios`")
    await cnn2.query("TRUNCATE `administradores`")
    await cnn2.query("TRUNCATE `equipos`")
    await cnn2.query("TRUNCATE `grupos`")
    await cnn2.query("TRUNCATE `grupos_administradores`")
    await cnn2.query("TRUNCATE `pacientes`")
    await cnn2.query("TRUNCATE `extras`")
    await cnn2.query("TRUNCATE `lista_variables`")

    const admins = {}
    const newID = {}
    const teams = {}
    const groups = {}

    for (let index = 1; index <= 12; index++) {
        await cnn2.query("INSERT INTO `lista_variables`(`id`, `eid`, `titulo`) VALUES (" + index + ", 1,'Lista " + index + "')")
    }

    let i = 1
    for (const item of data) {
        console.clear()
        console.log(`Fase: 1 de 3 - ${((i * 100) / data.length).toFixed(2)}%`)
        i++
        // SE ORDENAN LOS GRUPOS
        item.grupo = JSON.parse(item.grupo)

        let status = null
        if (item.grupo === null) {
            status = null
        } else {
            for (const g of item.grupo) {
                // SI ESTA EN EL GRUPO 0 ES UN USUARIO ELIMINADO
                if (g === 0) {
                    status = 1
                    continue
                }
                // SI EL GRUPO NO EXISTE SE LO INSERTA
                if (!groups[g]) {
                    await cnn2.query("INSERT INTO `grupos`(`id`, `eid`, `titulo`, `descripcion`) VALUES (" + g + ",'" + item.id_equipo + "','Grupo No." + g + "',NULL)")
                    groups[g] = true
                }
            }
        }

        if (item.rool !== "1") {
            // SE INSERTA UN ADMINISTRADOR
            [admins[item.id]] = await cnn2.query("INSERT INTO `administradores`(`id`, `old_id`, `eid`, `nombre`, `apellido`, `correo`, `usuario`, `telefono`, `tdni`, `dni`, `nacimiento`, `sexo`, `lista`, `estado`, `fecha_registro`) VALUES (NULL, " + item.id + ", " + item.id_equipo + ",'" + item.nombre + "','" + item.apellido + "','" + item.correo + "','" + item.usuario + "','000','" + item.tdni + "','" + item.dni + "','" + item.nacimiento + "','" + item.sexo + "'," + item.per + "," + status + ",'" + item.fecha_r + "')")

            // INSERTA A LOS ADMINISTRADORES A LOS GRUPOS QUE PERTENECEN
            if (item.grupo !== null) {
                for (const g of item.grupo) {
                    if (g === 0) continue
                    await cnn2.query("INSERT INTO `grupos_administradores`(`id`, `aid`, `gid`) VALUES (NULL,'" + admins[item.id].insertId + "'," + g + ")")
                }
            }
        } else {
            // SE INSERTA UN PACIENTE
            [newID[item.id]] = await cnn1.query("INSERT INTO `usuarios`(`id`, `old_id`, `nombre`, `apellido`, `correo`, `usuario`, `telefono`, `tdni`, `dni`, `nacimiento`, `sexo`, `estado`, `fecha_inicio`, `fecha_registro`) VALUES (NULL, '" + item.id + "','" + item.nombre + "','" + item.apellido + "','" + item.correo + "','" + item.usuario + "','000','" + item.tdni + "','" + item.dni + "','" + item.nacimiento + "','" + item.sexo + "'," + status + ",'" + item.fecha_inicio + "','" + item.fecha_r + "')")

            // INSERTA A LOS PACIENTES A LOS GRUPOS QUE PERTENECEN
            if (item.grupo !== null) {
                for (const g of item.grupo) {
                    if (g === 0) continue
                    await cnn2.query("INSERT INTO `pacientes`(`id`, `pid`, `eid`, `gid`) VALUES (NULL,'" + newID[item.id].insertId + "','" + item.id_equipo + "'," + g + ")")
                }
            } else {
                await cnn2.query("INSERT INTO `pacientes`(`id`, `pid`, `eid`, `gid`) VALUES (NULL,'" + newID[item.id].insertId + "','" + item.id_equipo + "',NULL)")
            }
        }

        // SI NO EXISTE EL EQUIPO SE LO INSERTA
        if (!teams[item.id_equipo]) {
            await cnn2.query("INSERT INTO `equipos`(`id`, `titulo`, `descripcion`) VALUES (" + item.id_equipo + ",'" + item.nombre + "',NULL)")
            teams[item.id_equipo] = true
        }
    }

    i = 1
    for (const item of phones) {
        console.clear()
        console.log(`Fase: 2 de 3 - ${((i * 100) / phones.length).toFixed(2)}%`)
        i++
        if (!newID[item.id_usuario]) {
            if (admins[item.id_usuario]) {
                const id = admins[item.id_usuario].insertId
                await cnn2.query("UPDATE `administradores` SET `telefono`='" + item.telefono + "' WHERE `id` = " + id)
            }

            continue
        }

        const id = newID[item.id_usuario].insertId
        await cnn1.query("UPDATE `usuarios` SET `telefono`='" + item.telefono + "' WHERE `id` = " + id)
    }

    i = 1
    for (const item of complementary) {
        console.clear()
        console.log(`Fase: 3 de 3 - ${((i * 100) / complementary.length).toFixed(2)}%`)
        i++
        if (!newID[item.id_usuario]) {
            if (admins[item.id_usuario]) {
                if (!item.profesion) continue

                const id = admins[item.id_usuario].insertId
                await cnn2.query("INSERT INTO `extras`(`id`, `aid`, `profesion`) VALUES (NULL," + id + ",'" + item.profesion + "')")
            }
            continue
        }

        const id = newID[item.id_usuario].insertId

        await cnn1.query("INSERT INTO `complementarios`(`uid`, `talla`, `pais`, `ciudad`, `parroquia`, `coordenadas`, `profesion`, `terminos`) VALUES (" + id + "," + item.talla + ",'" + item.pais + "','" + item.ciudad + "','" + item.parroquia + "',NULL,'" + item.profesion + "',0)")
    }

    console.log("END")
    cnn1.end()
    cnn2.end()
}

main()
