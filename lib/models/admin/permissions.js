class PermissionsModel {
    constructor(permissions) {
        this.patientList = new Actions(permissions.patient_list)
        this.patient = new Actions(permissions.patient)
        this.teams = new Actions(permissions.teams)
        this.groups = new Actions(permissions.groups)
        this.variables = new Actions(permissions.variables)
        this.notifications = new Actions(permissions.notifications)
        this.record = new Actions(permissions.record)
        this.member = new Actions(permissions.member)
    }

    toMap() {
        return {
            patient_list: this.patientList.toMap(),
            patient: this.patient.toMap(),
            teams: this.teams.toMap(),
            groups: this.groups.toMap(),
            variables: this.variables.toMap(),
            notifications: this.notifications.toMap(),
            record: this.record.toMap(),
            member: this.member.toMap()
        }
    }
}

class Actions {
    constructor(permissions) {
        this.watch = `${permissions}`[0] === "1"
        this.create = `${permissions}`[1] === "1"
        this.edit = `${permissions}`[2] === "1"
        this.delete = `${permissions}`[3] === "1"
    }

    toMap() {
        return {
            watch: this.watch,
            create: this.create,
            edit: this.edit,
            delete: this.delete
        }
    }
}

module.exports = PermissionsModel
