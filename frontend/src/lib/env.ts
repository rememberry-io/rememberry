import { config } from "dotenv";
import { z } from "zod";

const EnvZod = z.object({
  NODE_ENV: z.enum(["production", "development", "testing", "staging"]),
  IS_PROD: z.boolean(),
  BACKEND_URL: z.string(),
});

function getEnvSrc() {
  const { error, parsed } = config();

  if (error || parsed == null) return process.env as { [key: string]: string };

  return parsed;
}

function parseEnv(env: { [key: string]: string }) {
  return {
    ...env,
    NODE_ENV: env.NODE_ENV,
    IS_PROD: env.NODE_ENV === "production",
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
