import z from "zod";
import { database } from "../user/user.model";

export type Flashcards = {
  id: string;
  stack_id: string;
  frontside_text: string | null;
  backside_text: string | null;
  frontside_media_link: string | null;
  backside_media_link: string | null;
  frontside_media_positioning: string | null;
  backside_media_positioning: string | null;
};

export enum LearningStatus {
  learnable = 1,
  notLearnable = 0,
}

export const FlashcardsSchema = z.object({
  id: z.string(),
  stack_id: z.string(),
  frontside_text: z.string(),
  backside_text: z.string(),
  frontside_media_link: z.string(),
  backside_media_link: z.string(),
  frontside_media_positioning: z.string(),
  backside_media_positioning: z.string(),
});

export type dbConnection = typeof database;
