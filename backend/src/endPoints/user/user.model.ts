import { TRPCError } from "@trpc/server";
import { eq, ne, or } from "drizzle-orm";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { client } from "../../db/db";
import * as schema from "../../db/schema";

export const database = drizzle(client, { schema });

type credStatus = readonly [TRPCError, null] | readonly [null, boolean];

interface UserModel {
  createUser: (input: schema.NewUser, hashedPwd: string) => Promise<schema.NewUser[]>;
  getAllUsers: () => Promise<schema.User[]>;
  getUserById: (userId: string) => Promise<schema.User>;
  updateUserById: (userId: string, hashedPwd: string) => Promise<schema.User>;
  deleteUserById: (userId: string) => Promise<schema.User>;
  checkCredentials: (email: string, username: string) => Promise<credStatus>;
  getUsersWithSameInputCredentials: (input: schema.User) => Promise<schema.User[]>;
}

class UserModelDB implements UserModel {
  db: NodePgDatabase<typeof import("../../db/schema.ts")>;
  constructor(db: NodePgDatabase<typeof import("../../db/schema.ts")>) {
    this.db = db;
  }
  async createUser(
    input: schema.NewUser,
    hashedPwd: string,
  ): Promise<schema.NewUser[]> {
    const newUser = await database
      .insert(schema.users)
      .values({
        username: input.username,
        email: input.email,
        password: hashedPwd,
        refresh_token: null,
      })
      .returning();

    return newUser;
  }

  async getAllUsers() {
    const res = await database.select().from(schema.users);
    return res;
  }

  //TODO: validate that its only one user
  async getUserById(userId: string) {
    const user = await database
      .select()
      .from(schema.users)
      .where(eq(schema.users.user_id, userId));
    return user[0];
  }

  //TODO: userId and get User and check only one user gets returned
  async updateUserById(
    userId: string,
    hashedPwd: string,
  ): Promise<schema.User> {
    const user = await this.getUserById(userId)
    const updatedUser = await database
      .update(schema.users)
      .set({
        username: user.username,
        email: user.email,
        password: hashedPwd,
      })
      .where(eq(schema.users.user_id, userId))
      .returning();
    return updatedUser[0];
  }

  //TODO: check only one user exsits
  async deleteUserById(userId: string): Promise<schema.User> {
    const deletedUser = await database
      .delete(schema.users)
      .where(eq(schema.users.user_id, userId))
      .returning();
    return deletedUser[0];
  }

  async checkCredentials(email: string, username: string): Promise<credStatus>{
    if ((await this.checkUserEmail(email)) && (await this.checkUsername(username))) {
      return [
        new TRPCError({
          code: "FORBIDDEN",
          message: "USERNAME AND EMAIL ALREADY EXIST",
        }),
        null,
      ] as const;
    } else if (await this.checkUserEmail(email)) {
      return [
        new TRPCError({ code: "FORBIDDEN", message: "EMAIL ALREADY EXISTS" }),
        null,
      ] as const;
    } else if (await this.checkUsername(username)) {
      return [
        new TRPCError({ code: "FORBIDDEN", message: "USERNAME ALREADY EXISTS" }),
        null,
      ] as const;
    }
    return [null, true] as const;
  }

  async getUsersWithSameInputCredentials(
    input: schema.User,
  ): Promise<schema.User[]> {
    const res = await database
      .select()
      .from(schema.users)
      .where(
        or(
          eq(schema.users.email, input.email),
          eq(schema.users.username, input.username),
        ),
      )
      .where(ne(schema.users.user_id, input.user_id));
    return res;
  }
  private async checkUsername(username: string) {
    const user = await database
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username));
    if (user[0]) 
      return true;

    return false;
  }

  private async checkUserEmail(email: string) {
    const user = await database
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));
    if (user[0]) 
      return true;

    return false;
  }

}


export const userModelDB = new UserModelDB(database);
