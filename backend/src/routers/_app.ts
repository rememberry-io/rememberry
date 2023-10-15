import { stackRouter } from "../endPoints/stacks/router";
import { router } from "../trpc";
import { userRouter } from "../endPoints/user/router";
import { mapRouter } from "../endPoints/maps/router";
import { flashcardRouter } from "../endPoints/flashcards/router";
import { loginRouter } from "../endPoints/login/router";

export const appRouter = router({
  user: userRouter,
  stacks: stackRouter,
  maps: mapRouter,
  flashcards: flashcardRouter,
  login: loginRouter,
});

export type AppRouter = typeof appRouter;
