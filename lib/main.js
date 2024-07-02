require("module-alias/register")

let envPath

if (parseInt(process.env.DEV) === 1) {
    envPath = "./lib/private/env.dev"
} else {
    envPath = "./lib/private/env"
}

process.loadEnvFile(`${envPath}/.env.config`)
process.loadEnvFile(`${envPath}/.env.credentials`)
process.loadEnvFile(`${envPath}/.env.databases`)
process.loadEnvFile(`${envPath}/.env.tokens`)

const ExpressServer = require("package:/servers/express")

async function main() {
    const server = new ExpressServer()

    server.prepare()

    server.readRoutes("./lib/routes")

    server.listen()
}

main()

// docker exec -u root -t mariadb mysqldump -u clientes -p MV_app > database_backup.sql
