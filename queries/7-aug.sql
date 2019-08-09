-- MySQL dump 10.13  Distrib 8.0.16, for macos10.14 (x86_64)
--
-- Host: 127.0.0.1    Database: mypulse_node
-- ------------------------------------------------------
-- Server version	5.7.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_role` enum('SUPER_ADMIN','RECEPTIONIST','NURSE','MYPULSE_USER','MEDICAL_STORE','MEDICAL_LAB','HOSPITAL_ADMIN','DOCTOR','HOSPITAL') NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_unique_id` varchar(20) NOT NULL,
  `user_first_name` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `user_last_name` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `user_password` varchar(32) NOT NULL,
  `user_mobile` varchar(20) DEFAULT NULL,
  `user_email` varchar(100) DEFAULT NULL,
  `is_mobile_verified` tinyint(3) NOT NULL DEFAULT '0',
  `is_email_verified` tinyint(3) NOT NULL DEFAULT '0',
  `user_gender` varchar(1) DEFAULT NULL,
  `user_dob` date DEFAULT NULL,
  `user_area_id` int(11) DEFAULT NULL,
  `longitude` float(11,8) DEFAULT NULL,
  `latitude` float(11,8) DEFAULT NULL,
  `address` varchar(250) DEFAULT NULL,
  `hospital_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `doctor_id` varchar(100) DEFAULT NULL,
  `city_id` int(11) DEFAULT NULL,
  `state_id` int(11) DEFAULT NULL,
  `district_id` int(11) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `aadhar` varchar(16) DEFAULT NULL,
  `registration` varchar(16) DEFAULT NULL,
  `qualification` varchar(60) DEFAULT NULL,
  `profession` varchar(60) DEFAULT NULL,
  `specializations` varchar(60) DEFAULT NULL,
  `owner_name` varchar(60) DEFAULT NULL,
  `owner_mobile` varchar(60) DEFAULT NULL,
  `experience` varchar(10) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_unique_id` (`user_unique_id`) USING BTREE,
  UNIQUE KEY `user_email` (`user_email`),
  KEY `user_email_idx` (`user_email`),
  KEY `user_password_idx` (`user_password`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'MYPULSE_USER','Sabarish','MPU_100001',NULL,NULL,'a9c7c33c48a8bf53d01b030be54a323b',NULL,'sabarish3012@gmail.com',0,0,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,99,'2019-08-06 18:37:56',NULL,NULL,1),(2,'MYPULSE_USER','Sabarish','MPU_100002',NULL,NULL,'a9c7c33c48a8bf53d01b030be54a323b',NULL,'sabarishkashyap567@gmail.com',0,0,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,99,'2019-08-06 18:38:20',NULL,NULL,1),(3,'HOSPITAL','hp','MPH_100001',NULL,NULL,'a9c7c33c48a8bf53d01b030be54a323b',NULL,'test1@gmail.com',0,0,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,99,'2019-08-06 18:39:12',NULL,NULL,1),(4,'HOSPITAL','hp1','MPH_100002',NULL,NULL,'a9c7c33c48a8bf53d01b030be54a323b',NULL,'test2@gmail.com',0,0,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,99,'2019-08-06 18:39:38',NULL,NULL,1),(5,'MYPULSE_USER','user1','MPU_100003',NULL,NULL,'a9c7c33c48a8bf53d01b030be54a323b',NULL,'user1@gmail.com',0,0,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,99,'2019-08-06 18:40:02',NULL,NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-07  0:13:40
