"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Calendar, 
  Users, 
  BookOpen, 
  ChevronRight,
  BookMarked,
  Gem,
  Wrench,
  Sparkles,
  Shield,
  UserCheck,
  Flag,
  MapPin,
  Mic,
  Volume2,
  Loader2,
  Clock
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { format, startOfWeek, endOfWeek } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useSync } from "@/lib/contexts/sync-context"

interface EquipeTecnica {
  indicador1_nome: string | null
  indicador2_nome: string | null
  microvolante1_nome: string | null
  microvolante2_nome: string | null
  som_nome: string | null
  data: string
  dia_semana: string
}

interface LimpezaSemana {
  grupo_nome: string | null
  data_inicio: string
  data_fim: string
}

interface DiscursoPublico {
  data: string
  tema: string
  orador_nome: string | null
}

interface CampoSemana {
  dia_semana: string
  dirigente_nome: string
  periodo: string
  horario: string
}

const quickLinks = [
  {
    title: "Vida e Ministério",
    description: "Programação semanal das partes",
    href: "/consulta/reunioes/vida-ministerio",
    icon: Gem,
    color: "from-blue-600/20 to-blue-800/5",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-600",
  },
  {
    title: "Estudo Sentinela",
    description: "Dirigentes e leitores",
    href: "/consulta/reunioes/sentinela",
    icon: BookMarked,
    color: "from-purple-600/20 to-purple-800/5",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-600",
  },
  {
    title: "Equipe Técnica",
    description: "Indicadores, microfone e som",
    href: "/consulta/equipe-tecnica",
    icon: Wrench,
    color: "from-orange-600/20 to-orange-800/5",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-600",
  },
  {
    title: "Limpeza do Salão",
    description: "Escala semanal de limpeza",
    href: "/consulta/limpeza-salao",
    icon: Sparkles,
    color: "from-cyan-600/20 to-cyan-800/5",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-600",
  },
  {
    title: "Serviço de Campo",
    description: "Dirigentes de campo",
    href: "/consulta/servico-campo",
    icon: MapPin,
    color: "from-green-600/20 to-green-800/5",
    iconColor: "text-green-400",
    iconBg: "bg-green-600",
  },
  {
    title: "Reuniões Públicas",
    description: "Discursos e assistência",
    href: "/consulta/reunioes-publicas",
    icon: Mic,
    color: "from-amber-600/20 to-amber-800/5",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-600",
  },
  {
    title: "Grupos de Estudo",
    description: "Membros de cada grupo",
    href: "/consulta/grupos",
    icon: Users,
    color: "from-emerald-600/20 to-emerald-800/5",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-600",
  },
  {
    title: "Publicadores",
    description: "Lista completa",
    href: "/consulta/publicadores",
    icon: BookOpen,
    color: "from-pink-600/20 to-pink-800/5",
    iconColor: "text-pink-400",
    iconBg: "bg-pink-600",
  },
]

