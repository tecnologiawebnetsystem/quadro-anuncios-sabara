-- Migration: Create push_subscriptions table for web push notifications
-- Sprint 3: PWA/Notificações - Push Notifications

-- Tabela para armazenar subscriptions de push
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publicador_id UUID REFERENCES publicadores(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_publicador ON push_subscriptions(publicador_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Comentários
COMMENT ON TABLE push_subscriptions IS 'Armazena as subscriptions de push notifications dos publicadores';
COMMENT ON COLUMN push_subscriptions.endpoint IS 'URL do endpoint de push do navegador';
COMMENT ON COLUMN push_subscriptions.p256dh IS 'Chave pública do cliente para criptografia';
COMMENT ON COLUMN push_subscriptions.auth IS 'Segredo de autenticação do cliente';
