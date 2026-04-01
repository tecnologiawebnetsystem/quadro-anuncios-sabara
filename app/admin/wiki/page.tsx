"use client"

import { useState } from "react"
import { normalizar } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  Search,
  LayoutDashboard,
  Users,
  Calendar,
  Wrench,
  Sparkles,
  MapPin,
  Settings,
  Brain,
  Gem,
  BookMarked,
  UserCheck,
  Shield,
  Flag,
  Wand2,
  FileText,
  ChevronRight,
  ExternalLink,
  Mic,
  Volume2
} from "lucide-react"
import Link from "next/link"

// Dados da Wiki - Funcionalidades do Administrador
const funcionalidadesAdmin = [
  {
    categoria: "Dashboard",
    icon: LayoutDashboard,
    cor: "bg-blue-600",
    itens: [
      {
        titulo: "Painel Principal",
        descricao: "Visao geral da congregacao com estatisticas, alertas e acoes rapidas.",
        link: "/admin",
        funcionalidades: [
          "Contagem de publicadores por privilegio",
          "Alertas automaticos (escalas vazias, designacoes pendentes)",
          "Proximos eventos e reunioes",
          "Acoes rapidas para cadastros"
        ],
        ia: true,
        iaDescricao: "Insights com IA - Gera analises personalizadas sobre a saude da congregacao, sugestoes e alertas inteligentes."
      }
    ]
  },
  {
    categoria: "Publicadores",
    icon: Users,
    cor: "bg-green-600",
    itens: [
      {
        titulo: "Gestao de Publicadores",
        descricao: "Cadastro completo de todos os publicadores da congregacao.",
        link: "/admin/publicadores",
        funcionalidades: [
          "Cadastro com nome, telefone, data de batismo",
          "Classificacao por privilegio (publicador, pioneiro, anciao, servo)",
          "Filtros e busca avancada",
          "Exportacao de dados"
        ]
      },
      {
        titulo: "Anciaos",
        descricao: "Lista de anciaos da congregacao.",
        link: "/admin/publicadores/anciaos",
        funcionalidades: ["Visualizacao filtrada de anciaos", "Informacoes de contato"]
      },
      {
        titulo: "Servos Ministeriais",
        descricao: "Lista de servos ministeriais.",
        link: "/admin/publicadores/servos-ministeriais",
        funcionalidades: ["Visualizacao filtrada de servos ministeriais"]
      },
      {
        titulo: "Pioneiros Regulares",
        descricao: "Lista de pioneiros regulares.",
        link: "/admin/publicadores/pioneiros-regulares",
        funcionalidades: ["Visualizacao filtrada de pioneiros regulares"]
      }
    ]
  },
  {
    categoria: "Reuniões",
    icon: Calendar,
    cor: "bg-purple-600",
    itens: [
      {
        titulo: "Vida e Ministério",
        descricao: "Programação completa da reunião de meio de semana.",
        link: "/admin/vida-ministerio",
        funcionalidades: [
          "Importação automática do JW.org",
          "Designação de participantes",
          "Visualização por semana",
          "Histórico de designações"
        ],
        ia: true,
        iaDescricao: "Sugestão de Designações - IA analisa histórico e sugere os melhores candidatos para cada parte."
      },
      {
        titulo: "Sentinela",
        descricao: "Programação completa do estudo da Sentinela de domingo.",
        link: "/admin/sentinela",
        funcionalidades: [
          "Criação manual ou importação com IA",
          "Parágrafos com texto base, pergunta e resposta",
          "Botão IA Responder por parágrafo",
          "Cântico do Meio e Cântico Final",
          "Designação de Dirigente e Leitor"
        ],
        ia: true,
        iaDescricao: "Geração de Respostas - IA gera respostas para cada parágrafo baseado no texto e pergunta. Pode gerar individualmente ou todas de uma vez na importação."
      },
      {
        titulo: "Reuniões Públicas",
        descricao: "Programação dos discursos públicos.",
        link: "/admin/reunioes-publicas",
        funcionalidades: [
          "Cadastro de discursos",
          "Designação de oradores",
          "Calendário mensal"
        ]
      }
    ]
  },
  {
    categoria: "Equipes",
    icon: Wrench,
    cor: "bg-amber-600",
    itens: [
      {
        titulo: "Equipe Técnica",
        descricao: "Escala de som, microfone e indicadores.",
        link: "/admin/equipe-tecnica",
        funcionalidades: [
          "Designação por dia da semana",
          "Indicadores 1 e 2",
          "Microfonistas (volantes)",
          "Operador de som"
        ],
        ia: true,
        iaDescricao: "Geração Automática de Escala - IA distribui equipe equilibradamente considerando histórico."
      },
      {
        titulo: "Limpeza do Salão",
        descricao: "Escala de grupos de limpeza.",
        link: "/admin/limpeza-salao",
        funcionalidades: [
          "Designação por semana",
          "Rotação automática de grupos",
          "Calendário mensal"
        ],
        ia: true,
        iaDescricao: "Geração Automática de Escala - IA distribui grupos equilibradamente ao longo do mês."
      },
      {
        titulo: "Grupos de Campo",
        descricao: "Gestão de grupos de serviço de campo.",
        link: "/admin/servico-campo",
        funcionalidades: [
          "Cadastro de grupos",
          "Designação de dirigentes",
          "Pontos de encontro"
        ]
      },
      {
        titulo: "Grupos de Estudo",
        descricao: "Gestão de grupos de estudo bíblico.",
        link: "/admin/grupo-estudos",
        funcionalidades: [
          "Cadastro de grupos",
          "Designação de dirigentes",
          "Locais e horários"
        ]
      }
    ]
  },
  {
    categoria: "Importacao com IA",
    icon: Wand2,
    cor: "bg-violet-600",
    itens: [
      {
        titulo: "Importar Sentinela",
        descricao: "Importacao inteligente do estudo da Sentinela.",
        link: "/admin/importar",
        funcionalidades: [
          "Cole o texto do estudo do JW Library ou jw.org",
          "IA extrai titulo, semana, paragrafos e perguntas",
          "Botao Gerar Todas para criar respostas com IA",
          "Selecao de Dirigente e Leitor antes de salvar",
          "Detecta estudos ja cadastrados (atualiza ou cria novo)",
          "Progresso visual durante geracao das respostas"
        ],
        ia: true,
        iaDescricao: "Processamento completo com IA - Extrai dados do texto e gera respostas inteligentes para todos os paragrafos automaticamente."
      }
    ]
  },
  {
    categoria: "Configuracoes",
    icon: Settings,
    cor: "bg-zinc-600",
    itens: [
      {
        titulo: "Configuracoes Gerais",
        descricao: "Configuracoes da congregacao e sistema.",
        link: "/admin/configuracoes",
        funcionalidades: [
          "Dados da congregacao",
          "Horarios das reunioes",
          "Configuracao do Zoom",
          "Pontos de encontro do campo"
        ],
        ia: true,
        iaDescricao: "Central de Notificacoes IA - Gera resumos semanais e lembretes personalizados."
      }
    ]
  }
]

