import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { Pool } from "pg";

const dbUser: string = process.env.PG_USERNAME!;
const dbPassword: string = process.env.PG_PASSWORD!;
const dbPort: number = +process.env.PG_PORT!;
const databaseName: string = process.env.PG_DATABASE_NAME!;
const dbHost: string = process.env.PG_HOST!;

const pool = new Pool({
  user: dbUser,
  password: dbPassword,
  host: dbHost,
  database: databaseName,
  port: dbPort,
});

export const createContext = (opts: CreateHTTPContextOptions) => {
  const {req, res} = opts
  return {
    req,
    res,
    db: pool,
  };
};

export type Context = ReturnType<typeof createContext>;
