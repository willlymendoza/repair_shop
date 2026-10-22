import Link from "next/link";
import { ArrowUpRight, CarFront } from "lucide-react";
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
export function VehicleList({ vehicles, customers }: Pick<Snapshot, "customers" | "vehicles">) {
  if (!vehicles.length)
    return (
      <EmptyState
        title="No vehicles registered yet"
        description="Register a vehicle under its customer to start tracking repairs."
        href={customers.length ? "/vehicles/new" : "/customers/new"}
        label={customers.length ? "Add a vehicle" : "Add a customer first"}
      />
    );
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-5">Vehicle</TableHead>
            <TableHead>Plate</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>
              <span className="sr-only">View vehicle</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => {
            const customer = customers.find((item) => item.id === vehicle.customerId);
            return (
              <TableRow key={vehicle.id}>
                <TableCell className="py-5 pl-5">
                  <Link
                    href={`/vehicles/${vehicle.id}`}
                    className="flex items-center gap-3 font-medium hover:underline"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                      <CarFront className="size-4" />
                    </span>
                    <span>
                      {vehicle.make} {vehicle.model}
                      <span className="mt-1 block text-xs font-normal text-muted-foreground">
                        {vehicle.year ?? "Year not recorded"}
                      </span>
                    </span>
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="rounded border bg-background px-2 py-1 font-mono text-xs font-semibold">
                    {vehicle.plate}
                  </span>
                </TableCell>
                <TableCell>
                  <Link href={`/customers/${customer?.id}`} className="hover:underline">
                    {customer?.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/vehicles/${vehicle.id}`} aria-label={`View ${vehicle.plate}`}>
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <p className="border-t px-5 py-3 text-xs text-muted-foreground">{vehicles.length} vehicles</p>
    </div>
  );
}
