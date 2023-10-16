import { config } from "dotenv";
import z from "zod";
import { privateProcedure } from "../../middleware/jwt";
import { router } from "../../trpc";
import * as flashcardController from "./flashCardController";
import * as types from "./types";

config();

export const flashcardRouter = router({
  createFlashcard: privateProcedure
    .input(types.FlashcardsSchema)
    .mutation(async (opts) => {
      const res = flashcardController.controlCreateFlashcard(opts.input);
      return res;
    }),

  updateFlashcard: privateProcedure
    .input(types.FlashcardsSchema)
    .mutation(async (opts) => {
      const res = flashcardController.controlUpdateFlashcard(opts.input);
      return res;
    }),

  deleteFlashcard: privateProcedure.input(z.string()).mutation(async (opts) => {
    const res = flashcardController.controlDeleteFlashcard(opts.input);
    return res;
  }),

  getAllCardsFromStack: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const res = await flashcardController.controlGetAllFlashcardsFromStack(
        opts.input,
      );
      return res;
    }),

  getLearnableCardsFromStack: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const res =
        await flashcardController.controlGetLearnableFlashcardsFromStack(
          opts.input,
        );
      return res;
    }),

  getAllCardsFromParentAndChilds: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const res =
        await flashcardController.controlgetAllFlashcardsFromStackAndChildStacks(
          opts.input,
        );
      return res;
    }),

  getLearnableCardsFromStackAndChilds: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const res =
        await flashcardController.getLearnableFlashcardsFromStackAndChilds(
          opts.input,
        );
      return res;
    }),
});

export type flashcardRouter = typeof flashcardRouter;
