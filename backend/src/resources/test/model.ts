import { DrizzleDB, db } from "../../db/db";
import { NewUser, users } from "../../db/schema";

class ExampleClass {
  db: DrizzleDB;
  constructor(db: DrizzleDB) {
    this.db = db;
  }
  async exampleUsage(newUser: NewUser) {
    try {
      const user = await this.db.drizzle
        .insert(users)
        .values(newUser)
        .returning();
      console.log(user);
    } catch (e) {
      console.error(e);
    }
  }
}

export const testModel = new ExampleClass(db);
