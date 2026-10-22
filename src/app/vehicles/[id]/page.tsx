import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepository } from "@/db";
import { routeId } from "@/lib/route-id";
import { PageHeader } from "@/components/page-header";
import { Details, Detail } from "@/components/details";
import { Button } from "@/components/ui/button";
export default async function VehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  const { customers, vehicles } = await (await getRepository()).snapshot();
  const vehicle = vehicles.find((item) => item.id === id);
  if (!vehicle) notFound();
  const customer = customers.find((item) => item.id === vehicle.customerId)!;
  return (
    <>
      <PageHeader
        eyebrow={vehicle.plate}
        title={`${vehicle.make} ${vehicle.model}`}
        description="Vehicle details, ready when the next repair comes in."
        back={{ href: "/vehicles", label: "Vehicles" }}
        action={{ href: `/vehicles/${id}/edit`, label: "Edit vehicle" }}
      />
      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        <Details title="Vehicle">
          <Detail label="License plate">{vehicle.plate}</Detail>
          <Detail label="Make">{vehicle.make}</Detail>
          <Detail label="Model">{vehicle.model}</Detail>
          <Detail label="Year">{vehicle.year}</Detail>
        </Details>
        <div className="space-y-6">
          <Details title="Customer">
            <Detail label="Name">
              <Link href={`/customers/${customer.id}`} className="text-primary hover:underline">
                {customer.name}
              </Link>
            </Detail>
            <Detail label="Phone">{customer.phone}</Detail>
          </Details>
          <Button asChild>
            <Link href={`/jobs/new?vehicleId=${id}`}>Open a repair job</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
