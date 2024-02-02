import { TRPCError } from "@trpc/server";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import { DatabaseError } from "pg";

/**
 * if message and error are undefined returns an Internal server error without a message
 */
export const getTRPCError = (
  message?: string | null,
  error?: TRPC_ERROR_CODE_KEY | null,
) => {
  let tError: TRPC_ERROR_CODE_KEY = "INTERNAL_SERVER_ERROR";
  if (error) tError = error;
  if (message) return [new TRPCError({ code: tError, message }), null] as const;

  return [new TRPCError({ code: tError }), null] as const;
};

export const hasOnlyOneEntry = (content: any[]) => {
  if (content.length === 1) return true;
  return false;
};

export const getModelDefaultError = (error: unknown) => {
  if (error instanceof DatabaseError)
    return getTRPCError("Error with the DB: " + JSON.stringify(error));
  return getTRPCError(JSON.stringify(error));
};
