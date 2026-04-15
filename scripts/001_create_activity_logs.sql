-- Migration: Create activity_logs table for audit trail
-- Sprint 1: Fundação - Log de Atividades

-- Tabela para logs de atividade
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tabela TEXT NOT NULL,
  registro_id UUID,
  acao TEXT NOT NULL CHECK (acao IN ('criar', 'editar', 'excluir', 'login', 'logout', 'outro')),
  dados_antes JSONB,
  dados_depois JSONB,
  perfil TEXT,
  usuario_email TEXT,
  usuario_nome TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_tabela ON activity_logs(tabela);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_acao ON activity_logs(acao);
CREATE INDEX IF NOT EXISTS idx_activity_logs_perfil ON activity_logs(perfil);
CREATE INDEX IF NOT EXISTS idx_activity_logs_registro_id ON activity_logs(registro_id);

-- Comentários para documentação
COMMENT ON TABLE activity_logs IS 'Tabela para registro de todas as atividades do sistema (auditoria)';
COMMENT ON COLUMN activity_logs.tabela IS 'Nome da tabela afetada pela ação';
COMMENT ON COLUMN activity_logs.registro_id IS 'ID do registro afetado (quando aplicável)';
COMMENT ON COLUMN activity_logs.acao IS 'Tipo de ação: criar, editar, excluir, login, logout, outro';
COMMENT ON COLUMN activity_logs.dados_antes IS 'Estado do registro antes da alteração (para editar/excluir)';
COMMENT ON COLUMN activity_logs.dados_depois IS 'Estado do registro após a alteração (para criar/editar)';
COMMENT ON COLUMN activity_logs.perfil IS 'Perfil do usuário que executou a ação';
COMMENT ON COLUMN activity_logs.usuario_email IS 'Email do usuário que executou a ação';
