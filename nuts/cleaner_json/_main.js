const fs = require("fs")

// Función para convertir cadenas numéricas a su tipo correspondiente
function convertStringsToNumbers(obj) {
    Object.keys(obj).forEach(key => {
        const value = obj[key]
        if (value === null) {
            // Eliminar claves con valor null
            delete obj[key]
        } else if (typeof value === "string") {
            const numValue = Number(value)
            if (!isNaN(numValue)) {
                // Si el valor es un número, lo convertimos
                obj[key] = numValue
            }
        } else if (typeof value === "object" && value !== null) {
            // Si el valor es un objeto o un array, llamamos recursivamente
            convertStringsToNumbers(value)
        }
    })
}

fs.readFile("E:/metodovargas/backend/server/nuts/cleaner_json/json.json", "utf8", (err, data) => {
    if (err) {
        console.error("Error al leer el archivo:", err)
        return
    }

    try {
        const jsonData = JSON.parse(data)
        convertStringsToNumbers(jsonData)

        // Escribir el archivo JSON limpio
        fs.writeFile("E:/metodovargas/backend/server/nuts/cleaner_json/archivo_limpio.json", JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Error al escribir el archivo:", writeErr)
            } else {
                console.log("Archivo limpio guardado como \"archivo_limpio.json\"")
            }
        })
    } catch (parseError) {
        console.error("Error al parsear el JSON:", parseError)
    }
})
