import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./routers/_app";
import { createContext } from "./context";
import cors from "cors";

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext
});

server.listen(3050);

console.log("server listening on http://localhost:3050");

export type AppRouter = typeof appRouter;
