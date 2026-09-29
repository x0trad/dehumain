CREATE TABLE `waitlist_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`x_handle` text NOT NULL,
	`wallet_address` text NOT NULL,
	`card_code` text NOT NULL,
	`eligibility_status` text DEFAULT 'pending_verification' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `waitlist_x_handle_unique` ON `waitlist_entries` (`x_handle`);--> statement-breakpoint
CREATE UNIQUE INDEX `waitlist_wallet_unique` ON `waitlist_entries` (`wallet_address`);--> statement-breakpoint
CREATE UNIQUE INDEX `waitlist_card_code_unique` ON `waitlist_entries` (`card_code`);