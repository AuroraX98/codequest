CREATE TABLE `activity` (
	`user_id` text NOT NULL,
	`day` text NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`tutor_used` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`user_id`, `day`)
);
--> statement-breakpoint
CREATE TABLE `chats` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`unit_id` text NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`settings` text NOT NULL,
	`encrypted_key` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`user_id` text NOT NULL,
	`unit_id` text NOT NULL,
	`code` text NOT NULL,
	`quiz_passed` integer DEFAULT 0 NOT NULL,
	`math_passed` integer DEFAULT 0 NOT NULL,
	`completed_at` text,
	`last_run` text,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `unit_id`)
);
--> statement-breakpoint
CREATE TABLE `snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`unit_id` text NOT NULL,
	`code` text NOT NULL,
	`created_at` text NOT NULL
);
