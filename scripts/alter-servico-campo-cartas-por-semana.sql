-- Migração: Alterar tabela de cartas para suportar cadastro por semana
-- Similar à estrutura de sábados e domingos

-- Adicionar colunas necessárias para organização por semana
ALTER TABLE servico_campo_cartas ADD COLUMN IF NOT EXISTS data DATE;
ALTER TABLE servico_campo_cartas ADD COLUMN IF NOT EXISTS mes TEXT;
ALTER TABLE servico_campo_cartas ADD COLUMN IF NOT EXISTS semana_numero INTEGER; -- 1, 2, 3, 4, 5

-- Criar índices para busca por mês
CREATE INDEX IF NOT EXISTS idx_servico_campo_cartas_mes ON servico_campo_cartas(mes);
CREATE INDEX IF NOT EXISTS idx_servico_campo_cartas_data ON servico_campo_cartas(data);

-- Remover constraint único antigo se existir (não mais um registro único, mas sim por data)
-- ALTER TABLE servico_campo_cartas DROP CONSTRAINT IF EXISTS servico_campo_cartas_pkey;

-- Comentário: A estrutura agora permite múltiplos registros de cartas, um por semana
-- Cada semana do mês terá seu próprio responsável
