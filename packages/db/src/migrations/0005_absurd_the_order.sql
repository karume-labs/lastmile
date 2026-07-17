ALTER TABLE `identities` ADD `failed_attempts` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `identities` ADD `lockout_until` integer;--> statement-breakpoint
ALTER TABLE `identities` ADD `ussd_blocked` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `registrations` ADD `amount` real DEFAULT 0 NOT NULL;