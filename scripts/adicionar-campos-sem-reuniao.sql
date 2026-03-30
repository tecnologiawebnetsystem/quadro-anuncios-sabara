-- Adicionar campos para marcar semanas sem reunião
-- Vida e Ministério (reunião de meio de semana)
ALTER TABLE vida_ministerio_semanas
ADD COLUMN IF NOT EXISTS sem_reuniao BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS motivo_sem_reuniao TEXT;

-- Sentinela (reunião de domingo)
ALTER TABLE sentinela_estudos
ADD COLUMN IF NOT EXISTS sem_reuniao BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS motivo_sem_reuniao TEXT;
