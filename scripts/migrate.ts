import nextEnv from "@next/env";
import { migrate as sqliteMigrate } from "drizzle-orm/libsql/migrator";
import { migrate as postgresMigrate } from "drizzle-orm/postgres-js/migrator";
import { connectDatabase } from "../src/db/connect";

nextEnv.loadEnvConfig(process.cwd());
async function main() {
  const connection = await connectDatabase();
  try {
    if (connection.provider === "sqlite")
      await sqliteMigrate(connection.db, { migrationsFolder: "./drizzle/sqlite" });
    else await postgresMigrate(connection.db, { migrationsFolder: "./drizzle/postgres" });
    console.log(`Migrations applied (${connection.provider}).`);
  } finally {
    await connection.close();
  }
}
main().catch(() => {
  console.error("Migration failed. Check the database configuration and migration files.");
  process.exitCode = 1;
});
