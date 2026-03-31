-- =============================================
-- TABELA: publicadores
-- Descrição: Cadastro de publicadores da congregação
-- =============================================

CREATE TABLE IF NOT EXISTS publicadores (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  nome VARCHAR(255) NOT NULL,
  grupo_id CHAR(36),
  
  -- Designações na congregação
  anciao TINYINT(1) DEFAULT 0,
  servo_ministerial TINYINT(1) DEFAULT 0,
  pioneiro_regular TINYINT(1) DEFAULT 0,
  pioneiro_auxiliar TINYINT(1) DEFAULT 0,
  
  -- Funções no grupo de estudo
  is_lider TINYINT(1) DEFAULT 0,
  is_auxiliar TINYINT(1) DEFAULT 0,
  
  ativo TINYINT(1) DEFAULT 1,
  
  -- Informações de contato
  telefone VARCHAR(20),
  email VARCHAR(255),
  endereco TEXT,
  
  -- Datas importantes
  data_nascimento DATE,
  data_batismo DATE,
  
  observacoes TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Chave estrangeira
  CONSTRAINT fk_publicadores_grupo FOREIGN KEY (grupo_id) 
    REFERENCES grupos(id) ON DELETE SET NULL,
  
  -- Índices
  INDEX idx_publicadores_nome (nome),
  INDEX idx_publicadores_grupo (grupo_id),
  INDEX idx_publicadores_anciao (anciao),
  INDEX idx_publicadores_servo (servo_ministerial),
  INDEX idx_publicadores_pioneiro_regular (pioneiro_regular),
  INDEX idx_publicadores_pioneiro_auxiliar (pioneiro_auxiliar),
  INDEX idx_publicadores_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
