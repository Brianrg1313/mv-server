const Databases = require("package:/models/databases")
const Mongo = require("package:/servers/mongo")
const Mysql = require("package:/servers/mysql")

class RecordModel {
    static mongo = new Mongo(Databases.mongo.patient)
    static mysql = new Mysql(Databases.mysql.patient)

    /**
     * Variables que generan un resumen, cada vez que se reporta una de estas variables se debe re-calcular todos los reportes relacionados con su resumen
     * Las claves son los ID de las variables individuales
     * Los valores son los ID de las variables que guardan el resumen de todas las variables relacionadas (las claves)
     */
    static summaries = {
        // Resumen Alimentos
        129: 147, // cumplimiento
        150: 147, // a3
        139: 147, // pdulces
        138: 147, // pharinas
        // Resumen Medio ambiente y actitudes
        65: 149, // b1
        66: 149, // b2
        67: 149, // b3
        68: 149, // b4
        69: 149, // b5
        70: 149, // b6
        71: 149, // b7
        59: 149, // c1
        60: 149, // c2
        61: 149, // c3
        62: 149, // c4
        63: 149, // c5
        // Resumen ejercicios
        154: 148, // Caminar
        168: 148 // Suenoe
    }

    /**
     * Controla todos los datos referentes a la ficha medica del paciente los cuales tienen seguimiento por semanas
     * La mayoría de estos datos se almacenan en mongo
     * @param {Number} id Identificador del paciente
     */
    constructor(id) {
        this.uid = id
    }

    /**
     * Obtiene todos los datos de la ficha medica de este paciente
     * @returns {Promise<Array<Object>>}
     */
    async getAllRecord() {
        const result = await RecordModel.mongo.findOne({ _id: this.uid }, "ficha")

        if (!result) return null

        delete result._id

        return result
    }

    /**
     * Devuelve las metas de cada variable, y los datos de cada meta son estos:
     * s: Semanas para alcanzar la metas
     * m: Meta de la variable
     * a: Autor, quien asigno esa meta
     * f: la fecha del cambio
     * @returns {Promise<Array<Object>>}
     */
    async getAllGoals() {
        const result = await RecordModel.mongo.findOne({ _id: this.uid }, "metas")

        if (!result) return null

        delete result._id

        return result
    }

    /**
     * Define cuales variables son visibles y editable para el paciente
     * v: Un booleano que define si la variable es visible para el paciente
     * e: Un booleano que define si la variable es editable para el paciente
     * @returns {Promise<Map<String, Object>>}
     */
    async getExceptions() {
        const result = await RecordModel.mysql.find("SELECT `variable`,`visible`,`editable` FROM `variables` WHERE `uid` = " + this.uid + "  OR `uid` = 0")

        const response = new Map()

        if (result) {
            for (const item of result) {
                response.set(item.variable, {
                    v: item.visible,
                    e: item.editable
                })
            }
        }

        return response
    }

    async getWeeklyFlaws(week) {
        const result = await RecordModel.mysql.find("SELECT `nota` FROM `fallas_semanales` WHERE `uid` = '" + this.uid + "' AND `semana` = '" + week + "'")

        if (result.length === 0) {
            return null
        }

        return result
    }

    get notesKeys() {
        return { admin: "administrador", profession: "profesion", t: "texto", c: "color", f: "fecha" }
    }

    async getAllNotes() {
        return await RecordModel.mongo.find({ uid: this.uid }, "notas")
    }

    // #region: UPDATE
    /**
     * Actualiza los registros de un paciente, si una de las variables tiene tareas automáticas asignada se realiza dentro de esta funcionalidad ya que se actualiza la ficha entera al editar solo una variable, si la variable o la semana no existe se crea automáticamente al ordenar los datos
     * @param {Object} data Las claves deben ser el ID de la variable a editar y el valor los nuevos datos
     * @param {*} week Semana en la que se van a insertar los datos de la variable
     * @returns {Object} retorna la ficha entera con los datos actualizados
     */
    async update(data, week) {
        let document = await RecordModel.mongo.findOne({ _id: this.uid }, "ficha")
        let insert = false

        if (!document) {
            insert = true
            document = {
                _id: this.uid
            }
        }
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

            // #region: Automáticos
            // TODO: ID de peso
            if (key === "7") {
                if (week === 1) {
                    // TODO: ID de Peso programado
                    document["226"] = await this.calculatePP(data[key])
                }

                // TODO: ID de peso color
                await this.calculatePC(document)
            }

            // TODO: ID de grasa
            if (key === "8") {
                if (week === 1) {
                    // TODO: ID de grasa programada
                    document["229"] = await this.calculateGP(data[key])
                }

                // TODO: ID de grasa color
                await this.calculateGC(document)
            }

            if (RecordModel.summaries[key]) {
                const resume = RecordModel.summaries[key]
                await this.calculateResume(resume, document, week)
            }
        }

        if (insert) {
            await RecordModel.mongo.insert(document, "ficha")
        } else {
            await RecordModel.mongo.edit({ _id: this.uid }, document, "ficha")
        }

