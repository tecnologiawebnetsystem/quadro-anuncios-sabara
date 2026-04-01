-- =============================================
-- TABELAS: distritos e congregacoes
-- Descrição: Estrutura organizacional (se necessário para expansão)
-- =============================================

-- =============================================
-- Tabela: distritos
-- Descrição: Distritos/circuitos
-- =============================================
CREATE TABLE IF NOT EXISTS distritos (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  numero INT NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Índices
  INDEX idx_distritos_numero (numero),
  INDEX idx_distritos_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: congregacoes
-- Descrição: Congregações
-- =============================================
CREATE TABLE IF NOT EXISTS congregacoes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  numero INT NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  distrito_id CHAR(36),
  endereco TEXT,
  cidade VARCHAR(255),
  estado VARCHAR(2),
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Chave estrangeira
  CONSTRAINT fk_congregacoes_distrito FOREIGN KEY (distrito_id) 
    REFERENCES distritos(id) ON DELETE SET NULL,
  
  -- Índices
  INDEX idx_congregacoes_numero (numero),
  INDEX idx_congregacoes_distrito (distrito_id),
  INDEX idx_congregacoes_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
