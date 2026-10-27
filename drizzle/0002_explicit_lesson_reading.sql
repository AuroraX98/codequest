CREATE TABLE `lesson_reading` (
	`user_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`section_key` text NOT NULL,
	`checked` integer DEFAULT 0 NOT NULL,
	`marked_at` text,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `lesson_id`, `section_key`)
);
