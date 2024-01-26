import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { createContext } from "./context";
import env from "./env";
import { appRouter } from "./routers/_app";

const server = createHTTPServer({
  middleware: cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  }),
  router: appRouter,
  createContext,
});

server.listen(env.PORT);

console.log("server listening on http://localhost:" + env.PORT);
