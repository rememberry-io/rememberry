import { authRouter } from "../resources/auth/auth.router";
import { flashcardRouter } from "../resources/flashcards/router";
import { mapRouter } from "../resources/maps/router";
import { stackRouter } from "../resources/stacks/router";
import { userRouter } from "../resources/user/user.router";
import { router } from "../trpc";

export const appRouter = router({
  user: userRouter,
  stacks: stackRouter,
  maps: mapRouter,
  flashcards: flashcardRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
