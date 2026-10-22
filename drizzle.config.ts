import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";
import { databaseConfig, sqliteFilename } from "./src/db/config";

// Drizzle Kit loads this config as CommonJS; standalone scripts use ESM imports.
loadEnvConfig(process.cwd());
const config = databaseConfig();
export default config.provider === "sqlite"
  ? defineConfig({
      dialect: "sqlite",
      schema: "./src/db/schema/sqlite.ts",
      out: "./drizzle/sqlite",
      dbCredentials: { url: sqliteFilename(config.url) },
    })
  : defineConfig({
      dialect: "postgresql",
      schema: "./src/db/schema/postgres.ts",
      out: "./drizzle/postgres",
      dbCredentials: { url: config.url },
    });
