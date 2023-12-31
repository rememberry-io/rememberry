import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pool } from "./db";

const db = drizzle(pool);

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
