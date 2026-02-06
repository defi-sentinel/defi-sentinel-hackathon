CREATE TABLE `alerts` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`message` text,
	`severity` text,
	`active` integer DEFAULT 1,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`summary` text,
	`content` text,
	`tags` text,
	`difficulty` text,
	`is_paid` integer DEFAULT 0,
	`published_at` integer,
	`popularity_score` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);--> statement-breakpoint
CREATE TABLE `protocols` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`logo` text,
	`website_url` text,
	`docs_url` text,
	`twitter_url` text,
	`audit_status` text,
	`chains` text,
	`launch_date` integer,
	`rating` text,
	`score` integer,
	`risk_breakdown` text,
	`tvl` real,
	`tvl_change_7d` real,
	`is_new` integer DEFAULT 0,
	`is_trending` integer DEFAULT 0,
	`has_risk_alert` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `protocols_slug_unique` ON `protocols` (`slug`);--> statement-breakpoint
CREATE TABLE `strategies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`type` text,
	`risk_level` text,
	`protocols` text,
	`steps` text,
	`risks_detailed` text,
	`apy` real,
	`apy_7d` real,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
