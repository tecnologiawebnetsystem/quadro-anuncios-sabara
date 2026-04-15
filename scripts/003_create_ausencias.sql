-- Migration: Create ausencias table for tracking publisher unavailability
-- Sprint 4: Produtividade Ancião - Relatório de Ausências

-- Tabela para ausências de publicadores
CREATE TABLE IF NOT EXISTS ausencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publicador_id UUID NOT NULL REFERENCES publicadores(id) ON DELETE CASCADE,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  motivo TEXT,
  tipo TEXT DEFAULT 'outro' CHECK (tipo IN ('viagem', 'saude', 'trabalho', 'familia', 'outro')),
  recorrente BOOLEAN DEFAULT FALSE,
  notificado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT,
  CONSTRAINT ausencias_data_check CHECK (data_fim >= data_inicio)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ausencias_publicador ON ausencias(publicador_id);
CREATE INDEX IF NOT EXISTS idx_ausencias_datas ON ausencias(data_inicio, data_fim);
CREATE INDEX IF NOT EXISTS idx_ausencias_tipo ON ausencias(tipo);

-- Comentários
COMMENT ON TABLE ausencias IS 'Registro de períodos em que publicadores não podem participar de designações';
COMMENT ON COLUMN ausencias.tipo IS 'Tipo da ausência: viagem, saude, trabalho, familia, outro';
COMMENT ON COLUMN ausencias.recorrente IS 'Indica se a ausência se repete (ex: sempre às quartas)';
