-- Database schema for Titik Jeda (Skripsi)
-- (CREATE DATABASE dan USE dihapus agar kompatibel dengan import aaPanel)

-- 1. admin table
CREATE TABLE IF NOT EXISTS `admin` (
  `admin_id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Admin
-- Email: admin@titikjeda.com
-- Password: admin123
INSERT INTO `admin` (`email`, `password_hash`, `role`) 
VALUES ('admin@titikjeda.com', '$2b$10$Lax/3alzrFjuqmvt6RuhsOefxLTCTrnWsnkTdmeZWQjUyVlpwDAci', 'admin')
ON DUPLICATE KEY UPDATE `email`=`email`;

-- 2. meditation_types table
CREATE TABLE IF NOT EXISTS `meditation_types` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `category_type` ENUM('depression', 'anxiety', 'stress', 'general') DEFAULT 'general',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. meditation_audios table
CREATE TABLE IF NOT EXISTS `meditation_audios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `meditation_type_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `audio_file` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`meditation_type_id`) REFERENCES `meditation_types`(`id`) ON DELETE CASCADE
);

-- 4. learngrow_playlists table
CREATE TABLE IF NOT EXISTS `learngrow_playlists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. learngrow_videos table
CREATE TABLE IF NOT EXISTS `learngrow_videos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `playlist_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `video_file` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`playlist_id`) REFERENCES `learngrow_playlists`(`id`) ON DELETE CASCADE
);

-- 6. dass_results table
CREATE TABLE IF NOT EXISTS `dass_results` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `session_id` VARCHAR(255) NOT NULL UNIQUE,
  `depression_score` INT,
  `anxiety_score` INT,
  `stress_score` INT,
  `result_category` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. user_session table
CREATE TABLE IF NOT EXISTS `user_session` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `session_id` VARCHAR(255) NOT NULL UNIQUE,
  `first_access` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_access` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
