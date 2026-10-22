import "server-only";
import { connectDatabase } from "./connect";
import { ShopRepository } from "./repository";

const globalDb = globalThis as typeof globalThis & {
  repairShopConnection?: ReturnType<typeof connectDatabase>;
};
export async function getRepository() {
  globalDb.repairShopConnection ??= connectDatabase().catch((error) => {
    globalDb.repairShopConnection = undefined;
    throw error;
  });
  return new ShopRepository((await globalDb.repairShopConnection).store);
}
