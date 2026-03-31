-- =============================================
-- TABELAS: servico_campo_*
-- Descrição: Programa de Ministério de Campo
-- =============================================

-- =============================================
-- Tabela: servico_campo_semana
-- Descrição: Serviço de campo durante a semana (dias fixos)
-- =============================================
CREATE TABLE IF NOT EXISTS servico_campo_semana (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  dia_semana VARCHAR(20) NOT NULL, -- "segunda", "terca", "quarta", "quinta", "sexta"
  dirigente_id CHAR(36),
  dirigente_nome VARCHAR(255) NOT NULL,
  periodo VARCHAR(20) NOT NULL, -- "manha" ou "tarde"
  horario VARCHAR(10) NOT NULL, -- "8:45" ou "16:45"
  ativo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Chave estrangeira
  CONSTRAINT fk_servico_semana_dirigente FOREIGN KEY (dirigente_id) 
    REFERENCES publicadores(id) ON DELETE SET NULL,
  
  -- Índice único para evitar duplicatas
  UNIQUE KEY uk_servico_semana_dia (dia_semana)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: servico_campo_cartas
-- Descrição: Arranjo de cartas
-- =============================================
CREATE TABLE IF NOT EXISTS servico_campo_cartas (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  dia_semana VARCHAR(20) NOT NULL, -- "segunda"
  descricao VARCHAR(500), -- "Cartas e Zoom"
  responsavel_id CHAR(36),
  responsavel_nome VARCHAR(255) NOT NULL,
  periodo VARCHAR(20) NOT NULL, -- "tarde"
  horario VARCHAR(10) NOT NULL, -- "17:00"
  ativo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Chave estrangeira
  CONSTRAINT fk_servico_cartas_responsavel FOREIGN KEY (responsavel_id) 
    REFERENCES publicadores(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: servico_campo_sabado
-- Descrição: Dirigentes de campo aos sábados (manhã e tarde) - por data
-- =============================================
CREATE TABLE IF NOT EXISTS servico_campo_sabado (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  data DATE NOT NULL,
  mes VARCHAR(7) NOT NULL, -- formato: "2024-01"
  periodo VARCHAR(20) NOT NULL, -- "manha" ou "tarde"
  horario VARCHAR(10) NOT NULL, -- "8:45" ou "16:45"
  dirigente_id CHAR(36),
  dirigente_nome VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Chave estrangeira
  CONSTRAINT fk_servico_sabado_dirigente FOREIGN KEY (dirigente_id) 
    REFERENCES publicadores(id) ON DELETE SET NULL,
  
  -- Índice único para evitar duplicatas (uma designação por data e período)
  UNIQUE KEY uk_servico_sabado_data_periodo (data, periodo),
  
  -- Índices
  INDEX idx_servico_sabado_mes (mes),
  INDEX idx_servico_sabado_data (data)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: servico_campo_domingo
-- Descrição: Dirigentes de campo aos domingos - por data
-- =============================================
CREATE TABLE IF NOT EXISTS servico_campo_domingo (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  data DATE NOT NULL,
  mes VARCHAR(7) NOT NULL, -- formato: "2024-01"
  horario VARCHAR(10) NOT NULL DEFAULT '8:45',
  dirigente_id CHAR(36),
  dirigente_nome VARCHAR(255), -- pode ser "GRUPO" ou nome do dirigente
  tipo VARCHAR(20) NOT NULL DEFAULT 'individual', -- "individual" ou "grupo"
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Chave estrangeira
  CONSTRAINT fk_servico_domingo_dirigente FOREIGN KEY (dirigente_id) 
    REFERENCES publicadores(id) ON DELETE SET NULL,
  
  -- Índice único para evitar duplicatas
  UNIQUE KEY uk_servico_domingo_data (data),
  
  -- Índices
  INDEX idx_servico_domingo_mes (mes),
  INDEX idx_servico_domingo_data (data)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
