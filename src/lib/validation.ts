import { z } from "zod";
import { jobStatuses } from "./domain";

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);
export const recordId = z.coerce.number().int().positive("Choose a valid record.");
export const customerSchema = z.object({
  name: requiredText("Name", 120),
  phone: z.string().trim().max(60, "Phone must be 60 characters or fewer."),
});
export const vehicleSchema = z.object({
  customerId: recordId,
  plate: requiredText("Plate", 30).transform((value) => value.toUpperCase()),
  make: requiredText("Make", 60),
  model: requiredText("Model", 80),
  year: z.preprocess(
    (value) => (value === "" || value == null ? null : value),
    z.coerce
      .number()
      .int()
      .min(1886)
      .max(new Date().getFullYear() + 2)
      .nullable(),
  ),
});
export const jobSchema = z.object({
  vehicleId: recordId,
  description: requiredText("Reported problem", 2000),
  notes: z.string().trim().max(10000, "Notes must be 10,000 characters or fewer."),
  status: z.enum(jobStatuses),
});
export function completionDate(status: string, previous: string | null, now: string) {
  return status === "completed" ? (previous ?? now) : null;
}
