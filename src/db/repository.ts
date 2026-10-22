import type { Store } from "./store";
import {
  completionDate,
  customerSchema,
  jobSchema,
  recordId,
  vehicleSchema,
} from "../lib/validation";
import type { Snapshot } from "../lib/domain";

export class RecordError extends Error {}
export class ShopRepository {
  constructor(private store: Store) {}
  async snapshot(): Promise<Snapshot> {
    const [customers, vehicles, jobs] = await Promise.all([
      this.store.customers(),
      this.store.vehicles(),
      this.store.jobs(),
    ]);
    return { customers, vehicles, jobs };
  }
  async saveCustomer(input: unknown, id?: number) {
    const value = customerSchema.parse(input);
    if (id !== undefined) {
      recordId.parse(id);
      if (!(await this.store.updateCustomer(id, value)))
        throw new RecordError("Customer no longer exists.");
      return id;
    }
    return this.store.insertCustomer({ ...value, createdAt: new Date().toISOString() });
  }
  async saveVehicle(input: unknown, id?: number) {
    const value = vehicleSchema.parse(input);
    if (!(await this.store.customers()).some((customer) => customer.id === value.customerId)) {
      throw new RecordError("Choose an existing customer.");
    }
    if (id !== undefined) {
      recordId.parse(id);
      if (!(await this.store.updateVehicle(id, value)))
        throw new RecordError("Vehicle no longer exists.");
      return id;
    }
    return this.store.insertVehicle({ ...value, createdAt: new Date().toISOString() });
  }
  async saveJob(input: unknown, id?: number) {
    const value = jobSchema.parse(input);
    if (!(await this.store.vehicles()).some((vehicle) => vehicle.id === value.vehicleId)) {
      throw new RecordError("Choose an existing vehicle.");
    }
    const now = new Date().toISOString();
    const previous =
      id === undefined
        ? undefined
        : (await this.store.jobs()).find((job) => job.id === recordId.parse(id));
    if (id !== undefined && !previous) throw new RecordError("Repair job no longer exists.");
    const data = {
      ...value,
      updatedAt: now,
      completedAt: completionDate(value.status, previous?.completedAt ?? null, now),
    };
    if (id !== undefined) {
      if (!(await this.store.updateJob(id, data)))
        throw new RecordError("Repair job no longer exists.");
      return id;
    }
    return this.store.insertJob({ ...data, createdAt: now });
  }
}
