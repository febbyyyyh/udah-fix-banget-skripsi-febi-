-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 30, 2026 at 04:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mental_health_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin') DEFAULT 'admin',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'admin@mentalhealth.app', '$2b$10$jtd4SNPn1ebWQ3VbEhdIse0mc2jJ.j.KWs5bBc9ninHXXivQwDcF6', 'admin', '2026-01-17 18:53:19');

-- --------------------------------------------------------

--
-- Table structure for table `dass_results`
--

CREATE TABLE `dass_results` (
  `id` int(11) NOT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `depression_score` int(11) DEFAULT NULL,
  `anxiety_score` int(11) DEFAULT NULL,
  `stress_score` int(11) DEFAULT NULL,
  `result_category` enum('depression','anxiety','stress') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dass_results`
--

INSERT INTO `dass_results` (`id`, `session_id`, `depression_score`, `anxiety_score`, `stress_score`, `result_category`, `created_at`) VALUES
(1, '83d47b6d-6eaa-4030-92c9-e35eb12a20e3', 16, 20, 18, 'anxiety', '2026-04-18 02:35:40'),
(3, '6889caff-6b1a-449b-abce-0cf5b8e4cd57', 12, 10, 28, 'stress', '2026-04-18 03:40:17'),
(6, 'f9c0bd5a-7efe-4d0f-b5fc-ad1c795796df', 34, 30, 22, 'depression', '2026-04-18 03:10:16'),
(7, '8790aa4b-1343-4ff0-bd37-2f7ba71cda6c', 22, 20, 18, 'anxiety', '2026-07-22 14:30:41'),
(11, '37f0b564-4bdd-454e-8d9a-4d1a4f6149d4', 20, 26, 16, 'anxiety', '2026-07-23 02:38:48');

-- --------------------------------------------------------

--
-- Table structure for table `learngrow_playlists`
--

CREATE TABLE `learngrow_playlists` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `learngrow_playlists`
--

INSERT INTO `learngrow_playlists` (`id`, `name`, `description`, `cover_image`, `created_at`, `updated_at`) VALUES
(6, 'Academic Stress & Burnout', 'Saat semuanya terasa berat, biarin konten ini nemenin kamu pelan-pelan nemuin tenang lagi.', 'cover-1770359736103.png', '2026-01-31 06:13:36', '2026-02-06 06:35:36'),
(7, 'Overthinking Era', 'Buat kamu yang pikirannya gak pernah berhenti, ayo belajar ngelola pikiran dengan cara yang lebih sehat.', 'cover-1770359712781.png', '2026-01-31 06:19:51', '2026-02-06 06:35:12'),
(24, 'Self–Growth', 'Kenal diri dan proses hidupmu pelan-pelan. Kamu bakal nemuin hal baik dari perjalanan ini.', 'cover-1770552518361.png', '2026-02-06 06:36:37', '2026-04-18 02:40:43');

-- --------------------------------------------------------

--
-- Table structure for table `learngrow_videos`
--

CREATE TABLE `learngrow_videos` (
  `id` int(11) NOT NULL,
  `playlist_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `video_file` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `learngrow_videos`
--

INSERT INTO `learngrow_videos` (`id`, `playlist_id`, `title`, `video_file`, `created_at`, `updated_at`) VALUES
(19, 24, 'tes', 'video-1770553720163.mp4', '2026-02-08 12:28:43', '2026-02-14 12:18:48');

-- --------------------------------------------------------

--
-- Table structure for table `meditation_audios`
--

CREATE TABLE `meditation_audios` (
  `id` int(11) NOT NULL,
  `meditation_type_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `audio_file` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meditation_audios`
--

INSERT INTO `meditation_audios` (`id`, `meditation_type_id`, `title`, `audio_file`, `created_at`, `updated_at`) VALUES
(16, 3, 'depression', '/uploads/meditation/audios/1770603888907.mp3', '2026-02-09 02:24:49', '2026-02-14 13:00:25'),
(17, 2, 'anxiety', '/uploads/meditation/audios/1770603900214.mp3', '2026-02-09 02:25:00', '2026-02-09 02:25:09'),
(30, 4, 'Progressive Muscle Relaxation', '/uploads/meditation/audios/1784731972246.MP3', '2026-07-22 14:52:52', '2026-07-22 14:52:52');

-- --------------------------------------------------------

--
-- Table structure for table `meditation_types`
--

CREATE TABLE `meditation_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_type` enum('depression','anxiety','stress') DEFAULT NULL,
  `description` text DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meditation_types`
--

INSERT INTO `meditation_types` (`id`, `name`, `category_type`, `description`, `cover_image`, `created_at`, `updated_at`) VALUES
(2, 'Calming Anxiety', 'anxiety', 'Untuk saat kamu merasa cemas atau gelisah, suara ini bantu nenangin pikiran kamu', 'uploads/meditation/covers/1770600830779.svg', '2026-02-09 01:33:50', '2026-02-09 01:37:42'),
(3, 'Depression Relief', 'depression', 'Saat semuanya terasa berat, biarin suara ini nemenin kamu nemuin tenang lagi', 'uploads/meditation/covers/1771074000531.svg', '2026-02-09 01:34:15', '2026-04-18 02:39:43'),
(4, 'Releasing Stress', 'stress', 'Pikiran lagi penuh dan overthinking gak mau berhenti? Ambil titik jeda kamu dulu. Yuk, pelanin napas, tenangin dada, dan balik lagi ke momen sekarang', NULL, '2026-07-22 14:51:46', '2026-07-22 14:52:34');

-- --------------------------------------------------------

--
-- Table structure for table `user_session`
--

CREATE TABLE `user_session` (
  `session_id` varchar(64) NOT NULL,
  `first_access` datetime NOT NULL,
  `last_access` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_session`
--

INSERT INTO `user_session` (`session_id`, `first_access`, `last_access`) VALUES
('03b41566-f9df-4838-9104-bdf37249cf6e', '2026-04-18 11:08:01', '2026-04-18 11:08:01'),
('165b2410-8f1e-4299-b374-193fbffcce75', '2026-05-01 07:49:48', '2026-05-01 07:49:48'),
('37f0b564-4bdd-454e-8d9a-4d1a4f6149d4', '2026-07-23 07:26:21', '2026-07-23 11:34:18'),
('40b1765e-efd7-461d-b086-0f0d7e04d3ff', '2026-05-01 07:49:48', '2026-05-01 07:49:48'),
('6889caff-6b1a-449b-abce-0cf5b8e4cd57', '2026-04-18 10:19:26', '2026-04-18 11:40:17'),
('83d47b6d-6eaa-4030-92c9-e35eb12a20e3', '2026-04-18 10:22:45', '2026-04-18 11:40:17'),
('8511f5c9-83fa-4894-bac4-c49795e4d4d5', '2026-05-01 07:49:48', '2026-05-01 07:58:51'),
('8790aa4b-1343-4ff0-bd37-2f7ba71cda6c', '2026-07-20 00:08:53', '2026-07-22 22:52:56'),
('8b7851d6-77aa-40c0-9fe8-420984f5af9a', '2026-07-29 20:35:38', '2026-07-29 20:48:34'),
('8d120f3e-9366-43aa-bf09-2119502c098b', '2026-07-20 10:37:39', '2026-07-20 10:37:39'),
('ab47acd6-a375-48fa-a61e-1df5f9fefd50', '2026-04-18 10:22:45', '2026-04-18 10:22:45'),
('ca775240-2129-498b-9074-4c45d2ae59f4', '2026-04-18 10:19:26', '2026-04-18 10:19:26'),
('f79b9466-37ba-426c-8e9b-0dfb09ffc890', '2026-05-01 07:49:48', '2026-05-01 07:49:48'),
('f9c0bd5a-7efe-4d0f-b5fc-ad1c795796df', '2026-04-18 11:08:01', '2026-04-18 11:08:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `dass_results`
--
ALTER TABLE `dass_results`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_id` (`session_id`);

--
-- Indexes for table `learngrow_playlists`
--
ALTER TABLE `learngrow_playlists`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `learngrow_videos`
--
ALTER TABLE `learngrow_videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_learngrow_playlist` (`playlist_id`);

--
-- Indexes for table `meditation_audios`
--
ALTER TABLE `meditation_audios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_meditation_type` (`meditation_type_id`);

--
-- Indexes for table `meditation_types`
--
ALTER TABLE `meditation_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_session`
--
ALTER TABLE `user_session`
  ADD PRIMARY KEY (`session_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `dass_results`
--
ALTER TABLE `dass_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `learngrow_playlists`
--
ALTER TABLE `learngrow_playlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `learngrow_videos`
--
ALTER TABLE `learngrow_videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `meditation_audios`
--
ALTER TABLE `meditation_audios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `meditation_types`
--
ALTER TABLE `meditation_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dass_results`
--
ALTER TABLE `dass_results`
  ADD CONSTRAINT `dass_results_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `user_session` (`session_id`) ON DELETE CASCADE;

--
-- Constraints for table `learngrow_videos`
--
ALTER TABLE `learngrow_videos`
  ADD CONSTRAINT `fk_learngrow_playlist` FOREIGN KEY (`playlist_id`) REFERENCES `learngrow_playlists` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `meditation_audios`
--
ALTER TABLE `meditation_audios`
  ADD CONSTRAINT `fk_meditation_type` FOREIGN KEY (`meditation_type_id`) REFERENCES `meditation_types` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
