"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Users, 
  ChevronRight,
  ChevronLeft,
  BookMarked,
  Gem,
  Wrench,
  Sparkles,
  MapPin,
  Mic,
  Megaphone,
  Info,
  CalendarDays,
  Mail
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { usePublicadoresSupabase } from "@/lib/hooks/use-publicadores-supabase"
import { Shield, User } from "lucide-react"
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

interface VidaMinisterioSemana {
  data_inicio: string
  data_fim: string
  leitura_semanal: string
  sem_reuniao?: boolean
  motivo_sem_reuniao?: string
}

interface SentinelaSemana {
  data_inicio: string
  data_fim: string
  titulo: string
  sem_reuniao?: boolean
  motivo_sem_reuniao?: string
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
  const [vidaMinisterioSemanas, setVidaMinisterioSemanas] = useState<VidaMinisterioSemana[]>([])
  const [sentinelaSemanas, setSentinelaSemanas] = useState<SentinelaSemana[]>([])
  const [tooltip, setTooltip] = useState<{ 
    x: number; 
    y: number; 
    campo?: CampoSemanaItem; 
    isSegunda: boolean;
    vidaMinisterio?: VidaMinisterioSemana;
    sentinela?: SentinelaSemana;
    discurso?: DiscursoPublico;
  } | null>(null)
  const [tooltipFixo, setTooltipFixo] = useState(false)
  
  const { syncTrigger } = useSync()
  
  // Hook para grupos de estudo
  const { 
    publicadores, 
    grupos, 
    carregando: carregandoGrupos, 
    getPublicadoresPorGrupo,
    getDirigente,
    getAuxiliar 
  } = usePublicadoresSupabase()
  
  const [grupoSelecionado, setGrupoSelecionado] = useState<number | null>(null)
  const [modalGruposAberto, setModalGruposAberto] = useState(false)
  
  // Cores diferentes para cada grupo
  const coresGrupos = [
    { bg: "bg-blue-600/20", text: "text-blue-400", hover: "hover:bg-blue-600/30", border: "hover:border-blue-500/50", scrollbar: "modal-scrollbar scrollbar-blue" },
    { bg: "bg-emerald-600/20", text: "text-emerald-400", hover: "hover:bg-emerald-600/30", border: "hover:border-emerald-500/50", scrollbar: "modal-scrollbar scrollbar-emerald" },
    { bg: "bg-amber-600/20", text: "text-amber-400", hover: "hover:bg-amber-600/30", border: "hover:border-amber-500/50", scrollbar: "modal-scrollbar scrollbar-amber" },
    { bg: "bg-purple-600/20", text: "text-purple-400", hover: "hover:bg-purple-600/30", border: "hover:border-purple-500/50", scrollbar: "modal-scrollbar scrollbar-purple" },
    { bg: "bg-pink-600/20", text: "text-pink-400", hover: "hover:bg-pink-600/30", border: "hover:border-pink-500/50", scrollbar: "modal-scrollbar scrollbar-pink" },
    { bg: "bg-cyan-600/20", text: "text-cyan-400", hover: "hover:bg-cyan-600/30", border: "hover:border-cyan-500/50", scrollbar: "modal-scrollbar scrollbar-cyan" },
    { bg: "bg-orange-600/20", text: "text-orange-400", hover: "hover:bg-orange-600/30", border: "hover:border-orange-500/50", scrollbar: "modal-scrollbar scrollbar-orange" },
    { bg: "bg-rose-600/20", text: "text-rose-400", hover: "hover:bg-rose-600/30", border: "hover:border-rose-500/50", scrollbar: "modal-scrollbar scrollbar-rose" },
  ]
  
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

        // Buscar semanas do Vida e Ministério (quinta-feira)
        const { data: vidaMinisterioData } = await supabase
          .from("vida_ministerio_semanas")
          .select("data_inicio, data_fim, leitura_semanal, sem_reuniao, motivo_sem_reuniao")
        if (vidaMinisterioData) {
          setVidaMinisterioSemanas(vidaMinisterioData)
        }

