import { initTRPC, inferAsyncReturnType } from "@trpc/server";
import { createContext } from "./context";

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
