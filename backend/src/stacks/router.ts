import { router, publicProcedure } from "../trpc";
import z from 'zod'

export const stackRouter = router({
    getAllStacks: publicProcedure
        .input(z.object({
            userId: z.string(),
        }))
        .query(async(opts) => {
            const { db } = opts.ctx
            const values = [opts.input.userId]
            const queryText = 'SELECT * FROM stacks WHERE user_id=$1'
            const res = db.query(queryText, values)
            return res
        }),
    
    getLearnableStacks: publicProcedure
        .input(z.object({
            userId: z.string()
        }))
        .query(async(opts) => {
            const { db } = opts.ctx
            const values = [opts.input.userId]
            const queryText = 'SELECT * FROM stacks WHERE user_id=$1 AND number_of_unlearned_cards > 0'
            const res = db.query(queryText, values)
            return res
        }),

    getAllStacksByTopic: publicProcedure
        .input(z.object({
            userId:z.string(),
            topic: z.string()
        }))

        .query(async(opts)=>{
            const { db } = opts.ctx
            const queryValues = [opts.input.userId, opts.input.topic]
            const queryText = 'SELECT * FROM stacks WHERE user_id=$1 AND topic=$2 ORDER BY ASC'
            const res = db.query(queryText, queryValues)
            return res
        }),

    

})