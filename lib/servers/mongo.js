const { MongoClient } = require("mongodb")

class Mongo {
    static options = {
        maxPoolSize: 10,
        minPoolSize: 5
    }

    static client = new MongoClient("mongodb://clientes:l5SceytlqAT3GDc6TvxO@127.0.0.1:27017/", Mongo.options)

    constructor(db) {
        this.database = db
    }

    async connect() {
        try {
            if (!Mongo.client.isConnected) {
                await Mongo.client.connect()
            }

            return Mongo.client.db(this.database)
        } catch (e) {
            console.error(e)
            return false
        }
    }

    async findOne(query, collection) {
        const connection = await this.connect()
        if (!connection) {
            throw new Error("No se puedo conectar a la base de datos")
        }

        const coll = connection.collection(collection)

        return await coll.findOne(query, collection)
    }
}

module.exports = Mongo
