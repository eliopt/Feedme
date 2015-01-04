# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Hôte: 127.0.0.1 (MySQL 5.6.21)
# Base de données: feedme
# Temps de génération: 2015-01-04 18:06:22 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Affichage de la table commandes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `commandes`;

CREATE TABLE `commandes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` text,
  `adresse` text,
  `montant` text,
  `detail` text,
  `telephone` text,
  `status` text,
  `time` bigint(20) DEFAULT NULL,
  `nom` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `commandes` WRITE;
/*!40000 ALTER TABLE `commandes` DISABLE KEYS */;

INSERT INTO `commandes` (`id`, `email`, `adresse`, `montant`, `detail`, `telephone`, `status`, `time`, `nom`)
VALUES
	(15,'emmanuel.coppey@gmail.com','81, avenue Gambetta 75020','29000','[{\"id\":\"17\",\"count\":100}]','0640561251','1',1420372475904,'Coppey');

/*!40000 ALTER TABLE `commandes` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table produits
# ------------------------------------------------------------

DROP TABLE IF EXISTS `produits`;

CREATE TABLE `produits` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `titre` text,
  `prix` text,
  `description` text,
  `provenance` text,
  `kind` varchar(11) NOT NULL DEFAULT '',
  `quantite` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `produits` WRITE;
/*!40000 ALTER TABLE `produits` DISABLE KEYS */;

INSERT INTO `produits` (`id`, `titre`, `prix`, `description`, `provenance`, `kind`, `quantite`)
VALUES
	(17,'Ananas','3.00','','Ile de France','vegetable',360);

/*!40000 ALTER TABLE `produits` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
