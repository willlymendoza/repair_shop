import { resolve } from "node:path";

export function databaseConfig(env: Record<string, string | undefined> = process.env) {
  const provider = env.DATABASE_PROVIDER ?? "sqlite";
  if (provider !== "sqlite" && provider !== "postgres") {
    throw new Error("DATABASE_PROVIDER must be sqlite or postgres.");
  }
  const url = env.DATABASE_URL ?? (provider === "sqlite" ? "file:./data/repair_shop.db" : "");
  if (provider === "postgres" && !/^postgres(ql)?:\/\//.test(url)) {
    throw new Error("PostgreSQL requires a postgresql:// DATABASE_URL.");
  }
  if (provider === "sqlite" && !url.startsWith("file:")) {
    throw new Error("SQLite requires a local file: DATABASE_URL.");
  }
  return { provider, url } as const;
}
export function sqliteFilename(url: string) {
  const name = url.slice(5);
  return name === ":memory:" ? name : resolve(name);
}
