-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-10-2024 a las 22:09:17
-- Versión del servidor: 11.4.2-MariaDB-ubu2404
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `MV_control`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `app_pacientes`
--

CREATE TABLE `app_pacientes` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `widget` varchar(255) NOT NULL,
  `visitas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `app_pacientes`
--

INSERT INTO `app_pacientes` (`id`, `uid`, `widget`, `visitas`) VALUES
(1, 1, 'chat_page', 33),
(2, 1, 'notes_page', 24),
(3, 1, 'report_weight_modal', 5),
(4, 1, 'resume_page', 59),
(5, 1, 'collection_of_collections_expanded', 8),
(6, 1, 'cvs_expanded_amneris_inciarte', 2),
(7, 1, 'graphics_of_weight_fat_expanded', 5),
(8, 1, 'hexagon_button_emotions_menu', 4),
(9, 1, 'hexagon_button_exercise_menu', 4),
(10, 1, 'hexagon_button_feeding_menu', 4),
(11, 1, 'mistakes_expanded', 6),
(12, 1, 'profile_page', 10),
(13, 1, 'seven_day_report_expanded', 15),
(14, 1, 'stars_rating_bar', 4),
(15, 1, 'cvs_expanded_fernando_vargas', 1),
(16, 1, 'personal_information_expanded', 2),
(17, 1, 'contact_whatsapp_button_24_7', 1),
(18, 1, 'chat_page2', 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingresos`
--

CREATE TABLE `ingresos` (
  `id` int(11) NOT NULL,
  `pid` int(11) NOT NULL COMMENT 'paciente',
  `aid` int(11) NOT NULL COMMENT 'admin',
  `fecha` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `ingresos`
--

INSERT INTO `ingresos` (`id`, `pid`, `aid`, `fecha`) VALUES
(1, 2056, 1, '2024-10-02 04:09:27'),
(2, 2057, 1, '2024-10-02 04:09:41'),
(3, 2058, 1, '2024-10-02 04:10:48'),
(4, 2059, 1, '2024-10-02 04:11:45'),
(5, 2060, 1, '2024-10-02 04:12:06'),
(6, 2061, 1, '2024-10-02 04:12:38'),
(7, 2062, 1, '2024-10-02 04:12:46'),
(8, 2063, 1, '2024-10-02 04:14:45'),
(9, 2064, 1, '2024-10-02 04:15:09'),
(10, 2065, 1, '2024-10-02 14:52:49'),
(11, 2066, 1, '2024-10-02 15:27:45'),
(12, 2067, 1, '2024-10-05 16:47:26'),
(13, 2068, 1, '2024-10-05 17:05:14'),
(14, 2069, 1, '2024-10-05 17:06:00'),
(15, 2070, 1, '2024-10-05 17:12:21'),
(16, 2071, 1, '2024-10-05 20:04:37'),
(17, 2072, 1, '2024-10-06 02:06:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visitas`
--

CREATE TABLE `visitas` (
  `id` int(11) NOT NULL,
  `path` text NOT NULL,
  `uid` int(11) DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `metodo` varchar(10) NOT NULL,
  `fecha_r` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `visitas`
--

INSERT INTO `visitas` (`id`, `path`, `uid`, `ip`, `metodo`, `fecha_r`) VALUES
(3, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'post', '2024-07-01 00:19:40'),
(4, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:20:44'),
(5, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:20:58'),
(6, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:22:09'),
(7, '/piscis/v1/basic/', NULL, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:22:26'),
(8, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:23:09'),
(9, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:39:35'),
(10, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:40:48'),
(11, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:43:23'),
(12, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:43:33'),
(13, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:44:53'),
(14, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:45:38'),
(15, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:45:45'),
(16, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:46:38'),
(17, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:47:41'),
(18, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:48:38'),
(19, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:50:57'),
(20, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:51:44'),
(21, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:51:51'),
(22, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:53:52'),
(23, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:56:47'),
(24, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:56:48'),
(25, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:56:51'),
(26, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:56:52'),
(27, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:56:54'),
(28, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:56:55'),
(29, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:57:44'),
(30, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:57:45'),
(31, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:57:46'),
(32, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:57:48'),
(33, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:57:49'),
(34, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:58:16'),
(35, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:58:26'),
(36, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:58:27'),
(37, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:58:28'),
(38, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:58:33'),
(39, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:58:34'),
(40, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:58:35'),
(41, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:58:36'),
(42, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 00:58:36'),
(43, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 13:14:08'),
(44, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 13:14:09'),
(45, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 13:14:11'),
(46, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 13:14:11'),
(47, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 13:14:12'),
(48, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 13:14:13'),
(49, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 13:14:13'),
(50, '/piscis/v1/basic/', 1, '::ffff:127.0.0.1', 'GET', '2024-07-01 13:14:19');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `app_pacientes`
--
ALTER TABLE `app_pacientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`);

--
-- Indices de la tabla `ingresos`
--
ALTER TABLE `ingresos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `visitas`
--
ALTER TABLE `visitas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `app_pacientes`
--
ALTER TABLE `app_pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `ingresos`
--
ALTER TABLE `ingresos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `visitas`
--
ALTER TABLE `visitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