// Dados da Wiki - Funcionalidades de Consulta
const funcionalidadesConsulta = [
  {
    categoria: "Assistente IA",
    icon: Brain,
    cor: "bg-gradient-to-r from-violet-600 to-purple-600",
    itens: [
      {
        titulo: "Assistente de IA",
        descricao: "Central de ajuda com inteligencia artificial.",
        link: "/consulta/assistente-ia",
        funcionalidades: [
          "Assistente de Comentarios - Gera sugestoes para paragrafos",
          "Preparacao para Ministerio - Roteiros de revisitas e estudos",
          "Preparador de Partes - Ajuda para designacoes"
        ],
        ia: true,
        iaDescricao: "Todas as funcionalidades usam IA baseada exclusivamente em conteúdo do jw.org."
      }
    ]
  },
  {
    categoria: "Reuniões",
    icon: Calendar,
    cor: "bg-blue-600",
    itens: [
      {
        titulo: "Vida e Ministério",
        descricao: "Consulta da programação semanal.",
        link: "/consulta/reunioes/vida-ministerio",
        funcionalidades: [
          "Visualização das partes",
          "Designações da semana",
          "Cânticos e orações"
        ]
      },
      {
        titulo: "Sentinela",
        descricao: "Consulta do estudo da Sentinela de domingo.",
        link: "/consulta/reunioes/sentinela",
        funcionalidades: [
          "Título e texto tema do estudo",
          "Parágrafos com perguntas e respostas IA",
          "Cântico do Meio e Cântico Final",
          "Dirigente e Leitor designados"
        ]
      },
      {
        titulo: "Reuniões Públicas",
        descricao: "Consulta dos discursos públicos.",
        link: "/consulta/reunioes-publicas",
        funcionalidades: [
          "Tema do discurso",
          "Orador designado",
          "Presidente"
        ]
      }
    ]
  },
  {
    categoria: "Publicadores",
    icon: Users,
    cor: "bg-green-600",
    itens: [
      {
        titulo: "Todos os Publicadores",
        descricao: "Lista completa de publicadores.",
        link: "/consulta/publicadores",
        funcionalidades: ["Lista com filtros", "Informações de contato"]
      },
      {
        titulo: "Anciãos",
        descricao: "Lista de anciãos.",
        link: "/consulta/anciaos",
        funcionalidades: ["Contato dos anciãos"]
      },
      {
        titulo: "Servos Ministeriais",
        descricao: "Lista de servos ministeriais.",
        link: "/consulta/servos-ministeriais",
        funcionalidades: ["Contato dos servos"]
      },
      {
        titulo: "Pioneiros",
        descricao: "Lista de pioneiros regulares.",
        link: "/consulta/pioneiros",
        funcionalidades: ["Contato dos pioneiros"]
      }
    ]
  },
  {
    categoria: "Escalas",
    icon: Wrench,
    cor: "bg-amber-600",
    itens: [
      {
        titulo: "Equipe Técnica",
        descricao: "Consulta da escala de som e indicadores.",
        link: "/consulta/equipe-tecnica",
        funcionalidades: ["Escala do mês", "Designações por dia"]
      },
      {
        titulo: "Limpeza do Salão",
        descricao: "Consulta da escala de limpeza.",
        link: "/consulta/limpeza-salao",
        funcionalidades: ["Grupos designados por semana"]
      },
      {
        titulo: "Grupos de Campo",
        descricao: "Consulta dos grupos de serviço de campo.",
        link: "/consulta/servico-campo",
        funcionalidades: ["Grupos e pontos de encontro"]
      },
      {
        titulo: "Grupos de Estudo",
        descricao: "Consulta dos grupos de estudo.",
        link: "/consulta/grupos",
        funcionalidades: ["Locais e horarios"]
      }
    ]
  }
]

