import { client } from "../../db/db";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema";
import * as types from './types'
import * as userModel from './user.model'
const db = drizzle(client, { schema });
import bcrypt from "bcryptjs";

export async function createUser(userInput:schema.NewUser, db:types.dbConnection){
    await userModel.checkCredentials(userInput.email, userInput.username, db)
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(userInput.password, salt);
    const res = await userModel.writeUser(userInput, db, hashedPwd)
    return res 
}


export async function getAllUsers(db:types.dbConnection){
    const res = await userModel.readAllUsers(db)
    return res
}

export async function getUserById(userId: string, db: types.dbConnection){
    const res = await userModel.readUserById(userId, db)
    return res
}