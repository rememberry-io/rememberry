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

export async function createBacksideMedia(
  flashcard: types.Flashcards,
  flashcardId: string,
): Promise<schema.BacksideMedia[]> {
  const prep = database
    .insert(schema.backside_media)
    .values({
      flashcard_id: sql.placeholder("id"),
      media_link: sql.placeholder("link"),
      positioning: sql.placeholder("positioning"),
    })
    .returning()
    .prepare("insert backside media");
  const res = await prep.execute({
    id: flashcardId,
    link: flashcard.backside_media_link,
    positioning: flashcard.backside_media_positioning,
  });
  return res;
}

export async function createFrontsideMedia(
  flashcard: types.Flashcards,
  flashcardId: string,
) {
  const prep = database
    .insert(schema.frontside_media)
    .values({
      flashcard_id: sql.placeholder("id"),
      media_link: sql.placeholder("link"),
      positioning: sql.placeholder("positioing"),
    })
    .returning()
    .prepare("insert frontside media");
  const res = await prep.execute({
    id: flashcardId,
    link: flashcard.frontside_media_link,
    positioning: flashcard.frontside_media_positioning,
  });
  return res;
}

export async function createFlashcardWithMedia(flashcard: types.Flashcards) {
  const res = await database.transaction(async (tx) => {
    const basicFlashcard = await createBasicFlashcard(flashcard);
    const flashcardId = basicFlashcard[0].flashcard_id;
    await createFrontsideMedia(flashcard, flashcardId);
    await createBacksideMedia(flashcard, flashcardId);
    return basicFlashcard;
  });
  return res;
}

export async function createFlashcardWithFrontsideMedia(
  flashcard: types.Flashcards,
) {
  const res = await database.transaction(async (tx) => {
    const basicFlashcard = await createBasicFlashcard(flashcard);
    const flashcardId = basicFlashcard[0].flashcard_id;
    await createFrontsideMedia(flashcard, flashcardId);
    return basicFlashcard;
  });
  return res;
}

export async function createFlashcardWithBackideMedia(
  flashcard: types.Flashcards,
) {
  const res = await database.transaction(async (tx) => {
    const basicFlashcard = await createBasicFlashcard(flashcard);
    const flashcardId = basicFlashcard[0].flashcard_id;
    await createBacksideMedia(flashcard, flashcardId);
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

    await tx.update(schema.backside_media).set({
      media_link: flashcard.backside_media_link,
      positioning: flashcard.backside_media_positioning,
    });

    await tx.update(schema.frontside_media).set({
      media_link: flashcard.frontside_media_link,
      positioning: flashcard.frontside_media_positioning,
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
      frontside_media: schema.frontside_media.media_link,
      frontside_media_positioning: schema.frontside_media.positioning,
      backside: schema.flashcards.backside_text,
      backside_media: schema.backside_media.media_link,
      backside_media_positioning: schema.backside_media.positioning,
      learning_status: schema.session_data.learning_status,
    })
    .from(schema.flashcards)
    .leftJoin(
      schema.frontside_media,
      eq(schema.flashcards.flashcard_id, schema.frontside_media.flashcard_id),
    )
    .leftJoin(
      schema.backside_media,
      eq(schema.flashcards.flashcard_id, schema.backside_media.flashcard_id),
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
      frontside_media: schema.frontside_media.media_link,
      frontside_media_positioning: schema.frontside_media.positioning,
      backside: schema.flashcards.backside_text,
      backside_media: schema.backside_media.media_link,
      backside_media_positioning: schema.backside_media.positioning,
      learning_status: schema.session_data.learning_status,
    })
    .from(schema.flashcards)
    .leftJoin(
      schema.frontside_media,
      eq(schema.flashcards.flashcard_id, schema.frontside_media.flashcard_id),
    )
    .leftJoin(
      schema.backside_media,
      eq(schema.flashcards.flashcard_id, schema.backside_media.flashcard_id),
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
        frontside_media.media_link,
        frontside_media.positioning,
        backside_media.media_link,
        backside_media.positioning
    FROM cte_stacks
    JOIN flashcards ON cte_stacks.stack_id = flashcards.stack_id
    LEFT JOIN frontside_media ON flashcards.flashcard_id = frontside_media.flashcard_id
    LEFT JOIN backside_media ON flashcards.flashcard_id = backside_media.flashcard_id
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
        frontside_media.media_link,
        frontside_media.positioning,
        backside_media.media_link,
        backside_media.positioning
    FROM cte_stacks
    JOIN flashcards ON flashcards.stack_id = cte_stacks.stack_id
    JOIN session_data ON flashcards.flashcard_id = session_data.flashcard_id
    LEFT JOIN frontside_media ON flashcards.flashcard_id = frontside_media.flashcard_id
    LEFT JOIN backside_media ON flashcards.flashcard_id = backside_media.flashcard_id 
    WHERE session_data.learning_status=1;
    `);
  return res.rows;
}
