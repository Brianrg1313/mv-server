-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-07-2024 a las 14:07:29
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
-- Indices de la tabla `visitas`
--
ALTER TABLE `visitas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `visitas`
--
ALTER TABLE `visitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
