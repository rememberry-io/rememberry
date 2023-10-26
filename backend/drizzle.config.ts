import type { Config } from "drizzle-kit";
import { dbCredentials } from "./src/db/db";

export default {
  schema: "./src/db/schema.ts",
  driver: "pg",
  out: "./drizzle",
  dbCredentials,
} satisfies Config;
