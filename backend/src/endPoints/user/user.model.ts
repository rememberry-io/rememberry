import { eq, ne, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { TRPCError } from "trpc";
import { client } from "../../db/db";
import * as schema from "../../db/schema";

export const database = drizzle(client, { schema });

//WRITE
export async function writeUser(
  userInput: schema.NewUser,
  hashedPwd: string,
): Promise<schema.NewUser[]> {
  const newUser = await database
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
export async function readAllUsers() {
  const res = await database.select().from(schema.users);
  return res;
}

export async function checkUsername(username: string) {
  const user = await database
    .select()
    .from(schema.users)
    .where(eq(schema.users.username, username));
  if (user[0]) {
    return true;
  }
}

export async function checkUserEmail(email: string) {
  const user = await database
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));
  if (user[0]) {
    return true;
  }
}

export async function checkCredentials(email: string, username: string) {
  if ((await checkUserEmail(email)) && (await checkUsername(username))) {
    return [
      new TRPCError(403, { message: "USERNAME AND EMAIL ALREADY EXIST" }),
      null,
    ] as const;
  } else if (await checkUserEmail(email)) {
    return [
      new TRPCError(403, { message: "EMAIL ALREADY EXISTS" }),
      null,
    ] as const;
  } else if (await checkUsername(username)) {
    return [
      new TRPCError(403, { message: "USERNAME ALREADY EXISTS" }),
      null,
    ] as const;
  }
  return [null, true] as const;
}

export async function readUserById(userId: string) {
  const user = await database
    .select()
    .from(schema.users)
    .where(eq(schema.users.user_id, userId));
  return user;
}

export async function fetchUpdateCredentials(
  userInput: schema.User,
): Promise<schema.User[]> {
  const res = await database
    .select()
    .from(schema.users)
    .where(
      or(
        eq(schema.users.email, userInput.email),
        eq(schema.users.password, userInput.password),
      ),
    )
    .where(ne(schema.users.user_id, userInput.user_id));
  return res;
}

//UPDATE
export async function updateUserById(
  userInput: schema.User,
  hashedPwd: string,
): Promise<schema.User[]> {
  const updatedUser = await database
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
export async function deleteUserById(userId: string): Promise<schema.User[]> {
  const deletedUser = await database
    .delete(schema.users)
    .where(eq(schema.users.user_id, userId))
    .returning();
  return deletedUser;
}
