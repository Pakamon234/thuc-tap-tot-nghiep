-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: user_management_db
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `user_management_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `user_management_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `user_management_db`;

--
-- Table structure for table `canho`
--

DROP TABLE IF EXISTS `canho`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `canho` (
  `maCanHo` varchar(255) NOT NULL,
  `toaNha` varchar(255) NOT NULL,
  `tang` varchar(255) NOT NULL,
  `dienTich` float NOT NULL,
  PRIMARY KEY (`maCanHo`),
  CONSTRAINT `canho_chk_1` CHECK ((`dienTich` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canho`
--

LOCK TABLES `canho` WRITE;
/*!40000 ALTER TABLE `canho` DISABLE KEYS */;
INSERT INTO `canho` VALUES ('CH_TEST_01','Tòa A','10',85.5),('CH_TEST_02','Tòa A','05',70),('CH_TEST_03','Tòa B','12',100.2),('CH_TEST_04','Tòa C','03',60),('CH_TEST_05','Tòa B','08',95);
/*!40000 ALTER TABLE `canho` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cudan`
--

DROP TABLE IF EXISTS `cudan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cudan` (
  `id` bigint NOT NULL,
  `hoTen` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `soDienThoai` varchar(255) DEFAULT NULL,
  `ngaySinh` date DEFAULT NULL,
  `CCCD` varchar(255) DEFAULT NULL,
  `Diachi` varchar(255) DEFAULT NULL,
  `maCanHo` varchar(255) NOT NULL,
  `trangThai` enum('ở','không ở nữa') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `maCanHo` (`maCanHo`),
  CONSTRAINT `cudan_ibfk_1` FOREIGN KEY (`id`) REFERENCES `taikhoan` (`id`),
  CONSTRAINT `cudan_ibfk_2` FOREIGN KEY (`maCanHo`) REFERENCES `canho` (`maCanHo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cudan`
--

LOCK TABLES `cudan` WRITE;
/*!40000 ALTER TABLE `cudan` DISABLE KEYS */;
INSERT INTO `cudan` VALUES (2,'Lê Văn Test Cư Dân','resident.test@example.com','0912345678','1992-07-01','987654321098','456 Đường XYZ, Quận ABC','CH_TEST_01','ở'),(10,'Nguyễn Thành Long','tgddtn05111@gmail.com','0327180211','2003-11-09','054203000357','quận 9','CH_TEST_01','ở'),(11,'Nguyễn THành LOng','tgddtn05111@gmail.com','0327180211','2003-11-09','054203000356',NULL,'CH_TEST_01','ở'),(12,'Ngô thành an','pakamon032@gmail.com','0327180222','2003-11-09','054203000258','quận 9','CH_TEST_03','ở'),(15,'Nguyễn Thành Longg','tgddtn05111s@gmail.com','0327180277','2003-11-09','054203000355',NULL,'CH_TEST_01','ở');
/*!40000 ALTER TABLE `cudan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhanvienbql`
--

DROP TABLE IF EXISTS `nhanvienbql`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhanvienbql` (
  `id` bigint NOT NULL,
  `hoTen` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `soDienThoai` varchar(255) DEFAULT NULL,
  `CCCD` varchar(255) DEFAULT NULL,
  `ngaySinh` date DEFAULT NULL,
  `trangThai` enum('Đang làm việc','Đã nghỉ việc','Tạm ngưng') NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `nhanvienbql_ibfk_1` FOREIGN KEY (`id`) REFERENCES `taikhoan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhanvienbql`
--

LOCK TABLES `nhanvienbql` WRITE;
/*!40000 ALTER TABLE `nhanvienbql` DISABLE KEYS */;
INSERT INTO `nhanvienbql` VALUES (1,'Nguyễn Thị Test BQL','bql.test@example.com','0987654321','123456789012','1985-01-20','Đang làm việc');
/*!40000 ALTER TABLE `nhanvienbql` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taikhoan`
--

DROP TABLE IF EXISTS `taikhoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taikhoan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tenDangNhap` varchar(255) NOT NULL,
  `matKhauHash` varchar(255) NOT NULL,
  `loaiTaiKhoan` varchar(255) DEFAULT NULL,
  `trangThai` varchar(255) DEFAULT NULL,
  `ngayDangKy` datetime(6) NOT NULL,
  `ngayCapNhat` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenDangNhap` (`tenDangNhap`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taikhoan`
--

LOCK TABLES `taikhoan` WRITE;
/*!40000 ALTER TABLE `taikhoan` DISABLE KEYS */;
INSERT INTO `taikhoan` VALUES (1,'admin1','$2a$12$6kC1f5/LUi2FZv8ChOj0tufIfBk0UGmCX0mqCHIna2IOb3HP9Jmu.','BQL','Đang hoạt động','2025-08-01 00:00:00.000000',NULL),(2,'cudan1','$2a$12$6kC1f5/LUi2FZv8ChOj0tufIfBk0UGmCX0mqCHIna2IOb3HP9Jmu.','CuDan','Đang hoạt động','2025-08-01 00:00:00.000000',NULL),(10,'cudan02','$2a$10$TgwAIQSS.MWQQHSX8I9r/eGjlWDqgV77axUbtLB6eBwO4pWyIpZGa','CuDan','Chờ duyệt','2025-08-12 19:49:10.583000',NULL),(11,'pakamon','$2a$10$iEBU4Eld76Se7E08XrFqBuJ6rHKIb0eNZs0/RQ631ceG0VrLmGbti','CuDan','Chờ duyệt','2025-08-21 05:05:20.992000',NULL),(12,'pakamon032','$2a$10$2PROU8oIMfmxXp0j9T0p4.gWMOXpfcVbnO7QeTGdmnlkaogjEuPg.','CuDan','Đang hoạt động','2025-08-21 05:12:53.061000',NULL),(13,'pakamon022','$2a$10$owOee0rAI8f7UuYG9D7Kfu.7gruDHMIOS4V0/JqaH6LO3yBSR9ZbS','CuDan','Chờ duyệt','2025-08-21 09:17:19.447000',NULL),(14,'pakamon029','$2a$10$ZolBIcfIeyYKHqB85HmBAOgoI8QbZfiINi1mBP0ml.gny/C/JM.AC','CuDan','Chờ duyệt','2025-08-21 09:17:34.506000',NULL),(15,'pakamon02','$2a$10$D.QTXITqoGG4ZwS4tlshb.NITJnpVAkQ1qUpUwUwCUGJEMBunn2a2','CuDan','Đã khóa','2025-08-21 09:17:42.852000',NULL);
/*!40000 ALTER TABLE `taikhoan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `notification_service_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `notification_service_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `notification_service_db`;

--
-- Table structure for table `thongbao`
--

DROP TABLE IF EXISTS `thongbao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thongbao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tieuDe` varchar(255) NOT NULL,
  `noiDung` text NOT NULL,
  `thoiGianGui` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nguoiGuiId` int NOT NULL,
  `maCanHo` varchar(255) DEFAULT NULL,
  `daXem` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thongbao`
--

LOCK TABLES `thongbao` WRITE;
/*!40000 ALTER TABLE `thongbao` DISABLE KEYS */;
/*!40000 ALTER TABLE `thongbao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `contract_service_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `contract_service_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `contract_service_db`;

--
-- Table structure for table `hopdong`
--

DROP TABLE IF EXISTS `hopdong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hopdong` (
  `maHopDong` varchar(255) NOT NULL,
  `maCuDan` int NOT NULL,
  `maNguoiKyBQL` int DEFAULT NULL,
  `maCanHo` varchar(255) DEFAULT NULL,
  `mauHopDongId` int NOT NULL,
  `ngayKy` date NOT NULL,
  `trangThai` enum('Chờ_duyệt','Hiệu_lực','Đã_hủy') DEFAULT NULL,
  `ngayKetThuc` date DEFAULT NULL,
  PRIMARY KEY (`maHopDong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hopdong`
--

LOCK TABLES `hopdong` WRITE;
/*!40000 ALTER TABLE `hopdong` DISABLE KEYS */;
INSERT INTO `hopdong` VALUES ('HD00001',2,1,NULL,1,'2025-06-01','Hiệu_lực','2026-06-01'),('HD00002',2,1,'CH002',2,'2025-08-19','Hiệu_lực','2026-08-19');
/*!40000 ALTER TABLE `hopdong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yeucauthaydoihopdong`
--

DROP TABLE IF EXISTS `yeucauthaydoihopdong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yeucauthaydoihopdong` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maHopDong` varchar(255) NOT NULL,
  `nguoiGuiId` int NOT NULL,
  `loaiThayDoi` enum('Nâng_cấp_gói_cước','Hủy_dịch_vụ','Đăng_ký_mới') NOT NULL,
  `trangThai` enum('Chờ_duyệt','Đã_duyệt','Từ_chối') NOT NULL,
  `ngayTao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `noiDungChiTiet` text,
  PRIMARY KEY (`id`),
  KEY `maHopDong` (`maHopDong`),
  CONSTRAINT `yeucauthaydoihopdong_ibfk_1` FOREIGN KEY (`maHopDong`) REFERENCES `hopdong` (`maHopDong`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yeucauthaydoihopdong`
--

LOCK TABLES `yeucauthaydoihopdong` WRITE;
/*!40000 ALTER TABLE `yeucauthaydoihopdong` DISABLE KEYS */;
INSERT INTO `yeucauthaydoihopdong` VALUES (3,'HD00001',2,'Đăng_ký_mới','Chờ_duyệt','2025-08-08 00:00:00','xxx');
/*!40000 ALTER TABLE `yeucauthaydoihopdong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `service_addendum_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `service_addendum_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `service_addendum_db`;

--
-- Table structure for table `cauhinhdichvu`
--

DROP TABLE IF EXISTS `cauhinhdichvu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cauhinhdichvu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tenCauHinh` varchar(255) NOT NULL,
  `ngayHieuLuc` date NOT NULL,
  `maDichVu` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cauhinhdichvu_ibfk_1` (`maDichVu`),
  CONSTRAINT `cauhinhdichvu_ibfk_1` FOREIGN KEY (`maDichVu`) REFERENCES `dichvu` (`maDichVu`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cauhinhdichvu`
--

LOCK TABLES `cauhinhdichvu` WRITE;
/*!40000 ALTER TABLE `cauhinhdichvu` DISABLE KEYS */;
INSERT INTO `cauhinhdichvu` VALUES (1,'Cấu hình Internet 100Mbps','2025-08-23','DV001'),(2,'Cấu hình Truyền hình HD','2025-08-15','DV002'),(4,'Cấu hình nước sinh hoạt theo mức','2025-08-10','DV003'),(27,'Cấu hình phí','2025-08-30','DV1755743016563');
/*!40000 ALTER TABLE `cauhinhdichvu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dichvu`
--

DROP TABLE IF EXISTS `dichvu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dichvu` (
  `maDichVu` varchar(255) NOT NULL,
  `tenDichVu` varchar(255) NOT NULL,
  `donViTinh` varchar(50) DEFAULT NULL,
  `moTa` text,
  `loaiTinhPhi` enum('TheoChiSo','CoDinh','GoiCuoc') NOT NULL,
  `batBuoc` tinyint(1) NOT NULL DEFAULT '0',
  `trangThai` enum('HoatDong','NgungHoatDong') NOT NULL,
  PRIMARY KEY (`maDichVu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dichvu`
--

LOCK TABLES `dichvu` WRITE;
/*!40000 ALTER TABLE `dichvu` DISABLE KEYS */;
INSERT INTO `dichvu` VALUES ('DV001','Dịch vụ Internet','Mbps','Dịch vụ cung cấp Internet tốc độ cao','TheoChiSo',1,'NgungHoatDong'),('DV002','Dịch vụ Truyền hình','Kênh','Dịch vụ truyền hình cáp, cung cấp các kênh giải trí','CoDinh',0,'HoatDong'),('DV003','Dịch vụ Điện','kWh','Dịch vụ cung cấp điện năng cho hộ gia đình và doanh nghiệp','TheoChiSo',1,'HoatDong'),('DV004','Dịch vụ Nước','m3','Dịch vụ cung cấp nước sạch cho hộ gia đình và doanh nghiệp','TheoChiSo',1,'HoatDong'),('DV005','Dịch vụ Rác Sinh hoạt','thang','Dịch vụ cung cấp thu rác sinh hoạt','CoDinh',1,'HoatDong'),('DV006','Dịch vụ giữ xe tháng','tháng','Phí giữ xe hàng tháng cho cư dân','CoDinh',0,'HoatDong'),('DV1755743016563','Dịch vụ giữ xe năm 2025','năm','Phí giữ xe hàng năm cho cư dân','CoDinh',0,'HoatDong');
/*!40000 ALTER TABLE `dichvu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goicuocdichvu`
--

DROP TABLE IF EXISTS `goicuocdichvu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goicuocdichvu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tenGoi` varchar(255) NOT NULL,
  `donGia` decimal(18,2) NOT NULL,
  `moTa` text,
  `maDichVu` varchar(255) NOT NULL,
  `ngayHieuLuc` date NOT NULL,
  `trangThai` enum('HoatDong','NgungHoatDong') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `maDichVu` (`maDichVu`),
  CONSTRAINT `goicuocdichvu_ibfk_1` FOREIGN KEY (`maDichVu`) REFERENCES `dichvu` (`maDichVu`),
  CONSTRAINT `goicuocdichvu_chk_1` CHECK ((`donGia` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goicuocdichvu`
--

LOCK TABLES `goicuocdichvu` WRITE;
/*!40000 ALTER TABLE `goicuocdichvu` DISABLE KEYS */;
INSERT INTO `goicuocdichvu` VALUES (1,'Gói cước Internet 100Mbps',200000.00,'Gói cước Internet tốc độ cao 100Mbps','DV001','2025-08-01','HoatDong'),(2,'Gói cước Truyền hình HD',150000.00,'Gói cước truyền hình HD','DV002','2025-08-15','HoatDong'),(4,'Gói giữ xe theo tháng',250000.00,'Áp dụng cho cư dân có xe máy.','DV006','2025-08-07','HoatDong'),(5,'Gói giữ xe theo tháng',350000.00,'Áp dụng cho cư dân có ô tô.','DV006','2025-08-07','HoatDong');
/*!40000 ALTER TABLE `goicuocdichvu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mauhopdong`
--

DROP TABLE IF EXISTS `mauhopdong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mauhopdong` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tenMau` varchar(255) NOT NULL,
  `moTa` text,
  `dieuKhoanChinh` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mauhopdong`
--

LOCK TABLES `mauhopdong` WRITE;
/*!40000 ALTER TABLE `mauhopdong` DISABLE KEYS */;
INSERT INTO `mauhopdong` VALUES (1,'Mẫu hợp đồng Internet','Mẫu hợp đồng cung cấp dịch vụ Internet tốc độ cao.','Điều kiện và điều khoản sử dụng dịch vụ Internet'),(2,'Mẫu hợp đồng Truyền hình','Mẫu hợp đồng cung cấp dịch vụ truyền hình cáp.','Điều kiện và điều khoản sử dụng dịch vụ truyền hình'),(4,'Mẫu hợp đồng cho thuê nhà năm 2025','Dành cho khách thuê dài hạn','Bên A đồng ý cho bên B thuê tài sản...');
/*!40000 ALTER TABLE `mauhopdong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mauhopdongdichvu`
--

DROP TABLE IF EXISTS `mauhopdongdichvu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mauhopdongdichvu` (
  `mauId` int NOT NULL,
  `maDichVu` varchar(255) NOT NULL,
  PRIMARY KEY (`mauId`,`maDichVu`),
  KEY `maDichVu` (`maDichVu`),
  CONSTRAINT `mauhopdongdichvu_ibfk_1` FOREIGN KEY (`mauId`) REFERENCES `mauhopdong` (`id`),
  CONSTRAINT `mauhopdongdichvu_ibfk_2` FOREIGN KEY (`maDichVu`) REFERENCES `dichvu` (`maDichVu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mauhopdongdichvu`
--

LOCK TABLES `mauhopdongdichvu` WRITE;
/*!40000 ALTER TABLE `mauhopdongdichvu` DISABLE KEYS */;
INSERT INTO `mauhopdongdichvu` VALUES (1,'DV001'),(1,'DV002'),(2,'DV002'),(1,'DV1755743016563');
/*!40000 ALTER TABLE `mauhopdongdichvu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phulucdichvu`
--

DROP TABLE IF EXISTS `phulucdichvu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phulucdichvu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maHopDong` varchar(255) NOT NULL,
  `maDichVu` varchar(255) NOT NULL,
  `cauHinhId` int DEFAULT NULL,
  `goiCuocId` int DEFAULT NULL,
  `donGiaCoDinh` decimal(18,2) DEFAULT NULL,
  `trangThai` enum('ChoDuyet','HoatDong','NgungHoatDong') NOT NULL,
  `ngayBatDau` date DEFAULT NULL,
  `ngayKetThuc` date DEFAULT NULL,
  `thongtinthem` text,
  PRIMARY KEY (`id`),
  KEY `maDichVu` (`maDichVu`),
  KEY `cauHinhId` (`cauHinhId`),
  KEY `goiCuocId` (`goiCuocId`),
  CONSTRAINT `phulucdichvu_ibfk_1` FOREIGN KEY (`maDichVu`) REFERENCES `dichvu` (`maDichVu`),
  CONSTRAINT `phulucdichvu_ibfk_2` FOREIGN KEY (`cauHinhId`) REFERENCES `cauhinhdichvu` (`id`),
  CONSTRAINT `phulucdichvu_ibfk_3` FOREIGN KEY (`goiCuocId`) REFERENCES `goicuocdichvu` (`id`),
  CONSTRAINT `phulucdichvu_chk_1` CHECK ((`donGiaCoDinh` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phulucdichvu`
--

LOCK TABLES `phulucdichvu` WRITE;
/*!40000 ALTER TABLE `phulucdichvu` DISABLE KEYS */;
INSERT INTO `phulucdichvu` VALUES (1,'HD001','DV001',1,1,500000.00,'HoatDong','2025-08-01','2026-08-01',NULL),(2,'HD002','DV002',2,2,300000.00,'HoatDong','2025-08-01','2026-08-01',NULL),(3,'HD00002','DV001',NULL,NULL,150000.00,'ChoDuyet','2025-08-20','2026-08-20','Ghi chú thêm 1'),(4,'HD00002','DV002',NULL,4,200000.00,'ChoDuyet','2025-08-21','2026-08-21','Ghi chú thêm 2');
/*!40000 ALTER TABLE `phulucdichvu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thamsophi`
--

DROP TABLE IF EXISTS `thamsophi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thamsophi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cauHinhId` int NOT NULL,
  `ten` varchar(255) NOT NULL,
  `giaTriTu` decimal(18,4) NOT NULL,
  `giaTriDen` decimal(18,4) NOT NULL,
  `donGia` decimal(18,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cauHinhId` (`cauHinhId`),
  CONSTRAINT `thamsophi_ibfk_1` FOREIGN KEY (`cauHinhId`) REFERENCES `cauhinhdichvu` (`id`),
  CONSTRAINT `thamsophi_chk_1` CHECK ((`giaTriTu` >= 0)),
  CONSTRAINT `thamsophi_chk_2` CHECK ((`donGia` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thamsophi`
--

LOCK TABLES `thamsophi` WRITE;
/*!40000 ALTER TABLE `thamsophi` DISABLE KEYS */;
INSERT INTO `thamsophi` VALUES (3,2,'Phí Truyền hình HD',0.0000,50.0000,30.00),(4,4,'Phí nước từ 0 đến 10 m³',0.0000,10.0000,5560.00),(15,27,'Phí xe năm 2025',0.0000,1.0000,500000.00);
/*!40000 ALTER TABLE `thamsophi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `billing_payment_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `billing_payment_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `billing_payment_db`;

--
-- Table structure for table `chisodichvu`
--

DROP TABLE IF EXISTS `chisodichvu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chisodichvu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maCanHo` varchar(255) NOT NULL,
  `maDichVu` varchar(255) NOT NULL,
  `thang` varchar(7) NOT NULL,
  `chiSoCu` float NOT NULL,
  `chiSoMoi` float NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `chisodichvu_chk_1` CHECK ((`chiSoCu` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chisodichvu`
--

LOCK TABLES `chisodichvu` WRITE;
/*!40000 ALTER TABLE `chisodichvu` DISABLE KEYS */;
/*!40000 ALTER TABLE `chisodichvu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chitiethoadon`
--

DROP TABLE IF EXISTS `chitiethoadon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chitiethoadon` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hoaDonId` int NOT NULL,
  `maDichVu` varchar(255) NOT NULL,
  `tenKhoanMuc` varchar(255) NOT NULL,
  `soLuong` float NOT NULL,
  `donGia` decimal(18,2) NOT NULL,
  `thanhTien` decimal(18,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hoaDonId` (`hoaDonId`),
  CONSTRAINT `chitiethoadon_ibfk_1` FOREIGN KEY (`hoaDonId`) REFERENCES `hoadon` (`id`),
  CONSTRAINT `chitiethoadon_chk_1` CHECK ((`soLuong` >= 0)),
  CONSTRAINT `chitiethoadon_chk_2` CHECK ((`donGia` >= 0)),
  CONSTRAINT `chitiethoadon_chk_3` CHECK ((`thanhTien` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chitiethoadon`
--

LOCK TABLES `chitiethoadon` WRITE;
/*!40000 ALTER TABLE `chitiethoadon` DISABLE KEYS */;
/*!40000 ALTER TABLE `chitiethoadon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoadon`
--

DROP TABLE IF EXISTS `hoadon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoadon` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maHopDong` varchar(255) NOT NULL,
  `ngay` date NOT NULL,
  `tongTien` decimal(18,2) NOT NULL,
  `trangThai` enum('Chưa_thanh_toán','Đã_thanh_toán') NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `hoadon_chk_1` CHECK ((`tongTien` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoadon`
--

LOCK TABLES `hoadon` WRITE;
/*!40000 ALTER TABLE `hoadon` DISABLE KEYS */;
/*!40000 ALTER TABLE `hoadon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lichsuthanhtoan`
--

DROP TABLE IF EXISTS `lichsuthanhtoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lichsuthanhtoan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hoaDonId` int NOT NULL,
  `soTien` decimal(18,2) NOT NULL,
  `hinhThuc` enum('Chuyển_khoản','Tiền_mặt') NOT NULL,
  `thoiGian` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `trangThai` enum('Thành_công','Thất_bại') NOT NULL,
  `nguoiXacNhanId` int NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `lichsuthanhtoan_chk_1` CHECK ((`soTien` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lichsuthanhtoan`
--

LOCK TABLES `lichsuthanhtoan` WRITE;
/*!40000 ALTER TABLE `lichsuthanhtoan` DISABLE KEYS */;
/*!40000 ALTER TABLE `lichsuthanhtoan` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-22 12:25:00
