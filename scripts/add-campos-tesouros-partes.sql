-- Migration: adicionar campos extras para seção Tesouros da Palavra de Deus
-- Parte 1: textos (pontos de ensino)
-- Parte 2 (Joias espirituais): pergunta1, resposta1, pergunta2, resposta2
-- Parte 3 (Leitura da Bíblia): texto_biblia, licao

ALTER TABLE vida_ministerio_partes
  ADD COLUMN IF NOT EXISTS textos jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS pergunta1 text,
  ADD COLUMN IF NOT EXISTS resposta1 text,
  ADD COLUMN IF NOT EXISTS pergunta2 text,
  ADD COLUMN IF NOT EXISTS resposta2 text,
  ADD COLUMN IF NOT EXISTS texto_biblia text,
  ADD COLUMN IF NOT EXISTS licao text;
