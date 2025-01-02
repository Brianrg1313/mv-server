const Mongo = require("package:/servers/mongo")
const Mysql = require("package:/servers/mysql")
const Databases = require("package:/models/databases")

class RecordGears {
    static app = new Mongo(Databases.mongo.app)
    static mongo = new Mongo(Databases.mongo.patient)
    static mysql = new Mysql(Databases.mysql.patient)

    edited = []

    constructor(document, aid) {
        this.document = document
        this.uid = document._id
        this.aid = aid
    }

    async runRoutine(routines, week) {
        for (const routine of routines) {
            const call = await RecordGears.app.findOne({ _id: routine }, "rutinas")

            if (!call) continue
            if (!call.resultado) continue
            if (!this[call._id]) continue

            let resources = {}

            if (call.recursos) {
                resources = call.recursos
            }

            await this[call._id](resources, week, call.resultado)

            if (!this.edited.includes(call.resultado)) {
                this.edited.push(call.resultado)
            }
        }
    }

    async programmedWeight(resources, week, id) {
        if (week !== 1) return null

        const initial = this.document[resources.weight][1]?.v
        if (!initial) return null

        const goals = await this.getAllGoals()

        let updateGoals = false

        if (!goals[resources.weight]) {
            goals[resources.weight] = {
                a: 0,
                f: new Date()
            }

            goals._id = this.uid
            try {
                await RecordGears.mongo.insert(goals, "metas")
            } catch (e) {}
        }

        let goal = goals[resources.weight].m

        if (!goal) {
            const height = await RecordGears.mysql.findOne("SELECT `talla` FROM `complementarios` WHERE `uid` = " + this.uid, "talla")

            goal = (height - 100) + 5
            goals[resources.weight].m = goal
            updateGoals = true
        }

        let weeks = goals[resources.weight].s

        if (!weeks) {
            weeks = Math.ceil((initial - goal) / 0.56)
            goals[resources.weight].s = weeks
            updateGoals = true
        }

        if (updateGoals) {
            await RecordGears.mongo.edit({ _id: this.uid }, goals, "metas")
        }

        let gr = (initial - goal) / weeks

        if (gr < 0) {
            gr = 0
        }

        const response = {}

        for (let i = 1; i <= weeks; i++) {
            response[i] = { v: parseFloat((initial - (gr * i)).toFixed(2)) }
        }

        this.document[id] = response
    }

    async programmedFat(resources, week, id) {
        if (week !== 1) return null

        const initial = this.document[resources.fat][1]?.v
        if (!initial) return null

        const goals = await this.getAllGoals()

        let updateGoals = false

        if (!goals[resources.fat]) {
            goals[resources.fat] = {
                a: 0,
                f: new Date()
            }

            goals._id = this.uid
            try {
                await RecordGears.mongo.insert(goals, "metas")
            } catch (e) {}
        }

        let goal = goals[resources.fat].m

        if (!goal) {
            goal = 20
            goals[resources.fat].m = goal
            updateGoals = true
        }

        let weeks = goals[resources.fat].s

        if (!weeks) {
            weeks = 20
            goals[resources.fat].s = weeks
            updateGoals = true
        }

        if (updateGoals) {
            await RecordGears.mongo.edit({ _id: this.uid }, goals, "metas")
        }

        /// porcentaje por semana
        let pps = (initial - goal) / weeks

        if (pps < 0) {
            pps = 0
        }

        const response = {}

        for (let i = 1; i <= weeks; i++) {
            response[i] = { v: parseFloat((initial - (pps * i)).toFixed(2)) }
        }

        this.document[id] = response
    }

    async weightColor(resources, _, id) {
        const weight = this.document[resources.weight]
        const programmed = this.document[resources.programmed]

        if (!weight) return null
        if (!programmed) return null

        const color = {}
        const lostWeight = {}

        let oldWeight = 0

        for (const w in weight) {
            const weekWeight = weight[w].v
            if (!programmed[w]) continue

            const weekProgrammed = programmed[w].v
            let lw = 0

            if (w === "1") {
                color[w] = { v: 0 }
            } else if (weekProgrammed <= 0) {
                lw = oldWeight - weekWeight
                color[w] = { v: 0 }
            } else if (weekWeight > (weekProgrammed + 2)) {
                lw = oldWeight - weekWeight
                color[w] = { v: 1 }
            } else if (weekWeight > (weekProgrammed + 1.5)) {
                lw = oldWeight - weekWeight
                color[w] = { v: 2 }
            } else if (weekWeight > (weekProgrammed + 1)) {
                lw = oldWeight - weekWeight
                color[w] = { v: 3 }
            } else if (weekWeight > (weekProgrammed + 0.5)) {
                lw = oldWeight - weekWeight
                color[w] = { v: 4 }
            } else {
                lw = oldWeight - weekWeight
                color[w] = { v: 5 }
            }

            if (lw < 0) {
                lw = 0
            }

            lostWeight[w] = { v: lw }

            oldWeight = weekWeight
        }

        this.document[resources.lostWeight] = lostWeight
        this.document[id] = color
    }

    async avgFood(resources, week, id) {
        this.avg(resources, week, id)
    }

    async avgEnvironment(resources, week, id) {
        this.avg(resources, week, id)
    }

    async avgAttitudes(resources, week, id) {
        this.avg(resources, week, id)
    }

    async avg(resources, week, id) {
        let length = 0
        let total = 0
        for (const variable of resources) {
            length++
            if (!this.document[variable]) continue
            if (!this.document[variable][week]) continue
            total += this.document[variable][week].v ?? 0
        }

        if (!this.document[id]) {
            this.document[id] = {}
        }

        if (!this.document[id][week]) {
            this.document[id][week] = {
                f: new Date()
            }
        }

        this.document[id][week].v = Math.round(total / length)
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
        const result = await RecordGears.mongo.findOne({ _id: this.uid }, "metas")

        if (!result) return {}

        delete result._id

        return result
    }
}

module.exports = RecordGears
