-- Script para corrigir a separação entre cargos da congregação e funções do grupo de estudo
-- 
-- CONTEXTO DO PROBLEMA:
-- A migração 004 copiou incorretamente is_lider -> anciao e is_auxiliar -> servo_ministerial
-- Porém, esses campos representam coisas DIFERENTES:
-- 
-- is_lider = Dirigente do GRUPO DE ESTUDO (função no grupo)
-- is_auxiliar = Auxiliar do GRUPO DE ESTUDO (função no grupo)
-- anciao = É ANCIÃO na CONGREGAÇÃO (cargo na congregação)
-- servo_ministerial = É SERVO MINISTERIAL na CONGREGAÇÃO (cargo na congregação)
--
-- Uma pessoa pode ser:
-- - Ancião NA congregação mas NÃO ser dirigente de grupo de estudo
-- - Servo ministerial NA congregação mas NÃO ser auxiliar de grupo de estudo
-- - Dirigente de grupo de estudo mas NÃO ser ancião
-- - etc.
--
-- SOLUÇÃO:
-- Limpar os campos anciao e servo_ministerial para FALSE
-- O usuário precisará reconfigurar manualmente os anciãos e servos ministeriais REAIS

-- Limpar os campos de cargo na congregação que foram preenchidos incorretamente
UPDATE publicadores
SET anciao = FALSE
WHERE anciao = TRUE;

UPDATE publicadores
SET servo_ministerial = FALSE
WHERE servo_ministerial = TRUE;

-- Nota: Após executar este script, o administrador precisará:
-- 1. Ir em Publicadores e marcar quem REALMENTE é ancião
-- 2. Ir em Publicadores e marcar quem REALMENTE é servo ministerial
-- 
-- Os campos is_lider e is_auxiliar (dirigente/auxiliar de grupo) permanecem inalterados
-- pois esses estão corretos e são gerenciados na tela de Grupos de Estudo
