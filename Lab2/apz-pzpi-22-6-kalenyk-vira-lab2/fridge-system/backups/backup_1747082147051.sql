-- MySQL dump 10.13  Distrib 9.3.0, for Linux (x86_64)
--
-- Host: localhost    Database: fridge_system
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `AdminLogs`
--

DROP TABLE IF EXISTS `AdminLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AdminLogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int NOT NULL,
  `action` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `AdminLogs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AdminLogs`
--

LOCK TABLES `AdminLogs` WRITE;
/*!40000 ALTER TABLE `AdminLogs` DISABLE KEYS */;
INSERT INTO `AdminLogs` VALUES (1,6,'UPDATE_ROLE','Role updated to BusinessLogicAdmin for user ID 1','2025-05-12 11:36:55'),(2,3,'CREATE_FRIDGE','Fridge Samsung Model X 4500 додано в локацію Kitchen','2025-05-12 13:54:53');
/*!40000 ALTER TABLE `AdminLogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AlgorithmSettings`
--

DROP TABLE IF EXISTS `AlgorithmSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AlgorithmSettings` (
  `SettingID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Value` varchar(255) DEFAULT NULL,
  `Description` text,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SettingID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AlgorithmSettings`
--

LOCK TABLES `AlgorithmSettings` WRITE;
/*!40000 ALTER TABLE `AlgorithmSettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `AlgorithmSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Configurations`
--

DROP TABLE IF EXISTS `Configurations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Configurations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `config_key` varchar(255) NOT NULL,
  `config_value` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Configurations`
--

LOCK TABLES `Configurations` WRITE;
/*!40000 ALTER TABLE `Configurations` DISABLE KEYS */;
INSERT INTO `Configurations` VALUES (1,'MAX_STORAGE_LIMIT','500','Maximum storage limit for products','2025-05-12 03:04:26','2025-05-12 03:04:26'),(2,'API_TIMEOUT','30','Timeout for API requests in seconds','2025-05-12 03:04:26','2025-05-12 03:04:26'),(3,'REPORT_GENERATION_ENABLED','true','Enable or disable report generation','2025-05-12 03:04:26','2025-05-12 03:04:26');
/*!40000 ALTER TABLE `Configurations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notifications`
--

DROP TABLE IF EXISTS `Notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notifications` (
  `NotificationID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `DataID` int DEFAULT NULL,
  `Message` text,
  `Status` enum('New','Read') DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`NotificationID`),
  KEY `UserID` (`UserID`),
  KEY `DataID` (`DataID`),
  CONSTRAINT `Notifications_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `Notifications_ibfk_2` FOREIGN KEY (`DataID`) REFERENCES `SensorData` (`DataID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notifications`
--

LOCK TABLES `Notifications` WRITE;
/*!40000 ALTER TABLE `Notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `Notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Products`
--

DROP TABLE IF EXISTS `Products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Products` (
  `ProductID` int NOT NULL AUTO_INCREMENT,
  `RefrigeratorID` int NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Category` varchar(100) DEFAULT NULL,
  `ExpirationDate` date NOT NULL,
  `RFIDTag` varchar(100) DEFAULT NULL,
  `AddedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ProductID`),
  KEY `RefrigeratorID` (`RefrigeratorID`),
  CONSTRAINT `Products_ibfk_1` FOREIGN KEY (`RefrigeratorID`) REFERENCES `Refrigerators` (`RefrigeratorID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
INSERT INTO `Products` VALUES (1,1,'Milk','Dairy','2025-06-01','RFID1234','2025-05-12 00:14:43','2025-05-12 00:14:43'),(2,1,'Butter','Dairy','2025-07-01','RFID5678','2025-05-12 00:14:43','2025-05-12 00:14:43'),(3,2,'Frozen Peas','Vegetables','2025-12-15','RFID9101','2025-05-12 00:14:43','2025-05-12 00:14:43');
/*!40000 ALTER TABLE `Products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Refrigerators`
--

DROP TABLE IF EXISTS `Refrigerators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Refrigerators` (
  `RefrigeratorID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`RefrigeratorID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Refrigerators_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Refrigerators`
--

LOCK TABLES `Refrigerators` WRITE;
/*!40000 ALTER TABLE `Refrigerators` DISABLE KEYS */;
INSERT INTO `Refrigerators` VALUES (1,1,'Main Fridge','Kitchen','2025-05-12 00:14:43','2025-05-12 00:14:43'),(2,2,'Backup Fridge','Garage','2025-05-12 00:14:43','2025-05-12 00:14:43'),(3,1,'Samsung Model X 5500','Kitchen','2025-05-12 13:04:07','2025-05-12 13:04:07'),(4,2,'Samsung Model X 2000','Kitchen','2025-05-12 13:44:17','2025-05-12 13:44:17'),(5,3,'Samsung Model X 4500','Kitchen','2025-05-12 13:54:53','2025-05-12 13:54:53');
/*!40000 ALTER TABLE `Refrigerators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ReportSettings`
--

DROP TABLE IF EXISTS `ReportSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ReportSettings` (
  `SettingID` int NOT NULL AUTO_INCREMENT,
  `Frequency` int DEFAULT NULL,
  `LastGenerated` datetime DEFAULT NULL,
  PRIMARY KEY (`SettingID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ReportSettings`
--

LOCK TABLES `ReportSettings` WRITE;
/*!40000 ALTER TABLE `ReportSettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `ReportSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SensorData`
--

DROP TABLE IF EXISTS `SensorData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SensorData` (
  `DataID` int NOT NULL AUTO_INCREMENT,
  `SensorID` int DEFAULT NULL,
  `ProductID` int DEFAULT NULL,
  `Temperature` float DEFAULT NULL,
  `Humidity` float DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`DataID`),
  KEY `SensorID` (`SensorID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `SensorData_ibfk_1` FOREIGN KEY (`SensorID`) REFERENCES `Sensors` (`SensorID`) ON DELETE CASCADE,
  CONSTRAINT `SensorData_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `Products` (`ProductID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SensorData`
--

LOCK TABLES `SensorData` WRITE;
/*!40000 ALTER TABLE `SensorData` DISABLE KEYS */;
INSERT INTO `SensorData` VALUES (1,1,1,4,75,'2025-05-12 14:30:00'),(2,2,2,3.5,60,'2025-05-12 15:00:00');
/*!40000 ALTER TABLE `SensorData` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SensorThresholds`
--

DROP TABLE IF EXISTS `SensorThresholds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SensorThresholds` (
  `ThresholdID` int NOT NULL AUTO_INCREMENT,
  `SensorType` varchar(50) DEFAULT NULL,
  `MinValue` float DEFAULT NULL,
  `MaxValue` float DEFAULT NULL,
  PRIMARY KEY (`ThresholdID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SensorThresholds`
--

LOCK TABLES `SensorThresholds` WRITE;
/*!40000 ALTER TABLE `SensorThresholds` DISABLE KEYS */;
/*!40000 ALTER TABLE `SensorThresholds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sensors`
--

DROP TABLE IF EXISTS `Sensors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sensors` (
  `SensorID` int NOT NULL AUTO_INCREMENT,
  `RefrigeratorID` int DEFAULT NULL,
  `Type` enum('Temperature','Humidity','RFID') DEFAULT NULL,
  `Status` enum('Active','Inactive') DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`SensorID`),
  KEY `RefrigeratorID` (`RefrigeratorID`),
  CONSTRAINT `Sensors_ibfk_1` FOREIGN KEY (`RefrigeratorID`) REFERENCES `Refrigerators` (`RefrigeratorID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sensors`
--

LOCK TABLES `Sensors` WRITE;
/*!40000 ALTER TABLE `Sensors` DISABLE KEYS */;
INSERT INTO `Sensors` VALUES (1,1,'Temperature','Active','2025-05-12 00:14:43','2025-05-12 00:14:43'),(2,1,'Humidity','Active','2025-05-12 00:14:43','2025-05-12 00:14:43'),(3,2,'RFID','Inactive','2025-05-12 00:14:43','2025-05-12 00:14:43');
/*!40000 ALTER TABLE `Sensors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Settings`
--

DROP TABLE IF EXISTS `Settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Settings` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `maxTemperature` int DEFAULT NULL,
  `minTemperature` int DEFAULT NULL,
  `maxHumidity` int DEFAULT NULL,
  `minHumidity` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Settings`
--

LOCK TABLES `Settings` WRITE;
/*!40000 ALTER TABLE `Settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `Settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SystemConfigurations`
--

DROP TABLE IF EXISTS `SystemConfigurations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SystemConfigurations` (
  `ConfigID` int NOT NULL AUTO_INCREMENT,
  `ConfigName` varchar(255) DEFAULT NULL,
  `ConfigValue` varchar(255) DEFAULT NULL,
  `Description` text,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ConfigID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SystemConfigurations`
--

LOCK TABLES `SystemConfigurations` WRITE;
/*!40000 ALTER TABLE `SystemConfigurations` DISABLE KEYS */;
/*!40000 ALTER TABLE `SystemConfigurations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserTokens`
--

DROP TABLE IF EXISTS `UserTokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserTokens` (
  `TokenID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `Token` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `Expiration` datetime DEFAULT NULL,
  PRIMARY KEY (`TokenID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `UserTokens_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserTokens`
--

LOCK TABLES `UserTokens` WRITE;
/*!40000 ALTER TABLE `UserTokens` DISABLE KEYS */;
INSERT INTO `UserTokens` VALUES (1,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInJvbGUiOiJHbG9iYWxBZG1pbiIsImlhdCI6MTc0NzAxNTcyOSwiZXhwIjoxNzQ3MTg4NTI5fQ.dPAZEorumnj-yDgdOlbuP3gIDrm47y-YBn4hxoGO320','2025-05-12 02:08:49','2025-05-12 06:08:50'),(2,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInJvbGUiOiJHbG9iYWxBZG1pbiIsImlhdCI6MTc0NzAxNTc3MywiZXhwIjoxNzQ3MTg4NTczfQ.m7La1Z1GLWD9Q2Hlg4GRg8I_zGs2AoJYBMEawMYzex4','2025-05-12 02:09:33','2025-05-12 06:09:34'),(3,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInJvbGUiOiJHbG9iYWxBZG1pbiIsImlhdCI6MTc0NzA0OTI4NCwiZXhwIjoxNzQ3MjIyMDg0fQ.P5fk2MeXAAhTjHdcsceUs6Fav2L3wwul0dUMaXQnU_g','2025-05-12 11:28:04','2025-05-12 15:28:04'),(4,7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsInJvbGUiOiJVc2VyIiwiaWF0IjoxNzQ3MDUxNTE3LCJleHAiOjE3NDcyMjQzMTd9.D9NvXZ1yLBFnS3gmgLD62xpbVvzWcoe808UjJCQ_mnY','2025-05-12 12:05:17','2025-05-12 16:05:18'),(5,7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsInJvbGUiOiJVc2VyIiwiaWF0IjoxNzQ3MDUxNTM5LCJleHAiOjE3NDcyMjQzMzl9.cgHTbvE_3cEBByf-6E6RlLfZ30sM2BoKECcUhAqtImI','2025-05-12 12:05:39','2025-05-12 16:05:39'),(6,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInJvbGUiOiJHbG9iYWxBZG1pbiIsImlhdCI6MTc0NzA4MDkyMCwiZXhwIjoxNzQ3MjUzNzIwfQ.ylSob-Z6h5xxoG35IdQ_BcfvKt2taHp-S9tzHT-jrcE','2025-05-12 20:15:20','2025-05-13 00:15:20');
/*!40000 ALTER TABLE `UserTokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Role` enum('User','GlobalAdmin','BusinessLogicAdmin','ServiceAdmin','InfrastructureAdmin') DEFAULT 'User',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'John Doe','john.doe@example.com','password123','BusinessLogicAdmin','2025-05-12 00:14:43','2025-05-12 11:34:19'),(2,'Jane Smith','jane.smith@example.com','password123','User','2025-05-12 00:14:43','2025-05-12 01:57:58'),(3,'Logic Admin','logic@fridge.com','password123','BusinessLogicAdmin','2025-05-12 01:58:46','2025-05-12 01:58:46'),(4,'Service Admin','service@fridge.com','password123','ServiceAdmin','2025-05-12 01:58:46','2025-05-12 01:58:46'),(5,'Infra Admin','infra@fridge.com','password123','InfrastructureAdmin','2025-05-12 01:58:46','2025-05-12 01:58:46'),(6,'GlobalAdmin','GlobalAdmin@example.com','$2a$10$hFpLgCWXZe/Mh.QhckKL6OIX54xehYo19S35WZOl4jWEIB.qMpCYG','GlobalAdmin','2025-05-12 02:08:49','2025-05-12 02:08:49'),(7,'anastasia','anastasia@example.com','$2a$10$8TXoGZtCR6htkGWwg/u22ulf9X3HLimgCPViHd2776EGoRlRztSu6','User','2025-05-12 12:05:17','2025-05-12 12:05:17');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Zones`
--

DROP TABLE IF EXISTS `Zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Zones` (
  `ZoneID` int NOT NULL AUTO_INCREMENT,
  `ZoneName` varchar(255) DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `RefrigeratorID` int DEFAULT NULL,
  PRIMARY KEY (`ZoneID`),
  KEY `RefrigeratorID` (`RefrigeratorID`),
  CONSTRAINT `Zones_ibfk_1` FOREIGN KEY (`RefrigeratorID`) REFERENCES `Refrigerators` (`RefrigeratorID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Zones`
--

LOCK TABLES `Zones` WRITE;
/*!40000 ALTER TABLE `Zones` DISABLE KEYS */;
/*!40000 ALTER TABLE `Zones` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-12 20:35:47
