require("module-alias/register")

const envPath = "./lib/private/env"

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
