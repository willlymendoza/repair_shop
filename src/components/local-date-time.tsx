"use client";

import { useSyncExternalStore } from "react";
import { formatDateTime } from "@/lib/date-time";

const subscribe = () => () => {};
const serverTimezone = () => "UTC";
const browserTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/** UTC during server rendering; the browser's timezone after hydration. */
export function LocalDateTime({ value }: { value: string }) {
  const timeZone = useSyncExternalStore(subscribe, browserTimezone, serverTimezone);
  return (
    <time dateTime={value} title={`${value} · displayed in ${timeZone}`}>
      {formatDateTime(value, timeZone)}
    </time>
  );
}
