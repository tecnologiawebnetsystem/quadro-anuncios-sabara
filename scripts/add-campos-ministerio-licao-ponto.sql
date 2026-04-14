-- Migration: adicionar campos extras para Parte 3 e seção Faça Seu Melhor no Ministério
-- texto_ministerio: texto para Parte 3 (Leitura da Bíblia) 
-- licao_ministerio: lição da parte (Parte 3 e Ministério)
-- ponto_ministerio: ponto da parte (Ministério)

ALTER TABLE vida_ministerio_partes
  ADD COLUMN IF NOT EXISTS texto_ministerio text;

ALTER TABLE vida_ministerio_partes
  ADD COLUMN IF NOT EXISTS licao_ministerio text;

ALTER TABLE vida_ministerio_partes
  ADD COLUMN IF NOT EXISTS ponto_ministerio text;
