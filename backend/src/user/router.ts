import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const userRouter = router({
  getUserById: publicProcedure
  .query(async({input, ctx }) => {
    console.log("dongs");
  }),
});

export type userRouter = typeof userRouter;