export default function WikiPage() {
  const [busca, setBusca] = useState("")
  const [tabAtiva, setTabAtiva] = useState("admin")

  const filtrarItens = (lista: typeof funcionalidadesAdmin) => {
    if (!busca) return lista
    const termo = normalizar(busca)
    return lista.map(cat => ({
      ...cat,
      itens: cat.itens.filter(
        item =>
          normalizar(item.titulo).includes(termo) ||
          normalizar(item.descricao).includes(termo) ||
          item.funcionalidades.some(f => normalizar(f).includes(termo))
      )
    })).filter(cat => cat.itens.length > 0)
  }

  const dadosFiltradosAdmin = filtrarItens(funcionalidadesAdmin)
  const dadosFiltradosConsulta = filtrarItens(funcionalidadesConsulta)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Wiki do InfoFlow</h1>
              <p className="text-sm text-muted-foreground">
                Documentacao completa de todas as funcionalidades
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/admin/wiki/swagger">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Documentacao API
              </Button>
            </Link>
          </div>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar funcionalidades..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800"
          />
        </div>

        {/* Estatisticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-violet-400">
                {funcionalidadesAdmin.reduce((acc, cat) => acc + cat.itens.length, 0) + 
                 funcionalidadesConsulta.reduce((acc, cat) => acc + cat.itens.length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total de Paginas</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">
                {funcionalidadesAdmin.reduce((acc, cat) => acc + cat.itens.filter(i => i.ia).length, 0) +
                 funcionalidadesConsulta.reduce((acc, cat) => acc + cat.itens.filter(i => i.ia).length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Com IA</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-400">16</p>
              <p className="text-xs text-muted-foreground">APIs Disponiveis</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">7</p>
              <p className="text-xs text-muted-foreground">APIs com IA</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={tabAtiva} onValueChange={setTabAtiva}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin" className="gap-2">
              <Shield className="h-4 w-4" />
              Administrador
            </TabsTrigger>
            <TabsTrigger value="consulta" className="gap-2">
              <Users className="h-4 w-4" />
              Consulta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin" className="mt-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-8">
                {dadosFiltradosAdmin.map((categoria) => (
                  <div key={categoria.categoria}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${categoria.cor}`}>
                        <categoria.icon className="h-4 w-4 text-white" />
                      </div>
                      <h2 className="text-lg font-semibold">{categoria.categoria}</h2>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      {categoria.itens.map((item) => (
                        <Card key={item.titulo} className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                  {item.titulo}
                                  {item.ia && (
                                    <Badge variant="secondary" className="bg-violet-600/20 text-violet-400 text-xs">
                                      IA
                                    </Badge>
                                  )}
                                </CardTitle>
                                <CardDescription className="text-xs mt-1">
                                  {item.descricao}
                                </CardDescription>
                              </div>
                              <Link href={item.link}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {item.funcionalidades.map((func, idx) => (
                                <li key={idx} className="flex items-center gap-1">
                                  <ChevronRight className="h-3 w-3 text-zinc-600" />
                                  {func}
                                </li>
                              ))}
                            </ul>
                            {item.ia && item.iaDescricao && (
                              <div className="mt-3 p-2 rounded bg-violet-600/10 border border-violet-600/20">
                                <p className="text-xs text-violet-300 flex items-start gap-1">
                                  <Brain className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                  {item.iaDescricao}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="consulta" className="mt-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-8">
                {dadosFiltradosConsulta.map((categoria) => (
                  <div key={categoria.categoria}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${categoria.cor}`}>
                        <categoria.icon className="h-4 w-4 text-white" />
                      </div>
                      <h2 className="text-lg font-semibold">{categoria.categoria}</h2>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      {categoria.itens.map((item) => (
                        <Card key={item.titulo} className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                  {item.titulo}
                                  {item.ia && (
                                    <Badge variant="secondary" className="bg-violet-600/20 text-violet-400 text-xs">
                                      IA
                                    </Badge>
                                  )}
                                </CardTitle>
                                <CardDescription className="text-xs mt-1">
                                  {item.descricao}
                                </CardDescription>
                              </div>
                              <Link href={item.link}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {item.funcionalidades.map((func, idx) => (
                                <li key={idx} className="flex items-center gap-1">
                                  <ChevronRight className="h-3 w-3 text-zinc-600" />
                                  {func}
                                </li>
                              ))}
                            </ul>
                            {item.ia && item.iaDescricao && (
                              <div className="mt-3 p-2 rounded bg-violet-600/10 border border-violet-600/20">
                                <p className="text-xs text-violet-300 flex items-start gap-1">
                                  <Brain className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                  {item.iaDescricao}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
