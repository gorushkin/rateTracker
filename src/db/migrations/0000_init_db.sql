CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text DEFAULT '' NOT NULL,
	`utc_offset` integer DEFAULT 0 NOT NULL,
	`isHourlyUpdateEnabled` integer DEFAULT false NOT NULL,
	`isDailyUpdateEnabled` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);