const { MongoClient } = require("mongodb")

class Mongo {
    static options = {
        maxPoolSize: 10,
        minPoolSize: 5,
        writeConcern: { w: 1 }
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

    async query(collection) {
        const connection = await this.connect()
        if (!connection) {
            throw new Error("No se puedo conectar a la base de datos")
        }

        const coll = connection.collection(collection)

        return coll
    }

    async find(query, collection, options = false) {
        const connection = await this.connect()
        if (!connection) {
            throw new Error("No se puedo conectar a la base de datos")
        }

        const coll = connection.collection(collection)

        if (options) {
            return await coll.find(query, options).toArray()
        } else {
            return await coll.find(query).toArray()
        }
    }

    async findSort(query, sort, collection, options = false) {
        const connection = await this.connect()
        if (!connection) {
            throw new Error("No se puedo conectar a la base de datos")
        }

        const coll = connection.collection(collection)

        if (options) {
            return await coll.find(query, options).sort(sort).toArray()
        } else {
            return await coll.find(query).sort(sort).toArray()
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

    async insert(data, collection, { increment = false } = {}) {
        const connection = await this.connect()
        if (!connection) {
            throw new Error("No se puedo conectar a la base de datos")
        }

        const coll = connection.collection(collection)

        if (increment) {
            const [last] = await coll.find({}, { _id: 1 }).sort({ _id: -1 }).limit(1).toArray()

            if (last == null) {
                data._id = 1
            } else if (Number.isInteger(last._id)) {
                data._id = last._id + 1
            }
        }

        await coll.insertOne(data)
        return data._id
    }

    async edit(where, data, collection) {
        const connection = await this.connect()
        if (!connection) {
            throw new Error("No se puedo conectar a la base de datos")
        }

        const coll = connection.collection(collection)

        return await coll.updateOne(where, { $set: data })
    }

    async delete(where, collection) {
        const connection = await this.connect()
        if (!connection) {
            throw new Error("No se puedo conectar a la base de datos")
        }

        const coll = connection.collection(collection)

        return await coll.deleteOne(where)
    }
}

module.exports = Mongo
