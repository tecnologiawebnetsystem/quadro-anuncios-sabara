-- Migration: Create permissoes table for role-based access control
-- Sprint 6: Avançado - Gestão de Permissões

-- Tabela para permissões por perfil
CREATE TABLE IF NOT EXISTS permissoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfil TEXT NOT NULL CHECK (perfil IN ('admin', 'anciao', 'publicador')),
  funcionalidade TEXT NOT NULL,
  permitido BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(perfil, funcionalidade)
);

-- Inserir permissões padrão
INSERT INTO permissoes (perfil, funcionalidade, permitido) VALUES
  -- Admin - acesso total
  ('admin', 'publicadores.visualizar', true),
  ('admin', 'publicadores.criar', true),
  ('admin', 'publicadores.editar', true),
  ('admin', 'publicadores.excluir', true),
  ('admin', 'grupos.gerenciar', true),
  ('admin', 'equipe_tecnica.gerenciar', true),
  ('admin', 'limpeza.gerenciar', true),
  ('admin', 'vida_ministerio.gerenciar', true),
  ('admin', 'discursos.gerenciar', true),
  ('admin', 'sentinela.gerenciar', true),
  ('admin', 'assistencia.gerenciar', true),
  ('admin', 'campo.gerenciar', true),
  ('admin', 'territorios.gerenciar', true),
  ('admin', 'usuarios.gerenciar', true),
  ('admin', 'backup.exportar', true),
  ('admin', 'backup.importar', true),
  ('admin', 'logs.visualizar', true),
  ('admin', 'configuracoes.gerenciar', true),
  ('admin', 'permissoes.gerenciar', true),
  
  -- Ancião - acesso parcial
  ('anciao', 'publicadores.visualizar', true),
  ('anciao', 'publicadores.criar', true),
  ('anciao', 'publicadores.editar', true),
  ('anciao', 'publicadores.excluir', false),
  ('anciao', 'grupos.gerenciar', true),
  ('anciao', 'equipe_tecnica.gerenciar', true),
  ('anciao', 'limpeza.gerenciar', true),
  ('anciao', 'vida_ministerio.gerenciar', true),
  ('anciao', 'discursos.gerenciar', true),
  ('anciao', 'sentinela.gerenciar', false),
  ('anciao', 'assistencia.gerenciar', true),
  ('anciao', 'campo.gerenciar', true),
  ('anciao', 'territorios.gerenciar', true),
  ('anciao', 'usuarios.gerenciar', false),
  ('anciao', 'backup.exportar', true),
  ('anciao', 'backup.importar', false),
  ('anciao', 'logs.visualizar', false),
  ('anciao', 'configuracoes.gerenciar', false),
  ('anciao', 'permissoes.gerenciar', false),
  
  -- Publicador - acesso somente leitura
  ('publicador', 'publicadores.visualizar', false),
  ('publicador', 'publicadores.criar', false),
  ('publicador', 'publicadores.editar', false),
  ('publicador', 'publicadores.excluir', false),
  ('publicador', 'grupos.gerenciar', false),
  ('publicador', 'equipe_tecnica.gerenciar', false),
  ('publicador', 'limpeza.gerenciar', false),
  ('publicador', 'vida_ministerio.gerenciar', false),
  ('publicador', 'discursos.gerenciar', false),
  ('publicador', 'sentinela.gerenciar', false),
  ('publicador', 'assistencia.gerenciar', false),
  ('publicador', 'campo.gerenciar', false),
  ('publicador', 'territorios.gerenciar', false),
  ('publicador', 'usuarios.gerenciar', false),
  ('publicador', 'backup.exportar', false),
  ('publicador', 'backup.importar', false),
  ('publicador', 'logs.visualizar', false),
  ('publicador', 'configuracoes.gerenciar', false),
  ('publicador', 'permissoes.gerenciar', false)
ON CONFLICT (perfil, funcionalidade) DO NOTHING;

-- Índices
CREATE INDEX IF NOT EXISTS idx_permissoes_perfil ON permissoes(perfil);
CREATE INDEX IF NOT EXISTS idx_permissoes_funcionalidade ON permissoes(funcionalidade);

-- Comentários
COMMENT ON TABLE permissoes IS 'Controle de acesso baseado em perfil (RBAC)';
