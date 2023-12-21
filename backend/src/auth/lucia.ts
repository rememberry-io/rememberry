import { pg } from "@lucia-auth/adapter-postgresql";
import { lucia } from "lucia";
import { node } from "lucia/middleware";
import { pool } from "../db/db";

export const auth = lucia({
  env: "DEV",
  middleware: node(),
  adapter: pg(pool, {
    user: "users",
    key: "auth_key",
    session: "auth_session",
  }),
});
