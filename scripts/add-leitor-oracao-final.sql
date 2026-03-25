-- Adiciona campos de leitor e oração final na tabela vida_ministerio_partes
ALTER TABLE vida_ministerio_partes
  ADD COLUMN IF NOT EXISTS leitor_id uuid REFERENCES publicadores(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS leitor_nome text,
  ADD COLUMN IF NOT EXISTS oracao_final_id uuid REFERENCES publicadores(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS oracao_final_nome text;
