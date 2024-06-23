const crypto = require("crypto")
const fs = require("fs")

module.exports = (file) => {

    const data = fs.readFileSync("./lib/private/" + file +".key", { encoding: "utf8", flag: "r" })
    const key = Buffer.from(process.env.CYPHER_KEY, "base64")
    const iv = Buffer.from(process.env.CYPHER_IV, "base64")
    const encryptedText = Buffer.from(data, "base64")
    const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return JSON.parse(decrypted.toString())
}