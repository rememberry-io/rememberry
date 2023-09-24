import { client } from "../db/db";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from '../db/schema'
import { eq, and, desc } from "drizzle-orm";

const database = drizzle(client, {schema})
type DB = typeof database

export async function getUsersStacks(userId:string, db:DB){
    const res = db.select().from(schema.stacks).where(eq(schema.users.user_id, userId))
    return res
}

export async function getUsersStacksFilteredByTopic(userId:string, topic:string, db:DB){
    const topicRes = await db.select({topicId: schema.topics.topic_id}).from(schema.topics).where(eq(schema.topics.topic, topic))
    const topicId = topicRes[0].topicId
    const res = await db.select().from(schema.stacks).where(and(eq(schema.stacks.topic_id, topicId), eq(schema.stacks.user_id, userId)))
    return res   
}


export async function getUsersStacksOrderedByLearnableCards(userId:string, db:DB) {
    const res = db.select().from(schema.stacks).where(eq(schema.stacks.user_id, userId)).orderBy(desc(schema.stacks.number_of_learned_cards))
    return res
}


export async function createStack(stackInput:schema.NewStack, topic:string, db:DB){
    const topicRes = await db.insert(schema.topics).values({topic:topic}).returning({insertedId: schema.topics.topic_id})
    const topicId = topicRes[0].insertedId
    const res = await db.insert(schema.stacks).values({
        user_id:stackInput.user_id,
        stack_name:stackInput.stack_name,
        created_at: new Date(),
        topic_id: topicId
    })
    return res
}