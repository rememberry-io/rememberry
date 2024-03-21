import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../env";
import * as schema from "./schema";

type DBCredentials = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};
export const generateDBCreds = (): DBCredentials => {
  return {
    user: env.get("POSTGRES_USER"),
    password: env.get("POSTGRES_PASSWORD"),
    host: env.get("POSTGRES_HOST"),
    port: env.get("POSTGRES_PORT"),
    database: env.get("POSTGRES_DB"),
  };
};

//export async function initDbListener() {
//  pool.query("LISTEN stack_change");
//  pool.on("connect", async (message) => {
//    //cacheController.controlTriggerMessage(message);
//  });
//}
//initDbListener();

export class DrizzleDB {
  drizzle: NodePgDatabase<typeof schema>;
  private pool: Pool;
  constructor() {
    this.pool = new Pool(generateDBCreds());
    this.drizzle = drizzle(this.pool, { schema });
  }

  async updateDBConnection() {
    await this.pool.end();

    this.pool = new Pool(generateDBCreds());

    this.drizzle = drizzle(this.pool, { schema });

    return this.drizzle;
  }
}

export const db = new DrizzleDB();
