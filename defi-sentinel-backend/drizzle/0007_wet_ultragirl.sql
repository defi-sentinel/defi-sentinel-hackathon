CREATE TABLE `homepage_config` (
	`id` text PRIMARY KEY NOT NULL,
	`featured_title_line1` text,
	`featured_title_line2` text,
	`featured_description` text,
	`featured_link` text,
	`featured_read_time` text,
	`insight1_title` text,
	`insight1_description` text,
	`insight1_link` text,
	`insight2_title` text,
	`insight2_description` text,
	`insight2_link` text,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
DROP TABLE `homepage_featured`;--> statement-breakpoint
ALTER TABLE `strategies` ADD `tokens` text;--> statement-breakpoint
ALTER TABLE `strategies` ADD `project_id` text;--> statement-breakpoint
ALTER TABLE `strategies` ADD `apy_base` real;--> statement-breakpoint
ALTER TABLE `strategies` ADD `apy_reward` real;--> statement-breakpoint
ALTER TABLE `strategies` ADD `tvl` real;--> statement-breakpoint
ALTER TABLE `strategies` ADD `complexity` text;--> statement-breakpoint
ALTER TABLE `strategies` ADD `rating` text;--> statement-breakpoint
ALTER TABLE `strategies` ADD `status` text;--> statement-breakpoint
ALTER TABLE `strategies` ADD `tags` text;--> statement-breakpoint
ALTER TABLE `strategies` ADD `yield_breakdown` text;--> statement-breakpoint
ALTER TABLE `strategies` ADD `strategy_class` text;--> statement-breakpoint
ALTER TABLE `strategies` ADD `apy_history` text;--> statement-breakpoint
ALTER TABLE `strategies` ADD `tvl_history` text;--> statement-breakpoint
ALTER TABLE `strategies` ADD `risk_radar` text;