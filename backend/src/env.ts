/*
exports type parsed environment variables (i.e. PORT: "420" becomes PORT: 420) for linting and auto completion purposes.
in staging and prod, these are sourced from process.env (injected via heroku), in development from the local .env file
*/
import { config } from "dotenv";
import { z } from "zod";
import fs from "fs";

const EnvZod = z.object({
  NODE_ENV: z.enum(["production", "development", "testing", "staging"]),
  IS_PROD: z.boolean(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.number(),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  PORT: z.number(),
  REDIS_PORT: z.number(),
  REDIS_HOST: z.string(),
  REDIS_PASSWORD: z.string(),
  WEB_PAGE_DOMAIN: z.string(),
});

function getEnvSrc() {
  const { error, parsed } = config();

  if (error || parsed == null) {
    const processedEnv = process.env as { [key: string]: string };

    const secretPath = "/vault/secrets/db-creds";
    // errors when file not found - on purpose because app should panic
    const vaultFile = fs.readFileSync(secretPath, "utf8")
    for (const line of vaultFile.split("\n")) {
      const [key, value] = line.split("=")
      if (key && value) processedEnv[key] = value.replace(/"/g, '')
    }

    console.info("env variables", processedEnv);

    return processedEnv;
  }

  console.info("env from file", parsed);

  return parsed;
}

function parseEnv(env: { [key: string]: string }) {
  return {
    ...env,
    REDIS_PORT: parseInt(env.REDIS_PORT),
    POSTGRES_PORT: parseInt(env.POSTGRES_PORT),
    PORT: parseInt(env.PORT),
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
export default validateEnv(parseEnv(getEnvSrc()));
