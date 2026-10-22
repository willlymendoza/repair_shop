import { Badge } from "@/components/ui/badge";
import { statusLabels, type JobStatus } from "@/lib/domain";
import { cn } from "@/lib/utils";
export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-medium", {
        "border-amber-200 bg-amber-50 text-amber-800": status === "open",
        "border-blue-200 bg-blue-50 text-blue-700": status === "in_progress",
        "border-emerald-200 bg-emerald-50 text-emerald-700": status === "completed",
      })}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </Badge>
  );
}
