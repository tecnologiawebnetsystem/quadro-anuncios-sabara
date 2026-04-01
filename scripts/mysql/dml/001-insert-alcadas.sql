-- =============================================
-- DADOS INICIAIS: alcadas
-- Descrição: Níveis de acesso padrão do sistema
-- =============================================

INSERT INTO alcadas (id, nome, tipo, descricao, permissoes, cor) VALUES
(UUID(), 'Administrador', 'ADMIN', 'Acesso total ao sistema', 
  JSON_ARRAY(
    'VISUALIZAR_PUBLICADORES', 'CRIAR_PUBLICADOR', 'EDITAR_PUBLICADOR', 'EXCLUIR_PUBLICADOR',
    'VISUALIZAR_ANUNCIOS', 'CRIAR_ANUNCIO', 'EDITAR_ANUNCIO', 'EXCLUIR_ANUNCIO', 'PUBLICAR_ANUNCIO',
    'GERENCIAR_ALCADAS', 'GERENCIAR_CONFIGURACOES',
    'VISUALIZAR_RELATORIOS', 'EXPORTAR_RELATORIOS',
    'GERENCIAR_DISTRITOS', 'GERENCIAR_CONGREGACOES', 'GERENCIAR_GRUPOS_SERVICO'
  ), '#ef4444'),

(UUID(), 'Ancião', 'ANCIAO', 'Acesso para anciãos da congregação',
  JSON_ARRAY(
    'VISUALIZAR_PUBLICADORES', 'CRIAR_PUBLICADOR', 'EDITAR_PUBLICADOR',
    'VISUALIZAR_ANUNCIOS', 'CRIAR_ANUNCIO', 'EDITAR_ANUNCIO', 'PUBLICAR_ANUNCIO',
    'VISUALIZAR_RELATORIOS', 'EXPORTAR_RELATORIOS'
  ), '#3b82f6'),

(UUID(), 'Servo Ministerial', 'SERVO_MINISTERIAL', 'Acesso para servos ministeriais',
  JSON_ARRAY(
    'VISUALIZAR_PUBLICADORES',
    'VISUALIZAR_ANUNCIOS', 'CRIAR_ANUNCIO',
    'VISUALIZAR_RELATORIOS'
  ), '#22c55e'),

(UUID(), 'Pioneiro', 'PIONEIRO', 'Acesso para pioneiros',
  JSON_ARRAY(
    'VISUALIZAR_PUBLICADORES',
    'VISUALIZAR_ANUNCIOS',
    'VISUALIZAR_RELATORIOS'
  ), '#f59e0b'),

(UUID(), 'Publicador', 'PUBLICADOR', 'Acesso básico para publicadores',
  JSON_ARRAY(
    'VISUALIZAR_ANUNCIOS'
  ), '#6b7280');
