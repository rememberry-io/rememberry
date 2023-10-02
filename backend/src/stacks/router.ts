import { router, publicProcedure } from "../trpc";
import * as stackModels from '../stacks/stackModels'
import z from 'zod'
import { privateProcedure } from "../middleware/jwt";

const stackInput = z.object({
    user_id: z.string(),
    stack_name: z.string(),
    topic: z.string()
})

const searchByTopicInput = z.object({
    user_id: z.string(),
    topic: z.string()
})

const userIdInput = z.object({userId:z.string()})

export const stackRouter = router({

    testAuth: privateProcedure.query(async(opts) => { return 'logged in'}),
    

})