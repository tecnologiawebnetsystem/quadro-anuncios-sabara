-- =============================================
-- TABELA: grupos
-- Descrição: Grupos de estudo/serviço da congregação
-- =============================================

CREATE TABLE IF NOT EXISTS grupos (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  numero INT NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  local VARCHAR(500),
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_grupos_numero (numero),
  INDEX idx_grupos_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
