SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Pastikan menggunakan database yang tepat
CREATE DATABASE IF NOT EXISTS `mental_health_app`;
USE `mental_health_app`;

-- --------------------------------------------------------
-- Table structure for table `admin`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin') DEFAULT 'admin',
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admin` (`admin_id`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'admin@mentalhealth.app', '$2b$10$jtd4SNPn1ebWQ3VbEhdIse0mc2jJ.j.KWs5bBc9ninHXXivQwDcF6', 'admin', '2026-01-17 18:53:19')
ON DUPLICATE KEY UPDATE `email`=`email`;

-- --------------------------------------------------------
-- Table structure for table `user_session`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_session` (
  `session_id` varchar(64) NOT NULL,
  `first_access` datetime NOT NULL,
  `last_access` datetime NOT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user_session` (`session_id`, `first_access`, `last_access`) VALUES
('8b7851d6-77aa-40c0-9fe8-420984f5af9a', '2026-07-29 20:35:38', '2026-07-29 20:48:34');

-- --------------------------------------------------------
-- Table structure for table `dass_results`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dass_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` varchar(255) DEFAULT NULL,
  `depression_score` int(11) DEFAULT NULL,
  `anxiety_score` int(11) DEFAULT NULL,
  `stress_score` int(11) DEFAULT NULL,
  `result_category` enum('depression','anxiety','stress') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_id` (`session_id`),
  CONSTRAINT `dass_results_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `user_session` (`session_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `learngrow_playlists`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `learngrow_playlists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `learngrow_playlists` (`id`, `name`, `description`, `cover_image`, `created_at`, `updated_at`) VALUES
(6, 'Academic Stress & Burnout', 'Saat semuanya terasa berat, biarin konten ini nemenin kamu pelan-pelan nemuin tenang lagi.', 'cover-1770359736103.png', '2026-01-31 06:13:36', '2026-02-06 06:35:36'),
(7, 'Overthinking Era', 'Buat kamu yang pikirannya gak pernah berhenti, ayo belajar ngelola pikiran dengan cara yang lebih sehat.', 'cover-1770359712781.png', '2026-01-31 06:19:51', '2026-02-06 06:35:12'),
(24, 'Self–Growth', 'Kenal diri dan proses hidupmu pelan-pelan. Kamu bakal nemuin hal baik dari perjalanan ini.', 'cover-1770552518361.png', '2026-02-06 06:36:37', '2026-04-18 02:40:43');

-- --------------------------------------------------------
-- Table structure for table `learngrow_videos`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `learngrow_videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playlist_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `video_file` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_learngrow_playlist` (`playlist_id`),
  CONSTRAINT `fk_learngrow_playlist` FOREIGN KEY (`playlist_id`) REFERENCES `learngrow_playlists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `learngrow_videos` (`id`, `playlist_id`, `title`, `video_file`, `created_at`, `updated_at`) VALUES
(19, 24, 'tes', 'video-1770553720163.mp4', '2026-02-08 12:28:43', '2026-02-14 12:18:48');

-- --------------------------------------------------------
-- Table structure for table `meditation_types`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `meditation_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category_type` enum('depression','anxiety','stress') DEFAULT NULL,
  `description` text DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `meditation_types` (`id`, `name`, `category_type`, `description`, `cover_image`, `created_at`, `updated_at`) VALUES
(2, 'Calming Anxiety', 'anxiety', 'Untuk saat kamu merasa cemas atau gelisah, suara ini bantu nenangin pikiran kamu', 'uploads/meditation/covers/1770600830779.svg', '2026-02-09 01:33:50', '2026-02-09 01:37:42'),
(3, 'Depression Relief', 'depression', 'Saat semuanya terasa berat, biarin suara ini nemenin kamu nemuin tenang lagi', 'uploads/meditation/covers/1771074000531.svg', '2026-02-09 01:34:15', '2026-04-18 02:39:43'),
(4, 'Releasing Stress', 'stress', 'Pikiran lagi penuh dan overthinking gak mau berhenti? Ambil titik jeda kamu dulu. Yuk, pelanin napas, tenangin dada, dan balik lagi ke momen sekarang', NULL, '2026-07-22 14:51:46', '2026-07-22 14:52:34');

-- --------------------------------------------------------
-- Table structure for table `meditation_audios`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `meditation_audios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `meditation_type_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `audio_file` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_meditation_type` (`meditation_type_id`),
  CONSTRAINT `fk_meditation_type` FOREIGN KEY (`meditation_type_id`) REFERENCES `meditation_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `meditation_audios` (`id`, `meditation_type_id`, `title`, `audio_file`, `created_at`, `updated_at`) VALUES
(16, 3, 'depression', '/uploads/meditation/audios/1770603888907.mp3', '2026-02-09 02:24:49', '2026-02-14 13:00:25'),
(17, 2, 'anxiety', '/uploads/meditation/audios/1770603900214.mp3', '2026-02-09 02:25:00', '2026-02-09 02:25:09'),
(30, 4, 'Progressive Muscle Relaxation', '/uploads/meditation/audios/1784731972246.MP3', '2026-07-22 14:52:52', '2026-07-22 14:52:52');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;