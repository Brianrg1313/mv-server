const AppModel = require("package:/models/app")

const { intToAbc } = require("package:/helpers/tools")

/**
 * Esta petición devuelve los siguientes datos:
 * Colecciones: La funcionalidad de las colecciones es agrupar variables
 * Variables: Se devuelven todas las variables disponibles en el diccionario, estas variables son las responsables de organizar y darle forma a los datos reportados por el pacientes, proveen el titulo de la variable, el tipo de datos que puede almacenar entre muchos otros parámetros de configuración
 * opciones: Las opciones son datos que pueden variar, pero su finalidad es aportar funcionalidad a las aplicaciones, entre ellas están:
 * - teléfono: Una lista con los códigos de telefónico de los países que están disponibles para nuestra aplicación, para un mayor control estos datos son enviados al cliente y no generados en la aplicación
 * - dni: Una lista con los códigos de documentos de identidad de los países que están disponibles para nuestra aplicación, para un mayor control estos datos son enviados al cliente y no generados en la aplicación
 * @param {Request} context
 */
module.exports = async (context) => {
    const app = new AppModel()

    // Las variables tienen titulo en español e ingles, el titulo entregado depende de las preferencias del cliente
    const lang = context.headers["accept-language"]

    // #region: Indexación
    const optionKeys = ["titulo", "recurso", "valor", "minimo", "maximo"]

    const variablesKeys = {
        _id: "id",
        icono: "icono",
        [lang]: "titulo",
        [`sub${lang}`]: "subtitulo",
        tamano: "tamano",
        espacio: "espacio",
        bandera: "bandera",
        tipo: "tipo",
        formato: "formato",
        referencia: "referencia",
        constante: "constante",
        coleccion: "coleccion",
        abreviacion: "abreviacion",
        editable: "editable",
        indexable: "indexable",
        posicion: "posicion"
    }

    const response = {
        colecciones: {
            claves: ["id", "titulo", "icono", "posicion", "variables"],
            valores: []
        },
        variables: {
            claves: Object.values(variablesKeys),
            valores: []
        },
        opciones: {
            claves: optionKeys,
            telefono: [],
            dni: []
        }
    }

    const variables = await app.getAllVariables()
    const collections = await app.getAllCollections(lang)

    // #region: Variables
    for (const variable of variables) {
        if (variable.estado === 1) continue
        const item = []
        for (const key of Object.keys(variablesKeys)) {
            if (key === "abreviacion") {
                item.push(intToAbc(variable[key]))
            } else if (key === "indexable" || key === "editable") {
                item.push(variable[key] ?? 1)
            } else {
                item.push(variable[key])
            }
        }
        response.variables.valores.push(item)
    }

    // #region: Colecciones
    for (const collection of collections) {
        const item = []
        for (const key of response.colecciones.claves) {
            if (key === "variables") {
                if (collection[key] === null) {
                    item.push(collection[key])
                } else {
                    item.push(JSON.parse(collection[key]))
                }
            } else {
                item.push(collection[key])
            }
        }
        response.colecciones.valores.push(item)
    }

    // #region: Opciones
    const telephone = await app.getTelephone(lang)

    for (const items of telephone) {
        const item = []
        for (const k of Object.values(optionKeys)) {
            item.push(items[k])
        }
        response.opciones.telefono.push(item)
    }

    const dni = await app.getDNI(lang)

    for (const items of dni) {
        const item = []
        for (const k of Object.values(optionKeys)) {
            item.push(items[k])
        }
        response.opciones.dni.push(item)
    }

    return context.finish(response)
}
