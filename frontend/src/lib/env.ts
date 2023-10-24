import { config } from "dotenv";
import { z } from "zod";

const EnvZod = z.object({
  NODE_ENV: z.enum(["production", "development", "testing", "staging"]),
  IS_PROD: z.boolean(),
  NEXT_PUBLIC_BACKEND_HOST: z.string(),
  NEXT_PUBLIC_BACKEND_PORT: z.number()
});

export function getEnvSrc() {
  const { error, parsed } = config();

  if (error || parsed == null) return process.env as { [key: string]: string };

  return parsed;
}

export function parseEnv(env: { [key: string]: string }) {
  return {
    NEXT_PUBLIC_BACKEND_HOST: process.env.NEXT_PUBLIC_BACKEND_HOST,
    NEXT_PUBLIC_BACKEND_PORT: parseInt(process.env.NEXT_PUBLIC_BACKEND_PORT!),
    NODE_ENV: process.env.NODE_ENV,
    IS_PROD: process.env.NODE_ENV === "production",
  };
}

function validateEnv(env: { [key: string]: any }) {
  const parsedEnv = EnvZod.safeParse(env);

  if (!parsedEnv.success)
    throw new Error(
      "Failed to Parse Environment Variables: " +
      JSON.stringify(parsedEnv.error.issues, null, 2),
    );

  return parsedEnv.data;
}

export const env = validateEnv(parseEnv(getEnvSrc()));
