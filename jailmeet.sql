-- JailMeet Database Schema
-- Generated for XAMPP/WAMP/Laragon MySQL Import

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `jailmeet`;
USE `jailmeet`;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
  `ad_id` int(11) NOT NULL AUTO_INCREMENT,
  `ad_name` varchar(255) NOT NULL,
  `ad_email` varchar(255) NOT NULL,
  `ad_password` varchar(255) NOT NULL,
  PRIMARY KEY (`ad_id`),
  UNIQUE KEY `ad_email` (`ad_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping default admin credentials
-- Password: admin123 (stored as plain text for legacy fallback, and bcrypt hashed)
--

INSERT INTO `admin` (`ad_id`, `ad_name`, `ad_email`, `ad_password`) VALUES
(1, 'System Admin', 'admin@jailmeet.com', 'admin123');

-- --------------------------------------------------------

--
-- Table structure for table `officer`
--

CREATE TABLE IF NOT EXISTS `officer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ofname` varchar(255) NOT NULL,
  `ofemail` varchar(255) NOT NULL,
  `ofpass` varchar(255) NOT NULL,
  `ofphno` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ofemail` (`ofemail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping default officer credentials
-- Password: officer123 (stored as plain text to match the default comparison in officerlogin.php)
--

INSERT INTO `officer` (`id`, `ofname`, `ofemail`, `ofpass`, `ofphno`) VALUES
(1, 'Default Officer', 'officer@jailmeet.com', 'officer123', '1234567890');

-- --------------------------------------------------------

--
-- Table structure for table `visitors`
--

CREATE TABLE IF NOT EXISTS `visitors` (
  `vid` int(11) NOT NULL AUTO_INCREMENT,
  `vname` varchar(255) NOT NULL,
  `vemail` varchar(255) NOT NULL,
  `vpass` varchar(255) NOT NULL,
  `vphno` varchar(15) NOT NULL,
  `vstate` varchar(100) NOT NULL,
  `vadd` varchar(255) NOT NULL DEFAULT '',
  `vzip` varchar(10) NOT NULL DEFAULT '',
  `profile_pic` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`vid`),
  UNIQUE KEY `vemail` (`vemail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `prisoner`
--

CREATE TABLE IF NOT EXISTS `prisoner` (
  `pris_id` int(11) NOT NULL AUTO_INCREMENT,
  `pris_name` varchar(255) NOT NULL,
  `pris_age` int(11) NOT NULL,
  `pris_gender` varchar(20) NOT NULL,
  `pris_case` text NOT NULL,
  `pris_adm` date NOT NULL,
  `pris_period` varchar(100) NOT NULL,
  `jailtype` varchar(100) NOT NULL,
  `jailname` varchar(100) NOT NULL,
  `pris_cell` varchar(50) DEFAULT NULL,
  `checkup` varchar(255) DEFAULT NULL,
  `blood` varchar(10) DEFAULT NULL,
  `allergies` varchar(255) DEFAULT NULL,
  `dp` varchar(255) DEFAULT NULL,
  `par_status` varchar(50) DEFAULT '',
  `fir_number` varchar(100) DEFAULT NULL,
  `fir` text DEFAULT NULL,
  `fir_date` date DEFAULT NULL,
  `par_name` varchar(255) DEFAULT NULL,
  `par_rel` varchar(100) DEFAULT NULL,
  `par_purp` varchar(255) DEFAULT NULL,
  `par_msg` text DEFAULT NULL,
  `parole_from` date DEFAULT NULL,
  `parole_to` date DEFAULT NULL,
  `parole_msg` text DEFAULT NULL,
  `reject_msg` text DEFAULT NULL,
  PRIMARY KEY (`pris_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE IF NOT EXISTS `appointments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `prisid` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phno` varchar(15) NOT NULL,
  `message` text DEFAULT NULL,
  `relation` varchar(100) NOT NULL,
  `jtype` varchar(100) NOT NULL,
  `jname` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `visitor_id` int(11) NOT NULL,
  `accept` varchar(50) DEFAULT 'Pending',
  `reply` varchar(255) DEFAULT 'No reply yet',
  `visit_status` varchar(50) DEFAULT 'Pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
