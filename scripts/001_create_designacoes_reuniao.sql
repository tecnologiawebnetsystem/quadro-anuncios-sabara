-- Tabela para armazenar as designações das partes da reunião Vida e Ministério
CREATE TABLE IF NOT EXISTS public.designacoes_reuniao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reuniao_id TEXT NOT NULL, -- ID da reunião (ex: "semana-09-15-marco")
  tipo_parte TEXT NOT NULL, -- "presidente", "tesouros_1", "tesouros_2", "tesouros_3", "ministerio_4", etc.
  publicador_id TEXT NOT NULL, -- ID do publicador designado
  publicador_nome TEXT NOT NULL, -- Nome do publicador para fácil referência
  ajudante_id TEXT, -- ID do ajudante (para partes com demonstrações)
  ajudante_nome TEXT, -- Nome do ajudante
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reuniao_id, tipo_parte) -- Apenas uma designação por parte por reunião
);

-- Índice para busca rápida por reunião
CREATE INDEX IF NOT EXISTS idx_designacoes_reuniao_id ON public.designacoes_reuniao(reuniao_id);

-- Habilitar RLS
ALTER TABLE public.designacoes_reuniao ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (todos podem ver as designações)
CREATE POLICY "designacoes_select_all" ON public.designacoes_reuniao 
  FOR SELECT USING (true);

-- Política para permitir inserção (será restrita por autenticação futura)
CREATE POLICY "designacoes_insert_all" ON public.designacoes_reuniao 
  FOR INSERT WITH CHECK (true);

-- Política para permitir atualização
CREATE POLICY "designacoes_update_all" ON public.designacoes_reuniao 
  FOR UPDATE USING (true);

-- Política para permitir exclusão
CREATE POLICY "designacoes_delete_all" ON public.designacoes_reuniao 
  FOR DELETE USING (true);

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_designacoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_designacoes_updated_at ON public.designacoes_reuniao;
CREATE TRIGGER trigger_update_designacoes_updated_at
  BEFORE UPDATE ON public.designacoes_reuniao
  FOR EACH ROW
  EXECUTE FUNCTION update_designacoes_updated_at();
