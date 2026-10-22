import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test("customer → vehicle → repair → complete → reopen, including validation and persistence", async ({
  page,
}) => {
  faker.seed(2026);
  const customerName = faker.person.fullName();
  const customerPhone = faker.phone.number();
  await page.goto("/customers/new");
  await page.getByLabel("Phone number").fill(customerPhone);
  await page.getByRole("button", { name: "Create record" }).click();
  await expect(page.getByText("Name is required.")).toBeVisible();
  await expect(page.getByLabel("Phone number")).toHaveValue(customerPhone);
  await page.getByLabel("Full name").fill(customerName);
  await page.getByLabel("Phone number").fill(customerPhone);
  await page.getByRole("button", { name: "Create record" }).click();
  await expect(page.getByRole("heading", { name: customerName, exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Add vehicle", exact: true }).click();
  await page.getByLabel("License plate").fill("test-123");
  await page.getByRole("textbox", { name: "Make", exact: true }).fill("Toyota");
  await page.getByRole("textbox", { name: "Model", exact: true }).fill("Corolla");
  await page.getByLabel("Model year").fill("2020");
  await page.getByRole("button", { name: "Create record" }).click();
  await expect(page.getByRole("heading", { name: "Toyota Corolla" })).toBeVisible();
  await page.getByRole("link", { name: "Open a repair job" }).click();
  await page.getByLabel("Reported problem").fill("Brake noise on downhill roads");
  await page.getByRole("button", { name: "Create record" }).click();
  await expect(page.getByRole("heading", { name: /JOB-/ })).toBeVisible();
  const jobUrl = page.url();
  await page.getByRole("link", { name: "Edit job" }).click();
  await page.getByLabel("Job status").selectOption("completed");
  await page.getByLabel("Workshop notes").fill("Replaced brake pads.");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Completed", { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("Replaced brake pads.")).toBeVisible();
  const timestamp = page.locator("time").first();
  await expect(timestamp).toHaveAttribute("datetime", /Z$/);
  await expect(timestamp).toHaveAttribute("title", /America\/Guatemala/);
  await page.getByRole("link", { name: "Edit job" }).click();
  await page.getByLabel("Job status").selectOption("open");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Open", { exact: true })).toBeVisible();
  await page.goto("/");
  await page.getByRole("textbox", { name: "Search repair jobs" }).fill("TEST-123");
  await expect(page.getByText("Brake noise on downhill roads")).toBeVisible();
  await page.getByRole("button", { name: "Completed", exact: true }).click();
  await expect(page.getByText("No jobs match these filters.")).toBeVisible();
  await page.getByRole("button", { name: "All jobs", exact: true }).click();
  await page.screenshot({ path: "test-results/workshop-desktop.png", fullPage: true });
  await page.goto(jobUrl);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { name: /JOB-/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: "test-results/workshop-mobile.png", fullPage: true });
});
