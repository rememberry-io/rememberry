import { flashcardRouter } from "../endPoints/flashcards/router";
import { authRouter } from "../endPoints/login/router";
import { mapRouter } from "../endPoints/maps/router";
import { stackRouter } from "../endPoints/stacks/router";
//import { userRouter } from "../endPoints/user/router";
import { router } from "../trpc";

export const appRouter = router({
  //user: userRouter,
  stacks: stackRouter,
  maps: mapRouter,
  flashcards: flashcardRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
