-- Atualizar tabela publicadores para ser a tabela principal
-- Adicionar campos para anciãos, servos ministeriais, pioneiros, etc.

-- Adicionar novos campos se não existirem
ALTER TABLE publicadores 
ADD COLUMN IF NOT EXISTS anciao BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS servo_ministerial BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pioneiro_regular BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pioneiro_auxiliar BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS telefone VARCHAR(20),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS endereco TEXT,
ADD COLUMN IF NOT EXISTS data_nascimento DATE,
ADD COLUMN IF NOT EXISTS data_batismo DATE,
ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- Migrar dados existentes: is_lider -> anciao, is_auxiliar -> servo_ministerial
UPDATE publicadores 
SET anciao = is_lider 
WHERE is_lider = TRUE AND anciao IS NULL;

UPDATE publicadores 
SET servo_ministerial = is_auxiliar 
WHERE is_auxiliar = TRUE AND servo_ministerial IS NULL;

-- Criar índices para melhorar performance nas consultas
CREATE INDEX IF NOT EXISTS idx_publicadores_anciao ON publicadores(anciao) WHERE anciao = TRUE;
CREATE INDEX IF NOT EXISTS idx_publicadores_servo ON publicadores(servo_ministerial) WHERE servo_ministerial = TRUE;
CREATE INDEX IF NOT EXISTS idx_publicadores_pioneiro_regular ON publicadores(pioneiro_regular) WHERE pioneiro_regular = TRUE;
CREATE INDEX IF NOT EXISTS idx_publicadores_pioneiro_auxiliar ON publicadores(pioneiro_auxiliar) WHERE pioneiro_auxiliar = TRUE;
CREATE INDEX IF NOT EXISTS idx_publicadores_ativo ON publicadores(ativo);
