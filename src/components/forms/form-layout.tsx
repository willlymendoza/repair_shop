"use client";
import Link from "next/link";
import { LoaderCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { ActionState } from "@/lib/action-state";

export const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-50";
export function Field({
  name,
  label,
  required,
  errors,
  children,
  hint,
}: {
  name: string;
  label: string;
  required?: boolean;
  errors?: string[];
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-primary">
            *
          </span>
        )}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {errors && (
        <p id={`${name}-error`} role="alert" className="text-xs text-destructive">
          {errors.join(" ")}
        </p>
      )}
    </div>
  );
}
export function fieldAccessibility(name: string, state: ActionState) {
  return {
    "aria-invalid": !!state.errors?.[name],
    "aria-describedby": state.errors?.[name] ? `${name}-error` : undefined,
  };
}
export function FormLayout({
  action,
  state,
  pending,
  cancel,
  children,
  editing,
}: {
  action: (data: FormData) => void;
  state: ActionState;
  pending: boolean;
  cancel: string;
  children: React.ReactNode;
  editing: boolean;
}) {
  return (
    <Card className="max-w-2xl shadow-none">
      <CardContent className="p-6 md:p-8">
        <form action={action} noValidate className="space-y-6">
          <p className="text-xs text-muted-foreground">
            Fields marked <span className="text-primary">*</span> are required.
          </p>
          {state.message && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/20 bg-red-50 p-3 text-sm text-destructive"
            >
              {state.message}
            </div>
          )}
          <fieldset disabled={pending} className="space-y-5 disabled:opacity-70">
            {children}
          </fieldset>
          <div className="flex justify-end gap-3 border-t pt-5">
            <Button asChild variant="outline">
              <Link href={cancel}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {pending ? "Saving…" : editing ? "Save changes" : "Create record"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
