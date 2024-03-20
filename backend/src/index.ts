import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { createContext } from "./context";
import { env } from "./env";
import { appRouter } from "./routers/_app";
import { theALMIGHTYDB } from "./db/db";

const server = createHTTPServer({
  middleware: cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://rememberry.app",
      "https://web.stage.rememberry.app",
    ],
    credentials: true,
  }),
  router: appRouter,
  createContext,
});

process.on("SIGHUP", () => {
  env.updateEnv()
  theALMIGHTYDB.updateDBConnection()
})

server.listen(env.get("PORT"));

console.log("server listening on http://localhost:" + env.get("PORT"));
