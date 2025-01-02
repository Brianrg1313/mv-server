const fs = require("fs/promises")
const { MongoClient } = require("mongodb")
const { v4: uuid } = require("uuid")
const sharp = require("sharp")

async function main() {
    const currentPath = "E:/metodovargas/backend/assets/public/icons/"

    const files = await fs.readdir(currentPath)

    const client = new MongoClient("mongodb://clientes:l5SceytlqAT3GDc6TvxO@127.0.0.1:27017/", {
        maxPoolSize: 10,
        minPoolSize: 5,
        writeConcern: { w: 1 }
    })

    await client.connect()
    const mg = client.db("MV_archivos")
    const coll = mg.collection("iconos")

    for (const file of files) {
        const id = uuid().split("-")[0]

        try {
            await sharp(`${currentPath}/${file}`)
                .withMetadata(false)
                .webp({ quality: 50 })
                .toFile(`${currentPath}/c/${id}.webp`)
        } catch (error) {
            console.log(error)
        }

        const insert = {
            _id: id,
            t: file
        }

        console.log(file)

        await coll.insertOne(insert)
    }

    console.log("END")
}

main()
