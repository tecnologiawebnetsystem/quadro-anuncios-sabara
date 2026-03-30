-- Criar tabela de anúncios para o quadro de anúncios da congregação
CREATE TABLE IF NOT EXISTS anuncios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  texto TEXT NOT NULL,
  imagem_url TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  data_evento TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE anuncios ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (sem autenticação necessária)
CREATE POLICY "anuncios_public_read" ON anuncios 
  FOR SELECT 
  USING (ativo = true);

-- Política para permitir todas as operações (insert, update, delete) sem autenticação
-- Isso é necessário porque o sistema usa senha simples no frontend, não auth do Supabase
CREATE POLICY "anuncios_all_operations" ON anuncios 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Índice para ordenação
CREATE INDEX IF NOT EXISTS idx_anuncios_ordem ON anuncios(ordem);
CREATE INDEX IF NOT EXISTS idx_anuncios_ativo ON anuncios(ativo);
CREATE INDEX IF NOT EXISTS idx_anuncios_data_evento ON anuncios(data_evento);
