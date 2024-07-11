-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-07-2024 a las 17:15:10
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
-- Base de datos: `MV_app`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colecciones`
--

CREATE TABLE `colecciones` (
  `id` int(11) NOT NULL,
  `titulo` varchar(50) NOT NULL,
  `icono` varchar(50) DEFAULT NULL,
  `posicion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `colecciones`
--

INSERT INTO `colecciones` (`id`, `titulo`, `icono`, `posicion`) VALUES
(1, 'Estado de salud', NULL, NULL),
(2, 'Mediciones biológicas', NULL, NULL),
(3, 'Promedio semanal', NULL, NULL),
(4, 'Auditorias', NULL, NULL),
(5, 'Actitudes', NULL, NULL),
(6, 'Medio ambiente', NULL, NULL),
(7, 'Reprogramación', NULL, NULL),
(8, 'PSI (Flores)', NULL, NULL),
(9, 'Nutrición', NULL, NULL),
(10, 'Ejercicios', NULL, NULL),
(11, 'Síntomas', NULL, NULL),
(12, 'Órganos', NULL, NULL),
(13, 'Enfermedades', NULL, NULL),
(14, 'Tratamientos', NULL, NULL),
(15, 'Estudios pendientes', NULL, NULL),
(16, 'Interconsultas', NULL, NULL),
(17, 'Administración', NULL, NULL),
(18, 'Tienda virtual', NULL, NULL),
(19, 'Material utilizado', NULL, NULL),
(20, 'Lista de pacientes', NULL, NULL),
(21, 'Antecedentes', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diccionario`
--

CREATE TABLE `diccionario` (
  `id` int(11) NOT NULL,
  `icono` varchar(50) DEFAULT NULL,
  `variable` varchar(50) NOT NULL,
  `titulo` varchar(125) NOT NULL,
  `subtitulo` varchar(125) NOT NULL,
  `tipo` int(11) NOT NULL,
  `modo` int(11) NOT NULL,
  `coleccion` int(11) DEFAULT NULL,
  `editable` int(1) NOT NULL,
  `abreviacion` varchar(6) DEFAULT NULL,
  `pattern` varchar(50) NOT NULL,
  `posicion` int(11) DEFAULT NULL,
  `min` int(50) NOT NULL,
  `max` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `diccionario`
--

INSERT INTO `diccionario` (`id`, `icono`, `variable`, `titulo`, `subtitulo`, `tipo`, `modo`, `coleccion`, `editable`, `abreviacion`, `pattern`, `posicion`, `min`, `max`) VALUES
(1, NULL, 'fav', 'favorito', 'favorito', 1, 1, 20, 1, 'a', '0-9', NULL, 1, 11),
(2, NULL, 'general', 'Nivel de s', 'Nivel de salud', 1, 1, 1, 1, 'e', '0-5', NULL, 1, 1),
(3, NULL, 'imv', 'Índice MV', 'Índice Método Vargas', 1, 1, 1, 1, 'bf', '0-5', NULL, 1, 1),
(4, NULL, 'cintura', 'cintura/cadera', 'cintura/cadera', 1, 1, 2, 1, 'ek', '0-5', NULL, 1, 1),
(5, NULL, 'pesoperdido', 'Peso perdido', 'Peso perdido', 1, 1, 20, 1, 'dñ', '0-5', NULL, 1, 1),
(6, NULL, 'grasaperdida', 'grasa perdida', 'grasa perdida', 1, 1, 20, 1, 'du', '0-5', NULL, 1, 1),
(7, NULL, 'peso', 'Peso', 'Peso corporal', 3, 1, 2, 1, 'p', '0-9.', NULL, 1, 11),
(8, NULL, 'grasab', 'Grasa Corporal', 'Grasa Corporal', 3, 1, 2, 1, 'dp', '0-5', NULL, 1, 1),
(9, NULL, 'musculo', 'Músculos', 'Músculos en kilos', 3, 1, 2, 1, NULL, '0-5', NULL, 1, 1),
(10, NULL, 'pai', 'PAI 2', 'Inteligencia de Actividad Personal', 3, 1, 2, 1, NULL, '0-9', NULL, 1, 11),
(11, NULL, 'estres', 'Estrés', 'Estrés', 3, 1, 2, 1, NULL, '0-9', NULL, 1, 11),
(12, NULL, 'suenop', 'Sueño', 'Sueño', 3, 1, 2, 1, NULL, '0-9', NULL, 1, 11),
(13, NULL, 'alimentos', 'Alimentación 2', 'Resumen de Alimentación', 3, 1, 3, 1, NULL, '0-5', NULL, 1, 1),
(14, NULL, 'actitudes', 'Actitudes', 'Resumen de Actitudes', 3, 1, 3, 1, NULL, '0-5', NULL, 1, 1),
(15, NULL, 'ambiente', 'Medio ambiente', 'Resumen de Medio ambiente', 3, 1, 3, 1, NULL, '0-5', NULL, 1, 1),
(16, NULL, 'ejercicios', 'Ejercicio', 'Resumen de Ejercicios', 3, 1, 3, 1, 'g', '0-5', NULL, 1, 1),
(17, NULL, 'alimentacion', 'alimentación', 'alimentación', 1, 1, 20, 1, 'f', '0-9', NULL, 1, 11),
(18, NULL, 'emociones', 'emociones', 'emociones', 3, 1, 20, 1, 'h', '0-9', NULL, 1, 11),
(19, NULL, 'eliminar', 'Eliminar', 'Eliminar', 1, 1, 4, 1, 'DEL', '0-5', NULL, 1, 1),
(20, NULL, 'aps', 'A Psicólogo - APS', 'Auditoria Psicólogo', 2, 1, 4, 1, 'bh', '0-5', NULL, 1, 1),
(21, NULL, 'ea', 'Estudio administrador', 'Estudio administrador', 3, 1, 4, 1, 'eg', '0-5', NULL, 1, 1),
(22, NULL, 'tdp', 'Tipo de procedimiento', 'Tipo de procedimiento', 1, 1, 4, 1, 'dn', '0-5', NULL, 1, 1),
(23, NULL, 'rgest', 'Revisión Seguimiento', 'Revisión Seguimiento', 3, 1, 4, 1, 'c', '0-5', NULL, 1, 1),
(24, NULL, 'revision', 'Auditoria de Seguimiento', 'Auditoria de Seguimiento', 2, 1, 4, 1, 'dw', '0-5', NULL, 1, 1),
(25, NULL, 'seguimiento', 'Peso Semanal', 'Peso Semanal', 3, 1, 4, 1, 'dx', '0-5', NULL, 1, 1),
(26, NULL, 'apsi', 'AR metabólica - APSI', 'Auditoria reprogramación metabólica', 2, 1, 4, 1, 'bi', '0-5', NULL, 1, 1),
(27, NULL, 'anu', 'A Nutrición - ANU', 'Auditoria Nutrición', 2, 1, 4, 1, 'bj', '0-5', NULL, 1, 1),
(28, NULL, 'aej', 'A Ejercicios - AEJ', 'Auditoria Ejercicios', 2, 1, 4, 1, 'bk', '0-5', NULL, 1, 1),
(29, NULL, 'aea', 'A Ejercicios A - AEA', 'Auditoria Ejercicios Avanzado', 3, 1, 4, 1, NULL, '0-5', NULL, 1, 1),
(30, NULL, 'amc', 'A cita médica - AMC', 'Auditoria cita médica', 2, 1, 4, 1, 's', '0-5', NULL, 1, 1),
(31, NULL, 'amed', 'A médica - AMED', 'Auditoria médica', 2, 1, 4, 1, 'bm', '0-5', NULL, 1, 1),
(32, NULL, 'arel', 'A Reloj - AREL', 'Utiliza Reloj', 1, 1, 4, 1, 'bn', '0-5', NULL, 1, 1),
(33, NULL, 'abal', 'A Balanza - ABAL', 'Utiliza Balanza', 1, 1, 4, 1, 'bñ', '0-5', NULL, 1, 1),
(34, NULL, 'awa', 'A WhatsApp - AWHA', 'Utiliza WhatsApp', 1, 1, 4, 1, 'o', '0-5', NULL, 1, 1),
(35, NULL, 'eawa', 'Estado auditoria WhatsApp', 'Estado de la respuesta del paciente via WhatsApp', 3, 1, 4, 1, 'au', '0-5', NULL, 1, 1),
(36, NULL, 'aan', 'A Ansiedad - AAN', 'Siente Ansiedad', 1, 1, 4, 1, 'ba', '0-5', NULL, 1, 1),
(37, NULL, 'apc', 'A paciente comp - APC', 'Auditoria paciente complicado', 3, 1, 4, 1, 'bt', '0-5', NULL, 1, 1),
(38, NULL, 'apr', 'P rescatado - APR', 'Auditoria paciente rescatado', 3, 1, 4, 1, 'bu', '0-5', NULL, 1, 1),
(39, NULL, 'ali', 'Tab litio/dia - ALI', 'Tabletas de litio por día esta semana', 1, 1, 4, 1, 'cq', '0-5', NULL, 1, 1),
(40, NULL, 'abe', 'Tab Berberina/dia - ABE', 'Cuantas capsulas de berberina por dia esta semana', 1, 1, 4, 1, 'cp', '0-5', NULL, 1, 1),
(41, NULL, 'atb', 'Tiempo berberina - ATB', 'tiempo de berberina', 1, 1, 4, 1, 'cs', '0-5', NULL, 1, 1),
(42, NULL, 'atl', 'Tiempo litio - ATL', 'tiempo de litio', 1, 1, 4, 1, 'ct', '0-5', NULL, 1, 1),
(43, NULL, 'ttopiramoto', 'Tiempo topiramato', 'Tiempo topiramato', 1, 1, 4, 1, 'cu', '0-5', NULL, 1, 1),
(44, NULL, 'topiramotodosis', 'Topiramato dosis', 'Topiramato dosis', 1, 1, 4, 1, 'cr', '0-5', NULL, 1, 1),
(45, NULL, 'alg', 'Cuantas ligaduras - ALG', 'Cuantas ligaduras', 1, 1, 4, 1, 'cv', '0-5', NULL, 1, 1),
(46, NULL, 'tlitt', 'Disponibilidad litio - TLITT', 'Disponibilidad de litio', 1, 1, 4, 1, 'cw', '0-5', NULL, 1, 1),
(47, NULL, 'tber', 'Disponibilidad Berberia - RBER', 'Disponibilidad de Berberia', 1, 1, 4, 1, 'cx', '0-5', NULL, 1, 1),
(48, NULL, 'snac', 'Ref Rep', 'Referencia reprogramación', 1, 1, 4, 1, 'bd', '0-5', NULL, 1, 1),
(49, NULL, 'lab', 'A laboratorio - LAB', 'Auditorio laboratorio', 3, 1, 4, 1, NULL, '0-5', NULL, 1, 1),
(50, NULL, 'atfb', 'A flores B - ATFB', 'Cuanto tiempo está tomado las flores de Bach', 1, 1, 4, 1, 'bc', '0-5', NULL, 1, 1),
(51, NULL, 'pau', 'Pac autorizados - PAU', 'Pac autorizados', 3, 1, 4, 1, 'ñ', '0-5', NULL, 1, 1),
(52, NULL, 'par', 'Pacientes referidos - PAR', 'Pacientes referidos', 3, 1, 4, 1, 'bv', '0-5', NULL, 1, 1),
(53, NULL, 'ar', 'Auditoria resumen - AR', 'Auditoria resumen', 2, 1, 4, 1, 'bo', '0-5', NULL, 1, 1),
(54, NULL, 'fpd', 'FPD', 'Flores de Bach pagaron o se le obsequió', 1, 1, 4, 1, 'bb', '0-5', NULL, 1, 1),
(55, NULL, 'afl', 'AFL', 'Auditorio flores', 1, 1, 4, 1, 'dc', '0-5', NULL, 1, 1),
(56, NULL, 'telomero', 'Telomero', 'Test de Telomero', 1, 1, 4, 1, 'cy', '0-5', NULL, 1, 1),
(57, NULL, 'estrellas', 'Estrellas', 'Estrellas', 1, 1, 4, 1, 'bp', '0-5', NULL, 1, 1),
(58, NULL, 'c0', 'WhatsApp Actitudes', 'Inserción de datos vía WhatsApp', 3, 1, 5, 1, NULL, '0-5', NULL, 1, 1),
(59, NULL, 'c1', '20 cosas a la vez', 'Hacer 20 cosas a la vez', 3, 1, 5, 1, 'y', '0-5', NULL, 1, 1),
(60, NULL, 'c2', 'Todo perfecto', 'Todo debe ser perfecto', 3, 1, 5, 1, 'z', '0-5', NULL, 1, 1),
(61, NULL, 'c3', 'Ocuparse y preocuparse', 'Tendencia a no ocuparse y preocuparse', 3, 1, 5, 1, 'aa', '0-5', NULL, 1, 1),
(62, NULL, 'c4', 'Decir no', 'No saber decir no', 3, 1, 5, 1, 'ab', '0-5', NULL, 1, 1),
(63, NULL, 'c5', 'Todo rápido', 'Tendencia a hacer todo rápido', 3, 1, 5, 1, 'ac', '0-5', NULL, 1, 1),
(64, NULL, 'b0', 'WhatsApp Médio Ambiente', 'Inserción de datos vía WhatsApp', 3, 1, 6, 1, NULL, '0-5', NULL, 1, 1),
(65, NULL, 'b1', 'Pareja', 'Relación con su pareja', 3, 1, 6, 1, 'ad', '0-5', NULL, 1, 1),
(66, NULL, 'b2', 'Hijos', 'Relación con sus hijos', 3, 1, 6, 1, 'ae', '0-5', NULL, 1, 1),
(67, NULL, 'b3', 'Familia', 'Relación con su familia', 3, 1, 6, 1, 'af', '0-5', NULL, 1, 1),
(68, NULL, 'b4', 'Casa', 'Comodidad en el hogar', 3, 1, 6, 1, 'ag', '0-5', NULL, 1, 1),
(69, NULL, 'b5', 'Trabajo', 'Relación en su trabajo', 3, 1, 6, 1, 'ah', '0-5', NULL, 1, 1),
(70, NULL, 'b6', 'Enfermedad 2', 'Enfermedad', 3, 1, 6, 1, NULL, '0-5', NULL, 1, 1),
(71, NULL, 'b7', 'Política', 'Preocupación por la situación actual política del país', 3, 1, 6, 1, 'bw', '0-5', NULL, 1, 1),
(72, NULL, 'psc', 'Citas PSI', 'Citas PSI', 2, 1, 7, 1, 'ax', '0-5', NULL, 1, 1),
(73, NULL, 'rec', 'Citas REP', 'Citas REP', 2, 1, 7, 1, 'r', '0-5', NULL, 1, 1),
(74, NULL, 'opsi', 'Entrenador en reprogramación', 'Entrenador en reprogramación', 3, 1, 7, 1, NULL, '0-5', NULL, 1, 1),
(75, NULL, 'feom', 'Familiar enfermo o muerto', 'Familiar enfermo o muerto', 3, 1, 7, 1, NULL, '0-5', NULL, 1, 1),
(76, NULL, 'infidelidad', 'Infidelidad', 'Infidelidad', 3, 1, 7, 1, NULL, '0-5', NULL, 1, 1),
(77, NULL, 'infertilidad', 'Infertilidad', 'Infertilidad', 3, 1, 7, 1, NULL, '0-5', NULL, 1, 1),
(78, NULL, 'padreshijos', 'padres hijos', 'padres hijos', 3, 1, 7, 1, NULL, '0-5', NULL, 1, 1),
(79, NULL, 'trabajo', 'Trabajo 2', 'Trabajo', 3, 1, 7, 1, NULL, '0-5', NULL, 1, 1),
(80, NULL, 'traumasf', 'Traumas familiares', 'Traumas familiares', 3, 1, 7, 1, NULL, '0-5', NULL, 1, 1),
(81, NULL, 'nadva', 'No aceptación de vida actual', 'No aceptación de vida actual', 3, 1, 7, 1, NULL, '0-5', NULL, 1, 1),
(82, NULL, 'enfpsi', 'Enfermedad psiquiátrica', 'Enfermedad psiquiátrica', 3, 1, 7, 1, NULL, '0-5', NULL, 1, 1),
(83, NULL, 'hppsi', 'Hijo de padres psiquiátricos', 'Hijo de padres psiquiátricos', 3, 1, 7, 1, NULL, '0-5', NULL, 1, 1),
(84, NULL, 'anot', 'otros', 'otros', 3, 1, 7, 1, NULL, '0-5', NULL, 1, 1),
(85, NULL, 'neepv', 'No entendió el protocolo', 'No entendió el protocolo', 3, 1, 7, 1, NULL, '0-5', NULL, 1, 1),
(86, NULL, 'rabia', 'Está logrando desactivar los pensamientos rumiantes', 'Está logrando desactivar los pensamientos rumiantes', 3, 1, 7, 1, 'bx', '0-5', NULL, 1, 1),
(87, NULL, 'ransiedad', 'Los factores que generan emociones conflictivas están mejorando', 'Los factores que generan emociones conflictivas están mejorando', 3, 1, 7, 1, 'by', '0-5', NULL, 1, 1),
(88, NULL, 'tristeza', 'Miedo', 'Reprogramación Miedo', 1, 1, 7, 1, 'bz', '0-5', NULL, 1, 1),
(89, NULL, 'insight', 'Insight', 'Reprogramación insight', 1, 1, 7, 1, 'ai', '0-5', NULL, 1, 1),
(90, NULL, 'holly', 'holly', 'holly', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(91, NULL, 'chicory', 'chicory', 'chicory', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(92, NULL, 'agrimony', 'agrimony', 'agrimony', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(93, NULL, 'rock_water', 'rock water', 'rock water', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(94, NULL, 'aspen', 'aspen', 'aspen', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(95, NULL, 'larch', 'larch', 'larch', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(96, NULL, 'gorse', 'gorse', 'gorse', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(97, NULL, 'wild_oat', 'wild oat', 'wild oat', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(98, NULL, 'heather', 'heather', 'heather', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(99, NULL, 'chesnut_bud', 'chesnut bud', 'chesnut bud', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(100, NULL, 'white_chesnut', 'white chesnut', 'white chesnut', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(101, NULL, 'sweet_chesnut', 'sweet chesnut', 'sweet chesnut', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(102, NULL, 'red_chesnut', 'red chesnut', 'red chesnut', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(103, NULL, 'centaury', 'centaury', 'centaury', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(104, NULL, 'cherry_plum', 'cherry plum', 'cherry plum', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(105, NULL, 'cerato', 'cerato', 'cerato', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(106, NULL, 'clematis', 'clematis', 'clematis', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(107, NULL, 'star_of_bethlehem', 'star of bethlehem', 'star of bethlehem', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(108, NULL, 'gentian', 'gentian', 'gentian', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(109, NULL, 'beech', 'beech', 'beech', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(110, NULL, 'rock_rose', 'rock rose', 'rock rose', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(111, NULL, 'hornbeam', 'hornbeam', 'hornbeam', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(112, NULL, 'impatiens', 'impatiens', 'impatiens', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(113, NULL, 'honeysuckle', 'honeysuckle', 'honeysuckle', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(114, NULL, 'crab_apple', 'crab apple', 'crab apple', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(115, NULL, 'mimulus', 'mimulus', 'mimulus', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(116, NULL, 'mustard', 'mustard', 'mustard', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(117, NULL, 'walnut', 'walnut', 'walnut', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(118, NULL, 'olive', 'olive', 'olive', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(119, NULL, 'elm', 'elm', 'elm', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(120, NULL, 'pine', 'pine', 'pine', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(121, NULL, 'oak', 'oak', 'oak', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(122, NULL, 'wild_rose', 'wild rose', 'wild rose', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(123, NULL, 'willow', 'willow', 'willow', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(124, NULL, 'scleranthus', 'scleranthus', 'scleranthus', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(125, NULL, 'verbain', 'verbain', 'verbain', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(126, NULL, 'vine', 'vine', 'vine', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(127, NULL, 'water_violet', 'water violet', 'water violet', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(128, NULL, 'rescue_remedy', 'rescue remedy', 'rescue remedy', 3, 1, 8, 1, NULL, '0-5', NULL, 1, 1),
(129, NULL, 'cumplimiento', 'cumplimiento', 'Cumplimiento del plan alimenticio', 3, 1, 9, 1, NULL, '0-5', NULL, 1, 1),
(130, NULL, 'citanut', 'Cita nutrición', 'Cita nutrición', 2, 1, 9, 1, 'av', '0-5', NULL, 1, 1),
(131, NULL, 'licnut', 'Licenciada nutrición', 'Licenciada nutrición', 3, 1, 9, 1, NULL, '0-5', NULL, 1, 1),
(132, NULL, 'lic1', 'Nutricionista 1', 'Licenciada Nutricionista nivel 1', 1, 1, 9, 1, 't', '0-5', NULL, 1, 1),
(133, NULL, 'lic2', 'Nutrición 2', 'Nutrición 2', 1, 1, 9, 1, 'az', '0-5', NULL, 1, 1),
(134, NULL, 'lic3', 'Nutricionista 3', 'Licenciada Nutricionista nivel 3', 1, 1, 9, 1, 'bq', '0-5', NULL, 1, 1),
(135, NULL, 'nf1', 'Nutrición 1', 'Nutrición 1', 3, 1, 9, 1, 'ay', '0-5', NULL, 1, 1),
(136, NULL, 'nf2', 'Nutricionista 2', 'Licenciada Nutricionista nivel 2', 3, 1, 9, 1, 'u', '0-5', NULL, 1, 1),
(137, NULL, 'nf3', 'Nutrición F3', 'Nutrición Fase 3', 3, 1, 9, 1, 'br', '0-5', NULL, 1, 1),
(138, NULL, 'pharinas', 'Adicción de harinas', 'Adicción de harinas', 3, 1, 9, 1, 'w', '0-5', NULL, 1, 1),
(139, NULL, 'pdulces', 'Adicción de dulces', 'Adicción de dulces', 3, 1, 9, 1, 'v', '0-5', NULL, 1, 1),
(140, NULL, 'apetito', 'Apetito o Ansiedad', 'Apetito o Ansiedad', 3, 1, 9, 1, NULL, '0-5', NULL, 1, 1),
(141, NULL, 'atracones', 'Atracones', 'Atracones', 1, 1, 9, 1, 'bs', '0-5', NULL, 1, 1),
(142, NULL, 'hiperuricemia', 'Hiperuricemia', 'Hiperuricemia', 3, 1, 9, 1, NULL, '0-5', NULL, 1, 1),
(143, NULL, 'lactosa', 'Lactosa', 'Intolerancia a la lactosa', 3, 1, 9, 1, 'ca', '0-5', NULL, 1, 1),
(144, NULL, 'fructosa', 'Fructosa', 'Intolerancia a la fructosa', 3, 1, 9, 1, 'cb', '0-5', NULL, 1, 1),
(145, NULL, 'gluten', 'Gluten', 'Intolerancia al gluten', 3, 1, 9, 1, 'cc', '0-5', NULL, 1, 1),
(146, NULL, 'rambiente', 'Resumen Ambiente', 'Resumen Ambiente', 3, 1, 20, 1, 'dz', '0-5', NULL, 1, 1),
(147, NULL, 'ralimentos', 'Resumen Alimentos', 'Resumen Alimentos', 3, 1, 20, 1, 'ea', '0-5', NULL, 1, 1),
(148, NULL, 'rejercicios', 'Resumen Ejercicios', 'Resumen Ejercicios', 3, 1, 20, 1, 'eb', '0-5', NULL, 1, 1),
(149, NULL, 'ractitudes', 'Resumen Actitudes', 'Resumen Actitudes', 3, 1, 20, 1, 'eh', '0-5', NULL, 1, 1),
(150, NULL, 'a3', 'Comer por ansiedad', 'Comer por ansiedad', 3, 1, 9, 1, 'x', '0-5', NULL, 1, 1),
(151, NULL, 'ejenba', 'Ejercicios N básico', 'Ejercicios N básico', 3, 1, 20, 1, NULL, '0-5', NULL, 1, 1),
(152, NULL, 'citaeje', 'CitaJb (Cita entrenador básico)', 'CitaJb (Cita entrenador básico)', 2, 1, 20, 1, 'aw', '0-5', NULL, 1, 1),
(153, NULL, 'nivel', 'N de ejercicios (Niv)', 'Nivel maximo de ejército', 1, 1, 10, 1, 'dd', '0-5', NULL, 1, 1),
(154, NULL, 'caminar', 'Pasos P', 'Pasos P', 3, 1, 10, 1, 'em', '0-5', NULL, 1, 1),
(155, NULL, 'pasose', 'Pasos', 'Pasos', 3, 1, 20, 1, 'aq', '0-5', NULL, 1, 1),
(156, NULL, 'pdiario', 'Peso diario', 'Progreso de peso diario', 1, 1, 20, 1, 'd', '0-5', NULL, 1, 1),
(157, NULL, 'pesocolor', 'Peso diario 2', 'Perdida de peso diario', 3, 1, 20, 1, NULL, '0-5', NULL, 1, 1),
(158, NULL, 'avance', 'Avance', 'Pacientes que avanzaron en su plan', 3, 1, 20, 1, NULL, '0-5', NULL, 1, 1),
(159, NULL, 'ejercicio', 'Reporte de ejercicios', 'Reporte de ejercicios', 3, 1, 20, 1, NULL, '0-5', NULL, 1, 1),
(160, NULL, 'avancejercicio', 'Avance en ejercicios', 'Pacientes que avanzaron en ejercicios', 3, 1, 20, 1, NULL, '0-5', NULL, 1, 1),
(161, NULL, 'peso_diario', 'Peso a perder diario', 'Peso a perder diario', 1, 1, 20, 1, 'dv', '0-5', NULL, 1, 1),
(162, NULL, 'gd', 'Grasa a perder diario', 'Grasa a perder diario', 1, 1, 20, 1, 'dt', '0-5', NULL, 1, 1),
(163, NULL, 'recalcular', 'Semana de recalculo', 'Semana de recalculo', 1, 1, 20, 1, 'j', '0-5', NULL, 1, 1),
(164, NULL, 'bandas', 'Bandas', 'Día', 3, 1, 20, 1, 'ar', '0-5', NULL, 1, 1),
(165, NULL, 'token', 'Notificaciones', 'Disponibilidad para Notificaciones', 1, 1, 17, 1, 'be', '0-5', NULL, 1, 1),
(166, NULL, 'paie', 'Pai', 'Pai', 3, 1, 20, 1, 'as', '0-5', NULL, 1, 1),
(167, NULL, 'pisose', 'Pisos', 'Pisos', 3, 1, 20, 1, NULL, '0-5', NULL, 1, 1),
(168, NULL, 'suenoe', 'Sueño EJ', 'Sueño EJ', 3, 1, 10, 1, 'de', '0-5', NULL, 1, 1),
(169, NULL, 'ejeavz', 'Cita EjAv', 'Cita para ejercicios avanzados', 2, 1, 10, 1, 'bl', '0-5', NULL, 1, 1),
(170, NULL, 'calee', 'CalE', 'CalE', 3, 1, 20, 1, NULL, '0-5', NULL, 1, 1),
(171, NULL, 'fche', 'Frecuencia cardiaca máxima', 'FC max', 3, 1, 20, 1, 'df', '0-5', NULL, 1, 1),
(172, NULL, 'fcme', 'Frecuencia cardiaca media', 'FC Media', 3, 1, 20, 1, 'dg', '0-5', NULL, 1, 1),
(173, NULL, 'fcre', 'Frecuencia cardiaca en reposo', 'FC Reposo', 3, 1, 20, 1, 'dh', '0-5', NULL, 1, 1),
(174, NULL, 'hhda', 'Historial del día A', 'Historial del día A', 3, 1, 20, 1, NULL, '0-5', NULL, 1, 1),
(175, NULL, 'kmr', 'Km recorridos', 'Km recorridos', 3, 1, 20, 1, NULL, '0-5', NULL, 1, 1),
(176, NULL, 'hhdb', 'Historial del día B', 'Historial del día B', 3, 1, 20, 1, NULL, '0-5', NULL, 1, 1),
(177, NULL, 'exie', 'Oxi', 'Oxi', 3, 1, 20, 1, 'dk', '0-5', NULL, 1, 1),
(178, NULL, 'mmdor', 'Medidor', 'Medidor', 3, 1, 20, 1, NULL, '0-5', NULL, 1, 1),
(179, NULL, 'hhdc', 'Historial del día C', 'Historial del día C', 3, 1, 20, 1, NULL, '0-5', NULL, 1, 1),
(180, NULL, 'caloe', 'Calorias', 'Calorias', 3, 1, 20, 1, 'di', '0-5', NULL, 1, 1),
(181, NULL, 'minle', 'Min 1', 'Min 1', 3, 1, 20, 1, NULL, '0-5', NULL, 1, 1),
(182, NULL, 'neste', 'N Est', 'N Est', 3, 1, 20, 1, 'dj', '0-5', NULL, 1, 1),
(183, NULL, 'vo2e', 'VO2 Max', 'VO2 Max', 3, 1, 20, 1, 'dl', '0-5', NULL, 1, 1),
(184, NULL, 'movimiento', 'De pie', 'Tiempo de pie', 3, 1, 20, 1, 'dy', '0-5', NULL, 1, 1),
(185, NULL, 'cefalea', 'Cefalea', 'Cefalea', 3, 1, 11, 1, NULL, '0-5', NULL, 1, 1),
(186, NULL, 'acidez', 'Acidez', 'Acidez', 3, 1, 11, 1, NULL, '0-5', NULL, 1, 1),
(187, NULL, 'flatulencias', 'Flatulencia', 'Flatulencia', 3, 1, 11, 1, NULL, '0-5', NULL, 1, 1),
(188, NULL, 'estrenimiento', 'Estreñimiento', 'Estreñimiento', 3, 1, 11, 1, NULL, '0-5', NULL, 1, 1),
(189, NULL, 'ronquidos', 'Ronquidos', 'Ronquidos', 1, 1, 11, 1, 'an', '0-5', NULL, 1, 1),
(190, NULL, 'rodillas', 'Rodillas', 'Rodillas', 1, 1, 11, 1, 'añ', '0-5', NULL, 1, 1),
(191, NULL, 'insomnio', 'Insomnio', 'Insomnio', 3, 1, 11, 1, NULL, '0-5', NULL, 1, 1),
(192, NULL, 'piernas', 'Piernas', 'Piernas', 3, 1, 11, 1, NULL, '0-5', NULL, 1, 1),
(193, NULL, 'reflujo', 'Reflujo', 'Reflujo', 1, 1, 11, 1, 'ao', '0-5', NULL, 1, 1),
(194, NULL, 'tiroides', 'Tiroides', 'Tiroides', 1, 1, 12, 1, 'aj', '0-5', NULL, 1, 1),
(195, NULL, 'duodeno', 'duodeno', 'duodeno', 1, 1, 12, 1, 'ch', '0-5', NULL, 1, 1),
(196, NULL, 'carotida', 'Carótida', 'Carótida', 1, 1, 12, 1, 'ce', '0-5', NULL, 1, 1),
(197, NULL, 'higado', 'Hígado', 'Hígado', 1, 1, 12, 1, 'ci', '0-5', NULL, 1, 1),
(198, NULL, 'faringe', 'Faringe', 'Faringe', 3, 1, 12, 1, NULL, '0-5', NULL, 1, 1),
(199, NULL, 'laringe', 'Laringe', 'LAringe', 1, 1, 12, 1, 'cd', '0-5', NULL, 1, 1),
(200, NULL, 'hiato', 'Hiato esofágico', 'Hiato esofágico', 3, 1, 12, 1, NULL, '0-5', NULL, 1, 1),
(201, NULL, 'esofago', 'Esófago', 'Esófago', 1, 1, 12, 1, 'cf', '0-5', NULL, 1, 1),
(202, NULL, 'estomago', 'Estómago', 'Estómago', 1, 1, 12, 1, 'cg', '0-5', NULL, 1, 1),
(203, NULL, 'vesicula', 'Vesícula biliar', 'Vesícula biliar', 1, 1, 12, 1, 'ak', '0-5', NULL, 1, 1),
(204, NULL, 'pancreas', 'Páncreas', 'Páncreas', 1, 1, 12, 1, 'cl', '0-5', NULL, 1, 1),
(205, NULL, 'rinones', 'Riñones', 'Riñones', 1, 1, 12, 1, 'cj', '0-5', NULL, 1, 1),
(206, NULL, 'bazo', 'Bazo', 'Bazo', 3, 1, 12, 1, NULL, '0-5', NULL, 1, 1),
(207, NULL, 'colon', 'Colon', 'Colon', 1, 1, 12, 1, 'ck', '0-5', NULL, 1, 1),
(208, NULL, 'mamas', 'Mamas', 'Mamas', 3, 1, 12, 1, NULL, '0-5', NULL, 1, 1),
(209, NULL, 'prostata', 'Próstata', 'Próstata', 3, 1, 12, 1, NULL, '0-5', NULL, 1, 1),
(210, NULL, 'sexual', 'Ovarios/Testículo', 'Ovarios/Testículo', 3, 1, 12, 1, NULL, '0-5', NULL, 1, 1),
(211, NULL, 'rodilla', 'Rodilla', 'Rodilla', 3, 1, 12, 1, NULL, '0-5', NULL, 1, 1),
(212, NULL, 'columna', 'Columna', 'Columna vertebral', 3, 1, 12, 1, NULL, '0-5', NULL, 1, 1),
(213, NULL, 'hipertension', 'Hipertensión arterial', 'Hipertensión arterial', 1, 1, 13, 1, 'al', '0-5', NULL, 1, 1),
(214, NULL, 'miocardio', 'Infarto de miocardio', 'Infarto de miocardio', 3, 1, 13, 1, NULL, '0-5', NULL, 1, 1),
(215, NULL, 'diabetes', 'Diabetes / hiperinsulinismo', 'Diabetes / hiperinsulinismo', 1, 1, 13, 1, 'am', '0-5', NULL, 1, 1),
(216, NULL, 'apnea', 'Apnea', 'Apnea del sueño', 3, 1, 13, 1, NULL, '0-5', NULL, 1, 1),
(217, NULL, 'higado_graso', 'Hígado Graso', 'Hígado Graso, cirrosis', 3, 1, 13, 1, NULL, '0-5', NULL, 1, 1),
(218, NULL, 'hipotiroidismo', 'Hipotiroidismo 2', 'Hipotiroidismo', 3, 1, 13, 1, NULL, '0-5', NULL, 1, 1),
(219, NULL, 'cancer', 'Cáncer', 'Cáncer', 1, 1, 13, 1, 'cm', '0-5', NULL, 1, 1),
(220, NULL, 'familiarcancer', 'Familiar con cáncer', 'Familiar con cáncer', 3, 1, 13, 1, NULL, '0-5', NULL, 1, 1),
(221, NULL, 'bariatricaprevia', 'Bariátrica previa', 'Bariátrica previa', 1, 1, 13, 1, 'ap', '0-5', NULL, 1, 1),
(222, NULL, 'cita', 'Revisión', 'Revisión de esta semana', 3, 1, 4, 1, 'b', '0-5', NULL, 1, 1),
(223, NULL, 'pi', 'Peso inicial', 'Peso inicial', 1, 1, 20, 1, 'k', '0-5', NULL, 1, 1),
(224, NULL, 'gi', 'Grasa inicial', 'Grasa inicial', 1, 1, 20, 1, 'dq', '0-5', NULL, 1, 1),
(225, NULL, 'gm', 'Grasa Meta', 'Grasa Meta', 1, 1, 20, 1, 'dr', '0-5', NULL, 1, 1),
(226, NULL, 'pp', 'Peso programado', 'Peso programado', 1, 1, 2, 1, 'l', '0-5', NULL, 1, 1),
(227, NULL, 'peso_color', 'Peso color', 'Peso color', 1, 1, 20, 1, 'ei', '0-5', NULL, 1, 1),
(228, NULL, 'grasab_color', 'Grasa color', 'Grasa color', 1, 1, 20, 1, 'ej', '0-5', NULL, 1, 1),
(229, NULL, 'gp', 'Grasa programada', 'Grasa programada', 1, 1, 2, 1, 'ds', '0-5', NULL, 1, 1),
(230, NULL, 'pm', 'Peso meta', 'Peso meta', 1, 1, 20, 1, 'm', '0-5', NULL, 1, 1),
(231, NULL, 'aeereported', 'Dias reportados', 'Dias reportados', 3, 1, 20, 1, 'i', '0-5', NULL, 1, 1),
(232, NULL, 'diasemana', 'Dia de reporte', 'Dia de reporte', 3, 1, 20, 1, 'iel', 'a-z', NULL, 2, 2),
(233, NULL, 'diaspesados', 'Dias pesados', 'Dias pesados', 1, 1, 20, 1, 'n', '0-5', NULL, 1, 1),
(234, NULL, 'balon', 'Balón', 'Balón gástrico', 3, 1, 21, 1, NULL, '0-5', NULL, 1, 1),
(235, NULL, 'bypass', 'Bypass', 'Bypass gástrico', 3, 1, 21, 1, NULL, '0-5', NULL, 1, 1),
(236, NULL, 'plicatura', 'Plicatura', 'Plicatura gástrica', 3, 1, 21, 1, NULL, '0-5', NULL, 1, 1),
(237, NULL, 'manga', 'Manga', 'Manga gástrica', 3, 1, 21, 1, NULL, '0-5', NULL, 1, 1),
(238, NULL, 'litio', 'Litio', 'Litio', 3, 1, 14, 1, NULL, '0-5', NULL, 1, 1),
(239, NULL, 'metfotmina', 'Metformina', 'Metformina', 3, 1, 14, 1, NULL, '0-5', NULL, 1, 1),
(240, NULL, 'topiramato', 'Topiramato', 'Topiramato', 3, 1, 14, 1, NULL, '0-5', NULL, 1, 1),
(241, NULL, 'chtp', '5htp', '5htp', 3, 1, 14, 1, NULL, '0-5', NULL, 1, 1),
(242, NULL, 'tberberina', 'Berberina', 'Berberina', 3, 1, 14, 1, NULL, '0-5', NULL, 1, 1),
(243, NULL, 'veltrix', 'Veltryx', 'Veltryx', 3, 1, 14, 1, NULL, '0-5', NULL, 1, 1),
(244, NULL, 'selenio', 'selenio 2', 'selenio', 3, 1, 14, 1, NULL, '0-5', NULL, 1, 1),
(245, NULL, 'zinc', 'zinc 3', 'zinc', 3, 1, 14, 1, NULL, '0-5', NULL, 1, 1),
(246, NULL, 'tmagnecio', 'Magnesio', 'Magnesio', 3, 1, 14, 1, NULL, '0-5', NULL, 1, 1),
(247, NULL, 'espironolactona', 'Espironolactona', 'Espironolactona', 3, 1, 14, 1, NULL, '0-5', NULL, 1, 1),
(248, NULL, 'euthirox', 'Euthirox', 'Euthirox', 3, 1, 14, 1, NULL, '0-5', NULL, 1, 1),
(249, NULL, 'ligadura', 'Ligadura', 'Ligadura', 3, 1, 14, 1, NULL, '0-5', NULL, 1, 1),
(250, NULL, 'aldactone', 'Aldactone', 'Aldactone', 3, 1, 14, 1, NULL, '0-5', NULL, 1, 1),
(251, NULL, 'gastroscopia', 'Gastroscopia', 'Gastroscopia', 1, 1, 15, 1, 'cn', '0-5', NULL, 1, 1),
(252, NULL, 'ultrasonido', 'Ultrasonido', 'Ultrasonido', 1, 1, 15, 1, 'co', '0-5', NULL, 1, 1),
(253, NULL, 'colonoscopia', 'Colonoscopia', 'Colonoscopia', 1, 1, 15, 1, 'cñ', '0-5', NULL, 1, 1),
(254, NULL, 'ecosonograma', 'Ecosonograma', 'Ecosonograma', 3, 1, 15, 1, NULL, '0-5', NULL, 1, 1),
(255, NULL, 'laboratorio', 'Laboratorio entrega', 'Laboratorio entrega', 1, 1, 15, 1, 'da', '0-5', NULL, 1, 1),
(256, NULL, 'laboratorior', 'Laboratorio revisado', 'Laboratorio revisado', 3, 1, 15, 1, NULL, '0-5', NULL, 1, 1),
(257, NULL, 'abdominal', 'Abdominal', 'Abdominal', 3, 1, 15, 1, NULL, '0-5', NULL, 1, 1),
(258, NULL, 'tidoidese', 'Tiroides 2', 'Tiroides', 3, 1, 15, 1, NULL, '0-5', NULL, 1, 1),
(259, NULL, 'elastografia', 'Elastografía', 'Elastografía', 3, 1, 15, 1, NULL, '0-5', NULL, 1, 1),
(260, NULL, 'etiroides', 'Elastografía tiroides', 'Elastografía de tiroides', 3, 1, 15, 1, NULL, '0-5', NULL, 1, 1),
(261, NULL, 'ehigado', 'Elastografía hígado', 'Elastografía de hígado', 3, 1, 15, 1, NULL, '0-5', NULL, 1, 1),
(262, NULL, 'epancreas', 'Elastografía páncreas', 'Elastografía de páncreas', 3, 1, 15, 1, NULL, '0-5', NULL, 1, 1),
(263, NULL, 'cardiologia', 'Cardiología', 'Cardiología', 3, 1, 16, 1, NULL, '0-5', NULL, 1, 1),
(264, NULL, 'medicionainterna', 'Medicina interna', 'Medicina interna', 3, 1, 16, 1, NULL, '0-5', NULL, 1, 1),
(265, NULL, 'cirujia', 'Cirugía', 'Cirugía', 3, 1, 16, 1, NULL, '0-5', NULL, 1, 1),
(266, NULL, 'traumatologo', 'Traumatólogo', 'Traumatólogo', 3, 1, 16, 1, NULL, '0-5', NULL, 1, 1),
(267, NULL, 'fisiatria', 'Fisiatría', 'Fisiatría', 3, 1, 16, 1, NULL, '0-5', NULL, 1, 1),
(268, NULL, 'psiquiatria', 'Psiquiatría', 'Psiquiatría', 3, 1, 16, 1, NULL, '0-5', NULL, 1, 1),
(269, NULL, 'tpemocional', 'Terapeuta emocional', 'Terapeuta emocional', 3, 1, 16, 1, NULL, '0-5', NULL, 1, 1),
(270, NULL, 'ginecologia', 'Ginecología', 'Ginecología', 3, 1, 16, 1, NULL, '0-5', NULL, 1, 1),
(271, NULL, 'obstetricia', 'Obstetricia', 'Obstetricia', 3, 1, 16, 1, NULL, '0-5', NULL, 1, 1),
(272, NULL, 'pediatria', 'Pediatría', 'pediatría', 3, 1, 16, 1, NULL, '0-5', NULL, 1, 1),
(273, NULL, 'tipodepaciente', 'Tipo de paciente', 'Tipo de paciente', 3, 1, 17, 1, 'bg', '0-5', NULL, 1, 1),
(274, NULL, 'a_kit1', 'kit 1 mes', 'kit 1 mes', 3, 1, 17, 1, NULL, '0-5', NULL, 1, 1),
(275, NULL, 'a_kit3', 'kit 3 meses', 'kit 3 meses', 3, 1, 17, 1, NULL, '0-5', NULL, 1, 1),
(276, NULL, 'a_lig', 'Ligadura 2', 'Ligadura', 3, 1, 17, 1, NULL, '0-5', NULL, 1, 1),
(277, NULL, 'a_consultm', 'Consulta Médica', 'Consulta Médica', 3, 1, 17, 1, NULL, '0-5', NULL, 1, 1),
(278, NULL, 'a_consultn', 'Consulta Nutrición', 'Consulta Nutrición', 3, 1, 17, 1, NULL, '0-5', NULL, 1, 1),
(279, NULL, 'a_consultp', 'Consulta Psícologo', 'Consulta Psícologo', 3, 1, 17, 1, NULL, '0-5', NULL, 1, 1),
(280, NULL, 'a_gym', 'Gimnasio', 'Gimnasio', 3, 1, 17, 1, NULL, '0-5', NULL, 1, 1),
(281, NULL, 'testnutri', 'Test nutrigenetico', 'Test nutrigenetico', 1, 1, 17, 1, 'cz', '0-5', NULL, 1, 1),
(282, NULL, 'a_litio', 'Litio 2', 'Litio', 3, 1, 17, 1, NULL, '0-5', NULL, 1, 1),
(283, NULL, 'a_ber', 'Berberina 3', 'Berberina', 3, 1, 17, 1, NULL, '0-5', NULL, 1, 1),
(284, NULL, 'a_sel', 'Selenio', 'Selenio', 3, 1, 17, 1, NULL, '0-5', NULL, 1, 1),
(285, NULL, 'a_zinc', 'Zinc', 'Zinc', 3, 1, 17, 1, NULL, '0-5', NULL, 1, 1),
(286, NULL, 'topiromatoadmin', 'Topiramato 1', 'Topiramato', 3, 1, 17, 1, NULL, '0-5', NULL, 1, 1),
(287, NULL, 'a_mag', 'Magnesio 2', 'Magnesio', 3, 1, 17, 1, NULL, '0-5', NULL, 1, 1),
(288, NULL, 'pedido', 'Pedido', 'Pedido', 1, 1, 18, 1, 'db', '0-5', NULL, 1, 1),
(289, NULL, 'gomas', 'gomas', 'gomas', 3, 1, 18, 1, NULL, '0-5', NULL, 1, 1),
(290, NULL, 'chocolat', 'Chocolate', 'Chocolate', 3, 1, 18, 1, NULL, '0-5', NULL, 1, 1),
(291, NULL, 'harinaalm', 'Harina ALM', 'Harina ALM', 3, 1, 18, 1, NULL, '0-5', NULL, 1, 1),
(292, NULL, 'merengada', 'Merengada', 'Merengada', 3, 1, 18, 1, NULL, '0-5', NULL, 1, 1),
(293, NULL, 'talla', 'Talla', 'Altura', 1, 1, 20, 1, NULL, '0-9.', NULL, 2, 6),
(294, NULL, 'anna', 'Ana B1', 'Ana B1', 1, 1, 4, 1, 'do', '0-5', NULL, 1, 1),
(295, NULL, 'aud_p', 'Psicólogo B3', 'Psicólogo B3', 2, 1, 4, 1, 'ec', '0-5', NULL, 1, 1),
(296, NULL, 'aud_m', 'Medicina B5', 'Medicina B5', 2, 1, 4, 1, 'ed', '0-5', NULL, 1, 1),
(297, NULL, 'aud_e', 'Ejercicios B4', 'Ejercicios B4', 2, 1, 4, 1, 'ee', '0-5', NULL, 1, 1),
(298, NULL, 'ag1', 'auditoría de  uso de App y accesorios', 'auditoría de  uso de App y accesorios', 3, 1, 4, 1, 'en', '0-5', NULL, 1, 1),
(299, NULL, 'ag2', 'auditoría de medicina', 'auditoría de medicina', 3, 1, 4, 1, 'eñ', '0-5', NULL, 1, 1),
(300, NULL, 'ag3', 'auditoría de Nutrición', 'auditoría de Nutrición', 3, 1, 4, 1, 'eo', '0-5', NULL, 1, 1),
(301, NULL, 'ag4', 'auditoría Vaneska', 'auditoría Vaneska', 3, 1, 4, 1, 'ep', '0-5', NULL, 1, 1),
(302, NULL, 'ag5', 'auditoría psicológica', 'auditoría psicológica', 3, 1, 4, 1, 'eq', '0-5', NULL, 1, 1),
(303, NULL, 'ag6', 'auditoría Juli', 'auditoría Juli', 3, 1, 4, 1, 'er', '0-5', NULL, 1, 1),
(304, NULL, 'ag7', 'Auditoría Jazmin', 'Auditoría Jazmin', 3, 1, 4, 1, 'es', '0-5', NULL, 1, 1),
(305, NULL, 'ag8', 'Auditoría Rosibel', 'Auditoría Rosibel', 3, 1, 4, 1, 'et', '0-5', NULL, 1, 1),
(306, NULL, 'ag9', 'Auditoría Jenny', 'Auditoría Jenny', 3, 1, 4, 1, 'eu', '0-5', NULL, 1, 1),
(307, NULL, 'ag10', 'Auditoría Maribel', 'Auditoría Maribel', 3, 1, 4, 1, 'ev', '0-5', NULL, 1, 1),
(308, NULL, 'ag11', 'Auditoría Enilda', 'Auditoría Enilda', 3, 1, 4, 1, 'ew', '0-5', NULL, 1, 1),
(309, NULL, 'ag12', 'Auditoría Ana', 'Auditoría Ana', 3, 1, 4, 1, 'ex', '0-5', NULL, 1, 1),
(310, NULL, 'aud_n', 'Nutrición B2', 'Nutrición B2', 2, 1, 4, 1, 'ef', '0-5', NULL, 1, 1),
(311, NULL, 'os', 'Sistema operativo', 'El Sistema operativo que usa el paciente', 1, 1, 4, 1, 'dm', '0-9.', NULL, 1, 1),
(312, NULL, 'honorarios', 'Honorarios', 'Honorarios', 3, 1, 17, 1, NULL, '0-5', NULL, 1, 1),
(313, NULL, 'reloj', 'Reloj', 'Reloj', 3, 1, 19, 1, NULL, '0-5', NULL, 1, 1),
(314, NULL, 'balanza', 'Balanza', 'Balanza', 3, 1, 19, 1, NULL, '0-5', NULL, 1, 1),
(315, NULL, 'ligasc', 'Ligas', 'Ligas', 3, 1, 19, 1, NULL, '0-5', NULL, 1, 1),
(316, NULL, 'litioc', 'Litio Comprimidos', 'Litio Comprimidos', 3, 1, 19, 1, NULL, '0-5', NULL, 1, 1),
(317, NULL, 'mberberina', 'Berberina 2', 'Berberina', 3, 1, 19, 1, NULL, '0-5', NULL, 1, 1),
(318, NULL, 'mcelenio', 'Selenio 3', 'Selenio', 3, 1, 19, 1, NULL, '0-5', NULL, 1, 1),
(319, NULL, 'mzinc', 'Zinc 2', 'Zinc', 3, 1, 19, 1, NULL, '0-5', NULL, 1, 1),
(320, NULL, 'mmagnecio', 'Magnesio 3', 'Magnesio', 3, 1, 19, 1, NULL, '0-5', NULL, 1, 1),
(321, NULL, 'medulcorante', 'Edulcorante', 'Edulcorante', 3, 1, 19, 1, NULL, '0-5', NULL, 1, 1),
(322, NULL, 'otros', 'Otros 2', 'Otros', 3, 1, 19, 1, NULL, '0-5', NULL, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `terminos`
--

CREATE TABLE `terminos` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `terminos` int(11) NOT NULL,
  `privacidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `colecciones`
--
ALTER TABLE `colecciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `diccionario`
--
ALTER TABLE `diccionario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `variable` (`variable`),
  ADD UNIQUE KEY `titulo` (`titulo`),
  ADD UNIQUE KEY `abreviacion` (`abreviacion`);

--
-- Indices de la tabla `terminos`
--
ALTER TABLE `terminos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uid` (`uid`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `colecciones`
--
ALTER TABLE `colecciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `diccionario`
--
ALTER TABLE `diccionario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=323;

--
-- AUTO_INCREMENT de la tabla `terminos`
--
ALTER TABLE `terminos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
