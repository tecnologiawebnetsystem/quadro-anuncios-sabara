-- =============================================
-- TABELA: anuncios
-- Descrição: Anúncios para o quadro de anúncios da congregação
-- =============================================

CREATE TABLE IF NOT EXISTS anuncios (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  titulo VARCHAR(500) NOT NULL,
  texto TEXT NOT NULL,
  imagem_url VARCHAR(1000),
  ativo TINYINT(1) DEFAULT 1,
  ordem INT DEFAULT 0,
  data_evento DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Índices
  INDEX idx_anuncios_ordem (ordem),
  INDEX idx_anuncios_ativo (ativo),
  INDEX idx_anuncios_data_evento (data_evento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
