import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { Client } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import * as schema from './db/schema'

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

await client.connect()

export const db = drizzle(client) as NodePgDatabase<typeof import("/Users/lennartp./Desktop/Projekte/rememberry/backend/src/db/schema.ts")>

export const createContext = (opts: CreateHTTPContextOptions) => {
  const {req, res} = opts
  return {
    req,
    res,
    db: db,
  };
};

export type Context = ReturnType<typeof createContext>;
