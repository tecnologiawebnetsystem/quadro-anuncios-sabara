-- Tabela para designações da equipe técnica (indicadores, micro-volante, som)
CREATE TABLE IF NOT EXISTS equipe_tecnica (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mes TEXT NOT NULL, -- formato: "2024-03"
  data DATE NOT NULL, -- data da reunião
  dia_semana TEXT NOT NULL, -- "quinta" ou "domingo"
  
  -- Indicadores (2 pessoas)
  indicador1_id TEXT REFERENCES publicadores(id),
  indicador1_nome TEXT,
  indicador2_id TEXT REFERENCES publicadores(id),
  indicador2_nome TEXT,
  
  -- Micro-volante (2 pessoas)
  microvolante1_id TEXT REFERENCES publicadores(id),
  microvolante1_nome TEXT,
  microvolante2_id TEXT REFERENCES publicadores(id),
  microvolante2_nome TEXT,
  
  -- Som (1 pessoa)
  som_id TEXT REFERENCES publicadores(id),
  som_nome TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índice único para evitar duplicatas
  UNIQUE(data, dia_semana)
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_equipe_tecnica_mes ON equipe_tecnica(mes);
CREATE INDEX IF NOT EXISTS idx_equipe_tecnica_data ON equipe_tecnica(data);
