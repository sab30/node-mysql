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
-- Table structure for table `appointment_history`
--

DROP TABLE IF EXISTS `appointment_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `appointment_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `appointment_id` int(11) NOT NULL,
  `appointment_date` date DEFAULT NULL,
  `appointment_time_start` time DEFAULT NULL,
  `appointment_time_end` time DEFAULT NULL,
  `action` tinyint(4) NOT NULL DEFAULT '2' COMMENT '1=created,2=pending,3=confirmed,4=updated,5=rescheduled,6=cancelled,7=closed',
  `reason` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment_history`
--

LOCK TABLES `appointment_history` WRITE;
/*!40000 ALTER TABLE `appointment_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `appointment_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `appointments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `appointment_number` varchar(15) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  `hospital_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `appointment_date` date DEFAULT NULL,
  `appointment_time_start` time DEFAULT NULL,
  `appointment_time_end` time DEFAULT NULL,
  `appointment_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1=pending,2=confirmed,3=cancelled,4=closed',
  `reason` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `remarks` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `next_appointment` date DEFAULT NULL,
  `attended_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0=not-attended,1=attended',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`appointment_number`),
  KEY `fk_appuserid` (`user_id`),
  KEY `fk_appdoctid` (`doctor_id`),
  KEY `fk_apphospid` (`hospital_id`),
  KEY `fk_appdeptid` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `area`
--

DROP TABLE IF EXISTS `area`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `area` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `area_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `city_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive',
  PRIMARY KEY (`id`),
  KEY `city_idx` (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `area`
--

LOCK TABLES `area` WRITE;
/*!40000 ALTER TABLE `area` DISABLE KEYS */;
INSERT INTO `area` VALUES (1,'Kadapa',1,99,'2019-07-29 07:29:22',NULL,NULL,1);
/*!40000 ALTER TABLE `area` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `availability`
--

DROP TABLE IF EXISTS `availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `availability` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doctor_id` int(11) NOT NULL,
  `no_appt_handle` tinyint(3) NOT NULL,
  `message` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `availablity_status` tinyint(4) NOT NULL COMMENT '1=available,2=not-available',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`),
  KEY `fk_avdoctid` (`doctor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `availability`
--

LOCK TABLES `availability` WRITE;
/*!40000 ALTER TABLE `availability` DISABLE KEYS */;
/*!40000 ALTER TABLE `availability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `availability_slot`
--

DROP TABLE IF EXISTS `availability_slot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `availability_slot` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doctor_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `repeat_interval` tinyint(4) NOT NULL COMMENT '0=weekly,1=custom',
  `repeat_on` tinyint(4) NOT NULL COMMENT '0=S,1=M,2=T,3=W,4=T,5=F,6=S',
  `unik` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`),
  KEY `fk_avsdoctid` (`doctor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `availability_slot`
--

LOCK TABLES `availability_slot` WRITE;
/*!40000 ALTER TABLE `availability_slot` DISABLE KEYS */;
/*!40000 ALTER TABLE `availability_slot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bed`
--

DROP TABLE IF EXISTS `bed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `bed` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bed_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `hospital_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `ward_id` int(11) NOT NULL,
  `bed_status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1=available,2=not-available',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`),
  KEY `fk_bedwardid` (`ward_id`),
  KEY `fk_bedbranchid` (`branch_id`),
  KEY `fk_bedhosspid` (`hospital_id`),
  KEY `fk_beddeptid` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bed`
--

LOCK TABLES `bed` WRITE;
/*!40000 ALTER TABLE `bed` DISABLE KEYS */;
/*!40000 ALTER TABLE `bed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `branch` (
  `branch_id` int(11) NOT NULL AUTO_INCREMENT,
  `hospital_id` int(11) NOT NULL,
  `branch_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `branch_phone` varchar(15) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `branch_email` varchar(60) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `branch_address` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `branch_longitude` float(11,8) DEFAULT NULL,
  `branch_latitude` float(11,8) DEFAULT NULL,
  `city_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`branch_id`),
  KEY `fk_branchhospid` (`hospital_id`),
  KEY `fk_br_city` (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `city_name` varchar(30) DEFAULT NULL,
  `district_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive',
  PRIMARY KEY (`id`),
  UNIQUE KEY `city_name` (`city_name`),
  KEY `district_id` (`district_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country_name` varchar(45) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country`
--

LOCK TABLES `country` WRITE;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
INSERT INTO `country` VALUES (1,'India',99,'2019-07-29 07:27:43',NULL,NULL,1);
/*!40000 ALTER TABLE `country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `hospital_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `description` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`),
  KEY `fk_deptbranchid` (`branch_id`),
  KEY `fk_depthospid` (`hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `district`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `district` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `district_name` varchar(30) DEFAULT NULL,
  `state_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive',
  PRIMARY KEY (`id`),
  UNIQUE KEY `district_name` (`district_name`),
  KEY `state_idx` (`state_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `district`
--

LOCK TABLES `district` WRITE;
/*!40000 ALTER TABLE `district` DISABLE KEYS */;
/*!40000 ALTER TABLE `district` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `get_mypulse_users`
--

DROP TABLE IF EXISTS `get_mypulse_users`;
/*!50001 DROP VIEW IF EXISTS `get_mypulse_users`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `get_mypulse_users` AS SELECT 
 1 AS `user_id`,
 1 AS `user_role`,
 1 AS `user_unique_id`,
 1 AS `user_first_name`,
 1 AS `user_last_name`,
 1 AS `user_mobile`,
 1 AS `user_email`,
 1 AS `is_mobile_verified`,
 1 AS `is_email_verified`,
 1 AS `user_description`,
 1 AS `user_gender`,
 1 AS `user_dob`,
 1 AS `user_area_id`,
 1 AS `longitude`,
 1 AS `latitude`,
 1 AS `address`,
 1 AS `hospital_id`,
 1 AS `branch_id`,
 1 AS `department_id`,
 1 AS `doctor_id`,
 1 AS `city_id`,
 1 AS `state_id`,
 1 AS `district_id`,
 1 AS `country_id`,
 1 AS `description`,
 1 AS `aadhar`,
 1 AS `registration`,
 1 AS `qualification`,
 1 AS `profession`,
 1 AS `specializations`,
 1 AS `owner_name`,
 1 AS `owner_mobile`,
 1 AS `experience`,
 1 AS `created_by`,
 1 AS `created_at`,
 1 AS `modified_by`,
 1 AS `modified_at`,
 1 AS `status`,
 1 AS `user_profile_picture`,
 1 AS `users_medical_info_id`,
 1 AS `users_medical_info_user_id`,
 1 AS `patient_type`,
 1 AS `blood_group`,
 1 AS `in_time`,
 1 AS `account_opening_timestamp`,
 1 AS `height`,
 1 AS `weight`,
 1 AS `blood_pressure`,
 1 AS `sugar_level`,
 1 AS `health_insurance_provider`,
 1 AS `health_insurance_id`,
 1 AS `family_history`,
 1 AS `past_medical_history`,
 1 AS `reg_status`,
 1 AS `users_medical_info_created_by`,
 1 AS `users_medical_info_created_at`,
 1 AS `users_medical_info_modified_by`,
 1 AS `users_medical_info_modified_at`,
 1 AS `users_medical_info_status`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `hospitals`
--

DROP TABLE IF EXISTS `hospitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `hospitals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(15) NOT NULL,
  `hospital_name` varchar(30) NOT NULL,
  `hospital_description` varchar(250) NOT NULL,
  `license_category` varchar(60) DEFAULT NULL,
  `hospital_city_id` int(11) DEFAULT NULL,
  `license` int(11) NOT NULL,
  `license_status` tinyint(1) NOT NULL DEFAULT '2' COMMENT '1=active,2=inactive',
  `hospital_from_date` date DEFAULT NULL,
  `hospital_till_date` date DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`unique_id`),
  KEY `hosp_city_idx` (`hospital_city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitals`
--

LOCK TABLES `hospitals` WRITE;
/*!40000 ALTER TABLE `hospitals` DISABLE KEYS */;
/*!40000 ALTER TABLE `hospitals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inpatient`
--

DROP TABLE IF EXISTS `inpatient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `inpatient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `bed_id` int(11) DEFAULT NULL,
  `hospital_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `join_date` datetime DEFAULT NULL,
  `discharged_date` datetime DEFAULT NULL,
  `reason` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `inpatient_status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '0- recommended, 1- admitted, 2-discharged',
  `show_status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1=show,2=hide',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`),
  KEY `fk_inpuserid` (`user_id`),
  KEY `fk_inpdoctid` (`doctor_id`),
  KEY `fk_inphospid` (`hospital_id`),
  KEY `fk_inpbedid` (`bed_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inpatient`
--

LOCK TABLES `inpatient` WRITE;
/*!40000 ALTER TABLE `inpatient` DISABLE KEYS */;
/*!40000 ALTER TABLE `inpatient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inpatient_history`
--

DROP TABLE IF EXISTS `inpatient_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `inpatient_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `in_patient_id` int(11) NOT NULL,
  `created_date` datetime DEFAULT NULL,
  `note` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`),
  KEY `fk_inpinpid` (`in_patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inpatient_history`
--

LOCK TABLES `inpatient_history` WRITE;
/*!40000 ALTER TABLE `inpatient_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `inpatient_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `language`
--

DROP TABLE IF EXISTS `language`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `language` (
  `language_id` int(11) NOT NULL AUTO_INCREMENT,
  `lang_name` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `language`
--

LOCK TABLES `language` WRITE;
/*!40000 ALTER TABLE `language` DISABLE KEYS */;
/*!40000 ALTER TABLE `language` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `license`
--

DROP TABLE IF EXISTS `license`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `license` (
  `license_id` int(11) NOT NULL AUTO_INCREMENT,
  `license_category_id` int(11) NOT NULL,
  `license_code` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `license_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`license_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `license`
--

LOCK TABLES `license` WRITE;
/*!40000 ALTER TABLE `license` DISABLE KEYS */;
INSERT INTO `license` VALUES (1,2,'HA','HA Licence','Hospital License',99,'2019-08-03 08:05:24',NULL,NULL,1);
/*!40000 ALTER TABLE `license` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `license_category`
--

DROP TABLE IF EXISTS `license_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `license_category` (
  `license_category_id` int(11) NOT NULL AUTO_INCREMENT,
  `license_category_code` varchar(15) NOT NULL,
  `lic_category_name` varchar(30) NOT NULL,
  `description` text NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`license_category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `license_category`
--

LOCK TABLES `license_category` WRITE;
/*!40000 ALTER TABLE `license_category` DISABLE KEYS */;
INSERT INTO `license_category` VALUES (1,'MPCL_19001','CLINIC','CLINIC',99,'2019-08-03 08:09:31',NULL,NULL,1),(2,'MPHL_19002','HOSPITAL','HOSPITAL',99,'2019-08-03 08:09:31',NULL,NULL,1),(3,'MPHL_19003','MEDICAL_STORES','MEDICAL_STORES',99,'2019-08-03 08:09:31',NULL,NULL,1),(4,'MPHL_19004','MEDICAL_LAB','MEDICAL_LAB',99,'2019-08-03 08:09:31',NULL,NULL,1),(5,'MPHL_19005','BLOOD_BANK','BLOOD_BANK',99,'2019-08-03 08:09:31',NULL,NULL,1);
/*!40000 ALTER TABLE `license_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_ids` varchar(60) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_ids` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `hospital_id` int(11) NOT NULL,
  `title` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `is_read` longtext NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(15) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `notification_text` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1=yes,0=no',
  `action` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `patient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hospital_ids` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `doctor_ids` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `lab_ids` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `store_ids` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription`
--

DROP TABLE IF EXISTS `prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `prescription` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doctor_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `prescription_data` text COLLATE utf8_unicode_ci NOT NULL,
  `medicin_status` tinyint(4) NOT NULL DEFAULT '2' COMMENT '1=yes,2=no',
  `test_status` tinyint(4) NOT NULL DEFAULT '2' COMMENT '1=yes,2=no',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`),
  KEY `fk_presuserid` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription`
--

LOCK TABLES `prescription` WRITE;
/*!40000 ALTER TABLE `prescription` DISABLE KEYS */;
/*!40000 ALTER TABLE `prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription_order`
--

DROP TABLE IF EXISTS `prescription_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `prescription_order` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(15) NOT NULL,
  `receipt_id` varchar(15) DEFAULT NULL,
  `prescription_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `order_type` tinyint(4) NOT NULL COMMENT '0=medicine,1=test',
  `type_of_order` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0=by_prescription,1=by_own',
  `order_data` text NOT NULL,
  `quantity` longtext NOT NULL,
  `tests` longtext NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `lab_id` int(11) DEFAULT NULL,
  `cost` text NOT NULL,
  `price` text NOT NULL,
  `total` float NOT NULL,
  `receipt_created_at` datetime DEFAULT NULL,
  `p_status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1=pending,2=received,3=waiting for samples,4=being processed,5=out for delivery,6=reports submitted,7=delivered or completed,8=waiting for receipt',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `uk_unique_id` (`unique_id`) USING BTREE,
  UNIQUE KEY `uk_receipt_id` (`receipt_id`) USING BTREE,
  KEY `fk_presordlabid` (`lab_id`),
  KEY `fk_presordpresid` (`prescription_id`),
  KEY `fk_presordstrid` (`store_id`),
  KEY `fk_presorduserid` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription_order`
--

LOCK TABLES `prescription_order` WRITE;
/*!40000 ALTER TABLE `prescription_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `prescription_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prognosis`
--

DROP TABLE IF EXISTS `prognosis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `prognosis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prognosis_data` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`),
  KEY `fk_progadctid` (`doctor_id`),
  KEY `fk_prorguserid` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prognosis`
--

LOCK TABLES `prognosis` WRITE;
/*!40000 ALTER TABLE `prognosis` DISABLE KEYS */;
/*!40000 ALTER TABLE `prognosis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(60) NOT NULL,
  `role_description` varchar(100) DEFAULT NULL,
  `role_code` varchar(5) NOT NULL,
  `role_table` varchar(20) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role` (`role`) USING BTREE,
  UNIQUE KEY `uk_code` (`role_code`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'SUPER_ADMIN','superadmin','MPSA','superadmin',99,'2019-07-29 06:32:30',NULL,NULL,1),(2,'RECEPTIONIST','receptionist','MPR','receptionist',99,'2019-07-29 06:32:30',NULL,NULL,1),(3,'NURSE','nurse','MPN','nurse',99,'2019-07-29 06:32:30',NULL,NULL,1),(4,'MYPULSE_USER','mypulse_user','MPU','mypulse_user',99,'2019-07-29 06:32:30',NULL,NULL,1),(5,'MEDICAL_STORE','medical_store','MPS','medical_store',99,'2019-07-29 06:32:30',NULL,NULL,1),(6,'MEDICAL_LAB','medical_lab','MPL','medical_labs',99,'2019-07-29 06:32:30',NULL,NULL,1),(7,'HOSPITAL_ADMIN','hospital_admin','MPHA','hospital_admins',99,'2019-07-29 06:32:30',NULL,NULL,1),(8,'DOCTOR','doctor','MPD','doctors',99,'2019-07-29 06:32:30',NULL,NULL,1),(9,'HOSPITAL','Hospital ','MPH','hospital',99,'2019-08-04 08:36:14',NULL,NULL,1);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_type` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(150) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'system_name','MyPulse',99,'2019-07-29 07:51:13',NULL,NULL,1),(2,'system_title','MyPulse',99,'2019-07-29 07:51:13',NULL,NULL,1),(3,'address','Hyderabad',99,'2019-07-29 07:51:13',NULL,NULL,1),(4,'phone','9739195391',99,'2019-07-29 07:51:13',NULL,NULL,1),(5,'paypal_email','',99,'2019-07-29 07:51:13',NULL,NULL,1),(6,'currency','',99,'2019-07-29 07:51:13',NULL,NULL,1),(7,'system_email','mypulsecare@gmail.com',99,'2019-07-29 07:51:13',NULL,NULL,1),(8,'email_password','MyPulse@123',99,'2019-07-29 07:51:13',NULL,NULL,1),(9,'purchase_code','[ your-purchase-code-here ]',99,'2019-07-29 07:51:13',NULL,NULL,1),(10,'language','',99,'2019-07-29 07:51:13',NULL,NULL,1),(11,'text_align','',99,'2019-07-29 07:51:13',NULL,NULL,1),(12,'system_currency_id','1',99,'2019-07-29 07:51:13',NULL,NULL,1),(13,'sms_username','mypulsecare@gmail.com',99,'2019-07-29 07:51:13',NULL,NULL,1),(14,'sms_sender','MYPULS',99,'2019-07-29 07:51:13',NULL,NULL,1),(15,'sms_hash','Hp1qPEPiNj0-Q9HXoTR77OZ12cqTlOcohqW928oJzA',99,'2019-07-29 07:51:13',NULL,NULL,1),(16,'GST','',99,'2019-07-29 07:51:13',NULL,NULL,1),(17,'privacy','',99,'2019-07-29 07:51:13',NULL,NULL,1),(18,'terms','',99,'2019-07-29 07:51:13',NULL,NULL,1);
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specializations`
--

DROP TABLE IF EXISTS `specializations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `specializations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `specializations_name` varchar(30) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specializations`
--

LOCK TABLES `specializations` WRITE;
/*!40000 ALTER TABLE `specializations` DISABLE KEYS */;
/*!40000 ALTER TABLE `specializations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `state`
--

DROP TABLE IF EXISTS `state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `state` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state_name` varchar(30) NOT NULL,
  `country_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive',
  PRIMARY KEY (`id`),
  UNIQUE KEY `state_name` (`state_name`),
  KEY `country_idx` (`country_id`,`state_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `state`
--

LOCK TABLES `state` WRITE;
/*!40000 ALTER TABLE `state` DISABLE KEYS */;
INSERT INTO `state` VALUES (1,'Andhra Pradesh',1,99,'2019-07-29 07:27:01',NULL,NULL,1);
/*!40000 ALTER TABLE `state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user_role` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT '0',
  `role_id` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_unique_idx` (`user_id`),
  KEY `role_idx` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (1,1,4,1,'2019-08-10 07:08:04',NULL,NULL,1),(2,6,4,6,'2019-08-10 11:26:35',NULL,NULL,1);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_role` enum('SUPER_ADMIN','RECEPTIONIST','NURSE','MYPULSE_USER','MEDICAL_STORE','MEDICAL_LAB','HOSPITAL_ADMIN','DOCTOR','HOSPITAL') NOT NULL,
  `user_unique_id` varchar(20) NOT NULL,
  `user_first_name` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `user_last_name` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `user_password` varchar(32) NOT NULL,
  `user_mobile` varchar(20) DEFAULT NULL,
  `user_email` varchar(100) DEFAULT NULL,
  `is_mobile_verified` tinyint(3) NOT NULL DEFAULT '0',
  `is_email_verified` tinyint(3) NOT NULL DEFAULT '0',
  `user_description` varchar(250) DEFAULT NULL,
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
  `user_profile_picture` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_unique_id` (`user_unique_id`) USING BTREE,
  UNIQUE KEY `user_email` (`user_email`),
  KEY `user_email_idx` (`user_email`),
  KEY `user_password_idx` (`user_password`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'MYPULSE_USER','MPU_100001','sabarish','K','a9c7c33c48a8bf53d01b030be54a323b','9739551587','sabarish3012@gmail.com',0,1,'mypukse userds','M','1992-12-30',NULL,NULL,NULL,'72 angavarpalaya',NULL,NULL,NULL,NULL,1,1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,99,'2019-08-10 07:08:04',1,'2019-08-10 14:11:57',1,'test'),(6,'MYPULSE_USER','MPU_100002','sabkashyap',NULL,'a9c7c33c48a8bf53d01b030be54a323b',NULL,'sabarishkashyap567@gmail.com',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,99,'2019-08-10 11:26:35',NULL,NULL,1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_medical_info`
--

DROP TABLE IF EXISTS `users_medical_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users_medical_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `patient_type` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `blood_group` varchar(5) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `in_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `account_opening_timestamp` int(11) DEFAULT NULL,
  `height` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `weight` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `blood_pressure` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `sugar_level` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `health_insurance_provider` varchar(60) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `health_insurance_id` varchar(60) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `family_history` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `past_medical_history` varchar(250) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `reg_status` tinyint(4) DEFAULT '1' COMMENT '1=registered,2=unregistered',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_medical_info`
--

LOCK TABLES `users_medical_info` WRITE;
/*!40000 ALTER TABLE `users_medical_info` DISABLE KEYS */;
INSERT INTO `users_medical_info` VALUES (2,1,'test','A+','2019-08-10 11:37:50',NULL,'12','12','21','12','asd','123','test','no',1,6,'2019-08-10 11:26:35',1,'2019-08-10 11:37:50',1);
/*!40000 ALTER TABLE `users_medical_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ward`
--

DROP TABLE IF EXISTS `ward`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ward` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hospital_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `ward_name` varchar(30) NOT NULL,
  `description` varchar(250) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int(11) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1-Active 0-Inactive, 2- deleted',
  PRIMARY KEY (`id`),
  KEY `fk_wardbranchid` (`branch_id`),
  KEY `fk_wardhospid` (`hospital_id`),
  KEY `fk_warddeptid` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ward`
--

LOCK TABLES `ward` WRITE;
/*!40000 ALTER TABLE `ward` DISABLE KEYS */;
/*!40000 ALTER TABLE `ward` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `get_mypulse_users`
--

/*!50001 DROP VIEW IF EXISTS `get_mypulse_users`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `get_mypulse_users` AS select `users`.`id` AS `user_id`,`users`.`user_role` AS `user_role`,`users`.`user_unique_id` AS `user_unique_id`,`users`.`user_first_name` AS `user_first_name`,`users`.`user_last_name` AS `user_last_name`,`users`.`user_mobile` AS `user_mobile`,`users`.`user_email` AS `user_email`,`users`.`is_mobile_verified` AS `is_mobile_verified`,`users`.`is_email_verified` AS `is_email_verified`,`users`.`user_description` AS `user_description`,`users`.`user_gender` AS `user_gender`,`users`.`user_dob` AS `user_dob`,`users`.`user_area_id` AS `user_area_id`,`users`.`longitude` AS `longitude`,`users`.`latitude` AS `latitude`,`users`.`address` AS `address`,`users`.`hospital_id` AS `hospital_id`,`users`.`branch_id` AS `branch_id`,`users`.`department_id` AS `department_id`,`users`.`doctor_id` AS `doctor_id`,`users`.`city_id` AS `city_id`,`users`.`state_id` AS `state_id`,`users`.`district_id` AS `district_id`,`users`.`country_id` AS `country_id`,`users`.`description` AS `description`,`users`.`aadhar` AS `aadhar`,`users`.`registration` AS `registration`,`users`.`qualification` AS `qualification`,`users`.`profession` AS `profession`,`users`.`specializations` AS `specializations`,`users`.`owner_name` AS `owner_name`,`users`.`owner_mobile` AS `owner_mobile`,`users`.`experience` AS `experience`,`users`.`created_by` AS `created_by`,`users`.`created_at` AS `created_at`,`users`.`modified_by` AS `modified_by`,`users`.`modified_at` AS `modified_at`,`users`.`status` AS `status`,`users`.`user_profile_picture` AS `user_profile_picture`,`users_medical_info`.`id` AS `users_medical_info_id`,`users_medical_info`.`user_id` AS `users_medical_info_user_id`,`users_medical_info`.`patient_type` AS `patient_type`,`users_medical_info`.`blood_group` AS `blood_group`,`users_medical_info`.`in_time` AS `in_time`,`users_medical_info`.`account_opening_timestamp` AS `account_opening_timestamp`,`users_medical_info`.`height` AS `height`,`users_medical_info`.`weight` AS `weight`,`users_medical_info`.`blood_pressure` AS `blood_pressure`,`users_medical_info`.`sugar_level` AS `sugar_level`,`users_medical_info`.`health_insurance_provider` AS `health_insurance_provider`,`users_medical_info`.`health_insurance_id` AS `health_insurance_id`,`users_medical_info`.`family_history` AS `family_history`,`users_medical_info`.`past_medical_history` AS `past_medical_history`,`users_medical_info`.`reg_status` AS `reg_status`,`users_medical_info`.`created_by` AS `users_medical_info_created_by`,`users_medical_info`.`created_at` AS `users_medical_info_created_at`,`users_medical_info`.`modified_by` AS `users_medical_info_modified_by`,`users_medical_info`.`modified_at` AS `users_medical_info_modified_at`,`users_medical_info`.`status` AS `users_medical_info_status` from (`users` left join `users_medical_info` on((`users_medical_info`.`user_id` = `users`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-10 20:03:14
