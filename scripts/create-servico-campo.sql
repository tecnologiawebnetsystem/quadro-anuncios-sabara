-- Tabela para Programa de Ministério de Campo Durante a Semana (dias fixos)
CREATE TABLE IF NOT EXISTS servico_campo_semana (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_semana TEXT NOT NULL, -- "segunda", "terca", "quarta", "quinta", "sexta"
  dirigente_id TEXT REFERENCES publicadores(id),
  dirigente_nome TEXT NOT NULL,
  periodo TEXT NOT NULL, -- "manha" ou "tarde"
  horario TEXT NOT NULL, -- "8:45" ou "16:45"
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índice único para evitar duplicatas
  UNIQUE(dia_semana)
);

-- Tabela para Arranjo de Cartas
CREATE TABLE IF NOT EXISTS servico_campo_cartas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_semana TEXT NOT NULL, -- "segunda"
  descricao TEXT, -- "Cartas e Zoom"
  responsavel_id TEXT REFERENCES publicadores(id),
  responsavel_nome TEXT NOT NULL,
  periodo TEXT NOT NULL, -- "tarde"
  horario TEXT NOT NULL, -- "17:00"
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para Dirigentes de Campo aos Sábados (manhã e tarde) - por data
CREATE TABLE IF NOT EXISTS servico_campo_sabado (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  mes TEXT NOT NULL, -- formato: "2024-01"
  periodo TEXT NOT NULL, -- "manha" ou "tarde"
  horario TEXT NOT NULL, -- "8:45" ou "16:45"
  dirigente_id TEXT REFERENCES publicadores(id),
  dirigente_nome TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índice único para evitar duplicatas (uma designação por data e período)
  UNIQUE(data, periodo)
);

-- Tabela para Dirigentes de Campo aos Domingos - por data
CREATE TABLE IF NOT EXISTS servico_campo_domingo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  mes TEXT NOT NULL, -- formato: "2024-01"
  horario TEXT NOT NULL DEFAULT '8:45',
  dirigente_id TEXT REFERENCES publicadores(id),
  dirigente_nome TEXT, -- pode ser "GRUPO" ou nome do dirigente
  tipo TEXT NOT NULL DEFAULT 'individual', -- "individual" ou "grupo"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índice único para evitar duplicatas
  UNIQUE(data)
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_servico_campo_sabado_mes ON servico_campo_sabado(mes);
CREATE INDEX IF NOT EXISTS idx_servico_campo_sabado_data ON servico_campo_sabado(data);
CREATE INDEX IF NOT EXISTS idx_servico_campo_domingo_mes ON servico_campo_domingo(mes);
CREATE INDEX IF NOT EXISTS idx_servico_campo_domingo_data ON servico_campo_domingo(data);

-- Habilitar RLS
ALTER TABLE servico_campo_semana ENABLE ROW LEVEL SECURITY;
ALTER TABLE servico_campo_cartas ENABLE ROW LEVEL SECURITY;
ALTER TABLE servico_campo_sabado ENABLE ROW LEVEL SECURITY;
ALTER TABLE servico_campo_domingo ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para servico_campo_semana
CREATE POLICY "servico_campo_semana_select" ON servico_campo_semana FOR SELECT TO public USING (true);
CREATE POLICY "servico_campo_semana_insert" ON servico_campo_semana FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "servico_campo_semana_update" ON servico_campo_semana FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "servico_campo_semana_delete" ON servico_campo_semana FOR DELETE TO public USING (true);

-- Políticas de acesso público para servico_campo_cartas
CREATE POLICY "servico_campo_cartas_select" ON servico_campo_cartas FOR SELECT TO public USING (true);
CREATE POLICY "servico_campo_cartas_insert" ON servico_campo_cartas FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "servico_campo_cartas_update" ON servico_campo_cartas FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "servico_campo_cartas_delete" ON servico_campo_cartas FOR DELETE TO public USING (true);

-- Políticas de acesso público para servico_campo_sabado
CREATE POLICY "servico_campo_sabado_select" ON servico_campo_sabado FOR SELECT TO public USING (true);
CREATE POLICY "servico_campo_sabado_insert" ON servico_campo_sabado FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "servico_campo_sabado_update" ON servico_campo_sabado FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "servico_campo_sabado_delete" ON servico_campo_sabado FOR DELETE TO public USING (true);

-- Políticas de acesso público para servico_campo_domingo
CREATE POLICY "servico_campo_domingo_select" ON servico_campo_domingo FOR SELECT TO public USING (true);
CREATE POLICY "servico_campo_domingo_insert" ON servico_campo_domingo FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "servico_campo_domingo_update" ON servico_campo_domingo FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "servico_campo_domingo_delete" ON servico_campo_domingo FOR DELETE TO public USING (true);
