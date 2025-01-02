const { MongoClient } = require("mongodb")

/**
 * Ordena las notas de los pacientes
 * No es necesario ningún otro orden de algun otro dato
 */
async function main() {
    const data = require("./notes.json")

    const client = new MongoClient("mongodb://clientes:l5SceytlqAT3GDc6TvxO@127.0.0.1:27017/", {
        maxPoolSize: 10,
        minPoolSize: 5,
        writeConcern: { w: 1 }
    })

    await client.connect()
    const mg = client.db("MV_pacientes")
    const coll = mg.collection("notas")

    for (const item of data) {
        if (item.id_usuario === "2") {
            item.id_usuario = "1"
        }

        const newData = {
            aid: parseInt(item.id_origen),
            uid: parseInt(item.id_usuario),
            /// visible
            v: parseInt(item.estado),
            /// privado
            p: parseInt(item.privado),
            /// Texto
            t: item.mensaje,
            /// Color
            c: parseInt(item.color),
            f: new Date(item.fecha_r)
        }

        if (newData.c === 0) {
            delete newData.c
        }

        await coll.insertOne(newData)
    }

    console.log("END")
}

main()
