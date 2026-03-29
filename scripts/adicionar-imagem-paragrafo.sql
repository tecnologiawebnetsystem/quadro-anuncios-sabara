-- Adiciona campos para imagem nos parágrafos do estudo da Sentinela
-- Cada parágrafo pode ter uma imagem com descrição e explicação gerada por IA

ALTER TABLE sentinela_paragrafos 
ADD COLUMN IF NOT EXISTS imagem_url TEXT,
ADD COLUMN IF NOT EXISTS imagem_descricao TEXT,
ADD COLUMN IF NOT EXISTS imagem_explicacao TEXT;

-- Comentários para documentação
COMMENT ON COLUMN sentinela_paragrafos.imagem_url IS 'URL da imagem associada ao parágrafo';
COMMENT ON COLUMN sentinela_paragrafos.imagem_descricao IS 'Descrição da imagem informada pelo usuário';
COMMENT ON COLUMN sentinela_paragrafos.imagem_explicacao IS 'Explicação da imagem gerada pela IA';
