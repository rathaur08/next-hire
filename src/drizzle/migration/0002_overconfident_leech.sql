CREATE TABLE `applicants` (
	`id` int NOT NULL,
	`biography` text,
	`date_of_birth` datetime,
	`nationality` varchar(100),
	`marital_status` enum('single','married','divorced'),
	`gender` enum('male','female','other'),
	`education` enum('none','high school','undergraduate','masters','phd'),
	`experience` text,
	`website_url` varchar(255),
	`location` varchar(255),
	`deleted_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `applicants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employers` (
	`id` int NOT NULL,
	`name` varchar(255),
	`description` text,
	`banner_image_url` text,
	`organization_type` varchar(100),
	`team_size` varchar(50),
	`year_of_establishment` year,
	`website_url` varchar(255),
	`location` varchar(255),
	`deleted_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `employers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `applicants` ADD CONSTRAINT `applicants_id_users_id_fk` FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employers` ADD CONSTRAINT `employers_id_users_id_fk` FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;