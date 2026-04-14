-- =============================================
-- MIGRAÇÃO: Adicionar campos ministério em vida_ministerio_partes
-- Descrição: Adiciona texto_ministerio, licao_ministerio e ponto_ministerio
-- =============================================

-- Adicionar colunas para texto bíblico, lição e ponto de ensino
DO $$ 
BEGIN 
  -- Adicionar coluna texto_ministerio
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'vida_ministerio_partes' 
                 AND column_name = 'texto_ministerio') THEN
    ALTER TABLE vida_ministerio_partes ADD COLUMN texto_ministerio VARCHAR(500) DEFAULT NULL;
  END IF;
  
  -- Adicionar coluna licao_ministerio
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'vida_ministerio_partes' 
                 AND column_name = 'licao_ministerio') THEN
    ALTER TABLE vida_ministerio_partes ADD COLUMN licao_ministerio VARCHAR(500) DEFAULT NULL;
  END IF;
  
  -- Adicionar coluna ponto_ministerio
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'vida_ministerio_partes' 
                 AND column_name = 'ponto_ministerio') THEN
    ALTER TABLE vida_ministerio_partes ADD COLUMN ponto_ministerio VARCHAR(500) DEFAULT NULL;
  END IF;
END $$;
