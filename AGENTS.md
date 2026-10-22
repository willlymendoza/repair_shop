# repair_shop conventions

- Use Node.js 22.13+ within Node 22. Install with `pnpm install --frozen-lockfile`; preserve exact versions and the lockfile.
- Keep the base focused on customers, vehicles, and repair jobs. No authentication, file handling,
  appointments, or additional workflows unless requested. Future appointments use forms and lists,
  never a calendar grid.
- Use App Router Server Components for reads and Server Actions for writes. Keep database access
  server-side. Validate mutations with the shared Zod schemas.
- Support SQLite and PostgreSQL explicitly. Update both schemas and generate both migration sets
  for schema changes. Do not silently fall back between providers.
- Store timestamp instants as UTC ISO strings ending in `Z`. Render them through `LocalDateTime`
  so the browser timezone is applied after hydration. Do not store local formatted timestamps.
- Use shadcn/ui and Tailwind; preserve component license notices. Keep resources bundled locally.
- Keep UI copy focused on workshop tasks. Do not display implementation details such as
  single-user/local workspace labels, database providers, or setup commands; keep those in documentation.
- Prettier owns formatting (`pnpm run format`). Check `pnpm test`, `pnpm run typecheck`,
  `pnpm run lint`, and `pnpm run format:check`. Use `pnpm run build` for integration changes.
- The explicit seed command replaces all customers, vehicles, and repair jobs with fresh Faker
  data in one transaction. Never run it automatically or reset the user's database to run tests.
  PostgreSQL tests require a dedicated `TEST_POSTGRES_URL`.
- Never commit personal/customer data, credentials, machine-specific paths, local databases,
  environment files, logs, or browser artifacts. Generate personal-looking seed and test values
  with Faker instead of hardcoding names, phone numbers, emails, or addresses. Public car brands
  and models may be hardcoded. Never log raw driver errors, connection strings, or submitted form values.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
