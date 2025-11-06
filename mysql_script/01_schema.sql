-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: 523gz.h.filess.io    Database: testing_fruitfood
-- ------------------------------------------------------
-- Server version	8.0.36-28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Artifact itself`
--

DROP TABLE IF EXISTS `Artifact itself`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Artifact itself` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Set` varchar(255) DEFAULT NULL,
  `Type` varchar(50) DEFAULT NULL,
  `Main Stat` varchar(50) DEFAULT NULL,
  `Number of substat` int DEFAULT NULL,
  `%ATK` int DEFAULT '0',
  `%HP` int DEFAULT '0',
  `%DEF` int DEFAULT '0',
  `ATK` int DEFAULT '0',
  `HP` int DEFAULT '0',
  `DEF` int DEFAULT '0',
  `ER` int DEFAULT '0',
  `EM` int DEFAULT '0',
  `Crit Rate` int DEFAULT '0',
  `Crit DMG` int DEFAULT '0',
  `Where got it` varchar(50) DEFAULT NULL,
  `Score` varchar(50) DEFAULT NULL,
  `CreateDate` date DEFAULT (curdate()),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3145 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Artifact leveling`
--

DROP TABLE IF EXISTS `Artifact leveling`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Artifact leveling` (
  `ID` int NOT NULL,
  `L_HP` int DEFAULT '0',
  `L_ATK` int DEFAULT '0',
  `L_DEF` int DEFAULT '0',
  `L_%HP` int DEFAULT '0',
  `L_%ATK` int DEFAULT '0',
  `L_%DEF` int DEFAULT '0',
  `L_EM` int DEFAULT '0',
  `L_ER` int DEFAULT '0',
  `L_Crit Rate` int DEFAULT '0',
  `L_Crit DMG` int DEFAULT '0',
  `Added substat` varchar(20) DEFAULT 'None',
  `CreateDate` date DEFAULT (curdate()),
  `LastAdded` date DEFAULT (curdate()),
  PRIMARY KEY (`ID`),
  CONSTRAINT `Artifact leveling_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `Artifact itself` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Drive Disc`
--

DROP TABLE IF EXISTS `Drive Disc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Drive Disc` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Set` varchar(255) DEFAULT NULL,
  `Slot` varchar(50) DEFAULT NULL,
  `Main Stat` varchar(50) DEFAULT NULL,
  `Number of substat` int DEFAULT NULL,
  `%ATK` int DEFAULT '0',
  `%HP` int DEFAULT '0',
  `%DEF` int DEFAULT '0',
  `ATK` int DEFAULT '0',
  `HP` int DEFAULT '0',
  `DEF` int DEFAULT '0',
  `PEN` int DEFAULT '0',
  `AP` int DEFAULT '0',
  `Crit Rate` int DEFAULT '0',
  `Crit DMG` int DEFAULT '0',
  `Where got it` varchar(50) DEFAULT NULL,
  `Score` varchar(50) DEFAULT NULL,
  `CreateDate` date DEFAULT (curdate()),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2563 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Drive Disc leveling`
--

DROP TABLE IF EXISTS `Drive Disc leveling`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Drive Disc leveling` (
  `ID` int NOT NULL,
  `L_HP` int DEFAULT '0',
  `L_ATK` int DEFAULT '0',
  `L_DEF` int DEFAULT '0',
  `L_%HP` int DEFAULT '0',
  `L_%ATK` int DEFAULT '0',
  `L_%DEF` int DEFAULT '0',
  `L_AP` int DEFAULT '0',
  `L_PEN` int DEFAULT '0',
  `L_Crit Rate` int DEFAULT '0',
  `L_Crit DMG` int DEFAULT '0',
  `Added substat` varchar(20) DEFAULT 'None',
  `CreateDate` date DEFAULT (curdate()),
  `LastAdded` date DEFAULT (curdate()),
  PRIMARY KEY (`ID`),
  CONSTRAINT `Drive Disc leveling_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `Drive Disc` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-06  5:35:34
