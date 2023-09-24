import type {Config} from 'drizzle-kit'
import { config } from 'dotenv'
config()

const pgHost = process.env.PG_HOST!
const pgDatabaseName = process.env.PG_DATABASE_NAME!
const pgUsername = process.env.PG_USERNAME!
const pgPassword = process.env.PG_PASSWORD!

export default {
    schema: "./src/db/schema.ts",
    driver: "pg",
    dbCredentials: {
        host: pgHost,
        port: 5433,
        user: pgUsername,
        password: pgPassword,
        database: pgDatabaseName,
    }
}satisfies Config;