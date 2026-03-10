// ========================================
// TIPOS E INTERFACES PARA O SISTEMA
// Preparado para integração com ORM (Prisma/Drizzle)
// ========================================

// -------------------- ENUMS --------------------

export enum StatusAtivo {
  ATIVO = "ATIVO",
  INATIVO = "INATIVO",
}

export enum TipoAlcada {
  ADMIN = "ADMIN",
  ANCIAO = "ANCIAO",
  SERVO_MINISTERIAL = "SERVO_MINISTERIAL",
  PIONEIRO = "PIONEIRO",
  PUBLICADOR = "PUBLICADOR",
}

export enum PermissaoSistema {
  // Publicadores
  VISUALIZAR_PUBLICADORES = "VISUALIZAR_PUBLICADORES",
  CRIAR_PUBLICADOR = "CRIAR_PUBLICADOR",
  EDITAR_PUBLICADOR = "EDITAR_PUBLICADOR",
  EXCLUIR_PUBLICADOR = "EXCLUIR_PUBLICADOR",
  
  // Anúncios
  VISUALIZAR_ANUNCIOS = "VISUALIZAR_ANUNCIOS",
  CRIAR_ANUNCIO = "CRIAR_ANUNCIO",
  EDITAR_ANUNCIO = "EDITAR_ANUNCIO",
  EXCLUIR_ANUNCIO = "EXCLUIR_ANUNCIO",
  PUBLICAR_ANUNCIO = "PUBLICAR_ANUNCIO",
  
  // Alçadas
  GERENCIAR_ALCADAS = "GERENCIAR_ALCADAS",
  
  // Configurações
  GERENCIAR_CONFIGURACOES = "GERENCIAR_CONFIGURACOES",
  
  // Relatórios
  VISUALIZAR_RELATORIOS = "VISUALIZAR_RELATORIOS",
  EXPORTAR_RELATORIOS = "EXPORTAR_RELATORIOS",
  
  // Distritos e Congregações
  GERENCIAR_DISTRITOS = "GERENCIAR_DISTRITOS",
  GERENCIAR_CONGREGACOES = "GERENCIAR_CONGREGACOES",
  
  // Grupos de Serviço
  GERENCIAR_GRUPOS_SERVICO = "GERENCIAR_GRUPOS_SERVICO",
}

// -------------------- TABELA DISTRITO --------------------

export interface Distrito {
  id: string
  numero: number
  nome: string
  ativo: boolean
  criadoEm: Date
  atualizadoEm: Date
  // Relacionamentos
  congregacoes?: Congregacao[]
}

// -------------------- TABELA CONGREGAÇÃO --------------------

export interface Congregacao {
  id: string
  numero: number
  nome: string
  distritoId: string
  endereco?: string
  cidade?: string
  estado?: string
  ativo: boolean
  criadoEm: Date
  atualizadoEm: Date
  // Relacionamentos
  distrito?: Distrito
  publicadores?: Publicador[]
}

// -------------------- TABELA PUBLICADOR --------------------

export interface Publicador {
  id: string
  nome: string
  congregacaoId: string
  grupoServicoId?: string
  
  // Campos booleanos para designações
  anciao: boolean
  servoMinisterial: boolean
  pioneiroRegular: boolean
  ativo: boolean
  
  // Campos opcionais
  telefone?: string
  email?: string
  dataNascimento?: Date
  dataBatismo?: Date
  observacoes?: string
  
  criadoEm: Date
  atualizadoEm: Date
  
  // Relacionamentos
  congregacao?: Congregacao
  grupoServico?: GrupoServico
}

// -------------------- INTERFACES AUXILIARES --------------------

export interface Usuario {
  id: string
  email: string
  nome: string
  senha?: string // Hash da senha
  avatar?: string
  alcadaId: string
  publicadorId?: string
  ativo: boolean
  criadoEm: Date
  atualizadoEm: Date
  // Relacionamentos
  alcada?: Alcada
  publicador?: Publicador
}

export interface Alcada {
  id: string
  nome: string
  tipo: TipoAlcada
  descricao?: string
  permissoes: PermissaoSistema[]
  cor?: string // Cor para identificação visual
  criadoEm: Date
  atualizadoEm: Date
}

export interface Endereco {
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  cep: string
}

export interface Anuncio {
  id: string
  titulo: string
  conteudo: string
  tipo: TipoAnuncio
  prioridade: PrioridadeAnuncio
  dataPublicacao: Date
  dataExpiracao?: Date
  publicado: boolean
  autorId: string
  criadoEm: Date
  atualizadoEm: Date
}

export enum TipoAnuncio {
  GERAL = "GERAL",
  URGENTE = "URGENTE",
  INFORMATIVO = "INFORMATIVO",
  DESIGNACAO = "DESIGNACAO",
}

export enum PrioridadeAnuncio {
  BAIXA = "BAIXA",
  MEDIA = "MEDIA",
  ALTA = "ALTA",
  URGENTE = "URGENTE",
}

export interface GrupoServico {
  id: string
  nome: string
  dirigente?: string
  auxiliar?: string
  criadoEm: Date
  atualizadoEm: Date
}

// -------------------- TIPOS AUXILIARES --------------------

export interface PaginacaoParams {
  pagina: number
  limite: number
  ordenarPor?: string
  ordem?: "asc" | "desc"
}

export interface PaginacaoResponse<T> {
  dados: T[]
  total: number
  pagina: number
  limite: number
  totalPaginas: number
}

export interface FiltroPublicador {
  anciao?: boolean
  servoMinisterial?: boolean
  pioneiroRegular?: boolean
  ativo?: boolean
  busca?: string
  congregacaoId?: string
  grupoServicoId?: string
}

export interface FiltroAnuncio {
  tipo?: TipoAnuncio
  publicado?: boolean
  busca?: string
  dataInicio?: Date
  dataFim?: Date
}

// -------------------- PERMISSÕES PADRÃO POR ALÇADA --------------------

export const PERMISSOES_PADRAO: Record<TipoAlcada, PermissaoSistema[]> = {
  [TipoAlcada.ADMIN]: Object.values(PermissaoSistema),
  
  [TipoAlcada.ANCIAO]: [
    PermissaoSistema.VISUALIZAR_PUBLICADORES,
    PermissaoSistema.CRIAR_PUBLICADOR,
    PermissaoSistema.EDITAR_PUBLICADOR,
    PermissaoSistema.VISUALIZAR_ANUNCIOS,
    PermissaoSistema.CRIAR_ANUNCIO,
    PermissaoSistema.EDITAR_ANUNCIO,
    PermissaoSistema.PUBLICAR_ANUNCIO,
    PermissaoSistema.VISUALIZAR_RELATORIOS,
    PermissaoSistema.EXPORTAR_RELATORIOS,
  ],
  
  [TipoAlcada.SERVO_MINISTERIAL]: [
    PermissaoSistema.VISUALIZAR_PUBLICADORES,
    PermissaoSistema.VISUALIZAR_ANUNCIOS,
    PermissaoSistema.CRIAR_ANUNCIO,
    PermissaoSistema.VISUALIZAR_RELATORIOS,
  ],
  
  [TipoAlcada.PIONEIRO]: [
    PermissaoSistema.VISUALIZAR_PUBLICADORES,
    PermissaoSistema.VISUALIZAR_ANUNCIOS,
    PermissaoSistema.VISUALIZAR_RELATORIOS,
  ],
  
  [TipoAlcada.PUBLICADOR]: [
    PermissaoSistema.VISUALIZAR_ANUNCIOS,
  ],
}
