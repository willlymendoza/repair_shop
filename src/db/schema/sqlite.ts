import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, index, check } from "drizzle-orm/sqlite-core";
import { jobStatuses } from "../../lib/domain";

export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  createdAt: text("created_at").notNull(),
});
export const vehicles = sqliteTable(
  "vehicles",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    customerId: integer("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),
    plate: text("plate").notNull(),
    make: text("make").notNull(),
    model: text("model").notNull(),
    year: integer("year"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("vehicles_customer_idx").on(table.customerId)],
);
export const repairJobs = sqliteTable(
  "repair_jobs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    vehicleId: integer("vehicle_id")
      .notNull()
      .references(() => vehicles.id, { onDelete: "restrict" }),
    description: text("description").notNull(),
    notes: text("notes").notNull(),
    status: text("status", { enum: jobStatuses }).notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    completedAt: text("completed_at"),
  },
  (table) => [
    index("jobs_vehicle_idx").on(table.vehicleId),
    index("jobs_status_idx").on(table.status),
    check("jobs_status_check", sql`${table.status} in ('open', 'in_progress', 'completed')`),
  ],
);
