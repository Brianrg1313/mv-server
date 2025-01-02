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
        this.lists = new Actions(permissions.lists)
        this.collections = new Actions(permissions.collections)
        this.charts = new Actions(permissions.charts)
        this.drive = new Actions(permissions.drive)
        this.permissions = new Actions(permissions.permissions)
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
            member: this.member.toMap(),
            lists: this.lists.toMap(),
            collections: this.collections.toMap(),
            charts: this.charts.toMap(),
            drive: this.drive.toMap(),
            permissions: this.permissions.toMap()
        }
    }

    toWCED() {
        return {
            patient_list: this.patientList.toWCED(),
            patient: this.patient.toWCED(),
            teams: this.teams.toWCED(),
            groups: this.groups.toWCED(),
            variables: this.variables.toWCED(),
            notifications: this.notifications.toWCED(),
            record: this.record.toWCED(),
            member: this.member.toWCED(),
            lists: this.lists.toWCED(),
            collections: this.collections.toWCED(),
            charts: this.charts.toWCED(),
            drive: this.drive.toWCED(),
            permissions: this.permissions.toWCED()
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
        return [
            this.watch,
            this.create,
            this.edit,
            this.delete
        ]
    }

    toWCED() {
        return `${this.watch ? 1 : 0}${this.create ? 1 : 0}${this.edit ? 1 : 0}${this.delete ? 1 : 0}`
    }
}

module.exports = PermissionsModel
