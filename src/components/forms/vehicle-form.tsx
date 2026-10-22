"use client";
import { useActionState } from "react";
import { saveVehicle } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Field, fieldAccessibility, FormLayout, selectClassName } from "./form-layout";
import type { Customer, Vehicle } from "@/lib/domain";
import type { ActionState } from "@/lib/action-state";

export function VehicleForm({
  vehicle,
  customers,
  customerId,
}: {
  vehicle?: Vehicle;
  customers: Customer[];
  customerId?: number;
}) {
  const [state, action, pending] = useActionState(saveVehicle, {} as ActionState);
  return (
    <FormLayout
      action={action}
      state={state}
      pending={pending}
      cancel={vehicle ? `/vehicles/${vehicle.id}` : "/vehicles"}
      editing={!!vehicle}
    >
      {vehicle && <input type="hidden" name="id" value={vehicle.id} />}
      <Field name="customerId" label="Customer" required errors={state.errors?.customerId}>
        <select
          id="customerId"
          name="customerId"
          required
          className={selectClassName}
          defaultValue={state.values?.customerId ?? vehicle?.customerId ?? customerId ?? ""}
          {...fieldAccessibility("customerId", state)}
        >
          <option value="">Choose a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} · #{customer.id}
            </option>
          ))}
        </select>
      </Field>
      <Field name="plate" label="License plate" required errors={state.errors?.plate}>
        <Input
          id="plate"
          name="plate"
          required
          maxLength={30}
          className="uppercase"
          defaultValue={state.values?.plate ?? vehicle?.plate ?? ""}
          placeholder="e.g. ABC-123"
          {...fieldAccessibility("plate", state)}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        {(
          [
            ["make", "Make", "Toyota", 60],
            ["model", "Model", "Corolla", 80],
          ] as const
        ).map(([name, label, placeholder, max]) => (
          <Field key={name} name={name} label={label} required errors={state.errors?.[name]}>
            <Input
              id={name}
              name={name}
              required
              maxLength={max}
              defaultValue={state.values?.[name] ?? vehicle?.[name] ?? ""}
              placeholder={placeholder}
              {...fieldAccessibility(name, state)}
            />
          </Field>
        ))}
      </div>
      <Field name="year" label="Model year" errors={state.errors?.year} hint="Optional.">
        <Input
          id="year"
          name="year"
          type="number"
          min={1886}
          max={new Date().getFullYear() + 2}
          defaultValue={state.values?.year ?? vehicle?.year ?? ""}
          placeholder="e.g. 2020"
          {...fieldAccessibility("year", state)}
        />
      </Field>
    </FormLayout>
  );
}
