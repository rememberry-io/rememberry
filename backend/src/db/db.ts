import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as cacheController from "../endPoints/cache/cacheController";
import env from "../env";

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

export async function initDbListener() {
  client.query("LISTEN stack_change");
  client.on("notification", async (message) => {
    cacheController.controlTriggerMessage(message);
  });
}
initDbListener();

export const db = drizzle(client);
