-- MySQL Database Schema for Dropi Application

-- Create roles table
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL PRIMARY KEY,
  `name` varchar(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert default roles
INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'ADMIN'),
(2, 'DROPSHIPPER'),
(3, 'PROVEEDOR / MARCA');

-- Create users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `last_name` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `country_code` varchar(5) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `account_type` enum('dropshipper','proveedor') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `role_id` int(11) DEFAULT 2,
  `last_login` timestamp NULL DEFAULT NULL,
  `status` enum('ON','OFF') DEFAULT 'OFF',
  `token` text DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` timestamp NULL DEFAULT NULL,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert sample users
INSERT INTO `users` (`id`, `last_name`, `first_name`, `country_code`, `phone`, `email`, `password`, `account_type`, `created_at`, `updated_at`, `role_id`, `last_login`, `status`, `token`) VALUES
(1, 'Doe', 'John', '1', '1234567890', 'john.doe@example.com', '$2a$12$yQJs6.bDBQw8rnYb/nbEzuEAdp7K5Pj8T2e9wDSCNTOZlH/TEyYIu', 'dropshipper', '2025-02-04 00:43:43', '2025-02-04 01:24:04', 1, NULL, 'OFF', NULL),
(2, 'Nieves', 'Alexander', '57', '944918994', 'elemax.store.io@gmail.com', '$2a$12$nnCi7FSxG22Nv2Pna8hIzeuSfznb.SohAHDzGIUQzkVmCXWxikNua', 'dropshipper', '2025-02-04 01:12:32', '2025-02-04 01:12:32', 2, NULL, 'OFF', NULL),
(3, 'Grill', 'Terraza', '57', '5345345334', 'alidismaza6@gmail.com', '$2a$12$H78U/RAXWOBhWsIk29A7wuS83fCCH5R0QZoRPX90tkDQZcxALaUB.', 'proveedor', '2025-02-04 01:13:44', '2025-02-04 01:24:04', 3, NULL, 'OFF', NULL),
(4, 'Grill', 'Terraza', '57', '242342343', 'angeldvelasco.99@gmail.com', '$2a$12$5Y0jouttV0MdMJjl82PRlOzkAwcjB/Enxlt9PpMUEApcbx8XRClTO', 'proveedor', '2025-02-04 13:16:29', '2025-02-04 13:16:29', 2, NULL, 'OFF', NULL),
(5, 'maza barroso', 'alidis katiuska', '52', '3055923972', 'raizamontilva00@gmail.com', '$2a$12$NHTtOHR2ObkasVa8U..LDu9qnFB8aii//6RNcQ4AV/vuWnybLSj1S', 'dropshipper', '2025-02-04 13:26:31', '2025-02-04 13:50:49', 2, '2025-02-04 13:50:49', 'ON', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInJvbGUiOjIsImlhdCI6MTczODY3NzA0OSwiZXhwIjoxNzM5MjgxODQ5fQ.kUwPtWQxVYCYym3r_C-x-I5CqnOLYAxlh4oQQQaOL1U');

-- Create products table
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `provider_id` int(11) NOT NULL,
  `provider_price` decimal(10,2) NOT NULL,
  `suggested_price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `category_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_private` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  FOREIGN KEY (`provider_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create categories table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create orders table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` varchar(36) NOT NULL PRIMARY KEY,
  `user_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'PENDIENTE',
  `total_amount` decimal(10,2) NOT NULL,
  `shipping_address` text NOT NULL,
  `shipping_city` varchar(100) NOT NULL,
  `shipping_department` varchar(100) NOT NULL,
  `shipping_country` varchar(100) NOT NULL DEFAULT 'Peru',
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `carrier_id` int(11) DEFAULT NULL,
  `tracking_number` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `collect_on_delivery` tinyint(1) DEFAULT 0,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create order_items table
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `order_id` varchar(36) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create carriers table
CREATE TABLE IF NOT EXISTS `carriers` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL