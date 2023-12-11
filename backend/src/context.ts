import { inferAsyncReturnType } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";

export const createContext = (opts: CreateHTTPContextOptions) => {
  const { req, res } =   opts;
  
  return {
    req,
    res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
