import { flashcardRouter } from "../endPoints/flashcards/router";
import { loginRouter } from "../endPoints/login/router";
import { mapRouter } from "../endPoints/maps/router";
import { stackRouter } from "../endPoints/stacks/router";
import { userRouter } from "../endPoints/user/router";
import { router } from "../trpc";

export const appRouter = router({
  user: userRouter,
  stacks: stackRouter,
  maps: mapRouter,
  flashcards: flashcardRouter,
  login: loginRouter,
});

export type AppRouter = typeof appRouter;
