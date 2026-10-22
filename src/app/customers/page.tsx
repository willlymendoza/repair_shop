import { getRepository } from "@/db";
import { PageHeader } from "@/components/page-header";
import { CustomerList } from "@/components/customer-list";
export const metadata = { title: "Customers" };
export default async function CustomersPage() {
  const snapshot = await (await getRepository()).snapshot();
  return (
    <>
      <PageHeader
        eyebrow="The people behind the wheel"
        title="Customers"
        description="A familiar face, a phone number, and their vehicles. All together."
        action={{ href: "/customers/new", label: "Add customer" }}
      />
      <CustomerList {...snapshot} />
    </>
  );
}
