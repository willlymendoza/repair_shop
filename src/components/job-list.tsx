"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCheck, CircleDot, Search, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";
import { jobNumber, jobStatuses, statusLabels, type Snapshot, type JobStatus } from "@/lib/domain";

export function JobList({ jobs, vehicles, customers }: Snapshot) {
  const [status, setStatus] = useState<JobStatus | "all">("all");
  const [query, setQuery] = useState("");
  const vehicleMap = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));
  const customerMap = new Map(customers.map((customer) => [customer.id, customer]));
  const filtered = jobs.filter((job) => {
    const vehicle = vehicleMap.get(job.vehicleId);
    const customer = vehicle && customerMap.get(vehicle.customerId);
    return (
      (status === "all" || job.status === status) &&
      [
        jobNumber(job.id),
        job.description,
        vehicle?.plate,
        vehicle?.make,
        vehicle?.model,
        customer?.name,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase())
    );
  });
  const counts = jobStatuses.map((value) => jobs.filter((job) => job.status === value).length);
  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {jobStatuses.map((value, index) => {
          const Icon = [CircleDot, Wrench, CheckCheck][index];
          return (
            <div key={value} className="flex items-center gap-4 rounded-xl border bg-card p-5">
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg",
                  index === 0
                    ? "bg-amber-50 text-amber-700"
                    : index === 1
                      ? "bg-blue-50 text-blue-700"
                      : "bg-emerald-50 text-emerald-700",
                )}
              >
                <Icon className="size-4" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">{statusLabels[value]}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{counts[index]}</p>
              </div>
              <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">
                Jobs
              </span>
            </div>
          );
        })}
      </div>
      {jobs.length === 0 ? (
        <EmptyState
          title="Your first repair starts here"
          description="Add a customer and their vehicle, then open a repair job to track the work."
          href={
            vehicles.length ? "/jobs/new" : customers.length ? "/vehicles/new" : "/customers/new"
          }
          label={
            vehicles.length
              ? "Create repair job"
              : customers.length
                ? "Add a vehicle"
                : "Add your first customer"
          }
        />
      ) : (
        <section className="overflow-hidden rounded-xl border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4">
            <div className="flex flex-wrap gap-1" aria-label="Filter jobs by status">
              {(["all", ...jobStatuses] as const).map((value) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={status === value}
                  onClick={() => setStatus(value)}
                  className={cn(
                    "rounded-md px-3 py-2 text-xs font-medium transition-colors",
                    status === value
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60",
                  )}
                >
                  {value === "all" ? "All jobs" : statusLabels[value]}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                aria-label="Search repair jobs"
                placeholder="Search jobs, plates, customers…"
                className="pl-9 text-xs"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-5">Job / reported problem</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">View job</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((job) => {
                const vehicle = vehicleMap.get(job.vehicleId);
                const customer = vehicle && customerMap.get(vehicle.customerId);
                return (
                  <TableRow key={job.id}>
                    <TableCell className="max-w-80 py-5 pl-5">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-mono text-[11px] font-semibold tracking-wide text-primary hover:underline"
                      >
                        {jobNumber(job.id)}
                      </Link>
                      <p className="mt-1.5 truncate text-sm font-medium">{job.description}</p>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/vehicles/${vehicle?.id}`}
                        className="text-xs font-semibold hover:underline"
                      >
                        {vehicle?.plate}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {vehicle?.make} {vehicle?.model}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Link href={`/customers/${customer?.id}`} className="text-xs hover:underline">
                        {customer?.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={job.status} />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/jobs/${job.id}`}
                        aria-label={`View ${jobNumber(job.id)}`}
                        className="inline-flex rounded-md border p-2 text-muted-foreground hover:bg-secondary"
                      >
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="p-10 text-center text-sm text-muted-foreground">
              No jobs match these filters.
            </p>
          )}
          <div className="border-t px-5 py-3 text-xs text-muted-foreground">
            Showing {filtered.length} of {jobs.length} repair jobs
          </div>
        </section>
      )}
    </>
  );
}
