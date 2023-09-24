import { migrate } from "drizzle-orm/node-postgres/migrator";
import { config } from "dotenv";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
config();

const pgHost = process.env.PG_HOST || "";
const pgDatabaseName = process.env.PG_DATABASE_NAME || "";
const pgUsername = process.env.PG_USERNAME || "";
const pgPassword = process.env.PG_PASSWORD || "";

export const client = new Client({
  host: pgHost,
  port: 5433,
  user: pgUsername,
  password: pgPassword,
  database: pgDatabaseName,
});

const db = drizzle(client)

async function migrateDb(){
    try {
        console.log('migration started')
        await migrate(db, {migrationsFolder:"drizzle"})
        console.log('migration successful')
        process.exit(0)
    } catch (error) {
        console.error(error)
    }
}

migrateDb().catch(err=>{console.error(err)})