import { PageHeader } from "@/components/page-header";
import { CustomerForm } from "@/components/forms/customer-form";
export const metadata = { title: "New customer" };
export default function NewCustomerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Customer details"
        title="Add a customer"
        description="Start with the basics. Their vehicles come next."
        back={{ href: "/customers", label: "Customers" }}
      />
      <CustomerForm />
    </>
  );
}
