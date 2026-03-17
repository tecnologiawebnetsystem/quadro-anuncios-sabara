"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Users, 
  UserCheck, 
  Shield, 
  Flag, 
  Loader2, 
  Wrench, 
  Mic, 
  Volume2, 
  Sparkles, 
  Calendar,
  MapPin,
  BookOpen,
  TrendingUp,
  Clock,
  ChevronRight,
  BarChart3,
  Activity,
  Plus,
  AlertCircle,
  Bell,
  ClipboardList,
  Video,
  Zap,
  Brain,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  Info
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPublicadores, type PublicadorGrupo } from "@/lib/actions/grupos"
import { createClient } from "@/lib/supabase/client"
import { format, startOfWeek, endOfWeek, subWeeks, isToday, isTomorrow, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

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
  semana: number
}

interface AssistenciaReuniao {
  data: string
  dia_semana: string
  presencial: number
  zoom: number
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

interface Alerta {
  id: string
  tipo: "warning" | "info" | "success"
  mensagem: string
  link?: string
}

interface InsightsIA {
  resumo: string
  insights: string[]
  alertas: string[]
  sugestoes: string[]
  saude: "otima" | "boa" | "atencao" | "critica"
  estatisticas?: {
    totalPublicadores: number
    mediaAssistencia: number
    equipeIncompleta: number
    limpezaPendente: number
    partesSemDesignacao: number
  }
}

// Componente de Skeleton Loading
function SkeletonCard() {
  return (
    <Card className="border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <CardContent className="p-6">
        <div className="animate-pulse space-y-3">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-zinc-700 rounded" />
              <div className="h-8 w-16 bg-zinc-700 rounded" />
            </div>
            <div className="h-12 w-12 bg-zinc-700 rounded-xl" />
          </div>
          <div className="h-3 w-20 bg-zinc-700 rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

function SkeletonMiniCard() {
  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardContent className="p-4">
        <div className="animate-pulse flex items-center gap-3">
          <div className="h-10 w-10 bg-zinc-700 rounded-lg" />
          <div className="space-y-2">
            <div className="h-6 w-12 bg-zinc-700 rounded" />
            <div className="h-3 w-20 bg-zinc-700 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [publicadores, setPublicadores] = useState<PublicadorGrupo[]>([])
  const [equipeSemana, setEquipeSemana] = useState<EquipeTecnica[]>([])
  const [limpezaSemana, setLimpezaSemana] = useState<LimpezaSemana | null>(null)
  const [assistencia, setAssistencia] = useState<AssistenciaReuniao[]>([])
  const [proximoDiscurso, setProximoDiscurso] = useState<DiscursoPublico | null>(null)
  const [campoSemana, setCampoSemana] = useState<CampoSemana[]>([])
  const [totalGrupos, setTotalGrupos] = useState(0)
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [insightsIA, setInsightsIA] = useState<InsightsIA | null>(null)
  const [carregandoInsights, setCarregandoInsights] = useState(false)
  
  const hoje = new Date()
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 })
  const fimSemana = endOfWeek(hoje, { weekStartsOn: 1 })
  
  useEffect(() => {
    async function carregarDados() {
      try {
        const supabase = createClient()
        const alertasTemp: Alerta[] = []
        
        // Carregar publicadores
        const data = await getPublicadores()
        setPublicadores(data)
        
        // Contar grupos
        const { count: gruposCount } = await supabase
          .from("grupos")
          .select("*", { count: "exact", head: true })
        setTotalGrupos(gruposCount || 0)
        
        // Buscar equipe técnica da semana
        const mesAtual = format(hoje, "yyyy-MM")
        const resEquipe = await fetch(`/api/equipe-tecnica?mes=${mesAtual}`)
        if (resEquipe.ok) {
          const equipeData = await resEquipe.json()
          const reunioesSemana = equipeData.filter((e: EquipeTecnica) => {
            const dataReuniao = new Date(e.data)
            return dataReuniao >= inicioSemana && dataReuniao <= fimSemana
          })
          setEquipeSemana(reunioesSemana)
          
          // Verificar alertas de equipe técnica incompleta
          const equipesIncompletas = reunioesSemana.filter((e: EquipeTecnica) => 
            !e.indicador1_nome || !e.som_nome
          )
          if (equipesIncompletas.length > 0) {
            alertasTemp.push({
              id: "equipe-incompleta",
              tipo: "warning",
              mensagem: `${equipesIncompletas.length} reunião(ões) com equipe técnica incompleta`,
              link: "/admin/equipe-tecnica"
            })
          }
        }
        
        // Carregar limpeza da semana
        const resLimpeza = await fetch(`/api/limpeza-salao?mes=${mesAtual}`)
        if (resLimpeza.ok) {
          const limpezaData = await resLimpeza.json()
          const semanaAtual = limpezaData.find((l: LimpezaSemana) => {
            const inicio = new Date(l.data_inicio)
            const fim = new Date(l.data_fim)
            return hoje >= inicio && hoje <= fim
          })
          if (semanaAtual) {
            setLimpezaSemana(semanaAtual)
          } else {
            alertasTemp.push({
              id: "limpeza-pendente",
              tipo: "info",
              mensagem: "Nenhum grupo de limpeza designado para esta semana",
              link: "/admin/limpeza-salao"
            })
          }
        }
        
        // Carregar assistência recente (últimas 8 semanas)
        const { data: assistenciaData } = await supabase
          .from("assistencia_reunioes")
          .select("*")
          .order("data", { ascending: false })
          .limit(16)
        if (assistenciaData) setAssistencia(assistenciaData.reverse())
        
        // Carregar próximo discurso público
        const { data: discursoData } = await supabase
          .from("discursos_publicos")
          .select("*")
          .gte("data", format(hoje, "yyyy-MM-dd"))
          .order("data", { ascending: true })
          .limit(1)
        if (discursoData && discursoData.length > 0) {
          setProximoDiscurso(discursoData[0])
          
          // Verificar se o próximo discurso não tem orador
          if (!discursoData[0].orador_nome && !discursoData[0].tema) {
            alertasTemp.push({
              id: "discurso-pendente",
              tipo: "warning",
              mensagem: "Próximo discurso público sem informações",
              link: "/admin/reunioes-publicas"
            })
          }
        }
        
        // Carregar serviço de campo da semana
        const { data: campoData } = await supabase
          .from("servico_campo_semana")
          .select("*")
          .eq("ativo", true)
          .order("dia_semana")
        if (campoData) setCampoSemana(campoData)
        
        setAlertas(alertasTemp)
        
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [])

  // Carregar insights de IA
  async function carregarInsightsIA() {
    setCarregandoInsights(true)
    try {
      const response = await fetch("/api/ia/insights")
      if (response.ok) {
        const data = await response.json()
        setInsightsIA(data)
      }
    } catch (error) {
      console.error("Erro ao carregar insights:", error)
    } finally {
      setCarregandoInsights(false)
    }
  }

  const totalAtivos = publicadores.filter((p) => p.ativo).length
  const totalAnciaos = publicadores.filter((p) => p.anciao && p.ativo).length
  const totalServos = publicadores.filter((p) => p.servo_ministerial && p.ativo).length
  const totalPioneiros = publicadores.filter((p) => p.pioneiro_regular && p.ativo).length
  
  // Cálculos de assistência
  const mediaPresencial = assistencia.length > 0 
    ? Math.round(assistencia.reduce((acc, a) => acc + (a.presencial || 0), 0) / assistencia.length)
    : 0
  const mediaZoom = assistencia.length > 0 
    ? Math.round(assistencia.reduce((acc, a) => acc + (a.zoom || 0), 0) / assistencia.length)
    : 0
    
  // Calcular tendência (comparar últimas 4 reuniões com as 4 anteriores)
  const ultimas4 = assistencia.slice(-4)
  const anteriores4 = assistencia.slice(-8, -4)
  const mediaUltimas = ultimas4.length > 0 
    ? ultimas4.reduce((acc, a) => acc + (a.presencial || 0) + (a.zoom || 0), 0) / ultimas4.length
    : 0
  const mediaAnteriores = anteriores4.length > 0 
    ? anteriores4.reduce((acc, a) => acc + (a.presencial || 0) + (a.zoom || 0), 0) / anteriores4.length
    : 0
  const tendencia = mediaAnteriores > 0 ? Math.round(((mediaUltimas - mediaAnteriores) / mediaAnteriores) * 100) : 0

  // Skeleton Loading
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-zinc-700 rounded animate-pulse" />
            <div className="h-8 w-40 bg-zinc-700 rounded animate-pulse" />
          </div>
          <div className="h-4 w-80 bg-zinc-700 rounded animate-pulse mt-1" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Mini Cards Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SkeletonMiniCard />
          <SkeletonMiniCard />
          <SkeletonMiniCard />
          <SkeletonMiniCard />
        </div>

        {/* Content Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 w-48 bg-zinc-700 rounded" />
                <div className="h-40 bg-zinc-700 rounded" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 w-48 bg-zinc-700 rounded" />
                <div className="h-40 bg-zinc-700 rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Dashboard
            </h1>
          </div>
          {alertas.length > 0 && (
            <Badge variant="outline" className="border-amber-600/50 bg-amber-600/10 text-amber-400">
              <Bell className="h-3 w-3 mr-1" />
              {alertas.length} alerta{alertas.length > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Visao geral da congregacao - {format(hoje, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* Alertas/Notificacoes */}
      {alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((alerta) => (
            <Link key={alerta.id} href={alerta.link || "#"}>
              <div className={cn(
                "flex items-center gap-3 rounded-lg border p-3 transition-all hover:bg-zinc-800/50",
                alerta.tipo === "warning" && "border-amber-600/30 bg-amber-600/5",
                alerta.tipo === "info" && "border-blue-600/30 bg-blue-600/5",
                alerta.tipo === "success" && "border-green-600/30 bg-green-600/5"
              )}>
                <AlertCircle className={cn(
                  "h-5 w-5",
                  alerta.tipo === "warning" && "text-amber-500",
                  alerta.tipo === "info" && "text-blue-500",
                  alerta.tipo === "success" && "text-green-500"
                )} />
                <p className="flex-1 text-sm text-zinc-300">{alerta.mensagem}</p>
                <ChevronRight className="h-4 w-4 text-zinc-500" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Card de Insights com IA */}
      <Card className="border-zinc-800 bg-gradient-to-br from-violet-600/10 via-zinc-900/50 to-purple-600/10 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Brain className="h-5 w-5 text-violet-500" />
              Insights com IA
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={carregarInsightsIA}
              disabled={carregandoInsights}
              className="border-violet-600/30 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400"
            >
              {carregandoInsights ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Gerar Analise
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {insightsIA ? (
            <div className="space-y-4">
              {/* Saúde da Congregação */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  insightsIA.saude === "otima" && "bg-green-600/20",
                  insightsIA.saude === "boa" && "bg-blue-600/20",
                  insightsIA.saude === "atencao" && "bg-amber-600/20",
                  insightsIA.saude === "critica" && "bg-red-600/20"
                )}>
                  {insightsIA.saude === "otima" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {insightsIA.saude === "boa" && <CheckCircle2 className="h-5 w-5 text-blue-500" />}
                  {insightsIA.saude === "atencao" && <AlertCircle className="h-5 w-5 text-amber-500" />}
                  {insightsIA.saude === "critica" && <AlertCircle className="h-5 w-5 text-red-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{insightsIA.resumo}</p>
                  <p className={cn(
                    "text-xs capitalize",
                    insightsIA.saude === "otima" && "text-green-400",
                    insightsIA.saude === "boa" && "text-blue-400",
                    insightsIA.saude === "atencao" && "text-amber-400",
                    insightsIA.saude === "critica" && "text-red-400"
                  )}>
                    Saude: {insightsIA.saude}
                  </p>
                </div>
              </div>

              {/* Grid de Insights e Sugestões */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Insights */}
                {insightsIA.insights.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-violet-400 flex items-center gap-1">
                      <Lightbulb className="h-4 w-4" />
                      Insights
                    </p>
                    {insightsIA.insights.map((insight, i) => (
                      <div key={i} className="p-2 rounded bg-violet-600/10 border border-violet-600/20 text-sm text-zinc-300">
                        {insight}
                      </div>
                    ))}
                  </div>
                )}

                {/* Sugestões */}
                {insightsIA.sugestoes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-cyan-400 flex items-center gap-1">
                      <Info className="h-4 w-4" />
                      Sugestoes
                    </p>
                    {insightsIA.sugestoes.map((sugestao, i) => (
                      <div key={i} className="p-2 rounded bg-cyan-600/10 border border-cyan-600/20 text-sm text-zinc-300">
                        {sugestao}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Brain className="h-12 w-12 mx-auto text-violet-500/50 mb-3" />
              <p className="text-sm text-zinc-500">
                Clique em "Gerar Analise" para obter insights personalizados sobre a congregacao
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acoes Rapidas */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/reunioes-publicas">
          <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-600">
            <Plus className="h-4 w-4 mr-2 text-amber-500" />
            Cadastrar Discurso
          </Button>
        </Link>
        <Link href="/admin/equipe-tecnica">
          <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-600">
            <Wrench className="h-4 w-4 mr-2 text-green-500" />
            Equipe Tecnica
          </Button>
        </Link>
        <Link href="/admin/limpeza-salao">
          <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-600">
            <Sparkles className="h-4 w-4 mr-2 text-cyan-500" />
            Escala Limpeza
          </Button>
        </Link>
        <Link href="/admin/servico-campo">
          <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-600">
            <MapPin className="h-4 w-4 mr-2 text-purple-500" />
            Servico de Campo
          </Button>
        </Link>
        <Link href="/admin/publicadores/new">
          <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-600">
            <Users className="h-4 w-4 mr-2 text-blue-500" />
            Novo Publicador
          </Button>
        </Link>
      </div>

      {/* Stats Cards - Grid Principal */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/publicadores">
          <Card className="group relative overflow-hidden border-zinc-800 bg-gradient-to-br from-blue-600/10 to-blue-900/5 transition-all hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">Total de Publicadores</p>
                  <p className="mt-2 text-4xl font-bold text-white">{totalAtivos}</p>
                  <p className="mt-1 text-xs text-zinc-500">Ativos na congregacao</p>
                </div>
                <div className="rounded-xl bg-blue-600 p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-blue-400">
                <span>Ver detalhes</span>
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/publicadores/anciaos">
          <Card className="group relative overflow-hidden border-zinc-800 bg-gradient-to-br from-red-600/10 to-red-900/5 transition-all hover:border-red-600/50 hover:shadow-lg hover:shadow-red-600/10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">Anciaos</p>
                  <p className="mt-2 text-4xl font-bold text-white">{totalAnciaos}</p>
                  <p className="mt-1 text-xs text-zinc-500">Corpo de anciaos</p>
                </div>
                <div className="rounded-xl bg-red-600 p-3">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-red-400">
                <span>Ver detalhes</span>
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/publicadores/servos-ministeriais">
          <Card className="group relative overflow-hidden border-zinc-800 bg-gradient-to-br from-emerald-600/10 to-emerald-900/5 transition-all hover:border-emerald-600/50 hover:shadow-lg hover:shadow-emerald-600/10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">Servos Ministeriais</p>
                  <p className="mt-2 text-4xl font-bold text-white">{totalServos}</p>
                  <p className="mt-1 text-xs text-zinc-500">Designados</p>
                </div>
                <div className="rounded-xl bg-emerald-600 p-3">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-emerald-400">
                <span>Ver detalhes</span>
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/publicadores/pioneiros-regulares">
          <Card className="group relative overflow-hidden border-zinc-800 bg-gradient-to-br from-amber-600/10 to-amber-900/5 transition-all hover:border-amber-600/50 hover:shadow-lg hover:shadow-amber-600/10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">Pioneiros</p>
                  <p className="mt-2 text-4xl font-bold text-white">{totalPioneiros}</p>
                  <p className="mt-1 text-xs text-zinc-500">Regulares</p>
                </div>
                <div className="rounded-xl bg-amber-600 p-3">
                  <Flag className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-amber-400">
                <span>Ver detalhes</span>
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Segunda linha - Cards informativos menores */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-600/20 p-2.5">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalGrupos}</p>
                <p className="text-xs text-zinc-500">Grupos de Estudo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-cyan-600/20 p-2.5">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{mediaPresencial}</p>
                <p className="text-xs text-zinc-500">Media Presencial</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-600/20 p-2.5">
                <Video className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{mediaZoom}</p>
                <p className="text-xs text-zinc-500">Media Zoom</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "rounded-lg p-2.5",
                tendencia >= 0 ? "bg-green-600/20" : "bg-red-600/20"
              )}>
                <Zap className={cn(
                  "h-5 w-5",
                  tendencia >= 0 ? "text-green-400" : "text-red-400"
                )} />
              </div>
              <div>
                <p className={cn(
                  "text-2xl font-bold",
                  tendencia >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {tendencia >= 0 ? "+" : ""}{tendencia}%
                </p>
                <p className="text-xs text-zinc-500">Tendencia</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grafico de Assistencia */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Assistencia das Reunioes
            </CardTitle>
            <Link href="/admin/reunioes-publicas" className="text-xs text-blue-400 hover:underline">
              Ver detalhes
            </Link>
          </div>
          <p className="text-sm text-zinc-500">Ultimas {assistencia.length} reunioes</p>
        </CardHeader>
        <CardContent>
          {assistencia.length > 0 ? (
            <div className="space-y-4">
              {/* Grafico de barras simples */}
              <div className="flex items-end justify-between gap-1 h-40">
                {assistencia.slice(-12).map((a, i) => {
                  const total = (a.presencial || 0) + (a.zoom || 0)
                  const maxTotal = Math.max(...assistencia.map(x => (x.presencial || 0) + (x.zoom || 0)))
                  const alturaPercent = maxTotal > 0 ? (total / maxTotal) * 100 : 0
                  const presencialPercent = total > 0 ? ((a.presencial || 0) / total) * 100 : 0
                  
                  const zoomPercent = total > 0 ? ((a.zoom || 0) / total) * 100 : 0
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col justify-end" style={{ height: "120px" }}>
                        <div 
                          className="w-full flex flex-col justify-end rounded-t-sm overflow-hidden"
                          style={{ height: `${alturaPercent}%`, minHeight: total > 0 ? "4px" : "0px" }}
                          title={`Presencial: ${a.presencial || 0}, Zoom: ${a.zoom || 0}`}
                        >
                          {/* Parte do zoom (verde) */}
                          {(a.zoom || 0) > 0 && (
                            <div 
                              className="w-full bg-green-500 transition-all hover:opacity-80"
                              style={{ height: `${zoomPercent}%`, minHeight: "2px" }}
                            />
                          )}
                          {/* Parte presencial (azul) */}
                          {(a.presencial || 0) > 0 && (
                            <div 
                              className="w-full bg-gradient-to-t from-blue-600 to-blue-500 transition-all hover:opacity-80"
                              style={{ height: `${presencialPercent}%`, minHeight: "2px" }}
                            />
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-500">
                        {format(parseISO(a.data), "dd/MM")}
                      </span>
                    </div>
                  )
                })}
              </div>
              
              {/* Legenda */}
              <div className="flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-gradient-to-t from-blue-600 to-cyan-500" />
                  <span className="text-zinc-400">Presencial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-green-500" />
                  <span className="text-zinc-400">Zoom</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 rounded-lg bg-zinc-800/30">
              <p className="text-sm text-zinc-500">Nenhum dado de assistencia cadastrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terceira secao - Cards de informacoes da semana */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Equipe Tecnica da Semana */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Calendar className="h-5 w-5 text-blue-500" />
                Reunioes da Semana
              </CardTitle>
              <Link href="/admin/equipe-tecnica" className="text-xs text-blue-400 hover:underline">
                Ver tudo
              </Link>
            </div>
            <p className="text-sm text-zinc-500">
              {format(inicioSemana, "d", { locale: ptBR })} a {format(fimSemana, "d 'de' MMMM", { locale: ptBR })}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {equipeSemana.length > 0 ? (
              equipeSemana.map((reuniao, index) => (
                <div key={index} className="rounded-lg bg-zinc-800/50 p-4">
                  <div className="mb-3 flex items-center gap-2 border-b border-zinc-700/50 pb-2">
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      reuniao.dia_semana === "quinta" 
                        ? "bg-purple-600/20 text-purple-400" 
                        : "bg-blue-600/20 text-blue-400"
                    )}>
                      {reuniao.dia_semana === "quinta" ? "Quinta" : "Domingo"}
                    </span>
                    <span className="text-sm text-zinc-400">
                      {format(new Date(reuniao.data), "dd/MM", { locale: ptBR })}
                    </span>
                    {isToday(new Date(reuniao.data)) && (
                      <Badge className="bg-green-600/20 text-green-400 text-[10px]">Hoje</Badge>
                    )}
                    {isTomorrow(new Date(reuniao.data)) && (
                      <Badge className="bg-amber-600/20 text-amber-400 text-[10px]">Amanha</Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="mb-1 flex items-center gap-1 text-zinc-500">
                        <Wrench className="h-3 w-3 text-green-500" />
                        <span className="text-xs">Indicadores</span>
                      </div>
                      <p className="text-zinc-300">{reuniao.indicador1_nome || "-"}</p>
                      <p className="text-zinc-300">{reuniao.indicador2_nome || "-"}</p>
                    </div>
                    
                    <div>
                      <div className="mb-1 flex items-center gap-1 text-zinc-500">
                        <Mic className="h-3 w-3 text-purple-500" />
                        <span className="text-xs">Microfone</span>
                      </div>
                      <p className="text-zinc-300">{reuniao.microvolante1_nome || "-"}</p>
                      <p className="text-zinc-300">{reuniao.microvolante2_nome || "-"}</p>
                    </div>
                    
                    <div>
                      <div className="mb-1 flex items-center gap-1 text-zinc-500">
                        <Volume2 className="h-3 w-3 text-blue-500" />
                        <span className="text-xs">Som</span>
                      </div>
                      <p className="text-zinc-300">{reuniao.som_nome || "-"}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg bg-zinc-800/30 p-6 text-center">
                <p className="text-sm text-zinc-500">
                  Nenhuma designacao cadastrada para esta semana
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coluna direita - Limpeza + Proximo Discurso + Campo */}
        <div className="space-y-6">
          {/* Limpeza da Semana */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Sparkles className="h-5 w-5 text-cyan-500" />
                  Limpeza da Semana
                </CardTitle>
                <Link href="/admin/limpeza-salao" className="text-xs text-cyan-400 hover:underline">
                  Ver escala
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {limpezaSemana ? (
                <div className="flex items-center justify-between rounded-lg bg-cyan-600/10 p-4">
                  <div>
                    <p className="text-lg font-semibold text-white">{limpezaSemana.grupo_nome}</p>
                    <p className="text-sm text-zinc-400">
                      {format(new Date(limpezaSemana.data_inicio), "dd/MM", { locale: ptBR })} a {format(new Date(limpezaSemana.data_fim), "dd/MM", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="rounded-full bg-cyan-600/20 p-3">
                    <Sparkles className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-zinc-800/30 p-4 text-center">
                  <p className="text-sm text-zinc-500">Nenhum grupo designado</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Proximo Discurso Publico */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Mic className="h-5 w-5 text-amber-500" />
                  Proximo Discurso Publico
                </CardTitle>
                <Link href="/admin/reunioes-publicas" className="text-xs text-amber-400 hover:underline">
                  Ver todos
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {proximoDiscurso ? (
                <div className="rounded-lg bg-amber-600/10 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-amber-400">
                      {format(new Date(proximoDiscurso.data), "EEEE, d 'de' MMMM", { locale: ptBR })}
                    </span>
                  </div>
                  <p className="mb-1 text-base font-medium text-white">{proximoDiscurso.tema || "Tema nao definido"}</p>
                  {proximoDiscurso.orador_nome && (
                    <p className="text-sm text-zinc-400">Orador: {proximoDiscurso.orador_nome}</p>
                  )}
                </div>
              ) : (
                <div className="rounded-lg bg-zinc-800/30 p-4 text-center">
                  <p className="text-sm text-zinc-500">Nenhum discurso agendado</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Servico de Campo */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="h-5 w-5 text-purple-500" />
                  Servico de Campo - Semana
                </CardTitle>
                <Link href="/admin/servico-campo" className="text-xs text-purple-400 hover:underline">
                  Ver tudo
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {campoSemana.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {campoSemana.slice(0, 4).map((campo, index) => (
                    <div key={index} className="rounded-lg bg-purple-600/10 p-3">
                      <p className="text-xs text-purple-400 capitalize">{campo.dia_semana}</p>
                      <p className="text-sm font-medium text-white truncate">{campo.dirigente_nome}</p>
                      <p className="text-xs text-zinc-500">{campo.horario} - {campo.periodo}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-zinc-800/30 p-4 text-center">
                  <p className="text-sm text-zinc-500">Nenhum dirigente cadastrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
