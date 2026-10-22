"use client";
import { useActionState } from "react";
import { saveCustomer } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Field, fieldAccessibility, FormLayout } from "./form-layout";
import type { Customer } from "@/lib/domain";
import type { ActionState } from "@/lib/action-state";

export function CustomerForm({ customer }: { customer?: Customer }) {
  const [state, action, pending] = useActionState(saveCustomer, {} as ActionState);
  return (
    <FormLayout
      action={action}
      state={state}
      pending={pending}
      cancel={customer ? `/customers/${customer.id}` : "/customers"}
      editing={!!customer}
    >
      {customer && <input type="hidden" name="id" value={customer.id} />}
      <Field name="name" label="Full name" required errors={state.errors?.name}>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          maxLength={120}
          required
          defaultValue={state.values?.name ?? customer?.name ?? ""}
          placeholder="Customer name"
          {...fieldAccessibility("name", state)}
        />
      </Field>
      <Field
        name="phone"
        label="Phone number"
        errors={state.errors?.phone}
        hint="Optional. Include an area or country code if useful."
      >
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={60}
          defaultValue={state.values?.phone ?? customer?.phone ?? ""}
          placeholder="Include an area or country code"
          {...fieldAccessibility("phone", state)}
        />
      </Field>
    </FormLayout>
  );
}
