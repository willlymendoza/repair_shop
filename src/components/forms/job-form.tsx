"use client";
import { useActionState } from "react";
import { saveJob } from "@/app/actions";
import { Textarea } from "@/components/ui/textarea";
import { Field, fieldAccessibility, FormLayout, selectClassName } from "./form-layout";
import {
  jobStatuses,
  statusLabels,
  type Customer,
  type RepairJob,
  type Vehicle,
} from "@/lib/domain";
import type { ActionState } from "@/lib/action-state";

export function JobForm({
  job,
  vehicles,
  customers,
  vehicleId,
}: {
  job?: RepairJob;
  vehicles: Vehicle[];
  customers: Customer[];
  vehicleId?: number;
}) {
  const [state, action, pending] = useActionState(saveJob, {} as ActionState);
  return (
    <FormLayout
      action={action}
      state={state}
      pending={pending}
      cancel={job ? `/jobs/${job.id}` : "/"}
      editing={!!job}
    >
      {job && <input type="hidden" name="id" value={job.id} />}
      <Field name="vehicleId" label="Vehicle" required errors={state.errors?.vehicleId}>
        <select
          id="vehicleId"
          name="vehicleId"
          required
          className={selectClassName}
          defaultValue={state.values?.vehicleId ?? job?.vehicleId ?? vehicleId ?? ""}
          {...fieldAccessibility("vehicleId", state)}
        >
          <option value="">Choose a vehicle</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.plate} · {vehicle.make} {vehicle.model} ·{" "}
              {customers.find((customer) => customer.id === vehicle.customerId)?.name}
            </option>
          ))}
        </select>
      </Field>
      <Field
        name="description"
        label="Reported problem"
        required
        errors={state.errors?.description}
      >
        <Textarea
          id="description"
          name="description"
          required
          rows={3}
          maxLength={2000}
          defaultValue={state.values?.description ?? job?.description ?? ""}
          placeholder="Describe what needs attention…"
          {...fieldAccessibility("description", state)}
        />
      </Field>
      <Field
        name="status"
        label="Job status"
        required
        errors={state.errors?.status}
        hint="Completed jobs can be reopened by changing their status."
      >
        <select
          id="status"
          name="status"
          className={selectClassName}
          defaultValue={state.values?.status ?? job?.status ?? "open"}
          {...fieldAccessibility("status", state)}
        >
          {jobStatuses.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </Field>
      <Field
        name="notes"
        label="Workshop notes"
        errors={state.errors?.notes}
        hint="Optional. Record observations and work carried out."
      >
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          maxLength={10000}
          defaultValue={state.values?.notes ?? job?.notes ?? ""}
          placeholder="Add useful details for this repair…"
          {...fieldAccessibility("notes", state)}
        />
      </Field>
    </FormLayout>
  );
}
