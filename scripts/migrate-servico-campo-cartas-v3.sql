-- Migração: Alterar tabela de cartas para funcionar por semana (similar a sábados/domingos)
-- Cada semana terá: data, mês, semana_numero e responsável

ALTER TABLE servico_campo_cartas ADD COLUMN IF NOT EXISTS data DATE;
ALTER TABLE servico_campo_cartas ADD COLUMN IF NOT EXISTS mes TEXT;
ALTER TABLE servico_campo_cartas ADD COLUMN IF NOT EXISTS semana_numero INTEGER;

CREATE INDEX IF NOT EXISTS idx_servico_campo_cartas_mes ON servico_campo_cartas(mes);
CREATE INDEX IF NOT EXISTS idx_servico_campo_cartas_data ON servico_campo_cartas(data);
CREATE INDEX IF NOT EXISTS idx_servico_campo_cartas_semana ON servico_campo_cartas(semana_numero);
