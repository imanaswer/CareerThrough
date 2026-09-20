import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// drizzle-kit does not read Next's .env.local on its own.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL! },
});
