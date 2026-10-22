/** Database timestamps are ISO-8601 UTC instants, never local wall-clock strings. */
export function formatDateTime(isoUtc: string, timeZone: string, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone,
  }).format(new Date(isoUtc));
}
