import { authRouter } from "../resources/auth/auth.router";
import { mapRouter } from "../resources/maps/router";
import { nodeRouter } from "../resources/nodes/nodes.router";
import { userRouter } from "../resources/user/user.router";
import { router } from "../trpc";

export const appRouter = router({
  user: userRouter,
  node: nodeRouter,
  maps: mapRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
