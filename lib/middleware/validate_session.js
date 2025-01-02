const PatientModel = require("package:/models/patient/patient")
const AdminModel = require("package:/models/admin/admin")

const { validateText } = require("package:/helpers/tools")

/**
 * Validación de sesión, el ACCESS actúa como un token de sesión tradicional o JWT, solo que este no contiene información
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
module.exports = async (req, _, next) => {
    if (req.headers.access == null) {
        return req.decline(22, 401, "No hay un ACCESS token")
    }

    // eslint-disable-next-line no-useless-escape
    if (!validateText(req.headers.access, "$a-zA-Z0-9\-")) {
        return req.decline(9, 403, "ACCESS token invalido")
    }

    if (req.headers.access.split("-")[2][0] === "1") {
        const patient = await PatientModel.fromAccess(req.headers.access)

        if (!patient.issetSession) {
            return req.decline(24, 403, "No existe la sesión")
        }

        if (patient.restriction) {
            return req.decline(25, 403, "Cuenta bloqueada indefinidamente")
        }

        req.session = patient
    } else {
        const Admin = await AdminModel.fromAccess(req.headers.access)

        if (!Admin.issetSession) {
            return req.decline(24, 403, "No existe la sesión")
        }

        if (Admin.restriction) {
            return req.decline(25, 403, "Cuenta bloqueada indefinidamente")
        }

        req.session = Admin
    }

    return next()
}
