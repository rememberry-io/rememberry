import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { Client } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import {client} from './db/db'

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
