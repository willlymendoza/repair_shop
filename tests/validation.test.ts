import { describe, expect, it } from "vitest";
import { faker } from "@faker-js/faker";
import { customerSchema, vehicleSchema, jobSchema } from "../src/lib/validation";
import { databaseConfig } from "../src/db/config";

describe("input validation", () => {
  it("trims names, permits optional phone numbers, and rejects blank names", () => {
    faker.seed(2026);
    const name = faker.person.fullName();
    expect(customerSchema.parse({ name: ` ${name} `, phone: "" })).toEqual({
      name,
      phone: "",
    });
    expect(customerSchema.safeParse({ name: "  ", phone: "" }).success).toBe(false);
  });
  it("normalizes plates and accepts an omitted model year", () => {
    expect(
      vehicleSchema.parse({
        customerId: "1",
        plate: " abc-123 ",
        make: "Toyota",
        model: "Corolla",
        year: "",
      }),
    ).toMatchObject({ customerId: 1, plate: "ABC-123", year: null });
  });
  it("rejects impossible years, missing owners, and invalid statuses", () => {
    expect(
      vehicleSchema.safeParse({ customerId: 0, plate: "X", make: "A", model: "B", year: 1800 })
        .success,
    ).toBe(false);
    expect(
      jobSchema.safeParse({ vehicleId: 1, description: "Repair", notes: "", status: "unknown" })
        .success,
    ).toBe(false);
  });
  it("does not silently fall back when database configuration is invalid", () => {
    expect(() => databaseConfig({ DATABASE_PROVIDER: "mysql" })).toThrow();
    expect(() => databaseConfig({ DATABASE_PROVIDER: "postgres" })).toThrow();
    expect(() =>
      databaseConfig({ DATABASE_PROVIDER: "sqlite", DATABASE_URL: "https://remote.test" }),
    ).toThrow();
    expect(databaseConfig({})).toMatchObject({ provider: "sqlite" });
  });
});
