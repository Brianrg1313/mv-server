-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-07-2024 a las 14:07:32
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
-- Base de datos: `MV_pacientes`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `complementarios`
--

CREATE TABLE `complementarios` (
  `uid` int(11) NOT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `parroquia` varchar(255) DEFAULT NULL,
  `coordenadas` varchar(100) DEFAULT NULL,
  `profesion` varchar(100) DEFAULT NULL,
  `sangre` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `complementarios`
--

INSERT INTO `complementarios` (`uid`, `pais`, `ciudad`, `parroquia`, `coordenadas`, `profesion`, `sangre`) VALUES
(1, 'venzuela', 'caracas', NULL, NULL, 'Desarrollador', 'B-');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contrasenas`
--

CREATE TABLE `contrasenas` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `contrasena` text DEFAULT NULL,
  `estado` int(1) DEFAULT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `contrasenas`
--

INSERT INTO `contrasenas` (`id`, `uid`, `contrasena`, `estado`, `fecha`) VALUES
(1, 1, 'dsafsdafsdfsdf', NULL, '2024-06-13 00:33:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `tdni` varchar(10) NOT NULL,
  `dni` varchar(30) NOT NULL,
  `nacimiento` datetime NOT NULL,
  `sexo` varchar(1) NOT NULL,
  `estado` int(1) DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `correo`, `usuario`, `telefono`, `tdni`, `dni`, `nacimiento`, `sexo`, `estado`, `fecha_inicio`, `fecha_registro`) VALUES
(1, 'brian', 'rangel', 'brianrg1313@icloud.com', 'brianrg1313', '584149277243', 'v', '27107948', '1999-04-13 00:00:00', 'm', NULL, '2024-06-06 00:00:00', '2024-06-13 00:11:25');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `complementarios`
--
ALTER TABLE `complementarios`
  ADD PRIMARY KEY (`uid`);

--
-- Indices de la tabla `contrasenas`
--
ALTER TABLE `contrasenas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UID` (`uid`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`,`usuario`,`telefono`),
  ADD KEY `correo_2` (`correo`,`usuario`,`telefono`,`dni`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `contrasenas`
--
ALTER TABLE `contrasenas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
