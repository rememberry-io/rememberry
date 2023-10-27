import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { database, dbConnection } from "../../db/db";
import * as schema from "../../db/schema";
import { JWTPayload } from "../login/types.ts";
import { UserCredentialCheckReturn, UserStatus } from "./types.ts";

type Token = string;

type Email = string;

type GetUserCredStatus =
  | readonly [TRPCError, null]
  | readonly [null, UserCredentialCheckReturn];

export interface UserModel {
  createUser: (input: schema.NewUser, hashedPwd: string) => Promise<UserStatus>;
  getAllUsers: () => Promise<schema.User[]>;
  getUserById: (userId: string) => Promise<UserStatus>;
  updateUserById: (
    userId: string,
    userInput: schema.User,
    hashedPwd: string,
  ) => Promise<UserStatus>;
  deleteUserById: (userId: string) => Promise<UserStatus>;
  getUserIdAndPwByEmail: (email: Email) => Promise<GetUserCredStatus>;
  updateUserRefreshToken: (token: string) => Promise<UserStatus>;
  checkUsername: (input: string) => Promise<boolean>;
  checkUserEmail: (input: string) => Promise<boolean>;
}

class UserModelDB implements UserModel {
  private db: dbConnection;
  constructor(db: dbConnection) {
    this.db = db;
  }
  async createUser(input: schema.NewUser, hashedPwd: string) {
    const newUser = await this.db
      .insert(schema.users)
      .values({
        username: input.username,
        email: input.email,
        password: hashedPwd,
        refresh_token: null,
      })
      .returning();

    if (newUser.length < 0 || newUser.length > 1)
      return [new TRPCError({ code: "INTERNAL_SERVER_ERROR" }), null] as const;

    return [null, newUser[0]] as const;
  }

  async getAllUsers() {
    const res = await this.db.select().from(schema.users);
    return res;
  }

  async getUserById(userId: string) {
    const user = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.user_id, userId));

    if (user.length < 0)
      return [new TRPCError({ code: "NOT_FOUND" }), null] as const;
    if (user.length > 1)
      return [new TRPCError({ code: "INTERNAL_SERVER_ERROR" }), null] as const;

    return [null, user[0]] as const;
  }

  async updateUserById(
    userId: string,
    userInput: schema.User,
    hashedPwd: string,
  ) {
    const updatedUser = await this.db
      .update(schema.users)
      .set({
        username: userInput.username,
        email: userInput.email,
        password: hashedPwd,
      })
      .where(eq(schema.users.user_id, userId))
      .returning();

    if (updatedUser.length < 0 || updatedUser.length > 1)
      return [new TRPCError({ code: "INTERNAL_SERVER_ERROR" }), null] as const;

    return [null, updatedUser[0]] as const;
  }

  async deleteUserById(userId: string) {
    const deletedUser = await this.db
      .delete(schema.users)
      .where(eq(schema.users.user_id, userId))
      .returning();

    if (deletedUser.length < 0)
      return [new TRPCError({ code: "NOT_FOUND" }), null] as const;
    if (deletedUser.length > 1)
      return [new TRPCError({ code: "INTERNAL_SERVER_ERROR" }), null] as const;

    return [null, deletedUser[0]] as const;
  }

  async getUserIdAndPwByEmail(email: Email) {
    const res = await this.db
      .select({
        user_id: schema.users.user_id,
        password: schema.users.password,
      })
      .from(schema.users)
      .where(and(eq(schema.users.email, email)));

    if (res.length < 0)
      return [new TRPCError({ code: "NOT_FOUND" }), null] as const;
    if (res.length < 1)
      return [new TRPCError({ code: "INTERNAL_SERVER_ERROR" }), null] as const;

    const user: UserCredentialCheckReturn = {
      userId: res[0].user_id,
      password: res[0].password,
    };

    return [null, user] as const;
  }

  async updateUserRefreshToken(token: Token) {
    const decodedToken = jwt.decode(token) as JWTPayload;

    const userId = decodedToken.userId;

    const updatedUser = await this.db
      .update(schema.users)
      .set({
        refresh_token: token,
      })
      .where(eq(schema.users.user_id, userId))
      .returning();

    if (updatedUser.length < 0 || updatedUser.length > 1)
      return [new TRPCError({ code: "INTERNAL_SERVER_ERROR" }), null] as const;

    return [null, updatedUser[0]] as const;
  }

  async checkUsername(username: string) {
    const user = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username));
    if (user[0]) return true;

    return false;
  }

  async checkUserEmail(email: string) {
    const user = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));
    if (user[0]) return true;

    return false;
  }
}

export const userModelDB = new UserModelDB(database);
