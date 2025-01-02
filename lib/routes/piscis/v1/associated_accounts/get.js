const SessionModel = require("package:/models/session")
const PatientModel = require("package:/models/patient/patient")
/**
 * Devuelve los usuarios que tienen una cuenta asociada con un dispositivo
 * @param {Request} context
 * @returns
 */
module.exports = async (context) => {
    const session = new SessionModel()

    const device = await session.findDeviceByToken(context.headers.device)

    if (!device) {
        return context.finish(null)
    }

    if (device.blq !== null) {
        return context.finish(null)
    }

    const uids = await session.getAccountsAssociated(device.id)

    if (uids.length === 0) {
        return context.finish(null)
    }

    const patients = await PatientModel.listOfPatients(uids)

    return context.finish(patients)
}
