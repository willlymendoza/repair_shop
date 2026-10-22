"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <section className="mx-auto max-w-lg rounded-xl border bg-card p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
        Something went wrong
      </p>
      <h1 className="mt-3 text-2xl font-semibold">We couldn’t load your records.</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Please try again in a moment. If the problem continues, contact the person who maintains the
        application.
      </p>
      <Button onClick={retry} className="mt-6">
        Try again
      </Button>
    </section>
  );
}
