-- =============================================
-- TABELA: assistencia_zoom_publicadores
-- Registra quais publicadores participaram via Zoom em cada reunião
-- =============================================

CREATE TABLE IF NOT EXISTS assistencia_zoom_publicadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistencia_id UUID NOT NULL REFERENCES assistencia_reunioes(id) ON DELETE CASCADE,
  publicador_id UUID NOT NULL REFERENCES publicadores(id) ON DELETE CASCADE,
  publicador_nome VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assistencia_id, publicador_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_azp_assistencia ON assistencia_zoom_publicadores(assistencia_id);
CREATE INDEX IF NOT EXISTS idx_azp_publicador  ON assistencia_zoom_publicadores(publicador_id);

-- RLS
ALTER TABLE assistencia_zoom_publicadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública" ON assistencia_zoom_publicadores
  FOR SELECT USING (true);

CREATE POLICY "Escrita autenticada" ON assistencia_zoom_publicadores
  FOR ALL USING (auth.role() = 'authenticated');
