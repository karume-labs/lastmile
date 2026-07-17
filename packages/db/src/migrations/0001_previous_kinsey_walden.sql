CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`target` text NOT NULL,
	`severity` text DEFAULT 'info' NOT NULL,
	`metadata` text,
	`timestamp` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `proxies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`participant_count` integer DEFAULT 0 NOT NULL,
	`location` text DEFAULT 'Unknown' NOT NULL,
	`role` text DEFAULT 'Field Agent' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `batches` (
	`id` text PRIMARY KEY NOT NULL,
	`programme_id` text NOT NULL,
	`size` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `programmes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`target_currency` text NOT NULL,
	`target_audience` text DEFAULT '' NOT NULL,
	`budget` real DEFAULT 0 NOT NULL,
	`start_date` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`end_date` integer,
	`status` text DEFAULT 'Active' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sms_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`recipient` text NOT NULL,
	`content` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `identities` ADD `phone_number` text NOT NULL;--> statement-breakpoint
ALTER TABLE `disbursements` ADD `participant_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `disbursements` ADD `programme_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `disbursements` ADD `currency` text DEFAULT 'USDC' NOT NULL;--> statement-breakpoint
ALTER TABLE `disbursements` ADD `delivery_method` text DEFAULT 'direct' NOT NULL;--> statement-breakpoint
ALTER TABLE `registrations` ADD `preferred_language` text DEFAULT 'en' NOT NULL;--> statement-breakpoint
CREATE INDEX `audit_logs_actor_idx` ON `audit_logs` (`actor`);--> statement-breakpoint
CREATE INDEX `audit_logs_action_idx` ON `audit_logs` (`action`);--> statement-breakpoint
CREATE INDEX `audit_logs_target_idx` ON `audit_logs` (`target`);--> statement-breakpoint
CREATE INDEX `sms_messages_recipient_idx` ON `sms_messages` (`recipient`);--> statement-breakpoint
CREATE INDEX `sms_messages_status_idx` ON `sms_messages` (`status`);--> statement-breakpoint
ALTER TABLE `registrations` DROP COLUMN `phone_number`;