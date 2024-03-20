import type { Config } from "drizzle-kit";
import { generateDBCreds } from "./src/db/db";

export default {
  schema: "./src/db/schema.ts",
  driver: "pg",
  out: "./drizzle",
  dbCredentials: generateDBCreds(),
} satisfies Config;
