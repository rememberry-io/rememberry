import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import * as mapController from "./mapController";
import * as schema from "../../db/schema";
import { privateProcedure } from "../../middleware/jwt";

const createMapInput = z.object({
  user_id: z.string(),
  map_name: z.string(),
  map_description: z.string(),
});

const updateMapInput = z.object({
  map_name: z.string(),
  map_description: z.string(),
});

export const mapRouter = router({
  createMap: privateProcedure.input(createMapInput).mutation(async (opts) => {
    const res = mapController.controlMapCreation(opts.input, opts.ctx.db);
    return res;
  }),

  getUsersMaps: privateProcedure.input(z.string()).query(async (opts) => {
    const res = await mapController.controlGetUsersMaps(
      opts.input,
      opts.ctx.db
    );
    return res;
  }),

  updateMap: privateProcedure.input(updateMapInput).mutation(async (opts) => {
    const res = await mapController.controlUpdateMap(opts.input, opts.ctx.db);
    return res;
  }),

  deleteMapWithAllStacks: privateProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const res = await mapController.controlDeleteMapWithAllStacks(
        opts.input,
        opts.ctx.db
      );
      return res;
    }),
});

export type MapRouter = typeof mapRouter;
