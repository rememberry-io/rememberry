import { z } from "zod";
import { privateProcedure } from "../../middleware/jwt";
import { router } from "../../trpc";
import * as mapController from "./mapController";

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
    const [errorCheck, res] = await mapController.controlMapCreation(
      opts.input,
    );
    if (errorCheck) {
      throw errorCheck;
    }
    return res;
  }),

  getUsersMaps: privateProcedure.input(z.string()).query(async (opts) => {
    const res = await mapController.controlGetUsersMaps(opts.input);
    return res;
  }),

  updateMap: privateProcedure.input(updateMapInput).mutation(async (opts) => {
    const [errorCheck, res] = await mapController.controlUpdateMap(opts.input);
    if (errorCheck) {
      throw errorCheck;
    }
    return res;
  }),

  deleteMapWithAllStacks: privateProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const [errorCheck, res] =
        await mapController.controlDeleteMapWithAllStacks(opts.input);
      if (errorCheck) {
        throw errorCheck;
      }
      return res;
    }),
});

export type MapRouter = typeof mapRouter;
