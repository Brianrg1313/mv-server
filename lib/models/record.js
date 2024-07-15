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
        const result = await RecordModel.mongo.findOne({ _id: this.uid }, "ficha")

        delete result._id

        return result
    }

    async getAllGoals() {
        const result = await RecordModel.mongo.findOne({ _id: this.uid }, "metas")

        delete result._id

        return result
    }

    async update(data, week) {
        const document = await RecordModel.mongo.findOne({ _id: this.uid }, "ficha")

        for (const key in data) {
            if (!document[key]) {
                document[key] = {}
            }

            if (!document[key][week]) {
                document[key][week] = {}
            }

            // Valor del reporte
            document[key][week].v = data[key]
            // Administrador que realizo el cambio, en este caso el paciente
            document[key][week].a = this.uid
            document[key][week].f = new Date()
        }

        return await RecordModel.mongo.edit({ _id: this.uid }, document, "ficha")
    }
}

module.exports = RecordModel
