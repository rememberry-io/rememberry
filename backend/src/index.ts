import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { createContext } from "./context";
import { appRouter } from "./routers/_app";

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
});

server.listen(3050);

console.log("server listening on http://localhost:3050");
