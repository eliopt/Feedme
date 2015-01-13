-- phpMyAdmin SQL Dump
-- version 4.2.5
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Jan 13, 2015 at 08:54 PM
-- Server version: 5.5.38
-- PHP Version: 5.5.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `feedme`
--

-- --------------------------------------------------------

--
-- Table structure for table `commandes`
--

CREATE TABLE `commandes` (
`id` int(11) unsigned NOT NULL,
  `email` text,
  `adresse` text,
  `montant` text,
  `detail` text,
  `telephone` text,
  `status` text,
  `time` bigint(20) DEFAULT NULL,
  `nom` text
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=24 ;

--
-- Dumping data for table `commandes`
--

INSERT INTO `commandes` (`id`, `email`, `adresse`, `montant`, `detail`, `telephone`, `status`, `time`, `nom`) VALUES
(15, 'emmanuel.coppey@gmail.com', '81, avenue Gambetta 75020', '29000', '[{"id":"17","count":100}]', '0640561251', '3', 1420372475904, 'Coppey'),
(16, 'emmanuel.coppey@gmail.com', '81, avenue Gambetta 75020', '90000', '[{"id":"17","count":300}]', '0640561251', '0', 1421082987987, 'Coppey'),
(17, 'emmanuel.coppey@gmail.com', '81, avenue Gambetta 75020', '90000', '[{"id":"17","count":300}]', '0640561251', '0', 1421083113774, 'Coppey'),
(18, 'emmanuel.coppey@gmail.com', '81, avenue Gambetta 75020', '90000', '[{"id":"17","count":300}]', '0640561251', '0', 1421083196889, 'Coppey'),
(19, 'emmanuel.coppey@gmail.com', '81, avenue Gambetta 75020', '90000', '[{"id":"17","count":300}]', '0640561251', '0', 1421083227704, 'Coppey'),
(20, 'emmanuel.coppey@gmail.com', '81, avenue Gambetta 75020', '90000', '[{"id":"17","count":300}]', '0640561251', '0', 1421083324521, 'c'),
(21, 'emmanuel.coppey@gmail.com', '81, avenue Gambetta 75020', '90000', '[{"id":"17","count":300}]', '0640561251', '0', 1421083381773, 'Coppey'),
(22, 'emmanuel.coppey@gmail.com', '81, avenue Gambetta 75020', '90000', '[{"id":"17","count":300}]', '0640561251', '0', 1421083417649, 'Coppey'),
(23, 'emmanuel.coppey@gmail.com', '81, avenue Gambetta 75020', '90000', '[{"id":"17","count":300}]', '0640561251', '3', 1421083462109, 'Coppey');

-- --------------------------------------------------------

--
-- Table structure for table `produits`
--

CREATE TABLE `produits` (
`id` int(11) unsigned NOT NULL,
  `titre` text,
  `prix` text,
  `description` text,
  `provenance` text,
  `kind` varchar(11) NOT NULL DEFAULT '',
  `quantite` int(11) DEFAULT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=26 ;

--
-- Dumping data for table `produits`
--

INSERT INTO `produits` (`id`, `titre`, `prix`, `description`, `provenance`, `kind`, `quantite`) VALUES
(17, 'Ananas', '3.00', '', 'Ile de France', 'vegetable', 460),
(18, 'Pomme', '2.00', '', 'Ile de France', 'vegetable', 200),
(19, 'Poulet', '1.50', '', 'Ile de France', 'viande', 200),
(20, 'Lait', '1', '', 'Ile de France', 'lait', 300),
(21, 'Carotte', '1.2', '', 'Ile de France', 'vegetable', 100),
(22, 'Celeri', '2.0', '', 'Ile de France', 'vegetable', 100),
(23, 'Chou blanc', '1.2', '', 'Ile de France', 'vegetable', 100),
(24, 'Chou de Bruxelles', '2.3', '', 'Ile de France', 'vegetable', 100),
(25, 'Citrouille', '5', '', 'Ile de France', 'vegetable', 300);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `commandes`
--
ALTER TABLE `commandes`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `produits`
--
ALTER TABLE `produits`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `commandes`
--
ALTER TABLE `commandes`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT for table `produits`
--
ALTER TABLE `produits`
MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=26;