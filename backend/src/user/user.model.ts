import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from '../db/schema'
import { client } from "../db/db";
import { eq } from "drizzle-orm";
import bcrypt from 'bcryptjs'




const database = drizzle(client, {schema})
type dbConnection = typeof database

//WRITE
export async function createUser(userInput:schema.NewUser, db:dbConnection):Promise<schema.NewUser[]> {
    const salt = await bcrypt.genSalt(10)
    const hashedPwd = await bcrypt.hash(userInput.password, salt)
   const newUser = await db.insert(schema.users).values({
        username: userInput.username,
        email:userInput.email,
        password: hashedPwd
    }).returning()

    return newUser
}

//READ
export async function getAllUsers(db:dbConnection){
    const res = await db.select().from(schema.users)
    return res
}


export async function getUserById(userId:string, db:dbConnection){
    const user = await db.select().from(schema.users).where(eq(schema.users.user_id, userId))
    return user 
}

//UPDATE
export async function updateUserById(userInput:schema.User, db:dbConnection): Promise<schema.User[]> {
   const updatedUser = await db.update(schema.users)
        .set({
            username: userInput.username,
            email: userInput.email,
            password:userInput.password
        })
        .where(eq(schema.users.user_id, userInput.user_id)).returning()
    return updatedUser
}

//DELETE
export async function deleteUserById(userId:string, db: dbConnection):Promise<schema.User[]>{
    const deletedUser = await db.delete(schema.users).where(eq(schema.users.user_id, userId)).returning()
    return deletedUser
}
