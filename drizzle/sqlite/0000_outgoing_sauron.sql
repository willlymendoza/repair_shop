CREATE TABLE `customers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `repair_jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` integer NOT NULL,
	`description` text NOT NULL,
	`notes` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`completed_at` text,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "jobs_status_check" CHECK("repair_jobs"."status" in ('open', 'in_progress', 'completed'))
);
--> statement-breakpoint
CREATE INDEX `jobs_vehicle_idx` ON `repair_jobs` (`vehicle_id`);--> statement-breakpoint
CREATE INDEX `jobs_status_idx` ON `repair_jobs` (`status`);--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer_id` integer NOT NULL,
	`plate` text NOT NULL,
	`make` text NOT NULL,
	`model` text NOT NULL,
	`year` integer,
	`created_at` text NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `vehicles_customer_idx` ON `vehicles` (`customer_id`);