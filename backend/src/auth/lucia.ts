import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, TimeSpan } from "lucia";
import { db } from "../db/db";
import { session, users } from "../db/schema";
import env from "../env";

const adapter = new DrizzlePostgreSQLAdapter(db, session, users);

const getDomain = () => {
  if (env.NODE_ENV === "staging") {
    return "stage.rememberry.app";
  } else if (env.NODE_ENV === "production") {
    return "rememberry.app";
  } else {
    return "127.0.0.1";
  }
};

export const lucia = new Lucia(adapter, {
  getUserAttributes: (data) => {
    return {
      username: data.username,
      email: data.email,
    };
  },
  sessionExpiresIn: new TimeSpan(30, "d"), // no more active/idle
  sessionCookie: {
    expires: false,
    name: "auth_session",
    attributes: {
      secure: true,
      sameSite: "strict",
      domain: getDomain(),
    },
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      username: string;
      email: string;
    };
  }
}
