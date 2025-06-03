-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2025 at 03:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hulame`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rental_id` bigint(20) UNSIGNED NOT NULL,
  `rental_title` varchar(255) NOT NULL,
  `owner_email` varchar(255) NOT NULL,
  `sender_name` varchar(255) NOT NULL,
  `sender_email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2023_06_02_000000_create_rentals_table', 1),
(5, '2023_06_02_000001_add_role_and_verified_to_users_table', 1),
(6, '2025_06_02_152721_create_personal_access_tokens_table', 2),
(7, '2025_06_02_170931_add_profile_fields_to_users_table', 3),
(8, '2025_06_02_195129_add_status_to_rentals_table', 4),
(10, '2025_06_03_005559_add_verification_fields_to_users_table', 5),
(11, '2025_06_03_020300_create_contact_messages_table', 6),
(16, '2025_06_03_030629_create_transactions_table', 7),
(17, '2025_06_03_030746_update_notifications_table_for_rentals', 7),
(18, '2025_06_03_062256_create_notifications_table', 8);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) UNSIGNED NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('074d7e66-2715-4b09-baeb-6a58f8db342c', 'rental_request', 'App\\Models\\User', 2, '{\"title\":\"Rental Request Sent\",\"message\":\"Your rental request for \'Book\' has been sent to Lebron James. You\'ll be notified when they respond.\",\"transaction_id\":9,\"rental_id\":5,\"owner_id\":9}', NULL, '2025-06-02 22:25:42', '2025-06-02 22:25:42'),
('1927548f-3b92-4009-94f7-627044de0d93', 'rental_request', 'App\\Models\\User', 12, '{\"title\":\"New Rental Request\",\"message\":\"Curry Stephen wants to rent your \'ninanina\' from Jun 04 to Jun 07, 2025\",\"transaction_id\":12,\"rental_id\":10,\"renter_id\":2,\"total_amount\":2704,\"total_days\":4}', NULL, '2025-06-03 04:49:23', '2025-06-03 04:49:23'),
('19f6a2f3-ce17-46a8-b92f-7362c1614fff', 'rental_request', 'App\\Models\\User', 9, '{\"title\":\"New Rental Request\",\"message\":\"Test User wants to rent your \'Book\' from Jun 04 to Jun 05, 2025\",\"transaction_id\":9,\"rental_id\":5,\"renter_id\":2,\"total_amount\":1132,\"total_days\":2}', NULL, '2025-06-02 22:25:42', '2025-06-02 22:25:42'),
('3b458693-04fe-42af-b6da-55fd38e3bce3', 'rental_completed', 'App\\Models\\User', 9, '{\"title\":\"Rental Completed\",\"message\":\"The rental for \'Shabu\' has been marked as completed\",\"transaction_id\":10,\"rental_id\":6}', NULL, '2025-06-02 22:28:31', '2025-06-02 22:28:31'),
('44c7811f-939a-4cfc-9371-d39f8a9fcc12', 'rental_request', 'App\\Models\\User', 2, '{\"title\":\"Rental Request Sent\",\"message\":\"Your rental request for \'ninanina\' has been sent to Nina. You\'ll be notified when they respond.\",\"transaction_id\":12,\"rental_id\":10,\"owner_id\":12}', NULL, '2025-06-03 04:49:23', '2025-06-03 04:49:23'),
('6f74aa49-650b-4753-827d-978ede64e282', 'rental_completed', 'App\\Models\\User', 9, '{\"title\":\"Rental Completed\",\"message\":\"The rental for \'asdas\' has been marked as completed\",\"transaction_id\":11,\"rental_id\":7}', NULL, '2025-06-03 02:16:35', '2025-06-03 02:16:35'),
('72419263-5301-4580-8633-505fa1177379', 'rental_approved', 'App\\Models\\User', 9, '{\"title\":\"Rental Request Approved!\",\"message\":\"Your rental request for \'asdas\' has been approved by Curry Stephen\",\"transaction_id\":11,\"rental_id\":7}', NULL, '2025-06-03 02:16:29', '2025-06-03 02:16:29'),
('7770747b-ca4a-456d-a63f-dfb3454ecf9c', 'rental_completed', 'App\\Models\\User', 2, '{\"title\":\"Rental Completed\",\"message\":\"The rental for \'ninanina\' has been marked as completed\",\"transaction_id\":12,\"rental_id\":10}', NULL, '2025-06-03 04:50:02', '2025-06-03 04:50:02'),
('7e25cdcc-4949-4fcd-b2e5-52ddf700a191', 'rental_approved', 'App\\Models\\User', 9, '{\"title\":\"Rental Request Approved!\",\"message\":\"Your rental request for \'Shabu\' has been approved by Curry Stephen\",\"transaction_id\":10,\"rental_id\":6}', NULL, '2025-06-02 22:28:18', '2025-06-02 22:28:18'),
('88945ac4-e637-44b0-b2dc-cafec8b9ea8e', 'rental_request', 'App\\Models\\User', 2, '{\"title\":\"New Rental Request\",\"message\":\"Lebron James wants to rent your \'Shabu\' from Jun 04 to Jun 09, 2025\",\"transaction_id\":10,\"rental_id\":6,\"renter_id\":9,\"total_amount\":900,\"total_days\":6}', NULL, '2025-06-02 22:27:31', '2025-06-02 22:27:31'),
('8ef3b184-2a18-4c8b-b58a-bde760de8475', 'rental_approved', 'App\\Models\\User', 2, '{\"title\":\"Rental Request Approved!\",\"message\":\"Your rental request for \'ninanina\' has been approved by Nina\",\"transaction_id\":12,\"rental_id\":10}', NULL, '2025-06-03 04:49:50', '2025-06-03 04:49:50'),
('cadd9e7e-258b-492e-a7e5-7e4f60a9fc1d', 'test_type', 'App\\Models\\User', 2, '{\"title\":\"Test Title\",\"message\":\"Test message content\",\"test_key\":\"test_value\"}', NULL, '2025-06-02 22:25:37', '2025-06-02 22:25:37'),
('d3529294-b962-44c8-8a3c-8ed74a0ca8b7', 'rental_request', 'App\\Models\\User', 2, '{\"title\":\"New Rental Request\",\"message\":\"Lebron James wants to rent your \'asdas\' from Jun 04 to Jun 19, 2025\",\"transaction_id\":11,\"rental_id\":7,\"renter_id\":9,\"total_amount\":1952,\"total_days\":16}', NULL, '2025-06-03 02:15:25', '2025-06-03 02:15:25'),
('da545152-1e23-4583-95e3-6bd0ec66fd55', 'rental_request', 'App\\Models\\User', 9, '{\"title\":\"Rental Request Sent\",\"message\":\"Your rental request for \'asdas\' has been sent to Curry Stephen. You\'ll be notified when they respond.\",\"transaction_id\":11,\"rental_id\":7,\"owner_id\":2}', NULL, '2025-06-03 02:15:25', '2025-06-03 02:15:25'),
('e4477711-9594-497d-a7c0-89152931055f', 'rental_request', 'App\\Models\\User', 9, '{\"title\":\"Rental Request Sent\",\"message\":\"Your rental request for \'Shabu\' has been sent to Curry Stephen. You\'ll be notified when they respond.\",\"transaction_id\":10,\"rental_id\":6,\"owner_id\":2}', NULL, '2025-06-02 22:27:31', '2025-06-02 22:27:31'),
('facdd74c-daf4-411e-aff2-b99f2d9b9c73', 'test_type', 'App\\Models\\User', 2, '{\"title\":\"Test Title\",\"message\":\"Test message content\",\"test_key\":\"test_value\"}', NULL, '2025-06-02 22:25:17', '2025-06-02 22:25:17');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 2, 'auth_token', '2649a6b26353c5b8d6a3f6bd6ab5cb8c57c8c70f84075705d728df0bc6fab340', '[\"*\"]', NULL, NULL, '2025-06-02 15:29:54', '2025-06-02 15:29:54'),
(2, 'App\\Models\\User', 1, 'auth_token', '2c80c36518eb45f6c5edd14752e35a91a134cf000a70933b51ad0ec5ebf04d64', '[\"*\"]', NULL, NULL, '2025-06-02 15:36:35', '2025-06-02 15:36:35'),
(3, 'App\\Models\\User', 2, 'auth_token', 'cd25138e6ecb12f5cf63441234fc99643e0b0e7385bad12e1c0dc62cd90a85a8', '[\"*\"]', NULL, NULL, '2025-06-02 15:41:07', '2025-06-02 15:41:07'),
(4, 'App\\Models\\User', 1, 'auth_token', '84b4577dd1411c5f7bd5c97fc6e46d473ce3a29275957c68f918ddca1c508c83', '[\"*\"]', NULL, NULL, '2025-06-02 15:43:28', '2025-06-02 15:43:28'),
(5, 'App\\Models\\User', 2, 'auth_token', 'c40dfb62c77f5d2be41ff2fd5b9e7adf0d355fc6798cc221eb2a8d51d89796eb', '[\"*\"]', NULL, NULL, '2025-06-02 16:02:03', '2025-06-02 16:02:03'),
(6, 'App\\Models\\User', 1, 'auth_token', '0831a0cf6498dfa550aa7b16ef67fdfdb854bcf2f14cecd8b7a6b833925e83a8', '[\"*\"]', NULL, NULL, '2025-06-02 16:04:31', '2025-06-02 16:04:31'),
(8, 'App\\Models\\User', 2, 'auth_token', '41cb9fc30cc5aa276b8e1e9a94722ca8797a1d61bb8960cfd804f6360a65351a', '[\"*\"]', NULL, NULL, '2025-06-02 17:41:43', '2025-06-02 17:41:43'),
(16, 'App\\Models\\User', 4, 'auth_token', '20c4d095f591978c608dbaab2d7139cea2e20141c7a17b3afba8412e21189781', '[\"*\"]', '2025-06-02 16:58:07', NULL, '2025-06-03 00:39:24', '2025-06-02 16:58:07'),
(17, 'App\\Models\\User', 4, 'auth_token', '7695c299025bd8061a540d6385ae7c0688c504b604cfbb63bfa39a7363f55634', '[\"*\"]', NULL, NULL, '2025-06-02 16:44:52', '2025-06-02 16:44:52'),
(18, 'App\\Models\\User', 4, 'auth_token', 'b25664cab3acf9ee71a91a3cb282a887f9707deb152833c06a2ba98f9940256f', '[\"*\"]', '2025-06-02 16:45:05', NULL, '2025-06-02 16:45:00', '2025-06-02 16:45:05'),
(19, 'App\\Models\\User', 1, 'auth_token', '2a134f51d206ccfa091ad577c80d99c6a8f57afb5cbe7ed1ff3ced4e138f3bef', '[\"*\"]', '2025-06-02 17:31:30', NULL, '2025-06-02 17:14:32', '2025-06-02 17:31:30'),
(20, 'App\\Models\\User', 9, 'auth_token', 'f3ca476887dfbaa250da55b310eabdf3e13b90e8ac1e416a534918940d1efc32', '[\"*\"]', '2025-06-02 17:44:50', NULL, '2025-06-02 17:32:41', '2025-06-02 17:44:50'),
(21, 'App\\Models\\User', 9, 'auth_token', '7b54c784d7e55d4001529a14b89d19e7e6cc66123009715423e84f5e27870ca8', '[\"*\"]', '2025-06-02 17:53:33', NULL, '2025-06-02 17:45:32', '2025-06-02 17:53:33'),
(22, 'App\\Models\\User', 2, 'auth_token', '890ee19c2044dd3a9fe05e74caf5c946c1eaa16b0dfff264e3e8f69382a9fd4c', '[\"*\"]', '2025-06-02 18:58:44', NULL, '2025-06-02 17:55:34', '2025-06-02 18:58:44'),
(23, 'App\\Models\\User', 2, 'auth_token', '4d053d5c39c75e88f5a4080de7e6bb08fa4897f60291a105c38e5bf8121ceba2', '[\"*\"]', '2025-06-02 18:59:42', NULL, '2025-06-02 18:59:30', '2025-06-02 18:59:42'),
(24, 'App\\Models\\User', 9, 'auth_token', 'a816f44a154a52e2aae1638d82ad14d85d4adfd50c42d2e590cfd4d0130190fb', '[\"*\"]', NULL, NULL, '2025-06-02 18:59:52', '2025-06-02 18:59:52'),
(25, 'App\\Models\\User', 4, 'auth_token', '566f2927cb22698a84d3b062a7db768701f79fefbe5fa720c9a864a718b451cc', '[\"*\"]', NULL, NULL, '2025-06-02 19:00:52', '2025-06-02 19:00:52'),
(26, 'App\\Models\\User', 9, 'auth_token', '7686fa806628a879a41f8dc825f4cc5ccccd62c47dc71e2a2e6228673501135d', '[\"*\"]', '2025-06-02 19:59:12', NULL, '2025-06-02 19:01:37', '2025-06-02 19:59:12'),
(27, 'App\\Models\\User', 9, 'auth_token', '589cea8f22198bd1c50591ddffe575b350ac9cf76125a075c4b945c234cc7ae7', '[\"*\"]', '2025-06-02 21:57:24', NULL, '2025-06-02 21:28:59', '2025-06-02 21:57:24'),
(28, 'App\\Models\\User', 9, 'auth_token', '9242ec094716538e26e76945165e5eac7e2a924a39e77f4fb5a6c19e00fa18da', '[\"*\"]', '2025-06-02 22:27:22', NULL, '2025-06-02 22:09:15', '2025-06-02 22:27:22'),
(29, 'App\\Models\\User', 2, 'auth_token', '74e11ec3295f66e72f0c1cee6282c10968d0008f3d98cda0790acb5eaaebf4db', '[\"*\"]', '2025-06-02 22:54:44', NULL, '2025-06-02 22:27:46', '2025-06-02 22:54:44'),
(30, 'App\\Models\\User', 9, 'auth_token', '5340cb39e2bd9db7420e7f4ac7253c2991b96adc2fb66e6df3e7ceddf74ae934', '[\"*\"]', '2025-06-03 01:46:40', NULL, '2025-06-03 01:45:01', '2025-06-03 01:46:40'),
(31, 'App\\Models\\User', 2, 'auth_token', '67af08af977b0686d83d03ad813927141e2ce43ca1770eb154732c0931ad88ff', '[\"*\"]', '2025-06-03 01:47:20', NULL, '2025-06-03 01:47:17', '2025-06-03 01:47:20'),
(32, 'App\\Models\\User', 9, 'auth_token', '27199e37bd3eec4672ac50e684e97c7602f0bd2c6459e778150d98159a22e1da', '[\"*\"]', '2025-06-03 02:15:08', NULL, '2025-06-03 02:14:59', '2025-06-03 02:15:08'),
(33, 'App\\Models\\User', 2, 'auth_token', 'babfacf86b29ad2a4d7ebbcb6ce1365c311ea084dd18b39ac143ba56a40b82ce', '[\"*\"]', '2025-06-03 02:18:03', NULL, '2025-06-03 02:16:11', '2025-06-03 02:18:03'),
(34, 'App\\Models\\User', 9, 'auth_token', '3b302d299422dea6f47fe914064475c0cd237a95ff4c83ed44e14d104810c10f', '[\"*\"]', '2025-06-03 03:22:41', NULL, '2025-06-03 03:06:18', '2025-06-03 03:22:41'),
(35, 'App\\Models\\User', 9, 'auth_token', 'aaf6df8d6dee2e6c440222038347d462e0ab6013b51d158791846cf4ee4656f3', '[\"*\"]', '2025-06-03 03:27:38', NULL, '2025-06-03 03:25:56', '2025-06-03 03:27:38'),
(36, 'App\\Models\\User', 9, 'auth_token', '3af26e0dfea8b00d8e23ea05e5ae4ae22a14e6b834c0d9e5d788d8689e7bdeed', '[\"*\"]', '2025-06-03 03:37:19', NULL, '2025-06-03 03:34:41', '2025-06-03 03:37:19'),
(37, 'App\\Models\\User', 9, 'auth_token', '700cb2b2c5a8cfdf29065cbe24c93dc7a9061accbaeabfdee226c47c66584fba', '[\"*\"]', '2025-06-03 04:00:11', NULL, '2025-06-03 03:59:18', '2025-06-03 04:00:11'),
(38, 'App\\Models\\User', 9, 'auth_token', '491761410c04498c731c1ee05fb33d5cc7878a4c4a928aede69745156bcbfb38', '[\"*\"]', '2025-06-03 04:38:39', NULL, '2025-06-03 04:08:59', '2025-06-03 04:38:39'),
(39, 'App\\Models\\User', 12, 'auth_token', '856ea08426e0b6530402e1444799a7dca660aee35acb2a9dcc692c2248dbd558', '[\"*\"]', '2025-06-03 04:39:45', NULL, '2025-06-03 04:39:38', '2025-06-03 04:39:45'),
(40, 'App\\Models\\User', 9, 'auth_token', 'a3b7fcc06c2b09b5890acb07463a3181ba80cd1084ee605d92a5a458cf11da2b', '[\"*\"]', '2025-06-03 04:40:04', NULL, '2025-06-03 04:40:00', '2025-06-03 04:40:04'),
(41, 'App\\Models\\User', 4, 'auth_token', 'd89765c80740ffeb03da3d75ec80c021c72b469673ca7619ace9f66e777a8da3', '[\"*\"]', '2025-06-03 04:40:18', NULL, '2025-06-03 04:40:16', '2025-06-03 04:40:18'),
(42, 'App\\Models\\User', 12, 'auth_token', '3ee186fa2bcd5694756b0ae501254c0b721c0cad09ff1e86f6a7fc4a2680beb2', '[\"*\"]', '2025-06-03 04:48:48', NULL, '2025-06-03 04:47:39', '2025-06-03 04:48:48'),
(43, 'App\\Models\\User', 2, 'auth_token', 'ec7e2ffa4179f2f1416c2f2395b82163bb6057d67fca7f0041428c4b59fdf45d', '[\"*\"]', '2025-06-03 04:49:11', NULL, '2025-06-03 04:49:08', '2025-06-03 04:49:11'),
(44, 'App\\Models\\User', 12, 'auth_token', '40b22330bcf0c54cf65a34ab790e287ca360f4f46a72cb84b509bce862a4d8d1', '[\"*\"]', '2025-06-03 04:50:18', NULL, '2025-06-03 04:49:40', '2025-06-03 04:50:18');

-- --------------------------------------------------------

--
-- Table structure for table `rentals`
--

CREATE TABLE `rentals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `location` varchar(255) NOT NULL,
  `image` text DEFAULT NULL,
  `status` enum('available','rented','unavailable') NOT NULL DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rental_messages`
--

CREATE TABLE `rental_messages` (
  `id` int(11) NOT NULL,
  `rental_id` int(11) NOT NULL,
  `renter_email` varchar(255) NOT NULL,
  `sender_name` varchar(255) NOT NULL,
  `sender_email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `rental_title` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rental_id` bigint(20) UNSIGNED NOT NULL,
  `renter_id` bigint(20) UNSIGNED NOT NULL,
  `owner_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('pending','approved','rejected','completed','cancelled') NOT NULL DEFAULT 'pending',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `renter_message` text DEFAULT NULL,
  `owner_response` text DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `course_year` varchar(100) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `social_link` varchar(500) DEFAULT NULL,
  `profile_picture` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `website` varchar(500) DEFAULT NULL,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skills`)),
  `education` text DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 0.0,
  `total_ratings` int(11) DEFAULT 0,
  `is_online` tinyint(1) DEFAULT 0,
  `last_seen` timestamp NULL DEFAULT NULL,
  `show_email` tinyint(1) DEFAULT 0,
  `show_contact` tinyint(1) DEFAULT 1,
  `show_social_link` tinyint(1) DEFAULT 1,
  `profile_completion` int(11) DEFAULT 0,
  `verification_document` text DEFAULT NULL,
  `verification_document_type` varchar(50) DEFAULT NULL,
  `verification_submitted_at` timestamp NULL DEFAULT NULL,
  `verification_reviewed_at` timestamp NULL DEFAULT NULL,
  `verification_status` varchar(20) NOT NULL DEFAULT 'pending',
  `verification_notes` text DEFAULT NULL,
  `verified_by` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `verified`, `remember_token`, `created_at`, `updated_at`, `bio`, `contact_number`, `course_year`, `birthday`, `gender`, `social_link`, `profile_picture`, `location`, `website`, `skills`, `education`, `rating`, `total_ratings`, `is_online`, `last_seen`, `show_email`, `show_contact`, `show_social_link`, `profile_completion`, `verification_document`, `verification_document_type`, `verification_submitted_at`, `verification_reviewed_at`, `verification_status`, `verification_notes`, `verified_by`) VALUES
(4, 'System Administrator', 'admin@hulame.com', '2025-06-02 15:58:22', '$2y$12$xEGFpfaJauveoeRe8.eZkul0YMYc16spel0KU/fcngdJK6l9fkEhO', 'admin', 1, NULL, '2025-06-02 15:58:22', '2025-06-02 15:58:22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.0, 0, 0, NULL, 0, 1, 1, 0, NULL, NULL, NULL, NULL, 'pending', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contact_messages_rental_id_sent_at_index` (`rental_id`,`sent_at`),
  ADD KEY `contact_messages_owner_email_index` (`owner_email`),
  ADD KEY `contact_messages_sender_email_index` (`sender_email`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `rentals`
--
ALTER TABLE `rentals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rentals_user_id_foreign` (`user_id`);

--
-- Indexes for table `rental_messages`
--
ALTER TABLE `rental_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_rental_id` (`rental_id`),
  ADD KEY `idx_renter_email` (`renter_email`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transactions_rental_id_foreign` (`rental_id`),
  ADD KEY `transactions_renter_id_status_index` (`renter_id`,`status`),
  ADD KEY `transactions_owner_id_status_index` (`owner_id`,`status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `idx_verified_role` (`verified`,`role`),
  ADD KEY `idx_last_seen` (`last_seen`),
  ADD KEY `idx_rating` (`rating`),
  ADD KEY `users_verification_status_index` (`verification_status`),
  ADD KEY `users_verification_submitted_at_index` (`verification_submitted_at`),
  ADD KEY `users_verified_by_foreign` (`verified_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `rental_messages`
--
ALTER TABLE `rental_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD CONSTRAINT `contact_messages_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rentals`
--
ALTER TABLE `rentals`
  ADD CONSTRAINT `rentals_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_renter_id_foreign` FOREIGN KEY (`renter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_verified_by_foreign` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
