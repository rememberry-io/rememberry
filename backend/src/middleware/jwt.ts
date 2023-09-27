import { router, middleware, publicProcedure } from "../trpc"
import jwt from 'jsonwebtoken'
import { config } from "dotenv"
import { TRPCError } from "trpc"
config()


// const isLoggedIn = middleware(async({next, ctx}) => {
//     const {req} = ctx 
//     const token = req.headers.authorization?.split(' ')[1]
//     if(!token) throw new TRPCError(403, {message:'UNAUTHORIZED'})
//     console.log(token)
//     const payload = jwt.verify(token, )
//     console.log(payload);
    
//     return next({
//         ctx: {
//             payload,
//             test:'hs'
//         }
//     })
// })


// export const privateProcedure = publicProcedure.use(isLoggedIn)