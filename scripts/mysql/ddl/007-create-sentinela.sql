-- =============================================
-- TABELAS: sentinela_*
-- Descrição: Estudo de A Sentinela (reunião de domingo)
-- =============================================

-- =============================================
-- Tabela: sentinela_meses
-- Descrição: Meses do estudo da Sentinela
-- =============================================
CREATE TABLE IF NOT EXISTS sentinela_meses (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  mes INT NOT NULL,
  ano INT NOT NULL,
  cor_tema VARCHAR(20) DEFAULT '#3b82f6',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Índice único para evitar duplicatas
  UNIQUE KEY uk_sentinela_mes_ano (mes, ano),
  
  -- Índices
  INDEX idx_sentinela_meses_ano (ano),
  INDEX idx_sentinela_meses_mes (mes)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: sentinela_estudos
-- Descrição: Estudos semanais da Sentinela
-- =============================================
CREATE TABLE IF NOT EXISTS sentinela_estudos (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  mes_id CHAR(36) NOT NULL,
  numero_estudo INT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  cantico_inicial INT,
  cantico_inicial_nome VARCHAR(255),
  cantico_final INT,
  cantico_final_nome VARCHAR(255),
  titulo VARCHAR(500) NOT NULL,
  texto_tema TEXT,
  objetivo TEXT,
  imagem_capa VARCHAR(1000),
  sem_reuniao TINYINT(1) DEFAULT 0,
  motivo_sem_reuniao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Chave estrangeira
  CONSTRAINT fk_sentinela_estudos_mes FOREIGN KEY (mes_id) 
    REFERENCES sentinela_meses(id) ON DELETE CASCADE,
  
  -- Índices
  INDEX idx_sentinela_estudos_mes (mes_id),
  INDEX idx_sentinela_estudos_numero (numero_estudo),
  INDEX idx_sentinela_estudos_data (data_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: sentinela_paragrafos
-- Descrição: Parágrafos do estudo da Sentinela
-- =============================================
CREATE TABLE IF NOT EXISTS sentinela_paragrafos (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  estudo_id CHAR(36) NOT NULL,
  numero VARCHAR(20) NOT NULL, -- pode ser "1", "2, 3", etc.
  texto_base TEXT,
  pergunta TEXT NOT NULL,
  resposta TEXT,
  imagem VARCHAR(1000),
  imagem_legenda VARCHAR(500),
  imagem_descricao TEXT,
  imagem_url VARCHAR(1000),
  imagem_explicacao TEXT,
  ordem INT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Chave estrangeira
  CONSTRAINT fk_sentinela_paragrafos_estudo FOREIGN KEY (estudo_id) 
    REFERENCES sentinela_estudos(id) ON DELETE CASCADE,
  
  -- Índices
  INDEX idx_sentinela_paragrafos_estudo (estudo_id),
  INDEX idx_sentinela_paragrafos_ordem (ordem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: sentinela_recapitulacao
-- Descrição: Perguntas de recapitulação
-- =============================================
CREATE TABLE IF NOT EXISTS sentinela_recapitulacao (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  estudo_id CHAR(36) NOT NULL,
  pergunta TEXT NOT NULL,
  resposta TEXT,
  ordem INT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Chave estrangeira
  CONSTRAINT fk_sentinela_recapitulacao_estudo FOREIGN KEY (estudo_id) 
    REFERENCES sentinela_estudos(id) ON DELETE CASCADE,
  
  -- Índices
  INDEX idx_sentinela_recapitulacao_estudo (estudo_id),
  INDEX idx_sentinela_recapitulacao_ordem (ordem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: sentinela_progresso
-- Descrição: Progresso de leitura do usuário
-- =============================================
CREATE TABLE IF NOT EXISTS sentinela_progresso (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  estudo_id CHAR(36) NOT NULL,
  usuario_id CHAR(36) NOT NULL,
  paragrafos_lidos JSON DEFAULT NULL, -- array de IDs de parágrafos lidos
  concluido TINYINT(1) DEFAULT 0,
  ultima_leitura DATETIME,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Chave estrangeira
  CONSTRAINT fk_sentinela_progresso_estudo FOREIGN KEY (estudo_id) 
    REFERENCES sentinela_estudos(id) ON DELETE CASCADE,
  
  -- Índice único
  UNIQUE KEY uk_sentinela_progresso_estudo_usuario (estudo_id, usuario_id),
  
  -- Índices
  INDEX idx_sentinela_progresso_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: sentinela_favoritos
-- Descrição: Estudos/parágrafos favoritos do usuário
-- =============================================
CREATE TABLE IF NOT EXISTS sentinela_favoritos (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  estudo_id CHAR(36) NOT NULL,
  usuario_id CHAR(36) NOT NULL,
  paragrafo_id CHAR(36),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Chaves estrangeiras
  CONSTRAINT fk_sentinela_favoritos_estudo FOREIGN KEY (estudo_id) 
    REFERENCES sentinela_estudos(id) ON DELETE CASCADE,
  CONSTRAINT fk_sentinela_favoritos_paragrafo FOREIGN KEY (paragrafo_id) 
    REFERENCES sentinela_paragrafos(id) ON DELETE CASCADE,
  
  -- Índices
  INDEX idx_sentinela_favoritos_usuario (usuario_id),
  INDEX idx_sentinela_favoritos_estudo (estudo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Tabela: sentinela_historico
-- Descrição: Histórico de acesso aos estudos
-- =============================================
CREATE TABLE IF NOT EXISTS sentinela_historico (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  estudo_id CHAR(36) NOT NULL,
  usuario_id CHAR(36) NOT NULL,
  acessado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Chave estrangeira
  CONSTRAINT fk_sentinela_historico_estudo FOREIGN KEY (estudo_id) 
    REFERENCES sentinela_estudos(id) ON DELETE CASCADE,
  
  -- Índices
  INDEX idx_sentinela_historico_usuario (usuario_id),
  INDEX idx_sentinela_historico_estudo (estudo_id),
  INDEX idx_sentinela_historico_acessado (acessado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
