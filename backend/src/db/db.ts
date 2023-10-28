import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import env from "../env";
import * as schema from "./schema";

export const dbCredentials = {
  host: env.PG_HOST,
  port: env.PG_PORT,
  user: env.PG_USERNAME,
  password: env.PG_PASSWORD,
  database: env.PG_DATABASE_NAME,
};
export const client = new Client(dbCredentials);

const connectToDb = async () => {
  try {
    await client.connect();
  } catch (e) {
    console.log(e);
    throw e;
  }
};

connectToDb();

export const database = drizzle(client, { schema });

export type dbConnection = typeof database;
