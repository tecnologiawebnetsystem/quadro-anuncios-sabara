-- Criação da tabela de cânticos
-- Esta tabela armazena os cânticos com número e descrição

CREATE TABLE IF NOT EXISTS canticos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero INTEGER NOT NULL UNIQUE,
  descricao VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por número
CREATE INDEX IF NOT EXISTS idx_canticos_numero ON canticos(numero);

-- Comentário na tabela
COMMENT ON TABLE canticos IS 'Tabela de cânticos com número e descrição';
COMMENT ON COLUMN canticos.numero IS 'Número do cântico (1-151)';
COMMENT ON COLUMN canticos.descricao IS 'Nome/descrição do cântico';
