import { router, publicProcedure } from "../trpc";
import z from 'zod'

export const stackRouter = router({

    createStack: publicProcedure
        .input(z.object({
            userId:z.string(),
            stackName: z.string(),
            topic: z.string(),
        }))
        .query(async(opts)=>{
            const {db} = opts.ctx
            const input = opts.input
            const queryValues = [input.userId, input.stackName, input.userId, new Date()]
            const stackIdQueryValues = [input.userId, input.stackName]
            const queryTextStack = 'INSERT INTO stacks(user_id, stack_name, creator, created_at) VALUES($1, $2, $3, $4)'
            const stackRes = await db.query(queryTextStack, queryValues)

            const stackIdQueryText = 'SELECT stack_id FROM stacks WHERE user_id=$1 AND stack_name=$2'
            const resStackId = await db.query(stackIdQueryText, stackIdQueryValues)
            const stackId = resStackId.rows[0].stack_id

            const topicQueryValues = [stackId, input.topic]
            const topicQueryText = 'INSERT INTO topics(stack_id, topic) VALUES ($1, $2)'
            const topicRes = db.query(topicQueryText, topicQueryValues)
            return topicRes

            // const queryTextTopic = 'INSERT INTO topics(stack_id, topic) VALUES'
        }), 

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