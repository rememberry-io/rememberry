import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { client } from "../../db/db";
import * as schema from "../../db/schema";
import * as types from "./types";
const database = drizzle(client, { schema });

const internalServerError = new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

export async function createBasicFlashcard(flashcard: types.Flashcards) {
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
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res[0]] as const;
}

export async function createMedia(media: schema.NewMedia) {
  const res = await database
    .insert(schema.Media)
    .values({
      flashcard_id: media.flashcard_id,
      frontside_media_link: media.frontside_media_link,
      frontside_media_positioning: media.frontside_media_positioning,
      backside_media_link: media.backside_media_link,
      backside_media_positioning: media.backside_media_positioning,
    })
    .returning();
  if (res.length < 1) {
    return [internalServerError, null] as const;
  }
  return [null, res] as const;
}

export async function updateFlashcard(flashcard: types.Flashcards) {
  const res = await database.transaction(async (tx) => {
    const Basicflashcard = await tx
      .update(schema.flashcards)
      .set({
        frontside_text: flashcard.frontside_text,
        backside_text: flashcard.backside_text,
        stack_id: flashcard.stack_id,
      })
      .where(eq(schema.flashcards.flashcard_id, flashcard.id))
      .returning();

    await tx
      .update(schema.Media)
      .set({
        backside_media_link: flashcard.backside_media_link,
        backside_media_positioning: flashcard.backside_media_positioning,
        frontside_media_link: flashcard.frontside_media_link,
        frontside_media_positioning: flashcard.frontside_media_positioning,
      })
      .where(eq(schema.flashcards.flashcard_id, flashcard.id));

    return Basicflashcard;
  });
  if (res.length < 1) {
    return [internalServerError, null];
  }
  return [null, res[0]];
}

export async function deleteFlashcard(flashcardId: string) {
  const res = await database
    .delete(schema.flashcards)
    .where(eq(schema.flashcards.flashcard_id, flashcardId))
    .returning();
  if (res.length < 1) {
    return [internalServerError, null];
  }
  return [null, res[0]];
}

export async function getAllFlashcardsFromStack(stackId: string) {
  try {
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
    return [null, res];
  } catch (error) {
    return [error, null];
  }
}

export async function getLearnableFlashcardsFromStack(stackId: string) {
  try {
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
          eq(
            schema.session_data.learning_status,
            types.LearningStatus.learnable,
          ),
        ),
      )
      .prepare("getLearnableFlashcardsFromStack");
    const res = await prep.execute({ stack_id: stackId });
    return [null, res];
  } catch (error) {
    return [error, null];
  }
}

export async function getAllFlashcardsFromStackAndChildStacks(stackId: string) {
  try {
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
    return [null, res.rows];
  } catch (error) {
    return [error, null];
  }
}

export async function getLearnableFlashcardsFromStackAndChilds(
  stackId: string,
) {
  try {
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
    return [null, res.rows];
  } catch (error) {
    return [error, null];
  }
}
