require("module-alias/register")

let envPath

if (parseInt(process.env.DEV) === 1) {
    envPath = "./lib/private/env.dev"
} else {
    envPath = "./lib/private/env.dev"
}

process.loadEnvFile(`${envPath}/.env.config`)
process.loadEnvFile(`${envPath}/.env.credentials`)
process.loadEnvFile(`${envPath}/.env.databases`)
process.loadEnvFile(`${envPath}/.env.tokens`)

const ExpressServer = require("package:/servers/express")
const AssetsServer = require("package:/servers/assets")

async function main() {
    const server = new ExpressServer()
    const assets = new AssetsServer()

    server.prepare()
    assets.prepare()

    server.readRoutes("./lib/routes")
    assets.readRoutes()

    server.listen()
    assets.listen()
}

main()

// docker exec -u root -t mariadb mysqldump -u clientes -p MV_app > database_backup.sql
