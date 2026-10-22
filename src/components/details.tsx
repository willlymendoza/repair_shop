import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function Details({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-5">{children}</dl>
      </CardContent>
    </Card>
  );
}
export function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="mb-1 text-xs text-muted-foreground">{label}</dt>
      <dd className="whitespace-pre-wrap break-words text-sm font-medium">{children || "—"}</dd>
    </div>
  );
}
