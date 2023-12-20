import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { client } from "../../db/db";
import * as schema from "../../db/schema";
import * as types from "./types";
const database = drizzle(client, { schema });
type dbConnection = typeof database;

export async function createBasicFlashcard(
  flashcard: types.Flashcards,
): Promise<schema.Flashcard[]> {
  const prep = database
    .insert(schema.flashcards)
    .values({
      stack_id: sql.placeholder("stack_id"),
      frontside_text: sql.placeholder("frontside_text"),
      backside_text: sql.placeholder("backside_text"),
    })
    .returning()
    .prepare("createFlashcardQuery");

  const res = await prep.execute({
    stack_id: flashcard.stack_id,
    frontside_text: flashcard.frontside_text,
    backside_text: flashcard.backside_text,
  });
  return res;
}

async function createFlashcardMedia(
  flashcard: types.Flashcards,
  flashcardId: string,
) {
  const prep = database
    .insert(schema.Media)
    .values({
      flashcard_id: sql.placeholder("id"),
      frontside_media_link: sql.placeholder("frontside_media_link"),
      frontside_media_positioning: sql.placeholder(
        "frontside_media_positioing",
      ),
      backside_media_link: sql.placeholder("backside_media_link"),
      backside_media_positioning: sql.placeholder("backside_media_positioning"),
    })
    .returning()
    .prepare("insert_media");

  const res = await prep.execute({
    id: flashcardId,
    frontside_media_link: flashcard.frontside_media_link,
    frontside_media_positioning: flashcard.frontside_media_positioning,
    backside_media_link: flashcard.backside_media_link,
    backside_media_positioning: flashcard.backside_media_positioning,
  });
  return res;
}

export async function createFlashcardWithMedia(flashcard: types.Flashcards) {
  const res = await database.transaction(async (tx) => {
    const basicFlashcard = await createBasicFlashcard(flashcard);
    const flashcardId = basicFlashcard[0].flashcard_id;
    const media = await createFlashcardMedia(flashcard, flashcardId);
    return basicFlashcard;
  });
  return res;
}

export async function updateFlashcard(
  flashcard: types.Flashcards,
): Promise<schema.Flashcard[]> {
  const res = await database.transaction(async (tx) => {
    const Basicflashcard = await tx
      .update(schema.flashcards)
      .set({
        frontside_text: flashcard.frontside_text,
        backside_text: flashcard.backside_text,
        stack_id: flashcard.stack_id,
      })
      .returning();

    await tx.update(schema.Media).set({
      backside_media_link: flashcard.backside_media_link,
      backside_media_positioning: flashcard.backside_media_positioning,
      frontside_media_link: flashcard.frontside_media_link,
      frontside_media_positioning: flashcard.frontside_media_positioning,
    });
    return Basicflashcard;
  });
  return res;
}

export async function deleteFlashcard(
  flashcardId: string,
): Promise<schema.Flashcard[]> {
  const res = await database
    .delete(schema.flashcards)
    .where(eq(schema.flashcards.flashcard_id, flashcardId))
    .returning();
  return res;
}

export async function getAllFlashcardsFromStack(stackId: string) {
  const prep = database
    .select({
      flashcard_id: schema.flashcards.flashcard_id,
      frontside: schema.flashcards.frontside_text,
      frontside_media: schema.Media.frontside_media_link,
      frontside_media_positioning: schema.Media.frontside_media_positioning,
      backside: schema.flashcards.backside_text,
      backside_media: schema.Media.backside_media_link,
      backside_media_positioning: schema.Media.backside_media_positioning,
    })
    .from(schema.flashcards)
    .leftJoin(
      schema.Media,
      eq(schema.flashcards.flashcard_id, schema.Media.flashcard_id),
    )
    .where(eq(schema.flashcards.stack_id, sql.placeholder("stackId")))
    .prepare("getAllFlashcardsFromStack");

  const res = await prep.execute({ stackId: stackId });
  return res;
}

export async function getLearnableFlashcardsFromStack(
  stackId: string,
): Promise<any> {
  const prep = database
    .select({
      flashcard_id: schema.flashcards.flashcard_id,
      frontside: schema.flashcards.frontside_text,
      frontside_media: schema.Media.frontside_media_link,
      frontside_media_positioning: schema.Media.frontside_media_positioning,
      backside: schema.flashcards.backside_text,
      backside_media: schema.Media.backside_media_link,
      backside_media_positioning: schema.Media.backside_media_positioning,
      learning_status: schema.session_data.learning_status,
    })
    .from(schema.flashcards)
    .leftJoin(
      schema.Media,
      eq(schema.flashcards.flashcard_id, schema.Media.flashcard_id),
    )
    .innerJoin(
      schema.session_data,
      eq(schema.flashcards.flashcard_id, schema.session_data.flashcard_id),
    )
    .where(
      and(
        eq(schema.flashcards.stack_id, sql.placeholder("stack_id")),
        eq(schema.session_data.learning_status, types.LearningStatus.learnable),
      ),
    )
    .prepare("getLearnableFlashcardsFromStack");

  const res = await prep.execute({ stack_id: stackId });
  return res;
}

export async function getAllFlashcardsFromStackAndChildStacks(
  stackId: string,
): Promise<any> {
  const res = await database.execute(sql`
    WITH RECURSIVE cte_stacks AS (
        SELECT stack_iD
        FROM stacks
        WHERE stack_id=${stackId}

        UNION ALL

        SELECT stacks.stack_id
        FROM stacks
        JOIN cte_stacks ON stacks.parent_stack_id = cte_stacks.stack_id
    )

    SELECT
        flashcards.flashcard_id,
        flashcards.frontside_text,
        flashcards.backside_text,
        Media.frontside_media_link,
        Media.frontside_media_positioning,
        Media.backside_media_link,
        Media.backside_media_positioning
    FROM cte_stacks
    JOIN flashcards ON cte_stacks.stack_id = flashcards.stack_id
    LEFT JOIN Media ON flashcards.flashcard_id = Media.flashcard_id
    `);
  return res.rows;
}

export async function getLearnableFlashcardsFromStackAndChilds(
  stackId: string,
): Promise<any> {
  const res = await database.execute(sql`
    WITH RECURSIVE cte_stacks AS(
        SELECT stack_id 
        FROM stacks
        WHERE stack_id=${stackId}

        UNION ALL

    SELECT stacks.stack_id
    FROM STACKS
    JOIN cte_stacks ON stacks.parent_stack_id = cte_stacks.stack_id
    )

    SELECT
        flashcards.flashcard_id,
        flashcards.frontside_text,
        flashcards.backside_text,
        Media.frontside_media_link,
        Media.frontside_media_positioning,
        Media.backside_media_link,
        Media.backside_media_positioning
    FROM cte_stacks
    JOIN flashcards ON flashcards.stack_id = cte_stacks.stack_id
    JOIN session_data ON flashcards.flashcard_id = session_data.flashcard_id
    LEFT JOIN Media ON flashcards.flashcard_id = Media.flashcard_id
    WHERE session_data.learning_status=1;
    `);
  return res.rows;
}
