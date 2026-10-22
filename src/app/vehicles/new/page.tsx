import { getRepository } from "@/db";
import { PageHeader } from "@/components/page-header";
import { VehicleForm } from "@/components/forms/vehicle-form";
import { EmptyState } from "@/components/empty-state";
export const metadata = { title: "New vehicle" };
export default async function NewVehiclePage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { customers } = await (await getRepository()).snapshot();
  const selected = Number((await searchParams).customerId);
  return (
    <>
      <PageHeader
        eyebrow="Vehicle details"
        title="Add a vehicle"
        description="Connect a vehicle to its customer before opening a repair job."
        back={{ href: "/vehicles", label: "Vehicles" }}
      />
      {customers.length ? (
        <VehicleForm
          customers={customers}
          customerId={customers.some((customer) => customer.id === selected) ? selected : undefined}
        />
      ) : (
        <EmptyState
          title="A customer comes first"
          description="Create the customer record, then register their vehicle."
          href="/customers/new"
          label="Add customer"
        />
      )}
    </>
  );
}
