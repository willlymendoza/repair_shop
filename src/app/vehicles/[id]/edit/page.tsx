import { notFound } from "next/navigation";
import { getRepository } from "@/db";
import { routeId } from "@/lib/route-id";
import { PageHeader } from "@/components/page-header";
import { VehicleForm } from "@/components/forms/vehicle-form";
export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  const { vehicles, customers } = await (await getRepository()).snapshot();
  const vehicle = vehicles.find((item) => item.id === id);
  if (!vehicle) notFound();
  return (
    <>
      <PageHeader
        eyebrow="Vehicle details"
        title="Edit vehicle"
        description="Update the vehicle record or its customer."
        back={{ href: `/vehicles/${id}`, label: vehicle.plate }}
      />
      <VehicleForm customers={customers} vehicle={vehicle} />
    </>
  );
}
