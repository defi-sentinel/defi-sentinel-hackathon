CREATE TABLE `billing_history` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`plan` text NOT NULL,
	`months` integer,
	`price` text NOT NULL,
	`date` integer NOT NULL,
	`wallet` text NOT NULL,
	`tx_hash` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_badges` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`badge_id` integer NOT NULL,
	`earned` integer DEFAULT 0,
	`nft_minted` integer DEFAULT 0,
	`earned_at` integer,
	`minted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`wallet_address` text NOT NULL,
	`email` text,
	`member_since` integer,
	`days_remaining` integer DEFAULT 0,
	`quiz_completed` integer DEFAULT 0,
	`risk_assessment_done` integer DEFAULT 0,
	`tier` text DEFAULT 'free',
	`expiry_date` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_wallet_address_unique` ON `users` (`wallet_address`);