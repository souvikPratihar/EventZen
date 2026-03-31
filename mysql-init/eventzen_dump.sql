-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: eventzen_auth
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userEmail` varchar(255) NOT NULL,
  `eventId` int NOT NULL,
  `tickets` int NOT NULL,
  `status` varchar(255) DEFAULT 'CONFIRMED',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'customer6@gmail.com',1,10,'CONFIRMED','2026-03-30 08:02:38','2026-03-30 08:02:38'),(2,'customer4@gmail.com',2,2,'CONFIRMED','2026-03-30 08:07:42','2026-03-30 08:07:42'),(3,'customer6@gmail.com',3,20,'CONFIRMED','2026-03-30 08:19:31','2026-03-30 08:19:31');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `venueId` int NOT NULL,
  `vendorIds` json NOT NULL,
  `status` varchar(255) DEFAULT 'APPROVED',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `totalBudget` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Musical Concert','Grand Musical Concert of Shreya Ghoshal','2026-04-19 12:30:00','customer4@gmail.com',1,'[6, 4, 5]','APPROVED','2026-03-30 08:00:34','2026-03-30 08:00:34',99999),(2,'Dev Fest','An event where developers meet','2026-04-26 05:30:00','customer6@gmail.com',7,'[1, 8]','APPROVED','2026-03-30 08:05:53','2026-03-30 08:05:53',83000),(3,'Event ABC','Nothing','2026-03-30 04:30:00','customer4@gmail.com',5,'[3, 7]','COMPLETED','2026-03-30 08:17:33','2026-03-30 08:20:09',55000);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','CUSTOMER') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'admin@gmail.com','Admin','$2a$10$dCl.FEYrLVgvj2YNthz/tezeDBu9Plxmim30akHm20LsqiyRXfU4i','ADMIN'),(4,'user@gmail.com','User','$2a$10$laGfvnX402fhLP6oNejhYeWnAejJ03JzUY4rDpxSflSJH9dY.Z0su','CUSTOMER'),(5,'customer1@gmail.com','Customer 1','$2a$10$Mh.radfxKj2nhu52UFOHLeSmS1mL8AQlIwT/K13bTjsZXMkcSemrS','CUSTOMER'),(6,'customer2@gmail.com','Customer 2','$2a$10$8guGUghv/HaR8YdjZyzHqumNPOra4jOqG2cCNsraV0awxjJMxg1FW','CUSTOMER'),(7,'customer3@gmail.com','Customer 3','$2a$10$aPZRbpLKI/iheNyteRkdZ.EdFPfFPTD24G8GNobv5NZcQFlxuDl/C','CUSTOMER'),(8,'customer4@gmail.com','Customer 4','$2a$10$PN0Juqdy2apcfInok0T/7uisLgcYzEdLTxOSdhznn3YyhHsfy2OKe','CUSTOMER'),(9,'customer5@gmail.com','Customer 5','$2a$10$NVpFTGW6H./RuFuDGiNg8OUzMTEcwA0PC2aud6AR/QLBj/U1o/PDW','CUSTOMER'),(10,'customer6@gmail.com','Customer 6','$2a$10$lhKx4n5TsKKER83/sZ9lWe/B4BAQNMpXNR3y6NbTzYh4H9Uu43RP.','CUSTOMER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `isAvailable` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
INSERT INTO `vendors` VALUES (1,'ABC Catering','Food',20000,'9125634526',0,'2026-03-30 07:44:27','2026-03-30 08:05:53'),(2,'Royal Caterer','Food',24999,'8956342374',1,'2026-03-30 07:45:36','2026-03-30 07:45:36'),(3,'Photo Corp','Photography',10000,'7345174528',1,'2026-03-30 07:46:45','2026-03-30 08:20:09'),(4,'Event Enchanters','Decoration',19999,'7834612547',0,'2026-03-30 07:48:35','2026-03-30 08:00:34'),(5,'XYZ Lights and Sounds','Lights & Sound',25000,'8536281732',0,'2026-03-30 07:51:06','2026-03-30 08:00:34'),(6,'Photo Sphere','Photography',15000,'8567336222',0,'2026-03-30 07:51:48','2026-03-30 08:00:34'),(7,'Super Decor','Decoration',20000,'8735717381',1,'2026-03-30 07:52:47','2026-03-30 08:20:09'),(8,'Decor Wonder','Decoration',18000,'9527351737',0,'2026-03-30 07:55:02','2026-03-30 08:05:53'),(9,'Dazzlers','Lights & Sound',20000,'9834728742',1,'2026-03-30 07:55:47','2026-03-30 07:55:47'),(10,'Super Caterer','Food',15000,'8872427464',1,'2026-03-30 08:09:17','2026-03-30 08:09:17'),(11,'Magnificent Decors','Decoration',20000,'7346346362',1,'2026-03-30 08:11:16','2026-03-30 08:11:16'),(13,'Beast L&S','Lights & Sound',20000,'9267267822',1,'2026-03-30 09:07:14','2026-03-30 09:07:14'),(14,'Decor 1','Decoration',6000,'9988888899',1,'2026-03-30 13:25:59','2026-03-30 13:25:59');
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venues`
--

DROP TABLE IF EXISTS `venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venues` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `price` float DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `isAvailable` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venues`
--

LOCK TABLES `venues` WRITE;
/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
INSERT INTO `venues` VALUES (1,'Aquatica','Kolkata',1000,40000,'9876543210',0,'2026-03-30 07:16:04','2026-03-30 08:00:34'),(2,'The Ritz-Carlton','Bengaluru',800,70000,'9887766554',1,'2026-03-30 07:26:16','2026-03-30 07:26:16'),(3,'Mayfair Banquet','Mumbai',300,40000,'9889877876',1,'2026-03-30 07:28:56','2026-03-30 07:28:56'),(4,'Zoravar Hall','Delhi',400,35000,'7887677654',1,'2026-03-30 07:33:14','2026-03-30 07:33:14'),(5,'Najrul Mancha','Kolkata',400,25000,'9865345572',1,'2026-03-30 07:34:41','2026-03-30 08:20:09'),(6,'Rabindra Sadan','Kolkata',300,10000,'8745324563',1,'2026-03-30 07:39:08','2026-03-30 07:39:08'),(7,'ABC Conference Hall','Bengaluru',500,45000,'8546254856',0,'2026-03-30 07:42:29','2026-03-30 08:05:53');
/*!40000 ALTER TABLE `venues` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-31 18:04:27
