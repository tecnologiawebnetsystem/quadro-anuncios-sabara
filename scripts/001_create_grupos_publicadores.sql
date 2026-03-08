-- Tabela de Grupos de Estudo
CREATE TABLE IF NOT EXISTS grupos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero INTEGER NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  local TEXT,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Publicadores
CREATE TABLE IF NOT EXISTS publicadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  grupo_id UUID REFERENCES grupos(id) ON DELETE SET NULL,
  anciao BOOLEAN DEFAULT false,
  servo_ministerial BOOLEAN DEFAULT false,
  pioneiro_regular BOOLEAN DEFAULT false,
  pioneiro_auxiliar BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  telefone TEXT,
  email TEXT,
  observacoes TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicadores ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para grupos
CREATE POLICY "grupos_select" ON grupos FOR SELECT USING (true);
CREATE POLICY "grupos_insert" ON grupos FOR INSERT WITH CHECK (true);
CREATE POLICY "grupos_update" ON grupos FOR UPDATE USING (true);
CREATE POLICY "grupos_delete" ON grupos FOR DELETE USING (true);

-- Políticas RLS para publicadores
CREATE POLICY "publicadores_select" ON publicadores FOR SELECT USING (true);
CREATE POLICY "publicadores_insert" ON publicadores FOR INSERT WITH CHECK (true);
CREATE POLICY "publicadores_update" ON publicadores FOR UPDATE USING (true);
CREATE POLICY "publicadores_delete" ON publicadores FOR DELETE USING (true);
