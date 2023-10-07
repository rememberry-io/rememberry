import { migrate } from "drizzle-orm/node-postgres/migrator";
import { config } from "dotenv";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { client } from "./db";
config();

const db = drizzle(client);

async function migrateDb() {
  try {
    console.log("migration started");
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("migration successful");
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
}

migrateDb().catch((err) => {
  console.error(err);
});
