import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import * as mapController from "./mapController";
import * as schema from "../../db/schema";

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
  createMap: publicProcedure.input(createMapInput).mutation(async (opts) => {
    const res = mapController.controlMapCreation(opts.input);
    return res;
  }),

  getUsersMaps: publicProcedure.input(z.string()).query(async (opts) => {
    const res = await mapController.controlGetUsersMaps(
      opts.input
    );
    return res;
  }),

  updateMap: publicProcedure.input(updateMapInput).mutation(async (opts) => {
    const res = await mapController.controlUpdateMap(opts.input);
    return res;
  }),

  deleteMapWithAllStacks: publicProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const res = await mapController.controlDeleteMapWithAllStacks(
        opts.input
      );
      return res;
    }),
});

export type MapRouter = typeof mapRouter;
