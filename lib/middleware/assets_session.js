const Admin = require("package:/models/admin/admin")
const PatientModel = require("package:/models/patient/patient")

const { validateText } = require("package:/helpers/tools")

/**
 * Validación de sesión, el ACCESS actúa como un token de sesión tradicional o JWT, solo que este no contiene información
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
module.exports = async (req, _, next) => {
    if (req.path === "/health/") {
        return next()
    }

    if (req.headers.access == null) {
        return req.decline(1)
    }

    // eslint-disable-next-line no-useless-escape
    if (!validateText(req.headers.access, "$a-zA-Z0-9\-")) {
        return req.decline(1)
    }

    if (req.headers.access.split("-")[2][0] === "1") {
        const patient = await PatientModel.fromAccess(req.headers.access)

        if (!patient.issetSession) {
            return req.decline(1)
        }

        if (patient.restriction) {
            return req.decline(1)
        }

        req.session = patient
    } else {
        const admin = await Admin.fromAccess(req.headers.access)

        if (!admin.issetSession) {
            return req.decline(1)
        }

        if (admin.restriction) {
            return req.decline(1)
        }

        req.session = admin
    }

    return next()
}
