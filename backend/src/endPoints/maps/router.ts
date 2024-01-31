import { z } from "zod";
import { privateProcedure } from "../../middleware/validateSession";
import { router } from "../../trpc";
import { mapControllerDrizzle } from "./map.controller";

const createMapInput = z.object({
  userId: z.string(),
  mapName: z.string(),
  mapDescription: z.string(),
});

const updateMapInput = z.object({
  id: z.string(),
  userId: z.string(),
  mapName: z.string(),
  mapDescription: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  peerId: z.string().nullable(),
});

export const mapRouter = router({
  createMap: privateProcedure.input(createMapInput).mutation(async (opts) => {
    const [err, map] = await mapControllerDrizzle.createMap(opts.input);
    if (err) throw err;
    return map;
  }),

  getUsersMaps: privateProcedure.input(z.string()).query(async (opts) => {
    const [err, maps] = await mapControllerDrizzle.getMapsByUserId(opts.input);

    if (err) throw err;

    return maps;
  }),

  updateMap: privateProcedure.input(updateMapInput).mutation(async (opts) => {
    const [err, map] = await mapControllerDrizzle.updateMapById(opts.input);
    if (err) throw err;

    return map;
  }),

  deleteMapWithAllStacks: privateProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const [err, success] = await mapControllerDrizzle.deleteMapById(
        opts.input,
      );
      if (err) throw err;

      return success;
    }),
});

export type mapRouter = typeof mapRouter;
