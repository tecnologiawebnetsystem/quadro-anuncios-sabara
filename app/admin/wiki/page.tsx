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
  Volume2,
  Lock
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
      },
      {
        titulo: "Quadro de Anuncios",
        descricao: "Gerenciamento de anuncios da congregacao.",
        link: "/admin/anuncios",
        funcionalidades: [
          "Criacao e edicao de anuncios",
          "Anuncios com data de expiracao",
          "Categorias e prioridades",
          "Visualizacao publica no quadro"
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
        titulo: "Gestao de Publicadores",
        descricao: "Cadastro completo de todos os publicadores da congregacao.",
        link: "/admin/publicadores",
        funcionalidades: [
          "Cadastro com nome, telefone, data de batismo",
          "Classificacao por privilegio (publicador, pioneiro, anciao, servo)",
          "Atribuicao a grupos de estudo e campo",
          "Filtros e busca avancada",
          "Ativar/desativar publicadores"
        ]
      },
      {
        titulo: "Anciaos",
        descricao: "Lista de anciaos da congregacao.",
        link: "/admin/publicadores/anciaos",
        funcionalidades: ["Visualizacao filtrada de anciaos", "Informacoes de contato", "Contador automatico"]
      },
      {
        titulo: "Servos Ministeriais",
        descricao: "Lista de servos ministeriais.",
        link: "/admin/publicadores/servos-ministeriais",
        funcionalidades: ["Visualizacao filtrada de servos ministeriais", "Contador automatico"]
      },
      {
        titulo: "Pioneiros Regulares",
        descricao: "Lista de pioneiros regulares.",
        link: "/admin/publicadores/pioneiros-regulares",
        funcionalidades: ["Visualizacao filtrada de pioneiros regulares", "Contador automatico"]
      }
    ]
  },
  {
    categoria: "Reunioes",
    icon: Calendar,
    cor: "bg-purple-600",
    itens: [
      {
        titulo: "Vida e Ministerio",
        descricao: "Programacao completa da reuniao de meio de semana.",
        link: "/admin/vida-ministerio",
        funcionalidades: [
          "Importacao automatica do JW.org",
          "Designacao de participantes por parte",
          "Canticos e oracoes",
          "Marcar semana sem reuniao",
          "Visualizacao por semana com navegacao"
        ],
        ia: true,
        iaDescricao: "Sugestao de Designacoes - IA analisa historico e sugere os melhores candidatos para cada parte."
      },
      {
        titulo: "Sentinela",
        descricao: "Programacao completa do estudo da Sentinela de domingo.",
        link: "/admin/sentinela",
        funcionalidades: [
          "Criacao manual ou importacao com IA",
          "Paragrafos com texto base, pergunta e resposta",
          "Botao IA Responder por paragrafo",
          "Cantico do Meio e Cantico Final",
          "Designacao de Dirigente e Leitor",
          "Marcar semana sem reuniao"
        ],
        ia: true,
        iaDescricao: "Geracao de Respostas - IA gera respostas para cada paragrafo baseado no texto e pergunta. Pode gerar individualmente ou todas de uma vez."
      },
      {
        titulo: "Reunioes Publicas",
        descricao: "Programacao dos discursos publicos.",
        link: "/admin/reunioes-publicas",
        funcionalidades: [
          "Cadastro de discursos com tema",
          "Designacao de oradores",
          "Designacao de presidente",
          "Calendario mensal com navegacao"
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
        titulo: "Equipe Tecnica",
        descricao: "Escala de som, microfone e indicadores.",
        link: "/admin/equipe-tecnica",
        funcionalidades: [
          "Designacao por dia da semana",
          "Indicadores 1 e 2",
          "Microfonistas volantes (1 e 2)",
          "Selecao de microfonista no palco",
          "Operador de som"
        ],
        ia: true,
        iaDescricao: "Geracao Automatica de Escala - IA distribui equipe equilibradamente considerando historico."
      },
      {
        titulo: "Limpeza do Salao",
        descricao: "Escala de grupos de limpeza.",
        link: "/admin/limpeza-salao",
        funcionalidades: [
          "Designacao por semana",
          "Rotacao automatica de grupos",
          "Calendario mensal",
          "Grupos personalizados"
        ],
        ia: true,
        iaDescricao: "Geracao Automatica de Escala - IA distribui grupos equilibradamente ao longo do mes."
      },
      {
        titulo: "Servico de Campo",
        descricao: "Gestao de grupos de servico de campo.",
        link: "/admin/servico-campo",
        funcionalidades: [
          "Dirigentes por dia da semana",
          "Periodo (manha/tarde)",
          "Horario do ponto de encontro",
          "Ativar/desativar dias"
        ]
      },
      {
        titulo: "Grupo de Estudos",
        descricao: "Gestao de grupos de estudo biblico.",
        link: "/admin/grupo-estudos",
        funcionalidades: [
          "Cadastro de grupos com nome",
          "Designacao de dirigente e auxiliar",
          "Membros do grupo",
          "Ordenacao e edicao"
        ]
      }
    ]
  },
  {
    categoria: "Visualizacao",
    icon: BookMarked,
    cor: "bg-indigo-600",
    itens: [
      {
        titulo: "Vida e Ministerio",
        descricao: "Visualizacao formatada da programacao semanal.",
        link: "/admin/visualizacao/vida-ministerio",
        funcionalidades: [
          "Layout otimizado para leitura",
          "Todas as partes organizadas",
          "Canticos e designacoes"
        ]
      },
      {
        titulo: "Estudo Sentinela",
        descricao: "Visualizacao do estudo com respostas IA.",
        link: "/admin/visualizacao/sentinela",
        funcionalidades: [
          "Paragrafos com respostas geradas",
          "Perguntas e texto base",
          "Dirigente e leitor"
        ]
      },
      {
        titulo: "Reunioes Publicas",
        descricao: "Visualizacao dos discursos agendados.",
        link: "/admin/visualizacao/reunioes-publicas",
        funcionalidades: [
          "Calendario visual",
          "Temas e oradores"
        ]
      },
      {
        titulo: "Equipe Tecnica",
        descricao: "Visualizacao da escala tecnica.",
        link: "/admin/visualizacao/equipe-tecnica",
        funcionalidades: [
          "Escala completa do mes",
          "Todos os designados"
        ]
      },
      {
        titulo: "Limpeza do Salao",
        descricao: "Visualizacao da escala de limpeza.",
        link: "/admin/visualizacao/limpeza-salao",
        funcionalidades: [
          "Calendario com grupos",
          "Rotacao visual"
        ]
      },
      {
        titulo: "Servico de Campo",
        descricao: "Visualizacao dos dirigentes de campo.",
        link: "/admin/visualizacao/servico-campo",
        funcionalidades: [
          "Dirigentes por dia",
          "Horarios e periodos"
        ]
      }
    ]
  },
  {
    categoria: "Impressao",
    icon: FileText,
    cor: "bg-amber-600",
    itens: [
      {
        titulo: "Vida e Ministerio",
        descricao: "Impressao da programacao semanal.",
        link: "/admin/impressao/vida-ministerio",
        funcionalidades: [
          "Formato otimizado para impressao",
          "Layout A4",
          "Selecao de semana"
        ]
      },
      {
        titulo: "Programacao Congregacao",
        descricao: "Impressao da programacao geral mensal.",
        link: "/admin/programacao-congregacao",
        funcionalidades: [
          "Todas as escalas do mes",
          "Reunioes e designacoes",
          "Layout compacto"
        ]
      },
      {
        titulo: "Grupo de Estudos",
        descricao: "Impressao dos grupos de estudo.",
        link: "/admin/impressao/grupo-estudos",
        funcionalidades: [
          "Lista de grupos e membros",
          "Dirigentes e auxiliares"
        ]
      },
      {
        titulo: "Servico de Campo",
        descricao: "Impressao dos grupos de campo.",
        link: "/admin/impressao/servico-campo",
        funcionalidades: [
          "Pontos de encontro",
          "Dirigentes e horarios"
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
    categoria: "Organizacao",
    icon: Gem,
    cor: "bg-purple-600",
    itens: [
      {
        titulo: "Canticos",
        descricao: "Biblioteca completa de canticos.",
        link: "/admin/canticos",
        funcionalidades: [
          "Lista de todos os canticos",
          "Busca por numero ou titulo",
          "Link para audio/video"
        ]
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
          "Dados da congregacao (nome, circuito)",
          "Horarios das reunioes",
          "Configuracao do Zoom (link e senha)",
          "Pontos de encontro do campo"
        ],
        ia: true,
        iaDescricao: "Central de Notificacoes IA - Gera resumos semanais e lembretes personalizados."
      },
      {
        titulo: "Seguranca e Senhas",
        descricao: "Gerenciamento de senhas de acesso dos perfis.",
        link: "/admin/configuracoes",
        funcionalidades: [
          "Alteracao da senha do Administrador",
          "Alteracao da senha do Anciao",
          "Validacao de senha atual (opcional)",
          "Senhas com 6 digitos numericos",
          "Confirmacao de nova senha"
        ]
      },
      {
        titulo: "Wiki / Documentacao",
        descricao: "Documentacao completa do sistema.",
        link: "/admin/wiki",
        funcionalidades: [
          "Guia de todas as funcionalidades",
          "Busca integrada",
          "Documentacao da API (Swagger)"
        ]
      }
    ]
  }
]

// Dados da Wiki - Funcionalidades do Anciao
const funcionalidadesAnciao = [
  {
    categoria: "Dashboard",
    icon: LayoutDashboard,
    cor: "bg-amber-600",
    itens: [
      {
        titulo: "Painel Principal",
        descricao: "Visao geral da congregacao para ancioes.",
        link: "/anciao",
        funcionalidades: [
          "Estatisticas de publicadores por privilegio",
          "Alertas de designacoes pendentes",
          "Proximos eventos e reunioes",
          "Acesso rapido as funcionalidades"
        ]
      },
      {
        titulo: "Quadro de Anuncios",
        descricao: "Gerenciamento de anuncios da congregacao.",
        link: "/anciao/anuncios",
        funcionalidades: [
          "Visualizacao de anuncios ativos",
          "Criacao de novos anuncios",
          "Edicao e exclusao de anuncios",
          "Data de expiracao"
        ]
      }
    ]
  },
  {
    categoria: "Publicadores",
    icon: Users,
    cor: "bg-violet-600",
    itens: [
      {
        titulo: "Gestao de Publicadores",
        descricao: "Cadastro e gestao de publicadores.",
        link: "/anciao/publicadores",
        funcionalidades: [
          "Lista completa de publicadores",
          "Cadastro com nome, telefone, batismo",
          "Filtros e busca avancada",
          "Atribuicao de privilegios"
        ]
      },
      {
        titulo: "Anciaos",
        descricao: "Lista de anciaos da congregacao.",
        link: "/anciao/publicadores/anciaos",
        funcionalidades: ["Visualizacao de anciaos", "Contatos", "Contador automatico"]
      },
      {
        titulo: "Servos Ministeriais",
        descricao: "Lista de servos ministeriais.",
        link: "/anciao/publicadores/servos-ministeriais",
        funcionalidades: ["Visualizacao de servos ministeriais", "Contador automatico"]
      },
      {
        titulo: "Pioneiros Regulares",
        descricao: "Lista de pioneiros regulares.",
        link: "/anciao/publicadores/pioneiros-regulares",
        funcionalidades: ["Visualizacao de pioneiros regulares", "Contador automatico"]
      }
    ]
  },
  {
    categoria: "Cadastros",
    icon: Calendar,
    cor: "bg-blue-600",
    itens: [
      {
        titulo: "Vida e Ministerio",
        descricao: "Programacao da reuniao de meio de semana.",
        link: "/anciao/vida-ministerio",
        funcionalidades: [
          "Visualizacao da programacao semanal",
          "Designacao de participantes",
          "Canticos e oracoes",
          "Navegacao entre semanas"
        ]
      },
      {
        titulo: "Reunioes Publicas",
        descricao: "Programacao dos discursos publicos.",
        link: "/anciao/reunioes-publicas",
        funcionalidades: [
          "Cadastro de discursos com tema",
          "Designacao de oradores",
          "Designacao de presidente",
          "Calendario mensal"
        ]
      },
      {
        titulo: "Equipe Tecnica",
        descricao: "Escala de som, microfone e indicadores.",
        link: "/anciao/equipe-tecnica",
        funcionalidades: [
          "Designacao por dia da semana",
          "Indicadores 1 e 2",
          "Microfonistas volantes",
          "Operador de som"
        ]
      },
      {
        titulo: "Grupo de Estudos",
        descricao: "Gestao de grupos de estudo biblico.",
        link: "/anciao/grupo-estudos",
        funcionalidades: [
          "Cadastro de grupos",
          "Designacao de dirigentes e auxiliares",
          "Membros do grupo"
        ]
      },
      {
        titulo: "Limpeza do Salao",
        descricao: "Escala de grupos de limpeza.",
        link: "/anciao/limpeza-salao",
        funcionalidades: [
          "Designacao por semana",
          "Rotacao de grupos",
          "Calendario mensal"
        ]
      },
      {
        titulo: "Servico de Campo",
        descricao: "Dirigentes de servico de campo.",
        link: "/anciao/servico-campo",
        funcionalidades: [
          "Dirigentes por dia da semana",
          "Periodo (manha/tarde)",
          "Horario do ponto de encontro"
        ]
      }
    ]
  },
  {
    categoria: "Organizacao",
    icon: Gem,
    cor: "bg-purple-600",
    itens: [
      {
        titulo: "Canticos",
        descricao: "Biblioteca de canticos.",
        link: "/anciao/canticos",
        funcionalidades: [
          "Lista de canticos",
          "Busca por numero ou titulo"
        ]
      }
    ]
  },
  {
    categoria: "Impressao",
    icon: FileText,
    cor: "bg-amber-600",
    itens: [
      {
        titulo: "Vida e Ministerio",
        descricao: "Impressao da programacao semanal.",
        link: "/anciao/impressao/vida-ministerio",
        funcionalidades: [
          "Formato para impressao",
          "Layout otimizado A4"
        ]
      },
      {
        titulo: "Programacao Congregacao",
        descricao: "Impressao da programacao geral mensal.",
        link: "/anciao/programacao-congregacao",
        funcionalidades: [
          "Todas as escalas do mes",
          "Layout compacto"
        ]
      },
      {
        titulo: "Grupo de Estudos",
        descricao: "Impressao dos grupos de estudo.",
        link: "/anciao/impressao/grupo-estudos",
        funcionalidades: [
          "Lista de grupos e membros",
          "Dirigentes e auxiliares"
        ]
      },
      {
        titulo: "Servico de Campo",
        descricao: "Impressao dos dirigentes de campo.",
        link: "/anciao/impressao/servico-campo",
        funcionalidades: [
          "Dirigentes por dia",
          "Horarios e periodos"
        ]
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
        descricao: "Configuracoes da congregacao.",
        link: "/anciao/configuracoes",
        funcionalidades: [
          "Dados da congregacao",
          "Horarios das reunioes",
          "Configuracao do Zoom"
        ]
      },
      {
        titulo: "Seguranca e Senhas",
        descricao: "Gerenciamento de senhas de acesso.",
        link: "/anciao/configuracoes",
        funcionalidades: [
          "Alteracao da senha do Administrador",
          "Alteracao da senha do Anciao",
          "Senhas com 6 digitos numericos"
        ]
      },
      {
        titulo: "Wiki / Ajuda",
        descricao: "Documentacao do sistema.",
        link: "/admin/wiki",
        funcionalidades: [
          "Guia de funcionalidades",
          "Busca integrada"
        ]
      }
    ]
  }
]

// Dados da Wiki - Funcionalidades de Consulta
const funcionalidadesConsulta = [
  {
    categoria: "Dashboard",
    icon: LayoutDashboard,
    cor: "bg-blue-600",
    itens: [
      {
        titulo: "Quadro de Anuncios",
        descricao: "Painel principal de consulta da congregacao.",
        link: "/consulta",
        funcionalidades: [
          "Proximo discurso publico",
          "Limpeza da semana",
          "Dirigente de campo do dia",
          "Calendario interativo com eventos",
          "Grupos de estudo da congregacao",
          "Links rapidos para todas as consultas"
        ]
      }
    ]
  },
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
        iaDescricao: "Todas as funcionalidades usam IA baseada exclusivamente em conteudo do jw.org."
      }
    ]
  },
  {
    categoria: "Reunioes",
    icon: Calendar,
    cor: "bg-blue-600",
    itens: [
      {
        titulo: "Vida e Ministerio",
        descricao: "Consulta da programacao semanal.",
        link: "/consulta/reunioes/vida-ministerio",
        funcionalidades: [
          "Visualizacao das partes",
          "Designacoes da semana",
          "Canticos e oracoes",
          "Navegacao entre semanas"
        ]
      },
      {
        titulo: "Sentinela",
        descricao: "Consulta do estudo da Sentinela de domingo.",
        link: "/consulta/reunioes/sentinela",
        funcionalidades: [
          "Titulo e texto tema do estudo",
          "Paragrafos com perguntas e respostas IA",
          "Cantico do Meio e Cantico Final",
          "Dirigente e Leitor designados"
        ]
      },
      {
        titulo: "Reunioes Publicas",
        descricao: "Consulta dos discursos publicos.",
        link: "/consulta/reunioes-publicas",
        funcionalidades: [
          "Tema do discurso",
          "Orador designado",
          "Presidente",
          "Calendario mensal"
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
        funcionalidades: ["Lista com filtros", "Informacoes de contato", "Busca por nome"]
      },
      {
        titulo: "Anciaos",
        descricao: "Lista de anciaos.",
        link: "/consulta/anciaos",
        funcionalidades: ["Contato dos anciaos", "Telefone"]
      },
      {
        titulo: "Servos Ministeriais",
        descricao: "Lista de servos ministeriais.",
        link: "/consulta/servos-ministeriais",
        funcionalidades: ["Contato dos servos", "Telefone"]
      },
      {
        titulo: "Pioneiros",
        descricao: "Lista de pioneiros regulares.",
        link: "/consulta/pioneiros",
        funcionalidades: ["Contato dos pioneiros", "Telefone"]
      }
    ]
  },
  {
    categoria: "Escalas",
    icon: Wrench,
    cor: "bg-amber-600",
    itens: [
      {
        titulo: "Equipe Tecnica",
        descricao: "Consulta da escala de som e indicadores.",
        link: "/consulta/equipe-tecnica",
        funcionalidades: ["Escala do mes", "Designacoes por dia", "Indicadores, microfonistas e som"]
      },
      {
        titulo: "Limpeza do Salao",
        descricao: "Consulta da escala de limpeza.",
        link: "/consulta/limpeza-salao",
        funcionalidades: ["Grupos designados por semana", "Calendario mensal"]
      },
      {
        titulo: "Servico de Campo",
        descricao: "Consulta dos dirigentes de campo.",
        link: "/consulta/servico-campo",
        funcionalidades: ["Dirigentes por dia", "Horarios e pontos de encontro"]
      },
      {
        titulo: "Grupos de Estudo",
        descricao: "Consulta dos grupos de estudo.",
        link: "/consulta/grupos",
        funcionalidades: ["Grupos e membros", "Dirigentes e auxiliares"]
      }
    ]
  },
  {
    categoria: "Impressao",
    icon: FileText,
    cor: "bg-amber-600",
    itens: [
      {
        titulo: "Central de Impressao",
        descricao: "Gerar PDFs de todas as escalas.",
        link: "/impressao",
        funcionalidades: [
          "Vida e Ministerio",
          "Reunioes Publicas",
          "Equipe Tecnica",
          "Limpeza do Salao",
          "Servico de Campo",
          "Grupos de Estudo"
        ]
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
  const dadosFiltradosAnciao = filtrarItens(funcionalidadesAnciao)
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
                 funcionalidadesAnciao.reduce((acc, cat) => acc + cat.itens.length, 0) +
                 funcionalidadesConsulta.reduce((acc, cat) => acc + cat.itens.length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total de Paginas</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">
                {funcionalidadesAdmin.reduce((acc, cat) => acc + cat.itens.filter(i => i.ia).length, 0) +
                 funcionalidadesAnciao.reduce((acc, cat) => acc + cat.itens.filter(i => i.ia).length, 0) +
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="admin" className="gap-2">
              <Shield className="h-4 w-4" />
              Administrador
            </TabsTrigger>
            <TabsTrigger value="anciao" className="gap-2">
              <UserCheck className="h-4 w-4" />
              Anciao
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

          <TabsContent value="anciao" className="mt-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-8">
                {dadosFiltradosAnciao.map((categoria) => (
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
                                    <Badge variant="secondary" className="bg-amber-600/20 text-amber-400 text-xs">
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
                              <div className="mt-3 p-2 rounded bg-amber-600/10 border border-amber-600/20">
                                <p className="text-xs text-amber-300 flex items-start gap-1">
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
