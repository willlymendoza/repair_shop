import Link from "next/link";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
export function EmptyState({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed bg-card px-6 py-16 text-center">
      <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-secondary">
        <Wrench className="size-5 text-muted-foreground" />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {href && (
        <Button asChild className="mt-6">
          <Link href={href}>{label}</Link>
        </Button>
      )}
    </div>
  );
}
