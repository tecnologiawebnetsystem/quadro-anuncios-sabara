-- =============================================
-- TABELAS: vida_ministerio_*
-- Descrição: Reunião Vida e Ministério Cristão (meio de semana)
-- =============================================

-- =============================================
-- Tabela: vida_ministerio_meses
-- Descrição: Meses da reunião Vida e Ministério
-- =============================================
CREATE TABLE IF NOT EXISTS vida_ministerio_meses (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  mes INT NOT NULL,
  ano INT NOT NULL,
  cor_tema VARCHAR(20) DEFAULT '#3b82f6',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Índice único para evitar duplicatas
  UNIQUE KEY uk_vida_ministerio_mes_ano (mes, ano),
  
  -- Índices
  INDEX idx_vida_ministerio_meses_ano (ano),
  INDEX idx_vida_ministerio_meses_mes (mes)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: vida_ministerio_semanas
-- Descrição: Semanas da reunião Vida e Ministério
-- =============================================
CREATE TABLE IF NOT EXISTS vida_ministerio_semanas (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  mes_id CHAR(36) NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  leitura_semanal VARCHAR(500),
  cantico_inicial INT,
  cantico_inicial_nome VARCHAR(255),
  cantico_meio INT,
  cantico_meio_nome VARCHAR(255),
  cantico_final INT,
  cantico_final_nome VARCHAR(255),
  sem_reuniao TINYINT(1) DEFAULT 0,
  motivo_sem_reuniao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Chave estrangeira
  CONSTRAINT fk_vida_ministerio_semanas_mes FOREIGN KEY (mes_id) 
    REFERENCES vida_ministerio_meses(id) ON DELETE CASCADE,
  
  -- Índices
  INDEX idx_vida_ministerio_semanas_mes (mes_id),
  INDEX idx_vida_ministerio_semanas_data (data_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: vida_ministerio_partes
-- Descrição: Partes da reunião Vida e Ministério
-- =============================================
CREATE TABLE IF NOT EXISTS vida_ministerio_partes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  semana_id CHAR(36) NOT NULL,
  secao VARCHAR(50) NOT NULL, -- "tesouros", "ministerio", "vida"
  titulo VARCHAR(500) NOT NULL,
  tempo VARCHAR(20),
  participante_id CHAR(36),
  participante_nome VARCHAR(255),
  ajudante_id CHAR(36),
  ajudante_nome VARCHAR(255),
  sala VARCHAR(50) DEFAULT 'principal', -- "principal" ou "auxiliar"
  ordem INT NOT NULL,
  descricao TEXT,
  
  -- Campos extras para seção Tesouros da Palavra de Deus
  textos JSON DEFAULT NULL, -- array de textos/pontos de ensino
  pergunta1 TEXT,
  resposta1 TEXT,
  pergunta2 TEXT,
  resposta2 TEXT,
  texto_biblia VARCHAR(500),
  licao TEXT,
  
  -- Campos para Estudo Bíblico de Congregação
  leitor_id CHAR(36),
  leitor_nome VARCHAR(255),
  oracao_final_id CHAR(36),
  oracao_final_nome VARCHAR(255),
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Chaves estrangeiras
  CONSTRAINT fk_vida_ministerio_partes_semana FOREIGN KEY (semana_id) 
    REFERENCES vida_ministerio_semanas(id) ON DELETE CASCADE,
  CONSTRAINT fk_vida_ministerio_partes_participante FOREIGN KEY (participante_id) 
    REFERENCES publicadores(id) ON DELETE SET NULL,
  CONSTRAINT fk_vida_ministerio_partes_ajudante FOREIGN KEY (ajudante_id) 
    REFERENCES publicadores(id) ON DELETE SET NULL,
  CONSTRAINT fk_vida_ministerio_partes_leitor FOREIGN KEY (leitor_id) 
    REFERENCES publicadores(id) ON DELETE SET NULL,
  CONSTRAINT fk_vida_ministerio_partes_oracao FOREIGN KEY (oracao_final_id) 
    REFERENCES publicadores(id) ON DELETE SET NULL,
  
  -- Índices
  INDEX idx_vida_ministerio_partes_semana (semana_id),
  INDEX idx_vida_ministerio_partes_secao (secao),
  INDEX idx_vida_ministerio_partes_ordem (ordem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
