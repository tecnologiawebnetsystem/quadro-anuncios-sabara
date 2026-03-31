-- =============================================
-- SCRIPT COMPLETO - TODAS AS TABELAS
-- Este arquivo contém toda a estrutura do banco em um único script
-- Execute este arquivo OU os scripts individuais (001, 002, etc.)
-- =============================================

-- =============================================
-- CRIAÇÃO DO BANCO DE DADOS
-- =============================================
CREATE DATABASE IF NOT EXISTS quadro_anuncios_sabara
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE quadro_anuncios_sabara;

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = utf8mb4_unicode_ci;
SET time_zone = '-03:00';

-- =============================================
-- TABELA: grupos
-- =============================================
CREATE TABLE IF NOT EXISTS grupos (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  numero INT NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  local VARCHAR(500),
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_grupos_numero (numero),
  INDEX idx_grupos_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA: publicadores
-- =============================================
CREATE TABLE IF NOT EXISTS publicadores (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  nome VARCHAR(255) NOT NULL,
  grupo_id CHAR(36),
  anciao TINYINT(1) DEFAULT 0,
  servo_ministerial TINYINT(1) DEFAULT 0,
  pioneiro_regular TINYINT(1) DEFAULT 0,
  pioneiro_auxiliar TINYINT(1) DEFAULT 0,
  is_lider TINYINT(1) DEFAULT 0,
  is_auxiliar TINYINT(1) DEFAULT 0,
  ativo TINYINT(1) DEFAULT 1,
  telefone VARCHAR(20),
  email VARCHAR(255),
  endereco TEXT,
  data_nascimento DATE,
  data_batismo DATE,
  observacoes TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_publicadores_grupo FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE SET NULL,
  INDEX idx_publicadores_nome (nome),
  INDEX idx_publicadores_grupo (grupo_id),
  INDEX idx_publicadores_anciao (anciao),
  INDEX idx_publicadores_servo (servo_ministerial),
  INDEX idx_publicadores_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA: anuncios
-- =============================================
CREATE TABLE IF NOT EXISTS anuncios (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  titulo VARCHAR(500) NOT NULL,
  texto TEXT NOT NULL,
  imagem_url VARCHAR(1000),
  ativo TINYINT(1) DEFAULT 1,
  ordem INT DEFAULT 0,
  data_evento DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_anuncios_ordem (ordem),
  INDEX idx_anuncios_ativo (ativo),
  INDEX idx_anuncios_data_evento (data_evento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA: equipe_tecnica
-- =============================================
CREATE TABLE IF NOT EXISTS equipe_tecnica (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  mes VARCHAR(7) NOT NULL,
  data DATE NOT NULL,
  dia_semana VARCHAR(20) NOT NULL,
  indicador1_id CHAR(36),
  indicador1_nome VARCHAR(255),
  indicador2_id CHAR(36),
  indicador2_nome VARCHAR(255),
  microvolante1_id CHAR(36),
  microvolante1_nome VARCHAR(255),
  microvolante2_id CHAR(36),
  microvolante2_nome VARCHAR(255),
  som_id CHAR(36),
  som_nome VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_equipe_indicador1 FOREIGN KEY (indicador1_id) REFERENCES publicadores(id) ON DELETE SET NULL,
  CONSTRAINT fk_equipe_indicador2 FOREIGN KEY (indicador2_id) REFERENCES publicadores(id) ON DELETE SET NULL,
  CONSTRAINT fk_equipe_microvolante1 FOREIGN KEY (microvolante1_id) REFERENCES publicadores(id) ON DELETE SET NULL,
  CONSTRAINT fk_equipe_microvolante2 FOREIGN KEY (microvolante2_id) REFERENCES publicadores(id) ON DELETE SET NULL,
  CONSTRAINT fk_equipe_som FOREIGN KEY (som_id) REFERENCES publicadores(id) ON DELETE SET NULL,
  UNIQUE KEY uk_equipe_data_dia (data, dia_semana),
  INDEX idx_equipe_mes (mes),
  INDEX idx_equipe_data (data)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELAS: servico_campo_*
-- =============================================
CREATE TABLE IF NOT EXISTS servico_campo_semana (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  dia_semana VARCHAR(20) NOT NULL,
  dirigente_id CHAR(36),
  dirigente_nome VARCHAR(255) NOT NULL,
  periodo VARCHAR(20) NOT NULL,
  horario VARCHAR(10) NOT NULL,
  ativo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_servico_semana_dirigente FOREIGN KEY (dirigente_id) REFERENCES publicadores(id) ON DELETE SET NULL,
  UNIQUE KEY uk_servico_semana_dia (dia_semana)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS servico_campo_cartas (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  dia_semana VARCHAR(20) NOT NULL,
  descricao VARCHAR(500),
  responsavel_id CHAR(36),
  responsavel_nome VARCHAR(255) NOT NULL,
  periodo VARCHAR(20) NOT NULL,
  horario VARCHAR(10) NOT NULL,
  ativo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_servico_cartas_responsavel FOREIGN KEY (responsavel_id) REFERENCES publicadores(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS servico_campo_sabado (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  data DATE NOT NULL,
  mes VARCHAR(7) NOT NULL,
  periodo VARCHAR(20) NOT NULL,
  horario VARCHAR(10) NOT NULL,
  dirigente_id CHAR(36),
  dirigente_nome VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_servico_sabado_dirigente FOREIGN KEY (dirigente_id) REFERENCES publicadores(id) ON DELETE SET NULL,
  UNIQUE KEY uk_servico_sabado_data_periodo (data, periodo),
  INDEX idx_servico_sabado_mes (mes),
  INDEX idx_servico_sabado_data (data)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS servico_campo_domingo (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  data DATE NOT NULL,
  mes VARCHAR(7) NOT NULL,
  horario VARCHAR(10) NOT NULL DEFAULT '8:45',
  dirigente_id CHAR(36),
  dirigente_nome VARCHAR(255),
  tipo VARCHAR(20) NOT NULL DEFAULT 'individual',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_servico_domingo_dirigente FOREIGN KEY (dirigente_id) REFERENCES publicadores(id) ON DELETE SET NULL,
  UNIQUE KEY uk_servico_domingo_data (data),
  INDEX idx_servico_domingo_mes (mes),
  INDEX idx_servico_domingo_data (data)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELAS: vida_ministerio_*
-- =============================================
CREATE TABLE IF NOT EXISTS vida_ministerio_meses (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  mes INT NOT NULL,
  ano INT NOT NULL,
  cor_tema VARCHAR(20) DEFAULT '#3b82f6',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_vida_ministerio_mes_ano (mes, ano),
  INDEX idx_vida_ministerio_meses_ano (ano)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vida_ministerio_semanas (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  mes_id CHAR(36) NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  leitura_semanal VARCHAR(500),
  cantico_inicial INT,
  cantico_inicial_nome VARCHAR(255),
  cantico_meio INT,
  cantico_meio_nome VARCHAR(255),
  cantico_final INT,
  cantico_final_nome VARCHAR(255),
  sem_reuniao TINYINT(1) DEFAULT 0,
  motivo_sem_reuniao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_vida_ministerio_semanas_mes FOREIGN KEY (mes_id) REFERENCES vida_ministerio_meses(id) ON DELETE CASCADE,
  INDEX idx_vida_ministerio_semanas_mes (mes_id),
  INDEX idx_vida_ministerio_semanas_data (data_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vida_ministerio_partes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  semana_id CHAR(36) NOT NULL,
  secao VARCHAR(50) NOT NULL,
  titulo VARCHAR(500) NOT NULL,
  tempo VARCHAR(20),
  participante_id CHAR(36),
  participante_nome VARCHAR(255),
  ajudante_id CHAR(36),
  ajudante_nome VARCHAR(255),
  sala VARCHAR(50) DEFAULT 'principal',
  ordem INT NOT NULL,
  descricao TEXT,
  textos JSON DEFAULT NULL,
  pergunta1 TEXT,
  resposta1 TEXT,
  pergunta2 TEXT,
  resposta2 TEXT,
  texto_biblia VARCHAR(500),
  licao TEXT,
  leitor_id CHAR(36),
  leitor_nome VARCHAR(255),
  oracao_final_id CHAR(36),
  oracao_final_nome VARCHAR(255),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_vida_ministerio_partes_semana FOREIGN KEY (semana_id) REFERENCES vida_ministerio_semanas(id) ON DELETE CASCADE,
  CONSTRAINT fk_vida_ministerio_partes_participante FOREIGN KEY (participante_id) REFERENCES publicadores(id) ON DELETE SET NULL,
  CONSTRAINT fk_vida_ministerio_partes_ajudante FOREIGN KEY (ajudante_id) REFERENCES publicadores(id) ON DELETE SET NULL,
  CONSTRAINT fk_vida_ministerio_partes_leitor FOREIGN KEY (leitor_id) REFERENCES publicadores(id) ON DELETE SET NULL,
  CONSTRAINT fk_vida_ministerio_partes_oracao FOREIGN KEY (oracao_final_id) REFERENCES publicadores(id) ON DELETE SET NULL,
  INDEX idx_vida_ministerio_partes_semana (semana_id),
  INDEX idx_vida_ministerio_partes_secao (secao),
  INDEX idx_vida_ministerio_partes_ordem (ordem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELAS: sentinela_*
-- =============================================
CREATE TABLE IF NOT EXISTS sentinela_meses (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  mes INT NOT NULL,
  ano INT NOT NULL,
  cor_tema VARCHAR(20) DEFAULT '#3b82f6',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_sentinela_mes_ano (mes, ano),
  INDEX idx_sentinela_meses_ano (ano)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sentinela_estudos (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  mes_id CHAR(36) NOT NULL,
  numero_estudo INT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  cantico_inicial INT,
  cantico_inicial_nome VARCHAR(255),
  cantico_final INT,
  cantico_final_nome VARCHAR(255),
  titulo VARCHAR(500) NOT NULL,
  texto_tema TEXT,
  objetivo TEXT,
  imagem_capa VARCHAR(1000),
  sem_reuniao TINYINT(1) DEFAULT 0,
  motivo_sem_reuniao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sentinela_estudos_mes FOREIGN KEY (mes_id) REFERENCES sentinela_meses(id) ON DELETE CASCADE,
  INDEX idx_sentinela_estudos_mes (mes_id),
  INDEX idx_sentinela_estudos_numero (numero_estudo),
  INDEX idx_sentinela_estudos_data (data_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sentinela_paragrafos (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  estudo_id CHAR(36) NOT NULL,
  numero VARCHAR(20) NOT NULL,
  texto_base TEXT,
  pergunta TEXT NOT NULL,
  resposta TEXT,
  imagem VARCHAR(1000),
  imagem_legenda VARCHAR(500),
  imagem_descricao TEXT,
  imagem_url VARCHAR(1000),
  imagem_explicacao TEXT,
  ordem INT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sentinela_paragrafos_estudo FOREIGN KEY (estudo_id) REFERENCES sentinela_estudos(id) ON DELETE CASCADE,
  INDEX idx_sentinela_paragrafos_estudo (estudo_id),
  INDEX idx_sentinela_paragrafos_ordem (ordem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sentinela_recapitulacao (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  estudo_id CHAR(36) NOT NULL,
  pergunta TEXT NOT NULL,
  resposta TEXT,
  ordem INT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sentinela_recapitulacao_estudo FOREIGN KEY (estudo_id) REFERENCES sentinela_estudos(id) ON DELETE CASCADE,
  INDEX idx_sentinela_recapitulacao_estudo (estudo_id),
  INDEX idx_sentinela_recapitulacao_ordem (ordem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sentinela_progresso (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  estudo_id CHAR(36) NOT NULL,
  usuario_id CHAR(36) NOT NULL,
  paragrafos_lidos JSON DEFAULT NULL,
  concluido TINYINT(1) DEFAULT 0,
  ultima_leitura DATETIME,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sentinela_progresso_estudo FOREIGN KEY (estudo_id) REFERENCES sentinela_estudos(id) ON DELETE CASCADE,
  UNIQUE KEY uk_sentinela_progresso_estudo_usuario (estudo_id, usuario_id),
  INDEX idx_sentinela_progresso_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sentinela_favoritos (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  estudo_id CHAR(36) NOT NULL,
  usuario_id CHAR(36) NOT NULL,
  paragrafo_id CHAR(36),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sentinela_favoritos_estudo FOREIGN KEY (estudo_id) REFERENCES sentinela_estudos(id) ON DELETE CASCADE,
  CONSTRAINT fk_sentinela_favoritos_paragrafo FOREIGN KEY (paragrafo_id) REFERENCES sentinela_paragrafos(id) ON DELETE CASCADE,
  INDEX idx_sentinela_favoritos_usuario (usuario_id),
  INDEX idx_sentinela_favoritos_estudo (estudo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sentinela_historico (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  estudo_id CHAR(36) NOT NULL,
  usuario_id CHAR(36) NOT NULL,
  acessado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sentinela_historico_estudo FOREIGN KEY (estudo_id) REFERENCES sentinela_estudos(id) ON DELETE CASCADE,
  INDEX idx_sentinela_historico_usuario (usuario_id),
  INDEX idx_sentinela_historico_estudo (estudo_id),
  INDEX idx_sentinela_historico_acessado (acessado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELAS: alcadas e usuarios
-- =============================================
CREATE TABLE IF NOT EXISTS alcadas (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  nome VARCHAR(100) NOT NULL,
  tipo ENUM('ADMIN', 'ANCIAO', 'SERVO_MINISTERIAL', 'PIONEIRO', 'PUBLICADOR') NOT NULL,
  descricao TEXT,
  permissoes JSON DEFAULT NULL,
  cor VARCHAR(20),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_alcadas_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuarios (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  senha VARCHAR(255),
  avatar VARCHAR(1000),
  alcada_id CHAR(36),
  publicador_id CHAR(36),
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuarios_alcada FOREIGN KEY (alcada_id) REFERENCES alcadas(id) ON DELETE SET NULL,
  CONSTRAINT fk_usuarios_publicador FOREIGN KEY (publicador_id) REFERENCES publicadores(id) ON DELETE SET NULL,
  INDEX idx_usuarios_email (email),
  INDEX idx_usuarios_alcada (alcada_id),
  INDEX idx_usuarios_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELAS: distritos e congregacoes
-- =============================================
CREATE TABLE IF NOT EXISTS distritos (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  numero INT NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_distritos_numero (numero),
  INDEX idx_distritos_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS congregacoes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  numero INT NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  distrito_id CHAR(36),
  endereco TEXT,
  cidade VARCHAR(255),
  estado VARCHAR(2),
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_congregacoes_distrito FOREIGN KEY (distrito_id) REFERENCES distritos(id) ON DELETE SET NULL,
  INDEX idx_congregacoes_numero (numero),
  INDEX idx_congregacoes_distrito (distrito_id),
  INDEX idx_congregacoes_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- FIM DO SCRIPT
-- =============================================
SELECT 'Banco de dados criado com sucesso!' AS status;
