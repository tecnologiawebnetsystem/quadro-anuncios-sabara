-- =============================================
-- TABELA: equipe_tecnica
-- Descrição: Designações da equipe técnica (indicadores, micro-volante, som)
-- =============================================

CREATE TABLE IF NOT EXISTS equipe_tecnica (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  mes VARCHAR(7) NOT NULL, -- formato: "2024-03"
  data DATE NOT NULL,
  dia_semana VARCHAR(20) NOT NULL, -- "quinta" ou "domingo"
  
  -- Indicadores (2 pessoas)
  indicador1_id CHAR(36),
  indicador1_nome VARCHAR(255),
  indicador2_id CHAR(36),
  indicador2_nome VARCHAR(255),
  
  -- Micro-volante (2 pessoas)
  microvolante1_id CHAR(36),
  microvolante1_nome VARCHAR(255),
  microvolante2_id CHAR(36),
  microvolante2_nome VARCHAR(255),
  
  -- Som (1 pessoa)
  som_id CHAR(36),
  som_nome VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Chaves estrangeiras
  CONSTRAINT fk_equipe_indicador1 FOREIGN KEY (indicador1_id) 
    REFERENCES publicadores(id) ON DELETE SET NULL,
  CONSTRAINT fk_equipe_indicador2 FOREIGN KEY (indicador2_id) 
    REFERENCES publicadores(id) ON DELETE SET NULL,
  CONSTRAINT fk_equipe_microvolante1 FOREIGN KEY (microvolante1_id) 
    REFERENCES publicadores(id) ON DELETE SET NULL,
  CONSTRAINT fk_equipe_microvolante2 FOREIGN KEY (microvolante2_id) 
    REFERENCES publicadores(id) ON DELETE SET NULL,
  CONSTRAINT fk_equipe_som FOREIGN KEY (som_id) 
    REFERENCES publicadores(id) ON DELETE SET NULL,
  
  -- Índice único para evitar duplicatas
  UNIQUE KEY uk_equipe_data_dia (data, dia_semana),
  
  -- Índices
  INDEX idx_equipe_mes (mes),
  INDEX idx_equipe_data (data)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
