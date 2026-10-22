import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepository } from "@/db";
import { routeId } from "@/lib/route-id";
import { PageHeader } from "@/components/page-header";
import { Details, Detail } from "@/components/details";
import { VehicleList } from "@/components/vehicle-list";
import { Button } from "@/components/ui/button";
export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  const { customers, vehicles } = await (await getRepository()).snapshot();
  const customer = customers.find((item) => item.id === id);
  if (!customer) notFound();
  return (
    <>
      <PageHeader
        eyebrow={`Customer #${id}`}
        title={customer.name}
        description="Contact details and registered vehicles."
        back={{ href: "/customers", label: "Customers" }}
        action={{ href: `/customers/${id}/edit`, label: "Edit customer" }}
      />
      <div className="grid items-start gap-6 xl:grid-cols-[280px_1fr]">
        <Details title="Contact">
          <Detail label="Name">{customer.name}</Detail>
          <Detail label="Phone">{customer.phone}</Detail>
        </Details>
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Vehicles</h2>
            <Button asChild variant="outline" size="sm">
              <Link href={`/vehicles/new?customerId=${id}`}>Add vehicle</Link>
            </Button>
          </div>
          <VehicleList
            customers={customers}
            vehicles={vehicles.filter((vehicle) => vehicle.customerId === id)}
          />
        </section>
      </div>
    </>
  );
}
