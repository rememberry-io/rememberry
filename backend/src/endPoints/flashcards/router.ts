import z from "zod";
import { privateProcedure } from "../../middleware/validateSession";
import { router } from "../../trpc";
import { flashcardControllerDrizzle } from "./flashcard.controller";
import { CreateFlashcardMediaZodInput, FlashcardMediaZodInput } from "./types";

export const flashcardRouter = router({
  create: privateProcedure
    .input(CreateFlashcardMediaZodInput)
    .mutation(async (opts) => {
      const [err, flashcardRes] =
        await flashcardControllerDrizzle.createFlashcard(opts.input);
      if (err) throw err;

      return flashcardRes;
    }),

  updateFlashcard: privateProcedure
    .input(FlashcardMediaZodInput)
    .mutation(async (opts) => {
      const [err, flashcardRes] =
        await flashcardControllerDrizzle.updateFlashcardById(opts.input);
      if (err) throw err;

      return flashcardRes;
    }),

  deleteFlashcard: privateProcedure.input(z.string()).mutation(async (opts) => {
    const [err, flashcardRes] =
      await flashcardControllerDrizzle.deleteFlashcardById(opts.input);
    if (err) throw err;

    return flashcardRes;
  }),

  getAllCardsFromStack: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, flashcardRes] =
        await flashcardControllerDrizzle.getAllFlashcardsByStackId(opts.input);
      if (err) throw err;

      return flashcardRes;
    }),

  getLearnableCardsFromStack: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, flashcardRes] =
        await flashcardControllerDrizzle.getLearnableFlashcardsByStackId(
          opts.input,
        );
      if (err) throw err;

      return flashcardRes;
    }),

  getAllCardsFromParentAndChilds: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, flashcardRes] =
        await flashcardControllerDrizzle.getAllFlashcardsFromStackAndChildrenStacks(
          opts.input,
        );
      if (err) throw err;

      return flashcardRes;
    }),

  getLearnableCardsFromParentAndChilds: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, flashcardRes] =
        await flashcardControllerDrizzle.getLearnableFlashcardsFromStackAndChildren(
          opts.input,
        );
      if (err) throw err;

      return flashcardRes;
    }),
});

export type flashcardRouter = typeof flashcardRouter;
