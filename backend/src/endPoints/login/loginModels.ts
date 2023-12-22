//import { eq } from "drizzle-orm";
//import jwt from "jsonwebtoken";
//import { db } from "../../db/db";
//import * as schema from "../../db/schema";
//import * as types from "./types";
//
//export async function getLoginCredentials(credentials: types.LoginCredentials) {
//  const user = await db
//    .select({
//      id: schema.users.id,
//      password: schema.users.password,
//    })
//    .from(schema.users)
//    .where(eq(schema.users.email, credentials.email));
//  return user[0];
//}
//
//export async function updateRefreshToken(token: string) {
//  const decodedToken = jwt.decode(token) as types.JWTPayload;
//  const userId = decodedToken.userId;
//  const refreshToken = await db
//    .update(schema.users)
//    .set({
//      refresh_token: token,
//    })
//    .where(eq(schema.users.id, userId))
//    .returning();
//  return refreshToken;
//}
