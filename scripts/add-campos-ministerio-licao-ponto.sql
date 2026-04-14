-- Migration: adicionar campos extras para seção Faça Seu Melhor no Ministério
-- licao_ministerio: lição da parte de ministério  
-- ponto_ministerio: ponto da parte de ministério

ALTER TABLE vida_ministerio_partes
  ADD COLUMN IF NOT EXISTS licao_ministerio text,
  ADD COLUMN IF NOT EXISTS ponto_ministerio text;
