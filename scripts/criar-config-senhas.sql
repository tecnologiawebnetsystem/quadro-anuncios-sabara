-- Script para criar as configurações de senhas no banco de dados
-- Insere as senhas padrão para administrador e ancião

INSERT INTO configuracoes (chave, valor, descricao)
VALUES 
  ('senha_administrador', '{"senha": "080754"}', 'Senha de acesso do perfil Administrador'),
  ('senha_anciao', '{"senha": "123456"}', 'Senha de acesso do perfil Ancião')
ON CONFLICT (chave) DO NOTHING;
