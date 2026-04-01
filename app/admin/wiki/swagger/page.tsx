"use client"

import { normalizar } from "@/lib/utils"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileCode,
  Search,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Copy,
  Check,
  Brain,
  Database,
  Upload,
  Settings,
  Users,
  Calendar,
  Wrench
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ApiEndpoint {
  metodo: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  descricao: string
  categoria: string
  ia?: boolean
  parametros?: {
    nome: string
    tipo: string
    obrigatorio: boolean
    descricao: string
    local: "query" | "body" | "path"
  }[]
  corpo?: {
    tipo: string
    exemplo: string
  }
  resposta?: {
    tipo: string
    exemplo: string
  }
}

const apis: ApiEndpoint[] = [
  // APIs de Publicadores
  {
    metodo: "GET",
    path: "/api/publicadores",
    descricao: "Lista todos os publicadores da congregacao",
    categoria: "Publicadores",
    parametros: [
      { nome: "privilegio", tipo: "string", obrigatorio: false, descricao: "Filtrar por privilegio (anciao, servo, pioneiro, publicador)", local: "query" },
      { nome: "busca", tipo: "string", obrigatorio: false, descricao: "Buscar por nome", local: "query" }
    ],
    resposta: {
      tipo: "Publicador[]",
      exemplo: `[
  {
    "id": "uuid",
    "nome": "Joao Silva",
    "telefone": "(31) 99999-9999",
    "privilegio": "anciao",
    "batismo": "2010-05-15",
    "genero": "masculino"
  }
]`
    }
  },
  {
    metodo: "POST",
    path: "/api/publicadores",
    descricao: "Cadastra um novo publicador",
    categoria: "Publicadores",
    corpo: {
      tipo: "object",
      exemplo: `{
  "nome": "Maria Santos",
  "telefone": "(31) 98888-8888",
  "privilegio": "pioneiro_regular",
  "batismo": "2015-03-20",
  "genero": "feminino"
}`
    },
    resposta: {
      tipo: "Publicador",
      exemplo: `{
  "id": "uuid-gerado",
  "nome": "Maria Santos",
  ...
}`
    }
  },
  // APIs de Configuracoes
  {
    metodo: "GET",
    path: "/api/configuracoes",
    descricao: "Busca todas as configuracoes da congregacao",
    categoria: "Configuracoes",
    resposta: {
      tipo: "Configuracao[]",
      exemplo: `[
  { "chave": "congregacao_nome", "valor": "Sabara Sul" },
  { "chave": "reuniao_meio_semana_horario", "valor": "19:30" }
]`
    }
  },
  {
    metodo: "POST",
    path: "/api/configuracoes",
    descricao: "Salva ou atualiza uma configuracao",
    categoria: "Configuracoes",
    corpo: {
      tipo: "object",
      exemplo: `{
  "chave": "congregacao_nome",
  "valor": "Sabara Sul"
}`
    }
  },
  // APIs de Grupos
  {
    metodo: "GET",
    path: "/api/grupos",
    descricao: "Lista todos os grupos (campo, estudo, limpeza)",
    categoria: "Grupos",
    parametros: [
      { nome: "tipo", tipo: "string", obrigatorio: false, descricao: "Filtrar por tipo (campo, estudo, limpeza)", local: "query" }
    ],
    resposta: {
      tipo: "Grupo[]",
      exemplo: `[
  {
    "id": "uuid",
    "nome": "Grupo Centro",
    "tipo": "campo",
    "dirigente_id": "uuid",
    "dirigente_nome": "Jose"
  }
]`
    }
  },
  {
    metodo: "POST",
    path: "/api/grupos",
    descricao: "Cadastra um novo grupo",
    categoria: "Grupos",
    corpo: {
      tipo: "object",
      exemplo: `{
  "nome": "Grupo Norte",
  "tipo": "campo",
  "dirigente_id": "uuid-publicador"
}`
    }
  },
  // APIs de Equipe Tecnica
  {
    metodo: "GET",
    path: "/api/equipe-tecnica",
    descricao: "Lista designacoes da equipe tecnica",
    categoria: "Equipe Tecnica",
    parametros: [
      { nome: "mes", tipo: "string", obrigatorio: true, descricao: "Mes no formato YYYY-MM", local: "query" }
    ],
    resposta: {
      tipo: "EquipeTecnica[]",
      exemplo: `[
  {
    "id": "uuid",
    "data": "2024-03-15",
    "dia_semana": "quinta",
    "indicador1_nome": "Joao",
    "som_nome": "Pedro"
  }
]`
    }
  },
  {
    metodo: "POST",
    path: "/api/equipe-tecnica",
    descricao: "Cadastra ou atualiza designacao da equipe",
    categoria: "Equipe Tecnica",
    corpo: {
      tipo: "object",
      exemplo: `{
  "mes": "2024-03",
  "data": "2024-03-15",
  "dia_semana": "quinta",
  "indicador1_id": "uuid",
  "som_id": "uuid"
}`
    }
  },
  // APIs de Limpeza
  {
    metodo: "GET",
    path: "/api/limpeza-salao",
    descricao: "Lista designacoes de limpeza do salao",
    categoria: "Limpeza",
    parametros: [
      { nome: "mes", tipo: "string", obrigatorio: true, descricao: "Mes no formato YYYY-MM", local: "query" }
    ],
    resposta: {
      tipo: "LimpezaSalao[]",
      exemplo: `[
  {
    "id": 1,
    "semana": 1,
    "grupo_nome": "Grupo A",
    "data_inicio": "2024-03-01"
  }
]`
    }
  },
  // APIs de Upload
  {
    metodo: "POST",
    path: "/api/upload-imagem",
    descricao: "Faz upload de uma imagem para o Vercel Blob",
    categoria: "Upload",
    parametros: [
      { nome: "file", tipo: "File", obrigatorio: true, descricao: "Arquivo de imagem (FormData)", local: "body" }
    ],
    resposta: {
      tipo: "object",
      exemplo: `{
  "url": "https://blob.vercel-storage.com/..."
}`
    }
  },
  // APIs de Importacao com IA
  {
    metodo: "POST",
    path: "/api/importar-reuniao",
    descricao: "Importa dados de reuniao usando IA para extrair informacoes do texto",
    categoria: "IA",
    ia: true,
    corpo: {
      tipo: "object",
      exemplo: `{
  "texto": "NOSSA VIDA E MINISTERIO CRISTA\\n16-22 de marco..."
}`
    },
    resposta: {
      tipo: "DadosReuniao",
      exemplo: `{
  "tipo": "vida_ministerio",
  "dataInicio": "2024-03-16",
  "dataFim": "2024-03-22",
  "canticoInicial": 45,
  "partes": [...]
}`
    }
  },
  {
    metodo: "POST",
    path: "/api/gerar-resposta-ia",
    descricao: "Gera respostas ou aplicacoes praticas usando IA",
    categoria: "IA",
    ia: true,
    corpo: {
      tipo: "object",
      exemplo: `{
  "tipo": "resposta_paragrafo | aplicacao_vida | analise_imagem",
  "pergunta": "Texto da pergunta",
  "contexto": "Contexto adicional"
}`
    },
    resposta: {
      tipo: "object",
      exemplo: `{
  "resposta": "Texto gerado pela IA...",
  "aplicacoes": ["Aplicacao 1", "Aplicacao 2"]
}`
    }
  },
  // APIs de IA - Insights
  {
    metodo: "GET",
    path: "/api/ia/insights",
    descricao: "Gera insights inteligentes sobre a congregacao",
    categoria: "IA",
    ia: true,
    resposta: {
      tipo: "InsightsIA",
      exemplo: `{
  "resumo": "A congregacao esta em bom estado...",
  "saude": "boa",
  "insights": ["Insight 1", "Insight 2"],
  "sugestoes": ["Sugestao 1"],
  "estatisticas": {...}
}`
    }
  },
  {
    metodo: "POST",
    path: "/api/ia/sugerir-designacoes",
    descricao: "Sugere publicadores para designacoes usando IA",
    categoria: "IA",
    ia: true,
    corpo: {
      tipo: "object",
      exemplo: `{
  "tipo": "tesouros | faca_seu_ministerio | nossa_vida_crista",
  "parte": "Titulo da parte",
  "quantidade": 3
}`
    },
    resposta: {
      tipo: "object",
      exemplo: `{
  "sugestoes": [
    { "id": "uuid", "nome": "Joao", "motivo": "Participou ha 3 semanas" }
  ]
}`
    }
  },
  {
    metodo: "POST",
    path: "/api/ia/gerar-escala",
    descricao: "Gera escala automatica (limpeza ou equipe tecnica)",
    categoria: "IA",
    ia: true,
    corpo: {
      tipo: "object",
      exemplo: `{
  "tipo": "limpeza | equipe_tecnica",
  "mes": "2024-03"
}`
    },
    resposta: {
      tipo: "object",
      exemplo: `{
  "escala": [
    { "semana": 1, "grupo_id": "uuid", "grupo_nome": "Grupo A" }
  ]
}`
    }
  },
  {
    metodo: "GET",
    path: "/api/ia/notificacoes",
    descricao: "Gera notificacoes e resumos semanais com IA",
    categoria: "IA",
    ia: true,
    parametros: [
      { nome: "tipo", tipo: "string", obrigatorio: true, descricao: "resumo_semanal | lembretes", local: "query" }
    ],
    resposta: {
      tipo: "object",
      exemplo: `{
  "resumo": "Resumo da semana...",
  "destaques": ["Destaque 1"],
  "lembretes": ["Lembrete 1"]
}`
    }
  },
  {
    metodo: "POST",
    path: "/api/ia/assistente-comentarios",
    descricao: "Gera sugestoes de comentarios para paragrafos",
    categoria: "IA",
    ia: true,
    corpo: {
      tipo: "object",
      exemplo: `{
  "paragrafo": "Texto do paragrafo...",
  "pergunta": "O que aprendemos?",
  "tema": "Titulo do artigo"
}`
    },
    resposta: {
      tipo: "object",
      exemplo: `{
  "pontoChave": "Resumo do ponto principal",
  "comentarios": [
    { "texto": "Comentario 1", "tipo": "direto" }
  ],
  "textosRelacionados": ["Joao 3:16"]
}`
    }
  },
  {
    metodo: "POST",
    path: "/api/ia/preparacao-ministerio",
    descricao: "Gera roteiros para revisitas e estudos biblicos",
    categoria: "IA",
    ia: true,
    corpo: {
      tipo: "object",
      exemplo: `{
  "tipo": "apresentacao | revisita | estudo",
  "tema": "Tema ou assunto",
  "contexto": "Informacoes adicionais"
}`
    },
    resposta: {
      tipo: "object",
      exemplo: `{
  "opcoes": [
    {
      "titulo": "Opcao 1",
      "abertura": "Frase de abertura",
      "pergunta": "Pergunta de sondagem",
      "texto": "Mateus 24:14"
    }
  ]
}`
    }
  },
  {
    metodo: "POST",
    path: "/api/ia/preparador-partes",
    descricao: "Gera material de apoio para quem tem designacao",
    categoria: "IA",
    ia: true,
    corpo: {
      tipo: "object",
      exemplo: `{
  "titulo": "Titulo da parte",
  "tempo": "5 min",
  "secao": "tesouros"
}`
    },
    resposta: {
      tipo: "object",
      exemplo: `{
  "distribuicaoTempo": {...},
  "pontosPrincipais": [...],
  "ilustracoes": [...],
  "textos": [...],
  "checklist": [...]
}`
    }
  },
  // API da Biblia
  {
    metodo: "GET",
    path: "/api/biblia",
    descricao: "Busca texto biblico por referencia",
    categoria: "Biblia",
    parametros: [
      { nome: "referencia", tipo: "string", obrigatorio: true, descricao: "Referencia biblica (ex: Joao 3:16)", local: "query" }
    ],
    resposta: {
      tipo: "object",
      exemplo: `{
  "texto": "Porque Deus amou o mundo...",
  "referencia": "Joao 3:16"
}`
    }
  }
]

