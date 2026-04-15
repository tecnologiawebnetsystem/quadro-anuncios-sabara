-- Migration: Create backups table for backup history
-- Sprint 2: Segurança - Backup/Restauração

-- Tabela de histórico de backups
CREATE TABLE IF NOT EXISTS backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('completo', 'parcial')),
  tabelas TEXT[], -- Lista de tabelas incluídas
  tamanho_bytes BIGINT,
  arquivo_url TEXT, -- URL no Vercel Blob (se salvo)
  status TEXT DEFAULT 'concluido' CHECK (status IN ('em_andamento', 'concluido', 'erro')),
  erro_mensagem TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_backups_created_at ON backups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_backups_tipo ON backups(tipo);
CREATE INDEX IF NOT EXISTS idx_backups_status ON backups(status);

-- Comentários
COMMENT ON TABLE backups IS 'Histórico de backups realizados no sistema';
