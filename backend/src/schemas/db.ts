import { Pool } from 'pg'
import { config } from "dotenv";

config();

// const databaseUrl = process.env.DATABASE_URL || "";
const pgHost = process.env.PG_HOST || "";
const pgDatabaseName = process.env.PG_DATABASE_NAME || "";
const pgUsername = process.env.PG_USERNAME || "";
const pgPassword = process.env.PG_PASSWORD || "";

const pool = new Pool({
    user: pgUsername,
    password: pgPassword,
    host: pgHost,
    database: pgDatabaseName,
    port: 5433,
})

export default pool


