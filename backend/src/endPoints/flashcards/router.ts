import { router, publicProcedure } from "../../trpc";
import * as flashcardController from './flashCardController'
import * as types from './types'
import z from "zod";
import { config } from "dotenv";
import { privateProcedure } from "../../middleware/jwt";

config();

export const flashcardRouter = router({

    createFlashcard: privateProcedure.input(types.FlashcardsSchema).mutation(async(opts) => {
        const res = flashcardController.controlCreateFlashcard(opts.input, opts.ctx.db)
        return res
    }),

    updateFlashcard: privateProcedure.input(types.FlashcardsSchema).mutation(async(opts) => {
        const res = flashcardController.controlUpdateFlashcard(opts.input, opts.ctx.db)
        return res 
    }),

    deleteFlashcard: privateProcedure.input(z.string()).mutation(async(opts) => {
        const res = flashcardController.controlDeleteFlashcard(opts.input, opts.ctx.db)
        return res 
    }),

    getAllCardsFromStack: privateProcedure.input(z.string()).query(async(opts) => {
        const res = await flashcardController.controlGetAllFlashcardsFromStack(opts.input, opts.ctx.db)
        return res
    }),

  getLearnableCardsFromStack: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const res =
        await flashcardController.controlGetLearnableFlashcardsFromStack(
          opts.input,
          opts.ctx.db
        );
      return res;
    }),

  getAllCardsFromParentAndChilds: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const res =
        await flashcardController.controlgetAllFlashcardsFromStackAndChildStacks(
          opts.input,
          opts.ctx.db
        );
      return res;
    }),

  getLearnableCardsFromStackAndChilds: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const res =
        await flashcardController.getLearnableFlashcardsFromStackAndChilds(
          opts.input,
          opts.ctx.db
        );
      return res;
    }),
});

export type flashcardRouter = typeof flashcardRouter;
