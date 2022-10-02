-- MySQL dump 10.13  Distrib 8.0.30, for Linux (x86_64)
--
-- Host: 34.142.156.212    Database: keycloak
-- ------------------------------------------------------
-- Server version	5.7.39

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
-- Table structure for table `ADMIN_EVENT_ENTITY`
--

DROP TABLE IF EXISTS `ADMIN_EVENT_ENTITY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ADMIN_EVENT_ENTITY` (
  `ID` varchar(36) NOT NULL,
  `ADMIN_EVENT_TIME` bigint(20) DEFAULT NULL,
  `REALM_ID` varchar(255) DEFAULT NULL,
  `OPERATION_TYPE` varchar(255) DEFAULT NULL,
  `AUTH_REALM_ID` varchar(255) DEFAULT NULL,
  `AUTH_CLIENT_ID` varchar(255) DEFAULT NULL,
  `AUTH_USER_ID` varchar(255) DEFAULT NULL,
  `IP_ADDRESS` varchar(255) DEFAULT NULL,
  `RESOURCE_PATH` varchar(2550) DEFAULT NULL,
  `REPRESENTATION` text,
  `ERROR` varchar(255) DEFAULT NULL,
  `RESOURCE_TYPE` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ADMIN_EVENT_ENTITY`
--

LOCK TABLES `ADMIN_EVENT_ENTITY` WRITE;
/*!40000 ALTER TABLE `ADMIN_EVENT_ENTITY` DISABLE KEYS */;
/*!40000 ALTER TABLE `ADMIN_EVENT_ENTITY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ASSOCIATED_POLICY`
--

DROP TABLE IF EXISTS `ASSOCIATED_POLICY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ASSOCIATED_POLICY` (
  `POLICY_ID` varchar(36) NOT NULL,
  `ASSOCIATED_POLICY_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`POLICY_ID`,`ASSOCIATED_POLICY_ID`),
  KEY `IDX_ASSOC_POL_ASSOC_POL_ID` (`ASSOCIATED_POLICY_ID`),
  CONSTRAINT `FK_FRSR5S213XCX4WNKOG82SSRFY` FOREIGN KEY (`ASSOCIATED_POLICY_ID`) REFERENCES `RESOURCE_SERVER_POLICY` (`ID`),
  CONSTRAINT `FK_FRSRPAS14XCX4WNKOG82SSRFY` FOREIGN KEY (`POLICY_ID`) REFERENCES `RESOURCE_SERVER_POLICY` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ASSOCIATED_POLICY`
--

LOCK TABLES `ASSOCIATED_POLICY` WRITE;
/*!40000 ALTER TABLE `ASSOCIATED_POLICY` DISABLE KEYS */;
/*!40000 ALTER TABLE `ASSOCIATED_POLICY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AUTHENTICATION_EXECUTION`
--

DROP TABLE IF EXISTS `AUTHENTICATION_EXECUTION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AUTHENTICATION_EXECUTION` (
  `ID` varchar(36) NOT NULL,
  `ALIAS` varchar(255) DEFAULT NULL,
  `AUTHENTICATOR` varchar(36) DEFAULT NULL,
  `REALM_ID` varchar(36) DEFAULT NULL,
  `FLOW_ID` varchar(36) DEFAULT NULL,
  `REQUIREMENT` int(11) DEFAULT NULL,
  `PRIORITY` int(11) DEFAULT NULL,
  `AUTHENTICATOR_FLOW` bit(1) NOT NULL DEFAULT b'0',
  `AUTH_FLOW_ID` varchar(36) DEFAULT NULL,
  `AUTH_CONFIG` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_AUTH_EXEC_REALM_FLOW` (`REALM_ID`,`FLOW_ID`),
  KEY `IDX_AUTH_EXEC_FLOW` (`FLOW_ID`),
  CONSTRAINT `FK_AUTH_EXEC_FLOW` FOREIGN KEY (`FLOW_ID`) REFERENCES `AUTHENTICATION_FLOW` (`ID`),
  CONSTRAINT `FK_AUTH_EXEC_REALM` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AUTHENTICATION_EXECUTION`
--

LOCK TABLES `AUTHENTICATION_EXECUTION` WRITE;
/*!40000 ALTER TABLE `AUTHENTICATION_EXECUTION` DISABLE KEYS */;
INSERT INTO `AUTHENTICATION_EXECUTION` (`ID`, `ALIAS`, `AUTHENTICATOR`, `REALM_ID`, `FLOW_ID`, `REQUIREMENT`, `PRIORITY`, `AUTHENTICATOR_FLOW`, `AUTH_FLOW_ID`, `AUTH_CONFIG`) VALUES ('0d43ddf9-7d8c-4405-91b8-14e9975758ba',NULL,NULL,'master','e31af5de-0952-4fd8-87a8-c167c5f0a3d8',2,30,_binary '','f5d1ad79-c4a2-4685-aed8-2f45c85fe1dd',NULL),('0df47e44-504f-4e89-853c-7b1a6f94bb4c',NULL,'auth-spnego','master','10e799ca-2ca3-4b46-9a61-a3bbec11a2a3',3,30,_binary '\0',NULL,NULL),('0e1026fd-e2a3-48f2-92b7-39d21463a8e7',NULL,'conditional-user-configured','master','8e91b486-2d9e-4e75-87e6-20429723ecc3',0,10,_binary '\0',NULL,NULL),('16dc7b36-0b69-42c3-80e6-2c7f217d3112',NULL,NULL,'master','6e0adf4d-838c-41ee-a8b9-77715461e317',2,20,_binary '','1b81dbb3-0951-4d00-8ae4-4c16dfb88a75',NULL),('1b9f6f9f-ee4a-48f3-a0d5-ee5ad125a140',NULL,'registration-profile-action','master','3d0166a2-c074-4c73-b398-29859d128db6',0,40,_binary '\0',NULL,NULL),('1ce91f70-d236-4f25-b3c6-39095cb4f099',NULL,'reset-credentials-choose-user','master','97108289-bddb-4657-8d78-1bffef5078ae',0,10,_binary '\0',NULL,NULL),('2161d863-9cb2-4e1d-a22f-affd4832bc95',NULL,'registration-page-form','master','ef72bcc6-0411-43be-9eee-36b4ee09b60f',0,10,_binary '','3d0166a2-c074-4c73-b398-29859d128db6',NULL),('2d92246d-12f7-4937-bcd8-02f34f47f257',NULL,'idp-review-profile','master','b30fa4ae-bc9e-4024-85a3-c53885906a78',0,10,_binary '\0',NULL,'7f9a38ec-6adf-405d-9b76-8b5d73c7385b'),('2e2d7763-d4b1-43ec-af30-e27b5c9ea8ee',NULL,'auth-otp-form','master','f74a18d0-73f1-438d-846a-48d7074f608c',0,20,_binary '\0',NULL,NULL),('2edbad95-a00b-49b6-a59c-6b9a99bccc64',NULL,'basic-auth-otp','master','10e799ca-2ca3-4b46-9a61-a3bbec11a2a3',3,20,_binary '\0',NULL,NULL),('3212e22a-dbeb-44ee-a4a0-38e76fb9a04a',NULL,'direct-grant-validate-username','master','063176a9-787a-4d95-b52e-f8d2b2cc9a92',0,10,_binary '\0',NULL,NULL),('384166a3-099f-4632-a57b-8f7e5c4570db',NULL,NULL,'master','97108289-bddb-4657-8d78-1bffef5078ae',1,40,_binary '','2c5240c8-41fd-43ee-9a8a-df66072d1f01',NULL),('38b5de8f-cb48-4bad-8454-fa36cb7d9948',NULL,'registration-user-creation','master','3d0166a2-c074-4c73-b398-29859d128db6',0,20,_binary '\0',NULL,NULL),('39012ed8-f370-4c9d-bd63-90127f7a95f1',NULL,NULL,'master','e5d351c2-9e20-4764-a541-699d01fc6992',2,20,_binary '','3e2067a1-7bb1-4bd5-afad-ea989381cb02',NULL),('39ca575a-01c3-40a1-8c75-6a36001e8278',NULL,'conditional-user-configured','master','f74a18d0-73f1-438d-846a-48d7074f608c',0,10,_binary '\0',NULL,NULL),('3fcac89e-cac4-4d76-8ff2-af1f3d9cb2ec',NULL,'auth-spnego','master','e31af5de-0952-4fd8-87a8-c167c5f0a3d8',3,20,_binary '\0',NULL,NULL),('40821d9e-5ae1-44d3-8c08-30c0bab454a4',NULL,NULL,'master','a230e00f-83b6-472c-8a3d-f67b0791ce38',0,20,_binary '','10e799ca-2ca3-4b46-9a61-a3bbec11a2a3',NULL),('430b1c50-9895-49f4-a878-cec1ff51841b',NULL,'client-jwt','master','25288516-b643-4e19-ac8e-78e9ccf8f19c',2,20,_binary '\0',NULL,NULL),('4ac7ec84-d9b9-44b2-a5bb-86038f5cdcc6',NULL,'docker-http-basic-authenticator','master','5651c414-44af-4349-be2b-549c232389ba',0,10,_binary '\0',NULL,NULL),('5aea512e-d7ab-4624-be43-291e71a2078d',NULL,'direct-grant-validate-otp','master','8e91b486-2d9e-4e75-87e6-20429723ecc3',0,20,_binary '\0',NULL,NULL),('5b8fa7f1-12db-45d2-bd72-d0557a07437a',NULL,NULL,'master','1b81dbb3-0951-4d00-8ae4-4c16dfb88a75',0,20,_binary '','e5d351c2-9e20-4764-a541-699d01fc6992',NULL),('600bcde4-50de-4876-a0fa-ee36b9a8790d',NULL,NULL,'master','f5d1ad79-c4a2-4685-aed8-2f45c85fe1dd',1,20,_binary '','f74a18d0-73f1-438d-846a-48d7074f608c',NULL),('65946b31-0b72-4545-afab-78f669b5792a',NULL,'conditional-user-configured','master','bc27b865-48ff-4c56-b7c5-f6f34ed693b3',0,10,_binary '\0',NULL,NULL),('74b6124d-ceaa-43d5-836c-2f7fe6561326',NULL,'idp-email-verification','master','e5d351c2-9e20-4764-a541-699d01fc6992',2,10,_binary '\0',NULL,NULL),('7a1e6749-4e8f-455c-a02e-b67bc7f42be0',NULL,'auth-username-password-form','master','f5d1ad79-c4a2-4685-aed8-2f45c85fe1dd',0,10,_binary '\0',NULL,NULL),('7c075547-6c0b-4a4d-8d94-7e9b53c38f7f',NULL,'auth-cookie','master','e31af5de-0952-4fd8-87a8-c167c5f0a3d8',2,10,_binary '\0',NULL,NULL),('7f51a90d-3770-41be-af7a-346c92da3641',NULL,'idp-confirm-link','master','1b81dbb3-0951-4d00-8ae4-4c16dfb88a75',0,10,_binary '\0',NULL,NULL),('8f523a03-4928-441e-b7d7-5562a41c92aa',NULL,'direct-grant-validate-password','master','063176a9-787a-4d95-b52e-f8d2b2cc9a92',0,20,_binary '\0',NULL,NULL),('8fa2edea-5745-44ad-8766-c06c0f5d0d5a',NULL,'registration-password-action','master','3d0166a2-c074-4c73-b398-29859d128db6',0,50,_binary '\0',NULL,NULL),('8fc6f150-0aa3-4228-800d-55168bacd4b8',NULL,'idp-username-password-form','master','3e2067a1-7bb1-4bd5-afad-ea989381cb02',0,10,_binary '\0',NULL,NULL),('93474d4d-bf62-452c-8f02-fcf6b95383ce',NULL,'reset-password','master','97108289-bddb-4657-8d78-1bffef5078ae',0,30,_binary '\0',NULL,NULL),('97a3cd30-5320-4bba-912a-1f23a25d1ef2',NULL,'reset-otp','master','2c5240c8-41fd-43ee-9a8a-df66072d1f01',0,20,_binary '\0',NULL,NULL),('a2d8d22f-bfad-4f60-9e7f-bbebc7e67337',NULL,'idp-create-user-if-unique','master','6e0adf4d-838c-41ee-a8b9-77715461e317',2,10,_binary '\0',NULL,'0b0d91e9-a16d-49d9-ba64-2f017d05f658'),('a5d75e26-32fd-491c-931e-6d4399bcf768',NULL,'reset-credential-email','master','97108289-bddb-4657-8d78-1bffef5078ae',0,20,_binary '\0',NULL,NULL),('a612148e-f71d-4fc2-a6a7-49f1459cefa1',NULL,NULL,'master','3e2067a1-7bb1-4bd5-afad-ea989381cb02',1,20,_binary '','bc27b865-48ff-4c56-b7c5-f6f34ed693b3',NULL),('a8ed5803-8d4f-4417-86ba-7e3391c37005',NULL,'registration-recaptcha-action','master','3d0166a2-c074-4c73-b398-29859d128db6',3,60,_binary '\0',NULL,NULL),('b13da072-c387-472b-af58-5f3078afe160',NULL,'auth-otp-form','master','bc27b865-48ff-4c56-b7c5-f6f34ed693b3',0,20,_binary '\0',NULL,NULL),('bc4b6536-1feb-4d69-aad2-19d45e8e3b4d',NULL,'identity-provider-redirector','master','e31af5de-0952-4fd8-87a8-c167c5f0a3d8',2,25,_binary '\0',NULL,NULL),('bfba0a40-5919-4b0b-b13c-03d7962813cd',NULL,'basic-auth','master','10e799ca-2ca3-4b46-9a61-a3bbec11a2a3',0,10,_binary '\0',NULL,NULL),('c0da8ba0-db9c-4866-9fd4-ac33ae344793',NULL,'client-x509','master','25288516-b643-4e19-ac8e-78e9ccf8f19c',2,40,_binary '\0',NULL,NULL),('c51a91fa-7e45-4c90-930c-049716c29419',NULL,'http-basic-authenticator','master','f2813449-c122-4967-a9ac-ba9b0052d865',0,10,_binary '\0',NULL,NULL),('e2dc89d2-a5f7-4159-bf37-eeba30cfb526',NULL,NULL,'master','063176a9-787a-4d95-b52e-f8d2b2cc9a92',1,30,_binary '','8e91b486-2d9e-4e75-87e6-20429723ecc3',NULL),('eb6cd1fb-4228-4039-8db7-4f5a70c5e214',NULL,'client-secret','master','25288516-b643-4e19-ac8e-78e9ccf8f19c',2,10,_binary '\0',NULL,NULL),('f1107a33-c4c4-444f-b7a2-87365de3097c',NULL,'client-secret-jwt','master','25288516-b643-4e19-ac8e-78e9ccf8f19c',2,30,_binary '\0',NULL,NULL),('f7a60d99-93b8-4390-8634-3f7380693d2b',NULL,NULL,'master','b30fa4ae-bc9e-4024-85a3-c53885906a78',0,20,_binary '','6e0adf4d-838c-41ee-a8b9-77715461e317',NULL),('faaa1ec0-82e3-4554-b4a4-5c56b5f4f077',NULL,'no-cookie-redirect','master','a230e00f-83b6-472c-8a3d-f67b0791ce38',0,10,_binary '\0',NULL,NULL),('ff726e1b-e176-404f-84ea-305c5e73145f',NULL,'conditional-user-configured','master','2c5240c8-41fd-43ee-9a8a-df66072d1f01',0,10,_binary '\0',NULL,NULL);
/*!40000 ALTER TABLE `AUTHENTICATION_EXECUTION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AUTHENTICATION_FLOW`
--

DROP TABLE IF EXISTS `AUTHENTICATION_FLOW`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AUTHENTICATION_FLOW` (
  `ID` varchar(36) NOT NULL,
  `ALIAS` varchar(255) DEFAULT NULL,
  `DESCRIPTION` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `REALM_ID` varchar(36) DEFAULT NULL,
  `PROVIDER_ID` varchar(36) NOT NULL DEFAULT 'basic-flow',
  `TOP_LEVEL` bit(1) NOT NULL DEFAULT b'0',
  `BUILT_IN` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`ID`),
  KEY `IDX_AUTH_FLOW_REALM` (`REALM_ID`),
  CONSTRAINT `FK_AUTH_FLOW_REALM` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AUTHENTICATION_FLOW`
--

LOCK TABLES `AUTHENTICATION_FLOW` WRITE;
/*!40000 ALTER TABLE `AUTHENTICATION_FLOW` DISABLE KEYS */;
INSERT INTO `AUTHENTICATION_FLOW` (`ID`, `ALIAS`, `DESCRIPTION`, `REALM_ID`, `PROVIDER_ID`, `TOP_LEVEL`, `BUILT_IN`) VALUES ('063176a9-787a-4d95-b52e-f8d2b2cc9a92','direct grant','OpenID Connect Resource Owner Grant','master','basic-flow',_binary '',_binary ''),('10e799ca-2ca3-4b46-9a61-a3bbec11a2a3','Authentication Options','Authentication options.','master','basic-flow',_binary '\0',_binary ''),('1b81dbb3-0951-4d00-8ae4-4c16dfb88a75','Handle Existing Account','Handle what to do if there is existing account with same email/username like authenticated identity provider','master','basic-flow',_binary '\0',_binary ''),('25288516-b643-4e19-ac8e-78e9ccf8f19c','clients','Base authentication for clients','master','client-flow',_binary '',_binary ''),('2c5240c8-41fd-43ee-9a8a-df66072d1f01','Reset - Conditional OTP','Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.','master','basic-flow',_binary '\0',_binary ''),('3d0166a2-c074-4c73-b398-29859d128db6','registration form','registration form','master','form-flow',_binary '\0',_binary ''),('3e2067a1-7bb1-4bd5-afad-ea989381cb02','Verify Existing Account by Re-authentication','Reauthentication of existing account','master','basic-flow',_binary '\0',_binary ''),('5651c414-44af-4349-be2b-549c232389ba','docker auth','Used by Docker clients to authenticate against the IDP','master','basic-flow',_binary '',_binary ''),('6e0adf4d-838c-41ee-a8b9-77715461e317','User creation or linking','Flow for the existing/non-existing user alternatives','master','basic-flow',_binary '\0',_binary ''),('8e91b486-2d9e-4e75-87e6-20429723ecc3','Direct Grant - Conditional OTP','Flow to determine if the OTP is required for the authentication','master','basic-flow',_binary '\0',_binary ''),('97108289-bddb-4657-8d78-1bffef5078ae','reset credentials','Reset credentials for a user if they forgot their password or something','master','basic-flow',_binary '',_binary ''),('a230e00f-83b6-472c-8a3d-f67b0791ce38','http challenge','An authentication flow based on challenge-response HTTP Authentication Schemes','master','basic-flow',_binary '',_binary ''),('b30fa4ae-bc9e-4024-85a3-c53885906a78','first broker login','Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account','master','basic-flow',_binary '',_binary ''),('bc27b865-48ff-4c56-b7c5-f6f34ed693b3','First broker login - Conditional OTP','Flow to determine if the OTP is required for the authentication','master','basic-flow',_binary '\0',_binary ''),('e31af5de-0952-4fd8-87a8-c167c5f0a3d8','browser','browser based authentication','master','basic-flow',_binary '',_binary ''),('e5d351c2-9e20-4764-a541-699d01fc6992','Account verification options','Method with which to verity the existing account','master','basic-flow',_binary '\0',_binary ''),('ef72bcc6-0411-43be-9eee-36b4ee09b60f','registration','registration flow','master','basic-flow',_binary '',_binary ''),('f2813449-c122-4967-a9ac-ba9b0052d865','saml ecp','SAML ECP Profile Authentication Flow','master','basic-flow',_binary '',_binary ''),('f5d1ad79-c4a2-4685-aed8-2f45c85fe1dd','forms','Username, password, otp and other auth forms.','master','basic-flow',_binary '\0',_binary ''),('f74a18d0-73f1-438d-846a-48d7074f608c','Browser - Conditional OTP','Flow to determine if the OTP is required for the authentication','master','basic-flow',_binary '\0',_binary '');
/*!40000 ALTER TABLE `AUTHENTICATION_FLOW` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AUTHENTICATOR_CONFIG`
--