        delete document._id
        return document
    }

    // #region: Peso
    /**
     * Se calcula el peso que debe perder el paciente a traves del tiempo
     * @param {Double} initialWight Peso inicial, del que partirá el calculo
     * @returns Una lista con las semanas y el peso programado en cada semana
     */
    async calculatePP(initialWight) {
        // TODO: ID de peso
        const id = 7
        const goals = await this.getAllGoals()

        if (!goals ? [id] : null) return null

        if (!goals[id].s) return null

        if (!goals[id].m) {
            goals[id].m = initialWight - (((80 / 1000) * 7) * goals[id].s)

            goals._id = this.uid

            RecordModel.mongo.edit({ _id: this.uid }, goals, "metas")
        }

        let extra = (initialWight - goals[id].m) / goals[id].s

        if (extra < 0) {
            extra = 0
        }

        const response = {}

        for (let i = 1; i <= goals[id].s; i++) {
            response[i] = {
                v: initialWight - (extra * i),
                a: this.uid,
                f: new Date()
            }

            if (i === 1) {
                response[i].v = initialWight
            }
        }

        return response
    }

    /**
     * Compara el peso programado y el peso actual para asignar un color según un margen de peso mínimo para cada color
     * @param {Object} document Ficha con todos los datos del paciente
     */
    async calculatePC(document) {
        // TODO: ID peso programado
        if (!document["226"]) return null

        // ID peso color
        if (!document["227"]) {
            document["227"] = {}
        }

        let oldWeight = 0

        // TODO: ID peso
        for (const week in document["7"]) {
            if (!document["226"][week]) continue
            const weight = document["7"][week].v
            if (oldWeight === 0) {
                oldWeight = weight
            }

            const programmed = document["226"][week].v

            if (!document["227"][week]) {
                document["227"][week] = {
                    v: 0,
                    a: this.uid,
                    f: new Date()
                }
            }

            if (programmed === 0) {
                document["227"][week].v = 0
            } else if (weight > (programmed + 2)) {
                document["227"][week].v = 1
            } else if (weight > (programmed + 1.5)) {
                document["227"][week].v = 2
            } else if (weight > (programmed + 1)) {
                document["227"][week].v = 3
            } else if (weight > (programmed + 0.5)) {
                document["227"][week].v = 4
            } else {
                document["227"][week].v = 5
            }

            // TODO: ID Peso perdido
            if (!document["5"]) {
                document["5"] = {}
            }

            if (!document["5"][week]) {
                document["5"][week] = {
                    v: 0,
                    a: this.uid,
                    f: new Date()
                }
            }

            document["5"][week].v = (oldWeight - weight)
            oldWeight = weight
        }

        return document["227"]
    }

    // #region: Grasa
    /**
     * Se calcula la grasa que debe perder el paciente a traves del tiempo
     * @param {Double} initialWight Grasa inicial, del que partirá el calculo
     * @returns Una lista con las semanas y la grasa programada en cada semana
     */
    async calculateGP(initialFat) {
        const id = 8
        const goals = await this.getAllGoals()

        if (!goals ? [id] : null) return null

        if (!goals[id].s) return null

        if (!goals[id].m) return null

        const extra = (initialFat - goals[id].m) / goals[id].s

        const response = {}

        for (let i = 1; i <= goals[id].s; i++) {
            response[i] = {
                v: initialFat - (extra * i),
                a: this.uid,
                f: new Date()
            }

            if (i === 1) {
                response[i].v = initialFat
            }
        }

        return response
    }

    /**
     * Compara la grasa programada y la grasa actual para asignar un color según un margen de grasa mínimo para cada color
     * @param {Object} document Ficha con todos los datos del paciente
     */
    async calculateGC(document) {
        // TODO: ID grasa programada
        if (!document["229"]) return null

        // ID grasa color
        if (!document["228"]) {
            document["228"] = {}
        }

        let oldFat = 0

        // TODO: ID peso
        for (const week in document["8"]) {
            if (!document["229"][week]) continue
            const fat = document["8"][week].v

            if (oldFat === 0) {
                oldFat = fat
            }

            const programmed = document["229"][week].v

            if (!document["228"][week]) {
                document["228"][week] = {
                    v: 0,
                    a: this.uid,
                    f: new Date()
                }
            }

            if (programmed === 0) {
                document["228"][week].v = 0
            } else if (fat > (programmed + 0.6)) {
                document["228"][week].v = 1
            } else if (fat > (programmed + 0.5)) {
                document["228"][week].v = 2
            } else if (fat > (programmed + 0.4)) {
                document["228"][week].v = 3
            } else if (fat > (programmed + 0.3)) {
                document["228"][week].v = 4
            } else {
                document["228"][week].v = 5
            }

            // TODO: ID grasa perdida
            if (!document["6"]) {
                document["6"] = {}
            }

            if (!document["6"][week]) {
                document["6"][week] = {
                    v: 0,
                    a: this.uid,
                    f: new Date()
                }
            }

            document["6"][week].v = (oldFat - fat)
            oldFat = fat
        }

        return document["228"]
    }

    // #region: Resúmenes
    /**
     * Genera un resumen de un grupo de variables [RecordModel.summaries]
     * @param {*} resumeID ID de la variable que guardara el resumen generado
     * @param {*} document Ficha con todos los datos del paciente, para obtener los datos de todas las variables que conforman el resumen
     * @param {*} week Semana
     * @returns {Object} Devuelve una lista con las semanas actualizadas
     */
    async calculateResume(resumeID, document, week) {
        let total = 0
        let variables = 0

        for (const key in RecordModel.summaries) {
            if (resumeID !== RecordModel.summaries[key]) continue

            variables++

            if (!document[key]) continue

            if (document[key][week]) {
                total = total + document[key][week].v
            }
        }

        let resume = {}

        if (document[resumeID]) {
            resume = document[resumeID]
        }

        if (!resume[week]) {
            resume[week] = {
                v: 0,
                a: this.uid,
                f: new Date()
            }
        }

        let result = Math.round(total / variables)

        if (result < 1) {
            result = 0
        }

        resume[week].v = result

        document[resumeID] = resume

        return document[resumeID]
    }
}

module.exports = RecordModel
