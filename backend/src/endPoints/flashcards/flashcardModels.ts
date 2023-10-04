import { client } from "../../db/db";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from '../../db/schema'
import { eq, and, desc, sql, } from "drizzle-orm";

const database = drizzle(client, { schema })
type dbConnection = typeof database

export async function createFlashcard(flashcard: schema.NewFlashcard, db:dbConnection): Promise<schema.Flashcard[]>{
    const prep = db.insert(schema.flashcards).values({
        stack_id: sql.placeholder("stack_id"),
        frontside_text: sql.placeholder("frontside_text"),
        backside_text: sql.placeholder("backside_text")
    }).returning().prepare("createFlashcardQuery")

    const res = await prep.execute({
        stack_id: flashcard.stack_id,
        frontside_text: flashcard.frontside_text,
        backside_text: flashcard.backside_text
    })
    return res
}

export async function updateFlashcard(flashcard: schema.Flashcard, db:dbConnection): Promise<schema.Flashcard[]>{
    const res = await db.update(schema.flashcards).set({
        stack_id: flashcard.stack_id,
        frontside_text: flashcard.frontside_text,
        backside_text: flashcard.backside_text
    }).returning()
    return res 
}

export async function deleteFlashcard(flashcardId:string, db:dbConnection): Promise<schema.Flashcard[]>{
    const res = await db.delete(schema.flashcards).where(eq(schema.flashcards.flashcard_id, flashcardId)).returning()
    return res 
}

export async function getAllFlashcardsFromStack(stackId:string, db:dbConnection){
    const prep = db
    .select({
        frontside: schema.flashcards.frontside_text,
        frontside_media: schema.frontside_media.media_link,
        frontside_media_positioning: schema.frontside_media.positioning,
        backside: schema.flashcards.backside_text,
        backside_media: schema.backside_media.media_link,
        backside_media_positioning: schema.backside_media.positioning
        })
    .from(schema.flashcards)
    .leftJoin(schema.frontside_media, eq(schema.flashcards.flashcard_id, schema.frontside_media.flashcard_id))
    .leftJoin(schema.backside_media, eq(schema.flashcards.flashcard_id, schema.backside_media.flashcard_id))
    .where(eq(schema.flashcards.stack_id, sql.placeholder("stackId")))
    
    const res = await prep.execute({stackId: stackId})
    return res
}