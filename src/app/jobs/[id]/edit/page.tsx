import { notFound } from "next/navigation";
import { getRepository } from "@/db";
import { routeId } from "@/lib/route-id";
import { jobNumber } from "@/lib/domain";
import { PageHeader } from "@/components/page-header";
import { JobForm } from "@/components/forms/job-form";
export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  const { jobs, customers, vehicles } = await (await getRepository()).snapshot();
  const job = jobs.find((item) => item.id === id);
  if (!job) notFound();
  return (
    <>
      <PageHeader
        eyebrow={jobNumber(id)}
        title="Edit repair job"
        description="Update the problem, record your work, or change the job status."
        back={{ href: `/jobs/${id}`, label: jobNumber(id) }}
      />
      <JobForm job={job} customers={customers} vehicles={vehicles} />
    </>
  );
}
