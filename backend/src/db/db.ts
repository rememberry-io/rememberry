import { Client } from "pg";
import { PgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "dotenv";

config();

// const databaseUrl = process.env.DATABASE_URL || "";
const pgHost = process.env.PG_HOST || "";
const pgDatabaseName = process.env.PG_DATABASE_NAME || "";
const pgUsername = process.env.PG_USERNAME || "";
const pgPassword = process.env.PG_PASSWORD || "";

const client = new Client({
  host: pgHost,
  port: 5433,
  user: pgUsername,
  password: pgPassword,
  database: pgDatabaseName,
});

await client.connect()

export const db= drizzle(client)
