"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Users, 
  BookOpen, 
  ChevronRight,
  ChevronLeft,
  BookMarked,
  Gem,
  Wrench,
  Sparkles,
  MapPin,
  Mic,
  Volume2,
  Clock,
  Megaphone,
  Info,
  CalendarDays,
  Brain
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useSync } from "@/lib/contexts/sync-context"
import { Button } from "@/components/ui/button"

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

interface EventoCalendario {
  data: string
  tipo: "reuniao" | "discurso" | "campo" | "limpeza"
  titulo: string
}

const quickLinks = [
  {
    title: "Assistente IA",
    description: "Ajuda com comentarios e partes",
    href: "/consulta/assistente-ia",
    icon: Brain,
    color: "from-violet-600/20 to-purple-800/5",
    iconBg: "bg-gradient-to-r from-violet-600 to-purple-600",
  },
  {
    title: "Vida e Ministerio",
    description: "Programacao semanal",
    href: "/consulta/reunioes/vida-ministerio",
    icon: Gem,
    color: "from-blue-600/20 to-blue-800/5",
    iconBg: "bg-blue-600",
  },
  {
    title: "Estudo Sentinela",
    description: "Dirigentes e leitores",
    href: "/consulta/reunioes/sentinela",
    icon: BookMarked,
    color: "from-purple-600/20 to-purple-800/5",
    iconBg: "bg-purple-600",
  },
  {
    title: "Equipe Tecnica",
    description: "Indicadores e som",
    href: "/consulta/equipe-tecnica",
    icon: Wrench,
    color: "from-orange-600/20 to-orange-800/5",
    iconBg: "bg-orange-600",
  },
  {
    title: "Limpeza do Salao",
    description: "Escala semanal",
    href: "/consulta/limpeza-salao",
    icon: Sparkles,
    color: "from-cyan-600/20 to-cyan-800/5",
    iconBg: "bg-cyan-600",
  },
  {
    title: "Servico de Campo",
    description: "Dirigentes de campo",
    href: "/consulta/servico-campo",
    icon: MapPin,
    color: "from-green-600/20 to-green-800/5",
    iconBg: "bg-green-600",
  },
  {
    title: "Reunioes Publicas",
    description: "Discursos e assistencia",
    href: "/consulta/reunioes-publicas",
    icon: Mic,
    color: "from-amber-600/20 to-amber-800/5",
    iconBg: "bg-amber-600",
  },
  {
    title: "Grupos de Estudo",
    description: "Membros de cada grupo",
    href: "/consulta/grupos",
    icon: Users,
    color: "from-emerald-600/20 to-emerald-800/5",
    iconBg: "bg-emerald-600",
  },
  {
    title: "Publicadores",
    description: "Lista completa",
    href: "/consulta/publicadores",
    icon: BookOpen,
    color: "from-pink-600/20 to-pink-800/5",
    iconBg: "bg-pink-600",
  },
]

