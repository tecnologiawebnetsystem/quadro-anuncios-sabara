-- =============================================
-- CRIAÇÃO DO BANCO DE DADOS
-- Execute este script primeiro, antes dos demais
-- =============================================

-- Criar banco de dados (se não existir)
CREATE DATABASE IF NOT EXISTS quadro_anuncios_sabara
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados
USE quadro_anuncios_sabara;

-- Configurações de sessão recomendadas
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = utf8mb4_unicode_ci;
SET time_zone = '-03:00'; -- Horário de Brasília
