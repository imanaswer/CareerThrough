import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { pg?: ReturnType<typeof postgres> };

function client() {
  const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("POSTGRES_URL is not set. Run `vercel env pull` after installing the Supabase integration.");
  // prepare:false — Supabase's transaction pooler does not support prepared statements.
  return (globalForDb.pg ??= postgres(url, { prepare: false, max: 5 }));
}

type Db = ReturnType<typeof drizzle<typeof schema>>;
let instance: Db | undefined;

// Lazy so `next build` works without a database.
export const db = new Proxy({} as Db, {
  get(_, prop) {
    const real = (instance ??= drizzle(client(), { schema }));
    const value = Reflect.get(real, prop);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export * from "./schema";
