import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "dotenv";

config();

const pgHost = process.env.PG_HOST || "";
const pgPort = process.env.PG_PORT || "";
const pgDatabaseName = process.env.PG_DATABASE_NAME || "";
const pgUsername = process.env.PG_USERNAME || "";
const pgPassword = process.env.PG_PASSWORD || "";

export const client = new Client({
  host: pgHost,
  port: parseInt(pgPort),
  user: pgUsername,
  password: pgPassword,
  database: pgDatabaseName,
});

const connectToDb= async () =>  {
  try {
    await client.connect();
  } catch (e) {
    console.log(e)
    throw e
  }
}

connectToDb()

export const db = drizzle(client);
