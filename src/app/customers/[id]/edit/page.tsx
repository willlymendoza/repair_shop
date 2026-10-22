import { notFound } from "next/navigation";
import { getRepository } from "@/db";
import { routeId } from "@/lib/route-id";
import { PageHeader } from "@/components/page-header";
import { CustomerForm } from "@/components/forms/customer-form";
export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  const customer = (await (await getRepository()).snapshot()).customers.find(
    (item) => item.id === id,
  );
  if (!customer) notFound();
  return (
    <>
      <PageHeader
        eyebrow="Customer details"
        title="Edit customer"
        description="Keep their contact information up to date."
        back={{ href: `/customers/${id}`, label: customer.name }}
      />
      <CustomerForm customer={customer} />
    </>
  );
}
