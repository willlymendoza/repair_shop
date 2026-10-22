import { EmptyState } from "@/components/empty-state";
export default function NotFound() {
  return (
    <EmptyState
      title="Record not found"
      description="This record doesn’t exist. Return to the workshop to find what you need."
      href="/"
      label="Back to repair jobs"
    />
  );
}
