import { describe, expect, it } from "vitest";
import { formatDateTime } from "../src/lib/date-time";

describe("UTC storage and local presentation", () => {
  const instant = "2026-10-21T01:30:00.000Z";
  it("shows the previous date in Guatemala without changing the stored instant", () => {
    const formatted = formatDateTime(instant, "America/Guatemala");
    expect(formatted).toContain("Oct 20, 2026");
    expect(formatted).toContain("7:30 PM");
    expect(instant).toBe("2026-10-21T01:30:00.000Z");
  });
  it("shows the next local day east of UTC", () => {
    expect(formatDateTime("2026-10-21T23:30:00.000Z", "Asia/Tokyo")).toContain("Oct 22, 2026");
  });
  it("respects daylight saving changes", () => {
    expect(formatDateTime("2026-03-08T06:30:00.000Z", "America/New_York")).toContain("1:30 AM");
    expect(formatDateTime("2026-03-08T07:30:00.000Z", "America/New_York")).toContain("3:30 AM");
  });
});
