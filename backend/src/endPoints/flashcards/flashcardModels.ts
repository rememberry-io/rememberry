import dayjs from "dayjs";
import { and, eq, sql } from "drizzle-orm";
import { db, dbConnection } from "../../db/db";
import {
  Flashcard,
  NewFlashcard,
  flashcards,
  learningData,
  media,
} from "../../db/schema";
import {
  TRPCStatus,
  catchDrizzleErrorManyEntries,
  catchDrizzleErrorOneEntry,
  getModelDefaultError,
} from "../../utils";
import { FlashcardAndMedia, LearningStatus } from "./types";

export interface FlashcardModel {
  createFlashcard: (input: NewFlashcard) => Promise<TRPCStatus<Flashcard>>;
  getAllFlashcardsByStackId: (
    stackId: string,
  ) => Promise<TRPCStatus<FlashcardAndMedia[]>>;
  getLearnableFlashcardsByStackId: (
    stackId: string,
  ) => Promise<TRPCStatus<FlashcardAndMedia[]>>;
  getAllFlashcardsFromStackAndChildrenStacks: (
    stackId: string,
  ) => Promise<TRPCStatus<FlashcardAndMedia[]>>;
  getLearnableFlashcardsFromStackAndChildren: (
    stackId: string,
  ) => Promise<TRPCStatus<FlashcardAndMedia[]>>;
  updateFlashcardById: (
    input: FlashcardAndMedia,
  ) => Promise<TRPCStatus<Flashcard>>;
  deleteFlashcardById: (id: string) => Promise<TRPCStatus<Flashcard>>;
}

class FlashcardModelDrizzle implements FlashcardModel {
  db: dbConnection;
  constructor(db: dbConnection) {
    this.db = db;
  }
  async createFlashcard(input: NewFlashcard) {
    const prep = this.db
      .insert(flashcards)
      .values({
        stackId: sql.placeholder("stackId"),
        frontside: sql.placeholder("frontside"),
        backside: sql.placeholder("backside"),
        xPosition: sql.placeholder("xPosition"),
        yPosition: sql.placeholder("yPosition"),
      })
      .returning()
      .prepare("createFlashcardQuery");

    return await catchDrizzleErrorOneEntry(() => prep.execute(input));
  }

  async getAllFlashcardsByStackId(stackId: string) {
    const prep = this.db
      .select({
        flashcard: flashcards,
        media: media,
      })
      .from(flashcards)
      .leftJoin(media, eq(flashcards.id, media.flashcardId))
      .where(eq(flashcards.stackId, sql.placeholder("stackId")))
      .prepare("getAllFlashcardsFromStack");

    return await catchDrizzleErrorManyEntries(() =>
      prep.execute({ stackId: stackId }),
    );
  }
  async getLearnableFlashcardsByStackId(stackId: string) {
    const prep = this.db
      .select({
        flashcard: flashcards,
        media: media,
        session: learningData,
      })
      .from(flashcards)
      .leftJoin(media, eq(flashcards.id, media.flashcardId))
      .innerJoin(learningData, eq(flashcards.id, learningData.flashcardId))
      .where(
        and(
          eq(flashcards.stackId, sql.placeholder("stackId")),
          eq(learningData.learningStatus, LearningStatus.learnable),
        ),
      )
      .prepare("getLearnableFlashcardsFromStack");

    return await catchDrizzleErrorManyEntries(() =>
      prep.execute({ stackId: stackId }),
    );
  }
  async getAllFlashcardsFromStackAndChildrenStacks(stackId: string) {
    try {
      const res = await this.db.execute(sql`
        WITH RECURSIVE cte_stacks AS (
            SELECT stackId
            FROM stacks
            WHERE stackId=${stackId}
  
            UNION ALL
  
            SELECT stacks.stackId
            FROM stacks
            JOIN cte_stacks ON stacks.parentStackId = cte_stacks.stackId
        )
  
        SELECT
            flashcards,
            media
        FROM cte_stacks
        JOIN flashcards ON cte_stacks.stackId = flashcards.stackId
        LEFT JOIN media ON flashcards.flashcardId = media.flashcardId
      `);
      return [null, res.rows as FlashcardAndMedia[]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  async getLearnableFlashcardsFromStackAndChildren(stackId: string) {
    try {
      const res = await this.db.execute(sql`
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
            flashcards,
            media
        FROM cte_stacks
        JOIN flashcards ON flashcards.stack_id = cte_stacks.stack_id
        JOIN session_data ON flashcards.flashcard_id = session_data.flashcard_id
        LEFT JOIN Media ON flashcards.flashcard_id = Media.flashcard_id
        WHERE session_data.learning_status=1;
      `);
      return [null, res.rows as FlashcardAndMedia[]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }

  //async updateMedia() {}

  async updateFlashcardById(input: FlashcardAndMedia) {
    return await catchDrizzleErrorOneEntry(() =>
      this.db.transaction(async (tx) => {
        const flashcard = await tx
          .update(flashcards)
          .set({
            ...input.flashcard,
            updatedAt: dayjs().toDate(),
          })
          .where(eq(flashcards.id, input.flashcard.id))
          .returning();

        await tx
          .update(media)
          .set({
            ...input.media,
            updatedAt: dayjs().toDate(),
          })
          .where(eq(media.flashcardId, input.flashcard.id));

        return flashcard;
      }),
    );
  }
  async deleteFlashcardById(id: string) {
    return await catchDrizzleErrorOneEntry(() =>
      this.db.delete(flashcards).where(eq(flashcards.id, id)).returning(),
    );
  }
}

export const flashcardModelDrizzle = new FlashcardModelDrizzle(db);
