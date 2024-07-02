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
    async getRecord() {
        const result = await RecordModel.mongo.findOne({ uid: 1 }, "record")

        delete result._id
        delete result.uid

        return result
    }
}

module.exports = RecordModel
