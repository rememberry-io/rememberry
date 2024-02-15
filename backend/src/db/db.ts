import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "../env";
import * as schema from "./schema";

export const dbCredentials = {
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
};

export const pool = new Pool(dbCredentials);

const connectToDb = async () => {
  try {
    await pool.connect();
  } catch (e) {
    console.log(e);
    throw e;
  }
};

connectToDb();

export async function initDbListener() {
  pool.query("LISTEN stack_change");
  pool.on("connect", async (message) => {
    //cacheController.controlTriggerMessage(message);
  });
}
//initDbListener();

export const db = drizzle(pool, { schema });

export type dbConnection = typeof db;
