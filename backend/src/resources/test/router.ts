import { publicProcedure, router } from "../../trpc";
import { testModel } from "./model";

export const testRouter = router({
  test: publicProcedure.query(async (opts) => {
    testModel.exampleUsage({
      username: "test",
      email: "test@test",
      password: "testtest",
    });
    return "success";
  }),
});

export type testRouter = typeof testRouter;
