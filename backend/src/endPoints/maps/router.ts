import { z } from "zod";
import { privateProcedure } from "../../middleware/validateSession";
import { router } from "../../trpc";
import * as mapController from "./mapController";

const createMapInput = z.object({
  userId: z.string(),
  mapName: z.string(),
  mapDescription: z.string(),
});

const updateMapInput = z.object({
  mapName: z.string(),
  mapDescription: z.string(),
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

export type mapRouter = typeof mapRouter;
