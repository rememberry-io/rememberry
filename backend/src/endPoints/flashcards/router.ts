import { config } from "dotenv";
import z from "zod";
import { privateProcedure } from "../../middleware/validateSession";
import { router } from "../../trpc";
import * as flashcardController from "./flashCardController";
import * as types from "./types";

config();

export const flashcardRouter = router({
  createFlashcard: privateProcedure
    .input(types.FlashcardsSchema)
    .mutation(async (opts) => {
      const [errorCheck, res] =
        await flashcardController.controlCreateFlashcard(opts.input);
      if (errorCheck) {
        throw errorCheck;
      }
      return res;
    }),

  updateFlashcard: privateProcedure
    .input(types.FlashcardsSchema)
    .mutation(async (opts) => {
      const [errorCheck, res] =
        await flashcardController.controlUpdateFlashcard(opts.input);
      if (errorCheck) {
        throw errorCheck;
      }
      return res;
    }),

  deleteFlashcard: privateProcedure.input(z.string()).mutation(async (opts) => {
    const res = flashcardController.controlDeleteFlashcard(opts.input);
    return res;
  }),

  getAllCardsFromStack: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [errorCheck, res] =
        await flashcardController.controlGetAllFlashcardsFromStack(opts.input);
      if (errorCheck) {
        throw errorCheck;
      }
      return res;
    }),

  getLearnableCardsFromStack: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [errorCheck, res] =
        await flashcardController.controlGetLearnableFlashcardsFromStack(
          opts.input,
        );
      if (errorCheck) {
        throw errorCheck;
      }
      return res;
    }),

  getAllCardsFromParentAndChilds: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [errorCheck, res] =
        await flashcardController.controlgetAllFlashcardsFromStackAndChildStacks(
          opts.input,
        );
      if (errorCheck) {
        throw errorCheck;
      }
      return res;
    }),

  getLearnableCardsFromParentAndChilds: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [errorCheck, res] =
        await flashcardController.getLearnableFlashcardsFromStackAndChilds(
          opts.input,
        );
      if (errorCheck) {
        throw errorCheck;
      }
      return res;
    }),
});

export type flashcardRouter = typeof flashcardRouter;
