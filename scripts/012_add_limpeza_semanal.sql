-- Adiciona campos de limpeza semanal na tabela limpeza_salao
ALTER TABLE limpeza_salao
  ADD COLUMN IF NOT EXISTS limpeza_semanal_grupo_id uuid REFERENCES grupos(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS limpeza_semanal_grupo_nome text;
