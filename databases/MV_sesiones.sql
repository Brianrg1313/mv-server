-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-10-2024 a las 22:09:08
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
-- Base de datos: `MV_sesiones`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asociacion`
--

CREATE TABLE `asociacion` (
  `id` int(11) NOT NULL,
  `tipo` int(1) NOT NULL COMMENT 'Admin o paciente',
  `uid` int(11) NOT NULL COMMENT 'usuario',
  `did` int(11) NOT NULL COMMENT 'dispositivo',
  `estado` int(1) DEFAULT NULL COMMENT 'estado'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `asociacion`
--

INSERT INTO `asociacion` (`id`, `tipo`, `uid`, `did`, `estado`) VALUES
(1, 1, 42, 1, NULL),
(2, 2, 1, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dispositivos`
--

CREATE TABLE `dispositivos` (
  `id` int(11) NOT NULL,
  `dis` varchar(255) NOT NULL COMMENT 'Dispositivo',
  `blq` tinyint(1) DEFAULT NULL COMMENT 'Bloqueo',
  `fch_r` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Fecha Registro'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `dispositivos`
--

INSERT INTO `dispositivos` (`id`, `dis`, `blq`, `fch_r`) VALUES
(1, 'c89208ec-d15e-4dbc-9936-8a4346ba4e4d', NULL, '2024-08-14 20:21:18'),
(2, 'UP1A.231005.007', NULL, '2024-08-15 13:55:29'),
(3, 'todo.web.browser', NULL, '2024-08-15 20:07:09'),
(4, '{A5AD2CE7-9D62-4EF5-B7BD-F42AFE8F592C}', NULL, '2024-08-15 20:20:37'),
(5, '796955DE-4CB5-411E-846A-031D5D87FC2B', NULL, '2024-08-26 21:27:10'),
(6, 'F0EFF1A6-8B4C-4A91-A5C1-8E58D456D8B9', NULL, '2024-08-26 21:33:45'),
(7, 'AP31.240617.003', NULL, '2024-09-03 16:39:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones`
--

CREATE TABLE `sesiones` (
  `id` int(11) NOT NULL,
  `tipo` int(1) DEFAULT NULL,
  `uid` int(11) NOT NULL,
  `accs` varchar(40) NOT NULL,
  `dispositivo` int(11) NOT NULL,
  `estado` int(1) DEFAULT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `sesiones`
--

INSERT INTO `sesiones` (`id`, `tipo`, `uid`, `accs`, `dispositivo`, `estado`, `fecha`) VALUES
(1, 2, 1, 'NDEk6AWJGSQ1G9fREvHDdXIGGFXnHLpn5FfNBocy', 1, NULL, '2024-08-14 20:21:18'),
(2, 2, 1, 'tqGcOW1dpGXOk2FOSYlOu02vPi3YMUAaIF3SN0Bj', 1, NULL, '2024-08-14 20:21:21'),
(3, 2, 1, 'Ex1S06AQxeeieiDtYwB08q9xhdgqn3aGDnvTB1BK', 1, NULL, '2024-08-14 20:21:23'),
(4, 1, 1, 'lsFNMgsaJtkvBvAvdLBtt5pjM8w8ikzyYhspv30Q', 1, NULL, '2024-08-14 20:24:17'),
(5, 2, 1, 'DTufS0hbMqUOr2aDp8DlJfC1c4BeEC7w3Q9jP8M8', 1, NULL, '2024-08-14 20:24:58'),
(6, 1, 1, 's5TFrk4llkoH1GgjvMT0Cd7pEorCoR9cN53Y4h5P', 1, NULL, '2024-08-14 20:38:14'),
(7, 2, 1, '5MHHIqIpAQCofJZDW0jQ0P3gvtpCBI6cuBdjqGAm', 1, NULL, '2024-08-14 20:40:24'),
(8, 2, 1, 'LLkVtOHZ2zitqPETZl4Kfwy0x2hCiN0TFcbDUV9D', 1, NULL, '2024-08-14 20:40:36'),
(9, 2, 1, 'GvivhaJejUS7tCOt9L3vmNG6ZPVmMAavQ0wNLJ2O', 1, NULL, '2024-08-14 21:00:58'),
(10, 1, 1, 'sGjpqGtbCsSF0Toi6TDIa3fetXBgtRmIl9XEY4dq', 1, NULL, '2024-08-14 21:01:03'),
(11, 1, 1, '1S72lmivXlQJObleolcM4pw9AMUZaV5alfjWCsCy', 1, NULL, '2024-08-14 21:09:10'),
(12, 2, 1, '7RTSpRfI2vupoQuRpfIHDbek0hdjGUFeY2epfWbT', 2, NULL, '2024-08-15 13:56:38'),
(13, 2, 1, 'GTrV79Hf7Z3kY9ByJOrzQoiVWFDxFkhCDaMCb5jj', 2, NULL, '2024-08-15 14:19:59'),
(14, 2, 1, 'qbng4bsnKhqtU66WXExz4mozGuKWXURxtdC8Ah66', 2, NULL, '2024-08-15 14:20:03'),
(15, 2, 1, '1Fqa80zEaAqF2SKsEpMpSPq253mUJoW5bZ9Z2k17', 2, NULL, '2024-08-15 14:20:05'),
(16, 2, 1, 'Nfodya19zevYKF4iqQ7UfXBfjbiF9IzR6GczsEGI', 2, NULL, '2024-08-15 14:20:13'),
(17, 2, 1, 'poaAQz1lZ5YDvqgIfDQcQtUD2GG8URIRhmckpm6U', 2, NULL, '2024-08-15 14:20:14'),
(18, 2, 1, 'h792WttzrttkapPqMbvzJ04gm1PdpbyrpduuOtKg', 2, NULL, '2024-08-15 14:20:15'),
(19, 2, 1, 'NhrXxkx5F07cjejBEwj5od6blSDFV6a87RuPNWDS', 2, NULL, '2024-08-15 14:20:24'),
(20, 2, 1, 'JlsP9vxGDXMcHrCCmszdbwna56J6D81bI58x5CKK', 2, NULL, '2024-08-15 14:20:45'),
(21, 2, 1, 'U3F2buzwXOlFBMLrBgbgvQUfe73OxZMiq8ExKDPQ', 2, NULL, '2024-08-15 14:21:14'),
(22, 2, 1, 'RV3UiZvLPS3mvbkVxCWpRI1QkLJ683AhhfmshfwL', 2, NULL, '2024-08-15 14:23:07'),
(23, 1, 1, '0rLLxsZcnxJBkAQcaHgmdfEd4FFqVKMqLRqgeAed', 2, NULL, '2024-08-15 15:26:39'),
(24, 2, 1, 'fNQTlIo1KJVV9iA6dzR99EZWsjft0Mz1RkczRZyN', 3, NULL, '2024-08-15 20:07:09'),
(25, 2, 1, 'CMLO7sRXfYhU9X0BQOBBue0eo4ue5YT4r128egyz', 2, NULL, '2024-08-15 20:15:30'),
(26, 2, 1, 'umwUhCFCimMVMQmvza7olpGqpd41wrfLCO1sxaVE', 4, NULL, '2024-08-15 20:20:37'),
(27, 2, 1, 'VpWTvQpgnLwp4fvyEm9LFOEoYPOc0siQuOsdoxLy', 3, NULL, '2024-08-15 20:29:35'),
(28, 2, 1, 'AUZQZXrLKPV0CQdMRmJYh0kxVRsSBJcHWxOcidtc', 3, NULL, '2024-08-15 22:22:05'),
(29, 2, 1, 'uhgnEp1JCqSNJD93GtqMfWiwFDE3q9iWwltIVpRO', 3, NULL, '2024-08-16 05:00:08'),
(30, 1, 11, 'yC0mAWt7v6uodXCjoyYS7wKbV0TPpmcuJKQjqFdt', 1, NULL, '2024-08-19 22:09:08'),
(31, 1, 11, 'HTsfj70mEYw4OqlRsK3uiLmJ0a0qq1NYUUBgE1yb', 1, NULL, '2024-08-19 22:09:10'),
(32, 1, 11, 'ko3DAawcu3UQsZefLRRXgQHeSM1hAqFZr8nGw5j2', 1, NULL, '2024-08-19 22:09:25'),
(33, 1, 11, 'Y0z3njQHooa4Hr8JC8sFO0mgQQjmM7b2pFYqViEp', 1, NULL, '2024-08-19 22:27:23'),
(34, 1, 11, '0Y4HqZCr7J7TpycFywGvgmFGChzCFXZuXhJQ4Cji', 1, NULL, '2024-08-19 22:27:35'),
(35, 1, 11, 'GHZlY56qwK8aAGqtcOijtaJvWxT08q89VjVmDrEw', 1, NULL, '2024-08-19 22:28:43'),
(36, 2, 1, 'nXqh5K3iA6QhOibyLiUyOJDwdSiOwlxRVmyJ8zrf', 1, NULL, '2024-08-19 22:36:17'),
(37, 1, 1, 'C4rDaP30H9BQbVkyeVVsOFx8csDk8r7ehvC3O7fz', 1, NULL, '2024-08-21 22:58:47'),
(38, 1, 3, 'TtZDu9tsSsqFuKqaYFI1OUOiMEvjgdd5HMgIFGwQ', 1, NULL, '2024-08-21 22:59:28'),
(39, 1, 2, 'F1efqeOgy0Ipu4LhJqk8V94dWBN7Ku2HQp7SD4bx', 1, NULL, '2024-08-22 21:53:32'),
(40, 1, 11, '4NEDeja4oamdumTPpszNaiR9yC6dadFvZPVcnJud', 1, NULL, '2024-08-22 21:54:03'),
(41, 1, 42, 'jDPtHW6hPvbCnPprvZ62HOtu1RFPgUOpUZkHbtwX', 1, NULL, '2024-08-22 21:54:20'),
(42, 2, 1, 'IkZhB0yxz6EwM9rYwyGVrUZdA9p4BrW9bBxdfpgX', 4, NULL, '2024-08-24 19:19:55'),
(43, 2, 1, 'dYvRlV0T3S4Wd72gImTtd1gFB14o69YdVZF3MoEf', 5, NULL, '2024-08-26 21:27:10'),
(44, 2, 1, '4GJLbpjSwzKHeB9j0Jw8Ejg6MuORbjgvfMeQq5bw', 6, NULL, '2024-08-26 21:33:45'),
(45, 2, 1, 'KfwB7xJ05bOfp87q0I1Z0FRkqU0yjJ71h2MpkRvm', 5, NULL, '2024-08-26 21:38:05'),
(46, 2, 1, '1C56F8SiAWuxwdIXxJyqqUlaNDUSuuVyvHuXIEl7', 2, NULL, '2024-08-28 18:34:43'),
(47, 2, 1, 'c2qBSnSkfbgtS8xa3cVro1JOZbp4T15fbz5f2snI', 7, NULL, '2024-09-03 16:39:38'),
(48, 2, 1, 'xaWFSYKtfiw4CPHAT7C77c1Z1q6ngbBqijJrqs6C', 4, NULL, '2024-09-04 12:59:45'),
(49, 2, 1, 'vqwQD2QWFoJfYmEMMPTvAzyNEpJFxwISPafRpnsB', 1, NULL, '2024-09-04 18:07:02'),
(50, 1, 42, '2elPlRz76waP39YXz6kCKWE9EYjW49Bmm8OeQPvh', 1, NULL, '2024-09-09 14:42:47'),
(51, 1, 42, 'AtiqVEly9FmzgQICKKr9qhC2TTGUe6FrHVZ7SwNP', 1, NULL, '2024-09-09 15:07:11'),
(52, 1, 42, 'B2qGn48PmxlJrDPi1vjqeXKakhpAD7VAzq9lGcic', 1, NULL, '2024-09-09 15:09:09'),
(53, 1, 42, 'z5sABnmOLdVzz2qkFukVGG2eCRChBKQVxdeYEkuU', 1, NULL, '2024-09-09 15:09:20'),
(54, 1, 42, 'Na49TLKBM8XupPlrL3ONloSVe3QwiuBl8SnX2O1I', 1, NULL, '2024-09-09 15:09:42'),
(55, 1, 42, 'RIvSR4xU3rynB4AeCeCmtd7SE9sMAdRRSoU93dAJ', 1, NULL, '2024-09-09 15:20:40'),
(56, 1, 42, 'KqNlcO8M56xx3fmTCfFfay3p1GsEmU2xxmBKzElV', 1, NULL, '2024-09-09 15:20:57'),
(57, 1, 42, 'yM1qVTJrONKvvmUInVoCHf258A2KyG1ZaQ5elEdl', 1, NULL, '2024-09-09 15:20:59'),
(58, 1, 42, '990Jt5EsqKUx5XZ47Qbzc8oyD2sfmOf4iNguCeQ6', 1, NULL, '2024-09-09 15:21:49'),
(59, 1, 42, '61b8eautO27JAKY4nVwKvfjMOuBiJ2VmCF6glt6S', 1, NULL, '2024-09-09 15:22:12'),
(60, 1, 42, 'vsiTl0sp8r5eJtIjvREcaDXQHTSFdo9l1yN4Y28J', 1, NULL, '2024-09-09 15:22:25'),
(61, 1, 42, 'atHUE2kLLHd9Fr3z9NRuWYgugZg9PzbIt9rGSVa2', 1, NULL, '2024-09-09 15:22:50'),
(62, 1, 42, 'QHckz6yBD5IUi3J69Ml2fPiVmMQcKJXKRgR4lvQz', 1, NULL, '2024-09-09 15:22:51'),
(63, 1, 42, 'DQoAAR7ZrQQGevXnaoCh55bYqNfV0Wz7u30TUSLB', 1, NULL, '2024-09-09 15:22:52'),
(64, 1, 42, '8S2HbqxLMm2GCq3RSUlyIoqgmzMKU1Ew6DuVRZF4', 1, NULL, '2024-09-09 15:25:41'),
(65, 1, 42, 'AcVW4GWKzroMLzXJfIjmk8EiavfeedLeXi1oVXSl', 1, NULL, '2024-09-09 15:26:08'),
(66, 1, 42, '1rWpYW6PkamWLbNyE0XhFuwBt7HOeArjvOmpPXG7', 1, NULL, '2024-09-09 15:26:18'),
(67, 1, 42, '1zzDAENZw8XNaoiKk8jayl07G1kZQxjN6Lx5m1Hk', 1, NULL, '2024-09-09 15:26:21'),
(68, 1, 42, '7hk16i0sPHIKOmMzvisQJaSBxYQl4266wT4nI36K', 1, NULL, '2024-09-09 15:26:29'),
(69, 1, 42, 'ui7sCQc35WIefiYml4LWOWSFs6EBV925QGHhSwix', 1, NULL, '2024-09-09 15:26:32'),
(70, 2, 1, 'y9Pgsy9E81ndO16BSaV97p8jGPL0SeY48cT5KgE7', 1, NULL, '2024-09-09 15:27:02'),
(71, 2, 1, 'nEc5GvU8HChnNmkucZ4oJW8ikXPJGyJWXgwq2PYd', 1, NULL, '2024-09-09 15:37:49'),
(72, 2, 1, '3sichCWFygthoHfz6Y5kuEVrTizHfA5RNEYmkpVo', 1, NULL, '2024-09-09 15:37:51'),
(73, 2, 1, 'AxO8R7bk4M9Fd8nybouzx4eKlteT2MGugJolLTMw', 2, NULL, '2024-09-29 19:02:01'),
(74, 2, 1, 'Cl3XZ7E0o5NcEk7TMY8pbAiB8ahnkgyTc08BuOrn', 2, NULL, '2024-09-29 19:10:33'),
(75, 2, 1, 'fssjOocFrNXimfPsiubMzO0Taso2CkNuuuZ8LVfa', 1, NULL, '2024-10-01 23:04:04'),
(76, 2, 1, 'dHoZbQQmvtF7snctoQtxFg4YTzGmIR2XESoCTBys', 1, NULL, '2024-10-01 23:10:29'),
(77, 2, 1, '2ig5yhBq1IqviqwWLbEFBRlToD8GNDyRnRD7TIDf', 1, NULL, '2024-10-01 23:12:14'),
(78, 2, 1, 'QFcJR87zDzaCPytJDN7FgwKJglldayR3J5tCcWDx', 1, NULL, '2024-10-05 02:46:38'),
(79, 2, 1, 'ZyGJ8EXfLGYwzPGjCc0hkS2UOyFDmQFKrFACyfjm', 1, NULL, '2024-10-05 03:10:17'),
(80, 1, 42, 'hwPHwaI6JOTtNJrdmqB8rAFW6rdVBTx5zOlNV4Jq', 1, NULL, '2024-10-05 03:12:16'),
(81, 2, 1, 'NhA8FbylAIDymbnKK64IrzfAu6jtIf4T6Oxxcv2s', 2, NULL, '2024-10-05 04:15:56');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asociacion`
--
ALTER TABLE `asociacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `dispositivos`
--
ALTER TABLE `dispositivos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UID` (`uid`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asociacion`
--
ALTER TABLE `asociacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `dispositivos`
--
ALTER TABLE `dispositivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
