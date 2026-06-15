-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: smartgym
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `categoriasmaquinas`
--

DROP TABLE IF EXISTS `categoriasmaquinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoriasmaquinas` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoriasmaquinas`
--

LOCK TABLES `categoriasmaquinas` WRITE;
/*!40000 ALTER TABLE `categoriasmaquinas` DISABLE KEYS */;
INSERT INTO `categoriasmaquinas` VALUES (1,'Cardiovasculares'),(2,'Poleas'),(3,'Palanca');
/*!40000 ALTER TABLE `categoriasmaquinas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `controlaccesos`
--

DROP TABLE IF EXISTS `controlaccesos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `controlaccesos` (
  `id_acceso` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `fecha_entrada` date NOT NULL,
  `hora_entrada` time NOT NULL,
  PRIMARY KEY (`id_acceso`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `controlaccesos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `controlaccesos`
--

LOCK TABLES `controlaccesos` WRITE;
/*!40000 ALTER TABLE `controlaccesos` DISABLE KEYS */;
/*!40000 ALTER TABLE `controlaccesos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disciplinas`
--

DROP TABLE IF EXISTS `disciplinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disciplinas` (
  `id_disciplina` int NOT NULL AUTO_INCREMENT,
  `nombre_disciplina` varchar(100) NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`id_disciplina`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disciplinas`
--

LOCK TABLES `disciplinas` WRITE;
/*!40000 ALTER TABLE `disciplinas` DISABLE KEYS */;
/*!40000 ALTER TABLE `disciplinas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrenadores`
--

DROP TABLE IF EXISTS `entrenadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrenadores` (
  `id_entrenador` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `especialidad` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id_entrenador`),
  UNIQUE KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `entrenadores_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrenadores`
--

LOCK TABLES `entrenadores` WRITE;
/*!40000 ALTER TABLE `entrenadores` DISABLE KEYS */;
/*!40000 ALTER TABLE `entrenadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluacionbiometrica`
--

DROP TABLE IF EXISTS `evaluacionbiometrica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluacionbiometrica` (
  `id_evaluacion` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `id_entrenador` int NOT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `altura` decimal(4,2) DEFAULT NULL,
  `porcentaje_grasa` decimal(5,2) DEFAULT NULL,
  `observaciones` text,
  `fecha_evaluacion` date NOT NULL,
  PRIMARY KEY (`id_evaluacion`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_entrenador` (`id_entrenador`),
  CONSTRAINT `evaluacionbiometrica_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `evaluacionbiometrica_ibfk_2` FOREIGN KEY (`id_entrenador`) REFERENCES `entrenadores` (`id_entrenador`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluacionbiometrica`
--

LOCK TABLES `evaluacionbiometrica` WRITE;
/*!40000 ALTER TABLE `evaluacionbiometrica` DISABLE KEYS */;
/*!40000 ALTER TABLE `evaluacionbiometrica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maquinas`
--

DROP TABLE IF EXISTS `maquinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maquinas` (
  `id_maquinas` int NOT NULL AUTO_INCREMENT,
  `id_categoria` int NOT NULL,
  `nombre_maquina` varchar(100) NOT NULL,
  `descripcion_tecnica` text,
  `estado` varchar(50) NOT NULL,
  PRIMARY KEY (`id_maquinas`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `maquinas_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoriasmaquinas` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maquinas`
--

LOCK TABLES `maquinas` WRITE;
/*!40000 ALTER TABLE `maquinas` DISABLE KEYS */;
INSERT INTO `maquinas` VALUES (4,1,'Cinta de correr','Simula la acción de caminar, trotar o correr en un mismo lugar mediante una cinta motorizada','Activa'),(5,2,'Torre multi-polea ajustable','Sistema de cables conectados a pesos que permite realizar una gran variedad de ejercicios cambiando la altura del agarre','Activa'),(6,3,'Prensa inclinada a 45°','Máquina donde empujas una plataforma cargada con discos de peso libre mediante un sistema articulado de empuje','Activa'),(9,1,'Bicicleta estática ergométrica','Resistencia magnética, monitor de ritmo cardíaco y 12 programas preestablecidos','Activa'),(10,2,'Máquina de polea alta para espalda','Sistema de tracción superior con barra recta y rodillos de ajuste para muslos','Activa');
/*!40000 ALTER TABLE `maquinas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membresiascliente`
--

DROP TABLE IF EXISTS `membresiascliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membresiascliente` (
  `id_membresias` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `id_plan` int NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_membresias`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_plan` (`id_plan`),
  CONSTRAINT `membresiascliente_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `membresiascliente_ibfk_2` FOREIGN KEY (`id_plan`) REFERENCES `planessuscripcion` (`id_plan`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membresiascliente`
--

LOCK TABLES `membresiascliente` WRITE;
/*!40000 ALTER TABLE `membresiascliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `membresiascliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id_pagos` int NOT NULL AUTO_INCREMENT,
  `id_membresia` int NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` date NOT NULL,
  PRIMARY KEY (`id_pagos`),
  KEY `id_membresia` (`id_membresia`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_membresia`) REFERENCES `membresiascliente` (`id_membresias`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planessuscripcion`
--

DROP TABLE IF EXISTS `planessuscripcion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planessuscripcion` (
  `id_plan` int NOT NULL AUTO_INCREMENT,
  `nombre_plan` varchar(100) NOT NULL,
  `costo_plan` decimal(10,2) NOT NULL,
  `descripcion_plan` text,
  `duracion_plan` int NOT NULL,
  PRIMARY KEY (`id_plan`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planessuscripcion`
--

LOCK TABLES `planessuscripcion` WRITE;
/*!40000 ALTER TABLE `planessuscripcion` DISABLE KEYS */;
INSERT INTO `planessuscripcion` VALUES (3,'Plan Trimestral',110.00,'Acceso ilimitado durante 90 días',90),(5,'Plan Anual Pro',360.00,'Acceso ilimitado por 365 días con tarifa preferencial congelada y pase de invitado mensual',365);
/*!40000 ALTER TABLE `planessuscripcion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productostienda`
--

DROP TABLE IF EXISTS `productostienda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productostienda` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `nombre_producto` varchar(150) NOT NULL,
  `descripcion` text,
  `precio` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productostienda`
--

LOCK TABLES `productostienda` WRITE;
/*!40000 ALTER TABLE `productostienda` DISABLE KEYS */;
INSERT INTO `productostienda` VALUES (101,'Proteína Isolatada 1kg','Proteína cero carbohidratos',28.00,35),(102,'Proteína 5kg','Suplemento de proteína sabor chocolate y vainilla',100.00,40),(103,'Bebida Isotónica 500ml','Bebida hidratante con electrolitos sabor frutas tropicales',5.00,120);
/*!40000 ALTER TABLE `productostienda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservas`
--

DROP TABLE IF EXISTS `reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas` (
  `id_reservas` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `id_sesion` int NOT NULL,
  `fecha_reserva` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_reservas`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_sesion` (`id_sesion`),
  CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`id_sesion`) REFERENCES `sesionesprogramadas` (`id_sesion`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador'),(2,'Finanzas'),(3,'Entrenadores'),(4,'Clientes');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sesionesprogramadas`
--

DROP TABLE IF EXISTS `sesionesprogramadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sesionesprogramadas` (
  `id_sesion` int NOT NULL AUTO_INCREMENT,
  `id_disciplina` int NOT NULL,
  `id_entrenador` int NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_cierre` time NOT NULL,
  `cupos_maximos` int NOT NULL,
  PRIMARY KEY (`id_sesion`),
  KEY `id_disciplina` (`id_disciplina`),
  KEY `id_entrenador` (`id_entrenador`),
  CONSTRAINT `sesionesprogramadas_ibfk_1` FOREIGN KEY (`id_disciplina`) REFERENCES `disciplinas` (`id_disciplina`),
  CONSTRAINT `sesionesprogramadas_ibfk_2` FOREIGN KEY (`id_entrenador`) REFERENCES `entrenadores` (`id_entrenador`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sesionesprogramadas`
--

LOCK TABLES `sesionesprogramadas` WRITE;
/*!40000 ALTER TABLE `sesionesprogramadas` DISABLE KEYS */;
/*!40000 ALTER TABLE `sesionesprogramadas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticketsmantenimiento`
--

DROP TABLE IF EXISTS `ticketsmantenimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticketsmantenimiento` (
  `id_ticket` int NOT NULL AUTO_INCREMENT,
  `id_maquina` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha_falla` date NOT NULL,
  `descripcion_falla` text,
  `fecha_resolucion` date DEFAULT NULL,
  `costo_reparacion` decimal(10,2) DEFAULT NULL,
  `estado` varchar(50) NOT NULL,
  PRIMARY KEY (`id_ticket`),
  KEY `id_maquina` (`id_maquina`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `ticketsmantenimiento_ibfk_1` FOREIGN KEY (`id_maquina`) REFERENCES `maquinas` (`id_maquinas`),
  CONSTRAINT `ticketsmantenimiento_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticketsmantenimiento`
--

LOCK TABLES `ticketsmantenimiento` WRITE;
/*!40000 ALTER TABLE `ticketsmantenimiento` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticketsmantenimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `id_rol` int NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `cedula` (`cedula`),
  UNIQUE KEY `email` (`email`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,1,'31066236','Yoge','Toro','yoge@gym.com','$2b$10$bCFQpOsa2plULdEce.VQG.I9mC9TTMPSHHN0.qaqh.O8Fwt4q9CYK','04120000000');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventaproductos`
--

DROP TABLE IF EXISTS `ventaproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventaproductos` (
  `id_detalle_venta` int NOT NULL AUTO_INCREMENT,
  `id_venta` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_detalle_venta`),
  KEY `id_venta` (`id_venta`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `ventaproductos_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventastienda` (`id_venta`) ON DELETE CASCADE,
  CONSTRAINT `ventaproductos_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productostienda` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventaproductos`
--

LOCK TABLES `ventaproductos` WRITE;
/*!40000 ALTER TABLE `ventaproductos` DISABLE KEYS */;
/*!40000 ALTER TABLE `ventaproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventastienda`
--

DROP TABLE IF EXISTS `ventastienda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventastienda` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `fecha_venta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_venta`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `ventastienda_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventastienda`
--

LOCK TABLES `ventastienda` WRITE;
/*!40000 ALTER TABLE `ventastienda` DISABLE KEYS */;
/*!40000 ALTER TABLE `ventastienda` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-07 20:54:38
