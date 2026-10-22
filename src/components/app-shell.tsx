"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CarFront, ClipboardList, UsersRound, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Repair jobs", icon: ClipboardList, match: "/jobs" },
  { href: "/customers", label: "Customers", icon: UsersRound, match: "/customers" },
  { href: "/vehicles", label: "Vehicles", icon: CarFront, match: "/vehicles" },
];
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="sidebar flex flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64">
        <Link href="/" className="flex items-center gap-3 px-6 py-7" aria-label="repair_shop home">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wrench className="size-5" />
          </span>
          <span className="text-xl font-bold tracking-tight text-white">
            repair<span className="text-primary">_</span>shop
          </span>
        </Link>
        <p className="hidden px-6 pb-3 text-[10px] font-semibold tracking-[.2em] text-zinc-500 lg:block">
          WORKSHOP
        </p>
        <nav aria-label="Main navigation" className="flex gap-1 px-3 pb-4 lg:flex-col">
          {links.map(({ href, label, icon: Icon, match }) => {
            const active = pathname === href || pathname.startsWith(match);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-1 items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-white/5 hover:text-white",
                  active ? "bg-white/10 text-white" : "text-zinc-400",
                )}
              >
                <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
                <span>{label}</span>
                {active && (
                  <span className="ml-auto hidden size-1.5 rounded-full bg-primary lg:block" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden px-5 pb-6 lg:block">
          <div className="rounded-xl border border-white/10 bg-white/[.03] p-4">
            <Wrench className="mb-3 size-5 text-primary" />
            <p className="text-sm font-medium text-zinc-200">Good work starts here.</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              A clear view of every vehicle and every repair.
            </p>
          </div>
        </div>
      </aside>
      <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-5 md:px-10">
        <span className="text-xs font-medium text-muted-foreground">
          WORKSHOP /{" "}
          <span className="text-foreground">
            {pathname.startsWith("/customers")
              ? "CUSTOMERS"
              : pathname.startsWith("/vehicles")
                ? "VEHICLES"
                : "REPAIR JOBS"}
          </span>
        </span>
      </header>
      <main id="main" className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-10">
        {children}
      </main>
    </div>
  );
}
