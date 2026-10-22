import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepository } from "@/db";
import { routeId } from "@/lib/route-id";
import { jobNumber } from "@/lib/domain";
import { PageHeader } from "@/components/page-header";
import { Details, Detail } from "@/components/details";
import { StatusBadge } from "@/components/status-badge";
import { LocalDateTime } from "@/components/local-date-time";
export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  const { jobs, customers, vehicles } = await (await getRepository()).snapshot();
  const job = jobs.find((item) => item.id === id);
  if (!job) notFound();
  const vehicle = vehicles.find((item) => item.id === job.vehicleId)!;
  const customer = customers.find((item) => item.id === vehicle.customerId)!;
  return (
    <>
      <PageHeader
        eyebrow="Repair job"
        title={jobNumber(id)}
        description={`${vehicle.plate} · ${vehicle.make} ${vehicle.model}`}
        back={{ href: "/", label: "Repair jobs" }}
        action={{ href: `/jobs/${id}/edit`, label: "Edit job" }}
      />
      <div className="grid items-start gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Details title="The repair">
            <Detail label="Status">
              <StatusBadge status={job.status} />
            </Detail>
            <Detail label="Reported problem">{job.description}</Detail>
            <Detail label="Workshop notes">{job.notes}</Detail>
          </Details>
          <Details title="Job dates">
            <Detail label="Created">
              <LocalDateTime value={job.createdAt} />
            </Detail>
            <Detail label="Last updated">
              <LocalDateTime value={job.updatedAt} />
            </Detail>
            {job.completedAt && (
              <Detail label="Completed">
                <LocalDateTime value={job.completedAt} />
              </Detail>
            )}
          </Details>
        </div>
        <Details title="Vehicle & customer">
          <Detail label="Vehicle">
            <Link href={`/vehicles/${vehicle.id}`} className="text-primary hover:underline">
              {vehicle.make} {vehicle.model} · {vehicle.plate}
            </Link>
          </Detail>
          <Detail label="Customer">
            <Link href={`/customers/${customer.id}`} className="text-primary hover:underline">
              {customer.name}
            </Link>
          </Detail>
          <Detail label="Phone">{customer.phone}</Detail>
        </Details>
      </div>
    </>
  );
}
