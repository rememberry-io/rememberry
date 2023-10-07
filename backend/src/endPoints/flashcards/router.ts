import { router, publicProcedure } from "../../trpc";
import * as flashcardController from "./flashCardController";
import z from "zod";
import { config } from "dotenv";

config();

export const flashcardRouter = router({
  getAllCardsFromStack: publicProcedure
    .input(z.string())
    .query(async (opts) => {
      const res = await flashcardController.controlGetAllFlashcardsFromStack(
        opts.input,
        opts.ctx.db
      );
      return res;
    }),

  getLearnableCardsFromStack: publicProcedure
    .input(z.string())
    .query(async (opts) => {
      const res =
        await flashcardController.controlGetLearnableFlashcardsFromStack(
          opts.input,
          opts.ctx.db
        );
      return res;
    }),

  getAllCardsFromParentAndChilds: publicProcedure
    .input(z.string())
    .query(async (opts) => {
      const res =
        await flashcardController.controlgetAllFlashcardsFromStackAndChildStacks(
          opts.input,
          opts.ctx.db
        );
      return res;
    }),

  getLearnableCardsFromStackAndChilds: publicProcedure
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
