import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { Client } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { client } from "./db/db";
import { inferAsyncReturnType } from "@trpc/server";

export const db = drizzle(client) as NodePgDatabase<
  typeof import("./db/schema.ts")
>;

export const createContext = (opts: CreateHTTPContextOptions) => {
  const { req, res } = opts;
  return {
    req,
    res,
    db: db,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
