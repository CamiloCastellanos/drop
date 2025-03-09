`updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert default carriers
INSERT INTO `carriers` (`name`, `logo_url`, `is_active`) VALUES
('EVACOURIER', 'https://example.com/logos/evacourier.png', 1),
('URBANO', 'https://example.com/logos/urbano.png', 1),
('FENIX', 'https://example.com/logos/fenix.png', 1);

-- Create carrier_preferences table
CREATE TABLE IF NOT EXISTS `carrier_preferences` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` int(11) NOT NULL,
  `carrier_id` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UNIQUE KEY `user_carrier_unique` (`user_id`, `carrier_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`carrier_id`) REFERENCES `carriers`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create warranties table
CREATE TABLE IF NOT EXISTS `warranties` (
  `id` varchar(36) NOT NULL PRIMARY KEY,
  `order_id` varchar(36) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'PENDIENTE',
  `description` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create warranty_shipments table
CREATE TABLE IF NOT EXISTS `warranty_shipments` (
  `id` varchar(36) NOT NULL PRIMARY KEY,
  `warranty_id` varchar(36) NOT NULL,
  `carrier_id` int(11) NOT NULL,
  `tracking_number` varchar(100) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'PENDIENTE',
  `destination_address` text NOT NULL,
  `destination_city` varchar(100) NOT NULL,
  `destination_department` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  FOREIGN KEY (`warranty_id`) REFERENCES `warranties`(`id`),
  FOREIGN KEY (`carrier_id`) REFERENCES `carriers`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create warranty_collections table
CREATE TABLE IF NOT EXISTS `warranty_collections` (
  `id` varchar(36) NOT NULL PRIMARY KEY,
  `warranty_id` varchar(36) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'PENDIENTE',
  `collection_address` text NOT NULL,
  `collection_city` varchar(100) NOT NULL,
  `collection_department` varchar(100) NOT NULL,
  `collection_date` date NOT NULL,
  `collection_time_slot` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  FOREIGN KEY (`warranty_id`) REFERENCES `warranties`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;