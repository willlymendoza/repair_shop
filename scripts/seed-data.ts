import { randomInt } from "node:crypto";
import { Faker, en } from "@faker-js/faker";
import { ShopRepository } from "../src/db/repository";
import type { Store } from "../src/db/store";
import type { JobStatus } from "../src/lib/domain";

/** Replace records atomically. Explicit seeds are available for isolated tests. */
export async function seedDatabase(store: Store, seed = randomInt(0, 2 ** 32)) {
  const faker = new Faker({ locale: en });
  faker.seed(seed);
  await store.transaction(async (transaction) => {
    await transaction.clearData();
    const shop = new ShopRepository(transaction);
    const cars = [
      ["Toyota", "Corolla"],
      ["Honda", "Civic"],
      ["Ford", "Ranger"],
      ["Mazda", "CX-5"],
      ["Volkswagen", "Golf"],
      ["Hyundai", "Tucson"],
    ];
    const problems = [
      "Brake noise when slowing down",
      "Oil change and filter replacement",
      "Engine warning light is on",
      "Air conditioning blowing warm",
      "Vibration at highway speed",
      "Battery loses charge overnight",
    ];
    for (let index = 0; index < 12; index++) {
      const customerId = await shop.saveCustomer({
        name: faker.person.fullName(),
        phone: faker.phone.number(),
      });
      const [make, model] = faker.helpers.arrayElement(cars);
      const vehicleId = await shop.saveVehicle({
        customerId,
        plate: faker.string.alphanumeric({ length: 7, casing: "upper" }),
        make,
        model,
        year: faker.number.int({ min: 2010, max: new Date().getUTCFullYear() }),
      });
      if (index < 10) {
        const status: JobStatus = index < 4 ? "open" : index < 8 ? "in_progress" : "completed";
        await shop.saveJob({
          vehicleId,
          description: faker.helpers.arrayElement(problems),
          notes: index % 2 ? "Customer would like a call before any additional work." : "",
          status,
        });
      }
    }
  });
  return { customers: 12, vehicles: 12, jobs: 10, seed };
}