const categorias = [...new Set(apis.map(a => a.categoria))]

const corMetodo = {
  GET: "bg-green-600",
  POST: "bg-blue-600",
  PUT: "bg-amber-600",
  DELETE: "bg-red-600",
  PATCH: "bg-purple-600"
}

const iconeCategoria: Record<string, React.ElementType> = {
  "Publicadores": Users,
  "Configuracoes": Settings,
  "Grupos": Users,
  "Equipe Tecnica": Wrench,
  "Limpeza": Wrench,
  "Upload": Upload,
  "IA": Brain,
  "Biblia": Database
}

export default function SwaggerPage() {
  const [busca, setBusca] = useState("")
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null)
  const [expandido, setExpandido] = useState<string | null>(null)
  const [copiado, setCopiado] = useState<string | null>(null)

  const apisFiltradas = apis.filter(api => {
    const buscaNorm = normalizar(busca)
    const matchBusca = !busca ||
      normalizar(api.path).includes(buscaNorm) ||
      normalizar(api.descricao).includes(buscaNorm)
    const matchCategoria = !categoriaAtiva || api.categoria === categoriaAtiva
    return matchBusca && matchCategoria
  })

  const copiar = (texto: string, id: string) => {
    navigator.clipboard.writeText(texto)
    setCopiado(id)
    setTimeout(() => setCopiado(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/wiki">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600">
              <FileCode className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">API Documentation</h1>
              <p className="text-sm text-muted-foreground">
                Swagger - InfoFlow API v1.0
              </p>
            </div>
          </div>
          
          <Badge variant="outline" className="text-sm">
            {apis.length} endpoints
          </Badge>
        </div>

        {/* Busca e Filtros */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar endpoints..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={categoriaAtiva === null ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoriaAtiva(null)}
            >
              Todos
            </Button>
            {categorias.map((cat) => {
              const Icon = iconeCategoria[cat] || Database
              return (
                <Button
                  key={cat}
                  variant={categoriaAtiva === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoriaAtiva(cat)}
                  className="gap-1"
                >
                  <Icon className="h-3 w-3" />
                  {cat}
                  {cat === "IA" && (
                    <Badge variant="secondary" className="bg-violet-600/20 text-violet-400 text-xs ml-1">
                      7
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Lista de APIs */}
        <ScrollArea className="h-[650px]">
          <div className="space-y-3 pr-4">
            {apisFiltradas.map((api, idx) => {
              const isExpanded = expandido === `${api.metodo}-${api.path}`
              const key = `${api.metodo}-${api.path}`
              
              return (
                <Card 
                  key={idx} 
                  className={cn(
                    "border-zinc-800 transition-colors",
                    isExpanded ? "bg-zinc-900" : "bg-zinc-900/50 hover:bg-zinc-900/80"
                  )}
                >
                  <CardHeader 
                    className="py-3 cursor-pointer"
                    onClick={() => setExpandido(isExpanded ? null : key)}
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={cn("font-mono text-xs px-2", corMetodo[api.metodo])}>
                        {api.metodo}
                      </Badge>
                      <code className="text-sm font-mono text-zinc-300 flex-1">
                        {api.path}
                      </code>
                      {api.ia && (
                        <Badge variant="secondary" className="bg-violet-600/20 text-violet-400 text-xs">
                          <Brain className="h-3 w-3 mr-1" />
                          IA
                        </Badge>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <CardDescription className="text-xs mt-1 ml-14">
                      {api.descricao}
                    </CardDescription>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="pt-0 pb-4 space-y-4">
                      {/* Parametros */}
                      {api.parametros && api.parametros.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">Parametros</p>
                          <div className="space-y-2">
                            {api.parametros.map((param, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-2 text-xs bg-zinc-800/50 p-2 rounded">
                                <code className="text-blue-400">{param.nome}</code>
                                <Badge variant="outline" className="text-[10px]">{param.tipo}</Badge>
                                <Badge variant={param.obrigatorio ? "destructive" : "secondary"} className="text-[10px]">
                                  {param.obrigatorio ? "obrigatorio" : "opcional"}
                                </Badge>
                                <span className="text-muted-foreground flex-1">{param.descricao}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Corpo da Requisicao */}
                      {api.corpo && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-muted-foreground">Request Body</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={() => copiar(api.corpo!.exemplo, `body-${key}`)}
                            >
                              {copiado === `body-${key}` ? (
                                <Check className="h-3 w-3 mr-1 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3 mr-1" />
                              )}
                              Copiar
                            </Button>
                          </div>
                          <pre className="bg-zinc-950 p-3 rounded text-xs overflow-x-auto">
                            <code className="text-green-400">{api.corpo.exemplo}</code>
                          </pre>
                        </div>
                      )}

                      {/* Resposta */}
                      {api.resposta && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-muted-foreground">
                              Response <Badge variant="outline" className="text-[10px] ml-2">200</Badge>
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={() => copiar(api.resposta!.exemplo, `resp-${key}`)}
                            >
                              {copiado === `resp-${key}` ? (
                                <Check className="h-3 w-3 mr-1 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3 mr-1" />
                              )}
                              Copiar
                            </Button>
                          </div>
                          <pre className="bg-zinc-950 p-3 rounded text-xs overflow-x-auto">
                            <code className="text-amber-400">{api.resposta.exemplo}</code>
                          </pre>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
