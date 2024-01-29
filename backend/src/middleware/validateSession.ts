import { TRPCError } from "@trpc/server";
import { verifyRequestOrigin } from "lucia";
import { lucia } from "../auth/lucia";
import { middleware, publicProcedure } from "../trpc";
import { getTRPCError } from "../utils";

const isLoggedIn = middleware(async ({ next, ctx }) => {
  const { req, res } = ctx;
  const method = req.method;
  const headers = req.headers;
  if (method === "POST") {
    const originHeader = headers.origin;
    // NOTE: You may need to use `X-Forwarded-Host` instead
    const hostHeader = req.headers.host;
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    )
      throw getTRPCError("CSFR Protection", "FORBIDDEN")[0];
  }

  const cookieHeader = req.headers.cookie;

  const sessionId = lucia.readSessionCookie(cookieHeader ?? "");
  if (!sessionId) throw getTRPCError("Invalid cookie", "UNAUTHORIZED")[0];

  const { session, user } = await lucia.validateSession(sessionId);
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    res.setHeader("Set-Cookie", sessionCookie.serialize());

    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid Session",
    });
  }

  if (session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    res.setHeader("Set-Cookie", sessionCookie.serialize());
  }

  return next();
});

export const privateProcedure = publicProcedure.use(isLoggedIn);