        // Buscar estudos da Sentinela (domingo)
        const { data: sentinelaData } = await supabase
          .from("sentinela_estudos")
          .select("data_inicio, data_fim, titulo, sem_reuniao, motivo_sem_reuniao")
        if (sentinelaData) {
          setSentinelaSemanas(sentinelaData)
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

  const getVidaMinisterioDia = (data: Date): VidaMinisterioSemana | undefined => {
    // Vida e Ministério é na quinta-feira (dia 4)
    if (getDay(data) !== 4) return undefined
    const dataStr = format(data, "yyyy-MM-dd")
    return vidaMinisterioSemanas.find(vm => dataStr >= vm.data_inicio && dataStr <= vm.data_fim)
  }

  const getSentinelaDia = (data: Date): SentinelaSemana | undefined => {
    // Sentinela é no domingo (dia 0)
    if (getDay(data) !== 0) return undefined
    const dataStr = format(data, "yyyy-MM-dd")
    return sentinelaSemanas.find(s => dataStr >= s.data_inicio && dataStr <= s.data_fim)
  }

  const getDiscursoDia = (data: Date): DiscursoPublico | undefined => {
    const dataStr = format(data, "yyyy-MM-dd")
    return eventos.find(e => e.data === dataStr && e.tipo === "discurso") 
      ? { data: dataStr, tema: eventos.find(e => e.data === dataStr && e.tipo === "discurso")?.titulo || "", orador_nome: null }
      : undefined
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

  // Fechar tooltip ao clicar fora
  const handleClickFora = () => {
    if (tooltipFixo) {
      setTooltip(null)
      setTooltipFixo(false)
    }
  }

  return (
    <>
    {/* Overlay para fechar tooltip em mobile */}
    {tooltipFixo && (
      <div 
        className="fixed inset-0 z-[9998]" 
        onClick={handleClickFora}
      />
    )}
    
    {/* Tooltip fixo do calendário */}
    {tooltip && (
      <div
        className="fixed z-[9999] pointer-events-none"
        style={{ left: tooltip.x, top: tooltip.y - 8, transform: "translate(-50%, -100%)" }}
      >
        <div
          className="rounded-lg border border-zinc-600 shadow-2xl px-3 py-2 text-left space-y-2 min-w-[180px] max-w-[250px]"
          style={{ backgroundColor: "#18181b" }}
        >
          {/* Vida e Ministério (Quinta) */}
          {tooltip.vidaMinisterio && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Gem className="h-3 w-3 text-blue-400 flex-shrink-0" />
                <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wide">Vida e Ministério</span>
              </div>
              {tooltip.vidaMinisterio.sem_reuniao ? (
                <p className="text-[10px] text-amber-400">Sem reunião: {tooltip.vidaMinisterio.motivo_sem_reuniao || "Semana especial"}</p>
              ) : (
                <p className="text-[10px] text-zinc-300">{tooltip.vidaMinisterio.leitura_semanal || "Reunião de meio de semana"}</p>
              )}
            </div>
          )}
          
          {/* Sentinela (Domingo) */}
          {tooltip.sentinela && (
            <div className={cn(tooltip.vidaMinisterio ? "border-t border-zinc-600 pt-2" : "")}>
              <div className="flex items-center gap-1 mb-1">
                <BookMarked className="h-3 w-3 text-red-400 flex-shrink-0" />
                <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wide">Estudo Sentinela</span>
              </div>
              {tooltip.sentinela.sem_reuniao ? (
                <p className="text-[10px] text-amber-400">Sem reunião: {tooltip.sentinela.motivo_sem_reuniao || "Semana especial"}</p>
              ) : (
                <p className="text-[10px] text-zinc-300 line-clamp-2">{tooltip.sentinela.titulo || "Estudo de A Sentinela"}</p>
              )}
            </div>
          )}
          
          {/* Campo */}
          {tooltip.campo && (
            <div className={cn((tooltip.vidaMinisterio || tooltip.sentinela) ? "border-t border-zinc-600 pt-2" : "")}>
              <div className="flex items-center gap-1 mb-1">
                <MapPin className="h-3 w-3 text-green-400 flex-shrink-0" />
                <span className="text-[10px] font-semibold text-green-400 uppercase tracking-wide">Campo</span>
              </div>
              <p className="text-xs font-medium text-white leading-tight">{tooltip.campo.dirigente_nome}</p>
              <p className="text-[10px] text-zinc-300 mt-0.5">{periodoTooltip} {tooltip.campo.horario}</p>
            </div>
          )}
          
          {/* Segunda - Cartas */}
          {tooltip.isSegunda && (
            <div className={cn((tooltip.campo || tooltip.vidaMinisterio || tooltip.sentinela) ? "border-t border-zinc-600 pt-2" : "")}>
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
                const mesAtual = isSameMonth(dia, mesSelecionado)
                const campo = mesAtual ? getCampoDia(dia) : undefined
                const vidaMinisterio = mesAtual ? getVidaMinisterioDia(dia) : undefined
                const sentinela = mesAtual ? getSentinelaDia(dia) : undefined
                const isSegunda = getDay(dia) === 1 && mesAtual
                const isQuinta = getDay(dia) === 4 && mesAtual
                const isDomingo = getDay(dia) === 0 && mesAtual
                const temTooltip = campo || isSegunda || vidaMinisterio || sentinela
                
                const handleInteracao = (e: React.MouseEvent | React.TouchEvent) => {
                  if (!temTooltip) return
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                  const novoTooltip = { 
                    x: rect.left + rect.width / 2, 
                    y: rect.top, 
                    campo, 
                    isSegunda, 
                    vidaMinisterio, 
                    sentinela 
                  }
                  setTooltip(novoTooltip)
                }
                
                const handleClick = (e: React.MouseEvent) => {
                  if (!temTooltip) return
                  e.stopPropagation()
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                  // Se já está mostrando este tooltip, fecha
                  if (tooltipFixo && tooltip?.x === rect.left + rect.width / 2) {
                    setTooltip(null)
                    setTooltipFixo(false)
                  } else {
                    setTooltip({ 
                      x: rect.left + rect.width / 2, 
                      y: rect.top, 
                      campo, 
                      isSegunda, 
                      vidaMinisterio, 
                      sentinela 
                    })
                    setTooltipFixo(true)
                  }
                }
                
                return (
                  <div
                    key={i}
                    className={cn(
                      "py-1.5 rounded-md text-sm relative transition-colors select-none",
                      !mesAtual && "text-zinc-700",
                      mesAtual && "text-zinc-300",
                      isToday(dia) && "bg-blue-600 text-white font-bold",
                      temTooltip && "cursor-pointer hover:bg-zinc-700/50 active:bg-zinc-600/50"
                    )}
                    onMouseEnter={temTooltip ? handleInteracao : undefined}
                    onMouseLeave={temTooltip && !tooltipFixo ? () => setTooltip(null) : undefined}
                    onClick={handleClick}
                  >
                    {format(dia, "d")}
                    {(evento || (isQuinta && vidaMinisterio) || (isDomingo && sentinela)) && (
                      <span className={cn(
                        "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                        evento?.tipo === "reuniao" && "bg-purple-500",
                        evento?.tipo === "discurso" && "bg-amber-500",
                        evento?.tipo === "campo" && "bg-green-500",
                        isQuinta && vidaMinisterio && !evento && "bg-blue-500",
                        isDomingo && sentinela && !evento && "bg-red-500"
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Legenda */}
            <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Vida e Min.
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Sentinela
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Discurso
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-blue-600" /> Hoje
              </span>
            </div>
            <p className="text-[9px] text-zinc-600 mt-2">Toque na data para ver detalhes</p>
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

      {/* Seção Grupos de Estudo - Destaque */}
      <Card className="border-zinc-800 bg-gradient-to-br from-emerald-600/10 to-emerald-900/5 hover:border-emerald-600/30 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Users className="h-5 w-5 text-emerald-500" />
            Grupos de Estudo
          </CardTitle>
          <p className="text-sm text-zinc-400">
            {carregandoGrupos ? "Carregando..." : `${grupos.length} grupos | ${publicadores.filter(p => p.ativo).length} publicadores ativos`}
          </p>
        </CardHeader>
        <CardContent>
          {carregandoGrupos ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {grupos.map((grupo, index) => {
                const dirigente = getDirigente(grupo.id)
                const membros = getPublicadoresPorGrupo(grupo.id)
                const cor = coresGrupos[index % coresGrupos.length]
                
                return (
                  <Dialog key={grupo.id}>
                    <DialogTrigger asChild>
                      <button className={cn(
                        "group flex flex-col items-center gap-1.5 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 transition-all duration-200",
                        cor.hover,
                        cor.border
                      )}>
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-colors",
                          cor.bg,
                          cor.text
                        )}>
                          {grupo.numero}
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium text-white">Grupo {grupo.numero}</p>
                          <p className="text-[10px] text-zinc-500">{membros.length} membros</p>
                        </div>
                      </button>
                    </DialogTrigger>
<DialogContent className={cn(
  "bg-zinc-900 border-zinc-700 max-w-md max-h-[80vh] overflow-y-auto",
  cor.scrollbar
)}>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold",
                            cor.bg,
                            cor.text
                          )}>
                            {grupo.numero}
                          </div>
                          <div>
                            <span className="text-white">Grupo {grupo.numero}</span>
                            <p className="text-sm font-normal text-zinc-400">{membros.length} membros</p>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="mt-4 space-y-4">
                        {/* Dirigente e Auxiliar */}
                        {dirigente && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-zinc-500">Dirigente:</span>
                            <span className="text-emerald-400 font-medium">{dirigente.nome}</span>
                          </div>
                        )}
                        {(() => {
                          const auxiliar = getAuxiliar(grupo.id)
                          return auxiliar && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-zinc-500">Auxiliar:</span>
                              <span className="text-blue-400 font-medium">{auxiliar.nome}</span>
                            </div>
                          )
                        })()}

                        {/* Estatísticas */}
                        <div className="flex gap-2">
                          {membros.filter(m => m.anciao).length > 0 && (
                            <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30 text-xs">
                              {membros.filter(m => m.anciao).length} ancião{membros.filter(m => m.anciao).length > 1 ? 's' : ''}
                            </Badge>
                          )}
                          {membros.filter(m => m.servo_ministerial).length > 0 && (
                            <Badge className="bg-amber-600/20 text-amber-300 border-amber-600/30 text-xs">
                              {membros.filter(m => m.servo_ministerial).length} servo{membros.filter(m => m.servo_ministerial).length > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Lista de Membros */}
                        <div className="space-y-2">
                          {membros.map((membro) => (
                            <div 
                              key={membro.id} 
                              className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50"
                            >
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-zinc-500" />
                                <span className="text-sm text-zinc-300">{membro.nome}</span>
                              </div>
                              <div className="flex gap-1">
                                {membro.anciao && (
                                  <Badge className="bg-blue-600/20 text-blue-400 border-0 text-xs px-1.5">
                                    <Shield className="w-3 h-3" />
                                  </Badge>
                                )}
                                {membro.servo_ministerial && (
                                  <Badge className="bg-amber-600/20 text-amber-400 border-0 text-xs px-1.5">
                                    SM
                                  </Badge>
                                )}
                                {membro.pioneiro_regular && (
                                  <Badge className="bg-emerald-600/20 text-emerald-400 border-0 text-xs px-1.5">
                                    PR
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Legenda */}
                        <div className="pt-3 border-t border-zinc-700">
                          <p className="text-xs text-zinc-500 text-center mb-2">LEGENDA</p>
                          <div className="flex flex-wrap justify-center gap-3">
                            <div className="flex items-center gap-1">
                              <Badge className="bg-blue-600/20 text-blue-400 border-0 text-xs">
                                <Shield className="w-3 h-3" />
                              </Badge>
                              <span className="text-xs text-zinc-400">Ancião</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge className="bg-amber-600/20 text-amber-400 border-0 text-xs">
                                SM
                              </Badge>
                              <span className="text-xs text-zinc-400">Servo</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge className="bg-emerald-600/20 text-emerald-400 border-0 text-xs">
                                PR
                              </Badge>
                              <span className="text-xs text-zinc-400">Pioneiro</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  )
}