DROP TABLE IF EXISTS `AUTHENTICATOR_CONFIG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AUTHENTICATOR_CONFIG` (
  `ID` varchar(36) NOT NULL,
  `ALIAS` varchar(255) DEFAULT NULL,
  `REALM_ID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_AUTH_CONFIG_REALM` (`REALM_ID`),
  CONSTRAINT `FK_AUTH_REALM` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AUTHENTICATOR_CONFIG`
--

LOCK TABLES `AUTHENTICATOR_CONFIG` WRITE;
/*!40000 ALTER TABLE `AUTHENTICATOR_CONFIG` DISABLE KEYS */;
INSERT INTO `AUTHENTICATOR_CONFIG` (`ID`, `ALIAS`, `REALM_ID`) VALUES ('0b0d91e9-a16d-49d9-ba64-2f017d05f658','create unique user config','master'),('7f9a38ec-6adf-405d-9b76-8b5d73c7385b','review profile config','master');
/*!40000 ALTER TABLE `AUTHENTICATOR_CONFIG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AUTHENTICATOR_CONFIG_ENTRY`
--

DROP TABLE IF EXISTS `AUTHENTICATOR_CONFIG_ENTRY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AUTHENTICATOR_CONFIG_ENTRY` (
  `AUTHENTICATOR_ID` varchar(36) NOT NULL,
  `VALUE` longtext,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`AUTHENTICATOR_ID`,`NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AUTHENTICATOR_CONFIG_ENTRY`
--

LOCK TABLES `AUTHENTICATOR_CONFIG_ENTRY` WRITE;
/*!40000 ALTER TABLE `AUTHENTICATOR_CONFIG_ENTRY` DISABLE KEYS */;
INSERT INTO `AUTHENTICATOR_CONFIG_ENTRY` (`AUTHENTICATOR_ID`, `VALUE`, `NAME`) VALUES ('0b0d91e9-a16d-49d9-ba64-2f017d05f658','false','require.password.update.after.registration'),('7f9a38ec-6adf-405d-9b76-8b5d73c7385b','missing','update.profile.on.first.login');
/*!40000 ALTER TABLE `AUTHENTICATOR_CONFIG_ENTRY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BROKER_LINK`
--

DROP TABLE IF EXISTS `BROKER_LINK`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BROKER_LINK` (
  `IDENTITY_PROVIDER` varchar(255) NOT NULL,
  `STORAGE_PROVIDER_ID` varchar(255) DEFAULT NULL,
  `REALM_ID` varchar(36) NOT NULL,
  `BROKER_USER_ID` varchar(255) DEFAULT NULL,
  `BROKER_USERNAME` varchar(255) DEFAULT NULL,
  `TOKEN` text,
  `USER_ID` varchar(255) NOT NULL,
  PRIMARY KEY (`IDENTITY_PROVIDER`,`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BROKER_LINK`
--

LOCK TABLES `BROKER_LINK` WRITE;
/*!40000 ALTER TABLE `BROKER_LINK` DISABLE KEYS */;
/*!40000 ALTER TABLE `BROKER_LINK` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENT`
--

DROP TABLE IF EXISTS `CLIENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENT` (
  `ID` varchar(36) NOT NULL,
  `ENABLED` bit(1) NOT NULL DEFAULT b'0',
  `FULL_SCOPE_ALLOWED` bit(1) NOT NULL DEFAULT b'0',
  `CLIENT_ID` varchar(255) DEFAULT NULL,
  `NOT_BEFORE` int(11) DEFAULT NULL,
  `PUBLIC_CLIENT` bit(1) NOT NULL DEFAULT b'0',
  `SECRET` varchar(255) DEFAULT NULL,
  `BASE_URL` varchar(255) DEFAULT NULL,
  `BEARER_ONLY` bit(1) NOT NULL DEFAULT b'0',
  `MANAGEMENT_URL` varchar(255) DEFAULT NULL,
  `SURROGATE_AUTH_REQUIRED` bit(1) NOT NULL DEFAULT b'0',
  `REALM_ID` varchar(36) DEFAULT NULL,
  `PROTOCOL` varchar(255) DEFAULT NULL,
  `NODE_REREG_TIMEOUT` int(11) DEFAULT '0',
  `FRONTCHANNEL_LOGOUT` bit(1) NOT NULL DEFAULT b'0',
  `CONSENT_REQUIRED` bit(1) NOT NULL DEFAULT b'0',
  `NAME` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `SERVICE_ACCOUNTS_ENABLED` bit(1) NOT NULL DEFAULT b'0',
  `CLIENT_AUTHENTICATOR_TYPE` varchar(255) DEFAULT NULL,
  `ROOT_URL` varchar(255) DEFAULT NULL,
  `DESCRIPTION` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `REGISTRATION_TOKEN` varchar(255) DEFAULT NULL,
  `STANDARD_FLOW_ENABLED` bit(1) NOT NULL DEFAULT b'1',
  `IMPLICIT_FLOW_ENABLED` bit(1) NOT NULL DEFAULT b'0',
  `DIRECT_ACCESS_GRANTS_ENABLED` bit(1) NOT NULL DEFAULT b'0',
  `ALWAYS_DISPLAY_IN_CONSOLE` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_B71CJLBENV945RB6GCON438AT` (`REALM_ID`,`CLIENT_ID`),
  KEY `IDX_CLIENT_ID` (`CLIENT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENT`
--

LOCK TABLES `CLIENT` WRITE;
/*!40000 ALTER TABLE `CLIENT` DISABLE KEYS */;
INSERT INTO `CLIENT` (`ID`, `ENABLED`, `FULL_SCOPE_ALLOWED`, `CLIENT_ID`, `NOT_BEFORE`, `PUBLIC_CLIENT`, `SECRET`, `BASE_URL`, `BEARER_ONLY`, `MANAGEMENT_URL`, `SURROGATE_AUTH_REQUIRED`, `REALM_ID`, `PROTOCOL`, `NODE_REREG_TIMEOUT`, `FRONTCHANNEL_LOGOUT`, `CONSENT_REQUIRED`, `NAME`, `SERVICE_ACCOUNTS_ENABLED`, `CLIENT_AUTHENTICATOR_TYPE`, `ROOT_URL`, `DESCRIPTION`, `REGISTRATION_TOKEN`, `STANDARD_FLOW_ENABLED`, `IMPLICIT_FLOW_ENABLED`, `DIRECT_ACCESS_GRANTS_ENABLED`, `ALWAYS_DISPLAY_IN_CONSOLE`) VALUES ('2633180f-d391-4e4e-b877-8c886d352f54',_binary '',_binary '\0','master-realm',0,_binary '\0',NULL,NULL,_binary '',NULL,_binary '\0','master',NULL,0,_binary '\0',_binary '\0','master Realm',_binary '\0','client-secret',NULL,NULL,NULL,_binary '',_binary '\0',_binary '\0',_binary '\0'),('6351decc-46e5-426e-899d-3135a4dbd6bf',_binary '',_binary '\0','account',0,_binary '',NULL,'/realms/master/account/',_binary '\0',NULL,_binary '\0','master','openid-connect',0,_binary '\0',_binary '\0','${client_account}',_binary '\0','client-secret','${authBaseUrl}',NULL,NULL,_binary '',_binary '\0',_binary '\0',_binary '\0'),('781f80f4-c1fc-4cfd-9614-9bf0ad04900a',_binary '',_binary '\0','admin-cli',0,_binary '',NULL,NULL,_binary '\0',NULL,_binary '\0','master','openid-connect',0,_binary '\0',_binary '\0','${client_admin-cli}',_binary '\0','client-secret',NULL,NULL,NULL,_binary '\0',_binary '\0',_binary '',_binary '\0'),('85815b42-9717-42e9-9171-22c7dda14b82',_binary '',_binary '\0','security-admin-console',0,_binary '',NULL,'/admin/master/console/',_binary '\0',NULL,_binary '\0','master','openid-connect',0,_binary '\0',_binary '\0','${client_security-admin-console}',_binary '\0','client-secret','${authAdminUrl}',NULL,NULL,_binary '',_binary '\0',_binary '\0',_binary '\0'),('b2cb29e5-0633-48e6-b053-f7adba31845e',_binary '',_binary '\0','broker',0,_binary '\0',NULL,NULL,_binary '',NULL,_binary '\0','master','openid-connect',0,_binary '\0',_binary '\0','${client_broker}',_binary '\0','client-secret',NULL,NULL,NULL,_binary '',_binary '\0',_binary '\0',_binary '\0'),('c1e78271-8fc7-4688-b452-16b5609bc5c2',_binary '',_binary '','authentication-api',0,_binary '\0','6icNETyijRyra3OyUv92Kxm5fNMwDG9D',NULL,_binary '\0',NULL,_binary '\0','master','openid-connect',-1,_binary '\0',_binary '\0',NULL,_binary '\0','client-secret',NULL,NULL,NULL,_binary '',_binary '\0',_binary '',_binary '\0'),('d3bc5911-d1c9-4a27-9a65-e1993cee1c29',_binary '',_binary '\0','account-console',0,_binary '',NULL,'/realms/master/account/',_binary '\0',NULL,_binary '\0','master','openid-connect',0,_binary '\0',_binary '\0','${client_account-console}',_binary '\0','client-secret','${authBaseUrl}',NULL,NULL,_binary '',_binary '\0',_binary '\0',_binary '\0');
/*!40000 ALTER TABLE `CLIENT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENT_ATTRIBUTES`
--

DROP TABLE IF EXISTS `CLIENT_ATTRIBUTES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENT_ATTRIBUTES` (
  `CLIENT_ID` varchar(36) NOT NULL,
  `VALUE` varchar(4000) DEFAULT NULL,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`CLIENT_ID`,`NAME`),
  KEY `IDX_CLIENT_ATT_BY_NAME_VALUE` (`NAME`,`VALUE`(255)),
  CONSTRAINT `FK3C47C64BEACCA966` FOREIGN KEY (`CLIENT_ID`) REFERENCES `CLIENT` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENT_ATTRIBUTES`
--

LOCK TABLES `CLIENT_ATTRIBUTES` WRITE;
/*!40000 ALTER TABLE `CLIENT_ATTRIBUTES` DISABLE KEYS */;
INSERT INTO `CLIENT_ATTRIBUTES` (`CLIENT_ID`, `VALUE`, `NAME`) VALUES ('85815b42-9717-42e9-9171-22c7dda14b82','S256','pkce.code.challenge.method'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','backchannel.logout.revoke.offline.tokens'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','true','backchannel.logout.session.required'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','client_credentials.use_refresh_token'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','display.on.consent.screen'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','exclude.session.state.from.auth.response'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','id.token.as.detached.signature'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','oauth2.device.authorization.grant.enabled'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','oidc.ciba.grant.enabled'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','require.pushed.authorization.requests'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','saml.artifact.binding'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','saml.assertion.signature'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','saml.authnstatement'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','saml.client.signature'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','saml.encrypt'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','saml.force.post.binding'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','saml.multivalued.roles'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','saml.onetimeuse.condition'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','saml.server.signature'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','saml.server.signature.keyinfo.ext'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','saml_force_name_id_format'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','false','tls.client.certificate.bound.access.tokens'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','true','use.refresh.tokens'),('d3bc5911-d1c9-4a27-9a65-e1993cee1c29','S256','pkce.code.challenge.method');
/*!40000 ALTER TABLE `CLIENT_ATTRIBUTES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENT_AUTH_FLOW_BINDINGS`
--

DROP TABLE IF EXISTS `CLIENT_AUTH_FLOW_BINDINGS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENT_AUTH_FLOW_BINDINGS` (
  `CLIENT_ID` varchar(36) NOT NULL,
  `FLOW_ID` varchar(36) DEFAULT NULL,
  `BINDING_NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`CLIENT_ID`,`BINDING_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENT_AUTH_FLOW_BINDINGS`
--

LOCK TABLES `CLIENT_AUTH_FLOW_BINDINGS` WRITE;
/*!40000 ALTER TABLE `CLIENT_AUTH_FLOW_BINDINGS` DISABLE KEYS */;
/*!40000 ALTER TABLE `CLIENT_AUTH_FLOW_BINDINGS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENT_INITIAL_ACCESS`
--

DROP TABLE IF EXISTS `CLIENT_INITIAL_ACCESS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENT_INITIAL_ACCESS` (
  `ID` varchar(36) NOT NULL,
  `REALM_ID` varchar(36) NOT NULL,
  `TIMESTAMP` int(11) DEFAULT NULL,
  `EXPIRATION` int(11) DEFAULT NULL,
  `COUNT` int(11) DEFAULT NULL,
  `REMAINING_COUNT` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_CLIENT_INIT_ACC_REALM` (`REALM_ID`),
  CONSTRAINT `FK_CLIENT_INIT_ACC_REALM` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENT_INITIAL_ACCESS`
--

LOCK TABLES `CLIENT_INITIAL_ACCESS` WRITE;
/*!40000 ALTER TABLE `CLIENT_INITIAL_ACCESS` DISABLE KEYS */;
/*!40000 ALTER TABLE `CLIENT_INITIAL_ACCESS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENT_NODE_REGISTRATIONS`
--

DROP TABLE IF EXISTS `CLIENT_NODE_REGISTRATIONS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENT_NODE_REGISTRATIONS` (
  `CLIENT_ID` varchar(36) NOT NULL,
  `VALUE` int(11) DEFAULT NULL,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`CLIENT_ID`,`NAME`),
  CONSTRAINT `FK4129723BA992F594` FOREIGN KEY (`CLIENT_ID`) REFERENCES `CLIENT` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENT_NODE_REGISTRATIONS`
--

LOCK TABLES `CLIENT_NODE_REGISTRATIONS` WRITE;
/*!40000 ALTER TABLE `CLIENT_NODE_REGISTRATIONS` DISABLE KEYS */;
/*!40000 ALTER TABLE `CLIENT_NODE_REGISTRATIONS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENT_SCOPE`
--

DROP TABLE IF EXISTS `CLIENT_SCOPE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENT_SCOPE` (
  `ID` varchar(36) NOT NULL,
  `NAME` varchar(255) DEFAULT NULL,
  `REALM_ID` varchar(36) DEFAULT NULL,
  `DESCRIPTION` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `PROTOCOL` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_CLI_SCOPE` (`REALM_ID`,`NAME`),
  KEY `IDX_REALM_CLSCOPE` (`REALM_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENT_SCOPE`
--

LOCK TABLES `CLIENT_SCOPE` WRITE;
/*!40000 ALTER TABLE `CLIENT_SCOPE` DISABLE KEYS */;
INSERT INTO `CLIENT_SCOPE` (`ID`, `NAME`, `REALM_ID`, `DESCRIPTION`, `PROTOCOL`) VALUES ('01be032d-9117-4d3b-acce-7ccae55abbfe','role_list','master','SAML role list','saml'),('157f0c24-d0e0-4ea6-b840-9fbea43c2c2e','address','master','OpenID Connect built-in scope: address','openid-connect'),('16991a6a-816c-43aa-b71f-9a1d2ffe691e','email','master','OpenID Connect built-in scope: email','openid-connect'),('1b9a41a9-bf24-4613-b7e7-996da1248bdd','web-origins','master','OpenID Connect scope for add allowed web origins to the access token','openid-connect'),('45469fff-d615-403d-ac6e-a9322b9631be','profile','master','OpenID Connect built-in scope: profile','openid-connect'),('89c6dee1-882b-4c3d-bc83-5e1c69936655','roles','master','OpenID Connect scope for add user roles to the access token','openid-connect'),('98cc39a1-eba6-4e23-ba51-b91bf9226e14','phone','master','OpenID Connect built-in scope: phone','openid-connect'),('c55c237e-208f-4046-81ab-849ce6c10019','offline_access','master','OpenID Connect built-in scope: offline_access','openid-connect'),('e5c86d50-ab1c-4603-9155-861be9495fbe','microprofile-jwt','master','Microprofile - JWT built-in scope','openid-connect');
/*!40000 ALTER TABLE `CLIENT_SCOPE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENT_SCOPE_ATTRIBUTES`
--

DROP TABLE IF EXISTS `CLIENT_SCOPE_ATTRIBUTES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENT_SCOPE_ATTRIBUTES` (
  `SCOPE_ID` varchar(36) NOT NULL,
  `VALUE` varchar(2048) DEFAULT NULL,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`SCOPE_ID`,`NAME`),
  KEY `IDX_CLSCOPE_ATTRS` (`SCOPE_ID`),
  CONSTRAINT `FK_CL_SCOPE_ATTR_SCOPE` FOREIGN KEY (`SCOPE_ID`) REFERENCES `CLIENT_SCOPE` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENT_SCOPE_ATTRIBUTES`
--

LOCK TABLES `CLIENT_SCOPE_ATTRIBUTES` WRITE;
/*!40000 ALTER TABLE `CLIENT_SCOPE_ATTRIBUTES` DISABLE KEYS */;
INSERT INTO `CLIENT_SCOPE_ATTRIBUTES` (`SCOPE_ID`, `VALUE`, `NAME`) VALUES ('01be032d-9117-4d3b-acce-7ccae55abbfe','${samlRoleListScopeConsentText}','consent.screen.text'),('01be032d-9117-4d3b-acce-7ccae55abbfe','true','display.on.consent.screen'),('157f0c24-d0e0-4ea6-b840-9fbea43c2c2e','${addressScopeConsentText}','consent.screen.text'),('157f0c24-d0e0-4ea6-b840-9fbea43c2c2e','true','display.on.consent.screen'),('157f0c24-d0e0-4ea6-b840-9fbea43c2c2e','true','include.in.token.scope'),('16991a6a-816c-43aa-b71f-9a1d2ffe691e','${emailScopeConsentText}','consent.screen.text'),('16991a6a-816c-43aa-b71f-9a1d2ffe691e','true','display.on.consent.screen'),('16991a6a-816c-43aa-b71f-9a1d2ffe691e','true','include.in.token.scope'),('1b9a41a9-bf24-4613-b7e7-996da1248bdd','','consent.screen.text'),('1b9a41a9-bf24-4613-b7e7-996da1248bdd','false','display.on.consent.screen'),('1b9a41a9-bf24-4613-b7e7-996da1248bdd','false','include.in.token.scope'),('45469fff-d615-403d-ac6e-a9322b9631be','${profileScopeConsentText}','consent.screen.text'),('45469fff-d615-403d-ac6e-a9322b9631be','true','display.on.consent.screen'),('45469fff-d615-403d-ac6e-a9322b9631be','true','include.in.token.scope'),('89c6dee1-882b-4c3d-bc83-5e1c69936655','${rolesScopeConsentText}','consent.screen.text'),('89c6dee1-882b-4c3d-bc83-5e1c69936655','true','display.on.consent.screen'),('89c6dee1-882b-4c3d-bc83-5e1c69936655','false','include.in.token.scope'),('98cc39a1-eba6-4e23-ba51-b91bf9226e14','${phoneScopeConsentText}','consent.screen.text'),('98cc39a1-eba6-4e23-ba51-b91bf9226e14','true','display.on.consent.screen'),('98cc39a1-eba6-4e23-ba51-b91bf9226e14','true','include.in.token.scope'),('c55c237e-208f-4046-81ab-849ce6c10019','${offlineAccessScopeConsentText}','consent.screen.text'),('c55c237e-208f-4046-81ab-849ce6c10019','true','display.on.consent.screen'),('e5c86d50-ab1c-4603-9155-861be9495fbe','false','display.on.consent.screen'),('e5c86d50-ab1c-4603-9155-861be9495fbe','true','include.in.token.scope');
/*!40000 ALTER TABLE `CLIENT_SCOPE_ATTRIBUTES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENT_SCOPE_CLIENT`
--

DROP TABLE IF EXISTS `CLIENT_SCOPE_CLIENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENT_SCOPE_CLIENT` (
  `CLIENT_ID` varchar(255) NOT NULL,
  `SCOPE_ID` varchar(255) NOT NULL,
  `DEFAULT_SCOPE` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`CLIENT_ID`,`SCOPE_ID`),
  KEY `IDX_CLSCOPE_CL` (`CLIENT_ID`),
  KEY `IDX_CL_CLSCOPE` (`SCOPE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENT_SCOPE_CLIENT`
--

LOCK TABLES `CLIENT_SCOPE_CLIENT` WRITE;
/*!40000 ALTER TABLE `CLIENT_SCOPE_CLIENT` DISABLE KEYS */;
INSERT INTO `CLIENT_SCOPE_CLIENT` (`CLIENT_ID`, `SCOPE_ID`, `DEFAULT_SCOPE`) VALUES ('2633180f-d391-4e4e-b877-8c886d352f54','157f0c24-d0e0-4ea6-b840-9fbea43c2c2e',_binary '\0'),('2633180f-d391-4e4e-b877-8c886d352f54','16991a6a-816c-43aa-b71f-9a1d2ffe691e',_binary ''),('2633180f-d391-4e4e-b877-8c886d352f54','1b9a41a9-bf24-4613-b7e7-996da1248bdd',_binary ''),('2633180f-d391-4e4e-b877-8c886d352f54','45469fff-d615-403d-ac6e-a9322b9631be',_binary ''),('2633180f-d391-4e4e-b877-8c886d352f54','89c6dee1-882b-4c3d-bc83-5e1c69936655',_binary ''),('2633180f-d391-4e4e-b877-8c886d352f54','98cc39a1-eba6-4e23-ba51-b91bf9226e14',_binary '\0'),('2633180f-d391-4e4e-b877-8c886d352f54','c55c237e-208f-4046-81ab-849ce6c10019',_binary '\0'),('2633180f-d391-4e4e-b877-8c886d352f54','e5c86d50-ab1c-4603-9155-861be9495fbe',_binary '\0'),('6351decc-46e5-426e-899d-3135a4dbd6bf','157f0c24-d0e0-4ea6-b840-9fbea43c2c2e',_binary '\0'),('6351decc-46e5-426e-899d-3135a4dbd6bf','16991a6a-816c-43aa-b71f-9a1d2ffe691e',_binary ''),('6351decc-46e5-426e-899d-3135a4dbd6bf','1b9a41a9-bf24-4613-b7e7-996da1248bdd',_binary ''),('6351decc-46e5-426e-899d-3135a4dbd6bf','45469fff-d615-403d-ac6e-a9322b9631be',_binary ''),('6351decc-46e5-426e-899d-3135a4dbd6bf','89c6dee1-882b-4c3d-bc83-5e1c69936655',_binary ''),('6351decc-46e5-426e-899d-3135a4dbd6bf','98cc39a1-eba6-4e23-ba51-b91bf9226e14',_binary '\0'),('6351decc-46e5-426e-899d-3135a4dbd6bf','c55c237e-208f-4046-81ab-849ce6c10019',_binary '\0'),('6351decc-46e5-426e-899d-3135a4dbd6bf','e5c86d50-ab1c-4603-9155-861be9495fbe',_binary '\0'),('781f80f4-c1fc-4cfd-9614-9bf0ad04900a','157f0c24-d0e0-4ea6-b840-9fbea43c2c2e',_binary '\0'),('781f80f4-c1fc-4cfd-9614-9bf0ad04900a','16991a6a-816c-43aa-b71f-9a1d2ffe691e',_binary ''),('781f80f4-c1fc-4cfd-9614-9bf0ad04900a','1b9a41a9-bf24-4613-b7e7-996da1248bdd',_binary ''),('781f80f4-c1fc-4cfd-9614-9bf0ad04900a','45469fff-d615-403d-ac6e-a9322b9631be',_binary ''),('781f80f4-c1fc-4cfd-9614-9bf0ad04900a','89c6dee1-882b-4c3d-bc83-5e1c69936655',_binary ''),('781f80f4-c1fc-4cfd-9614-9bf0ad04900a','98cc39a1-eba6-4e23-ba51-b91bf9226e14',_binary '\0'),('781f80f4-c1fc-4cfd-9614-9bf0ad04900a','c55c237e-208f-4046-81ab-849ce6c10019',_binary '\0'),('781f80f4-c1fc-4cfd-9614-9bf0ad04900a','e5c86d50-ab1c-4603-9155-861be9495fbe',_binary '\0'),('85815b42-9717-42e9-9171-22c7dda14b82','157f0c24-d0e0-4ea6-b840-9fbea43c2c2e',_binary '\0'),('85815b42-9717-42e9-9171-22c7dda14b82','16991a6a-816c-43aa-b71f-9a1d2ffe691e',_binary ''),('85815b42-9717-42e9-9171-22c7dda14b82','1b9a41a9-bf24-4613-b7e7-996da1248bdd',_binary ''),('85815b42-9717-42e9-9171-22c7dda14b82','45469fff-d615-403d-ac6e-a9322b9631be',_binary ''),('85815b42-9717-42e9-9171-22c7dda14b82','89c6dee1-882b-4c3d-bc83-5e1c69936655',_binary ''),('85815b42-9717-42e9-9171-22c7dda14b82','98cc39a1-eba6-4e23-ba51-b91bf9226e14',_binary '\0'),('85815b42-9717-42e9-9171-22c7dda14b82','c55c237e-208f-4046-81ab-849ce6c10019',_binary '\0'),('85815b42-9717-42e9-9171-22c7dda14b82','e5c86d50-ab1c-4603-9155-861be9495fbe',_binary '\0'),('b2cb29e5-0633-48e6-b053-f7adba31845e','157f0c24-d0e0-4ea6-b840-9fbea43c2c2e',_binary '\0'),('b2cb29e5-0633-48e6-b053-f7adba31845e','16991a6a-816c-43aa-b71f-9a1d2ffe691e',_binary ''),('b2cb29e5-0633-48e6-b053-f7adba31845e','1b9a41a9-bf24-4613-b7e7-996da1248bdd',_binary ''),('b2cb29e5-0633-48e6-b053-f7adba31845e','45469fff-d615-403d-ac6e-a9322b9631be',_binary ''),('b2cb29e5-0633-48e6-b053-f7adba31845e','89c6dee1-882b-4c3d-bc83-5e1c69936655',_binary ''),('b2cb29e5-0633-48e6-b053-f7adba31845e','98cc39a1-eba6-4e23-ba51-b91bf9226e14',_binary '\0'),('b2cb29e5-0633-48e6-b053-f7adba31845e','c55c237e-208f-4046-81ab-849ce6c10019',_binary '\0'),('b2cb29e5-0633-48e6-b053-f7adba31845e','e5c86d50-ab1c-4603-9155-861be9495fbe',_binary '\0'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','157f0c24-d0e0-4ea6-b840-9fbea43c2c2e',_binary '\0'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','16991a6a-816c-43aa-b71f-9a1d2ffe691e',_binary ''),('c1e78271-8fc7-4688-b452-16b5609bc5c2','1b9a41a9-bf24-4613-b7e7-996da1248bdd',_binary ''),('c1e78271-8fc7-4688-b452-16b5609bc5c2','45469fff-d615-403d-ac6e-a9322b9631be',_binary ''),('c1e78271-8fc7-4688-b452-16b5609bc5c2','89c6dee1-882b-4c3d-bc83-5e1c69936655',_binary ''),('c1e78271-8fc7-4688-b452-16b5609bc5c2','98cc39a1-eba6-4e23-ba51-b91bf9226e14',_binary '\0'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','c55c237e-208f-4046-81ab-849ce6c10019',_binary '\0'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','e5c86d50-ab1c-4603-9155-861be9495fbe',_binary '\0'),('d3bc5911-d1c9-4a27-9a65-e1993cee1c29','157f0c24-d0e0-4ea6-b840-9fbea43c2c2e',_binary '\0'),('d3bc5911-d1c9-4a27-9a65-e1993cee1c29','16991a6a-816c-43aa-b71f-9a1d2ffe691e',_binary ''),('d3bc5911-d1c9-4a27-9a65-e1993cee1c29','1b9a41a9-bf24-4613-b7e7-996da1248bdd',_binary ''),('d3bc5911-d1c9-4a27-9a65-e1993cee1c29','45469fff-d615-403d-ac6e-a9322b9631be',_binary ''),('d3bc5911-d1c9-4a27-9a65-e1993cee1c29','89c6dee1-882b-4c3d-bc83-5e1c69936655',_binary ''),('d3bc5911-d1c9-4a27-9a65-e1993cee1c29','98cc39a1-eba6-4e23-ba51-b91bf9226e14',_binary '\0'),('d3bc5911-d1c9-4a27-9a65-e1993cee1c29','c55c237e-208f-4046-81ab-849ce6c10019',_binary '\0'),('d3bc5911-d1c9-4a27-9a65-e1993cee1c29','e5c86d50-ab1c-4603-9155-861be9495fbe',_binary '\0');
/*!40000 ALTER TABLE `CLIENT_SCOPE_CLIENT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENT_SCOPE_ROLE_MAPPING`
--

DROP TABLE IF EXISTS `CLIENT_SCOPE_ROLE_MAPPING`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENT_SCOPE_ROLE_MAPPING` (
  `SCOPE_ID` varchar(36) NOT NULL,
  `ROLE_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`SCOPE_ID`,`ROLE_ID`),
  KEY `IDX_CLSCOPE_ROLE` (`SCOPE_ID`),
  KEY `IDX_ROLE_CLSCOPE` (`ROLE_ID`),
  CONSTRAINT `FK_CL_SCOPE_RM_SCOPE` FOREIGN KEY (`SCOPE_ID`) REFERENCES `CLIENT_SCOPE` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENT_SCOPE_ROLE_MAPPING`
--

LOCK TABLES `CLIENT_SCOPE_ROLE_MAPPING` WRITE;
/*!40000 ALTER TABLE `CLIENT_SCOPE_ROLE_MAPPING` DISABLE KEYS */;
INSERT INTO `CLIENT_SCOPE_ROLE_MAPPING` (`SCOPE_ID`, `ROLE_ID`) VALUES ('c55c237e-208f-4046-81ab-849ce6c10019','95c58893-8a5f-4fba-b384-5afca296e840');
/*!40000 ALTER TABLE `CLIENT_SCOPE_ROLE_MAPPING` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENT_SESSION`
--

DROP TABLE IF EXISTS `CLIENT_SESSION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENT_SESSION` (
  `ID` varchar(36) NOT NULL,
  `CLIENT_ID` varchar(36) DEFAULT NULL,
  `REDIRECT_URI` varchar(255) DEFAULT NULL,
  `STATE` varchar(255) DEFAULT NULL,
  `TIMESTAMP` int(11) DEFAULT NULL,
  `SESSION_ID` varchar(36) DEFAULT NULL,
  `AUTH_METHOD` varchar(255) DEFAULT NULL,
  `REALM_ID` varchar(255) DEFAULT NULL,
  `AUTH_USER_ID` varchar(36) DEFAULT NULL,
  `CURRENT_ACTION` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_CLIENT_SESSION_SESSION` (`SESSION_ID`),
  CONSTRAINT `FK_B4AO2VCVAT6UKAU74WBWTFQO1` FOREIGN KEY (`SESSION_ID`) REFERENCES `USER_SESSION` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENT_SESSION`
--

LOCK TABLES `CLIENT_SESSION` WRITE;
/*!40000 ALTER TABLE `CLIENT_SESSION` DISABLE KEYS */;
/*!40000 ALTER TABLE `CLIENT_SESSION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENT_SESSION_AUTH_STATUS`
--

DROP TABLE IF EXISTS `CLIENT_SESSION_AUTH_STATUS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENT_SESSION_AUTH_STATUS` (
  `AUTHENTICATOR` varchar(36) NOT NULL,
  `STATUS` int(11) DEFAULT NULL,
  `CLIENT_SESSION` varchar(36) NOT NULL,
  PRIMARY KEY (`CLIENT_SESSION`,`AUTHENTICATOR`),
  CONSTRAINT `AUTH_STATUS_CONSTRAINT` FOREIGN KEY (`CLIENT_SESSION`) REFERENCES `CLIENT_SESSION` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENT_SESSION_AUTH_STATUS`
--

LOCK TABLES `CLIENT_SESSION_AUTH_STATUS` WRITE;
/*!40000 ALTER TABLE `CLIENT_SESSION_AUTH_STATUS` DISABLE KEYS */;
/*!40000 ALTER TABLE `CLIENT_SESSION_AUTH_STATUS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENT_SESSION_NOTE`
--

DROP TABLE IF EXISTS `CLIENT_SESSION_NOTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENT_SESSION_NOTE` (
  `NAME` varchar(255) NOT NULL,
  `VALUE` varchar(255) DEFAULT NULL,
  `CLIENT_SESSION` varchar(36) NOT NULL,
  PRIMARY KEY (`CLIENT_SESSION`,`NAME`),
  CONSTRAINT `FK5EDFB00FF51C2736` FOREIGN KEY (`CLIENT_SESSION`) REFERENCES `CLIENT_SESSION` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENT_SESSION_NOTE`
--

LOCK TABLES `CLIENT_SESSION_NOTE` WRITE;
/*!40000 ALTER TABLE `CLIENT_SESSION_NOTE` DISABLE KEYS */;
/*!40000 ALTER TABLE `CLIENT_SESSION_NOTE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENT_SESSION_PROT_MAPPER`
--

DROP TABLE IF EXISTS `CLIENT_SESSION_PROT_MAPPER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENT_SESSION_PROT_MAPPER` (
  `PROTOCOL_MAPPER_ID` varchar(36) NOT NULL,
  `CLIENT_SESSION` varchar(36) NOT NULL,
  PRIMARY KEY (`CLIENT_SESSION`,`PROTOCOL_MAPPER_ID`),
  CONSTRAINT `FK_33A8SGQW18I532811V7O2DK89` FOREIGN KEY (`CLIENT_SESSION`) REFERENCES `CLIENT_SESSION` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENT_SESSION_PROT_MAPPER`
--

LOCK TABLES `CLIENT_SESSION_PROT_MAPPER` WRITE;
/*!40000 ALTER TABLE `CLIENT_SESSION_PROT_MAPPER` DISABLE KEYS */;
/*!40000 ALTER TABLE `CLIENT_SESSION_PROT_MAPPER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENT_SESSION_ROLE`
--

DROP TABLE IF EXISTS `CLIENT_SESSION_ROLE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENT_SESSION_ROLE` (
  `ROLE_ID` varchar(255) NOT NULL,
  `CLIENT_SESSION` varchar(36) NOT NULL,
  PRIMARY KEY (`CLIENT_SESSION`,`ROLE_ID`),
  CONSTRAINT `FK_11B7SGQW18I532811V7O2DV76` FOREIGN KEY (`CLIENT_SESSION`) REFERENCES `CLIENT_SESSION` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENT_SESSION_ROLE`
--

LOCK TABLES `CLIENT_SESSION_ROLE` WRITE;
/*!40000 ALTER TABLE `CLIENT_SESSION_ROLE` DISABLE KEYS */;
/*!40000 ALTER TABLE `CLIENT_SESSION_ROLE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CLIENT_USER_SESSION_NOTE`
--

DROP TABLE IF EXISTS `CLIENT_USER_SESSION_NOTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CLIENT_USER_SESSION_NOTE` (
  `NAME` varchar(255) NOT NULL,
  `VALUE` varchar(2048) DEFAULT NULL,
  `CLIENT_SESSION` varchar(36) NOT NULL,
  PRIMARY KEY (`CLIENT_SESSION`,`NAME`),
  CONSTRAINT `FK_CL_USR_SES_NOTE` FOREIGN KEY (`CLIENT_SESSION`) REFERENCES `CLIENT_SESSION` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CLIENT_USER_SESSION_NOTE`
--

LOCK TABLES `CLIENT_USER_SESSION_NOTE` WRITE;
/*!40000 ALTER TABLE `CLIENT_USER_SESSION_NOTE` DISABLE KEYS */;
/*!40000 ALTER TABLE `CLIENT_USER_SESSION_NOTE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `COMPONENT`
--

DROP TABLE IF EXISTS `COMPONENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `COMPONENT` (
  `ID` varchar(36) NOT NULL,
  `NAME` varchar(255) DEFAULT NULL,
  `PARENT_ID` varchar(36) DEFAULT NULL,
  `PROVIDER_ID` varchar(36) DEFAULT NULL,
  `PROVIDER_TYPE` varchar(255) DEFAULT NULL,
  `REALM_ID` varchar(36) DEFAULT NULL,
  `SUB_TYPE` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_COMPONENT_REALM` (`REALM_ID`),
  KEY `IDX_COMPONENT_PROVIDER_TYPE` (`PROVIDER_TYPE`),
  CONSTRAINT `FK_COMPONENT_REALM` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `COMPONENT`
--

LOCK TABLES `COMPONENT` WRITE;
/*!40000 ALTER TABLE `COMPONENT` DISABLE KEYS */;
INSERT INTO `COMPONENT` (`ID`, `NAME`, `PARENT_ID`, `PROVIDER_ID`, `PROVIDER_TYPE`, `REALM_ID`, `SUB_TYPE`) VALUES ('023e92f3-9e37-4c01-8000-f2463337960b','Allowed Protocol Mapper Types','master','allowed-protocol-mappers','org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy','master','anonymous'),('0301eee9-b4da-46a6-bf53-e29759bfc7bb','Max Clients Limit','master','max-clients','org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy','master','anonymous'),('3bb458b3-59fb-4299-bd31-6b08b69a157e','hmac-generated','master','hmac-generated','org.keycloak.keys.KeyProvider','master',NULL),('3c87c697-9821-453a-b2db-f0b1fe333ed9','Trusted Hosts','master','trusted-hosts','org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy','master','anonymous'),('3fac9189-8669-4356-b9fa-6aa83872c451','aes-generated','master','aes-generated','org.keycloak.keys.KeyProvider','master',NULL),('933825e3-42e7-47ad-81c2-9189d013ce4e','rsa-enc-generated','master','rsa-enc-generated','org.keycloak.keys.KeyProvider','master',NULL),('98e531d9-61ae-451b-886e-7ac54afabcad','Full Scope Disabled','master','scope','org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy','master','anonymous'),('a80e934c-5631-4902-834d-21bf75dd4242','Allowed Client Scopes','master','allowed-client-templates','org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy','master','anonymous'),('c7f8e79e-ff0c-43b0-8eb5-8b9936452e44','Allowed Protocol Mapper Types','master','allowed-protocol-mappers','org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy','master','authenticated'),('df4b5236-ad3d-40cb-8bd0-20e0dfc921bc','Allowed Client Scopes','master','allowed-client-templates','org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy','master','authenticated'),('e0b0aa1c-0573-4b2a-8631-e02e5397dfde','Consent Required','master','consent-required','org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy','master','anonymous'),('ec53625f-7f39-468c-8e7e-3e95c18150c2','rsa-generated','master','rsa-generated','org.keycloak.keys.KeyProvider','master',NULL);
/*!40000 ALTER TABLE `COMPONENT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `COMPONENT_CONFIG`
--

DROP TABLE IF EXISTS `COMPONENT_CONFIG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `COMPONENT_CONFIG` (
  `ID` varchar(36) NOT NULL,
  `COMPONENT_ID` varchar(36) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `VALUE` varchar(4000) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_COMPO_CONFIG_COMPO` (`COMPONENT_ID`),
  CONSTRAINT `FK_COMPONENT_CONFIG` FOREIGN KEY (`COMPONENT_ID`) REFERENCES `COMPONENT` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `COMPONENT_CONFIG`
--

LOCK TABLES `COMPONENT_CONFIG` WRITE;
/*!40000 ALTER TABLE `COMPONENT_CONFIG` DISABLE KEYS */;
INSERT INTO `COMPONENT_CONFIG` (`ID`, `COMPONENT_ID`, `NAME`, `VALUE`) VALUES ('0617e98c-d57e-41f3-8236-63b53cf85d9f','3bb458b3-59fb-4299-bd31-6b08b69a157e','priority','100'),('0698efdd-c8a2-4e13-b44b-eea89c44e0d5','3bb458b3-59fb-4299-bd31-6b08b69a157e','secret','lEQZsqcWZ8sYNgQBwsSE93V8gxKDoqDu4w-Z_-E1982v98Cf-24fthpvOBxZxp6_wzP8IpbB3V2UoL2HGA9riw'),('0d68ad34-2d02-43cc-bfa4-d08d40926744','ec53625f-7f39-468c-8e7e-3e95c18150c2','priority','100'),('0dd452cc-64b8-4229-af0e-fdd475b5e756','c7f8e79e-ff0c-43b0-8eb5-8b9936452e44','allowed-protocol-mapper-types','oidc-sha256-pairwise-sub-mapper'),('1742bf35-80ef-43c4-9abf-0eeefbd17cfd','3fac9189-8669-4356-b9fa-6aa83872c451','kid','53208427-43c1-465e-97cb-d7fcd65759b5'),('1bdb3169-5b83-4949-9e1b-d2c26af84f96','c7f8e79e-ff0c-43b0-8eb5-8b9936452e44','allowed-protocol-mapper-types','oidc-full-name-mapper'),('23f380cc-a97c-4028-a855-8db473b4455e','0301eee9-b4da-46a6-bf53-e29759bfc7bb','max-clients','200'),('2614591f-8548-49b6-b7d9-2881d2038e68','3fac9189-8669-4356-b9fa-6aa83872c451','secret','m8jhVC5o_5LRHK-KBxg-uA'),('2b85aaca-4935-4bfe-b7f4-c2b012651e0c','023e92f3-9e37-4c01-8000-f2463337960b','allowed-protocol-mapper-types','oidc-address-mapper'),('2cfd3fdc-de69-4b83-afa9-effb7960ee82','3c87c697-9821-453a-b2db-f0b1fe333ed9','client-uris-must-match','true'),('30bcb575-3503-4717-a66f-1422828771d9','933825e3-42e7-47ad-81c2-9189d013ce4e','certificate','MIICmzCCAYMCBgGDRX8LJzANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjIwOTE2MDg0OTU3WhcNMzIwOTE2MDg1MTM3WjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDN9IC3X6urUlZxcOupit4xr++OTUHgX3j5FjrXkSnRofTCqaVjJIPv66O2ds/Ol0LDxAReawfvmkAWBVO9nwdDeRKbWJ8kHIZs7bOK/z9URFkcJOFnrkHROIraMWwA57uxuYSxLKhps8r97Wa1TcsS1yWvSiqxVnv5gPufz0mgGdo1mY9Xbb7OU0Z4SkrnRo27rgY5U6LUeO2snGlBWB06s/knFi02AzOoqyF8Ho43zIpkvg9qLS57xx4MoMfn506AnmAeUxd7cCqeDKmjQs8NpRpqyY8+bFZ5nGjha00E9kNOs+9+txmOOOr58+a9ZiormCaJ6/PuccAkWPicyG71AgMBAAEwDQYJKoZIhvcNAQELBQADggEBAFmSalZWdTmHjKiJz6sgDlGfg3mRq/KlPGksjnCSvjj1sPj8WEk5ELq0pQbA7wdr3MBEIpYsOBvcqWvewJxoMKzNZeRvExRtHxAnUJtmHYGJAGWx10nPYLFrDQMzBO1VWwjBHWeY+G259lRfKYby8r9LGX3wxRecM+32I80fSqbFCtNp2HH2KJc+HM8Rgi7Lqb8y1GmtSfYq2oAP/JLpTmGHLarHVQHnGSGa6n2t9f5v0pwTShtAljwMzP+UZuA69ltPtHvQ0TzF4LZWYjqtZhhdy0QzV/ezPtVv6Kbel9I1mytH86fy+iHU0q/0CKlDTrzTM98ivmg51sEcQCDxZ+4='),('395a8a58-fabe-4eb6-a0cb-cb6062d55730','3bb458b3-59fb-4299-bd31-6b08b69a157e','kid','fa7ba666-18fe-4804-98a8-054d25df9895'),('3f4829d6-b0ab-4581-82d1-ce141f6d7b0b','ec53625f-7f39-468c-8e7e-3e95c18150c2','certificate','MIICmzCCAYMCBgGDRX8KEzANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjIwOTE2MDg0OTU3WhcNMzIwOTE2MDg1MTM3WjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCMjxn1vCeTiWpmNASuKSX1956IBwJcpXfjJjj+K7Ln1ctu6+jzhr8HsguHNvmEAsItBqAxfHs3XSJWFR0DCmbfEYaUvusl4GR+W1KWr7JmLuGp5h6TdafOwyN/KQoVFfgteyv0OMzuvAg46tx3C+OOiUOM67+0/KhgEbDBYtZReQTWlk3qJ4jyqzFiH2xFxfWe1cdhdBkA5Jm1X4jr55eHbmQH3KM3R2JDDnOY2xE7vwAyHij3zoa3T6EJAlxN8NYpra9wlW0AOWt8+PMP4FX3YbxndNX7B7g0wYNFlV3jHOczR0PF4HdhRplWkCAtMgaBatr0InLM8stV85axpeW7AgMBAAEwDQYJKoZIhvcNAQELBQADggEBAAhGLV6RrELy39vd4vND6LP0q0JAs/r5A9H/hjVQsY0taEKLEr/6q3ReEXSaJ8OnMMT8ieGC0PzxjAVR5z0fDHPUaz8atKFLMkBf35mC3QqCuw5+Sg8maA5mod0e42KoOFsZJ91mKKdGJ+jVcNViHXYc8dRXoBe6LYM8ta6xLlGJuAYVEsxoJgwSdrkOSg2bZ+bbIIv2mMAXOW8keUllL8SCkD7nEvfXoAa0n0kG71Osd7EFMl2oNkLXX5Gng90HPrZHqVUOhNk8Yoi/dtG9g1mzY078/yCdvVnwCPC3cuoZWmGujgNLJIpORDa6NdrmhdPhdlCbgP2+UP9HqBP2m6c='),('4e77380b-67c8-4e97-b674-18c0343d08b5','c7f8e79e-ff0c-43b0-8eb5-8b9936452e44','allowed-protocol-mapper-types','oidc-address-mapper'),('53a4955d-a48c-449d-95e5-e92bc3395da3','c7f8e79e-ff0c-43b0-8eb5-8b9936452e44','allowed-protocol-mapper-types','oidc-usermodel-property-mapper'),('57dffb5e-dbdc-4932-9be1-65b077649313','ec53625f-7f39-468c-8e7e-3e95c18150c2','keyUse','SIG'),('6c805381-5e36-43d2-b096-5b5842ae5ecb','c7f8e79e-ff0c-43b0-8eb5-8b9936452e44','allowed-protocol-mapper-types','oidc-usermodel-attribute-mapper'),('6cf214fd-5647-4e29-a85d-abc1af0f7bf5','a80e934c-5631-4902-834d-21bf75dd4242','allow-default-scopes','true'),('71623da6-3ee1-4754-89e9-22b4f287a562','c7f8e79e-ff0c-43b0-8eb5-8b9936452e44','allowed-protocol-mapper-types','saml-role-list-mapper'),('77dd4d56-99fd-419f-b77f-6a6e68ad027a','023e92f3-9e37-4c01-8000-f2463337960b','allowed-protocol-mapper-types','oidc-sha256-pairwise-sub-mapper'),('89ed6bab-899d-4f8e-a88a-1805b2d95ca1','3bb458b3-59fb-4299-bd31-6b08b69a157e','algorithm','HS256'),('8c1c629b-7025-4d70-803a-0be24057a4dc','023e92f3-9e37-4c01-8000-f2463337960b','allowed-protocol-mapper-types','saml-user-property-mapper'),('94f09285-0837-4823-aaf0-121f5b6112b9','023e92f3-9e37-4c01-8000-f2463337960b','allowed-protocol-mapper-types','oidc-usermodel-property-mapper'),('b6b9aa4a-cf71-4584-8b35-b83b66091175','023e92f3-9e37-4c01-8000-f2463337960b','allowed-protocol-mapper-types','saml-user-attribute-mapper'),('bcd5f75f-7e98-4a73-9ae8-27a2bfba2060','df4b5236-ad3d-40cb-8bd0-20e0dfc921bc','allow-default-scopes','true'),('bd8c042d-be2b-43f4-a6e8-fbbd778834ce','933825e3-42e7-47ad-81c2-9189d013ce4e','privateKey','MIIEpAIBAAKCAQEAzfSAt1+rq1JWcXDrqYreMa/vjk1B4F94+RY615Ep0aH0wqmlYySD7+ujtnbPzpdCw8QEXmsH75pAFgVTvZ8HQ3kSm1ifJByGbO2ziv8/VERZHCThZ65B0TiK2jFsAOe7sbmEsSyoabPK/e1mtU3LEtclr0oqsVZ7+YD7n89JoBnaNZmPV22+zlNGeEpK50aNu64GOVOi1HjtrJxpQVgdOrP5JxYtNgMzqKshfB6ON8yKZL4Pai0ue8ceDKDH5+dOgJ5gHlMXe3Aqngypo0LPDaUaasmPPmxWeZxo4WtNBPZDTrPvfrcZjjjq+fPmvWYqK5gmievz7nHAJFj4nMhu9QIDAQABAoIBAGA1wtdmytQaf6U4we4OoCOH85l/P7HoB6QcnVpMRsPWK3ewNkFtMnEmm/DF6eexQ5AeBohw6WElpqBi1q6zFnqPmYCWUqlU5fsGw6O//z6HOzVpiR6dCcQJ7Ntm0PRPTKAGcRUvLnFKex5KA3vYnm/rr4AGXpE/PGTeuyz5cYRnGLoI05wExPwzZ0g735UrO4g9xhh+wHPuR8eDTnPwzvMULrUiQByq/1gjAg5K0mdzdFOyS3TisUcNltXyudFcT8yByRG6okWM5+ANGp992QmLQ9X2xvW3os/yDMQycXepOMTJEKh3pODsZQVfa9blFQgkk9gKRXvnqYL+TmW9w5UCgYEA6ON8q3OZ0N/kneWyRg5mmJrqa9bC/ldzBbarChiNzipB9bzKUIj8EKlSn/S7Hkh/AMx/7EpCC6gjSOb8t8luYphboeVpBVL490/qKywYoX8LhK1wqafaESa0T1DKrIyTlx9FSmNQX8RMgZokYrzgy5EpzejWOweo3iZoRJKcbHcCgYEA4mTFovgnCdf8Um5kz+YwRJIQwXD3KxwG7+GUtIyUREc/jQy38A0WsJSLXrDMMqXlEu30nA/A8MH47KO3lOWrNW9iZX1gNUKFFgOHqL8oKqs8qgYS9VrHWQlQiMJ2c7/3TVG+FnkxwAfGNwEIcRfVq2wZ1z+gMxWVybqC5C/u1vMCgYEAqsBYYRDyHy55XbfTHQBkAtHavNSKxZbyk6baAx37osRi9jzEjYXSYpjzJqp2I37992T5ChNsF0XhEQujEVGUKKAS10Hv3WJ3fkTOqXa8XHRcypur9ghGn7qkC19uKlMrx2q7EA5/GKhBe+i7ctWPcFHvt7RWlpNIIhFA874XCIMCgYEA0nY2GPuyZv9IDWWdCHyIsKZNN1eKH6RteoFuGa56g0Ls/HYvZNT2G+/r5HpdSlRYsZFPDenDRs48V9kW6C/eSs2iXpEAaGLPkBh1+9TBRXFs8u60nyzmF4qGOKz3K0HxaAquuPuv2UIg7a9jJqeuti7HkwgOKI9PcXqXBgTddysCgYAnF1Mpuwv7Vrd3Y/yOgdTSSokCUmeTilA3t+04GD0OfCPb9mQ2hKt3vSndtGC3Y0ZMNkZhKcrksfUIO5ZH3BPpEfKbpngADJr7+bMe9DIQj23Z2AAqK+YCwendS9V2fVcpJ3rSEOoKfhDWN5to2gk3IKFXe8ZJQXvCTwX7W/Lb3w=='),('c7858cbc-c7a4-41db-ba0d-600e41f81dbd','c7f8e79e-ff0c-43b0-8eb5-8b9936452e44','allowed-protocol-mapper-types','saml-user-attribute-mapper'),('ca2f7002-15fc-4a0e-b4a1-f4224ec90648','933825e3-42e7-47ad-81c2-9189d013ce4e','keyUse','ENC'),('d7f4d239-b7a6-4fc5-adc9-3a9cb00234b9','3c87c697-9821-453a-b2db-f0b1fe333ed9','host-sending-registration-request-must-match','true'),('dd94014f-54b4-411c-99e9-552619fe7d85','933825e3-42e7-47ad-81c2-9189d013ce4e','algorithm','RSA-OAEP'),('de54fa5c-b33c-4df9-b2d4-c21e95afe16b','c7f8e79e-ff0c-43b0-8eb5-8b9936452e44','allowed-protocol-mapper-types','saml-user-property-mapper'),('e21466ee-bff4-41b6-a784-62ab63a34086','3fac9189-8669-4356-b9fa-6aa83872c451','priority','100'),('e2e24d99-2b9b-42e5-97ed-806b18151fc6','023e92f3-9e37-4c01-8000-f2463337960b','allowed-protocol-mapper-types','saml-role-list-mapper'),('e406a067-9cd5-4961-a6a4-46ff283e3ab2','023e92f3-9e37-4c01-8000-f2463337960b','allowed-protocol-mapper-types','oidc-usermodel-attribute-mapper'),('e8522230-0811-48cd-888b-d256bbf4b701','ec53625f-7f39-468c-8e7e-3e95c18150c2','privateKey','MIIEowIBAAKCAQEAjI8Z9bwnk4lqZjQErikl9feeiAcCXKV34yY4/iuy59XLbuvo84a/B7ILhzb5hALCLQagMXx7N10iVhUdAwpm3xGGlL7rJeBkfltSlq+yZi7hqeYek3WnzsMjfykKFRX4LXsr9DjM7rwIOOrcdwvjjolDjOu/tPyoYBGwwWLWUXkE1pZN6ieI8qsxYh9sRcX1ntXHYXQZAOSZtV+I6+eXh25kB9yjN0diQw5zmNsRO78AMh4o986Gt0+hCQJcTfDWKa2vcJVtADlrfPjzD+BV92G8Z3TV+we4NMGDRZVd4xznM0dDxeB3YUaZVpAgLTIGgWra9CJyzPLLVfOWsaXluwIDAQABAoIBAH6JaU5u95X7dHzTwY7kXldDd0VwQfETyY0FYPN4dZP+RSjzWgC6Qol0AKrWk+QC87nDKD3EmcxqnLmwQjD1kUyqI2UPRvQPQYj7P6uGOm2BMQhZsRcBKXOa+v7D/F6lK4oOQ7CV3e/h+Oj8jkLhwhcUfWqE5U3S0uXBp0VBbD1lBXnVYDAbPrB5RddIr6Rlw06KuuIf2Jehwr1n/o/kiLW2oEip5jQXwxD70UYmu44CRQRhrC9rqkh+FuaxWWuVfPbEiVYp4wHNPHRXTCn1b1EYRxANKP2MDJwS1poTNs25/apQbVPhQh+tO1wufZNTwUZVXZO5my4ipZHSzfztz4ECgYEAzjJSUJK+KIvVdpQSLxEQhb9XwvNC2KRS8mlh/+b3ATT/UvLSSTdoP+0x30CW4Nn2Jogtu81MDLha7o0bLi3uVbCEtVeXseWesorij0rNQIbJfdXDjpJne+/SHvjYkZhNNJRUsaBU/Rby/IYvkYeUGH7oPrusRBrlzwxSieWORfsCgYEAroI8KW/ry+YRtz6UGgQKRWw2SDzNVTVsv4ryZ9s7fEGXr0UZWi1sVcNT7srlQYxj+cqtvuVoEOUFCmyyqgFheiH/z9YlodE3hHmryRyZch6pfLUSe3hPulcMelewqGmvQdstdk01vyE3gz37fjLIR9hiRG2TQ19K6wrLKU5Vk0ECgYEAv2/8+I2lOyPIhhUnZMdlHafupTMRBu5ZjHLG573Z6ib4PlzvW8azZValDO98pTn3zQJ143zRdKXc1snvSEqgkrIWI/80+ZeEZaOIgR0jvxrlC41hyIaoyWp5HQRQnaxXUc+9akS/Y1LhOg6jL2w+1RdOLKA1ae3HGxoHr7uPAe0CgYACCtYnaf7pePzWFy5mi4uPOm/8MnH4wFJQf5DMtF0i3CWpUHa2fneZHVsbHVbHiJwW7U9RP6ATKor/jzwcDz4TztgOl6QDG865hy8CgIovMrqrEfdwaH0OYjxsJiCUKAB8FdOXYdnyLbJXn98UoAWGCbtEr7+cdz4KOCsehaMswQKBgC4Sm1dInqK1ZL8yiG/55cRrg8EGasQqykJexrGFk1bVQunxGbr/zUx63xXDORjzcflKpsOHIWKZr1CAUm/ALkiSWg7GDXh2xqYQnS6zCL4sI8Jqji33f4vFHsshZ83WuRMJj/9Td/DpVfvXTcjz+mKipeGEAOiw/kTW24a7iDJr'),('f4d86996-5048-4af5-bce6-813ef3fb8aea','023e92f3-9e37-4c01-8000-f2463337960b','allowed-protocol-mapper-types','oidc-full-name-mapper'),('f6fbdc6b-08d1-4fe4-a4d9-b1dc75d96f0c','933825e3-42e7-47ad-81c2-9189d013ce4e','priority','100');
/*!40000 ALTER TABLE `COMPONENT_CONFIG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `COMPOSITE_ROLE`
--

DROP TABLE IF EXISTS `COMPOSITE_ROLE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `COMPOSITE_ROLE` (
  `COMPOSITE` varchar(36) NOT NULL,
  `CHILD_ROLE` varchar(36) NOT NULL,
  PRIMARY KEY (`COMPOSITE`,`CHILD_ROLE`),
  KEY `IDX_COMPOSITE` (`COMPOSITE`),
  KEY `IDX_COMPOSITE_CHILD` (`CHILD_ROLE`),
  CONSTRAINT `FK_A63WVEKFTU8JO1PNJ81E7MCE2` FOREIGN KEY (`COMPOSITE`) REFERENCES `KEYCLOAK_ROLE` (`ID`),
  CONSTRAINT `FK_GR7THLLB9LU8Q4VQA4524JJY8` FOREIGN KEY (`CHILD_ROLE`) REFERENCES `KEYCLOAK_ROLE` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `COMPOSITE_ROLE`
--

LOCK TABLES `COMPOSITE_ROLE` WRITE;
/*!40000 ALTER TABLE `COMPOSITE_ROLE` DISABLE KEYS */;
INSERT INTO `COMPOSITE_ROLE` (`COMPOSITE`, `CHILD_ROLE`) VALUES ('47b83310-ba07-4298-985a-9f57c393eed0','bcc1adab-4c19-480b-bb5d-aa09c96bd592'),('65c3d650-1179-408b-b231-3221b93f2f42','41199763-10d6-4174-8c38-4bce06276852'),('86686e2f-5fab-4fd8-a59d-7d31e3d67089','fff44e10-b919-4c01-b65c-a2448f037b23'),('ad6cb71c-a5ae-4120-92af-25b900434158','be0ebba9-546e-4347-baa8-06a4a44e83c3'),('ad6cb71c-a5ae-4120-92af-25b900434158','d45512b2-852e-425b-b1b5-71c917a36c88'),('fc169503-3954-4fda-85db-dc29c7e45e52','2911caf1-d52f-40ad-a2e4-440683f7dd6b'),('fc169503-3954-4fda-85db-dc29c7e45e52','33cedc48-1222-438d-9ac9-b7d17fab1f96'),('fc169503-3954-4fda-85db-dc29c7e45e52','34feb122-cc91-4f71-8709-7b1a42775ee7'),('fc169503-3954-4fda-85db-dc29c7e45e52','362b8cd0-6ec9-483c-b881-59f5f1b1595b'),('fc169503-3954-4fda-85db-dc29c7e45e52','48d7297f-961a-49bf-a2d7-e5a4ccc43a1a'),('fc169503-3954-4fda-85db-dc29c7e45e52','818ba614-34fc-42e9-a382-23c42853b70b'),('fc169503-3954-4fda-85db-dc29c7e45e52','86686e2f-5fab-4fd8-a59d-7d31e3d67089'),('fc169503-3954-4fda-85db-dc29c7e45e52','86d3a026-325f-49c5-9836-d023d687bb44'),('fc169503-3954-4fda-85db-dc29c7e45e52','9890f56d-d994-4cf2-aa79-d3296afe3e54'),('fc169503-3954-4fda-85db-dc29c7e45e52','ad6cb71c-a5ae-4120-92af-25b900434158'),('fc169503-3954-4fda-85db-dc29c7e45e52','af9d2d82-5a55-492c-84f5-549b8ecc5c68'),('fc169503-3954-4fda-85db-dc29c7e45e52','bcf3e72d-a5b6-4dc1-9e79-9cf328d9f00c'),('fc169503-3954-4fda-85db-dc29c7e45e52','be0ebba9-546e-4347-baa8-06a4a44e83c3'),('fc169503-3954-4fda-85db-dc29c7e45e52','d2c5720a-730b-4ebf-8cdc-37e46d153ce2'),('fc169503-3954-4fda-85db-dc29c7e45e52','d45512b2-852e-425b-b1b5-71c917a36c88'),('fc169503-3954-4fda-85db-dc29c7e45e52','e9aee95a-5dc1-439c-b58a-98c50e803d4a'),('fc169503-3954-4fda-85db-dc29c7e45e52','eeccdaf1-0106-4d7f-af8f-c6c41f0f43f7'),('fc169503-3954-4fda-85db-dc29c7e45e52','fcc8e347-456b-446b-8a53-dca7e2491005'),('fc169503-3954-4fda-85db-dc29c7e45e52','fff44e10-b919-4c01-b65c-a2448f037b23'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','279f2431-7a61-44cc-bc79-d4f65a87c0df'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','65c3d650-1179-408b-b231-3221b93f2f42'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','95c58893-8a5f-4fba-b384-5afca296e840'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','dce0b22c-c24b-4d37-a5e9-bb273b189605');
/*!40000 ALTER TABLE `COMPOSITE_ROLE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CREDENTIAL`
--

DROP TABLE IF EXISTS `CREDENTIAL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CREDENTIAL` (
  `ID` varchar(36) NOT NULL,
  `SALT` tinyblob,
  `TYPE` varchar(255) DEFAULT NULL,
  `USER_ID` varchar(36) DEFAULT NULL,
  `CREATED_DATE` bigint(20) DEFAULT NULL,
  `USER_LABEL` varchar(255) DEFAULT NULL,
  `SECRET_DATA` longtext,
  `CREDENTIAL_DATA` longtext,
  `PRIORITY` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_USER_CREDENTIAL` (`USER_ID`),
  CONSTRAINT `FK_PFYR0GLASQYL0DEI3KL69R6V0` FOREIGN KEY (`USER_ID`) REFERENCES `USER_ENTITY` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CREDENTIAL`
--

LOCK TABLES `CREDENTIAL` WRITE;
/*!40000 ALTER TABLE `CREDENTIAL` DISABLE KEYS */;
INSERT INTO `CREDENTIAL` (`ID`, `SALT`, `TYPE`, `USER_ID`, `CREATED_DATE`, `USER_LABEL`, `SECRET_DATA`, `CREDENTIAL_DATA`, `PRIORITY`) VALUES ('15399b59-3918-4fb1-9105-f2d2e0725125',NULL,'password','16da2716-bede-4645-9eac-f10bba0a759a',1663328483818,NULL,'{\"value\":\"DKnUq4PcsWx4KJMzMksi7/7sIx9NFX4hFAm/55LDWfOknsUPvKtZcgGxEJSWRtJjTPITxUtWGBsD9bNu2Xm7Ug==\",\"salt\":\"EWgIQwfY36xdrRnAU9Vxgw==\",\"additionalParameters\":{}}','{\"hashIterations\":27500,\"algorithm\":\"pbkdf2-sha256\",\"additionalParameters\":{}}',10),('1cd7f79d-9cf0-43b6-9e69-30c8bf7db8cd',NULL,'password','1d7924f9-03b4-4e50-ac7a-5a547e09db41',1663328563887,NULL,'{\"value\":\"Dyu+GWgvrDPPZj/c6Si8WvzMzpBbcp4P06DM76M1t61D50FmoPmkPPjkQSCvaJhK4Y4Yy0dGAonfldCFYUyY9Q==\",\"salt\":\"SNVoHeOrjus88NtkScuo2w==\",\"additionalParameters\":{}}','{\"hashIterations\":27500,\"algorithm\":\"pbkdf2-sha256\",\"additionalParameters\":{}}',10),('38210044-91f7-49f3-9301-715c272fdc88',NULL,'password','3ab93c0b-6f95-450f-ac54-5b0b6c0e1fca',1663328464501,NULL,'{\"value\":\"+JUTCPvf3wnoxQDbXJHW64+rrCxc/jgADKZr7j8hmhrIG92WztnXE7zzVAqR90tB6SPx3xjdKzVy1eqoC3EAwQ==\",\"salt\":\"eJMrMWgAOdS/pcRQzJ50JA==\",\"additionalParameters\":{}}','{\"hashIterations\":27500,\"algorithm\":\"pbkdf2-sha256\",\"additionalParameters\":{}}',10),('488ee630-8547-43d9-93d9-9c531b21a83c',NULL,'password','eb662d55-d51a-42bf-83fb-95c709026e2e',1663328432720,NULL,'{\"value\":\"kBz4AnOaLpY1s4YFzC5z6+iJCD9HlR16rQM09vzQUVZttlIG5zp75BdU+syqRjzs1HeUXem1iHLI+gs+TGTi1g==\",\"salt\":\"Re6AyxjxP0xSNLaXRPV4kA==\",\"additionalParameters\":{}}','{\"hashIterations\":27500,\"algorithm\":\"pbkdf2-sha256\",\"additionalParameters\":{}}',10),('577d60c3-822f-4fee-aa99-d116bef8fd25',NULL,'password','8ccc547c-7943-445e-b09e-1583e761e7ba',1663328510489,NULL,'{\"value\":\"cRgtYurzushyNjMi7CbLASPseyCeTSV0/rlClp8BP/Jn/3tAH6U4f+m3SUebULoFCPdhY9AWqUhfdTMXRpu/aw==\",\"salt\":\"YvEYPT7ZAeYrCFqZEWCRpQ==\",\"additionalParameters\":{}}','{\"hashIterations\":27500,\"algorithm\":\"pbkdf2-sha256\",\"additionalParameters\":{}}',10),('6f368a9f-68c2-44e1-b343-2c402e2016de',NULL,'password','9acd6e17-ed1e-4590-ba9c-e665fa6f375b',1663328597004,NULL,'{\"value\":\"1/A0T45y1ntXRoCOxCQ6k2PYEnweKSHYTZ5r1mgra5+oKrNztFHRALuCytfeSQAn9kIPo2UbBgat6Xarao/5Og==\",\"salt\":\"FDIK0Wuu25/y3ZjFGW5fWg==\",\"additionalParameters\":{}}','{\"hashIterations\":27500,\"algorithm\":\"pbkdf2-sha256\",\"additionalParameters\":{}}',10),('87aa4fbb-0f49-41c4-85ff-17b4c9660012',NULL,'password','565e9ddc-5b14-4d4b-9a5e-048d6990c501',1663328533315,NULL,'{\"value\":\"bVqggPIjfft4RLpDBP5afXL70eWrgwRS87Niy/Vth+A31ZgpWsY8FXTcONJFb9xxR2ciKNyfebSgR0nLygkhQQ==\",\"salt\":\"2XyVVkUhBnrPOCNcmUBbpw==\",\"additionalParameters\":{}}','{\"hashIterations\":27500,\"algorithm\":\"pbkdf2-sha256\",\"additionalParameters\":{}}',10),('9c23e7d0-81f2-4b02-a876-4032a20453b6',NULL,'password','35e5b878-abde-4350-a329-af8672c514c2',1663318342164,NULL,'{\"value\":\"ksrjtxprzM1Eb3h4ONILRx7mipT7Bg3CuAO+g99ssaNmJeBOuDVVUef9fXjefXREQjBr7yifwCFPwUzcsyiKng==\",\"salt\":\"JrKQVw+TxljFxH6k4Ggsww==\",\"additionalParameters\":{}}','{\"hashIterations\":27500,\"algorithm\":\"pbkdf2-sha256\",\"additionalParameters\":{}}',10),('b8de91b8-037d-443a-a385-628f4b8cdc3c',NULL,'password','a06c284b-4944-49bd-afb0-c899f733446e',1663328618514,NULL,'{\"value\":\"sFwwnE2BYkS3+iCnRnEuSHQQ6/bCzvDhTZT2APzkp02LXI2HEGbDCn/5H5AbK8I0NW2urChIpyBVzC1EMniXOA==\",\"salt\":\"AfW5bl2nPXVfojPbxnBQNw==\",\"additionalParameters\":{}}','{\"hashIterations\":27500,\"algorithm\":\"pbkdf2-sha256\",\"additionalParameters\":{}}',10),('cd10442b-7e86-4fef-bb48-672b34a01381',NULL,'password','a595d7a3-8ff1-45c0-a8e3-e8ad1c2e944a',1663328583994,NULL,'{\"value\":\"ULMux+Bidm3HWK1UJAQae6hcEOYuAoAh5cHup7eL0IQjtTecCefGxSIjN724lY9mqAKDuDCes+FBrZKxoT7j2w==\",\"salt\":\"2nS07UAHakAMXwxtI95ubw==\",\"additionalParameters\":{}}','{\"hashIterations\":27500,\"algorithm\":\"pbkdf2-sha256\",\"additionalParameters\":{}}',10),('dcbdf3af-8ce5-434a-a149-06fcf6dd451f',NULL,'password','f12649c3-3d0a-42ee-9e7e-e7b3cdfe5625',1663328404101,NULL,'{\"value\":\"Ajv7ZKBB3GkbqiUIxTV7rLxBWaQVIRkbYlDY+pjupgQWntSrB1T7hibhIu3Cd2XyWHBFvmL1o7LvSh3OKVqEXQ==\",\"salt\":\"6kvcGgPwseApuV+91mslww==\",\"additionalParameters\":{}}','{\"hashIterations\":27500,\"algorithm\":\"pbkdf2-sha256\",\"additionalParameters\":{}}',10),('ddd505a7-e9d4-4a5c-bb1b-746197710204',NULL,'password','5e1f7d10-4bb2-4699-9baf-bf7c682e120a',1663328354789,NULL,'{\"value\":\"TyToy6tkV+Tr6CdlwX+jzOKjK/vtOL1ayxOF1NxxJoyEiUqJoOLqtdr4N1C/GaIZk/tmPPV2cT8H+ZvzzXAQsQ==\",\"salt\":\"9giMtYFr3OW/xF5b3Uu7IA==\",\"additionalParameters\":{}}','{\"hashIterations\":27500,\"algorithm\":\"pbkdf2-sha256\",\"additionalParameters\":{}}',10);
/*!40000 ALTER TABLE `CREDENTIAL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DATABASECHANGELOG`
--

DROP TABLE IF EXISTS `DATABASECHANGELOG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DATABASECHANGELOG` (
  `ID` varchar(255) NOT NULL,
  `AUTHOR` varchar(255) NOT NULL,
  `FILENAME` varchar(255) NOT NULL,
  `DATEEXECUTED` datetime NOT NULL,
  `ORDEREXECUTED` int(11) NOT NULL,
  `EXECTYPE` varchar(10) NOT NULL,
  `MD5SUM` varchar(35) DEFAULT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `COMMENTS` varchar(255) DEFAULT NULL,
  `TAG` varchar(255) DEFAULT NULL,
  `LIQUIBASE` varchar(20) DEFAULT NULL,
  `CONTEXTS` varchar(255) DEFAULT NULL,
  `LABELS` varchar(255) DEFAULT NULL,
  `DEPLOYMENT_ID` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DATABASECHANGELOG`
--

LOCK TABLES `DATABASECHANGELOG` WRITE;
/*!40000 ALTER TABLE `DATABASECHANGELOG` DISABLE KEYS */;
INSERT INTO `DATABASECHANGELOG` (`ID`, `AUTHOR`, `FILENAME`, `DATEEXECUTED`, `ORDEREXECUTED`, `EXECTYPE`, `MD5SUM`, `DESCRIPTION`, `COMMENTS`, `TAG`, `LIQUIBASE`, `CONTEXTS`, `LABELS`, `DEPLOYMENT_ID`) VALUES ('1.0.0.Final-KEYCLOAK-5461','sthorger@redhat.com','META-INF/jpa-changelog-1.0.0.Final.xml','2022-09-16 08:51:21',1,'EXECUTED','7:4e70412f24a3f382c82183742ec79317','createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.0.0.Final-KEYCLOAK-5461','sthorger@redhat.com','META-INF/db2-jpa-changelog-1.0.0.Final.xml','2022-09-16 08:51:21',2,'MARK_RAN','7:cb16724583e9675711801c6875114f28','createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.1.0.Beta1','sthorger@redhat.com','META-INF/jpa-changelog-1.1.0.Beta1.xml','2022-09-16 08:51:21',3,'EXECUTED','7:0310eb8ba07cec616460794d42ade0fa','delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=CLIENT_ATTRIBUTES; createTable tableName=CLIENT_SESSION_NOTE; createTable tableName=APP_NODE_REGISTRATIONS; addColumn table...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.1.0.Final','sthorger@redhat.com','META-INF/jpa-changelog-1.1.0.Final.xml','2022-09-16 08:51:21',4,'EXECUTED','7:5d25857e708c3233ef4439df1f93f012','renameColumn newColumnName=EVENT_TIME, oldColumnName=TIME, tableName=EVENT_ENTITY','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.2.0.Beta1','psilva@redhat.com','META-INF/jpa-changelog-1.2.0.Beta1.xml','2022-09-16 08:51:22',5,'EXECUTED','7:c7a54a1041d58eb3817a4a883b4d4e84','delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.2.0.Beta1','psilva@redhat.com','META-INF/db2-jpa-changelog-1.2.0.Beta1.xml','2022-09-16 08:51:22',6,'MARK_RAN','7:2e01012df20974c1c2a605ef8afe25b7','delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.2.0.RC1','bburke@redhat.com','META-INF/jpa-changelog-1.2.0.CR1.xml','2022-09-16 08:51:23',7,'EXECUTED','7:0f08df48468428e0f30ee59a8ec01a41','delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.2.0.RC1','bburke@redhat.com','META-INF/db2-jpa-changelog-1.2.0.CR1.xml','2022-09-16 08:51:23',8,'MARK_RAN','7:a77ea2ad226b345e7d689d366f185c8c','delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.2.0.Final','keycloak','META-INF/jpa-changelog-1.2.0.Final.xml','2022-09-16 08:51:23',9,'EXECUTED','7:a3377a2059aefbf3b90ebb4c4cc8e2ab','update tableName=CLIENT; update tableName=CLIENT; update tableName=CLIENT','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.3.0','bburke@redhat.com','META-INF/jpa-changelog-1.3.0.xml','2022-09-16 08:51:24',10,'EXECUTED','7:04c1dbedc2aa3e9756d1a1668e003451','delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=ADMI...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.4.0','bburke@redhat.com','META-INF/jpa-changelog-1.4.0.xml','2022-09-16 08:51:24',11,'EXECUTED','7:36ef39ed560ad07062d956db861042ba','delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.4.0','bburke@redhat.com','META-INF/db2-jpa-changelog-1.4.0.xml','2022-09-16 08:51:24',12,'MARK_RAN','7:d909180b2530479a716d3f9c9eaea3d7','delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.5.0','bburke@redhat.com','META-INF/jpa-changelog-1.5.0.xml','2022-09-16 08:51:24',13,'EXECUTED','7:cf12b04b79bea5152f165eb41f3955f6','delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.6.1_from15','mposolda@redhat.com','META-INF/jpa-changelog-1.6.1.xml','2022-09-16 08:51:24',14,'EXECUTED','7:7e32c8f05c755e8675764e7d5f514509','addColumn tableName=REALM; addColumn tableName=KEYCLOAK_ROLE; addColumn tableName=CLIENT; createTable tableName=OFFLINE_USER_SESSION; createTable tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_US_SES_PK2, tableName=...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.6.1_from16-pre','mposolda@redhat.com','META-INF/jpa-changelog-1.6.1.xml','2022-09-16 08:51:24',15,'MARK_RAN','7:980ba23cc0ec39cab731ce903dd01291','delete tableName=OFFLINE_CLIENT_SESSION; delete tableName=OFFLINE_USER_SESSION','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.6.1_from16','mposolda@redhat.com','META-INF/jpa-changelog-1.6.1.xml','2022-09-16 08:51:24',16,'MARK_RAN','7:2fa220758991285312eb84f3b4ff5336','dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_US_SES_PK, tableName=OFFLINE_USER_SESSION; dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_CL_SES_PK, tableName=OFFLINE_CLIENT_SESSION; addColumn tableName=OFFLINE_USER_SESSION; update tableName=OF...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.6.1','mposolda@redhat.com','META-INF/jpa-changelog-1.6.1.xml','2022-09-16 08:51:24',17,'EXECUTED','7:d41d8cd98f00b204e9800998ecf8427e','empty','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.7.0','bburke@redhat.com','META-INF/jpa-changelog-1.7.0.xml','2022-09-16 08:51:25',18,'EXECUTED','7:91ace540896df890cc00a0490ee52bbc','createTable tableName=KEYCLOAK_GROUP; createTable tableName=GROUP_ROLE_MAPPING; createTable tableName=GROUP_ATTRIBUTE; createTable tableName=USER_GROUP_MEMBERSHIP; createTable tableName=REALM_DEFAULT_GROUPS; addColumn tableName=IDENTITY_PROVIDER; ...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.8.0','mposolda@redhat.com','META-INF/jpa-changelog-1.8.0.xml','2022-09-16 08:51:25',19,'EXECUTED','7:c31d1646dfa2618a9335c00e07f89f24','addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.8.0-2','keycloak','META-INF/jpa-changelog-1.8.0.xml','2022-09-16 08:51:25',20,'EXECUTED','7:df8bc21027a4f7cbbb01f6344e89ce07','dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.8.0','mposolda@redhat.com','META-INF/db2-jpa-changelog-1.8.0.xml','2022-09-16 08:51:25',21,'MARK_RAN','7:f987971fe6b37d963bc95fee2b27f8df','addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.8.0-2','keycloak','META-INF/db2-jpa-changelog-1.8.0.xml','2022-09-16 08:51:25',22,'MARK_RAN','7:df8bc21027a4f7cbbb01f6344e89ce07','dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.9.0','mposolda@redhat.com','META-INF/jpa-changelog-1.9.0.xml','2022-09-16 08:51:25',23,'EXECUTED','7:ed2dc7f799d19ac452cbcda56c929e47','update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=REALM; update tableName=REALM; customChange; dr...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.9.1','keycloak','META-INF/jpa-changelog-1.9.1.xml','2022-09-16 08:51:25',24,'EXECUTED','7:80b5db88a5dda36ece5f235be8757615','modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=PUBLIC_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.9.1','keycloak','META-INF/db2-jpa-changelog-1.9.1.xml','2022-09-16 08:51:25',25,'MARK_RAN','7:1437310ed1305a9b93f8848f301726ce','modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM','',NULL,'3.5.4',NULL,NULL,'3318279649'),('1.9.2','keycloak','META-INF/jpa-changelog-1.9.2.xml','2022-09-16 08:51:26',26,'EXECUTED','7:b82ffb34850fa0836be16deefc6a87c4','createIndex indexName=IDX_USER_EMAIL, tableName=USER_ENTITY; createIndex indexName=IDX_USER_ROLE_MAPPING, tableName=USER_ROLE_MAPPING; createIndex indexName=IDX_USER_GROUP_MAPPING, tableName=USER_GROUP_MEMBERSHIP; createIndex indexName=IDX_USER_CO...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('authz-2.0.0','psilva@redhat.com','META-INF/jpa-changelog-authz-2.0.0.xml','2022-09-16 08:51:26',27,'EXECUTED','7:9cc98082921330d8d9266decdd4bd658','createTable tableName=RESOURCE_SERVER; addPrimaryKey constraintName=CONSTRAINT_FARS, tableName=RESOURCE_SERVER; addUniqueConstraint constraintName=UK_AU8TT6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER; createTable tableName=RESOURCE_SERVER_RESOU...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('authz-2.5.1','psilva@redhat.com','META-INF/jpa-changelog-authz-2.5.1.xml','2022-09-16 08:51:26',28,'EXECUTED','7:03d64aeed9cb52b969bd30a7ac0db57e','update tableName=RESOURCE_SERVER_POLICY','',NULL,'3.5.4',NULL,NULL,'3318279649'),('2.1.0-KEYCLOAK-5461','bburke@redhat.com','META-INF/jpa-changelog-2.1.0.xml','2022-09-16 08:51:27',29,'EXECUTED','7:f1f9fd8710399d725b780f463c6b21cd','createTable tableName=BROKER_LINK; createTable tableName=FED_USER_ATTRIBUTE; createTable tableName=FED_USER_CONSENT; createTable tableName=FED_USER_CONSENT_ROLE; createTable tableName=FED_USER_CONSENT_PROT_MAPPER; createTable tableName=FED_USER_CR...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('2.2.0','bburke@redhat.com','META-INF/jpa-changelog-2.2.0.xml','2022-09-16 08:51:27',30,'EXECUTED','7:53188c3eb1107546e6f765835705b6c1','addColumn tableName=ADMIN_EVENT_ENTITY; createTable tableName=CREDENTIAL_ATTRIBUTE; createTable tableName=FED_CREDENTIAL_ATTRIBUTE; modifyDataType columnName=VALUE, tableName=CREDENTIAL; addForeignKeyConstraint baseTableName=FED_CREDENTIAL_ATTRIBU...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('2.3.0','bburke@redhat.com','META-INF/jpa-changelog-2.3.0.xml','2022-09-16 08:51:27',31,'EXECUTED','7:d6e6f3bc57a0c5586737d1351725d4d4','createTable tableName=FEDERATED_USER; addPrimaryKey constraintName=CONSTR_FEDERATED_USER, tableName=FEDERATED_USER; dropDefaultValue columnName=TOTP, tableName=USER_ENTITY; dropColumn columnName=TOTP, tableName=USER_ENTITY; addColumn tableName=IDE...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('2.4.0','bburke@redhat.com','META-INF/jpa-changelog-2.4.0.xml','2022-09-16 08:51:27',32,'EXECUTED','7:454d604fbd755d9df3fd9c6329043aa5','customChange','',NULL,'3.5.4',NULL,NULL,'3318279649'),('2.5.0','bburke@redhat.com','META-INF/jpa-changelog-2.5.0.xml','2022-09-16 08:51:27',33,'EXECUTED','7:57e98a3077e29caf562f7dbf80c72600','customChange; modifyDataType columnName=USER_ID, tableName=OFFLINE_USER_SESSION','',NULL,'3.5.4',NULL,NULL,'3318279649'),('2.5.0-unicode-oracle','hmlnarik@redhat.com','META-INF/jpa-changelog-2.5.0.xml','2022-09-16 08:51:27',34,'MARK_RAN','7:e4c7e8f2256210aee71ddc42f538b57a','modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('2.5.0-unicode-other-dbs','hmlnarik@redhat.com','META-INF/jpa-changelog-2.5.0.xml','2022-09-16 08:51:28',35,'EXECUTED','7:09a43c97e49bc626460480aa1379b522','modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('2.5.0-duplicate-email-support','slawomir@dabek.name','META-INF/jpa-changelog-2.5.0.xml','2022-09-16 08:51:28',36,'EXECUTED','7:26bfc7c74fefa9126f2ce702fb775553','addColumn tableName=REALM','',NULL,'3.5.4',NULL,NULL,'3318279649'),('2.5.0-unique-group-names','hmlnarik@redhat.com','META-INF/jpa-changelog-2.5.0.xml','2022-09-16 08:51:28',37,'EXECUTED','7:a161e2ae671a9020fff61e996a207377','addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP','',NULL,'3.5.4',NULL,NULL,'3318279649'),('2.5.1','bburke@redhat.com','META-INF/jpa-changelog-2.5.1.xml','2022-09-16 08:51:28',38,'EXECUTED','7:37fc1781855ac5388c494f1442b3f717','addColumn tableName=FED_USER_CONSENT','',NULL,'3.5.4',NULL,NULL,'3318279649'),('3.0.0','bburke@redhat.com','META-INF/jpa-changelog-3.0.0.xml','2022-09-16 08:51:28',39,'EXECUTED','7:13a27db0dae6049541136adad7261d27','addColumn tableName=IDENTITY_PROVIDER','',NULL,'3.5.4',NULL,NULL,'3318279649'),('3.2.0-fix','keycloak','META-INF/jpa-changelog-3.2.0.xml','2022-09-16 08:51:28',40,'MARK_RAN','7:550300617e3b59e8af3a6294df8248a3','addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS','',NULL,'3.5.4',NULL,NULL,'3318279649'),('3.2.0-fix-with-keycloak-5416','keycloak','META-INF/jpa-changelog-3.2.0.xml','2022-09-16 08:51:28',41,'MARK_RAN','7:e3a9482b8931481dc2772a5c07c44f17','dropIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS; addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS; createIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS','',NULL,'3.5.4',NULL,NULL,'3318279649'),('3.2.0-fix-offline-sessions','hmlnarik','META-INF/jpa-changelog-3.2.0.xml','2022-09-16 08:51:28',42,'EXECUTED','7:72b07d85a2677cb257edb02b408f332d','customChange','',NULL,'3.5.4',NULL,NULL,'3318279649'),('3.2.0-fixed','keycloak','META-INF/jpa-changelog-3.2.0.xml','2022-09-16 08:51:28',43,'EXECUTED','7:a72a7858967bd414835d19e04d880312','addColumn tableName=REALM; dropPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_PK2, tableName=OFFLINE_CLIENT_SESSION; dropColumn columnName=CLIENT_SESSION_ID, tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_P...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('3.3.0','keycloak','META-INF/jpa-changelog-3.3.0.xml','2022-09-16 08:51:28',44,'EXECUTED','7:94edff7cf9ce179e7e85f0cd78a3cf2c','addColumn tableName=USER_ENTITY','',NULL,'3.5.4',NULL,NULL,'3318279649'),('authz-3.4.0.CR1-resource-server-pk-change-part1','glavoie@gmail.com','META-INF/jpa-changelog-authz-3.4.0.CR1.xml','2022-09-16 08:51:29',45,'EXECUTED','7:6a48ce645a3525488a90fbf76adf3bb3','addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_RESOURCE; addColumn tableName=RESOURCE_SERVER_SCOPE','',NULL,'3.5.4',NULL,NULL,'3318279649'),('authz-3.4.0.CR1-resource-server-pk-change-part2-KEYCLOAK-6095','hmlnarik@redhat.com','META-INF/jpa-changelog-authz-3.4.0.CR1.xml','2022-09-16 08:51:29',46,'EXECUTED','7:e64b5dcea7db06077c6e57d3b9e5ca14','customChange','',NULL,'3.5.4',NULL,NULL,'3318279649'),('authz-3.4.0.CR1-resource-server-pk-change-part3-fixed','glavoie@gmail.com','META-INF/jpa-changelog-authz-3.4.0.CR1.xml','2022-09-16 08:51:29',47,'MARK_RAN','7:fd8cf02498f8b1e72496a20afc75178c','dropIndex indexName=IDX_RES_SERV_POL_RES_SERV, tableName=RESOURCE_SERVER_POLICY; dropIndex indexName=IDX_RES_SRV_RES_RES_SRV, tableName=RESOURCE_SERVER_RESOURCE; dropIndex indexName=IDX_RES_SRV_SCOPE_RES_SRV, tableName=RESOURCE_SERVER_SCOPE','',NULL,'3.5.4',NULL,NULL,'3318279649'),('authz-3.4.0.CR1-resource-server-pk-change-part3-fixed-nodropindex','glavoie@gmail.com','META-INF/jpa-changelog-authz-3.4.0.CR1.xml','2022-09-16 08:51:29',48,'EXECUTED','7:542794f25aa2b1fbabb7e577d6646319','addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_POLICY; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_RESOURCE; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, ...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('authn-3.4.0.CR1-refresh-token-max-reuse','glavoie@gmail.com','META-INF/jpa-changelog-authz-3.4.0.CR1.xml','2022-09-16 08:51:29',49,'EXECUTED','7:edad604c882df12f74941dac3cc6d650','addColumn tableName=REALM','',NULL,'3.5.4',NULL,NULL,'3318279649'),('3.4.0','keycloak','META-INF/jpa-changelog-3.4.0.xml','2022-09-16 08:51:29',50,'EXECUTED','7:0f88b78b7b46480eb92690cbf5e44900','addPrimaryKey constraintName=CONSTRAINT_REALM_DEFAULT_ROLES, tableName=REALM_DEFAULT_ROLES; addPrimaryKey constraintName=CONSTRAINT_COMPOSITE_ROLE, tableName=COMPOSITE_ROLE; addPrimaryKey constraintName=CONSTR_REALM_DEFAULT_GROUPS, tableName=REALM...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('3.4.0-KEYCLOAK-5230','hmlnarik@redhat.com','META-INF/jpa-changelog-3.4.0.xml','2022-09-16 08:51:30',51,'EXECUTED','7:d560e43982611d936457c327f872dd59','createIndex indexName=IDX_FU_ATTRIBUTE, tableName=FED_USER_ATTRIBUTE; createIndex indexName=IDX_FU_CONSENT, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CONSENT_RU, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CREDENTIAL, t...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('3.4.1','psilva@redhat.com','META-INF/jpa-changelog-3.4.1.xml','2022-09-16 08:51:30',52,'EXECUTED','7:c155566c42b4d14ef07059ec3b3bbd8e','modifyDataType columnName=VALUE, tableName=CLIENT_ATTRIBUTES','',NULL,'3.5.4',NULL,NULL,'3318279649'),('3.4.2','keycloak','META-INF/jpa-changelog-3.4.2.xml','2022-09-16 08:51:30',53,'EXECUTED','7:b40376581f12d70f3c89ba8ddf5b7dea','update tableName=REALM','',NULL,'3.5.4',NULL,NULL,'3318279649'),('3.4.2-KEYCLOAK-5172','mkanis@redhat.com','META-INF/jpa-changelog-3.4.2.xml','2022-09-16 08:51:30',54,'EXECUTED','7:a1132cc395f7b95b3646146c2e38f168','update tableName=CLIENT','',NULL,'3.5.4',NULL,NULL,'3318279649'),('4.0.0-KEYCLOAK-6335','bburke@redhat.com','META-INF/jpa-changelog-4.0.0.xml','2022-09-16 08:51:30',55,'EXECUTED','7:d8dc5d89c789105cfa7ca0e82cba60af','createTable tableName=CLIENT_AUTH_FLOW_BINDINGS; addPrimaryKey constraintName=C_CLI_FLOW_BIND, tableName=CLIENT_AUTH_FLOW_BINDINGS','',NULL,'3.5.4',NULL,NULL,'3318279649'),('4.0.0-CLEANUP-UNUSED-TABLE','bburke@redhat.com','META-INF/jpa-changelog-4.0.0.xml','2022-09-16 08:51:30',56,'EXECUTED','7:7822e0165097182e8f653c35517656a3','dropTable tableName=CLIENT_IDENTITY_PROV_MAPPING','',NULL,'3.5.4',NULL,NULL,'3318279649'),('4.0.0-KEYCLOAK-6228','bburke@redhat.com','META-INF/jpa-changelog-4.0.0.xml','2022-09-16 08:51:30',57,'EXECUTED','7:c6538c29b9c9a08f9e9ea2de5c2b6375','dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; dropNotNullConstraint columnName=CLIENT_ID, tableName=USER_CONSENT; addColumn tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHO...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('4.0.0-KEYCLOAK-5579-fixed','mposolda@redhat.com','META-INF/jpa-changelog-4.0.0.xml','2022-09-16 08:51:31',58,'EXECUTED','7:6d4893e36de22369cf73bcb051ded875','dropForeignKeyConstraint baseTableName=CLIENT_TEMPLATE_ATTRIBUTES, constraintName=FK_CL_TEMPL_ATTR_TEMPL; renameTable newTableName=CLIENT_SCOPE_ATTRIBUTES, oldTableName=CLIENT_TEMPLATE_ATTRIBUTES; renameColumn newColumnName=SCOPE_ID, oldColumnName...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('authz-4.0.0.CR1','psilva@redhat.com','META-INF/jpa-changelog-authz-4.0.0.CR1.xml','2022-09-16 08:51:31',59,'EXECUTED','7:57960fc0b0f0dd0563ea6f8b2e4a1707','createTable tableName=RESOURCE_SERVER_PERM_TICKET; addPrimaryKey constraintName=CONSTRAINT_FAPMT, tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRHO213XCX4WNKOG82SSPMT...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('authz-4.0.0.Beta3','psilva@redhat.com','META-INF/jpa-changelog-authz-4.0.0.Beta3.xml','2022-09-16 08:51:31',60,'EXECUTED','7:2b4b8bff39944c7097977cc18dbceb3b','addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRPO2128CX4WNKOG82SSRFY, referencedTableName=RESOURCE_SERVER_POLICY','',NULL,'3.5.4',NULL,NULL,'3318279649'),('authz-4.2.0.Final','mhajas@redhat.com','META-INF/jpa-changelog-authz-4.2.0.Final.xml','2022-09-16 08:51:31',61,'EXECUTED','7:2aa42a964c59cd5b8ca9822340ba33a8','createTable tableName=RESOURCE_URIS; addForeignKeyConstraint baseTableName=RESOURCE_URIS, constraintName=FK_RESOURCE_SERVER_URIS, referencedTableName=RESOURCE_SERVER_RESOURCE; customChange; dropColumn columnName=URI, tableName=RESOURCE_SERVER_RESO...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('authz-4.2.0.Final-KEYCLOAK-9944','hmlnarik@redhat.com','META-INF/jpa-changelog-authz-4.2.0.Final.xml','2022-09-16 08:51:31',62,'EXECUTED','7:9ac9e58545479929ba23f4a3087a0346','addPrimaryKey constraintName=CONSTRAINT_RESOUR_URIS_PK, tableName=RESOURCE_URIS','',NULL,'3.5.4',NULL,NULL,'3318279649'),('4.2.0-KEYCLOAK-6313','wadahiro@gmail.com','META-INF/jpa-changelog-4.2.0.xml','2022-09-16 08:51:31',63,'EXECUTED','7:14d407c35bc4fe1976867756bcea0c36','addColumn tableName=REQUIRED_ACTION_PROVIDER','',NULL,'3.5.4',NULL,NULL,'3318279649'),('4.3.0-KEYCLOAK-7984','wadahiro@gmail.com','META-INF/jpa-changelog-4.3.0.xml','2022-09-16 08:51:31',64,'EXECUTED','7:241a8030c748c8548e346adee548fa93','update tableName=REQUIRED_ACTION_PROVIDER','',NULL,'3.5.4',NULL,NULL,'3318279649'),('4.6.0-KEYCLOAK-7950','psilva@redhat.com','META-INF/jpa-changelog-4.6.0.xml','2022-09-16 08:51:31',65,'EXECUTED','7:7d3182f65a34fcc61e8d23def037dc3f','update tableName=RESOURCE_SERVER_RESOURCE','',NULL,'3.5.4',NULL,NULL,'3318279649'),('4.6.0-KEYCLOAK-8377','keycloak','META-INF/jpa-changelog-4.6.0.xml','2022-09-16 08:51:32',66,'EXECUTED','7:b30039e00a0b9715d430d1b0636728fa','createTable tableName=ROLE_ATTRIBUTE; addPrimaryKey constraintName=CONSTRAINT_ROLE_ATTRIBUTE_PK, tableName=ROLE_ATTRIBUTE; addForeignKeyConstraint baseTableName=ROLE_ATTRIBUTE, constraintName=FK_ROLE_ATTRIBUTE_ID, referencedTableName=KEYCLOAK_ROLE...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('4.6.0-KEYCLOAK-8555','gideonray@gmail.com','META-INF/jpa-changelog-4.6.0.xml','2022-09-16 08:51:32',67,'EXECUTED','7:3797315ca61d531780f8e6f82f258159','createIndex indexName=IDX_COMPONENT_PROVIDER_TYPE, tableName=COMPONENT','',NULL,'3.5.4',NULL,NULL,'3318279649'),('4.7.0-KEYCLOAK-1267','sguilhen@redhat.com','META-INF/jpa-changelog-4.7.0.xml','2022-09-16 08:51:32',68,'EXECUTED','7:c7aa4c8d9573500c2d347c1941ff0301','addColumn tableName=REALM','',NULL,'3.5.4',NULL,NULL,'3318279649'),('4.7.0-KEYCLOAK-7275','keycloak','META-INF/jpa-changelog-4.7.0.xml','2022-09-16 08:51:32',69,'EXECUTED','7:b207faee394fc074a442ecd42185a5dd','renameColumn newColumnName=CREATED_ON, oldColumnName=LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION; addNotNullConstraint columnName=CREATED_ON, tableName=OFFLINE_USER_SESSION; addColumn tableName=OFFLINE_USER_SESSION; customChange; createIn...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('4.8.0-KEYCLOAK-8835','sguilhen@redhat.com','META-INF/jpa-changelog-4.8.0.xml','2022-09-16 08:51:32',70,'EXECUTED','7:ab9a9762faaba4ddfa35514b212c4922','addNotNullConstraint columnName=SSO_MAX_LIFESPAN_REMEMBER_ME, tableName=REALM; addNotNullConstraint columnName=SSO_IDLE_TIMEOUT_REMEMBER_ME, tableName=REALM','',NULL,'3.5.4',NULL,NULL,'3318279649'),('authz-7.0.0-KEYCLOAK-10443','psilva@redhat.com','META-INF/jpa-changelog-authz-7.0.0.xml','2022-09-16 08:51:32',71,'EXECUTED','7:b9710f74515a6ccb51b72dc0d19df8c4','addColumn tableName=RESOURCE_SERVER','',NULL,'3.5.4',NULL,NULL,'3318279649'),('8.0.0-adding-credential-columns','keycloak','META-INF/jpa-changelog-8.0.0.xml','2022-09-16 08:51:32',72,'EXECUTED','7:ec9707ae4d4f0b7452fee20128083879','addColumn tableName=CREDENTIAL; addColumn tableName=FED_USER_CREDENTIAL','',NULL,'3.5.4',NULL,NULL,'3318279649'),('8.0.0-updating-credential-data-not-oracle-fixed','keycloak','META-INF/jpa-changelog-8.0.0.xml','2022-09-16 08:51:32',73,'EXECUTED','7:3979a0ae07ac465e920ca696532fc736','update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL','',NULL,'3.5.4',NULL,NULL,'3318279649'),('8.0.0-updating-credential-data-oracle-fixed','keycloak','META-INF/jpa-changelog-8.0.0.xml','2022-09-16 08:51:32',74,'MARK_RAN','7:5abfde4c259119d143bd2fbf49ac2bca','update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL','',NULL,'3.5.4',NULL,NULL,'3318279649'),('8.0.0-credential-cleanup-fixed','keycloak','META-INF/jpa-changelog-8.0.0.xml','2022-09-16 08:51:32',75,'EXECUTED','7:b48da8c11a3d83ddd6b7d0c8c2219345','dropDefaultValue columnName=COUNTER, tableName=CREDENTIAL; dropDefaultValue columnName=DIGITS, tableName=CREDENTIAL; dropDefaultValue columnName=PERIOD, tableName=CREDENTIAL; dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; dropColumn ...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('8.0.0-resource-tag-support','keycloak','META-INF/jpa-changelog-8.0.0.xml','2022-09-16 08:51:32',76,'EXECUTED','7:a73379915c23bfad3e8f5c6d5c0aa4bd','addColumn tableName=MIGRATION_MODEL; createIndex indexName=IDX_UPDATE_TIME, tableName=MIGRATION_MODEL','',NULL,'3.5.4',NULL,NULL,'3318279649'),('9.0.0-always-display-client','keycloak','META-INF/jpa-changelog-9.0.0.xml','2022-09-16 08:51:32',77,'EXECUTED','7:39e0073779aba192646291aa2332493d','addColumn tableName=CLIENT','',NULL,'3.5.4',NULL,NULL,'3318279649'),('9.0.0-drop-constraints-for-column-increase','keycloak','META-INF/jpa-changelog-9.0.0.xml','2022-09-16 08:51:32',78,'MARK_RAN','7:81f87368f00450799b4bf42ea0b3ec34','dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5PMT, tableName=RESOURCE_SERVER_PERM_TICKET; dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER_RESOURCE; dropPrimaryKey constraintName=CONSTRAINT_O...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('9.0.0-increase-column-size-federated-fk','keycloak','META-INF/jpa-changelog-9.0.0.xml','2022-09-16 08:51:32',79,'EXECUTED','7:20b37422abb9fb6571c618148f013a15','modifyDataType columnName=CLIENT_ID, tableName=FED_USER_CONSENT; modifyDataType columnName=CLIENT_REALM_CONSTRAINT, tableName=KEYCLOAK_ROLE; modifyDataType columnName=OWNER, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=CLIENT_ID, ta...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('9.0.0-recreate-constraints-after-column-increase','keycloak','META-INF/jpa-changelog-9.0.0.xml','2022-09-16 08:51:32',80,'MARK_RAN','7:1970bb6cfb5ee800736b95ad3fb3c78a','addNotNullConstraint columnName=CLIENT_ID, tableName=OFFLINE_CLIENT_SESSION; addNotNullConstraint columnName=OWNER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNullConstraint columnName=REQUESTER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNull...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('9.0.1-add-index-to-client.client_id','keycloak','META-INF/jpa-changelog-9.0.1.xml','2022-09-16 08:51:32',81,'EXECUTED','7:45d9b25fc3b455d522d8dcc10a0f4c80','createIndex indexName=IDX_CLIENT_ID, tableName=CLIENT','',NULL,'3.5.4',NULL,NULL,'3318279649'),('9.0.1-KEYCLOAK-12579-drop-constraints','keycloak','META-INF/jpa-changelog-9.0.1.xml','2022-09-16 08:51:32',82,'MARK_RAN','7:890ae73712bc187a66c2813a724d037f','dropUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP','',NULL,'3.5.4',NULL,NULL,'3318279649'),('9.0.1-KEYCLOAK-12579-add-not-null-constraint','keycloak','META-INF/jpa-changelog-9.0.1.xml','2022-09-16 08:51:32',83,'EXECUTED','7:0a211980d27fafe3ff50d19a3a29b538','addNotNullConstraint columnName=PARENT_GROUP, tableName=KEYCLOAK_GROUP','',NULL,'3.5.4',NULL,NULL,'3318279649'),('9.0.1-KEYCLOAK-12579-recreate-constraints','keycloak','META-INF/jpa-changelog-9.0.1.xml','2022-09-16 08:51:32',84,'MARK_RAN','7:a161e2ae671a9020fff61e996a207377','addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP','',NULL,'3.5.4',NULL,NULL,'3318279649'),('9.0.1-add-index-to-events','keycloak','META-INF/jpa-changelog-9.0.1.xml','2022-09-16 08:51:32',85,'EXECUTED','7:01c49302201bdf815b0a18d1f98a55dc','createIndex indexName=IDX_EVENT_TIME, tableName=EVENT_ENTITY','',NULL,'3.5.4',NULL,NULL,'3318279649'),('map-remove-ri','keycloak','META-INF/jpa-changelog-11.0.0.xml','2022-09-16 08:51:32',86,'EXECUTED','7:3dace6b144c11f53f1ad2c0361279b86','dropForeignKeyConstraint baseTableName=REALM, constraintName=FK_TRAF444KK6QRKMS7N56AIWQ5Y; dropForeignKeyConstraint baseTableName=KEYCLOAK_ROLE, constraintName=FK_KJHO5LE2C0RAL09FL8CM9WFW9','',NULL,'3.5.4',NULL,NULL,'3318279649'),('map-remove-ri','keycloak','META-INF/jpa-changelog-12.0.0.xml','2022-09-16 08:51:32',87,'EXECUTED','7:578d0b92077eaf2ab95ad0ec087aa903','dropForeignKeyConstraint baseTableName=REALM_DEFAULT_GROUPS, constraintName=FK_DEF_GROUPS_GROUP; dropForeignKeyConstraint baseTableName=REALM_DEFAULT_ROLES, constraintName=FK_H4WPD7W4HSOOLNI3H0SW7BTJE; dropForeignKeyConstraint baseTableName=CLIENT...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('12.1.0-add-realm-localization-table','keycloak','META-INF/jpa-changelog-12.0.0.xml','2022-09-16 08:51:32',88,'EXECUTED','7:c95abe90d962c57a09ecaee57972835d','createTable tableName=REALM_LOCALIZATIONS; addPrimaryKey tableName=REALM_LOCALIZATIONS','',NULL,'3.5.4',NULL,NULL,'3318279649'),('default-roles','keycloak','META-INF/jpa-changelog-13.0.0.xml','2022-09-16 08:51:32',89,'EXECUTED','7:f1313bcc2994a5c4dc1062ed6d8282d3','addColumn tableName=REALM; customChange','',NULL,'3.5.4',NULL,NULL,'3318279649'),('default-roles-cleanup','keycloak','META-INF/jpa-changelog-13.0.0.xml','2022-09-16 08:51:32',90,'EXECUTED','7:90d763b52eaffebefbcbde55f269508b','dropTable tableName=REALM_DEFAULT_ROLES; dropTable tableName=CLIENT_DEFAULT_ROLES','',NULL,'3.5.4',NULL,NULL,'3318279649'),('13.0.0-KEYCLOAK-16844','keycloak','META-INF/jpa-changelog-13.0.0.xml','2022-09-16 08:51:32',91,'EXECUTED','7:d554f0cb92b764470dccfa5e0014a7dd','createIndex indexName=IDX_OFFLINE_USS_PRELOAD, tableName=OFFLINE_USER_SESSION','',NULL,'3.5.4',NULL,NULL,'3318279649'),('map-remove-ri-13.0.0','keycloak','META-INF/jpa-changelog-13.0.0.xml','2022-09-16 08:51:32',92,'EXECUTED','7:73193e3ab3c35cf0f37ccea3bf783764','dropForeignKeyConstraint baseTableName=DEFAULT_CLIENT_SCOPE, constraintName=FK_R_DEF_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SCOPE_CLIENT, constraintName=FK_C_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SC...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('13.0.0-KEYCLOAK-17992-drop-constraints','keycloak','META-INF/jpa-changelog-13.0.0.xml','2022-09-16 08:51:32',93,'MARK_RAN','7:90a1e74f92e9cbaa0c5eab80b8a037f3','dropPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CLSCOPE_CL, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CL_CLSCOPE, tableName=CLIENT_SCOPE_CLIENT','',NULL,'3.5.4',NULL,NULL,'3318279649'),('13.0.0-increase-column-size-federated','keycloak','META-INF/jpa-changelog-13.0.0.xml','2022-09-16 08:51:33',94,'EXECUTED','7:5b9248f29cd047c200083cc6d8388b16','modifyDataType columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; modifyDataType columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT','',NULL,'3.5.4',NULL,NULL,'3318279649'),('13.0.0-KEYCLOAK-17992-recreate-constraints','keycloak','META-INF/jpa-changelog-13.0.0.xml','2022-09-16 08:51:33',95,'MARK_RAN','7:64db59e44c374f13955489e8990d17a1','addNotNullConstraint columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; addNotNullConstraint columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT; addPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; createIndex indexName=...','',NULL,'3.5.4',NULL,NULL,'3318279649'),('json-string-accomodation-fixed','keycloak','META-INF/jpa-changelog-13.0.0.xml','2022-09-16 08:51:33',96,'EXECUTED','7:329a578cdb43262fff975f0a7f6cda60','addColumn tableName=REALM_ATTRIBUTE; update tableName=REALM_ATTRIBUTE; dropColumn columnName=VALUE, tableName=REALM_ATTRIBUTE; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=REALM_ATTRIBUTE','',NULL,'3.5.4',NULL,NULL,'3318279649'),('14.0.0-KEYCLOAK-11019','keycloak','META-INF/jpa-changelog-14.0.0.xml','2022-09-16 08:51:33',97,'EXECUTED','7:fae0de241ac0fd0bbc2b380b85e4f567','createIndex indexName=IDX_OFFLINE_CSS_PRELOAD, tableName=OFFLINE_CLIENT_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USER, tableName=OFFLINE_USER_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USERSESS, tableName=OFFLINE_USER_SESSION','',NULL,'3.5.4',NULL,NULL,'3318279649'),('14.0.0-KEYCLOAK-18286','keycloak','META-INF/jpa-changelog-14.0.0.xml','2022-09-16 08:51:33',98,'MARK_RAN','7:075d54e9180f49bb0c64ca4218936e81','createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES','',NULL,'3.5.4',NULL,NULL,'3318279649'),('14.0.0-KEYCLOAK-18286-revert','keycloak','META-INF/jpa-changelog-14.0.0.xml','2022-09-16 08:51:33',99,'MARK_RAN','7:06499836520f4f6b3d05e35a59324910','dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES','',NULL,'3.5.4',NULL,NULL,'3318279649'),('14.0.0-KEYCLOAK-18286-supported-dbs','keycloak','META-INF/jpa-changelog-14.0.0.xml','2022-09-16 08:51:33',100,'EXECUTED','7:b558ad47ea0e4d3c3514225a49cc0d65','createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES','',NULL,'3.5.4',NULL,NULL,'3318279649'),('14.0.0-KEYCLOAK-18286-unsupported-dbs','keycloak','META-INF/jpa-changelog-14.0.0.xml','2022-09-16 08:51:33',101,'MARK_RAN','7:3d2b23076e59c6f70bae703aa01be35b','createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES','',NULL,'3.5.4',NULL,NULL,'3318279649'),('KEYCLOAK-17267-add-index-to-user-attributes','keycloak','META-INF/jpa-changelog-14.0.0.xml','2022-09-16 08:51:33',102,'EXECUTED','7:1a7f28ff8d9e53aeb879d76ea3d9341a','createIndex indexName=IDX_USER_ATTRIBUTE_NAME, tableName=USER_ATTRIBUTE','',NULL,'3.5.4',NULL,NULL,'3318279649'),('KEYCLOAK-18146-add-saml-art-binding-identifier','keycloak','META-INF/jpa-changelog-14.0.0.xml','2022-09-16 08:51:33',103,'EXECUTED','7:2fd554456fed4a82c698c555c5b751b6','customChange','',NULL,'3.5.4',NULL,NULL,'3318279649'),('15.0.0-KEYCLOAK-18467','keycloak','META-INF/jpa-changelog-15.0.0.xml','2022-09-16 08:51:33',104,'EXECUTED','7:b06356d66c2790ecc2ae54ba0458397a','addColumn tableName=REALM_LOCALIZATIONS; update tableName=REALM_LOCALIZATIONS; dropColumn columnName=TEXTS, tableName=REALM_LOCALIZATIONS; renameColumn newColumnName=TEXTS, oldColumnName=TEXTS_NEW, tableName=REALM_LOCALIZATIONS; addNotNullConstrai...','',NULL,'3.5.4',NULL,NULL,'3318279649');
/*!40000 ALTER TABLE `DATABASECHANGELOG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DATABASECHANGELOGLOCK`
--

DROP TABLE IF EXISTS `DATABASECHANGELOGLOCK`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DATABASECHANGELOGLOCK` (
  `ID` int(11) NOT NULL,
  `LOCKED` bit(1) NOT NULL,
  `LOCKGRANTED` datetime DEFAULT NULL,
  `LOCKEDBY` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DATABASECHANGELOGLOCK`
--

LOCK TABLES `DATABASECHANGELOGLOCK` WRITE;
/*!40000 ALTER TABLE `DATABASECHANGELOGLOCK` DISABLE KEYS */;
INSERT INTO `DATABASECHANGELOGLOCK` (`ID`, `LOCKED`, `LOCKGRANTED`, `LOCKEDBY`) VALUES (1,_binary '\0',NULL,NULL),(1000,_binary '\0',NULL,NULL),(1001,_binary '\0',NULL,NULL);
/*!40000 ALTER TABLE `DATABASECHANGELOGLOCK` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DEFAULT_CLIENT_SCOPE`
--

DROP TABLE IF EXISTS `DEFAULT_CLIENT_SCOPE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DEFAULT_CLIENT_SCOPE` (
  `REALM_ID` varchar(36) NOT NULL,
  `SCOPE_ID` varchar(36) NOT NULL,
  `DEFAULT_SCOPE` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`REALM_ID`,`SCOPE_ID`),
  KEY `IDX_DEFCLS_REALM` (`REALM_ID`),
  KEY `IDX_DEFCLS_SCOPE` (`SCOPE_ID`),
  CONSTRAINT `FK_R_DEF_CLI_SCOPE_REALM` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DEFAULT_CLIENT_SCOPE`
--

LOCK TABLES `DEFAULT_CLIENT_SCOPE` WRITE;
/*!40000 ALTER TABLE `DEFAULT_CLIENT_SCOPE` DISABLE KEYS */;
INSERT INTO `DEFAULT_CLIENT_SCOPE` (`REALM_ID`, `SCOPE_ID`, `DEFAULT_SCOPE`) VALUES ('master','01be032d-9117-4d3b-acce-7ccae55abbfe',_binary ''),('master','157f0c24-d0e0-4ea6-b840-9fbea43c2c2e',_binary '\0'),('master','16991a6a-816c-43aa-b71f-9a1d2ffe691e',_binary ''),('master','1b9a41a9-bf24-4613-b7e7-996da1248bdd',_binary ''),('master','45469fff-d615-403d-ac6e-a9322b9631be',_binary ''),('master','89c6dee1-882b-4c3d-bc83-5e1c69936655',_binary ''),('master','98cc39a1-eba6-4e23-ba51-b91bf9226e14',_binary '\0'),('master','c55c237e-208f-4046-81ab-849ce6c10019',_binary '\0'),('master','e5c86d50-ab1c-4603-9155-861be9495fbe',_binary '\0');
/*!40000 ALTER TABLE `DEFAULT_CLIENT_SCOPE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EVENT_ENTITY`
--

DROP TABLE IF EXISTS `EVENT_ENTITY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EVENT_ENTITY` (
  `ID` varchar(36) NOT NULL,
  `CLIENT_ID` varchar(255) DEFAULT NULL,
  `DETAILS_JSON` varchar(2550) DEFAULT NULL,
  `ERROR` varchar(255) DEFAULT NULL,
  `IP_ADDRESS` varchar(255) DEFAULT NULL,
  `REALM_ID` varchar(255) DEFAULT NULL,
  `SESSION_ID` varchar(255) DEFAULT NULL,
  `EVENT_TIME` bigint(20) DEFAULT NULL,
  `TYPE` varchar(255) DEFAULT NULL,
  `USER_ID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_EVENT_TIME` (`REALM_ID`,`EVENT_TIME`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EVENT_ENTITY`
--

LOCK TABLES `EVENT_ENTITY` WRITE;
/*!40000 ALTER TABLE `EVENT_ENTITY` DISABLE KEYS */;
/*!40000 ALTER TABLE `EVENT_ENTITY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FEDERATED_IDENTITY`
--

DROP TABLE IF EXISTS `FEDERATED_IDENTITY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FEDERATED_IDENTITY` (
  `IDENTITY_PROVIDER` varchar(255) NOT NULL,
  `REALM_ID` varchar(36) DEFAULT NULL,
  `FEDERATED_USER_ID` varchar(255) DEFAULT NULL,
  `FEDERATED_USERNAME` varchar(255) DEFAULT NULL,
  `TOKEN` text,
  `USER_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`IDENTITY_PROVIDER`,`USER_ID`),
  KEY `IDX_FEDIDENTITY_USER` (`USER_ID`),
  KEY `IDX_FEDIDENTITY_FEDUSER` (`FEDERATED_USER_ID`),
  CONSTRAINT `FK404288B92EF007A6` FOREIGN KEY (`USER_ID`) REFERENCES `USER_ENTITY` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FEDERATED_IDENTITY`
--

LOCK TABLES `FEDERATED_IDENTITY` WRITE;
/*!40000 ALTER TABLE `FEDERATED_IDENTITY` DISABLE KEYS */;
/*!40000 ALTER TABLE `FEDERATED_IDENTITY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FEDERATED_USER`
--

DROP TABLE IF EXISTS `FEDERATED_USER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FEDERATED_USER` (
  `ID` varchar(255) NOT NULL,
  `STORAGE_PROVIDER_ID` varchar(255) DEFAULT NULL,
  `REALM_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FEDERATED_USER`
--

LOCK TABLES `FEDERATED_USER` WRITE;
/*!40000 ALTER TABLE `FEDERATED_USER` DISABLE KEYS */;
/*!40000 ALTER TABLE `FEDERATED_USER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FED_USER_ATTRIBUTE`
--

DROP TABLE IF EXISTS `FED_USER_ATTRIBUTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FED_USER_ATTRIBUTE` (
  `ID` varchar(36) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `USER_ID` varchar(255) NOT NULL,
  `REALM_ID` varchar(36) NOT NULL,
  `STORAGE_PROVIDER_ID` varchar(36) DEFAULT NULL,
  `VALUE` varchar(2024) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_FU_ATTRIBUTE` (`USER_ID`,`REALM_ID`,`NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FED_USER_ATTRIBUTE`
--

LOCK TABLES `FED_USER_ATTRIBUTE` WRITE;
/*!40000 ALTER TABLE `FED_USER_ATTRIBUTE` DISABLE KEYS */;
/*!40000 ALTER TABLE `FED_USER_ATTRIBUTE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FED_USER_CONSENT`
--

DROP TABLE IF EXISTS `FED_USER_CONSENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FED_USER_CONSENT` (
  `ID` varchar(36) NOT NULL,
  `CLIENT_ID` varchar(255) DEFAULT NULL,
  `USER_ID` varchar(255) NOT NULL,
  `REALM_ID` varchar(36) NOT NULL,
  `STORAGE_PROVIDER_ID` varchar(36) DEFAULT NULL,
  `CREATED_DATE` bigint(20) DEFAULT NULL,
  `LAST_UPDATED_DATE` bigint(20) DEFAULT NULL,
  `CLIENT_STORAGE_PROVIDER` varchar(36) DEFAULT NULL,
  `EXTERNAL_CLIENT_ID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_FU_CONSENT` (`USER_ID`,`CLIENT_ID`),
  KEY `IDX_FU_CONSENT_RU` (`REALM_ID`,`USER_ID`),
  KEY `IDX_FU_CNSNT_EXT` (`USER_ID`,`CLIENT_STORAGE_PROVIDER`,`EXTERNAL_CLIENT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FED_USER_CONSENT`
--

LOCK TABLES `FED_USER_CONSENT` WRITE;
/*!40000 ALTER TABLE `FED_USER_CONSENT` DISABLE KEYS */;
/*!40000 ALTER TABLE `FED_USER_CONSENT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FED_USER_CONSENT_CL_SCOPE`
--

DROP TABLE IF EXISTS `FED_USER_CONSENT_CL_SCOPE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FED_USER_CONSENT_CL_SCOPE` (
  `USER_CONSENT_ID` varchar(36) NOT NULL,
  `SCOPE_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`USER_CONSENT_ID`,`SCOPE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FED_USER_CONSENT_CL_SCOPE`
--

LOCK TABLES `FED_USER_CONSENT_CL_SCOPE` WRITE;
/*!40000 ALTER TABLE `FED_USER_CONSENT_CL_SCOPE` DISABLE KEYS */;
/*!40000 ALTER TABLE `FED_USER_CONSENT_CL_SCOPE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FED_USER_CREDENTIAL`
--

DROP TABLE IF EXISTS `FED_USER_CREDENTIAL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FED_USER_CREDENTIAL` (
  `ID` varchar(36) NOT NULL,
  `SALT` tinyblob,
  `TYPE` varchar(255) DEFAULT NULL,
  `CREATED_DATE` bigint(20) DEFAULT NULL,
  `USER_ID` varchar(255) NOT NULL,
  `REALM_ID` varchar(36) NOT NULL,
  `STORAGE_PROVIDER_ID` varchar(36) DEFAULT NULL,
  `USER_LABEL` varchar(255) DEFAULT NULL,
  `SECRET_DATA` longtext,
  `CREDENTIAL_DATA` longtext,
  `PRIORITY` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_FU_CREDENTIAL` (`USER_ID`,`TYPE`),
  KEY `IDX_FU_CREDENTIAL_RU` (`REALM_ID`,`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FED_USER_CREDENTIAL`
--

LOCK TABLES `FED_USER_CREDENTIAL` WRITE;
/*!40000 ALTER TABLE `FED_USER_CREDENTIAL` DISABLE KEYS */;
/*!40000 ALTER TABLE `FED_USER_CREDENTIAL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FED_USER_GROUP_MEMBERSHIP`
--

DROP TABLE IF EXISTS `FED_USER_GROUP_MEMBERSHIP`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FED_USER_GROUP_MEMBERSHIP` (
  `GROUP_ID` varchar(36) NOT NULL,
  `USER_ID` varchar(255) NOT NULL,
  `REALM_ID` varchar(36) NOT NULL,
  `STORAGE_PROVIDER_ID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`GROUP_ID`,`USER_ID`),
  KEY `IDX_FU_GROUP_MEMBERSHIP` (`USER_ID`,`GROUP_ID`),
  KEY `IDX_FU_GROUP_MEMBERSHIP_RU` (`REALM_ID`,`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FED_USER_GROUP_MEMBERSHIP`
--

LOCK TABLES `FED_USER_GROUP_MEMBERSHIP` WRITE;
/*!40000 ALTER TABLE `FED_USER_GROUP_MEMBERSHIP` DISABLE KEYS */;
/*!40000 ALTER TABLE `FED_USER_GROUP_MEMBERSHIP` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FED_USER_REQUIRED_ACTION`
--

DROP TABLE IF EXISTS `FED_USER_REQUIRED_ACTION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FED_USER_REQUIRED_ACTION` (
  `REQUIRED_ACTION` varchar(255) NOT NULL DEFAULT ' ',
  `USER_ID` varchar(255) NOT NULL,
  `REALM_ID` varchar(36) NOT NULL,
  `STORAGE_PROVIDER_ID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`REQUIRED_ACTION`,`USER_ID`),
  KEY `IDX_FU_REQUIRED_ACTION` (`USER_ID`,`REQUIRED_ACTION`),
  KEY `IDX_FU_REQUIRED_ACTION_RU` (`REALM_ID`,`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FED_USER_REQUIRED_ACTION`
--

LOCK TABLES `FED_USER_REQUIRED_ACTION` WRITE;
/*!40000 ALTER TABLE `FED_USER_REQUIRED_ACTION` DISABLE KEYS */;
/*!40000 ALTER TABLE `FED_USER_REQUIRED_ACTION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FED_USER_ROLE_MAPPING`
--

DROP TABLE IF EXISTS `FED_USER_ROLE_MAPPING`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FED_USER_ROLE_MAPPING` (
  `ROLE_ID` varchar(36) NOT NULL,
  `USER_ID` varchar(255) NOT NULL,
  `REALM_ID` varchar(36) NOT NULL,
  `STORAGE_PROVIDER_ID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`ROLE_ID`,`USER_ID`),
  KEY `IDX_FU_ROLE_MAPPING` (`USER_ID`,`ROLE_ID`),
  KEY `IDX_FU_ROLE_MAPPING_RU` (`REALM_ID`,`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FED_USER_ROLE_MAPPING`
--

LOCK TABLES `FED_USER_ROLE_MAPPING` WRITE;
/*!40000 ALTER TABLE `FED_USER_ROLE_MAPPING` DISABLE KEYS */;
/*!40000 ALTER TABLE `FED_USER_ROLE_MAPPING` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GROUP_ATTRIBUTE`
--

DROP TABLE IF EXISTS `GROUP_ATTRIBUTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GROUP_ATTRIBUTE` (
  `ID` varchar(36) NOT NULL DEFAULT 'sybase-needs-something-here',
  `NAME` varchar(255) NOT NULL,
  `VALUE` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `GROUP_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_GROUP_ATTR_GROUP` (`GROUP_ID`),
  CONSTRAINT `FK_GROUP_ATTRIBUTE_GROUP` FOREIGN KEY (`GROUP_ID`) REFERENCES `KEYCLOAK_GROUP` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GROUP_ATTRIBUTE`
--

LOCK TABLES `GROUP_ATTRIBUTE` WRITE;
/*!40000 ALTER TABLE `GROUP_ATTRIBUTE` DISABLE KEYS */;
/*!40000 ALTER TABLE `GROUP_ATTRIBUTE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GROUP_ROLE_MAPPING`
--

DROP TABLE IF EXISTS `GROUP_ROLE_MAPPING`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GROUP_ROLE_MAPPING` (
  `ROLE_ID` varchar(36) NOT NULL,
  `GROUP_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`ROLE_ID`,`GROUP_ID`),
  KEY `IDX_GROUP_ROLE_MAPP_GROUP` (`GROUP_ID`),
  CONSTRAINT `FK_GROUP_ROLE_GROUP` FOREIGN KEY (`GROUP_ID`) REFERENCES `KEYCLOAK_GROUP` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GROUP_ROLE_MAPPING`
--

LOCK TABLES `GROUP_ROLE_MAPPING` WRITE;
/*!40000 ALTER TABLE `GROUP_ROLE_MAPPING` DISABLE KEYS */;
/*!40000 ALTER TABLE `GROUP_ROLE_MAPPING` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IDENTITY_PROVIDER`
--

DROP TABLE IF EXISTS `IDENTITY_PROVIDER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IDENTITY_PROVIDER` (
  `INTERNAL_ID` varchar(36) NOT NULL,
  `ENABLED` bit(1) NOT NULL DEFAULT b'0',
  `PROVIDER_ALIAS` varchar(255) DEFAULT NULL,
  `PROVIDER_ID` varchar(255) DEFAULT NULL,
  `STORE_TOKEN` bit(1) NOT NULL DEFAULT b'0',
  `AUTHENTICATE_BY_DEFAULT` bit(1) NOT NULL DEFAULT b'0',
  `REALM_ID` varchar(36) DEFAULT NULL,
  `ADD_TOKEN_ROLE` bit(1) NOT NULL DEFAULT b'1',
  `TRUST_EMAIL` bit(1) NOT NULL DEFAULT b'0',
  `FIRST_BROKER_LOGIN_FLOW_ID` varchar(36) DEFAULT NULL,
  `POST_BROKER_LOGIN_FLOW_ID` varchar(36) DEFAULT NULL,
  `PROVIDER_DISPLAY_NAME` varchar(255) DEFAULT NULL,
  `LINK_ONLY` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`INTERNAL_ID`),
  UNIQUE KEY `UK_2DAELWNIBJI49AVXSRTUF6XJ33` (`PROVIDER_ALIAS`,`REALM_ID`),
  KEY `IDX_IDENT_PROV_REALM` (`REALM_ID`),
  CONSTRAINT `FK2B4EBC52AE5C3B34` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IDENTITY_PROVIDER`
--

LOCK TABLES `IDENTITY_PROVIDER` WRITE;
/*!40000 ALTER TABLE `IDENTITY_PROVIDER` DISABLE KEYS */;
/*!40000 ALTER TABLE `IDENTITY_PROVIDER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IDENTITY_PROVIDER_CONFIG`
--

DROP TABLE IF EXISTS `IDENTITY_PROVIDER_CONFIG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IDENTITY_PROVIDER_CONFIG` (
  `IDENTITY_PROVIDER_ID` varchar(36) NOT NULL,
  `VALUE` longtext,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`IDENTITY_PROVIDER_ID`,`NAME`),
  CONSTRAINT `FKDC4897CF864C4E43` FOREIGN KEY (`IDENTITY_PROVIDER_ID`) REFERENCES `IDENTITY_PROVIDER` (`INTERNAL_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IDENTITY_PROVIDER_CONFIG`
--

LOCK TABLES `IDENTITY_PROVIDER_CONFIG` WRITE;
/*!40000 ALTER TABLE `IDENTITY_PROVIDER_CONFIG` DISABLE KEYS */;
/*!40000 ALTER TABLE `IDENTITY_PROVIDER_CONFIG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IDENTITY_PROVIDER_MAPPER`
--

DROP TABLE IF EXISTS `IDENTITY_PROVIDER_MAPPER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IDENTITY_PROVIDER_MAPPER` (
  `ID` varchar(36) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `IDP_ALIAS` varchar(255) NOT NULL,
  `IDP_MAPPER_NAME` varchar(255) NOT NULL,
  `REALM_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_ID_PROV_MAPP_REALM` (`REALM_ID`),
  CONSTRAINT `FK_IDPM_REALM` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IDENTITY_PROVIDER_MAPPER`
--

LOCK TABLES `IDENTITY_PROVIDER_MAPPER` WRITE;
/*!40000 ALTER TABLE `IDENTITY_PROVIDER_MAPPER` DISABLE KEYS */;
/*!40000 ALTER TABLE `IDENTITY_PROVIDER_MAPPER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IDP_MAPPER_CONFIG`
--

DROP TABLE IF EXISTS `IDP_MAPPER_CONFIG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IDP_MAPPER_CONFIG` (
  `IDP_MAPPER_ID` varchar(36) NOT NULL,
  `VALUE` longtext,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`IDP_MAPPER_ID`,`NAME`),
  CONSTRAINT `FK_IDPMCONFIG` FOREIGN KEY (`IDP_MAPPER_ID`) REFERENCES `IDENTITY_PROVIDER_MAPPER` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IDP_MAPPER_CONFIG`
--

LOCK TABLES `IDP_MAPPER_CONFIG` WRITE;
/*!40000 ALTER TABLE `IDP_MAPPER_CONFIG` DISABLE KEYS */;
/*!40000 ALTER TABLE `IDP_MAPPER_CONFIG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `KEYCLOAK_GROUP`
--

DROP TABLE IF EXISTS `KEYCLOAK_GROUP`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KEYCLOAK_GROUP` (
  `ID` varchar(36) NOT NULL,
  `NAME` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `PARENT_GROUP` varchar(36) NOT NULL,
  `REALM_ID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `SIBLING_NAMES` (`REALM_ID`,`PARENT_GROUP`,`NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `KEYCLOAK_GROUP`
--

LOCK TABLES `KEYCLOAK_GROUP` WRITE;
/*!40000 ALTER TABLE `KEYCLOAK_GROUP` DISABLE KEYS */;
/*!40000 ALTER TABLE `KEYCLOAK_GROUP` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `KEYCLOAK_ROLE`
--

DROP TABLE IF EXISTS `KEYCLOAK_ROLE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KEYCLOAK_ROLE` (
  `ID` varchar(36) NOT NULL,
  `CLIENT_REALM_CONSTRAINT` varchar(255) DEFAULT NULL,
  `CLIENT_ROLE` bit(1) DEFAULT NULL,
  `DESCRIPTION` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `NAME` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `REALM_ID` varchar(255) DEFAULT NULL,
  `CLIENT` varchar(36) DEFAULT NULL,
  `REALM` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_J3RWUVD56ONTGSUHOGM184WW2-2` (`NAME`,`CLIENT_REALM_CONSTRAINT`),
  KEY `IDX_KEYCLOAK_ROLE_CLIENT` (`CLIENT`),
  KEY `IDX_KEYCLOAK_ROLE_REALM` (`REALM`),
  CONSTRAINT `FK_6VYQFE4CN4WLQ8R6KT5VDSJ5C` FOREIGN KEY (`REALM`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `KEYCLOAK_ROLE`
--

LOCK TABLES `KEYCLOAK_ROLE` WRITE;
/*!40000 ALTER TABLE `KEYCLOAK_ROLE` DISABLE KEYS */;
INSERT INTO `KEYCLOAK_ROLE` (`ID`, `CLIENT_REALM_CONSTRAINT`, `CLIENT_ROLE`, `DESCRIPTION`, `NAME`, `REALM_ID`, `CLIENT`, `REALM`) VALUES ('0be21b74-d145-41e0-bb8d-8900a63d4751','master',_binary '\0',NULL,'APP-LIBRARIAN','master',NULL,NULL),('166c3d1f-92cd-43a2-ad82-ce495ce7287e','6351decc-46e5-426e-899d-3135a4dbd6bf',_binary '','${role_delete-account}','delete-account','master','6351decc-46e5-426e-899d-3135a4dbd6bf',NULL),('279f2431-7a61-44cc-bc79-d4f65a87c0df','6351decc-46e5-426e-899d-3135a4dbd6bf',_binary '','${role_view-profile}','view-profile','master','6351decc-46e5-426e-899d-3135a4dbd6bf',NULL),('2911caf1-d52f-40ad-a2e4-440683f7dd6b','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_query-realms}','query-realms','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('32dc1454-9517-4562-b1d3-1904cfbe79fe','b2cb29e5-0633-48e6-b053-f7adba31845e',_binary '','${role_read-token}','read-token','master','b2cb29e5-0633-48e6-b053-f7adba31845e',NULL),('33cedc48-1222-438d-9ac9-b7d17fab1f96','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_view-realm}','view-realm','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('34feb122-cc91-4f71-8709-7b1a42775ee7','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_manage-identity-providers}','manage-identity-providers','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('362b8cd0-6ec9-483c-b881-59f5f1b1595b','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_manage-events}','manage-events','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('41199763-10d6-4174-8c38-4bce06276852','6351decc-46e5-426e-899d-3135a4dbd6bf',_binary '','${role_manage-account-links}','manage-account-links','master','6351decc-46e5-426e-899d-3135a4dbd6bf',NULL),('47b83310-ba07-4298-985a-9f57c393eed0','6351decc-46e5-426e-899d-3135a4dbd6bf',_binary '','${role_manage-consent}','manage-consent','master','6351decc-46e5-426e-899d-3135a4dbd6bf',NULL),('48d7297f-961a-49bf-a2d7-e5a4ccc43a1a','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_view-authorization}','view-authorization','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('65c3d650-1179-408b-b231-3221b93f2f42','6351decc-46e5-426e-899d-3135a4dbd6bf',_binary '','${role_manage-account}','manage-account','master','6351decc-46e5-426e-899d-3135a4dbd6bf',NULL),('73d9f9ad-6fab-41c9-aaa5-c47221a6038d','6351decc-46e5-426e-899d-3135a4dbd6bf',_binary '','${role_view-applications}','view-applications','master','6351decc-46e5-426e-899d-3135a4dbd6bf',NULL),('818ba614-34fc-42e9-a382-23c42853b70b','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_manage-users}','manage-users','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('86686e2f-5fab-4fd8-a59d-7d31e3d67089','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_view-clients}','view-clients','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('86d3a026-325f-49c5-9836-d023d687bb44','master',_binary '\0','${role_create-realm}','create-realm','master',NULL,NULL),('95c58893-8a5f-4fba-b384-5afca296e840','master',_binary '\0','${role_offline-access}','offline_access','master',NULL,NULL),('9890f56d-d994-4cf2-aa79-d3296afe3e54','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_create-client}','create-client','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('ad6cb71c-a5ae-4120-92af-25b900434158','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_view-users}','view-users','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('af9d2d82-5a55-492c-84f5-549b8ecc5c68','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_view-identity-providers}','view-identity-providers','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('bcc1adab-4c19-480b-bb5d-aa09c96bd592','6351decc-46e5-426e-899d-3135a4dbd6bf',_binary '','${role_view-consent}','view-consent','master','6351decc-46e5-426e-899d-3135a4dbd6bf',NULL),('bcf3e72d-a5b6-4dc1-9e79-9cf328d9f00c','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_manage-authorization}','manage-authorization','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('be0ebba9-546e-4347-baa8-06a4a44e83c3','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_query-users}','query-users','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('d2c5720a-730b-4ebf-8cdc-37e46d153ce2','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_impersonation}','impersonation','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('d45512b2-852e-425b-b1b5-71c917a36c88','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_query-groups}','query-groups','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('dce0b22c-c24b-4d37-a5e9-bb273b189605','master',_binary '\0','${role_uma_authorization}','uma_authorization','master',NULL,NULL),('e9aee95a-5dc1-439c-b58a-98c50e803d4a','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_view-events}','view-events','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('ed3feb67-23d7-406e-8950-c1cf2fb96c62','master',_binary '\0',NULL,'APP-ADMIN','master',NULL,NULL),('eeccdaf1-0106-4d7f-af8f-c6c41f0f43f7','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_manage-realm}','manage-realm','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('f186e5ea-ba20-48e0-82dc-2196d62cbe6a','master',_binary '\0',NULL,'APP-STAFF','master',NULL,NULL),('fc169503-3954-4fda-85db-dc29c7e45e52','master',_binary '\0','${role_admin}','admin','master',NULL,NULL),('fcc8e347-456b-446b-8a53-dca7e2491005','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_manage-clients}','manage-clients','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL),('fd12a47c-e041-41f5-9627-1cbbab172f8b','master',_binary '\0','${role_default-roles}','default-roles-master','master',NULL,NULL),('fff44e10-b919-4c01-b65c-a2448f037b23','2633180f-d391-4e4e-b877-8c886d352f54',_binary '','${role_query-clients}','query-clients','master','2633180f-d391-4e4e-b877-8c886d352f54',NULL);
/*!40000 ALTER TABLE `KEYCLOAK_ROLE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MIGRATION_MODEL`
--

DROP TABLE IF EXISTS `MIGRATION_MODEL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MIGRATION_MODEL` (
  `ID` varchar(36) NOT NULL,
  `VERSION` varchar(36) DEFAULT NULL,
  `UPDATE_TIME` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `IDX_UPDATE_TIME` (`UPDATE_TIME`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MIGRATION_MODEL`
--

LOCK TABLES `MIGRATION_MODEL` WRITE;
/*!40000 ALTER TABLE `MIGRATION_MODEL` DISABLE KEYS */;
INSERT INTO `MIGRATION_MODEL` (`ID`, `VERSION`, `UPDATE_TIME`) VALUES ('uobbo','16.1.0',1663318295);
/*!40000 ALTER TABLE `MIGRATION_MODEL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OFFLINE_CLIENT_SESSION`
--

DROP TABLE IF EXISTS `OFFLINE_CLIENT_SESSION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OFFLINE_CLIENT_SESSION` (
  `USER_SESSION_ID` varchar(36) NOT NULL,
  `CLIENT_ID` varchar(255) NOT NULL,
  `OFFLINE_FLAG` varchar(4) NOT NULL,
  `TIMESTAMP` int(11) DEFAULT NULL,
  `DATA` longtext,
  `CLIENT_STORAGE_PROVIDER` varchar(36) NOT NULL DEFAULT 'local',
  `EXTERNAL_CLIENT_ID` varchar(255) NOT NULL DEFAULT 'local',
  PRIMARY KEY (`USER_SESSION_ID`,`CLIENT_ID`,`CLIENT_STORAGE_PROVIDER`,`EXTERNAL_CLIENT_ID`,`OFFLINE_FLAG`),
  KEY `IDX_US_SESS_ID_ON_CL_SESS` (`USER_SESSION_ID`),
  KEY `IDX_OFFLINE_CSS_PRELOAD` (`CLIENT_ID`,`OFFLINE_FLAG`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OFFLINE_CLIENT_SESSION`
--

LOCK TABLES `OFFLINE_CLIENT_SESSION` WRITE;
/*!40000 ALTER TABLE `OFFLINE_CLIENT_SESSION` DISABLE KEYS */;
/*!40000 ALTER TABLE `OFFLINE_CLIENT_SESSION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OFFLINE_USER_SESSION`
--

DROP TABLE IF EXISTS `OFFLINE_USER_SESSION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OFFLINE_USER_SESSION` (
  `USER_SESSION_ID` varchar(36) NOT NULL,
  `USER_ID` varchar(255) DEFAULT NULL,
  `REALM_ID` varchar(36) NOT NULL,
  `CREATED_ON` int(11) NOT NULL,
  `OFFLINE_FLAG` varchar(4) NOT NULL,
  `DATA` longtext,
  `LAST_SESSION_REFRESH` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`USER_SESSION_ID`,`OFFLINE_FLAG`),
  KEY `IDX_OFFLINE_USS_CREATEDON` (`CREATED_ON`),
  KEY `IDX_OFFLINE_USS_PRELOAD` (`OFFLINE_FLAG`,`CREATED_ON`,`USER_SESSION_ID`),
  KEY `IDX_OFFLINE_USS_BY_USER` (`USER_ID`,`REALM_ID`,`OFFLINE_FLAG`),
  KEY `IDX_OFFLINE_USS_BY_USERSESS` (`REALM_ID`,`OFFLINE_FLAG`,`USER_SESSION_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OFFLINE_USER_SESSION`
--

LOCK TABLES `OFFLINE_USER_SESSION` WRITE;
/*!40000 ALTER TABLE `OFFLINE_USER_SESSION` DISABLE KEYS */;
/*!40000 ALTER TABLE `OFFLINE_USER_SESSION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `POLICY_CONFIG`
--

DROP TABLE IF EXISTS `POLICY_CONFIG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `POLICY_CONFIG` (
  `POLICY_ID` varchar(36) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `VALUE` longtext,
  PRIMARY KEY (`POLICY_ID`,`NAME`),
  CONSTRAINT `FKDC34197CF864C4E43` FOREIGN KEY (`POLICY_ID`) REFERENCES `RESOURCE_SERVER_POLICY` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `POLICY_CONFIG`
--

LOCK TABLES `POLICY_CONFIG` WRITE;
/*!40000 ALTER TABLE `POLICY_CONFIG` DISABLE KEYS */;
/*!40000 ALTER TABLE `POLICY_CONFIG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROTOCOL_MAPPER`
--

DROP TABLE IF EXISTS `PROTOCOL_MAPPER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROTOCOL_MAPPER` (
  `ID` varchar(36) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `PROTOCOL` varchar(255) NOT NULL,
  `PROTOCOL_MAPPER_NAME` varchar(255) NOT NULL,
  `CLIENT_ID` varchar(36) DEFAULT NULL,
  `CLIENT_SCOPE_ID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_PROTOCOL_MAPPER_CLIENT` (`CLIENT_ID`),
  KEY `IDX_CLSCOPE_PROTMAP` (`CLIENT_SCOPE_ID`),
  CONSTRAINT `FK_CLI_SCOPE_MAPPER` FOREIGN KEY (`CLIENT_SCOPE_ID`) REFERENCES `CLIENT_SCOPE` (`ID`),
  CONSTRAINT `FK_PCM_REALM` FOREIGN KEY (`CLIENT_ID`) REFERENCES `CLIENT` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROTOCOL_MAPPER`
--

LOCK TABLES `PROTOCOL_MAPPER` WRITE;
/*!40000 ALTER TABLE `PROTOCOL_MAPPER` DISABLE KEYS */;
INSERT INTO `PROTOCOL_MAPPER` (`ID`, `NAME`, `PROTOCOL`, `PROTOCOL_MAPPER_NAME`, `CLIENT_ID`, `CLIENT_SCOPE_ID`) VALUES ('11bbea38-bf9e-4e3f-82c6-b4b956571221','picture','openid-connect','oidc-usermodel-attribute-mapper',NULL,'45469fff-d615-403d-ac6e-a9322b9631be'),('29646d4e-bdfd-4bf2-853d-9e987914109d','birthdate','openid-connect','oidc-usermodel-attribute-mapper',NULL,'45469fff-d615-403d-ac6e-a9322b9631be'),('2ff09258-c687-4b72-a4ad-e4c20cfc21b9','updated at','openid-connect','oidc-usermodel-attribute-mapper',NULL,'45469fff-d615-403d-ac6e-a9322b9631be'),('39e8cb36-a4b0-4b1f-b9de-5532e10d6a7d','audience resolve','openid-connect','oidc-audience-resolve-mapper',NULL,'89c6dee1-882b-4c3d-bc83-5e1c69936655'),('39ea6c38-4cb1-4e74-b463-82114ed95ff3','username','openid-connect','oidc-usermodel-property-mapper',NULL,'45469fff-d615-403d-ac6e-a9322b9631be'),('3feb5276-aaf2-49ce-838c-8092c8c1858c','realm roles','openid-connect','oidc-usermodel-realm-role-mapper',NULL,'89c6dee1-882b-4c3d-bc83-5e1c69936655'),('41f0d342-e320-402b-97d0-e5baee698f93','client roles','openid-connect','oidc-usermodel-client-role-mapper',NULL,'89c6dee1-882b-4c3d-bc83-5e1c69936655'),('47cc9e8c-8631-4c50-8207-5579dbb879c2','gender','openid-connect','oidc-usermodel-attribute-mapper',NULL,'45469fff-d615-403d-ac6e-a9322b9631be'),('5c9dbc99-2b4a-44e7-9a2c-b2ea332ba6b2','address','openid-connect','oidc-address-mapper',NULL,'157f0c24-d0e0-4ea6-b840-9fbea43c2c2e'),('620623e5-3dd6-46ec-ba4d-a4885fe4983b','allowed web origins','openid-connect','oidc-allowed-origins-mapper',NULL,'1b9a41a9-bf24-4613-b7e7-996da1248bdd'),('67ee9f1e-73ca-4b0a-afc6-38c9881990ad','family name','openid-connect','oidc-usermodel-property-mapper',NULL,'45469fff-d615-403d-ac6e-a9322b9631be'),('6c353c58-46ab-4beb-8a2b-9cb661577363','profile','openid-connect','oidc-usermodel-attribute-mapper',NULL,'45469fff-d615-403d-ac6e-a9322b9631be'),('6e48622d-6a9b-461e-8180-9e943d9118d1','website','openid-connect','oidc-usermodel-attribute-mapper',NULL,'45469fff-d615-403d-ac6e-a9322b9631be'),('73b43e7b-cb5a-4f2a-b2e6-32e2e38fbbf5','middle name','openid-connect','oidc-usermodel-attribute-mapper',NULL,'45469fff-d615-403d-ac6e-a9322b9631be'),('7c87e601-0c51-411e-ab31-81ed8cbab022','audience resolve','openid-connect','oidc-audience-resolve-mapper','d3bc5911-d1c9-4a27-9a65-e1993cee1c29',NULL),('86ea42de-d1be-4a4b-9d68-f2dd2c2de242','phone number verified','openid-connect','oidc-usermodel-attribute-mapper',NULL,'98cc39a1-eba6-4e23-ba51-b91bf9226e14'),('8d4c73cb-19d2-47c8-ba43-7f5da2b3f0fb','groups','openid-connect','oidc-usermodel-realm-role-mapper',NULL,'e5c86d50-ab1c-4603-9155-861be9495fbe'),('90c0e9c6-445e-4229-8a4d-4c7f0e641c10','locale','openid-connect','oidc-usermodel-attribute-mapper',NULL,'45469fff-d615-403d-ac6e-a9322b9631be'),('a160fee3-7a40-4e5c-8826-bca2f814f227','phone number','openid-connect','oidc-usermodel-attribute-mapper',NULL,'98cc39a1-eba6-4e23-ba51-b91bf9226e14'),('a6e021c3-26ad-4548-abe8-a38f0144e1cf','locale','openid-connect','oidc-usermodel-attribute-mapper','85815b42-9717-42e9-9171-22c7dda14b82',NULL),('b39fa901-418f-4ab2-8c7b-c5bfb096f699','email verified','openid-connect','oidc-usermodel-property-mapper',NULL,'16991a6a-816c-43aa-b71f-9a1d2ffe691e'),('bcd03ad3-0e46-4157-be31-cc70208f7135','full name','openid-connect','oidc-full-name-mapper',NULL,'45469fff-d615-403d-ac6e-a9322b9631be'),('c073ff5d-78fc-4d7f-80e4-8df708a7a426','email','openid-connect','oidc-usermodel-property-mapper',NULL,'16991a6a-816c-43aa-b71f-9a1d2ffe691e'),('c278f799-980c-4e00-8aff-6a310df88ed6','nickname','openid-connect','oidc-usermodel-attribute-mapper',NULL,'45469fff-d615-403d-ac6e-a9322b9631be'),('de1689c0-8dad-41bc-a715-b1703258d9f7','role list','saml','saml-role-list-mapper',NULL,'01be032d-9117-4d3b-acce-7ccae55abbfe'),('ed2187b0-2fc1-4cf4-a0e0-ba6b0f03e417','upn','openid-connect','oidc-usermodel-property-mapper',NULL,'e5c86d50-ab1c-4603-9155-861be9495fbe'),('f743b0a3-db8c-4d1e-8e2d-d51b9dffa986','zoneinfo','openid-connect','oidc-usermodel-attribute-mapper',NULL,'45469fff-d615-403d-ac6e-a9322b9631be'),('fc98704b-d0cf-4e0f-bd5d-d6f3430f320a','given name','openid-connect','oidc-usermodel-property-mapper',NULL,'45469fff-d615-403d-ac6e-a9322b9631be');
/*!40000 ALTER TABLE `PROTOCOL_MAPPER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROTOCOL_MAPPER_CONFIG`
--

DROP TABLE IF EXISTS `PROTOCOL_MAPPER_CONFIG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROTOCOL_MAPPER_CONFIG` (
  `PROTOCOL_MAPPER_ID` varchar(36) NOT NULL,
  `VALUE` longtext,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`PROTOCOL_MAPPER_ID`,`NAME`),
  CONSTRAINT `FK_PMCONFIG` FOREIGN KEY (`PROTOCOL_MAPPER_ID`) REFERENCES `PROTOCOL_MAPPER` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROTOCOL_MAPPER_CONFIG`
--

LOCK TABLES `PROTOCOL_MAPPER_CONFIG` WRITE;
/*!40000 ALTER TABLE `PROTOCOL_MAPPER_CONFIG` DISABLE KEYS */;
INSERT INTO `PROTOCOL_MAPPER_CONFIG` (`PROTOCOL_MAPPER_ID`, `VALUE`, `NAME`) VALUES ('11bbea38-bf9e-4e3f-82c6-b4b956571221','true','access.token.claim'),('11bbea38-bf9e-4e3f-82c6-b4b956571221','picture','claim.name'),('11bbea38-bf9e-4e3f-82c6-b4b956571221','true','id.token.claim'),('11bbea38-bf9e-4e3f-82c6-b4b956571221','String','jsonType.label'),('11bbea38-bf9e-4e3f-82c6-b4b956571221','picture','user.attribute'),('11bbea38-bf9e-4e3f-82c6-b4b956571221','true','userinfo.token.claim'),('29646d4e-bdfd-4bf2-853d-9e987914109d','true','access.token.claim'),('29646d4e-bdfd-4bf2-853d-9e987914109d','birthdate','claim.name'),('29646d4e-bdfd-4bf2-853d-9e987914109d','true','id.token.claim'),('29646d4e-bdfd-4bf2-853d-9e987914109d','String','jsonType.label'),('29646d4e-bdfd-4bf2-853d-9e987914109d','birthdate','user.attribute'),('29646d4e-bdfd-4bf2-853d-9e987914109d','true','userinfo.token.claim'),('2ff09258-c687-4b72-a4ad-e4c20cfc21b9','true','access.token.claim'),('2ff09258-c687-4b72-a4ad-e4c20cfc21b9','updated_at','claim.name'),('2ff09258-c687-4b72-a4ad-e4c20cfc21b9','true','id.token.claim'),('2ff09258-c687-4b72-a4ad-e4c20cfc21b9','String','jsonType.label'),('2ff09258-c687-4b72-a4ad-e4c20cfc21b9','updatedAt','user.attribute'),('2ff09258-c687-4b72-a4ad-e4c20cfc21b9','true','userinfo.token.claim'),('39ea6c38-4cb1-4e74-b463-82114ed95ff3','true','access.token.claim'),('39ea6c38-4cb1-4e74-b463-82114ed95ff3','preferred_username','claim.name'),('39ea6c38-4cb1-4e74-b463-82114ed95ff3','true','id.token.claim'),('39ea6c38-4cb1-4e74-b463-82114ed95ff3','String','jsonType.label'),('39ea6c38-4cb1-4e74-b463-82114ed95ff3','username','user.attribute'),('39ea6c38-4cb1-4e74-b463-82114ed95ff3','true','userinfo.token.claim'),('3feb5276-aaf2-49ce-838c-8092c8c1858c','true','access.token.claim'),('3feb5276-aaf2-49ce-838c-8092c8c1858c','realm_access.roles','claim.name'),('3feb5276-aaf2-49ce-838c-8092c8c1858c','String','jsonType.label'),('3feb5276-aaf2-49ce-838c-8092c8c1858c','true','multivalued'),('3feb5276-aaf2-49ce-838c-8092c8c1858c','foo','user.attribute'),('41f0d342-e320-402b-97d0-e5baee698f93','true','access.token.claim'),('41f0d342-e320-402b-97d0-e5baee698f93','resource_access.${client_id}.roles','claim.name'),('41f0d342-e320-402b-97d0-e5baee698f93','String','jsonType.label'),('41f0d342-e320-402b-97d0-e5baee698f93','true','multivalued'),('41f0d342-e320-402b-97d0-e5baee698f93','foo','user.attribute'),('47cc9e8c-8631-4c50-8207-5579dbb879c2','true','access.token.claim'),('47cc9e8c-8631-4c50-8207-5579dbb879c2','gender','claim.name'),('47cc9e8c-8631-4c50-8207-5579dbb879c2','true','id.token.claim'),('47cc9e8c-8631-4c50-8207-5579dbb879c2','String','jsonType.label'),('47cc9e8c-8631-4c50-8207-5579dbb879c2','gender','user.attribute'),('47cc9e8c-8631-4c50-8207-5579dbb879c2','true','userinfo.token.claim'),('5c9dbc99-2b4a-44e7-9a2c-b2ea332ba6b2','true','access.token.claim'),('5c9dbc99-2b4a-44e7-9a2c-b2ea332ba6b2','true','id.token.claim'),('5c9dbc99-2b4a-44e7-9a2c-b2ea332ba6b2','country','user.attribute.country'),('5c9dbc99-2b4a-44e7-9a2c-b2ea332ba6b2','formatted','user.attribute.formatted'),('5c9dbc99-2b4a-44e7-9a2c-b2ea332ba6b2','locality','user.attribute.locality'),('5c9dbc99-2b4a-44e7-9a2c-b2ea332ba6b2','postal_code','user.attribute.postal_code'),('5c9dbc99-2b4a-44e7-9a2c-b2ea332ba6b2','region','user.attribute.region'),('5c9dbc99-2b4a-44e7-9a2c-b2ea332ba6b2','street','user.attribute.street'),('5c9dbc99-2b4a-44e7-9a2c-b2ea332ba6b2','true','userinfo.token.claim'),('67ee9f1e-73ca-4b0a-afc6-38c9881990ad','true','access.token.claim'),('67ee9f1e-73ca-4b0a-afc6-38c9881990ad','family_name','claim.name'),('67ee9f1e-73ca-4b0a-afc6-38c9881990ad','true','id.token.claim'),('67ee9f1e-73ca-4b0a-afc6-38c9881990ad','String','jsonType.label'),('67ee9f1e-73ca-4b0a-afc6-38c9881990ad','lastName','user.attribute'),('67ee9f1e-73ca-4b0a-afc6-38c9881990ad','true','userinfo.token.claim'),('6c353c58-46ab-4beb-8a2b-9cb661577363','true','access.token.claim'),('6c353c58-46ab-4beb-8a2b-9cb661577363','profile','claim.name'),('6c353c58-46ab-4beb-8a2b-9cb661577363','true','id.token.claim'),('6c353c58-46ab-4beb-8a2b-9cb661577363','String','jsonType.label'),('6c353c58-46ab-4beb-8a2b-9cb661577363','profile','user.attribute'),('6c353c58-46ab-4beb-8a2b-9cb661577363','true','userinfo.token.claim'),('6e48622d-6a9b-461e-8180-9e943d9118d1','true','access.token.claim'),('6e48622d-6a9b-461e-8180-9e943d9118d1','website','claim.name'),('6e48622d-6a9b-461e-8180-9e943d9118d1','true','id.token.claim'),('6e48622d-6a9b-461e-8180-9e943d9118d1','String','jsonType.label'),('6e48622d-6a9b-461e-8180-9e943d9118d1','website','user.attribute'),('6e48622d-6a9b-461e-8180-9e943d9118d1','true','userinfo.token.claim'),('73b43e7b-cb5a-4f2a-b2e6-32e2e38fbbf5','true','access.token.claim'),('73b43e7b-cb5a-4f2a-b2e6-32e2e38fbbf5','middle_name','claim.name'),('73b43e7b-cb5a-4f2a-b2e6-32e2e38fbbf5','true','id.token.claim'),('73b43e7b-cb5a-4f2a-b2e6-32e2e38fbbf5','String','jsonType.label'),('73b43e7b-cb5a-4f2a-b2e6-32e2e38fbbf5','middleName','user.attribute'),('73b43e7b-cb5a-4f2a-b2e6-32e2e38fbbf5','true','userinfo.token.claim'),('86ea42de-d1be-4a4b-9d68-f2dd2c2de242','true','access.token.claim'),('86ea42de-d1be-4a4b-9d68-f2dd2c2de242','phone_number_verified','claim.name'),('86ea42de-d1be-4a4b-9d68-f2dd2c2de242','true','id.token.claim'),('86ea42de-d1be-4a4b-9d68-f2dd2c2de242','boolean','jsonType.label'),('86ea42de-d1be-4a4b-9d68-f2dd2c2de242','phoneNumberVerified','user.attribute'),('86ea42de-d1be-4a4b-9d68-f2dd2c2de242','true','userinfo.token.claim'),('8d4c73cb-19d2-47c8-ba43-7f5da2b3f0fb','true','access.token.claim'),('8d4c73cb-19d2-47c8-ba43-7f5da2b3f0fb','groups','claim.name'),('8d4c73cb-19d2-47c8-ba43-7f5da2b3f0fb','true','id.token.claim'),('8d4c73cb-19d2-47c8-ba43-7f5da2b3f0fb','String','jsonType.label'),('8d4c73cb-19d2-47c8-ba43-7f5da2b3f0fb','true','multivalued'),('8d4c73cb-19d2-47c8-ba43-7f5da2b3f0fb','foo','user.attribute'),('90c0e9c6-445e-4229-8a4d-4c7f0e641c10','true','access.token.claim'),('90c0e9c6-445e-4229-8a4d-4c7f0e641c10','locale','claim.name'),('90c0e9c6-445e-4229-8a4d-4c7f0e641c10','true','id.token.claim'),('90c0e9c6-445e-4229-8a4d-4c7f0e641c10','String','jsonType.label'),('90c0e9c6-445e-4229-8a4d-4c7f0e641c10','locale','user.attribute'),('90c0e9c6-445e-4229-8a4d-4c7f0e641c10','true','userinfo.token.claim'),('a160fee3-7a40-4e5c-8826-bca2f814f227','true','access.token.claim'),('a160fee3-7a40-4e5c-8826-bca2f814f227','phone_number','claim.name'),('a160fee3-7a40-4e5c-8826-bca2f814f227','true','id.token.claim'),('a160fee3-7a40-4e5c-8826-bca2f814f227','String','jsonType.label'),('a160fee3-7a40-4e5c-8826-bca2f814f227','phoneNumber','user.attribute'),('a160fee3-7a40-4e5c-8826-bca2f814f227','true','userinfo.token.claim'),('a6e021c3-26ad-4548-abe8-a38f0144e1cf','true','access.token.claim'),('a6e021c3-26ad-4548-abe8-a38f0144e1cf','locale','claim.name'),('a6e021c3-26ad-4548-abe8-a38f0144e1cf','true','id.token.claim'),('a6e021c3-26ad-4548-abe8-a38f0144e1cf','String','jsonType.label'),('a6e021c3-26ad-4548-abe8-a38f0144e1cf','locale','user.attribute'),('a6e021c3-26ad-4548-abe8-a38f0144e1cf','true','userinfo.token.claim'),('b39fa901-418f-4ab2-8c7b-c5bfb096f699','true','access.token.claim'),('b39fa901-418f-4ab2-8c7b-c5bfb096f699','email_verified','claim.name'),('b39fa901-418f-4ab2-8c7b-c5bfb096f699','true','id.token.claim'),('b39fa901-418f-4ab2-8c7b-c5bfb096f699','boolean','jsonType.label'),('b39fa901-418f-4ab2-8c7b-c5bfb096f699','emailVerified','user.attribute'),('b39fa901-418f-4ab2-8c7b-c5bfb096f699','true','userinfo.token.claim'),('bcd03ad3-0e46-4157-be31-cc70208f7135','true','access.token.claim'),('bcd03ad3-0e46-4157-be31-cc70208f7135','true','id.token.claim'),('bcd03ad3-0e46-4157-be31-cc70208f7135','true','userinfo.token.claim'),('c073ff5d-78fc-4d7f-80e4-8df708a7a426','true','access.token.claim'),('c073ff5d-78fc-4d7f-80e4-8df708a7a426','email','claim.name'),('c073ff5d-78fc-4d7f-80e4-8df708a7a426','true','id.token.claim'),('c073ff5d-78fc-4d7f-80e4-8df708a7a426','String','jsonType.label'),('c073ff5d-78fc-4d7f-80e4-8df708a7a426','email','user.attribute'),('c073ff5d-78fc-4d7f-80e4-8df708a7a426','true','userinfo.token.claim'),('c278f799-980c-4e00-8aff-6a310df88ed6','true','access.token.claim'),('c278f799-980c-4e00-8aff-6a310df88ed6','nickname','claim.name'),('c278f799-980c-4e00-8aff-6a310df88ed6','true','id.token.claim'),('c278f799-980c-4e00-8aff-6a310df88ed6','String','jsonType.label'),('c278f799-980c-4e00-8aff-6a310df88ed6','nickname','user.attribute'),('c278f799-980c-4e00-8aff-6a310df88ed6','true','userinfo.token.claim'),('de1689c0-8dad-41bc-a715-b1703258d9f7','Role','attribute.name'),('de1689c0-8dad-41bc-a715-b1703258d9f7','Basic','attribute.nameformat'),('de1689c0-8dad-41bc-a715-b1703258d9f7','false','single'),('ed2187b0-2fc1-4cf4-a0e0-ba6b0f03e417','true','access.token.claim'),('ed2187b0-2fc1-4cf4-a0e0-ba6b0f03e417','upn','claim.name'),('ed2187b0-2fc1-4cf4-a0e0-ba6b0f03e417','true','id.token.claim'),('ed2187b0-2fc1-4cf4-a0e0-ba6b0f03e417','String','jsonType.label'),('ed2187b0-2fc1-4cf4-a0e0-ba6b0f03e417','username','user.attribute'),('ed2187b0-2fc1-4cf4-a0e0-ba6b0f03e417','true','userinfo.token.claim'),('f743b0a3-db8c-4d1e-8e2d-d51b9dffa986','true','access.token.claim'),('f743b0a3-db8c-4d1e-8e2d-d51b9dffa986','zoneinfo','claim.name'),('f743b0a3-db8c-4d1e-8e2d-d51b9dffa986','true','id.token.claim'),('f743b0a3-db8c-4d1e-8e2d-d51b9dffa986','String','jsonType.label'),('f743b0a3-db8c-4d1e-8e2d-d51b9dffa986','zoneinfo','user.attribute'),('f743b0a3-db8c-4d1e-8e2d-d51b9dffa986','true','userinfo.token.claim'),('fc98704b-d0cf-4e0f-bd5d-d6f3430f320a','true','access.token.claim'),('fc98704b-d0cf-4e0f-bd5d-d6f3430f320a','given_name','claim.name'),('fc98704b-d0cf-4e0f-bd5d-d6f3430f320a','true','id.token.claim'),('fc98704b-d0cf-4e0f-bd5d-d6f3430f320a','String','jsonType.label'),('fc98704b-d0cf-4e0f-bd5d-d6f3430f320a','firstName','user.attribute'),('fc98704b-d0cf-4e0f-bd5d-d6f3430f320a','true','userinfo.token.claim');
/*!40000 ALTER TABLE `PROTOCOL_MAPPER_CONFIG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REALM`
--

DROP TABLE IF EXISTS `REALM`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REALM` (
  `ID` varchar(36) NOT NULL,
  `ACCESS_CODE_LIFESPAN` int(11) DEFAULT NULL,
  `USER_ACTION_LIFESPAN` int(11) DEFAULT NULL,
  `ACCESS_TOKEN_LIFESPAN` int(11) DEFAULT NULL,
  `ACCOUNT_THEME` varchar(255) DEFAULT NULL,
  `ADMIN_THEME` varchar(255) DEFAULT NULL,
  `EMAIL_THEME` varchar(255) DEFAULT NULL,
  `ENABLED` bit(1) NOT NULL DEFAULT b'0',
  `EVENTS_ENABLED` bit(1) NOT NULL DEFAULT b'0',
  `EVENTS_EXPIRATION` bigint(20) DEFAULT NULL,
  `LOGIN_THEME` varchar(255) DEFAULT NULL,
  `NAME` varchar(255) DEFAULT NULL,
  `NOT_BEFORE` int(11) DEFAULT NULL,
  `PASSWORD_POLICY` varchar(2550) DEFAULT NULL,
  `REGISTRATION_ALLOWED` bit(1) NOT NULL DEFAULT b'0',
  `REMEMBER_ME` bit(1) NOT NULL DEFAULT b'0',
  `RESET_PASSWORD_ALLOWED` bit(1) NOT NULL DEFAULT b'0',
  `SOCIAL` bit(1) NOT NULL DEFAULT b'0',
  `SSL_REQUIRED` varchar(255) DEFAULT NULL,
  `SSO_IDLE_TIMEOUT` int(11) DEFAULT NULL,
  `SSO_MAX_LIFESPAN` int(11) DEFAULT NULL,
  `UPDATE_PROFILE_ON_SOC_LOGIN` bit(1) NOT NULL DEFAULT b'0',
  `VERIFY_EMAIL` bit(1) NOT NULL DEFAULT b'0',
  `MASTER_ADMIN_CLIENT` varchar(36) DEFAULT NULL,
  `LOGIN_LIFESPAN` int(11) DEFAULT NULL,
  `INTERNATIONALIZATION_ENABLED` bit(1) NOT NULL DEFAULT b'0',
  `DEFAULT_LOCALE` varchar(255) DEFAULT NULL,
  `REG_EMAIL_AS_USERNAME` bit(1) NOT NULL DEFAULT b'0',
  `ADMIN_EVENTS_ENABLED` bit(1) NOT NULL DEFAULT b'0',
  `ADMIN_EVENTS_DETAILS_ENABLED` bit(1) NOT NULL DEFAULT b'0',
  `EDIT_USERNAME_ALLOWED` bit(1) NOT NULL DEFAULT b'0',
  `OTP_POLICY_COUNTER` int(11) DEFAULT '0',
  `OTP_POLICY_WINDOW` int(11) DEFAULT '1',
  `OTP_POLICY_PERIOD` int(11) DEFAULT '30',
  `OTP_POLICY_DIGITS` int(11) DEFAULT '6',
  `OTP_POLICY_ALG` varchar(36) DEFAULT 'HmacSHA1',
  `OTP_POLICY_TYPE` varchar(36) DEFAULT 'totp',
  `BROWSER_FLOW` varchar(36) DEFAULT NULL,
  `REGISTRATION_FLOW` varchar(36) DEFAULT NULL,
  `DIRECT_GRANT_FLOW` varchar(36) DEFAULT NULL,
  `RESET_CREDENTIALS_FLOW` varchar(36) DEFAULT NULL,
  `CLIENT_AUTH_FLOW` varchar(36) DEFAULT NULL,
  `OFFLINE_SESSION_IDLE_TIMEOUT` int(11) DEFAULT '0',
  `REVOKE_REFRESH_TOKEN` bit(1) NOT NULL DEFAULT b'0',
  `ACCESS_TOKEN_LIFE_IMPLICIT` int(11) DEFAULT '0',
  `LOGIN_WITH_EMAIL_ALLOWED` bit(1) NOT NULL DEFAULT b'1',
  `DUPLICATE_EMAILS_ALLOWED` bit(1) NOT NULL DEFAULT b'0',
  `DOCKER_AUTH_FLOW` varchar(36) DEFAULT NULL,
  `REFRESH_TOKEN_MAX_REUSE` int(11) DEFAULT '0',
  `ALLOW_USER_MANAGED_ACCESS` bit(1) NOT NULL DEFAULT b'0',
  `SSO_MAX_LIFESPAN_REMEMBER_ME` int(11) NOT NULL,
  `SSO_IDLE_TIMEOUT_REMEMBER_ME` int(11) NOT NULL,
  `DEFAULT_ROLE` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_ORVSDMLA56612EAEFIQ6WL5OI` (`NAME`),
  KEY `IDX_REALM_MASTER_ADM_CLI` (`MASTER_ADMIN_CLIENT`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REALM`
--

LOCK TABLES `REALM` WRITE;
/*!40000 ALTER TABLE `REALM` DISABLE KEYS */;
INSERT INTO `REALM` (`ID`, `ACCESS_CODE_LIFESPAN`, `USER_ACTION_LIFESPAN`, `ACCESS_TOKEN_LIFESPAN`, `ACCOUNT_THEME`, `ADMIN_THEME`, `EMAIL_THEME`, `ENABLED`, `EVENTS_ENABLED`, `EVENTS_EXPIRATION`, `LOGIN_THEME`, `NAME`, `NOT_BEFORE`, `PASSWORD_POLICY`, `REGISTRATION_ALLOWED`, `REMEMBER_ME`, `RESET_PASSWORD_ALLOWED`, `SOCIAL`, `SSL_REQUIRED`, `SSO_IDLE_TIMEOUT`, `SSO_MAX_LIFESPAN`, `UPDATE_PROFILE_ON_SOC_LOGIN`, `VERIFY_EMAIL`, `MASTER_ADMIN_CLIENT`, `LOGIN_LIFESPAN`, `INTERNATIONALIZATION_ENABLED`, `DEFAULT_LOCALE`, `REG_EMAIL_AS_USERNAME`, `ADMIN_EVENTS_ENABLED`, `ADMIN_EVENTS_DETAILS_ENABLED`, `EDIT_USERNAME_ALLOWED`, `OTP_POLICY_COUNTER`, `OTP_POLICY_WINDOW`, `OTP_POLICY_PERIOD`, `OTP_POLICY_DIGITS`, `OTP_POLICY_ALG`, `OTP_POLICY_TYPE`, `BROWSER_FLOW`, `REGISTRATION_FLOW`, `DIRECT_GRANT_FLOW`, `RESET_CREDENTIALS_FLOW`, `CLIENT_AUTH_FLOW`, `OFFLINE_SESSION_IDLE_TIMEOUT`, `REVOKE_REFRESH_TOKEN`, `ACCESS_TOKEN_LIFE_IMPLICIT`, `LOGIN_WITH_EMAIL_ALLOWED`, `DUPLICATE_EMAILS_ALLOWED`, `DOCKER_AUTH_FLOW`, `REFRESH_TOKEN_MAX_REUSE`, `ALLOW_USER_MANAGED_ACCESS`, `SSO_MAX_LIFESPAN_REMEMBER_ME`, `SSO_IDLE_TIMEOUT_REMEMBER_ME`, `DEFAULT_ROLE`) VALUES ('master',60,300,10800,NULL,NULL,NULL,_binary '',_binary '\0',0,NULL,'master',0,NULL,_binary '\0',_binary '\0',_binary '\0',_binary '\0','NONE',604800,864000,_binary '\0',_binary '\0','2633180f-d391-4e4e-b877-8c886d352f54',1800,_binary '\0',NULL,_binary '\0',_binary '\0',_binary '\0',_binary '\0',0,1,30,6,'HmacSHA1','totp','e31af5de-0952-4fd8-87a8-c167c5f0a3d8','ef72bcc6-0411-43be-9eee-36b4ee09b60f','063176a9-787a-4d95-b52e-f8d2b2cc9a92','97108289-bddb-4657-8d78-1bffef5078ae','25288516-b643-4e19-ac8e-78e9ccf8f19c',2592000,_binary '\0',10800,_binary '',_binary '\0','5651c414-44af-4349-be2b-549c232389ba',0,_binary '\0',0,0,'fd12a47c-e041-41f5-9627-1cbbab172f8b');
/*!40000 ALTER TABLE `REALM` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REALM_ATTRIBUTE`
--

DROP TABLE IF EXISTS `REALM_ATTRIBUTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REALM_ATTRIBUTE` (
  `NAME` varchar(255) NOT NULL,
  `REALM_ID` varchar(36) NOT NULL,
  `VALUE` longtext CHARACTER SET utf8,
  PRIMARY KEY (`NAME`,`REALM_ID`),
  KEY `IDX_REALM_ATTR_REALM` (`REALM_ID`),
  CONSTRAINT `FK_8SHXD6L3E9ATQUKACXGPFFPTW` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REALM_ATTRIBUTE`
--

LOCK TABLES `REALM_ATTRIBUTE` WRITE;
/*!40000 ALTER TABLE `REALM_ATTRIBUTE` DISABLE KEYS */;
INSERT INTO `REALM_ATTRIBUTE` (`NAME`, `REALM_ID`, `VALUE`) VALUES ('actionTokenGeneratedByAdminLifespan','master','43200'),('actionTokenGeneratedByUserLifespan','master','300'),('bruteForceProtected','master','false'),('cibaAuthRequestedUserHint','master','login_hint'),('cibaBackchannelTokenDeliveryMode','master','poll'),('cibaExpiresIn','master','120'),('cibaInterval','master','5'),('client-policies.policies','master','{\"policies\":[]}'),('client-policies.profiles','master','{\"profiles\":[]}'),('clientOfflineSessionIdleTimeout','master','0'),('clientOfflineSessionMaxLifespan','master','0'),('clientSessionIdleTimeout','master','0'),('clientSessionMaxLifespan','master','0'),('defaultSignatureAlgorithm','master','RS256'),('displayName','master','Keycloak'),('displayNameHtml','master','<div class=\"kc-logo-text\"><span>Keycloak</span></div>'),('failureFactor','master','30'),('maxDeltaTimeSeconds','master','43200'),('maxFailureWaitSeconds','master','900'),('minimumQuickLoginWaitSeconds','master','60'),('oauth2DeviceCodeLifespan','master','600'),('oauth2DevicePollingInterval','master','600'),('offlineSessionMaxLifespan','master','5184000'),('offlineSessionMaxLifespanEnabled','master','false'),('parRequestUriLifespan','master','60'),('permanentLockout','master','false'),('quickLoginCheckMilliSeconds','master','1000'),('waitIncrementSeconds','master','60'),('webAuthnPolicyAttestationConveyancePreference','master','not specified'),('webAuthnPolicyAttestationConveyancePreferencePasswordless','master','not specified'),('webAuthnPolicyAuthenticatorAttachment','master','not specified'),('webAuthnPolicyAuthenticatorAttachmentPasswordless','master','not specified'),('webAuthnPolicyAvoidSameAuthenticatorRegister','master','false'),('webAuthnPolicyAvoidSameAuthenticatorRegisterPasswordless','master','false'),('webAuthnPolicyCreateTimeout','master','0'),('webAuthnPolicyCreateTimeoutPasswordless','master','0'),('webAuthnPolicyRequireResidentKey','master','not specified'),('webAuthnPolicyRequireResidentKeyPasswordless','master','not specified'),('webAuthnPolicyRpEntityName','master','keycloak'),('webAuthnPolicyRpEntityNamePasswordless','master','keycloak'),('webAuthnPolicyRpId','master',''),('webAuthnPolicyRpIdPasswordless','master',''),('webAuthnPolicySignatureAlgorithms','master','ES256'),('webAuthnPolicySignatureAlgorithmsPasswordless','master','ES256'),('webAuthnPolicyUserVerificationRequirement','master','not specified'),('webAuthnPolicyUserVerificationRequirementPasswordless','master','not specified'),('_browser_header.contentSecurityPolicy','master','frame-src \'self\'; frame-ancestors \'self\'; object-src \'none\';'),('_browser_header.contentSecurityPolicyReportOnly','master',''),('_browser_header.strictTransportSecurity','master','max-age=31536000; includeSubDomains'),('_browser_header.xContentTypeOptions','master','nosniff'),('_browser_header.xFrameOptions','master','SAMEORIGIN'),('_browser_header.xRobotsTag','master','none'),('_browser_header.xXSSProtection','master','1; mode=block');
/*!40000 ALTER TABLE `REALM_ATTRIBUTE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REALM_DEFAULT_GROUPS`
--

DROP TABLE IF EXISTS `REALM_DEFAULT_GROUPS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REALM_DEFAULT_GROUPS` (
  `REALM_ID` varchar(36) NOT NULL,
  `GROUP_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`REALM_ID`,`GROUP_ID`),
  UNIQUE KEY `CON_GROUP_ID_DEF_GROUPS` (`GROUP_ID`),
  KEY `IDX_REALM_DEF_GRP_REALM` (`REALM_ID`),
  CONSTRAINT `FK_DEF_GROUPS_REALM` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REALM_DEFAULT_GROUPS`
--

LOCK TABLES `REALM_DEFAULT_GROUPS` WRITE;
/*!40000 ALTER TABLE `REALM_DEFAULT_GROUPS` DISABLE KEYS */;
/*!40000 ALTER TABLE `REALM_DEFAULT_GROUPS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REALM_ENABLED_EVENT_TYPES`
--

DROP TABLE IF EXISTS `REALM_ENABLED_EVENT_TYPES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REALM_ENABLED_EVENT_TYPES` (
  `REALM_ID` varchar(36) NOT NULL,
  `VALUE` varchar(255) NOT NULL,
  PRIMARY KEY (`REALM_ID`,`VALUE`),
  KEY `IDX_REALM_EVT_TYPES_REALM` (`REALM_ID`),
  CONSTRAINT `FK_H846O4H0W8EPX5NWEDRF5Y69J` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REALM_ENABLED_EVENT_TYPES`
--

LOCK TABLES `REALM_ENABLED_EVENT_TYPES` WRITE;
/*!40000 ALTER TABLE `REALM_ENABLED_EVENT_TYPES` DISABLE KEYS */;
/*!40000 ALTER TABLE `REALM_ENABLED_EVENT_TYPES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REALM_EVENTS_LISTENERS`
--

DROP TABLE IF EXISTS `REALM_EVENTS_LISTENERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REALM_EVENTS_LISTENERS` (
  `REALM_ID` varchar(36) NOT NULL,
  `VALUE` varchar(255) NOT NULL,
  PRIMARY KEY (`REALM_ID`,`VALUE`),
  KEY `IDX_REALM_EVT_LIST_REALM` (`REALM_ID`),
  CONSTRAINT `FK_H846O4H0W8EPX5NXEV9F5Y69J` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REALM_EVENTS_LISTENERS`
--

LOCK TABLES `REALM_EVENTS_LISTENERS` WRITE;
/*!40000 ALTER TABLE `REALM_EVENTS_LISTENERS` DISABLE KEYS */;
INSERT INTO `REALM_EVENTS_LISTENERS` (`REALM_ID`, `VALUE`) VALUES ('master','jboss-logging');
/*!40000 ALTER TABLE `REALM_EVENTS_LISTENERS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REALM_LOCALIZATIONS`
--

DROP TABLE IF EXISTS `REALM_LOCALIZATIONS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REALM_LOCALIZATIONS` (
  `REALM_ID` varchar(255) NOT NULL,
  `LOCALE` varchar(255) NOT NULL,
  `TEXTS` longtext CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`REALM_ID`,`LOCALE`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REALM_LOCALIZATIONS`
--

LOCK TABLES `REALM_LOCALIZATIONS` WRITE;
/*!40000 ALTER TABLE `REALM_LOCALIZATIONS` DISABLE KEYS */;
/*!40000 ALTER TABLE `REALM_LOCALIZATIONS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REALM_REQUIRED_CREDENTIAL`
--

DROP TABLE IF EXISTS `REALM_REQUIRED_CREDENTIAL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REALM_REQUIRED_CREDENTIAL` (
  `TYPE` varchar(255) NOT NULL,
  `FORM_LABEL` varchar(255) DEFAULT NULL,
  `INPUT` bit(1) NOT NULL DEFAULT b'0',
  `SECRET` bit(1) NOT NULL DEFAULT b'0',
  `REALM_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`REALM_ID`,`TYPE`),
  CONSTRAINT `FK_5HG65LYBEVAVKQFKI3KPONH9V` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REALM_REQUIRED_CREDENTIAL`
--

LOCK TABLES `REALM_REQUIRED_CREDENTIAL` WRITE;
/*!40000 ALTER TABLE `REALM_REQUIRED_CREDENTIAL` DISABLE KEYS */;
INSERT INTO `REALM_REQUIRED_CREDENTIAL` (`TYPE`, `FORM_LABEL`, `INPUT`, `SECRET`, `REALM_ID`) VALUES ('password','password',_binary '',_binary '','master');
/*!40000 ALTER TABLE `REALM_REQUIRED_CREDENTIAL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REALM_SMTP_CONFIG`
--

DROP TABLE IF EXISTS `REALM_SMTP_CONFIG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REALM_SMTP_CONFIG` (
  `REALM_ID` varchar(36) NOT NULL,
  `VALUE` varchar(255) DEFAULT NULL,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`REALM_ID`,`NAME`),
  CONSTRAINT `FK_70EJ8XDXGXD0B9HH6180IRR0O` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REALM_SMTP_CONFIG`
--

LOCK TABLES `REALM_SMTP_CONFIG` WRITE;
/*!40000 ALTER TABLE `REALM_SMTP_CONFIG` DISABLE KEYS */;
/*!40000 ALTER TABLE `REALM_SMTP_CONFIG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REALM_SUPPORTED_LOCALES`
--

DROP TABLE IF EXISTS `REALM_SUPPORTED_LOCALES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REALM_SUPPORTED_LOCALES` (
  `REALM_ID` varchar(36) NOT NULL,
  `VALUE` varchar(255) NOT NULL,
  PRIMARY KEY (`REALM_ID`,`VALUE`),
  KEY `IDX_REALM_SUPP_LOCAL_REALM` (`REALM_ID`),
  CONSTRAINT `FK_SUPPORTED_LOCALES_REALM` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REALM_SUPPORTED_LOCALES`
--

LOCK TABLES `REALM_SUPPORTED_LOCALES` WRITE;
/*!40000 ALTER TABLE `REALM_SUPPORTED_LOCALES` DISABLE KEYS */;
/*!40000 ALTER TABLE `REALM_SUPPORTED_LOCALES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REDIRECT_URIS`
--

DROP TABLE IF EXISTS `REDIRECT_URIS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REDIRECT_URIS` (
  `CLIENT_ID` varchar(36) NOT NULL,
  `VALUE` varchar(255) NOT NULL,
  PRIMARY KEY (`CLIENT_ID`,`VALUE`),
  KEY `IDX_REDIR_URI_CLIENT` (`CLIENT_ID`),
  CONSTRAINT `FK_1BURS8PB4OUJ97H5WUPPAHV9F` FOREIGN KEY (`CLIENT_ID`) REFERENCES `CLIENT` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REDIRECT_URIS`
--

LOCK TABLES `REDIRECT_URIS` WRITE;
/*!40000 ALTER TABLE `REDIRECT_URIS` DISABLE KEYS */;
INSERT INTO `REDIRECT_URIS` (`CLIENT_ID`, `VALUE`) VALUES ('6351decc-46e5-426e-899d-3135a4dbd6bf','/realms/master/account/*'),('85815b42-9717-42e9-9171-22c7dda14b82','/admin/master/console/*'),('c1e78271-8fc7-4688-b452-16b5609bc5c2','http://localhost'),('d3bc5911-d1c9-4a27-9a65-e1993cee1c29','/realms/master/account/*');
/*!40000 ALTER TABLE `REDIRECT_URIS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REQUIRED_ACTION_CONFIG`
--

DROP TABLE IF EXISTS `REQUIRED_ACTION_CONFIG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REQUIRED_ACTION_CONFIG` (
  `REQUIRED_ACTION_ID` varchar(36) NOT NULL,
  `VALUE` longtext,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`REQUIRED_ACTION_ID`,`NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REQUIRED_ACTION_CONFIG`
--

LOCK TABLES `REQUIRED_ACTION_CONFIG` WRITE;
/*!40000 ALTER TABLE `REQUIRED_ACTION_CONFIG` DISABLE KEYS */;
/*!40000 ALTER TABLE `REQUIRED_ACTION_CONFIG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REQUIRED_ACTION_PROVIDER`
--

DROP TABLE IF EXISTS `REQUIRED_ACTION_PROVIDER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REQUIRED_ACTION_PROVIDER` (
  `ID` varchar(36) NOT NULL,
  `ALIAS` varchar(255) DEFAULT NULL,
  `NAME` varchar(255) DEFAULT NULL,
  `REALM_ID` varchar(36) DEFAULT NULL,
  `ENABLED` bit(1) NOT NULL DEFAULT b'0',
  `DEFAULT_ACTION` bit(1) NOT NULL DEFAULT b'0',
  `PROVIDER_ID` varchar(255) DEFAULT NULL,
  `PRIORITY` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_REQ_ACT_PROV_REALM` (`REALM_ID`),
  CONSTRAINT `FK_REQ_ACT_REALM` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REQUIRED_ACTION_PROVIDER`
--

LOCK TABLES `REQUIRED_ACTION_PROVIDER` WRITE;
/*!40000 ALTER TABLE `REQUIRED_ACTION_PROVIDER` DISABLE KEYS */;
INSERT INTO `REQUIRED_ACTION_PROVIDER` (`ID`, `ALIAS`, `NAME`, `REALM_ID`, `ENABLED`, `DEFAULT_ACTION`, `PROVIDER_ID`, `PRIORITY`) VALUES ('2bc264be-7752-4746-8150-d2cd1a95d519','terms_and_conditions','Terms and Conditions','master',_binary '\0',_binary '\0','terms_and_conditions',20),('39317a3d-de3b-4c18-841c-39942f8bd437','UPDATE_PASSWORD','Update Password','master',_binary '',_binary '\0','UPDATE_PASSWORD',30),('63a63129-271d-46d0-bffe-22119344cae2','VERIFY_EMAIL','Verify Email','master',_binary '',_binary '\0','VERIFY_EMAIL',50),('66fb08eb-2404-4d68-978e-4892c85bf08c','update_user_locale','Update User Locale','master',_binary '',_binary '\0','update_user_locale',1000),('771cb93a-19b7-4079-9bf3-d3b4db0b227f','UPDATE_PROFILE','Update Profile','master',_binary '',_binary '\0','UPDATE_PROFILE',40),('d8040d0f-9d0f-4350-b271-99b66be9ace7','delete_account','Delete Account','master',_binary '\0',_binary '\0','delete_account',60),('ec32e13a-940f-4f2b-87fd-0202c4af1083','CONFIGURE_TOTP','Configure OTP','master',_binary '',_binary '\0','CONFIGURE_TOTP',10);
/*!40000 ALTER TABLE `REQUIRED_ACTION_PROVIDER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RESOURCE_ATTRIBUTE`
--

DROP TABLE IF EXISTS `RESOURCE_ATTRIBUTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RESOURCE_ATTRIBUTE` (
  `ID` varchar(36) NOT NULL DEFAULT 'sybase-needs-something-here',
  `NAME` varchar(255) NOT NULL,
  `VALUE` varchar(255) DEFAULT NULL,
  `RESOURCE_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_5HRM2VLF9QL5FU022KQEPOVBR` (`RESOURCE_ID`),
  CONSTRAINT `FK_5HRM2VLF9QL5FU022KQEPOVBR` FOREIGN KEY (`RESOURCE_ID`) REFERENCES `RESOURCE_SERVER_RESOURCE` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RESOURCE_ATTRIBUTE`
--

LOCK TABLES `RESOURCE_ATTRIBUTE` WRITE;
/*!40000 ALTER TABLE `RESOURCE_ATTRIBUTE` DISABLE KEYS */;
/*!40000 ALTER TABLE `RESOURCE_ATTRIBUTE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RESOURCE_POLICY`
--

DROP TABLE IF EXISTS `RESOURCE_POLICY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RESOURCE_POLICY` (
  `RESOURCE_ID` varchar(36) NOT NULL,
  `POLICY_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`RESOURCE_ID`,`POLICY_ID`),
  KEY `IDX_RES_POLICY_POLICY` (`POLICY_ID`),
  CONSTRAINT `FK_FRSRPOS53XCX4WNKOG82SSRFY` FOREIGN KEY (`RESOURCE_ID`) REFERENCES `RESOURCE_SERVER_RESOURCE` (`ID`),
  CONSTRAINT `FK_FRSRPP213XCX4WNKOG82SSRFY` FOREIGN KEY (`POLICY_ID`) REFERENCES `RESOURCE_SERVER_POLICY` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RESOURCE_POLICY`
--

LOCK TABLES `RESOURCE_POLICY` WRITE;
/*!40000 ALTER TABLE `RESOURCE_POLICY` DISABLE KEYS */;
/*!40000 ALTER TABLE `RESOURCE_POLICY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RESOURCE_SCOPE`
--

DROP TABLE IF EXISTS `RESOURCE_SCOPE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RESOURCE_SCOPE` (
  `RESOURCE_ID` varchar(36) NOT NULL,
  `SCOPE_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`RESOURCE_ID`,`SCOPE_ID`),
  KEY `IDX_RES_SCOPE_SCOPE` (`SCOPE_ID`),
  CONSTRAINT `FK_FRSRPOS13XCX4WNKOG82SSRFY` FOREIGN KEY (`RESOURCE_ID`) REFERENCES `RESOURCE_SERVER_RESOURCE` (`ID`),
  CONSTRAINT `FK_FRSRPS213XCX4WNKOG82SSRFY` FOREIGN KEY (`SCOPE_ID`) REFERENCES `RESOURCE_SERVER_SCOPE` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RESOURCE_SCOPE`
--

LOCK TABLES `RESOURCE_SCOPE` WRITE;
/*!40000 ALTER TABLE `RESOURCE_SCOPE` DISABLE KEYS */;
/*!40000 ALTER TABLE `RESOURCE_SCOPE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RESOURCE_SERVER`
--

DROP TABLE IF EXISTS `RESOURCE_SERVER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RESOURCE_SERVER` (
  `ID` varchar(36) NOT NULL,
  `ALLOW_RS_REMOTE_MGMT` bit(1) NOT NULL DEFAULT b'0',
  `POLICY_ENFORCE_MODE` varchar(15) NOT NULL,
  `DECISION_STRATEGY` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RESOURCE_SERVER`
--

LOCK TABLES `RESOURCE_SERVER` WRITE;
/*!40000 ALTER TABLE `RESOURCE_SERVER` DISABLE KEYS */;
/*!40000 ALTER TABLE `RESOURCE_SERVER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RESOURCE_SERVER_PERM_TICKET`
--

DROP TABLE IF EXISTS `RESOURCE_SERVER_PERM_TICKET`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RESOURCE_SERVER_PERM_TICKET` (
  `ID` varchar(36) NOT NULL,
  `OWNER` varchar(255) DEFAULT NULL,
  `REQUESTER` varchar(255) DEFAULT NULL,
  `CREATED_TIMESTAMP` bigint(20) NOT NULL,
  `GRANTED_TIMESTAMP` bigint(20) DEFAULT NULL,
  `RESOURCE_ID` varchar(36) NOT NULL,
  `SCOPE_ID` varchar(36) DEFAULT NULL,
  `RESOURCE_SERVER_ID` varchar(36) NOT NULL,
  `POLICY_ID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_FRSR6T700S9V50BU18WS5PMT` (`OWNER`,`REQUESTER`,`RESOURCE_SERVER_ID`,`RESOURCE_ID`,`SCOPE_ID`),
  KEY `FK_FRSRHO213XCX4WNKOG82SSPMT` (`RESOURCE_SERVER_ID`),
  KEY `FK_FRSRHO213XCX4WNKOG83SSPMT` (`RESOURCE_ID`),
  KEY `FK_FRSRHO213XCX4WNKOG84SSPMT` (`SCOPE_ID`),
  KEY `FK_FRSRPO2128CX4WNKOG82SSRFY` (`POLICY_ID`),
  CONSTRAINT `FK_FRSRHO213XCX4WNKOG82SSPMT` FOREIGN KEY (`RESOURCE_SERVER_ID`) REFERENCES `RESOURCE_SERVER` (`ID`),
  CONSTRAINT `FK_FRSRHO213XCX4WNKOG83SSPMT` FOREIGN KEY (`RESOURCE_ID`) REFERENCES `RESOURCE_SERVER_RESOURCE` (`ID`),
  CONSTRAINT `FK_FRSRHO213XCX4WNKOG84SSPMT` FOREIGN KEY (`SCOPE_ID`) REFERENCES `RESOURCE_SERVER_SCOPE` (`ID`),
  CONSTRAINT `FK_FRSRPO2128CX4WNKOG82SSRFY` FOREIGN KEY (`POLICY_ID`) REFERENCES `RESOURCE_SERVER_POLICY` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RESOURCE_SERVER_PERM_TICKET`
--

LOCK TABLES `RESOURCE_SERVER_PERM_TICKET` WRITE;
/*!40000 ALTER TABLE `RESOURCE_SERVER_PERM_TICKET` DISABLE KEYS */;
/*!40000 ALTER TABLE `RESOURCE_SERVER_PERM_TICKET` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RESOURCE_SERVER_POLICY`
--

DROP TABLE IF EXISTS `RESOURCE_SERVER_POLICY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RESOURCE_SERVER_POLICY` (
  `ID` varchar(36) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `DESCRIPTION` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `TYPE` varchar(255) NOT NULL,
  `DECISION_STRATEGY` varchar(20) DEFAULT NULL,
  `LOGIC` varchar(20) DEFAULT NULL,
  `RESOURCE_SERVER_ID` varchar(36) DEFAULT NULL,
  `OWNER` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_FRSRPT700S9V50BU18WS5HA6` (`NAME`,`RESOURCE_SERVER_ID`),
  KEY `IDX_RES_SERV_POL_RES_SERV` (`RESOURCE_SERVER_ID`),
  CONSTRAINT `FK_FRSRPO213XCX4WNKOG82SSRFY` FOREIGN KEY (`RESOURCE_SERVER_ID`) REFERENCES `RESOURCE_SERVER` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RESOURCE_SERVER_POLICY`
--

LOCK TABLES `RESOURCE_SERVER_POLICY` WRITE;
/*!40000 ALTER TABLE `RESOURCE_SERVER_POLICY` DISABLE KEYS */;
/*!40000 ALTER TABLE `RESOURCE_SERVER_POLICY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RESOURCE_SERVER_RESOURCE`
--

DROP TABLE IF EXISTS `RESOURCE_SERVER_RESOURCE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RESOURCE_SERVER_RESOURCE` (
  `ID` varchar(36) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `TYPE` varchar(255) DEFAULT NULL,
  `ICON_URI` varchar(255) DEFAULT NULL,
  `OWNER` varchar(255) DEFAULT NULL,
  `RESOURCE_SERVER_ID` varchar(36) DEFAULT NULL,
  `OWNER_MANAGED_ACCESS` bit(1) NOT NULL DEFAULT b'0',
  `DISPLAY_NAME` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_FRSR6T700S9V50BU18WS5HA6` (`NAME`,`OWNER`,`RESOURCE_SERVER_ID`),
  KEY `IDX_RES_SRV_RES_RES_SRV` (`RESOURCE_SERVER_ID`),
  CONSTRAINT `FK_FRSRHO213XCX4WNKOG82SSRFY` FOREIGN KEY (`RESOURCE_SERVER_ID`) REFERENCES `RESOURCE_SERVER` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RESOURCE_SERVER_RESOURCE`
--

LOCK TABLES `RESOURCE_SERVER_RESOURCE` WRITE;
/*!40000 ALTER TABLE `RESOURCE_SERVER_RESOURCE` DISABLE KEYS */;
/*!40000 ALTER TABLE `RESOURCE_SERVER_RESOURCE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RESOURCE_SERVER_SCOPE`
--

DROP TABLE IF EXISTS `RESOURCE_SERVER_SCOPE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RESOURCE_SERVER_SCOPE` (
  `ID` varchar(36) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `ICON_URI` varchar(255) DEFAULT NULL,
  `RESOURCE_SERVER_ID` varchar(36) DEFAULT NULL,
  `DISPLAY_NAME` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_FRSRST700S9V50BU18WS5HA6` (`NAME`,`RESOURCE_SERVER_ID`),
  KEY `IDX_RES_SRV_SCOPE_RES_SRV` (`RESOURCE_SERVER_ID`),
  CONSTRAINT `FK_FRSRSO213XCX4WNKOG82SSRFY` FOREIGN KEY (`RESOURCE_SERVER_ID`) REFERENCES `RESOURCE_SERVER` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RESOURCE_SERVER_SCOPE`
--

LOCK TABLES `RESOURCE_SERVER_SCOPE` WRITE;
/*!40000 ALTER TABLE `RESOURCE_SERVER_SCOPE` DISABLE KEYS */;
/*!40000 ALTER TABLE `RESOURCE_SERVER_SCOPE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RESOURCE_URIS`
--

DROP TABLE IF EXISTS `RESOURCE_URIS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RESOURCE_URIS` (
  `RESOURCE_ID` varchar(36) NOT NULL,
  `VALUE` varchar(255) NOT NULL,
  PRIMARY KEY (`RESOURCE_ID`,`VALUE`),
  CONSTRAINT `FK_RESOURCE_SERVER_URIS` FOREIGN KEY (`RESOURCE_ID`) REFERENCES `RESOURCE_SERVER_RESOURCE` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RESOURCE_URIS`
--

LOCK TABLES `RESOURCE_URIS` WRITE;
/*!40000 ALTER TABLE `RESOURCE_URIS` DISABLE KEYS */;
/*!40000 ALTER TABLE `RESOURCE_URIS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ROLE_ATTRIBUTE`
--

DROP TABLE IF EXISTS `ROLE_ATTRIBUTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ROLE_ATTRIBUTE` (
  `ID` varchar(36) NOT NULL,
  `ROLE_ID` varchar(36) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `VALUE` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_ROLE_ATTRIBUTE` (`ROLE_ID`),
  CONSTRAINT `FK_ROLE_ATTRIBUTE_ID` FOREIGN KEY (`ROLE_ID`) REFERENCES `KEYCLOAK_ROLE` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ROLE_ATTRIBUTE`
--

LOCK TABLES `ROLE_ATTRIBUTE` WRITE;
/*!40000 ALTER TABLE `ROLE_ATTRIBUTE` DISABLE KEYS */;
/*!40000 ALTER TABLE `ROLE_ATTRIBUTE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SCOPE_MAPPING`
--

DROP TABLE IF EXISTS `SCOPE_MAPPING`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SCOPE_MAPPING` (
  `CLIENT_ID` varchar(36) NOT NULL,
  `ROLE_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`CLIENT_ID`,`ROLE_ID`),
  KEY `IDX_SCOPE_MAPPING_ROLE` (`ROLE_ID`),
  CONSTRAINT `FK_OUSE064PLMLR732LXJCN1Q5F1` FOREIGN KEY (`CLIENT_ID`) REFERENCES `CLIENT` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SCOPE_MAPPING`
--

LOCK TABLES `SCOPE_MAPPING` WRITE;
/*!40000 ALTER TABLE `SCOPE_MAPPING` DISABLE KEYS */;
INSERT INTO `SCOPE_MAPPING` (`CLIENT_ID`, `ROLE_ID`) VALUES ('d3bc5911-d1c9-4a27-9a65-e1993cee1c29','65c3d650-1179-408b-b231-3221b93f2f42');
/*!40000 ALTER TABLE `SCOPE_MAPPING` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SCOPE_POLICY`
--

DROP TABLE IF EXISTS `SCOPE_POLICY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SCOPE_POLICY` (
  `SCOPE_ID` varchar(36) NOT NULL,
  `POLICY_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`SCOPE_ID`,`POLICY_ID`),
  KEY `IDX_SCOPE_POLICY_POLICY` (`POLICY_ID`),
  CONSTRAINT `FK_FRSRASP13XCX4WNKOG82SSRFY` FOREIGN KEY (`POLICY_ID`) REFERENCES `RESOURCE_SERVER_POLICY` (`ID`),
  CONSTRAINT `FK_FRSRPASS3XCX4WNKOG82SSRFY` FOREIGN KEY (`SCOPE_ID`) REFERENCES `RESOURCE_SERVER_SCOPE` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SCOPE_POLICY`
--

LOCK TABLES `SCOPE_POLICY` WRITE;
/*!40000 ALTER TABLE `SCOPE_POLICY` DISABLE KEYS */;
/*!40000 ALTER TABLE `SCOPE_POLICY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USERNAME_LOGIN_FAILURE`
--

DROP TABLE IF EXISTS `USERNAME_LOGIN_FAILURE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USERNAME_LOGIN_FAILURE` (
  `REALM_ID` varchar(36) NOT NULL,
  `USERNAME` varchar(255) CHARACTER SET utf8 NOT NULL,
  `FAILED_LOGIN_NOT_BEFORE` int(11) DEFAULT NULL,
  `LAST_FAILURE` bigint(20) DEFAULT NULL,
  `LAST_IP_FAILURE` varchar(255) DEFAULT NULL,
  `NUM_FAILURES` int(11) DEFAULT NULL,
  PRIMARY KEY (`REALM_ID`,`USERNAME`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USERNAME_LOGIN_FAILURE`
--

LOCK TABLES `USERNAME_LOGIN_FAILURE` WRITE;
/*!40000 ALTER TABLE `USERNAME_LOGIN_FAILURE` DISABLE KEYS */;
/*!40000 ALTER TABLE `USERNAME_LOGIN_FAILURE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_ATTRIBUTE`
--

DROP TABLE IF EXISTS `USER_ATTRIBUTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_ATTRIBUTE` (
  `NAME` varchar(255) NOT NULL,
  `VALUE` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `USER_ID` varchar(36) NOT NULL,
  `ID` varchar(36) NOT NULL DEFAULT 'sybase-needs-something-here',
  PRIMARY KEY (`ID`),
  KEY `IDX_USER_ATTRIBUTE` (`USER_ID`),
  KEY `IDX_USER_ATTRIBUTE_NAME` (`NAME`,`VALUE`),
  CONSTRAINT `FK_5HRM2VLF9QL5FU043KQEPOVBR` FOREIGN KEY (`USER_ID`) REFERENCES `USER_ENTITY` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_ATTRIBUTE`
--

LOCK TABLES `USER_ATTRIBUTE` WRITE;
/*!40000 ALTER TABLE `USER_ATTRIBUTE` DISABLE KEYS */;
/*!40000 ALTER TABLE `USER_ATTRIBUTE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_CONSENT`
--

DROP TABLE IF EXISTS `USER_CONSENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_CONSENT` (
  `ID` varchar(36) NOT NULL,
  `CLIENT_ID` varchar(255) DEFAULT NULL,
  `USER_ID` varchar(36) NOT NULL,
  `CREATED_DATE` bigint(20) DEFAULT NULL,
  `LAST_UPDATED_DATE` bigint(20) DEFAULT NULL,
  `CLIENT_STORAGE_PROVIDER` varchar(36) DEFAULT NULL,
  `EXTERNAL_CLIENT_ID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_JKUWUVD56ONTGSUHOGM8UEWRT` (`CLIENT_ID`,`CLIENT_STORAGE_PROVIDER`,`EXTERNAL_CLIENT_ID`,`USER_ID`),
  KEY `IDX_USER_CONSENT` (`USER_ID`),
  CONSTRAINT `FK_GRNTCSNT_USER` FOREIGN KEY (`USER_ID`) REFERENCES `USER_ENTITY` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_CONSENT`
--

LOCK TABLES `USER_CONSENT` WRITE;
/*!40000 ALTER TABLE `USER_CONSENT` DISABLE KEYS */;
/*!40000 ALTER TABLE `USER_CONSENT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_CONSENT_CLIENT_SCOPE`
--

DROP TABLE IF EXISTS `USER_CONSENT_CLIENT_SCOPE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_CONSENT_CLIENT_SCOPE` (
  `USER_CONSENT_ID` varchar(36) NOT NULL,
  `SCOPE_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`USER_CONSENT_ID`,`SCOPE_ID`),
  KEY `IDX_USCONSENT_CLSCOPE` (`USER_CONSENT_ID`),
  CONSTRAINT `FK_GRNTCSNT_CLSC_USC` FOREIGN KEY (`USER_CONSENT_ID`) REFERENCES `USER_CONSENT` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_CONSENT_CLIENT_SCOPE`
--

LOCK TABLES `USER_CONSENT_CLIENT_SCOPE` WRITE;
/*!40000 ALTER TABLE `USER_CONSENT_CLIENT_SCOPE` DISABLE KEYS */;
/*!40000 ALTER TABLE `USER_CONSENT_CLIENT_SCOPE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_ENTITY`
--

DROP TABLE IF EXISTS `USER_ENTITY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_ENTITY` (
  `ID` varchar(36) NOT NULL,
  `EMAIL` varchar(255) DEFAULT NULL,
  `EMAIL_CONSTRAINT` varchar(255) DEFAULT NULL,
  `EMAIL_VERIFIED` bit(1) NOT NULL DEFAULT b'0',
  `ENABLED` bit(1) NOT NULL DEFAULT b'0',
  `FEDERATION_LINK` varchar(255) DEFAULT NULL,
  `FIRST_NAME` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `LAST_NAME` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `REALM_ID` varchar(255) DEFAULT NULL,
  `USERNAME` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `CREATED_TIMESTAMP` bigint(20) DEFAULT NULL,
  `SERVICE_ACCOUNT_CLIENT_LINK` varchar(255) DEFAULT NULL,
  `NOT_BEFORE` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UK_DYKN684SL8UP1CRFEI6ECKHD7` (`REALM_ID`,`EMAIL_CONSTRAINT`),
  UNIQUE KEY `UK_RU8TT6T700S9V50BU18WS5HA6` (`REALM_ID`,`USERNAME`),
  KEY `IDX_USER_EMAIL` (`EMAIL`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_ENTITY`
--

LOCK TABLES `USER_ENTITY` WRITE;
/*!40000 ALTER TABLE `USER_ENTITY` DISABLE KEYS */;
INSERT INTO `USER_ENTITY` (`ID`, `EMAIL`, `EMAIL_CONSTRAINT`, `EMAIL_VERIFIED`, `ENABLED`, `FEDERATION_LINK`, `FIRST_NAME`, `LAST_NAME`, `REALM_ID`, `USERNAME`, `CREATED_TIMESTAMP`, `SERVICE_ACCOUNT_CLIENT_LINK`, `NOT_BEFORE`) VALUES ('16da2716-bede-4645-9eac-f10bba0a759a','staff@gmail.com','staff@gmail.com',_binary '',_binary '',NULL,'Staff','One','master','staff',1663328478898,NULL,0),('1d7924f9-03b4-4e50-ac7a-5a547e09db41','librarian3@gmail.com','librarian3@gmail.com',_binary '',_binary '',NULL,'Librarian','Three','master','librarian3',1663328559759,NULL,0),('35e5b878-abde-4350-a329-af8672c514c2',NULL,'117dacd5-8cb4-425a-82fa-5b5ef6c72089',_binary '\0',_binary '',NULL,NULL,NULL,'master','admin',1663318342122,NULL,0),('3ab93c0b-6f95-450f-ac54-5b0b6c0e1fca','librarian@gmail.com','librarian@gmail.com',_binary '',_binary '',NULL,'Librarian','One','master','librarian',1663328446758,NULL,0),('565e9ddc-5b14-4d4b-9a5e-048d6990c501','staff2@gmail.com','staff2@gmail.com',_binary '',_binary '',NULL,'Staff','Two','master','staff2',1663328527426,NULL,0),('5e1f7d10-4bb2-4699-9baf-bf7c682e120a','tanpm@gmail.com','tanpm@gmail.com',_binary '',_binary '',NULL,'Tan','Pham','master','tanpm',1663328343419,NULL,0),('8ccc547c-7943-445e-b09e-1583e761e7ba','librarian2@gmail.com','librarian2@gmail.com',_binary '',_binary '',NULL,'Librarian','Two','master','librarian2',1663328505607,NULL,0),('9acd6e17-ed1e-4590-ba9c-e665fa6f375b','bangnn@gmail.com','bangnn@gmail.com',_binary '',_binary '',NULL,'Bang','Ngo','master','bangnn',1663328377505,NULL,0),('a06c284b-4944-49bd-afb0-c899f733446e','longnv@gmail.com','longnv@gmail.com',_binary '',_binary '',NULL,'Long','Nguyen','master','longnv',1663328614124,NULL,0),('a595d7a3-8ff1-45c0-a8e3-e8ad1c2e944a','staff3@gmail.com','staff3@gmail.com',_binary '',_binary '',NULL,'Staff','Three','master','staff3',1663328579710,NULL,0),('eb662d55-d51a-42bf-83fb-95c709026e2e','lanlnh@gmail.com','lanlnh@gmail.com',_binary '',_binary '',NULL,'Lan','Le','master','lanlnh',1663328426498,NULL,0),('f12649c3-3d0a-42ee-9e7e-e7b3cdfe5625','nghiemtd@gmail.com','nghiemtd@gmail.com',_binary '',_binary '',NULL,'Nghiem','Tran','master','nghiemtd',1663328399060,NULL,0);
/*!40000 ALTER TABLE `USER_ENTITY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_FEDERATION_CONFIG`
--

DROP TABLE IF EXISTS `USER_FEDERATION_CONFIG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_FEDERATION_CONFIG` (
  `USER_FEDERATION_PROVIDER_ID` varchar(36) NOT NULL,
  `VALUE` varchar(255) DEFAULT NULL,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`USER_FEDERATION_PROVIDER_ID`,`NAME`),
  CONSTRAINT `FK_T13HPU1J94R2EBPEKR39X5EU5` FOREIGN KEY (`USER_FEDERATION_PROVIDER_ID`) REFERENCES `USER_FEDERATION_PROVIDER` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_FEDERATION_CONFIG`
--

LOCK TABLES `USER_FEDERATION_CONFIG` WRITE;
/*!40000 ALTER TABLE `USER_FEDERATION_CONFIG` DISABLE KEYS */;
/*!40000 ALTER TABLE `USER_FEDERATION_CONFIG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_FEDERATION_MAPPER`
--

DROP TABLE IF EXISTS `USER_FEDERATION_MAPPER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_FEDERATION_MAPPER` (
  `ID` varchar(36) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `FEDERATION_PROVIDER_ID` varchar(36) NOT NULL,
  `FEDERATION_MAPPER_TYPE` varchar(255) NOT NULL,
  `REALM_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_USR_FED_MAP_FED_PRV` (`FEDERATION_PROVIDER_ID`),
  KEY `IDX_USR_FED_MAP_REALM` (`REALM_ID`),
  CONSTRAINT `FK_FEDMAPPERPM_FEDPRV` FOREIGN KEY (`FEDERATION_PROVIDER_ID`) REFERENCES `USER_FEDERATION_PROVIDER` (`ID`),
  CONSTRAINT `FK_FEDMAPPERPM_REALM` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_FEDERATION_MAPPER`
--

LOCK TABLES `USER_FEDERATION_MAPPER` WRITE;
/*!40000 ALTER TABLE `USER_FEDERATION_MAPPER` DISABLE KEYS */;
/*!40000 ALTER TABLE `USER_FEDERATION_MAPPER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_FEDERATION_MAPPER_CONFIG`
--

DROP TABLE IF EXISTS `USER_FEDERATION_MAPPER_CONFIG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_FEDERATION_MAPPER_CONFIG` (
  `USER_FEDERATION_MAPPER_ID` varchar(36) NOT NULL,
  `VALUE` varchar(255) DEFAULT NULL,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`USER_FEDERATION_MAPPER_ID`,`NAME`),
  CONSTRAINT `FK_FEDMAPPER_CFG` FOREIGN KEY (`USER_FEDERATION_MAPPER_ID`) REFERENCES `USER_FEDERATION_MAPPER` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_FEDERATION_MAPPER_CONFIG`
--

LOCK TABLES `USER_FEDERATION_MAPPER_CONFIG` WRITE;
/*!40000 ALTER TABLE `USER_FEDERATION_MAPPER_CONFIG` DISABLE KEYS */;
/*!40000 ALTER TABLE `USER_FEDERATION_MAPPER_CONFIG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_FEDERATION_PROVIDER`
--

DROP TABLE IF EXISTS `USER_FEDERATION_PROVIDER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_FEDERATION_PROVIDER` (
  `ID` varchar(36) NOT NULL,
  `CHANGED_SYNC_PERIOD` int(11) DEFAULT NULL,
  `DISPLAY_NAME` varchar(255) DEFAULT NULL,
  `FULL_SYNC_PERIOD` int(11) DEFAULT NULL,
  `LAST_SYNC` int(11) DEFAULT NULL,
  `PRIORITY` int(11) DEFAULT NULL,
  `PROVIDER_NAME` varchar(255) DEFAULT NULL,
  `REALM_ID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDX_USR_FED_PRV_REALM` (`REALM_ID`),
  CONSTRAINT `FK_1FJ32F6PTOLW2QY60CD8N01E8` FOREIGN KEY (`REALM_ID`) REFERENCES `REALM` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_FEDERATION_PROVIDER`
--

LOCK TABLES `USER_FEDERATION_PROVIDER` WRITE;
/*!40000 ALTER TABLE `USER_FEDERATION_PROVIDER` DISABLE KEYS */;
/*!40000 ALTER TABLE `USER_FEDERATION_PROVIDER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_GROUP_MEMBERSHIP`
--

DROP TABLE IF EXISTS `USER_GROUP_MEMBERSHIP`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_GROUP_MEMBERSHIP` (
  `GROUP_ID` varchar(36) NOT NULL,
  `USER_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`GROUP_ID`,`USER_ID`),
  KEY `IDX_USER_GROUP_MAPPING` (`USER_ID`),
  CONSTRAINT `FK_USER_GROUP_USER` FOREIGN KEY (`USER_ID`) REFERENCES `USER_ENTITY` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_GROUP_MEMBERSHIP`
--

LOCK TABLES `USER_GROUP_MEMBERSHIP` WRITE;
/*!40000 ALTER TABLE `USER_GROUP_MEMBERSHIP` DISABLE KEYS */;
/*!40000 ALTER TABLE `USER_GROUP_MEMBERSHIP` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_REQUIRED_ACTION`
--

DROP TABLE IF EXISTS `USER_REQUIRED_ACTION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_REQUIRED_ACTION` (
  `USER_ID` varchar(36) NOT NULL,
  `REQUIRED_ACTION` varchar(255) NOT NULL DEFAULT ' ',
  PRIMARY KEY (`REQUIRED_ACTION`,`USER_ID`),
  KEY `IDX_USER_REQACTIONS` (`USER_ID`),
  CONSTRAINT `FK_6QJ3W1JW9CVAFHE19BWSIUVMD` FOREIGN KEY (`USER_ID`) REFERENCES `USER_ENTITY` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_REQUIRED_ACTION`
--

LOCK TABLES `USER_REQUIRED_ACTION` WRITE;
/*!40000 ALTER TABLE `USER_REQUIRED_ACTION` DISABLE KEYS */;
/*!40000 ALTER TABLE `USER_REQUIRED_ACTION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_ROLE_MAPPING`
--

DROP TABLE IF EXISTS `USER_ROLE_MAPPING`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_ROLE_MAPPING` (
  `ROLE_ID` varchar(255) NOT NULL,
  `USER_ID` varchar(36) NOT NULL,
  PRIMARY KEY (`ROLE_ID`,`USER_ID`),
  KEY `IDX_USER_ROLE_MAPPING` (`USER_ID`),
  CONSTRAINT `FK_C4FQV34P1MBYLLOXANG7B1Q3L` FOREIGN KEY (`USER_ID`) REFERENCES `USER_ENTITY` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_ROLE_MAPPING`
--

LOCK TABLES `USER_ROLE_MAPPING` WRITE;
/*!40000 ALTER TABLE `USER_ROLE_MAPPING` DISABLE KEYS */;
INSERT INTO `USER_ROLE_MAPPING` (`ROLE_ID`, `USER_ID`) VALUES ('f186e5ea-ba20-48e0-82dc-2196d62cbe6a','16da2716-bede-4645-9eac-f10bba0a759a'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','16da2716-bede-4645-9eac-f10bba0a759a'),('0be21b74-d145-41e0-bb8d-8900a63d4751','1d7924f9-03b4-4e50-ac7a-5a547e09db41'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','1d7924f9-03b4-4e50-ac7a-5a547e09db41'),('fc169503-3954-4fda-85db-dc29c7e45e52','35e5b878-abde-4350-a329-af8672c514c2'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','35e5b878-abde-4350-a329-af8672c514c2'),('0be21b74-d145-41e0-bb8d-8900a63d4751','3ab93c0b-6f95-450f-ac54-5b0b6c0e1fca'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','3ab93c0b-6f95-450f-ac54-5b0b6c0e1fca'),('f186e5ea-ba20-48e0-82dc-2196d62cbe6a','565e9ddc-5b14-4d4b-9a5e-048d6990c501'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','565e9ddc-5b14-4d4b-9a5e-048d6990c501'),('ed3feb67-23d7-406e-8950-c1cf2fb96c62','5e1f7d10-4bb2-4699-9baf-bf7c682e120a'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','5e1f7d10-4bb2-4699-9baf-bf7c682e120a'),('0be21b74-d145-41e0-bb8d-8900a63d4751','8ccc547c-7943-445e-b09e-1583e761e7ba'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','8ccc547c-7943-445e-b09e-1583e761e7ba'),('ed3feb67-23d7-406e-8950-c1cf2fb96c62','9acd6e17-ed1e-4590-ba9c-e665fa6f375b'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','9acd6e17-ed1e-4590-ba9c-e665fa6f375b'),('ed3feb67-23d7-406e-8950-c1cf2fb96c62','a06c284b-4944-49bd-afb0-c899f733446e'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','a06c284b-4944-49bd-afb0-c899f733446e'),('f186e5ea-ba20-48e0-82dc-2196d62cbe6a','a595d7a3-8ff1-45c0-a8e3-e8ad1c2e944a'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','a595d7a3-8ff1-45c0-a8e3-e8ad1c2e944a'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','eb662d55-d51a-42bf-83fb-95c709026e2e'),('fd12a47c-e041-41f5-9627-1cbbab172f8b','f12649c3-3d0a-42ee-9e7e-e7b3cdfe5625');
/*!40000 ALTER TABLE `USER_ROLE_MAPPING` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_SESSION`
--

DROP TABLE IF EXISTS `USER_SESSION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_SESSION` (
  `ID` varchar(36) NOT NULL,
  `AUTH_METHOD` varchar(255) DEFAULT NULL,
  `IP_ADDRESS` varchar(255) DEFAULT NULL,
  `LAST_SESSION_REFRESH` int(11) DEFAULT NULL,
  `LOGIN_USERNAME` varchar(255) DEFAULT NULL,
  `REALM_ID` varchar(255) DEFAULT NULL,
  `REMEMBER_ME` bit(1) NOT NULL DEFAULT b'0',
  `STARTED` int(11) DEFAULT NULL,
  `USER_ID` varchar(255) DEFAULT NULL,
  `USER_SESSION_STATE` int(11) DEFAULT NULL,
  `BROKER_SESSION_ID` varchar(255) DEFAULT NULL,
  `BROKER_USER_ID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_SESSION`
--

LOCK TABLES `USER_SESSION` WRITE;
/*!40000 ALTER TABLE `USER_SESSION` DISABLE KEYS */;
/*!40000 ALTER TABLE `USER_SESSION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_SESSION_NOTE`
--

DROP TABLE IF EXISTS `USER_SESSION_NOTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_SESSION_NOTE` (
  `USER_SESSION` varchar(36) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `VALUE` varchar(2048) DEFAULT NULL,
  PRIMARY KEY (`USER_SESSION`,`NAME`),
  CONSTRAINT `FK5EDFB00FF51D3472` FOREIGN KEY (`USER_SESSION`) REFERENCES `USER_SESSION` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_SESSION_NOTE`
--

LOCK TABLES `USER_SESSION_NOTE` WRITE;
/*!40000 ALTER TABLE `USER_SESSION_NOTE` DISABLE KEYS */;
/*!40000 ALTER TABLE `USER_SESSION_NOTE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WEB_ORIGINS`
--

DROP TABLE IF EXISTS `WEB_ORIGINS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WEB_ORIGINS` (
  `CLIENT_ID` varchar(36) NOT NULL,
  `VALUE` varchar(255) NOT NULL,
  PRIMARY KEY (`CLIENT_ID`,`VALUE`),
  KEY `IDX_WEB_ORIG_CLIENT` (`CLIENT_ID`),
  CONSTRAINT `FK_LOJPHO213XCX4WNKOG82SSRFY` FOREIGN KEY (`CLIENT_ID`) REFERENCES `CLIENT` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WEB_ORIGINS`
--

LOCK TABLES `WEB_ORIGINS` WRITE;
/*!40000 ALTER TABLE `WEB_ORIGINS` DISABLE KEYS */;
INSERT INTO `WEB_ORIGINS` (`CLIENT_ID`, `VALUE`) VALUES ('85815b42-9717-42e9-9171-22c7dda14b82','+');
/*!40000 ALTER TABLE `WEB_ORIGINS` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-09-16 20:59:22
