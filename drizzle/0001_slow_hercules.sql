CREATE TABLE `lesson_notes` (
	`user_id` text NOT NULL,
	`id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`lesson_title` text NOT NULL,
	`section_key` text NOT NULL,
	`section_index` integer NOT NULL,
	`section_title` text NOT NULL,
	`section_fingerprint` text NOT NULL,
	`quote` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	PRIMARY KEY(`user_id`, `id`)
);
--> statement-breakpoint
CREATE INDEX `lesson_notes_owner_lesson` ON `lesson_notes` (`user_id`,`lesson_id`,`deleted_at`);