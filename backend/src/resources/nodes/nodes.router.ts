import z from "zod";
import { privateProcedure } from "../../middleware/validateSession";
import { router } from "../../trpc";
import { nodeControllerDrizzle } from "./nodes.controller";
import {
  changeParentStackInput,
  newNodeInput,
  stackInput,
} from "./nodes.types";

export const nodeRouter = router({
  create: privateProcedure.input(newNodeInput).mutation(async (opts) => {
    const [err, node] = await nodeControllerDrizzle.createNode(opts.input);

    if (err) throw err;

    return node;
  }),

  getById: privateProcedure.input(z.string()).query(async (opts) => {
    const [err, node] = await nodeControllerDrizzle.getNodeById(opts.input);

    if (err) throw err;

    return node;
  }),

  getTopLevelNodesByMapId: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, nodes] = await nodeControllerDrizzle.getTopLevelNodesByMapId(
        opts.input,
      );

      if (err) throw err;

      return nodes;
    }),

  getDirectChildrenNodesFromParentNode: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, nodes] =
        await nodeControllerDrizzle.getDirectChildrenNodesFromParentNode(
          opts.input,
        );

      if (err) throw err;

      return nodes;
    }),

  getAllChildrenNodesFromParent: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, nodes] =
        await nodeControllerDrizzle.getAllChildrenNodesFromParentNode(
          opts.input,
        );

      if (err) throw err;

      return nodes;
    }),

  getAllByMapId: privateProcedure.input(z.string()).query(async (opts) => {
    const [err, nodes] = await nodeControllerDrizzle.getNodesByMapId(
      opts.input,
    );

    if (err) throw err;

    return nodes;
  }),

  updateById: privateProcedure.input(stackInput).mutation(async (opts) => {
    const [err, node] = await nodeControllerDrizzle.updateNodeById(opts.input);

    if (err) throw err;

    return node;
  }),

  changeParent: privateProcedure
    .input(changeParentStackInput)
    .mutation(async (opts) => {
      const [err, node] = await nodeControllerDrizzle.changeParentNode(
        opts.input.parentId,
        opts.input.childId,
      );

      if (err) throw err;

      return node;
    }),

  deleteParentRelation: privateProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const [err, node] = await nodeControllerDrizzle.deleteParentNodeRelation(
        opts.input,
      );

      if (err) throw err;

      return node;
    }),

  deleteAndMoveChildrenUp: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, nodes] =
        await nodeControllerDrizzle.deleteMiddleOrderNodeAndMoveChildrenUp(
          opts.input,
        );

      if (err) throw err;

      return nodes;
    }),

  deleteWithAllChildren: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, nodes] = await nodeControllerDrizzle.deleteNodeAndChildren(
        opts.input,
      );

      if (err) throw err;

      return nodes;
    }),
});

export type nodeRouter = typeof nodeRouter;
