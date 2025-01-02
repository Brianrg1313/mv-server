const Mongo = require("package:/servers/mongo")
const Mysql = require("package:/servers/mysql")
const Databases = require("package:/models/databases")
const RecordGears = require("package:/models/record/gears")

class RecordModel {
    static app = new Mongo(Databases.mongo.app)
    static mongo = new Mongo(Databases.mongo.patient)
    static mysql = new Mysql(Databases.mysql.patient)

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

    async updateGoals(goals, { insert = false }) {
        if (insert) {
            await RecordModel.mongo.insert({ _id: this.uid, ...goals }, "metas")
        } else {
            await RecordModel.mongo.edit({ _id: this.uid }, goals, "metas")
        }
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
    async update(data, week, { admin = null } = {}) {
        let document = await RecordModel.mongo.findOne({ _id: this.uid }, "ficha")
        let insert = false

        if (!document) {
            insert = true
            document = {
                _id: this.uid
            }
        }

        const edited = []

        const variables = {}

        for (const key in data) {
            variables[key] = await RecordModel.app.findOne({ _id: parseInt(key) }, "diccionario")
            const variable = variables[key]

            if (!variable) {
                continue
            } else if (variable.tipo === 1) {
                // Variable semanal, el if existe para que no se hagan otras comprovaciones
            } else if (variable.tipo === 2) {
                // Variable que replica el valor de su semana anterior, de esto se encarga
                // la rutina [/*Aun por crear, inserte aqui el archivo una vez se cree la rutina*/]
                // el if existe para que no se hagan otras comprovaciones
            } else if (variable.tipo === 3) {
                continue
                // Variable que replica el valor inicial de otra variable, no deberia se puede modificar
                // El if existe para que no se hagan otras comprovaciones
            } else if (variable.tipo === 4) {
                // Variable especial que hace un calculo, aun no se definen rutinas
            } else if (variable.tipo === 5) {
                week = 0
                // Variable que solo puede tener un valor, el tiempo no influye en ella y tampoco necesita calculos
            }

            if (week === 1) {
                if (variable.referenciada) {
                    const reference = await RecordModel.app.find({ referencia: parseInt(key) }, "diccionario")

                    if (Object.keys(reference).length !== 0) {
                        for (const v of reference) {
                            if (!document[v._id]) {
                                document[v._id] = {}
                            }

                            if (!document[v._id][0]) {
                                document[v._id][0] = {}
                            }

                            console.log(v)

                            edited.push(v._id)
                            // Valor del reporte
                            document[v._id][0].v = data[key]
                            // Administrador que realizo el cambio, en este caso el paciente
                            document[v._id][0].a = admin ?? 0
                            document[v._id][0].f = new Date()
                        }
                    }
                }
            }

            if (!document[key]) {
                document[key] = {}
            }

            if (!document[key][week]) {
                document[key][week] = {}
            }

            if (!edited.includes(key)) {
                edited.push(key)
            }

            // Valor del reporte
            document[key][week].v = data[key]
            // Administrador que realizo el cambio, en este caso el paciente
            document[key][week].a = admin ?? 0
            document[key][week].f = new Date()
        }

        for (const key in data) {
            const variable = variables[key]

            if (!variable) continue
            if (!variable.rutinas) continue

            const gears = new RecordGears(document, admin.id)
            await gears.runRoutine(variable.rutinas, week)

            for (const item of gears.edited) {
                if (!edited.includes(item)) {
                    edited.push(item)
                }
            }
        }

        if (insert) {
            await RecordModel.mongo.insert(document, "ficha")
        } else {
            await RecordModel.mongo.edit({ _id: this.uid }, document, "ficha")
        }

        const response = {}

        for (const item of edited) {
            response[item] = document[item]
        }

        return response
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
