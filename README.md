# repair_shop

A workshop application that connects customers, their vehicles, and the repair work
carried out on each vehicle. It provides a responsive interface for recording
customer details, opening repair jobs, updating workshop notes, and tracking work
through completion.

The application uses Next.js App Router and TypeScript, with shadcn/ui components,
Tailwind CSS, and Drizzle ORM. Pages read records on the server, and forms save
changes through Server Actions. SQLite and PostgreSQL are supported through a
configurable database connection.

## Features

### Customers

- Create and edit customers with a required name and optional phone number.
- Browse customer records and open their detail pages.
- View a customer's registered vehicles and add a vehicle from their profile.

### Vehicles

- Register a vehicle under an existing customer.
- Record its license plate, make, model, and optional model year.
- Edit vehicle details and the associated customer.
- Open the customer profile or create a repair job from the vehicle's detail page.

### Repair jobs

- Create a repair job for a registered vehicle.
- Record the reported problem and optional workshop notes.
- Identify jobs by a readable number such as `JOB-000001`.
- Update jobs to **Open**, **In progress**, or **Completed**.
- Reopen completed jobs by changing their status.
- View the linked vehicle, customer, and job timestamps on the detail page.

The home screen displays repair jobs alongside counts for each status. Search
matches job numbers, reported problems, vehicle plates, makes, models, and customer
names. Search is case-insensitive and combines with the selected status filter.

### Forms and timestamps

Forms validate required fields and relationships on the server, display field-level
errors, and preserve entered values when validation fails. The interface includes
loading indicators, empty states, and error handling.

Creation, update, and completion timestamps are stored in UTC and displayed in the
browser's timezone. Completing a job records its completion time; reopening it
clears that timestamp. Editing an already completed job preserves its completion time.

## Workflow

1. **Add a customer.** Open Customers, enter their name and optional phone number,
   and save the record.
2. **Register their vehicle.** Add a vehicle from the customer profile or Vehicles
   page, select its customer, and enter the vehicle details.
3. **Open a repair job.** Choose the vehicle, describe the reported problem, and
   save the job with its initial status.
4. **Track the work.** Edit the job to update workshop notes and change its status
   as the repair progresses.
5. **Complete the job.** Select Completed when the work is finished. The job remains
   available in the repair-job list and can be reopened when needed.

## Requirements

- **Node.js 22.13 or newer within Node 22.** The `.nvmrc` file selects Node 22.
- **pnpm 10.17.1.** The version is declared in `package.json`.
- **PostgreSQL server and database** when using the PostgreSQL configuration.

## Setup

Run all commands from the project directory. Install the pinned dependencies using
the committed lockfile:

```sh
pnpm install --frozen-lockfile
```

Choose the database configuration below, then apply its migrations and start the
development server:

```sh
pnpm db:migrate
pnpm dev
```

Open <http://localhost:3000>. Records are persisted in the configured database
across page reloads and application restarts.

### SQLite

SQLite is the default configuration and runs within the Next.js server process.
The database file is stored at `data/repair_shop.db`; its directory is created
when connecting, and `pnpm db:migrate` creates the application tables.

The default connection works immediately. To configure it explicitly, copy
`.env.example` to `.env.local` and use:

```dotenv
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./data/repair_shop.db
```

Relative database paths are resolved from the project directory.

### PostgreSQL

Create a PostgreSQL database, copy `.env.example` to `.env.local`, and configure
the connection with your database credentials:

```dotenv
DATABASE_PROVIDER=postgres
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/repair_shop
```

Run `pnpm db:migrate` to apply the PostgreSQL migrations, then start the application
with `pnpm dev`. Each provider has its own migration files. Restart the application
after changing the database configuration.

### Sample data

After applying migrations, populate the application with generated records:

```sh
pnpm db:seed
```

Each run **replaces all existing customers, vehicles, and repair jobs**, including
manually entered records, with 12 customers, 12 vehicles, and 10 repair jobs.
Faker generates contact details and vehicle data using a fresh random seed, which
is printed in the console.

Replacement happens in one transaction, preserving the previous records if the
operation fails. Tables and migration history remain in place. Seeding is run
explicitly through this command.

### Production

With the database configured and migrations applied, build the application and
start the production server:

```sh
pnpm build
pnpm start
```

The production server listens on <http://localhost:3000> by default.

## License

[MIT](LICENSE.md)
