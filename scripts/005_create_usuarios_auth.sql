-- Migration: Create usuarios table for authentication
-- Sprint 2: Segurança - Autenticação Segura

-- Tabela de usuários do sistema (vinculada ao Supabase Auth)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE, -- Referência ao auth.users do Supabase
  email TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  perfil TEXT NOT NULL DEFAULT 'publicador' CHECK (perfil IN ('admin', 'anciao', 'publicador')),
  publicador_id UUID REFERENCES publicadores(id) ON DELETE SET NULL,
  pin_hash TEXT, -- Hash do PIN para acesso rápido (opcional)
  ativo BOOLEAN DEFAULT TRUE,
  ultimo_acesso TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de sessões (para controle de sessões ativas)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil ON usuarios(perfil);
CREATE INDEX IF NOT EXISTS idx_usuarios_auth_id ON usuarios(auth_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_publicador ON usuarios(publicador_id);
CREATE INDEX IF NOT EXISTS idx_sessions_usuario ON user_sessions(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);

-- Comentários
COMMENT ON TABLE usuarios IS 'Usuários do sistema com autenticação';
COMMENT ON COLUMN usuarios.auth_id IS 'ID do usuário no Supabase Auth (auth.users)';
COMMENT ON COLUMN usuarios.pin_hash IS 'Hash do PIN de 6 dígitos para acesso rápido';
