import { desc, eq } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema/sqlite";
import type { Store } from "./store";

type Database = Pick<
  LibSQLDatabase<typeof schema>,
  "select" | "insert" | "update" | "delete" | "transaction"
>;
export function sqliteStore(db: Database): Store {
  const { customers, vehicles, repairJobs } = schema;
  return {
    customers: () => db.select().from(customers).orderBy(desc(customers.id)),
    vehicles: () => db.select().from(vehicles).orderBy(desc(vehicles.id)),
    jobs: () => db.select().from(repairJobs).orderBy(desc(repairJobs.id)),
    async insertCustomer(value) {
      return (await db.insert(customers).values(value).returning({ id: customers.id }))[0].id;
    },
    async updateCustomer(id, value) {
      return (
        (await db.update(customers).set(value).where(eq(customers.id, id)).returning()).length > 0
      );
    },
    async insertVehicle(value) {
      return (await db.insert(vehicles).values(value).returning({ id: vehicles.id }))[0].id;
    },
    async updateVehicle(id, value) {
      return (
        (await db.update(vehicles).set(value).where(eq(vehicles.id, id)).returning()).length > 0
      );
    },
    async insertJob(value) {
      return (await db.insert(repairJobs).values(value).returning({ id: repairJobs.id }))[0].id;
    },
    async updateJob(id, value) {
      return (
        (await db.update(repairJobs).set(value).where(eq(repairJobs.id, id)).returning()).length > 0
      );
    },
    async clearData() {
      await db.delete(repairJobs);
      await db.delete(vehicles);
      await db.delete(customers);
    },
    transaction: (run) => db.transaction((tx) => run(sqliteStore(tx))),
  };
}
