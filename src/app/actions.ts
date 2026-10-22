"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { getRepository } from "@/db";
import { RecordError } from "@/db/repository";
import { recordId } from "@/lib/validation";
import type { ActionState } from "@/lib/action-state";

type Kind = "customers" | "vehicles" | "jobs";
async function save(kind: Kind, data: FormData): Promise<ActionState> {
  const values = Object.fromEntries(
    [...data.entries()].filter(([key, value]) => !key.startsWith("$") && typeof value === "string"),
  ) as Record<string, string>;
  let destination: string;
  try {
    const id = values.id ? recordId.parse(values.id) : undefined;
    const repository = await getRepository();
    let savedId: number;
    if (kind === "customers") savedId = await repository.saveCustomer(values, id);
    else if (kind === "vehicles") savedId = await repository.saveVehicle(values, id);
    else savedId = await repository.saveJob(values, id);
    destination = `/${kind}/${savedId}`;
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string[]> = {};
      for (const issue of error.issues) (errors[String(issue.path[0])] ??= []).push(issue.message);
      return { errors, values, message: "Check the highlighted fields and try again." };
    }
    if (error instanceof RecordError) return { values, message: error.message };
    // Driver errors can contain SQL parameters or connection credentials.
    console.error(`Failed to save ${kind}`);
    return {
      values,
      message: "We couldn't save your changes. Please try again.",
    };
  }
  revalidatePath("/", "layout");
  redirect(destination);
}
export async function saveCustomer(_previous: ActionState, data: FormData) {
  return save("customers", data);
}
export async function saveVehicle(_previous: ActionState, data: FormData) {
  return save("vehicles", data);
}
export async function saveJob(_previous: ActionState, data: FormData) {
  return save("jobs", data);
}
