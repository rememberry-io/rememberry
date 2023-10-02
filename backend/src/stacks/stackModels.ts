import { client } from "../db/db";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from '../db/schema'
import { eq, and, desc } from "drizzle-orm";
import { QueryResult } from "pg";

const database = drizzle(client, {schema})
type DB = typeof database

export async function getUsersStacks(userId:string, db:DB){
    const res = db.select().from(schema.stacks).where(eq(schema.users.user_id, userId))
    return res
}

