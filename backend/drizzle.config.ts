import type { Config } from "drizzle-kit";
import { dbCredentials } from "./src/db/db";
import env from "./src/env";

const pgHost = env.PG_HOST;
const pgPort = env.PG_PORT;
const pgDatabaseName = env.PG_DATABASE_NAME;
const pgUsername = env.PG_USERNAME;
const pgPassword = env.PG_PASSWORD;

export default {
  schema: "./src/db/schema.ts",
  driver: "pg",
  dbCredentials,
} satisfies Config;
