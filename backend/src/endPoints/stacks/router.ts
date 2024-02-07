import z from "zod";
import { privateProcedure } from "../../middleware/validateSession";
import { router } from "../../trpc";
import { stackControllerDrizzle } from "./stack.controller";

const newStackInput = z.object({
  id: z.string().optional(),
  name: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  mapId: z.string(),
  description: z.string(),
  xPosition: z.number(),
  yPosition: z.number(),
  parentStackId: z.string().optional(),
});

const stackInput = z.object({
  id: z.string(),
  name: z.string(),
  numberOfLearnedCards: z.number().nullable(),
  numberOfUnlearnedCards: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  mapId: z.string(),
  description: z.string(),
  xPosition: z.number(),
  yPosition: z.number(),
  parentStackId: z.string().nullable(),
});

const changeParentStackInput = z.object({
  childId: z.string(),
  parentId: z.string(),
});

export const stackRouter = router({
  create: privateProcedure.input(newStackInput).mutation(async (opts) => {
    const [err, stack] = await stackControllerDrizzle.createStack(opts.input);

    if (err) throw err;

    return stack;
  }),

  getById: privateProcedure.input(z.string()).query(async (opts) => {
    const [err, stack] = await stackControllerDrizzle.getStackById(opts.input);

    if (err) throw err;

    return stack;
  }),

  getTopLevelStacksByMapId: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, stacks] =
        await stackControllerDrizzle.getTopLevelStacksByMapId(opts.input);

      if (err) throw err;

      return stacks;
    }),

  getDirectChildrenStacksFromParentStack: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, stacks] =
        await stackControllerDrizzle.getDirectChildrenStacksFromParentStack(
          opts.input,
        );

      if (err) throw err;

      return stacks;
    }),

  getAllChildrenStacksFromParent: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, stacks] =
        await stackControllerDrizzle.getAllChildrenStacksFromParentStack(
          opts.input,
        );

      if (err) throw err;

      return stacks;
    }),

  getAllByMapId: privateProcedure.input(z.string()).query(async (opts) => {
    const [err, stacks] = await stackControllerDrizzle.getStacksByMapId(
      opts.input,
    );

    if (err) throw err;

    return stacks;
  }),

  updateStackById: privateProcedure.input(stackInput).mutation(async (opts) => {
    const [err, stack] = await stackControllerDrizzle.updateStackById(
      opts.input,
    );

    if (err) throw err;

    return stack;
  }),

  changeParent: privateProcedure
    .input(changeParentStackInput)
    .mutation(async (opts) => {
      const [err, stack] = await stackControllerDrizzle.changeParentStack(
        opts.input.parentId,
        opts.input.childId,
      );

      if (err) throw err;

      return stack;
    }),

  deleteParentRelation: privateProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const [err, stack] =
        await stackControllerDrizzle.deleteParentStackRelation(opts.input);

      if (err) throw err;

      return stack;
    }),

  deleteAndMoveChildsUp: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, stacks] =
        await stackControllerDrizzle.deleteMiddleOrderStackAndMoveChildrenUp(
          opts.input,
        );

      if (err) throw err;

      return stacks;
    }),

  deleteWithAllChildren: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, stacks] = await stackControllerDrizzle.deleteStackAndChildren(
        opts.input,
      );

      if (err) throw err;

      return stacks;
    }),
});

export type stackRouter = typeof stackRouter;
