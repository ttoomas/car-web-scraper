-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Počítač: 127.0.0.1
-- Vytvořeno: Sob 29. dub 2023, 21:40
-- Verze serveru: 10.4.21-MariaDB
-- Verze PHP: 8.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáze: `car-web-scrape`
--

-- --------------------------------------------------------

--
-- Struktura tabulky `template`
--

CREATE TABLE `template` (
  `id` int(11) NOT NULL,
  `name` varchar(1000) DEFAULT NULL,
  `prize` int(255) DEFAULT NULL,
  `condition_car` varchar(1000) DEFAULT NULL,
  `distance` int(255) DEFAULT NULL,
  `prod_date` varchar(1000) DEFAULT NULL,
  `body` varchar(1000) DEFAULT NULL,
  `color` varchar(1000) DEFAULT NULL,
  `fuel` varchar(1000) DEFAULT NULL,
  `capacity` int(255) DEFAULT NULL,
  `performance` int(255) DEFAULT NULL,
  `transmission` varchar(1000) DEFAULT NULL,
  `gear` varchar(1000) DEFAULT NULL,
  `country_origin` varchar(1000) DEFAULT NULL,
  `tel_contact` int(255) DEFAULT NULL,
  `url` varchar(1000) DEFAULT NULL,
  `image_url` varchar(1000) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexy pro exportované tabulky
--

--
-- Indexy pro tabulku `template`
--
ALTER TABLE `template`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pro tabulky
--

--
-- AUTO_INCREMENT pro tabulku `template`
--
ALTER TABLE `template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
