import { getRepository } from "@/db";
import { PageHeader } from "@/components/page-header";
import { JobList } from "@/components/job-list";
export default async function JobsPage() {
  const snapshot = await (await getRepository()).snapshot();
  return (
    <>
      <PageHeader
        eyebrow="The workshop floor"
        title="Repair jobs"
        description="Every vehicle. Every repair. A little more in order."
        action={{ href: "/jobs/new", label: "New repair job" }}
      />
      <JobList {...snapshot} />
    </>
  );
}
