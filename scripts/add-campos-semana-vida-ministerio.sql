-- Adiciona 3 novos campos na tabela vida_ministerio_semanas:
-- 1. livro_biblia: livro da Bíblia e capítulos da leitura semanal (ex: "Salmos 10-15")
-- 2. presidente: nome do presidente da reunião
-- 3. oracao_inicial: nome do irmão designado para a oração inicial

ALTER TABLE public.vida_ministerio_semanas
  ADD COLUMN IF NOT EXISTS livro_biblia text NULL,
  ADD COLUMN IF NOT EXISTS presidente text NULL,
  ADD COLUMN IF NOT EXISTS oracao_inicial text NULL;