// Skeleton components
function SkeletonCard({ className }: { className?: string }) {
  return (
    <Card className={cn("border-zinc-800 bg-zinc-900/50", className)}>
      <CardContent className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-zinc-700 rounded" />
            <div className="h-4 w-24 bg-zinc-700 rounded" />
          </div>
          <div className="h-6 w-32 bg-zinc-700 rounded" />
          <div className="h-4 w-20 bg-zinc-700 rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

function SkeletonQuickLink() {
  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardContent className="p-4">
        <div className="animate-pulse flex items-center gap-3">
          <div className="h-9 w-9 bg-zinc-700 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-zinc-700 rounded" />
            <div className="h-3 w-16 bg-zinc-700 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ConsultaPage() {
  const [loading, setLoading] = useState(true)
  const [equipeSemana, setEquipeSemana] = useState<EquipeTecnica[]>([])
  const [limpezaSemana, setLimpezaSemana] = useState<LimpezaSemana | null>(null)
  const [proximoDiscurso, setProximoDiscurso] = useState<DiscursoPublico | null>(null)
  const [campoHoje, setCampoHoje] = useState<CampoSemana | null>(null)
  const [eventos, setEventos] = useState<EventoCalendario[]>([])
  const [mesSelecionado, setMesSelecionado] = useState(new Date())
  
  const { syncTrigger } = useSync()
  
  const hoje = new Date()
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 })
  const fimSemana = endOfWeek(hoje, { weekStartsOn: 1 })
  const diaSemana = format(hoje, "EEEE", { locale: ptBR }).toLowerCase()

  // Calendario
  const inicioMes = startOfMonth(mesSelecionado)
  const fimMes = endOfMonth(mesSelecionado)
  const diasDoMes = eachDayOfInterval({ start: inicioMes, end: fimMes })
  const inicioCalendario = startOfWeek(inicioMes, { weekStartsOn: 0 })
  const fimCalendario = endOfWeek(fimMes, { weekStartsOn: 0 })
  const diasCalendario = eachDayOfInterval({ start: inicioCalendario, end: fimCalendario })

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true)
        const supabase = createClient()
        const eventosTemp: EventoCalendario[] = []
        
        // Buscar equipe tecnica da semana
        const { data: equipeData } = await supabase
          .from("equipe_tecnica")
          .select("*")
          .gte("data", format(inicioSemana, "yyyy-MM-dd"))
          .lte("data", format(fimSemana, "yyyy-MM-dd"))
          .order("data")
        if (equipeData) {
          setEquipeSemana(equipeData)
          equipeData.forEach(e => {
            eventosTemp.push({
              data: e.data,
              tipo: "reuniao",
              titulo: e.dia_semana === "quinta" ? "Reuniao Meio Semana" : "Reuniao Fim Semana"
            })
          })
        }
        
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
        
        // Buscar proximo discurso publico
        const { data: discursoData } = await supabase
          .from("discursos_publicos")
          .select("*")
          .gte("data", format(hoje, "yyyy-MM-dd"))
          .order("data", { ascending: true })
          .limit(3)
        if (discursoData && discursoData.length > 0) {
          setProximoDiscurso(discursoData[0])
          discursoData.forEach(d => {
            eventosTemp.push({
              data: d.data,
              tipo: "discurso",
              titulo: d.tema || "Discurso Publico"
            })
          })
        }
        
        // Buscar dirigente de campo de hoje
        const diasMap: Record<string, string> = {
          "segunda-feira": "segunda",
          "terca-feira": "terca",
          "quarta-feira": "quarta",
          "quinta-feira": "quinta",
          "sexta-feira": "sexta",
          "sabado": "sabado",
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
        
        setEventos(eventosTemp)
        
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [syncTrigger])

  const temEvento = (data: Date) => {
    const dataStr = format(data, "yyyy-MM-dd")
    return eventos.find(e => e.data === dataStr)
  }

  // Skeleton Loading
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="text-center sm:text-left">
          <div className="h-9 w-48 bg-zinc-700 rounded animate-pulse mb-2" />
          <div className="h-5 w-64 bg-zinc-700 rounded animate-pulse" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard className="sm:col-span-2 lg:col-span-3" />
        </div>

        {/* Quick Links Skeleton */}
        <div>
          <div className="h-6 w-32 bg-zinc-700 rounded animate-pulse mb-4" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <SkeletonQuickLink key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold text-white mb-2">
          Quadro de Anuncios
        </h1>
        <p className="text-zinc-400">
          {format(hoje, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* Cards de Destaque */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Proxima Reuniao */}
        {equipeSemana.length > 0 && (
          <Card className="border-zinc-800 bg-gradient-to-br from-blue-600/10 to-blue-900/5 hover:border-blue-600/30 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                <Calendar className="h-4 w-4 text-blue-500" />
                Proxima Reuniao
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-white capitalize">
                    {equipeSemana[0]?.dia_semana === "quinta" ? "Quinta-feira" : "Domingo"}
                  </p>
                  {isToday(new Date(equipeSemana[0]?.data)) && (
                    <Badge className="bg-green-600/20 text-green-400 text-[10px]">Hoje</Badge>
                  )}
                </div>
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
          <Card className="border-zinc-800 bg-gradient-to-br from-cyan-600/10 to-cyan-900/5 hover:border-cyan-600/30 transition-colors">
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

        {/* Servico de Campo Hoje */}
        {campoHoje && (
          <Card className="border-zinc-800 bg-gradient-to-br from-green-600/10 to-green-900/5 hover:border-green-600/30 transition-colors">
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
                  {campoHoje.periodo === "manha" ? "Manha" : "Tarde"}
                </span>
                <span className="flex items-center gap-1 text-sm text-zinc-400">
                  <Clock className="h-3 w-3" />
                  {campoHoje.horario}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Proximo Discurso */}
        {proximoDiscurso && (
          <Card className="border-zinc-800 bg-gradient-to-br from-amber-600/10 to-amber-900/5 sm:col-span-2 lg:col-span-3 hover:border-amber-600/30 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                <Mic className="h-4 w-4 text-amber-500" />
                Proximo Discurso Publico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold text-white">{proximoDiscurso.tema || "Tema a definir"}</p>
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

      {/* Grid: Calendario + Anuncios */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendario Compacto */}
        <Card className="border-zinc-800 bg-zinc-900/50 lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <CalendarDays className="h-4 w-4 text-blue-500" />
                Calendario
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setMesSelecionado(subMonths(mesSelecionado, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setMesSelecionado(addMonths(mesSelecionado, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-zinc-400 capitalize">
              {format(mesSelecionado, "MMMM yyyy", { locale: ptBR })}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["D", "S", "T", "Q", "Q", "S", "S"].map((dia, i) => (
                <div key={i} className="py-1 text-zinc-500 font-medium">{dia}</div>
              ))}
              {diasCalendario.map((dia, i) => {
                const evento = temEvento(dia)
                return (
                  <div
                    key={i}
                    className={cn(
                      "py-1.5 rounded-md text-sm relative transition-colors",
                      !isSameMonth(dia, mesSelecionado) && "text-zinc-700",
                      isSameMonth(dia, mesSelecionado) && "text-zinc-300",
                      isToday(dia) && "bg-blue-600 text-white font-bold",
                      evento && !isToday(dia) && "bg-zinc-800",
                      evento?.tipo === "reuniao" && !isToday(dia) && "ring-1 ring-purple-500/50",
                      evento?.tipo === "discurso" && !isToday(dia) && "ring-1 ring-amber-500/50"
                    )}
                    title={evento?.titulo}
                  >
                    {format(dia, "d")}
                    {evento && (
                      <span className={cn(
                        "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                        evento.tipo === "reuniao" && "bg-purple-500",
                        evento.tipo === "discurso" && "bg-amber-500",
                        evento.tipo === "campo" && "bg-green-500"
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Legenda */}
            <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-wrap gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Reuniao
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Discurso
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-blue-600" /> Hoje
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Anuncios da Semana */}
        <Card className="border-zinc-800 bg-zinc-900/50 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Megaphone className="h-4 w-4 text-amber-500" />
              Anuncios da Semana
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {limpezaSemana && (
              <div className="flex items-start gap-3 rounded-lg bg-cyan-600/10 p-3">
                <Sparkles className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Limpeza do Salao</p>
                  <p className="text-xs text-zinc-400">
                    Grupo responsavel: <span className="text-cyan-400">{limpezaSemana.grupo_nome}</span>
                  </p>
                </div>
              </div>
            )}
            
            {proximoDiscurso && (
              <div className="flex items-start gap-3 rounded-lg bg-amber-600/10 p-3">
                <Mic className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Discurso Publico</p>
                  <p className="text-xs text-zinc-400">
                    {format(new Date(proximoDiscurso.data), "EEEE", { locale: ptBR })}: <span className="text-amber-400">{proximoDiscurso.tema || "Tema a definir"}</span>
                    {proximoDiscurso.orador_nome && ` - ${proximoDiscurso.orador_nome}`}
                  </p>
                </div>
              </div>
            )}
            
            {campoHoje && (
              <div className="flex items-start gap-3 rounded-lg bg-green-600/10 p-3">
                <MapPin className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Servico de Campo Hoje</p>
                  <p className="text-xs text-zinc-400">
                    Dirigente: <span className="text-green-400">{campoHoje.dirigente_nome}</span> - {campoHoje.horario}
                  </p>
                </div>
              </div>
            )}

            {equipeSemana.length > 0 && (
              <div className="flex items-start gap-3 rounded-lg bg-purple-600/10 p-3">
                <Calendar className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Reunioes da Semana</p>
                  <div className="text-xs text-zinc-400 space-y-1">
                    {equipeSemana.map((reuniao, i) => (
                      <p key={i}>
                        <span className="capitalize text-purple-400">{reuniao.dia_semana}</span> - {format(new Date(reuniao.data), "dd/MM", { locale: ptBR })}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!limpezaSemana && !proximoDiscurso && !campoHoje && equipeSemana.length === 0 && (
              <div className="text-center py-6">
                <Info className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm text-zinc-500">Nenhum anuncio para esta semana</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Acesso Rapido</h2>
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
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">
                Modo Consulta
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Visualize as informacoes da congregacao. As atualizacoes sao feitas automaticamente ou clicando no botao "Atualizar" no canto superior direito.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
