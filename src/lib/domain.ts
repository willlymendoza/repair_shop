export const jobStatuses = ["open", "in_progress", "completed"] as const;
export type JobStatus = (typeof jobStatuses)[number];
export const statusLabels: Record<JobStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  completed: "Completed",
};
export interface Customer {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
}
export interface Vehicle {
  id: number;
  customerId: number;
  plate: string;
  make: string;
  model: string;
  year: number | null;
  createdAt: string;
}
export interface RepairJob {
  id: number;
  vehicleId: number;
  description: string;
  notes: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}
export type CustomerInput = Pick<Customer, "name" | "phone">;
export type VehicleInput = Pick<Vehicle, "customerId" | "plate" | "make" | "model" | "year">;
export type JobInput = Pick<RepairJob, "vehicleId" | "description" | "notes" | "status">;
export interface Snapshot {
  customers: Customer[];
  vehicles: Vehicle[];
  jobs: RepairJob[];
}
export function jobNumber(id: number) {
  return `JOB-${String(id).padStart(6, "0")}`;
}
