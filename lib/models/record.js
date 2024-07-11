const Databases = require("package:/models/databases")
const Mongo = require("package:/servers/mongo")

class RecordModel {
    static mongo = new Mongo(Databases.mongo.patient)

    /**
     * Controla todos los datos referentes a la ficha medica del paciente los cuales tienen seguimiento por semanas
     * La mayoría de estos datos se almacenan en mongo
     * @param {Number} id Identificador del paciente
     */
    constructor(id) {
        this.uid = id
    }

    /**
     * @returns {Promise<Array<Object>>}
     */
    async getAllRecord() {
        const result = await RecordModel.mongo.findOne({ _id: this.uid }, "record")

        delete result._id

        return result
    }

    async update(data, week) {
        const document = await RecordModel.mongo.findOne({ _id: this.uid }, "record")

        for (const key in data) {
            if (!document[key]) {
                document[key] = {}
            }

            if (!document[key][week]) {
                document[key][week] = {}
            }

            document[key][week].v = data[key]
            document[key][week].u = this.uid
            document[key][week].f = new Date()
        }

        return await RecordModel.mongo.edit({ _id: this.uid }, document, "record")
    }
}

module.exports = RecordModel
