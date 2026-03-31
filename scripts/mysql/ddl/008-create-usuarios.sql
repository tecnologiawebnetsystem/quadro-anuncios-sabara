-- =============================================
-- TABELAS: usuarios e alcadas
-- Descrição: Sistema de usuários e permissões
-- =============================================

-- =============================================
-- Tabela: alcadas
-- Descrição: Níveis de acesso/permissão do sistema
-- =============================================
CREATE TABLE IF NOT EXISTS alcadas (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  nome VARCHAR(100) NOT NULL,
  tipo ENUM('ADMIN', 'ANCIAO', 'SERVO_MINISTERIAL', 'PIONEIRO', 'PUBLICADOR') NOT NULL,
  descricao TEXT,
  permissoes JSON DEFAULT NULL, -- array de permissões
  cor VARCHAR(20), -- cor para identificação visual
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Índice
  INDEX idx_alcadas_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: usuarios
-- Descrição: Usuários do sistema
-- =============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  senha VARCHAR(255), -- Hash da senha
  avatar VARCHAR(1000),
  alcada_id CHAR(36),
  publicador_id CHAR(36),
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Chaves estrangeiras
  CONSTRAINT fk_usuarios_alcada FOREIGN KEY (alcada_id) 
    REFERENCES alcadas(id) ON DELETE SET NULL,
  CONSTRAINT fk_usuarios_publicador FOREIGN KEY (publicador_id) 
    REFERENCES publicadores(id) ON DELETE SET NULL,
  
  -- Índices
  INDEX idx_usuarios_email (email),
  INDEX idx_usuarios_alcada (alcada_id),
  INDEX idx_usuarios_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
