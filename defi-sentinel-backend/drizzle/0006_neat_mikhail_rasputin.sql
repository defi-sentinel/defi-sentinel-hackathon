CREATE TABLE `homepage_featured` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`article_id` text,
	`title` text NOT NULL,
	`summary` text,
	`slug` text,
	`cover_image` text,
	`read_time` integer,
	`display_order` integer DEFAULT 0,
	`active` integer DEFAULT 1,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
