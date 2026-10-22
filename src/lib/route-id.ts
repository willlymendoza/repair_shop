import { notFound } from "next/navigation";
export function routeId(value: string) {
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) notFound();
  return Number(value);
}
