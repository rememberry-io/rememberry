import { z } from "zod";
import bcrypt from "bcrypt";
import { router, publicProcedure } from "../trpc";

export const userRouter = router({

  createUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .query(async (opts) => {
      try {
        const user = opts.input;
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(user.password, salt);
        const { db } = opts.ctx;
        const queryValues = [user.username, user.email, hashedPwd];
        const queryText =
          "INSERT INTO users(username, email, user_password) VALUES ($1, $2, $3)";
        const res = await db.query(queryText, queryValues);
        return res;
      } catch (error) {
        console.error(error);
      }
    }),

  getUserById: publicProcedure.input(z.string()).query(async (opts) => {
    const { db } = opts.ctx;
    const userId = opts.input;
    const queryValues = [userId];
    const queryText = "SELECT * FROM users WHERE user_id=$1;";
    const res = await db.query(queryText, queryValues);
    return res;
  }),

  deleteUserById: publicProcedure.input(z.string()).mutation(async (opts) => {
    const { db } = opts.ctx;
    const userId: string = opts.input;
    const values = [userId];
    const queryText: string = "DELETE FROM users WHERE user_id=$1";
    const res = await db.query(queryText, values);
    return res;
  }),

  updateUserById: publicProcedure
    .input(
      z.object({
        username: z.string(),
        email: z.string(),
        password: z.string(),
        userId: z.string()
      })
    )
    .mutation(async (opts) => {
      const user = opts.input;
      const { db } = opts.ctx;
      const queryValues = [
        user.username,
        user.email,
        user.password,
        user.userId
      ];
      const queryText =
        "UPDATE users SET username=$1, email=$2, password=$3 WHERE user_id=$4";
      const res = await db.query(queryText, queryValues);
      return res;
    }),
});

export type userRouter = typeof userRouter;
