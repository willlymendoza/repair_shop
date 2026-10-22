import { getRepository } from "@/db";
import { PageHeader } from "@/components/page-header";
import { JobForm } from "@/components/forms/job-form";
import { EmptyState } from "@/components/empty-state";
export const metadata = { title: "New repair job" };
export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicleId?: string }>;
}) {
  const { customers, vehicles } = await (await getRepository()).snapshot();
  const selected = Number((await searchParams).vehicleId);
  return (
    <>
      <PageHeader
        eyebrow="On the workshop floor"
        title="New repair job"
        description="Choose a vehicle and tell us what needs attention."
        back={{ href: "/", label: "Repair jobs" }}
      />
      {vehicles.length ? (
        <JobForm
          customers={customers}
          vehicles={vehicles}
          vehicleId={vehicles.some((vehicle) => vehicle.id === selected) ? selected : undefined}
        />
      ) : (
        <EmptyState
          title="Register a vehicle first"
          description="Repair jobs belong to vehicles. Add a customer and vehicle to get started."
          href={customers.length ? "/vehicles/new" : "/customers/new"}
          label={customers.length ? "Add vehicle" : "Add customer"}
        />
      )}
    </>
  );
}