export default function ConsultaPage() {
  const [loading, setLoading] = useState(true)
  const [equipeSemana, setEquipeSemana] = useState<EquipeTecnica[]>([])
  const [limpezaSemana, setLimpezaSemana] = useState<LimpezaSemana | null>(null)
  const [proximoDiscurso, setProximoDiscurso] = useState<DiscursoPublico | null>(null)
  const [campoHoje, setCampoHoje] = useState<CampoSemana | null>(null)
  
  const { syncTrigger } = useSync()
  
  const hoje = new Date()
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 })
  const fimSemana = endOfWeek(hoje, { weekStartsOn: 1 })
  const diaSemana = format(hoje, "EEEE", { locale: ptBR }).toLowerCase()

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true)
        const supabase = createClient()
        const mesAtual = format(hoje, "yyyy-MM")
        
        // Buscar equipe técnica da semana
        const { data: equipeData } = await supabase
          .from("equipe_tecnica")
          .select("*")
          .gte("data", format(inicioSemana, "yyyy-MM-dd"))
          .lte("data", format(fimSemana, "yyyy-MM-dd"))
          .order("data")
        if (equipeData) setEquipeSemana(equipeData)
        
        // Buscar limpeza da semana
        const { data: limpezaData } = await supabase
          .from("limpeza_salao")
          .select("*")
          .lte("data_inicio", format(hoje, "yyyy-MM-dd"))
          .gte("data_fim", format(hoje, "yyyy-MM-dd"))
          .limit(1)
        if (limpezaData && limpezaData.length > 0) {
          setLimpezaSemana(limpezaData[0])
        }
        
        // Buscar próximo discurso público
        const { data: discursoData } = await supabase
          .from("discursos_publicos")
          .select("*")
          .gte("data", format(hoje, "yyyy-MM-dd"))
          .order("data", { ascending: true })
          .limit(1)
        if (discursoData && discursoData.length > 0) {
          setProximoDiscurso(discursoData[0])
        }
        
        // Buscar dirigente de campo de hoje
        const diasMap: Record<string, string> = {
          "segunda-feira": "segunda",
          "terça-feira": "terca",
          "quarta-feira": "quarta",
          "quinta-feira": "quinta",
          "sexta-feira": "sexta",
          "sábado": "sabado",
          "domingo": "domingo"
        }
        const diaDb = diasMap[diaSemana] || diaSemana
        
        const { data: campoData } = await supabase
          .from("servico_campo_semana")
          .select("*")
          .eq("dia_semana", diaDb)
          .eq("ativo", true)
          .limit(1)
        if (campoData && campoData.length > 0) {
          setCampoHoje(campoData[0])
        }
        
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [syncTrigger])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold text-white mb-2">
          Quadro de Anúncios
        </h1>
        <p className="text-zinc-400">
          {format(hoje, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* Cards de Destaque - Informações da Semana */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Próxima Reunião */}
          {equipeSemana.length > 0 && (
            <Card className="border-zinc-800 bg-gradient-to-br from-blue-600/10 to-blue-900/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Próxima Reunião
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-white capitalize">
                    {equipeSemana[0]?.dia_semana === "quinta" ? "Quinta-feira" : "Domingo"}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {format(new Date(equipeSemana[0]?.data), "d 'de' MMMM", { locale: ptBR })}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-green-600/20 px-2 py-1 text-green-400">
                      <Wrench className="inline h-3 w-3 mr-1" />
                      {equipeSemana[0]?.indicador1_nome || "A definir"}
                    </span>
                    <span className="rounded-full bg-blue-600/20 px-2 py-1 text-blue-400">
                      <Volume2 className="inline h-3 w-3 mr-1" />
                      {equipeSemana[0]?.som_nome || "A definir"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Limpeza da Semana */}
          {limpezaSemana && (
            <Card className="border-zinc-800 bg-gradient-to-br from-cyan-600/10 to-cyan-900/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                  <Sparkles className="h-4 w-4 text-cyan-500" />
                  Limpeza da Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-white">{limpezaSemana.grupo_nome}</p>
                <p className="text-sm text-zinc-400 mt-1">
                  {format(new Date(limpezaSemana.data_inicio), "dd/MM", { locale: ptBR })} a {format(new Date(limpezaSemana.data_fim), "dd/MM", { locale: ptBR })}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Serviço de Campo Hoje */}
          {campoHoje && (
            <Card className="border-zinc-800 bg-gradient-to-br from-green-600/10 to-green-900/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                  <MapPin className="h-4 w-4 text-green-500" />
                  Campo Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-white">{campoHoje.dirigente_nome}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="rounded bg-green-600/20 px-2 py-0.5 text-xs text-green-400">
                    {campoHoje.periodo === "manha" ? "Manhã" : "Tarde"}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-zinc-400">
                    <Clock className="h-3 w-3" />
                    {campoHoje.horario}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Próximo Discurso */}
          {proximoDiscurso && (
            <Card className="border-zinc-800 bg-gradient-to-br from-amber-600/10 to-amber-900/5 sm:col-span-2 lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                  <Mic className="h-4 w-4 text-amber-500" />
                  Próximo Discurso Público
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-lg font-semibold text-white">{proximoDiscurso.tema}</p>
                    {proximoDiscurso.orador_nome && (
                      <p className="text-sm text-zinc-400">Orador: {proximoDiscurso.orador_nome}</p>
                    )}
                  </div>
                  <span className="rounded-lg bg-amber-600/20 px-3 py-1.5 text-sm font-medium text-amber-400">
                    {format(new Date(proximoDiscurso.data), "EEEE, d/MM", { locale: ptBR })}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Acesso Rápido</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className={cn(
                "group h-full border-zinc-800 bg-gradient-to-br transition-all duration-200",
                link.color,
                "hover:border-zinc-700 hover:scale-[1.02]"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("rounded-lg p-2", link.iconBg)}>
                      <link.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate group-hover:text-blue-300 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-xs text-zinc-500 truncate">
                        {link.description}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-600 flex-shrink-0 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-zinc-900/30 border-zinc-800">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-600/10 p-2.5">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">
                Modo Consulta
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Visualize as informações da congregação. As atualizações são feitas automaticamente ou clicando no botão "Atualizar" no canto superior direito.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
