"use client"

import { useEffect, useState, useRef } from "react"
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
  Megaphone,
  Info,
  CalendarDays,
  Brain,
  Mail
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, getDay } from "date-fns"
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

interface CampoSemanaItem {
  dia_semana: string
  dirigente_nome: string
  periodo: string
  horario: string
}

// Mapeia o número do dia da semana (0=Dom, 1=Seg...) para o valor do banco
const diaSemanaMap: Record<number, string> = {
  0: "domingo",
  1: "segunda",
  2: "terca",
  3: "quarta",
  4: "quinta",
  5: "sexta",
  6: "sabado",
}

// Menu de navegação rápida - organizado por categoria
const menuSections = [
  {
    title: "Reuniões",
    items: [
      { title: "Vida e Ministério", description: "Programação semanal", href: "/consulta/reunioes/vida-ministerio", icon: Gem, color: "bg-blue-600" },
      { title: "Estudo Sentinela", description: "Dirigentes e leitores", href: "/consulta/reunioes/sentinela", icon: BookMarked, color: "bg-purple-600" },
      { title: "Reuniões Públicas", description: "Discursos e assistência", href: "/consulta/reunioes-publicas", icon: Mic, color: "bg-amber-600" },
    ]
  },
  {
    title: "Escalas",
    items: [
      { title: "Equipe Técnica", description: "Indicadores e som", href: "/consulta/equipe-tecnica", icon: Wrench, color: "bg-orange-600" },
      { title: "Limpeza do Salão", description: "Escala semanal", href: "/consulta/limpeza-salao", icon: Sparkles, color: "bg-cyan-600" },
      { title: "Serviço de Campo", description: "Dirigentes de campo", href: "/consulta/servico-campo", icon: MapPin, color: "bg-green-600" },
    ]
  },
  {
    title: "Pessoas",
    items: [
      { title: "Grupos de Estudo", description: "Membros de cada grupo", href: "/consulta/grupos", icon: Users, color: "bg-emerald-600" },
      { title: "Publicadores", description: "Lista completa", href: "/consulta/publicadores", icon: BookOpen, color: "bg-pink-600" },
    ]
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
  const [todosCampos, setTodosCampos] = useState<CampoSemanaItem[]>([])
  const [eventos, setEventos] = useState<EventoCalendario[]>([])
  const [mesSelecionado, setMesSelecionado] = useState(new Date())
  const [tooltip, setTooltip] = useState<{ x: number; y: number; campo?: CampoSemanaItem; isSegunda: boolean } | null>(null)
  
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

        // Buscar todos os campos ativos da semana para o tooltip do calendário
        const ordemDiasValidos = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"]
        const { data: todosCamposData } = await supabase
          .from("servico_campo_semana")
          .select("dia_semana, dirigente_nome, periodo, horario")
          .eq("ativo", true)
          .in("dia_semana", ordemDiasValidos)
        if (todosCamposData) {
          setTodosCampos(todosCamposData)
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

  const getCampoDia = (data: Date): CampoSemanaItem | undefined => {
    const diaSemanaNum = getDay(data) // 0=dom, 1=seg...
    const diaNome = diaSemanaMap[diaSemanaNum]
    return todosCampos.find(c => c.dia_semana === diaNome)
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

  const periodoTooltip = tooltip?.campo?.periodo === "manha" ? "Manhã" : tooltip?.campo?.periodo === "tarde" ? "Tarde" : tooltip?.campo?.periodo

  return (
    <>
    {/* Tooltip fixo do calendário */}
    {tooltip && (
      <div
        className="fixed z-[9999] pointer-events-none"
        style={{ left: tooltip.x, top: tooltip.y - 8, transform: "translate(-50%, -100%)" }}
      >
        <div
          className="rounded-lg border border-zinc-600 shadow-2xl px-3 py-2 text-left space-y-2 min-w-[150px]"
          style={{ backgroundColor: "#18181b" }}
        >
          {tooltip.campo && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <MapPin className="h-3 w-3 text-green-400 flex-shrink-0" />
                <span className="text-[10px] font-semibold text-green-400 uppercase tracking-wide">Campo</span>
              </div>
              <p className="text-xs font-medium text-white leading-tight">{tooltip.campo.dirigente_nome}</p>
              <p className="text-[10px] text-zinc-300 mt-0.5">{periodoTooltip} {tooltip.campo.horario}</p>
            </div>
          )}
          {tooltip.isSegunda && (
            <div className={cn(tooltip.campo ? "border-t border-zinc-600 pt-2" : "")}>
              <div className="flex items-center gap-1 mb-1">
                <Mail className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                <span className="text-[10px] font-semibold text-yellow-400 uppercase tracking-wide">Arranjo de Cartas</span>
              </div>
              <p className="text-[10px] text-zinc-300">Toda segunda-feira</p>
            </div>
          )}
          {/* Seta */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #3f3f46" }} />
        </div>
      </div>
    )}
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

      {/* Cards de Destaque */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">


        {/* Proximo Discurso */}
        {proximoDiscurso && (
          <Card className="border-zinc-800 bg-gradient-to-br from-amber-600/10 to-amber-900/5 sm:col-span-2 lg:col-span-3 hover:border-amber-600/30 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                <Mic className="h-4 w-4 text-amber-500" />
                Próximo Discurso Público
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
                Calendário
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
            <div className="grid grid-cols-7 gap-1 text-center text-xs overflow-visible">
              {["D", "S", "T", "Q", "Q", "S", "S"].map((dia, i) => (
                <div key={i} className="py-1 text-zinc-500 font-medium">{dia}</div>
              ))}
              {diasCalendario.map((dia, i) => {
                const evento = temEvento(dia)
                const campo = isSameMonth(dia, mesSelecionado) ? getCampoDia(dia) : undefined
                const isSegunda = getDay(dia) === 1 && isSameMonth(dia, mesSelecionado)
                const temTooltip = campo || isSegunda
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
                      evento?.tipo === "discurso" && !isToday(dia) && "ring-1 ring-amber-500/50",
                      temTooltip && "cursor-pointer"
                    )}
                    onMouseEnter={temTooltip ? (e) => {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                      setTooltip({ x: rect.left + rect.width / 2, y: rect.top, campo, isSegunda })
                    } : undefined}
                    onMouseLeave={temTooltip ? () => setTooltip(null) : undefined}
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
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Reunião
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
              Anúncios da Semana
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {limpezaSemana && (
              <div className="flex items-start gap-3 rounded-lg bg-cyan-600/10 p-3">
                <Sparkles className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Limpeza do Salão</p>
                  <p className="text-xs text-zinc-400">
                    Grupo responsável: <span className="text-cyan-400">{limpezaSemana.grupo_nome}</span>
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
            


            {equipeSemana.length > 0 && (
              <div className="rounded-lg bg-purple-600/10 p-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-white">Equipe Técnica da Semana</p>
                </div>
                {equipeSemana.map((reuniao, i) => {
                  const diaLabel = reuniao.dia_semana === "quinta" ? "Quinta-Feira" : "Domingo"
                  const dataLabel = format(new Date(reuniao.data), "dd/MM", { locale: ptBR })
                  return (
                    <div key={i} className="space-y-2">
                      <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                        {diaLabel} – {dataLabel}
                      </p>
                      <div className="grid grid-cols-1 gap-1 pl-1">
                        {/* Indicadores */}
                        <div className="flex items-center gap-2 text-xs text-zinc-300">
                          <span className="rounded bg-orange-600/20 px-1.5 py-0.5 text-orange-400 font-medium whitespace-nowrap">Indicadores</span>
                          <span>
                            {[reuniao.indicador1_nome, reuniao.indicador2_nome].filter(Boolean).join(" / ") || "A definir"}
                          </span>
                        </div>
                        {/* Volantes */}
                        <div className="flex items-center gap-2 text-xs text-zinc-300">
                          <span className="rounded bg-blue-600/20 px-1.5 py-0.5 text-blue-400 font-medium whitespace-nowrap">Volantes</span>
                          <span>
                            {[reuniao.microvolante1_nome, reuniao.microvolante2_nome].filter(Boolean).join(" / ") || "A definir"}
                          </span>
                        </div>
                        {/* Som */}
                        <div className="flex items-center gap-2 text-xs text-zinc-300">
                          <span className="rounded bg-green-600/20 px-1.5 py-0.5 text-green-400 font-medium whitespace-nowrap">Som</span>
                          <span>{reuniao.som_nome || "A definir"}</span>
                        </div>
                      </div>
                      {i < equipeSemana.length - 1 && <div className="border-t border-purple-600/20" />}
                    </div>
                  )
                })}
              </div>
            )}

            {campoHoje && (
              <div className="flex items-start gap-3 rounded-lg bg-green-600/10 p-3">
                <MapPin className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Campo Hoje</p>
                  <p className="text-xs text-zinc-400">
                    Dirigente: <span className="text-green-400">{campoHoje.dirigente_nome}</span>
                  </p>
                  <p className="text-xs text-zinc-400">
                    {campoHoje.periodo === "manha" ? "Manhã" : "Tarde"} — {campoHoje.horario}
                  </p>
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

      {/* Menu de Navegação - Organizado por Categorias */}
      <div className="space-y-6">
        {menuSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">{section.title}</h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Card className="group h-full border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all duration-200">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("rounded-lg p-2 flex-shrink-0", item.color)}>
                          <item.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-white truncate group-hover:text-blue-300 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs text-zinc-500 truncate">
                            {item.description}
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
        ))}
      </div>
    </div>
    </>
  )
}
