# Scripts MySQL - Quadro de Anúncios Sabará

Esta pasta contém todos os scripts SQL para criação e manutenção do banco de dados MySQL.

## Estrutura de Pastas

```
scripts/mysql/
├── ddl/                    # Data Definition Language (Estrutura)
│   ├── 000-create-database.sql
│   ├── 001-create-grupos.sql
│   ├── 002-create-publicadores.sql
│   ├── 003-create-anuncios.sql
│   ├── 004-create-equipe-tecnica.sql
│   ├── 005-create-servico-campo.sql
│   ├── 006-create-vida-ministerio.sql
│   ├── 007-create-sentinela.sql
│   ├── 008-create-usuarios.sql
│   └── 009-create-distritos-congregacoes.sql
│
└── dml/                    # Data Manipulation Language (Dados)
    └── 001-insert-alcadas.sql
```

## Ordem de Execução

### DDL (Estrutura)
Execute os scripts DDL na ordem numérica:

```bash
mysql -u usuario -p < ddl/000-create-database.sql
mysql -u usuario -p quadro_anuncios_sabara < ddl/001-create-grupos.sql
mysql -u usuario -p quadro_anuncios_sabara < ddl/002-create-publicadores.sql
mysql -u usuario -p quadro_anuncios_sabara < ddl/003-create-anuncios.sql
mysql -u usuario -p quadro_anuncios_sabara < ddl/004-create-equipe-tecnica.sql
mysql -u usuario -p quadro_anuncios_sabara < ddl/005-create-servico-campo.sql
mysql -u usuario -p quadro_anuncios_sabara < ddl/006-create-vida-ministerio.sql
mysql -u usuario -p quadro_anuncios_sabara < ddl/007-create-sentinela.sql
mysql -u usuario -p quadro_anuncios_sabara < ddl/008-create-usuarios.sql
mysql -u usuario -p quadro_anuncios_sabara < ddl/009-create-distritos-congregacoes.sql
```

### DML (Dados Iniciais)
Após criar a estrutura, execute os scripts DML:

```bash
mysql -u usuario -p quadro_anuncios_sabara < dml/001-insert-alcadas.sql
```

## Tabelas do Sistema

### Tabelas Principais
| Tabela | Descrição |
|--------|-----------|
| `grupos` | Grupos de estudo/serviço da congregação |
| `publicadores` | Cadastro de publicadores |
| `anuncios` | Anúncios do quadro |
| `usuarios` | Usuários do sistema |
| `alcadas` | Níveis de permissão |

### Tabelas de Designações
| Tabela | Descrição |
|--------|-----------|
| `equipe_tecnica` | Designações de som, indicadores, micro-volante |
| `servico_campo_semana` | Serviço de campo durante a semana |
| `servico_campo_cartas` | Arranjo de cartas |
| `servico_campo_sabado` | Dirigentes de sábado |
| `servico_campo_domingo` | Dirigentes de domingo |

### Tabelas Vida e Ministério
| Tabela | Descrição |
|--------|-----------|
| `vida_ministerio_meses` | Meses da reunião |
| `vida_ministerio_semanas` | Semanas com programação |
| `vida_ministerio_partes` | Partes e designações |

### Tabelas Sentinela
| Tabela | Descrição |
|--------|-----------|
| `sentinela_meses` | Meses de estudo |
| `sentinela_estudos` | Estudos semanais |
| `sentinela_paragrafos` | Parágrafos do estudo |
| `sentinela_recapitulacao` | Perguntas de recapitulação |
| `sentinela_progresso` | Progresso de leitura |
| `sentinela_favoritos` | Favoritos do usuário |
| `sentinela_historico` | Histórico de acesso |

### Tabelas Organizacionais
| Tabela | Descrição |
|--------|-----------|
| `distritos` | Distritos/circuitos |
| `congregacoes` | Congregações |

## Notas Importantes

1. **UUID**: Todas as tabelas usam UUID como chave primária (CHAR(36))
2. **Timestamps**: Campos `criado_em` e `atualizado_em` são preenchidos automaticamente
3. **Charset**: Todas as tabelas usam `utf8mb4` para suporte completo a caracteres especiais
4. **Engine**: Todas as tabelas usam InnoDB para suporte a transações e chaves estrangeiras
5. **JSON**: Campos JSON são usados para arrays (textos, permissões, etc.)

## Requisitos

- MySQL 8.0+ (recomendado)
- Ou MariaDB 10.5+

A função `UUID()` e o tipo JSON requerem MySQL 8.0 ou superior.
