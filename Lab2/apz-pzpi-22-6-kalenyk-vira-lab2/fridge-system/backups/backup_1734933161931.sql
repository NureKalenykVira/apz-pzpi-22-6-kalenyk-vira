-- MySQL dump 10.13  Distrib 9.1.0, for Linux (x86_64)
--
-- Host: localhost    Database: fridge_system
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `AlgorithmSettings`
--

DROP TABLE IF EXISTS `AlgorithmSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AlgorithmSettings` (
  `SettingID` int NOT NULL AUTO_INCREMENT,
  `SettingName` varchar(255) NOT NULL,
  `SettingValue` varchar(255) NOT NULL,
  `Description` text,
  PRIMARY KEY (`SettingID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AlgorithmSettings`
--

LOCK TABLES `AlgorithmSettings` WRITE;
/*!40000 ALTER TABLE `AlgorithmSettings` DISABLE KEYS */;
INSERT INTO `AlgorithmSettings` VALUES (1,'SafetyMarginDays','LowPrecision','Додаткові дні безпеки для споживання продукту'),(2,'HighTemperatureImpactDays','3','Кількість днів, які зменшуються через високу температуру'),(3,'HighHumidityImpactDays','1','Кількість днів, які зменшуються через високу вологість');
/*!40000 ALTER TABLE `AlgorithmSettings` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notifications`
--

LOCK TABLES `Notifications` WRITE;
/*!40000 ALTER TABLE `Notifications` DISABLE KEYS */;
INSERT INTO `Notifications` VALUES (3,NULL,NULL,NULL,NULL,'2024-12-16 22:05:59'),(4,1,NULL,'Humidity is too high','New','2024-12-16 22:06:11'),(7,1,NULL,'Hello Alice, your product \"Apple\" is about to expire on Fri Dec 20 2024 00:00:00 GMT+0200 (за східноєвропейським стандартним часом). Please use it soon.','New','2024-12-19 04:58:44'),(8,2,NULL,'Hello Bob, your product \"Juice\" is about to expire on Fri Dec 20 2024 00:00:00 GMT+0200 (за східноєвропейським стандартним часом). Please use it soon.','New','2024-12-19 04:58:44'),(9,2,NULL,'Dear Bob, your product \"Expired Milk\" expired on Tue Dec 10 2024 00:00:00 GMT+0200 (за східноєвропейським стандартним часом). Please discard it.','New','2024-12-19 05:06:21'),(10,2,NULL,'Dear Bob, your product \"Expired Cheese\" expired on Wed Dec 11 2024 00:00:00 GMT+0200 (за східноєвропейським стандартним часом). Please discard it.','New','2024-12-19 05:06:21'),(11,1,16,'Проблеми з умовами зберігання: Температура перевищує норму. Вологість перевищує норму.','New','2024-12-19 06:14:37'),(12,1,17,'Проблеми з умовами зберігання: Температура перевищує норму. Вологість перевищує норму.','New','2024-12-19 06:14:46'),(13,1,NULL,'Сенсор 16 виявив проблеми:\n- Температура перевищує норму: 12.5°C.\n- Вологість перевищує норму: 85.3%.','New','2024-12-19 06:29:12'),(14,1,NULL,'Сенсор 17 виявив проблеми:\n- Температура перевищує норму: 15°C.\n- Вологість перевищує норму: 90%.','New','2024-12-19 06:29:12'),(15,2,NULL,'Сенсор 3 виявив проблеми:\n- Вологість перевищує норму: 80.2%.','New','2024-12-19 06:29:12'),(16,2,NULL,'Сенсор 14 виявив проблеми:\n- Температура перевищує норму: 20°C.\n- Вологість перевищує норму: 95%.','New','2024-12-19 06:29:12'),(17,2,NULL,'Сенсор 15 виявив проблеми:\n- Вологість перевищує норму: 90%.','New','2024-12-19 06:29:12'),(18,1,17,'Проблеми з умовами зберігання: Температура перевищує норму. Вологість перевищує норму.','New','2024-12-19 06:29:46'),(19,1,NULL,'Hello Alice, your product \"Chicken\" is about to expire on Sun Dec 22 2024 00:00:00 GMT+0200 (за східноєвропейським стандартним часом). Please use it soon.','New','2024-12-21 01:29:06');
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
INSERT INTO `Products` VALUES (2,2,'Juice','Beverages','2024-12-20',NULL,'2024-12-16 04:04:38','2024-12-16 04:04:38'),(4,2,'Milk','Dairy','2024-12-31','RFID12345','2024-12-17 01:12:26','2024-12-17 01:12:26'),(5,2,'Cheese','Dairy','2025-01-15','RFID67890','2024-12-17 01:12:26','2024-12-17 01:12:26'),(6,4,'Apple','Fruit','2024-12-20','RFID54321','2024-12-17 01:12:26','2024-12-17 01:12:26'),(7,4,'Carrot','Vegetable','2024-12-25','RFID98765','2024-12-17 01:12:26','2024-12-17 01:12:26'),(8,5,'Chicken','Meat','2024-12-22','RFID13579','2024-12-17 01:12:26','2024-12-17 01:12:26'),(9,5,'Fish','Meat','2024-12-19','RFID24680','2024-12-17 01:12:26','2024-12-17 01:12:26'),(11,2,'Expired Milk','Dairy','2024-12-10','RFID12345','2024-12-19 05:06:15','2024-12-19 05:06:15'),(12,2,'Expired Cheese','Dairy','2024-12-11','RFID67890','2024-12-19 05:06:15','2024-12-19 05:06:15');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Refrigerators`
--

LOCK TABLES `Refrigerators` WRITE;
/*!40000 ALTER TABLE `Refrigerators` DISABLE KEYS */;
INSERT INTO `Refrigerators` VALUES (2,2,'Office Fridge','Office','2024-12-16 04:04:29','2024-12-16 04:04:29'),(4,1,'Fridge1','Kitchen','2024-12-16 20:58:16','2024-12-16 20:58:16'),(5,1,'Fridge1','Kitchen','2024-12-17 00:56:32','2024-12-17 00:56:32');
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
  `Frequency` int NOT NULL COMMENT 'Частота у годинах',
  `LastGenerated` datetime DEFAULT NULL,
  PRIMARY KEY (`SettingID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ReportSettings`
--

LOCK TABLES `ReportSettings` WRITE;
/*!40000 ALTER TABLE `ReportSettings` DISABLE KEYS */;
INSERT INTO `ReportSettings` VALUES (1,12,NULL),(2,12,NULL),(3,12,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SensorData`
--

LOCK TABLES `SensorData` WRITE;
/*!40000 ALTER TABLE `SensorData` DISABLE KEYS */;
INSERT INTO `SensorData` VALUES (12,3,2,4.5,80.2,'2024-12-17 01:13:49'),(13,13,2,5,75,'2024-12-17 01:13:49'),(14,14,4,6.2,60,'2024-12-17 01:13:49'),(15,15,5,3.8,90,'2024-12-17 01:13:49'),(16,16,6,2,85.5,'2024-12-17 01:13:49'),(17,17,7,8,70.3,'2024-12-17 01:13:49'),(18,18,8,5.5,65.2,'2024-12-17 01:13:49'),(23,13,2,12,85,'2024-12-15 10:00:00'),(24,14,2,14,70,'2024-12-16 12:00:00'),(33,16,8,12.5,85.3,'2024-12-19 05:54:33'),(34,17,8,15,90,'2024-12-19 05:54:33'),(35,14,6,20,95,'2024-12-19 05:54:33'),(36,13,6,8,78,'2024-12-19 05:54:33');
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
  `SensorType` varchar(50) NOT NULL,
  `MinValue` float NOT NULL,
  `MaxValue` float NOT NULL,
  PRIMARY KEY (`ThresholdID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SensorThresholds`
--

LOCK TABLES `SensorThresholds` WRITE;
/*!40000 ALTER TABLE `SensorThresholds` DISABLE KEYS */;
INSERT INTO `SensorThresholds` VALUES (1,'Temperature',-10,40),(2,'Humidity',10,90),(3,'Pressure',900,1100);
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sensors`
--

LOCK TABLES `Sensors` WRITE;
/*!40000 ALTER TABLE `Sensors` DISABLE KEYS */;
INSERT INTO `Sensors` VALUES (3,2,'RFID','Inactive','2024-12-16 04:04:47','2024-12-16 18:52:03'),(13,2,'Temperature','Active','2024-12-17 01:04:55','2024-12-17 01:04:55'),(14,2,'Humidity','Inactive','2024-12-17 01:04:55','2024-12-17 01:04:55'),(15,2,'RFID','Active','2024-12-17 01:04:55','2024-12-17 01:04:55'),(16,4,'Temperature','Inactive','2024-12-17 01:04:55','2024-12-17 01:04:55'),(17,5,'Humidity','Active','2024-12-17 01:04:55','2024-12-17 01:04:55'),(18,5,'RFID','Active','2024-12-17 01:04:55','2024-12-17 01:04:55'),(20,5,'Temperature','Active','2024-12-17 01:21:28','2024-12-17 01:21:28');
/*!40000 ALTER TABLE `Sensors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SystemConfigurations`
--

DROP TABLE IF EXISTS `SystemConfigurations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SystemConfigurations` (
  `ConfigID` int NOT NULL AUTO_INCREMENT,
  `ConfigName` varchar(100) NOT NULL,
  `ConfigValue` text NOT NULL,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ConfigID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SystemConfigurations`
--

LOCK TABLES `SystemConfigurations` WRITE;
/*!40000 ALTER TABLE `SystemConfigurations` DISABLE KEYS */;
INSERT INTO `SystemConfigurations` VALUES (1,'SecurityPolicy','Moderate','2024-12-22 17:03:57'),(2,'IntegrationEnabled','false','2024-12-22 17:01:47'),(3,'MaxLoginAttempts','5','2024-12-22 17:01:47');
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
  `UserID` int NOT NULL,
  `Token` text NOT NULL,
  `Expiration` datetime NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`TokenID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `UserTokens_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserTokens`
--

LOCK TABLES `UserTokens` WRITE;
/*!40000 ALTER TABLE `UserTokens` DISABLE KEYS */;
INSERT INTO `UserTokens` VALUES (1,11,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJyb2xlIjoiUHJvZHVjdEFkbWluIiwiaWF0IjoxNzM0ODIxMTQ5LCJleHAiOjE3MzQ4MjQ3NDl9.oIZVUSHkuRomHzc8k8HASIveDHU6XZ7HS4T16TBgkA0','2024-12-22 01:45:50','2024-12-21 22:45:49'),(2,11,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJyb2xlIjoiUHJvZHVjdEFkbWluIiwiaWF0IjoxNzM0ODIxNTY2LCJleHAiOjE3MzQ4MjUxNjZ9.ZOTIi9LuZW013lpFs_KjQDS50QuiTd3bmpYQWZa4veo','2024-12-22 01:52:46','2024-12-21 22:52:46'),(3,12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJyb2xlIjoiR2xvYmFsQWRtaW4iLCJpYXQiOjE3MzQ4MjE4MTgsImV4cCI6MTczNDgyNTQxOH0.WQg-rE_F7e3477c1rppSslsGOdbG2LSn2stfpAPkXNU','2024-12-22 01:56:59','2024-12-21 22:56:58'),(4,13,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEzLCJyb2xlIjoiREJBZG1pbiIsImlhdCI6MTczNDgyMTgyNywiZXhwIjoxNzM0ODI1NDI3fQ._2ZSEStRZJU2yPzWmm_djXJp2-POYPpS4Ia8SUtGGbk','2024-12-22 01:57:08','2024-12-21 22:57:07'),(5,14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJyb2xlIjoiTG9naWNBZG1pbiIsImlhdCI6MTczNDgyMTgzNiwiZXhwIjoxNzM0ODI1NDM2fQ.S7XUydwgwbfUVYR0s23xRHAj-RNzXSAu9-9HeGUpOw0','2024-12-22 01:57:16','2024-12-21 22:57:16'),(6,15,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE1LCJyb2xlIjoiUHJvZHVjdEFkbWluIiwiaWF0IjoxNzM0ODIxODQyLCJleHAiOjE3MzQ4MjU0NDJ9.LSeFx3o-fueO51RXjAplpDoQsDOV9gFXWnla85yx9NE','2024-12-22 01:57:22','2024-12-21 22:57:22'),(7,16,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJyb2xlIjoiUmVndWxhclVzZXIiLCJpYXQiOjE3MzQ4MjE4NDksImV4cCI6MTczNDgyNTQ0OX0.sp47FMgHeP_x8eqqvuJbwRJAzVNhpJwYOftcZJ32JmA','2024-12-22 01:57:30','2024-12-21 22:57:29'),(8,17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE3LCJyb2xlIjoiR2xvYmFsQWRtaW4iLCJpYXQiOjE3MzQ4MjYxNTAsImV4cCI6MTczNDgyOTc1MH0.rw3n4DCmHKC3IdlW62ACqwRhNE210Zde_VG6BHgqb_0','2024-12-22 03:09:10','2024-12-22 00:09:10'),(9,14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJyb2xlIjoiTG9naWNBZG1pbiIsImlhdCI6MTczNDg3MzU2NCwiZXhwIjoxNzM0ODc3MTY0fQ.VQkm0J_x8xmi-4wdGmtgHEvK8yOSyhWDGC2lmrK8KxQ','2024-12-22 16:19:25','2024-12-22 13:19:24'),(10,18,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4LCJyb2xlIjoiTG9naWNBZG1pbiIsImlhdCI6MTczNDg3MzY2OSwiZXhwIjoxNzM0ODc3MjY5fQ.lSpVoQ7quJWONz-YBfrHcNqlqOX-NFqPUv_6qsoNxU8','2024-12-22 16:21:09','2024-12-22 13:21:09'),(11,18,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4LCJyb2xlIjoiTG9naWNBZG1pbiIsImlhdCI6MTczNDg3MzY4OSwiZXhwIjoxNzM0ODc3Mjg5fQ.oJ2wcmoP3Tgq6h4pjWYXU95y9w3ipy1OrlGnHL_M-Wc','2024-12-22 16:21:29','2024-12-22 13:21:29'),(12,18,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4LCJyb2xlIjoiTG9naWNBZG1pbiIsImlhdCI6MTczNDg3Mzc4MiwiZXhwIjoxNzM0ODc3MzgyfQ.EeKhdOLQD4OARbLBnYyJldM5YzZytB5F9miaooq6ZMQ','2024-12-22 16:23:03','2024-12-22 13:23:02'),(13,19,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE5LCJyb2xlIjoiUmVndWxhclVzZXIiLCJpYXQiOjE3MzQ4NzQ3ODgsImV4cCI6MTczNDg3ODM4OH0.TY4HUPZhMhr-xfUcHOzUvX5JAuec6nY_ifQGGpKvFIQ','2024-12-22 16:39:48','2024-12-22 13:39:48'),(14,19,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE5LCJyb2xlIjoiUmVndWxhclVzZXIiLCJpYXQiOjE3MzQ4NzQ4MTIsImV4cCI6MTczNDg3ODQxMn0.ReJirubP-0Bb-7TI0QM5LfUjg6hpAPEuaFUcVlKdGmc','2024-12-22 16:40:12','2024-12-22 13:40:12'),(15,20,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJyb2xlIjoiUmVndWxhclVzZXIiLCJpYXQiOjE3MzQ4Nzg1MTEsImV4cCI6MTczNDg4MjExMX0.Tzl08QM4D2K0UHmKIq2qryGDNG_-pX6_IeOtZYFBgNM','2024-12-22 17:41:51','2024-12-22 14:41:51'),(16,20,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJyb2xlIjoiUmVndWxhclVzZXIiLCJpYXQiOjE3MzQ4Nzg1MTksImV4cCI6MTczNDg4MjExOX0.eZEvJEpColOHq54Hda1tw_dVYh8asko5UOAltuO-WKA','2024-12-22 17:42:00','2024-12-22 14:41:59'),(17,22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIyLCJyb2xlIjoiUmVndWxhclVzZXIiLCJpYXQiOjE3MzQ4Nzg5MjksImV4cCI6MTczNTA1MTcyOX0.Z9it3mQNAzU5TFb3fPTL7t6b5gtJ50mezjf6IYjSgZ0','2024-12-22 17:48:50','2024-12-22 14:48:49'),(18,22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIyLCJyb2xlIjoiUmVndWxhclVzZXIiLCJpYXQiOjE3MzQ4Nzg5NDMsImV4cCI6MTczNTA1MTc0M30.rabV1bjRP9smzSvFjTusp4qlTYs5xgPVl5U-CZmhw1M','2024-12-22 17:49:03','2024-12-22 14:49:03'),(19,22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIyLCJyb2xlIjoiUmVndWxhclVzZXIiLCJpYXQiOjE3MzQ4NzkxNjcsImV4cCI6MTczNTA1MTk2N30.R1xsmH2_JMB29b3lkWeKR4t3yImp1-t0mCmXcuWtrjk','2024-12-22 17:52:48','2024-12-22 14:52:47'),(20,22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIyLCJyb2xlIjoiUmVndWxhclVzZXIiLCJpYXQiOjE3MzQ4Nzk1NzMsImV4cCI6MTczNTA1MjM3M30.ADX1WbZZOL12odbVxykX28wgp8HEB5Q4cOEzAgQfvDE','2024-12-22 17:59:34','2024-12-22 14:59:33'),(21,22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIyLCJyb2xlIjoiUmVndWxhclVzZXIiLCJpYXQiOjE3MzQ4Nzk5NDEsImV4cCI6MTczNTA1Mjc0MX0.8qmP3Pq2m0CQRsHGm0RAACkYLWjpBdcAy296uExE1lA','2024-12-22 18:05:41','2024-12-22 15:05:41'),(22,23,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJyb2xlIjoiR2xvYmFsQWRtaW4iLCJpYXQiOjE3MzQ4ODY2MDUsImV4cCI6MTczNTA1OTQwNX0.OAAxzL-mspB2ya8ZdKg23EqQuOQapJehS0Pnnaz-gWI','2024-12-22 19:56:46','2024-12-22 16:56:45'),(23,23,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJyb2xlIjoiR2xvYmFsQWRtaW4iLCJpYXQiOjE3MzQ4ODY2MjYsImV4cCI6MTczNTA1OTQyNn0.TJL2Gyp7iKn6baY8Zw6Jd1ya3OsIWXEa2zJyCKHHljU','2024-12-22 19:57:07','2024-12-22 16:57:06'),(24,24,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI0LCJyb2xlIjoiTG9naWNBZG1pbiIsImlhdCI6MTczNDg4ODcxMiwiZXhwIjoxNzM1MDYxNTEyfQ.ZDs5JRo1Xg-csRiNb6Qma84VUOXOugXVlw7hycgw_Ok','2024-12-22 20:31:52','2024-12-22 17:31:52'),(25,24,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI0LCJyb2xlIjoiTG9naWNBZG1pbiIsImlhdCI6MTczNDg4ODczMywiZXhwIjoxNzM1MDYxNTMzfQ.ZdtN2qzS8uBvtqPr5mr9Qjz0i0iJIJOnvn5ljuq97-8','2024-12-22 20:32:13','2024-12-22 17:32:13'),(26,24,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI0LCJyb2xlIjoiTG9naWNBZG1pbiIsImlhdCI6MTczNDkwNTI0NSwiZXhwIjoxNzM1MDc4MDQ1fQ.h4UgCiN6K0ymjaX6DTYFc0fj6U7tfjLNkNpJiQ-erC8','2024-12-23 01:07:26','2024-12-22 22:07:25'),(27,25,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI1LCJyb2xlIjoiREJBZG1pbiIsImlhdCI6MTczNDkwODY5NCwiZXhwIjoxNzM1MDgxNDk0fQ.LGJHTlWe0YYGj4LmTFLVDfksE4am7wFW8LL3Ccys464','2024-12-23 02:04:54','2024-12-22 23:04:54'),(28,25,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI1LCJyb2xlIjoiREJBZG1pbiIsImlhdCI6MTczNDkwODcxMCwiZXhwIjoxNzM1MDgxNTEwfQ.nwxBSr2lvL2bMrJMev6f0bJlNi3aicUTlVNVtv-4EAk','2024-12-23 02:05:10','2024-12-22 23:05:10'),(29,25,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI1LCJyb2xlIjoiREJBZG1pbiIsImlhdCI6MTczNDkwOTQ4NSwiZXhwIjoxNzM1MDgyMjg1fQ.g4e4i-f0AbIq2daa--wSQ2CCj4Sywg8Pb-iFTsaW2dY','2024-12-23 02:18:05','2024-12-22 23:18:05'),(30,25,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI1LCJyb2xlIjoiREJBZG1pbiIsImlhdCI6MTczNDkzMjM0MiwiZXhwIjoxNzM1MTA1MTQyfQ.ZGl-1sqdiNoiEuzuejDbxT32NT7kRvJI9ILueDa2wh8','2024-12-23 08:39:02','2024-12-23 05:39:02');
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
  `Role` enum('GlobalAdmin','DBAdmin','LogicAdmin','ProductAdmin','RegularUser') DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'Alice','alice@example.com','hashed_password','ProductAdmin','2024-12-16 04:04:21','2024-12-21 02:10:15'),(2,'Bob','bob@example.com','hashed_password','RegularUser','2024-12-16 04:04:21','2024-12-21 02:10:25'),(4,'Leo Updated','leo_updated@example.com','newpassword123','RegularUser','2024-12-16 20:53:56','2024-12-21 02:10:25'),(5,'Leo','leo@example.com','securepassword123','ProductAdmin','2024-12-16 23:14:27','2024-12-21 02:10:15'),(9,'Admin User','admin@example.com','$2a$10$wDY/N9bz3m87SXj4SokYZOe/hBSOFbDNFoYvwRhuF.UnYpCAeukJO','GlobalAdmin','2024-12-21 04:35:13','2024-12-21 04:35:13'),(10,'Admin User 2','admin2@example.com','$2a$10$oH586e6lku2xtRf1hvxBe.Y5WtUGMd/OdHLn/oJ6FJGU/mRz6wkOi','ProductAdmin','2024-12-21 22:35:04','2024-12-21 22:35:04'),(11,'Admin User 3','admin3@example.com','$2a$10$c3EKO5O8ATH5AtxAfynewutZV5OqHdCHYhDw97FrBLtiK9QVejTiK','ProductAdmin','2024-12-21 22:45:49','2024-12-21 22:45:49'),(12,'Global Admin','globaladmin@example.com','$2a$10$3g5KpWFGOlNYz.12GdY9reTDgjMApXngSIfzRrq2sleE7Cr306LNy','GlobalAdmin','2024-12-21 22:56:58','2024-12-21 22:56:58'),(13,'DB Admin','dbadmin@example.com','$2a$10$rgRZRMBzZZmSni3/aY5qYe2UeFvNX9JjdzKnlHvdgqI4AfOJe0CBu','DBAdmin','2024-12-21 22:57:07','2024-12-21 22:57:07'),(14,'Logic Admin','logicadmin@example.com','$2a$10$q7T9OLQABAbhaCcZ8.6qcuf1/4K4kVCnMAwHGogSbQ1ZQXSbKlKSm','LogicAdmin','2024-12-21 22:57:16','2024-12-21 22:57:16'),(15,'Product Admin','productadmin@example.com','$2a$10$aAxyPxYI/1i7EW9uRVDttebnaGK.5fTvKdNEtD67p8nmUT2Qv.Q9C','ProductAdmin','2024-12-21 22:57:22','2024-12-21 22:57:22'),(16,'Regular User','regularuser@example.com','$2a$10$8K54H8UF3qNglW.o7fN1UezE9EbF5.ruG/hBUkb8d55lhKLU0Vbbq','RegularUser','2024-12-21 22:57:29','2024-12-21 22:57:29'),(17,'GlobalAdmin1','globaladmin1@example.com','$2a$10$aZbWY7QZ37/8.bcS2e6ab.LoDYkD.2F6wTfwqE6EshC3x0ZaLD0Le','GlobalAdmin','2024-12-22 00:09:10','2024-12-22 00:09:10'),(18,'LogicAdmin1','logicadmin1@example.com','$2a$10$jACFPx/VUkZepjGbXqK3puiLkWiHDUnBBGH4joyVAmwFOdQz/TEUS','LogicAdmin','2024-12-22 13:21:09','2024-12-22 13:21:09'),(19,'TestUser','testuser@example.com','$2a$10$DXGY0w2N4zeqBSJaZOLOUuicv6tBzrl5Msnbb.N8y33VyLxr/0l9u','RegularUser','2024-12-22 13:39:48','2024-12-22 13:39:48'),(20,'TestUser1','testuser1@example.com','$2a$10$VccXj34yUo.tmc/YHFy0LOCXT09olpd.NsY5AdolLn8h5woz8Kehi','RegularUser','2024-12-22 14:41:51','2024-12-22 14:41:51'),(21,'TestUser2','testuser2@example.com','$2a$10$3WuGsmm1xBA6RAN8BlLTveaQQwsJ8HJ8Jg5jFhQRqJjg.dp//5qfu','RegularUser','2024-12-22 14:46:54','2024-12-22 14:46:54'),(22,'New Name','newemail@example.com','$2a$10$0oaQCKST8jh3k2uZev0QVOm3CPX6B/unqDpDAcTx09DtdTDeR2AGq','RegularUser','2024-12-22 14:48:49','2024-12-22 15:09:24'),(23,'GlobalAdmin2','globaladmin2@example.com','$2a$10$F.pqB4GBrdYLPEUUQKp3se29OCs7SdV5K6JMx52Np8M1DYOxeo/nC','GlobalAdmin','2024-12-22 16:56:45','2024-12-22 16:56:45'),(24,'LogicAdmin2','logicadmin2@example.com','$2a$10$uGaSxXlw.oxvVbQZHnhetuSiW7Z73gF0UhWP5hrF/MoPHfZsxmPxG','LogicAdmin','2024-12-22 17:31:52','2024-12-22 17:31:52'),(25,'DBAdmin1','dbadmin1@example.com','$2a$10$n/8Y7GC0shgNEiB2loRmGOzX17t5yZcrGB9CTp0t8N8C4GjSRTx8.','DBAdmin','2024-12-22 23:04:54','2024-12-22 23:04:54');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-23  5:52:42
