import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate as migrateSqlite } from "drizzle-orm/libsql/migrator";
import { migrate as migratePostgres } from "drizzle-orm/postgres-js/migrator";
import { connectDatabase } from "../src/db/connect";
import { ShopRepository } from "../src/db/repository";
import { postgresStore } from "../src/db/postgres-store";
import * as schema from "../src/db/schema/postgres";
import type { Store } from "../src/db/store";
import { seedDatabase } from "../scripts/seed-data";

for (const provider of ["sqlite", "postgres"] as const) {
  describe.skipIf(provider === "postgres" && !process.env.TEST_POSTGRES_URL)(
    `${provider} repository contract`,
    () => {
      let shop: ShopRepository;
      let store: Store;
      let cleanup: () => Promise<void>;
      beforeEach(async () => {
        faker.seed(2026);
        if (provider === "sqlite") {
          const connection = await connectDatabase({
            provider: "sqlite",
            url: "file::memory:",
          });
          if (connection.provider !== "sqlite") throw new Error("Unexpected provider");
          await migrateSqlite(connection.db, { migrationsFolder: "./drizzle/sqlite" });
          store = connection.store;
          cleanup = async () => {
            await connection.close();
          };
        } else {
          // Each test owns a fresh schema; existing application tables are never touched.
          const name = `repair_shop_test_${randomUUID().replaceAll("-", "")}`;
          const client = postgres(process.env.TEST_POSTGRES_URL!, {
            max: 1,
            connection: { search_path: name },
          });
          await client`create schema ${client(name)}`;
          const db = drizzle(client, { schema });
          await migratePostgres(db, {
            migrationsFolder: "./drizzle/postgres",
            migrationsSchema: name,
          });
          store = postgresStore(db);
          cleanup = async () => {
            await client`drop schema ${client(name)} cascade`;
            await client.end();
          };
        }
        shop = new ShopRepository(store);
      });
      afterEach(async () => {
        await cleanup?.();
      });
      async function fixtures() {
        const customerId = await shop.saveCustomer({
          name: faker.person.fullName(),
          phone: faker.phone.number(),
        });
        const vehicleId = await shop.saveVehicle({
          customerId,
          plate: "abc-123",
          make: "Toyota",
          model: "Corolla",
          year: "2020",
        });
        return { customerId, vehicleId };
      }
      it("persists related records and normalizes inputs", async () => {
        const { customerId, vehicleId } = await fixtures();
        const id = await shop.saveJob({
          vehicleId,
          description: " Brake noise ",
          notes: "",
          status: "open",
        });
        const snapshot = await shop.snapshot();
        expect(snapshot.customers[0].id).toBe(customerId);
        expect(snapshot.vehicles[0]).toMatchObject({ customerId, plate: "ABC-123", year: 2020 });
        expect(snapshot.jobs[0]).toMatchObject({
          id,
          vehicleId,
          description: "Brake noise",
          status: "open",
          completedAt: null,
        });
        expect(snapshot.jobs[0].createdAt).toMatch(/Z$/);
      });
      it("edits customers and vehicles without replacing their IDs", async () => {
        const { customerId, vehicleId } = await fixtures();
        const updatedName = faker.person.fullName();
        await shop.saveCustomer({ name: updatedName, phone: "" }, customerId);
        await shop.saveVehicle(
          { customerId, plate: "xyz", make: "Honda", model: "Civic", year: "" },
          vehicleId,
        );
        expect((await shop.snapshot()).customers[0]).toMatchObject({
          id: customerId,
          name: updatedName,
        });
        expect((await shop.snapshot()).vehicles[0]).toMatchObject({
          id: vehicleId,
          plate: "XYZ",
          year: null,
        });
      });
      it("completes and reopens a job while preserving its creation timestamp", async () => {
        const { vehicleId } = await fixtures();
        const value = { vehicleId, description: "Brakes", notes: "", status: "open" };
        const id = await shop.saveJob(value);
        const createdAt = (await shop.snapshot()).jobs[0].createdAt;
        await shop.saveJob({ ...value, status: "in_progress" }, id);
        await shop.saveJob({ ...value, status: "completed" }, id);
        const completedAt = (await shop.snapshot()).jobs[0].completedAt;
        expect(completedAt).toMatch(/Z$/);
        await shop.saveJob({ ...value, notes: "Finished", status: "completed" }, id);
        expect((await shop.snapshot()).jobs[0].completedAt).toBe(completedAt);
        await shop.saveJob(value, id);
        expect((await shop.snapshot()).jobs[0]).toMatchObject({
          status: "open",
          completedAt: null,
          createdAt,
        });
      });
      it("rejects orphaned relationships", async () => {
        await expect(
          shop.saveVehicle({ customerId: 99999, plate: "X", make: "A", model: "B", year: "" }),
        ).rejects.toThrow("existing customer");
        await expect(
          shop.saveJob({ vehicleId: 99999, description: "X", notes: "", status: "open" }),
        ).rejects.toThrow("existing vehicle");
      });
      it("rejects edits of missing records", async () => {
        await expect(
          shop.saveCustomer({ name: faker.person.fullName(), phone: "" }, 99999),
        ).rejects.toThrow("no longer exists");
      });
      it("rolls back related writes when a transaction fails", async () => {
        await expect(
          store.transaction(async (transaction) => {
            await new ShopRepository(transaction).saveCustomer({
              name: faker.person.fullName(),
              phone: "",
            });
            throw new Error("Stop");
          }),
        ).rejects.toThrow("Stop");
        expect((await shop.snapshot()).customers).toHaveLength(0);
      });
      it("replaces previous data on repeated seed runs and keeps relationships valid", async () => {
        const { customerId, vehicleId } = await fixtures();
        await shop.saveJob({ vehicleId, description: "Repair", notes: "", status: "open" });
        await seedDatabase(store, 123);
        const first = await shop.snapshot();
        await seedDatabase(store, 456);
        const second = await shop.snapshot();
        expect(second.customers).toHaveLength(12);
        expect(second.vehicles).toHaveLength(12);
        expect(second.jobs).toHaveLength(10);
        expect(first.customers.some((customer) => customer.id === customerId)).toBe(false);
        expect(
          second.customers.some((customer) =>
            first.customers.some((old) => old.id === customer.id),
          ),
        ).toBe(false);
        expect(second.customers.map((customer) => customer.name)).not.toEqual(
          first.customers.map((customer) => customer.name),
        );
        expect(
          second.vehicles.every((vehicle) =>
            second.customers.some((customer) => customer.id === vehicle.customerId),
          ),
        ).toBe(true);
        expect(
          second.jobs.every((job) =>
            second.vehicles.some((vehicle) => vehicle.id === job.vehicleId),
          ),
        ).toBe(true);
      });
      it("restores existing records if reseeding fails after deletion and a partial insert", async () => {
        const { vehicleId } = await fixtures();
        await shop.saveJob({ vehicleId, description: "Repair", notes: "", status: "open" });
        const before = await shop.snapshot();
        const failingStore: Store = {
          ...store,
          transaction: (run) =>
            store.transaction((transaction) =>
              run({
                ...transaction,
                insertVehicle: async () => {
                  throw new Error("Injected seed failure");
                },
              }),
            ),
        };
        await expect(seedDatabase(failingStore, 789)).rejects.toThrow("Injected seed failure");
        expect(await shop.snapshot()).toEqual(before);
      });
      it("enforces foreign keys even outside the repository", async () => {
        await expect(
          store.insertVehicle({
            customerId: 99999,
            plate: "X",
            make: "A",
            model: "B",
            year: null,
            createdAt: new Date().toISOString(),
          }),
        ).rejects.toThrow();
      });
    },
  );
}
