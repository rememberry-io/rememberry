import z from "zod";
import {
  Flashcard,
  LearningData,
  Media,
  NewFlashcard,
  NewMedia,
} from "../../db/schema";

export enum LearningStatus {
  learnable = 1,
  notLearnable = 0,
}

export const FlashcardZodInput = z.object({
  id: z.string(),
  stackId: z.string(),
  frontside: z.string(),
  backside: z.string(),
  xPosition: z.number(),
  yPosition: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateFlashcardZodInput = z.object({
  id: z.string().optional(),
  stackId: z.string(),
  frontside: z.string(),
  backside: z.string(),
  xPosition: z.number(),
  yPosition: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const MediaZodInput = z.object({
  id: z.string(),
  flashcardId: z.string().nullable(),
  frontsideMediaLink: z.string().nullable(),
  backsideMediaLink: z.string().nullable(),
  frontsideMediaPositioning: z.string().nullable(),
  backsideMediaPositioning: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateMediaZodInput = z.object({
  id: z.string().optional(),
  flashcardId: z.string().optional(),
  frontsideMediaLink: z.string().optional(),
  backsideMediaLink: z.string().optional(),
  frontsideMediaPositioning: z.string().optional(),
  backsideMediaPositioning: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const FlashcardMediaZodInput = z.object({
  flashcard: FlashcardZodInput,
  media: MediaZodInput.nullable(),
});

export const CreateFlashcardMediaZodInput = z.object({
  flashcard: CreateFlashcardZodInput,
  media: CreateMediaZodInput.nullable(),
});

export type CreateFlashcard = {
  flashcard: NewFlashcard;
  media: NewMedia | null;
};

export type FlashcardAndMedia = {
  flashcard: Flashcard;
  media: Media | null;
};

export type FlashcardMediaAndLearning = {
  flashcard: Flashcard;
  media: Media;
  learningData: LearningData;
};
