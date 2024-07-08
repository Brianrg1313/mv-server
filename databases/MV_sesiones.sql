-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-07-2024 a las 14:07:36
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
(1, 'c89208ec-d15e-4dbc-9936-8a4346ba4e4d', NULL, '2024-06-13 03:10:42'),
(2, 'TP1A.220624.014', NULL, '2024-06-29 16:30:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones`
--

CREATE TABLE `sesiones` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `accs` varchar(40) NOT NULL,
  `dispositivo` int(11) NOT NULL,
  `estado` int(1) DEFAULT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `sesiones`
--

INSERT INTO `sesiones` (`id`, `uid`, `accs`, `dispositivo`, `estado`, `fecha`) VALUES
(1, 1, 'eXvqyUavOIr2j81eDFrqL7vGX9Ty9wDx7ehDQdqh', 1, NULL, '2024-06-13 14:24:10'),
(2, 1, 'GRk6CJcorHALID1Rv3sTsM2i1QG3gahIC4VPjK1E', 1, NULL, '2024-06-13 20:32:45'),
(3, 1, 'EzIk05PTtEb3hJSkWWgV4PuxpYCQq8CP8MUhwtyC', 1, NULL, '2024-06-23 02:39:06'),
(4, 1, 'mP9QfIj2R0SbwyE0a7twP8gKVu2tzusHv85xH8Uk', 1, NULL, '2024-06-23 02:39:12'),
(5, 1, 'EVso64JOcMNsBjhlxuSZ2SQ8IXyqdW6e78ZAZprH', 1, NULL, '2024-06-23 02:39:13'),
(6, 1, 'ZHeI1dQZJfQPx71CO7aSRDlZGt1GuTBuUT9fK2Lz', 2, NULL, '2024-06-29 16:37:14'),
(7, 1, 'GmYxlBel8ooemPbhciXWNgb6KORgjLq4BdzToOso', 2, NULL, '2024-06-29 16:42:29'),
(8, 1, 'wuToezzqopVtfZhx9jzMGvpJPOo9SjLDlvlvWeXp', 2, NULL, '2024-06-29 16:44:44'),
(9, 1, 'mghcSQ4Otka2ouRKLVb4XEDguhKxnkj4aCVVOrPQ', 2, NULL, '2024-06-29 16:44:45'),
(10, 1, 'B5ostIfZFjNGImuBQAJLUKt6ms2dyuARWZjkmrpr', 2, NULL, '2024-06-29 16:45:31'),
(11, 1, '87y4TDTdEdiOtV37Rp3tI06jBTI1tsKWx2YoMNDa', 2, NULL, '2024-06-29 16:46:33'),
(12, 1, '98xuC5KK5Gsz2TQJpK7CtCrYFGCAafWcuIVrTKYh', 2, NULL, '2024-06-29 16:48:44'),
(13, 1, 'SWfjjvJI83ykENOcnCFxlPtUmtYULBXGortxZLXA', 2, NULL, '2024-06-29 17:19:51'),
(14, 1, '0rZIjCj1sEoiYg3mNf3kXUxh3AVAZ5jr2Ito1T6C', 2, NULL, '2024-06-29 17:19:53'),
(15, 1, '0hxcEtc2oE4XGj8cZAZ3HACeHfdHowlLZMK6Hgue', 2, NULL, '2024-06-29 20:03:58'),
(16, 1, 'eWPJ6YFSO5bvDiGvxbs2xRkMHSZ8gcnBjtIcGWLy', 2, NULL, '2024-06-30 00:38:08'),
(17, 1, 'krgvylMXHp4eLdfgzODkEHs1avIzed07OjwWswTP', 2, NULL, '2024-06-30 00:53:33'),
(18, 1, 'pbZCxaSwQxwkB7LZf8jC2sb5v8HafwDHPT69TuAC', 2, NULL, '2024-06-30 01:05:54'),
(19, 1, '2ARfXua3bTRFOwMqvSbfFOerEWbGrquFz1sUOV5v', 2, NULL, '2024-06-30 01:07:15'),
(20, 1, '2BdaOXISYl4HfPqW6MOpLHyAztmPpnMMIbdmQ4vz', 2, NULL, '2024-06-30 01:35:04'),
(21, 1, 'IMmycSIKoWzkC66DgRzZynjHLp5Ibnrsd6vMe7ve', 1, NULL, '2024-06-30 01:47:14'),
(22, 1, 'T77PHtGG22ICEjM7vaUQaNpaStqOFH5y2vUepy0E', 1, NULL, '2024-06-30 01:50:59'),
(23, 1, 'Jy6ICj9hVpQMdXF5rqF6Hx6qQ1w8QvIms63udXRl', 1, NULL, '2024-06-30 01:51:24'),
(24, 1, 'QI2zautuybtZAdiJ8bOLB5tCQU7SKXGaZqYbuzct', 1, NULL, '2024-06-30 01:51:48'),
(25, 1, 'aOoOVTQpESNwSgVPXy2TbHfWYRdZ1dZe4Sio4LzF', 1, NULL, '2024-06-30 01:52:34'),
(26, 1, '2ZLFuv3GnlT3FAUfWp7FM8LLed35HlZoSi0kjVb6', 2, NULL, '2024-06-30 01:57:57'),
(27, 1, 'uGd9XvZiHoOjFRO5xlbWoWpVeGk5GkjvaT59a1YE', 2, NULL, '2024-06-30 01:58:32'),
(28, 1, 'cRtjOe5ecVRn7dWrhPxpTXEDKs7XVd2dfYKQAZ3R', 1, NULL, '2024-06-30 02:00:25'),
(29, 1, 'iJVpLq10NhGWvuZq9DkBQMb7UQtSmn7RVHQ5NhDB', 2, NULL, '2024-06-30 02:05:22'),
(30, 1, 'o2fdqVXxoZQRnVHVKQ15uh44yk30gdMeNj5N2kXz', 2, NULL, '2024-06-30 02:20:00'),
(31, 1, 'VvD7QIOu1erd2We1Ir6LRX9Uf9UPCjsMnUN9qUGP', 2, NULL, '2024-06-30 14:13:25'),
(32, 1, 'ZVYfJDCpwSuRWBCoOkbtyOcdTF6jFJ40YnF5qKfW', 2, NULL, '2024-06-30 14:31:40'),
(33, 1, 'vEOiWOYM17VA0cvThqDpPrsPod3gxBbaEkbxlx2A', 2, NULL, '2024-06-30 14:36:49'),
(34, 1, 'uTSxFBKcC4yItBYNIVkDfka1F2qiYb56HzS4wXia', 2, NULL, '2024-06-30 14:46:12'),
(35, 1, 'AKRCqL2Q96gXUEpUnu5Cjukq0p1I6cnmchHMIRo8', 2, NULL, '2024-06-30 14:50:53'),
(36, 1, 'XBEo9jxfzGB38B6kld8AzF1Bw9tWuD0L56W3KyiD', 2, NULL, '2024-06-30 15:42:35'),
(37, 1, 'LOg0lK5tLn6rg8iLv8cexpeZoUu8gesQBGbu9UUl', 2, NULL, '2024-06-30 15:55:13'),
(38, 1, 'XHa5D6FGo3m4BaiD1F3e6azYtiFFcptpjRAlmjlR', 2, NULL, '2024-06-30 16:57:50'),
(39, 1, 'wluEZhKiaSqH8TcsZJKtc2GOTwNE5joxQAzk1JO8', 2, NULL, '2024-06-30 16:58:10'),
(40, 1, '577XU4suZIHpbIoG2M5KGR3In9jCPzMqCAqGrHEA', 2, NULL, '2024-06-30 17:37:17'),
(41, 1, 'v2AdJA5WYWVyB6aOufiazhr6ksYh0LVHM1LBEOYU', 2, NULL, '2024-06-30 17:48:33'),
(42, 1, '3UezSFz07u3qCpHbiTEpwb8FJ3LAPAdZpzvBeHks', 2, NULL, '2024-06-30 17:51:30'),
(43, 1, '8ayY1N0p4WaML6KsoKRReDe7ej87EXWBkkOdtioJ', 2, NULL, '2024-06-30 17:52:20'),
(44, 1, 'ABcThR8cDgqiKfbLVE1lQZgT8jm91WpXVTTeVEhf', 2, NULL, '2024-06-30 18:41:01'),
(45, 1, 'IDIhnnqPyoyfi2V03jIVczzEW8MtwSx590lrXkhq', 1, NULL, '2024-06-30 18:50:07'),
(46, 1, 'yNCa2AuvOv0x01cG9yWm1kMvIJbuH7RvMKw1AmKG', 1, NULL, '2024-06-30 22:58:07'),
(47, 1, 'E7MX5nmfOe8GIXwl1miOX3jUvLkBA5D6t8rpiCpk', 1, NULL, '2024-06-30 22:58:57'),
(48, 1, 'wneskrXLCq1HhkNPtyJ4gks1LmnH8TEkMtBeo1Fl', 1, NULL, '2024-06-30 22:58:58'),
(49, 1, 'tLPNeIDOTkr6rVqF1Ec0wGe6mBH8hXWtqhMWYFft', 1, NULL, '2024-06-30 22:59:09'),
(50, 1, 'D8qYNu7CQHZDMulTswjtQfwfoF3DEZHlVKmFSByx', 1, NULL, '2024-06-30 22:59:10'),
(51, 1, 'WPxXrRJuXewewLmN5xnWMZgBedDqlmDDugO9bM0Z', 1, NULL, '2024-06-30 22:59:11'),
(52, 1, '1KfMagT7YahCtfOJ7DacJVt1stod7GuLPugCWuCt', 1, NULL, '2024-07-01 00:18:05'),
(53, 1, 'xggwhJYNyURKCR2927a1BamB2923yj7d6nY1sX83', 1, NULL, '2024-07-01 00:18:44'),
(54, 1, 'p7vZagzv2rNGyv1v816i6645TrNZWBSGfbTD2EdQ', 1, NULL, '2024-07-01 00:18:45'),
(55, 1, 's5r42vX4pEsou8VXWrAuhW0XvvuO0PNs6zRwoXig', 1, NULL, '2024-07-01 14:57:17'),
(56, 1, '69lDBZYGzifSdowCkKVpH3PLa5cxmAvRi2UO3Z1U', 1, NULL, '2024-07-01 14:57:17'),
(57, 1, 'bBM7VD78l776NdhJBncdELyr4mhh9Z3A6jAhnMA8', 2, NULL, '2024-07-01 16:06:58'),
(58, 1, 'vrwim4OoMCxihLKi8WHNrJGvBazhvmlJuo39M6pz', 2, NULL, '2024-07-01 21:19:55'),
(59, 1, '9ZKeH52YJLE9B2Wu653073pFOsPyqk4yqBnwacIi', 2, NULL, '2024-07-01 21:20:56'),
(60, 1, 'kmqS64ntOUNXGFTN9n3uZofRxLM8cKRihZf5aox7', 2, NULL, '2024-07-01 22:02:28'),
(61, 1, 'fQJmeELcoOpPwu2xu1MMbO9gk8pAaFKkHhS1pUsZ', 2, NULL, '2024-07-02 02:29:34'),
(62, 1, 'wezHxJ9HE7Pqa7lRyw89NQAJKGaRvG9XMvgNLZr4', 2, NULL, '2024-07-02 02:34:14'),
(63, 1, 'JhDhUc9lgIlChMpMoIXgl8UsAioXFZTTtNU5sdSL', 2, NULL, '2024-07-02 02:34:55'),
(64, 1, '623QC16bwscUaFnIoxnYSlWiTi2SCOeKdqL9YbzJ', 2, NULL, '2024-07-02 02:35:35'),
(65, 1, 'aQWRwFger4notbBA9p2zY1za1OVf3k90jrPlRg5S', 2, NULL, '2024-07-02 02:38:01'),
(66, 1, 'L9rNTFVhmbnruZxqkWMsEB494YStHRonHx6AUE2E', 2, NULL, '2024-07-02 02:38:29'),
(67, 1, 'do0rJO0G30fAmyLGHNKdmtYXKO4Lozd8tsXRJweN', 2, NULL, '2024-07-02 03:26:32'),
(68, 1, 'SOMoC41V7h5h7EcMF0I97KCYovd1CmC2hRMllntZ', 2, NULL, '2024-07-02 03:27:05'),
(69, 1, 'Omg43u7v0aBSjaaJwKQs5U1r7fVvn80GUFScLri4', 2, NULL, '2024-07-02 03:27:32'),
(70, 1, '3Ip9VE6Q2t2mvuYc4F1qWuKpluyQdmeA04vo7PkD', 2, NULL, '2024-07-02 03:54:23');

--
-- Índices para tablas volcadas
--

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
-- AUTO_INCREMENT de la tabla `dispositivos`
--
ALTER TABLE `dispositivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
