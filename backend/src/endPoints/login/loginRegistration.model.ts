import { eq } from "drizzle-orm";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import jwt from "jsonwebtoken";
import { client } from "../../db/db";
import * as schema from "../../db/schema";
import { updateUser } from "../user/types";
import * as types from "./types";

const database = drizzle(client, { schema });

export interface LoginRegistrationModel {
  checkLoginCredentials: (
    credentials: types.LoginCredentials,
  ) => Promise<{ user_id: string; password: string }>;
  updateRefreshToken: (token: string) => Promise<updateUser[]>;
}

class LoginRegistrationModelDB implements LoginRegistrationModel {
  db: NodePgDatabase<typeof import("../../db/schema.ts")>;
  constructor(db: NodePgDatabase<typeof import("../../db/schema.ts")>) {
    this.db = db;
  }
  async checkLoginCredentials(credentials: types.LoginCredentials) {
    const user = await this.db
      .select({
        user_id: schema.users.user_id,
        password: schema.users.password,
      })
      .from(schema.users)
      .where(eq(schema.users.email, credentials.email));
    return user[0];
  }

  async updateRefreshToken(token: string) {
    const decodedToken = jwt.decode(token) as types.JWTPayload;
    const userId = decodedToken.userId;
    const refreshToken = await this.db
      .update(schema.users)
      .set({
        refresh_token: token,
      })
      .where(eq(schema.users.user_id, userId))
      .returning();
    return refreshToken;
  }
}

export const loginRegistrationModelDB = new LoginRegistrationModelDB(database);
