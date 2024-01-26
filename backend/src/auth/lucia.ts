import { pg } from "@lucia-auth/adapter-postgresql";
import { lucia } from "lucia";
import { node } from "lucia/middleware";
import { pool } from "../db/db";

export const auth = lucia({
  env: "DEV",
  middleware: node(),
  csrfProtection: {
    allowedSubDomains: "*",
    host: "127.0.0.1:3000",
  },
  adapter: pg(pool, {
    user: "users",
    key: "user_key",
    session: "user_session",
  }),
  getUserAttributes: (data) => {
    return {
      username: data.username,
      email: data.email,
    };
  },
  sessionCookie: {
    expires: false,
  },
});

export type Auth = typeof auth;
