import { sql } from "drizzle-orm";
import { pgTable, serial, integer, text, index, check } from "drizzle-orm/pg-core";
import { jobStatuses } from "../../lib/domain";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  createdAt: text("created_at").notNull(),
});
export const vehicles = pgTable(
  "vehicles",
  {
    id: serial("id").primaryKey(),
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
export const repairJobs = pgTable(
  "repair_jobs",
  {
    id: serial("id").primaryKey(),
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
