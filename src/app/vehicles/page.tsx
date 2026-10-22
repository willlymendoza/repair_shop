import { getRepository } from "@/db";
import { PageHeader } from "@/components/page-header";
import { VehicleList } from "@/components/vehicle-list";
export const metadata = { title: "Vehicles" };
export default async function VehiclesPage() {
  const snapshot = await (await getRepository()).snapshot();
  return (
    <>
      <PageHeader
        eyebrow="Under the hood"
        title="Vehicles"
        description="The right details for every vehicle that comes through your doors."
        action={{ href: "/vehicles/new", label: "Add vehicle" }}
      />
      <VehicleList {...snapshot} />
    </>
  );
}
