import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import * as mapModels from './mapModels'
import * as schema from "../../db/schema";


const createMapInput = z.object({
    user_id: z.string(),
    map_name: z.string(),
    map_description: z.string()
})

const updateMapInput = z.object({
    map_name: z.string(),
    map_description: z.string()
})



export const mapRouter = router({

    createMap: publicProcedure.input(createMapInput).mutation(async(opts) => {
        const res = mapModels.createMap(opts.input, opts.ctx.db)
        return res
    }),

    getMapsById: publicProcedure.input(z.string()).query(async(opts) => {
        const res = await mapModels.getMapsByUserId(opts.input, opts.ctx.db)
        return res 
    }),

    updateMap: publicProcedure.input(updateMapInput).mutation(async(opts) => {
        const res = await mapModels.updateMap(opts.input, opts.ctx.db)
        return res
    }), 

    deleteMap: publicProcedure.input(z.string()).mutation(async (opts) => {
        const res = await mapModels.deleteMapWithAllStacks(opts.input, opts.ctx.db)
        return res 
    })

})

export type MapRouter = typeof mapRouter