import { stackRouter } from "../stacks/router";
import { router } from "../trpc";
import { userRouter } from "../user/router";

export const appRouter = router({
  user: userRouter,
  stacks: stackRouter,
});

export type AppRouter = typeof appRouter;
