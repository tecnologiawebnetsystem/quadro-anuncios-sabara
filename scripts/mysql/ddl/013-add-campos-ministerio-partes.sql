-- =============================================
-- MIGRAÇÃO: Adicionar campos ministério em vida_ministerio_partes
-- Descrição: Adiciona texto_ministerio, licao_ministerio e ponto_ministerio
-- =============================================

-- Adicionar coluna texto_ministerio (para texto bíblico da parte)
ALTER TABLE vida_ministerio_partes 
ADD COLUMN IF NOT EXISTS texto_ministerio VARCHAR(500) DEFAULT NULL;

-- Adicionar coluna licao_ministerio (para lição/ponto da parte)
ALTER TABLE vida_ministerio_partes 
ADD COLUMN IF NOT EXISTS licao_ministerio VARCHAR(500) DEFAULT NULL;

-- Adicionar coluna ponto_ministerio (para ponto de ensino)
ALTER TABLE vida_ministerio_partes 
ADD COLUMN IF NOT EXISTS ponto_ministerio VARCHAR(500) DEFAULT NULL;
