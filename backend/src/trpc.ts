import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// exporting reusable router and procedure helpers
export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
