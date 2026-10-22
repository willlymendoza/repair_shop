import nextEnv from "@next/env";
import { connectDatabase } from "../src/db/connect";
import { seedDatabase } from "./seed-data";

nextEnv.loadEnvConfig(process.cwd());
async function main() {
  const connection = await connectDatabase();
  try {
    console.log(
      `Replacing customers, vehicles, and repair jobs in the configured ${connection.provider} database…`,
    );
    const result = await seedDatabase(connection.store);
    console.log(
      `Replaced data with ${result.customers} customers, ${result.vehicles} vehicles, and ${result.jobs} repair jobs. Seed: ${result.seed}.`,
    );
  } finally {
    await connection.close();
  }
}
main().catch(() => {
  console.error(
    "Seeding failed. Existing records were preserved. Check the database configuration and migrations.",
  );
  process.exitCode = 1;
});
