import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema";
import { client } from "../../db/db";
import { eq, ne, and, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { TRPCError } from "trpc";
import * as types from "./types";

export const database = drizzle(client, { schema });

//WRITE
export async function writeUser(
  userInput: schema.NewUser,
  db: types.dbConnection,
  hashedPwd: string
): Promise<schema.NewUser[]> {
  const newUser = await db
    .insert(schema.users)
    .values({
      username: userInput.username,
      email: userInput.email,
      password: hashedPwd,
    })
    .returning();

  return newUser;
}

//READ
export async function readAllUsers(db: types.dbConnection) {
  const res = await db.select().from(schema.users);
  return res;
}

export async function checkUsername(username: string, db: types.dbConnection) {
  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.username, username));
  if (user[0]) {
    return true;
  }
}

export async function checkUserEmail(email: string, db: types.dbConnection) {
  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));
  if (user[0]) {
    return true;
  }
}

export async function checkCredentials(
  email: string,
  username: string,
  db: types.dbConnection
) {
  if (
    (await checkUserEmail(email, db)) &&
    (await checkUsername(username, db))
  ) {
    throw new TRPCError(403, { message: "USERNAME AND EMAIL ALREADY EXIST" });
  } else if (await checkUserEmail(email, db)) {
    throw new TRPCError(403, { message: "EMAIL ALREADY EXISTS" });
  } else if (await checkUsername(username, db)) {
    throw new TRPCError(403, { message: "USERNAME ALREADY EXISTS" });
  }
}

export async function readUserById(userId: string, db: types.dbConnection) {
  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.user_id, userId));
  return user;
}

export async function fetchUpdateCredentials(
  userInput: schema.User,
  db: types.dbConnection
): Promise<schema.User[]> {
  const res = await db
    .select()
    .from(schema.users)
    .where(
      or(
        eq(schema.users.email, userInput.email),
        eq(schema.users.password, userInput.password)
      )
    )
    .where(ne(schema.users.user_id, userInput.user_id));
  return res;
}

//UPDATE
export async function updateUserById(
  userInput: schema.User,
  hashedPwd: string,
  db: types.dbConnection
): Promise<schema.User[]> {
  const updatedUser = await db
    .update(schema.users)
    .set({
      username: userInput.username,
      email: userInput.email,
      password: hashedPwd,
    })
    .where(eq(schema.users.user_id, userInput.user_id))
    .returning();
  return updatedUser;
}

//DELETE
export async function deleteUserById(
  userId: string,
  db: types.dbConnection
): Promise<schema.User[]> {
  const deletedUser = await db
    .delete(schema.users)
    .where(eq(schema.users.user_id, userId))
    .returning();
  return deletedUser;
}