import { router, publicProcedure } from "../../trpc";
import * as flashcardModels from './flashcardModels'
import z from "zod";
import { config } from "dotenv";

config()



export const flashcardRouter = router({
    
    getAllCardsFromStack: publicProcedure.input(z.string()).query(async(opts) => {
        const res = await flashcardModels.getAllFlashcardsFromStack(opts.input, opts.ctx.db)
        return res
    }),

    getLearnableCardsFromStack: publicProcedure.input(z.string()).query(async(opts) => {
        const res = await flashcardModels.getLearnableFlashcardsFromStack(opts.input, opts.ctx.db)
        return res 
    }),

    getAllCardsFromParentAndChilds: publicProcedure.input(z.string()).query(async(opts) => {
        const res = await flashcardModels.getAllFlashcardsFromStackAndChildStacks(opts.input, opts.ctx.db)
        return res
    }),

    getLearnableCardsFromStackAndChilds: publicProcedure.input(z.string()).query(async(opts) => {
        const res = await flashcardModels.getLearnableFlashcardsFromStackAndChilds(opts.input, opts.ctx.db)
        return res 
    })
})

export type flashcardRouter = typeof flashcardRouter