import Link from "next/link";
import { ArrowUpRight, UsersRound } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "./empty-state";
import type { Snapshot } from "@/lib/domain";
export function CustomerList({ customers, vehicles }: Pick<Snapshot, "customers" | "vehicles">) {
  if (!customers.length)
    return (
      <EmptyState
        title="Make room for your first customer"
        description="Keep customer details connected to their vehicles and repair jobs."
        href="/customers/new"
        label="Add a customer"
      />
    );
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-5">Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Vehicles</TableHead>
            <TableHead>
              <span className="sr-only">View customer</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="py-5 pl-5">
                <Link
                  href={`/customers/${customer.id}`}
                  className="flex items-center gap-3 font-medium hover:underline"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <UsersRound className="size-4" />
                  </span>
                  {customer.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{customer.phone || "—"}</TableCell>
              <TableCell>
                {vehicles.filter((vehicle) => vehicle.customerId === customer.id).length}
              </TableCell>
              <TableCell>
                <Link href={`/customers/${customer.id}`} aria-label={`View ${customer.name}`}>
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="border-t px-5 py-3 text-xs text-muted-foreground">
        {customers.length} customers
      </p>
    </div>
  );
}
