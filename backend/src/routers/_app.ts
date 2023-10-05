import { stackRouter } from "../endPoints/stacks/router";
import { router } from "../trpc";
import { userRouter } from "../endPoints/user/router";
import { mapRouter } from "../endPoints/maps/router";
import { flashcardRouter } from "../endPoints/flashcards/router";

export const appRouter = router({
  user: userRouter,
  stacks: stackRouter,
  maps: mapRouter,
  flashcards: flashcardRouter
});

export type AppRouter = typeof appRouter;
