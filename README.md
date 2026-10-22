# repair_shop

A single-user workshop application built with Next.js App Router, TypeScript,
shadcn/ui, Tailwind CSS, and Drizzle ORM. SQLite is the default database;
PostgreSQL is an explicit alternative. No separate API application is required.

## Requirements

- Node.js **22.13 or newer within Node 22** (`.nvmrc` selects Node 22).
- pnpm **10.17.1**, pinned in `packageManager`, and the committed `pnpm-lock.yaml`.
  Dependency versions are pinned. Corepack can select the declared pnpm release.
- PostgreSQL only if choosing the PostgreSQL provider.

## Start locally

Run all commands from this directory:

```sh
pnpm install --frozen-lockfile
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

Open <http://localhost:3000>. Seeding is optional; skip it to start empty.
SQLite defaults to `data/repair_shop.db` without an environment file. Paths are
relative to the project directory. Copy `.env.example` to `.env.local` to customize.
The app never seeds or resets a database on startup.

## Included workflows

- Create and edit customers (name required, phone optional).
- Create and edit vehicles linked to customers (plate, make, model required;
  model year optional).
- Create and edit repair jobs linked to vehicles; record the reported problem
  and workshop notes.
- Open, In progress, and Completed statuses. Completed jobs can be reopened.
- Search repair jobs and filter by status. View related customer/vehicle details.
- Loading, empty, not-found, and database-error states; responsive layouts.

No authentication, deletion, uploads, exports, appointments, calendar UI,
mechanics, estimates, payments, or external API integrations are included.
This is a trusted local, single-user application. It is not configured for public
multi-user hosting. Local data belongs to the selected database, not a browser profile.

## Database providers

SQLite uses Drizzle's libSQL driver against a local SQLite file. PostgreSQL uses
the `postgres` driver. Both implement the same small `Store` interface and share
validation/domain types. Their schemas and generated migrations are separate.

For PostgreSQL, create an empty database and set these in `.env.local`:

```dotenv
DATABASE_PROVIDER=postgres
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/repair_shop
```

Then run `pnpm run db:migrate` and optionally `pnpm run db:seed`. Selecting a provider
does not transfer existing records or silently fall back to another database.
Restart the Next.js process after changing providers or connection settings.

After schema changes, generate migrations for each provider with the matching
environment configuration, then run migrations. Commit both SQL and metadata.

```sh
pnpm run db:generate
pnpm run db:migrate
```

**`pnpm run db:seed` deletes all existing customers, vehicles, and repair jobs in the
configured database and replaces them with 12 customers, 12 vehicles, and 10 jobs.**
This includes manually entered records. Each run uses a fresh random Faker seed,
printed in the console. It also works on an empty database after migrations.
Deletion and insertion run in one transaction; a failed run restores the previous
records. Tables and migration history are retained. Record ID sequences are not reset.

## Dates and timezones

All persisted timestamps are ISO-8601 UTC strings ending in `Z`, in both databases.
Created and updated times come from the server. Completion time is preserved when
editing a completed job and cleared when reopening it. The browser automatically
formats timestamps using its current timezone, including daylight saving rules.
Server rendering uses UTC, then hydrates to local time without a hydration mismatch.
Model year is a plain number, not a timestamp. Future appointment forms must convert
local date/time input into UTC instants before persistence; no appointment UI exists yet.

## Verification

```sh
pnpm test
pnpm run typecheck
pnpm run lint
pnpm run format:check
pnpm run build
```

Tests cover validation, timezone conversion, database configuration, related records,
editing, completion/reopening, foreign keys, and transaction rollback. SQLite tests
use isolated in-memory databases. PostgreSQL runs the same repository contract when
`TEST_POSTGRES_URL` is set in the test process environment. It creates and removes
isolated test schemas; use a dedicated test database with schema-creation permissions.
Without that URL, PostgreSQL contract tests are explicitly skipped.

For a headless browser regression test:

```sh
pnpm exec playwright install chromium
pnpm run test:e2e
```

Playwright starts a local Next.js server on port 3100 and a separate SQLite test
database under ignored `data/`. It checks the complete customer → vehicle → job →
completion → reopening workflow, local-time display, filtering, and mobile layout.
Browser installation may require a download. Unit tests do not require a browser.
An already installed Chromium can be selected through `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.
Next.js chooses build worker concurrency automatically. Test suites use one worker.

At initial setup, the production dependency audit reported no advisories. The full
audit reported upstream development-tool advisories in the ESLint glob dependency
chain and Drizzle Kit's legacy esbuild loader. Review those separately; the automatic
forced fixes suggest incompatible downgrades and are not applied.

## Formatting conventions

```sh
pnpm run format
pnpm run format:check
```

Prettier owns formatting: two-space indentation, semicolons, double quotes,
trailing commas, LF line endings, and a 100-column print width. ESLint checks code
quality separately. `.editorconfig` provides matching editor defaults.

## Structure

```text
src/app/                 App Router pages and Server Actions
src/components/forms/    Customer, vehicle, and job forms
src/components/ui/       Locally owned shadcn/ui components
src/db/schema/           SQLite and PostgreSQL schemas
src/db/                  Driver adapters, repository, configuration
src/lib/                 Domain types, validation, UTC/local formatting
drizzle/                 Provider-specific migrations
scripts/                 Explicit migrations and Faker seeding
tests/                   Unit and database contract tests
e2e/                     Headless browser workflow test
```

## License

MIT — see [LICENSE.md](LICENSE.md).
