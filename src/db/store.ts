import type { Customer, Vehicle, RepairJob } from "../lib/domain";

export interface Store {
  customers(): Promise<Customer[]>;
  vehicles(): Promise<Vehicle[]>;
  jobs(): Promise<RepairJob[]>;
  insertCustomer(value: Omit<Customer, "id">): Promise<number>;
  updateCustomer(id: number, value: Pick<Customer, "name" | "phone">): Promise<boolean>;
  insertVehicle(value: Omit<Vehicle, "id">): Promise<number>;
  updateVehicle(id: number, value: Omit<Vehicle, "id" | "createdAt">): Promise<boolean>;
  insertJob(value: Omit<RepairJob, "id">): Promise<number>;
  updateJob(id: number, value: Omit<RepairJob, "id" | "createdAt">): Promise<boolean>;
  /** Seed maintenance only. Call inside a transaction. */
  clearData(): Promise<void>;
  transaction<T>(run: (store: Store) => Promise<T>): Promise<T>;
}
