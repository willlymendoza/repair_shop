import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createClient } from "@libsql/client";
import { drizzle as sqliteDrizzle } from "drizzle-orm/libsql";
import { drizzle as postgresDrizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { databaseConfig, sqliteFilename } from "./config";
import * as sqliteSchema from "./schema/sqlite";
import * as postgresSchema from "./schema/postgres";
import { sqliteStore } from "./sqlite-store";
import { postgresStore } from "./postgres-store";

export async function connectDatabase(config = databaseConfig()) {
  if (config.provider === "postgres") {
    const client = postgres(config.url, { max: 4, connect_timeout: 10 });
    const db = postgresDrizzle(client, { schema: postgresSchema });
    return {
      provider: "postgres" as const,
      db,
      store: postgresStore(db),
      close: () => client.end(),
    };
  }
  const filename = sqliteFilename(config.url);
  if (filename !== ":memory:") mkdirSync(dirname(filename), { recursive: true });
  const client = createClient({
    url: filename === ":memory:" ? "file::memory:" : `file:${filename.replaceAll("\\", "/")}`,
  });
  await client.execute("PRAGMA foreign_keys = ON");
  const db = sqliteDrizzle(client, { schema: sqliteSchema });
  return {
    provider: "sqlite" as const,
    db,
    store: sqliteStore(db),
    close: async () => client.close(),
  };
}
