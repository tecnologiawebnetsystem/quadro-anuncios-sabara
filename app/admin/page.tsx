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
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPublicadores, type PublicadorGrupo } from "@/lib/actions/grupos"
import { createClient } from "@/lib/supabase/client"
import { format, startOfWeek, endOfWeek, addDays } from "date-fns"
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

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [publicadores, setPublicadores] = useState<PublicadorGrupo[]>([])
  const [equipeSemana, setEquipeSemana] = useState<EquipeTecnica[]>([])
  const [limpezaSemana, setLimpezaSemana] = useState<LimpezaSemana | null>(null)
  const [assistencia, setAssistencia] = useState<AssistenciaReuniao[]>([])
  const [proximoDiscurso, setProximoDiscurso] = useState<DiscursoPublico | null>(null)
  const [campoSemana, setCampoSemana] = useState<CampoSemana[]>([])
  const [totalGrupos, setTotalGrupos] = useState(0)
  
  const hoje = new Date()
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 })
  const fimSemana = endOfWeek(hoje, { weekStartsOn: 1 })
  
  useEffect(() => {
    async function carregarDados() {
      try {
        const supabase = createClient()
        
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
          if (semanaAtual) setLimpezaSemana(semanaAtual)
        }
        
        // Carregar assistência recente
        const { data: assistenciaData } = await supabase
          .from("assistencia_reunioes")
          .select("*")
          .order("data", { ascending: false })
          .limit(6)
        if (assistenciaData) setAssistencia(assistenciaData)
        
        // Carregar próximo discurso público
        const { data: discursoData } = await supabase
          .from("discursos_publicos")
          .select("*")
          .gte("data", format(hoje, "yyyy-MM-dd"))
          .order("data", { ascending: true })
          .limit(1)
        if (discursoData && discursoData.length > 0) {
          setProximoDiscurso(discursoData[0])
        }
        
        // Carregar serviço de campo da semana
        const { data: campoData } = await supabase
          .from("servico_campo_semana")
          .select("*")
          .eq("ativo", true)
          .order("dia_semana")
        if (campoData) setCampoSemana(campoData)
        
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [])

  const totalAtivos = publicadores.filter((p) => p.ativo).length
  const totalAnciaos = publicadores.filter((p) => p.anciao && p.ativo).length
  const totalServos = publicadores.filter((p) => p.servo_ministerial && p.ativo).length
  const totalPioneiros = publicadores.filter((p) => p.pioneiro_regular && p.ativo).length
  
  // Média de assistência
  const mediaPresencial = assistencia.length > 0 
    ? Math.round(assistencia.reduce((acc, a) => acc + (a.presencial || 0), 0) / assistencia.length)
    : 0
  const mediaZoom = assistencia.length > 0 
    ? Math.round(assistencia.reduce((acc, a) => acc + (a.zoom || 0), 0) / assistencia.length)
    : 0

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground">
          Visão geral da congregação - {format(hoje, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
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
                  <p className="mt-1 text-xs text-zinc-500">Ativos na congregação</p>
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
                  <p className="text-sm font-medium text-zinc-400">Anciãos</p>
                  <p className="mt-2 text-4xl font-bold text-white">{totalAnciaos}</p>
                  <p className="mt-1 text-xs text-zinc-500">Corpo de anciãos</p>
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
                <p className="text-xs text-zinc-500">Média Presencial</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-600/20 p-2.5">
                <BarChart3 className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{mediaZoom}</p>
                <p className="text-xs text-zinc-500">Média Zoom</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-600/20 p-2.5">
                <BookOpen className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{mediaPresencial + mediaZoom}</p>
                <p className="text-xs text-zinc-500">Média Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terceira seção - Cards de informações da semana */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Equipe Técnica da Semana */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Calendar className="h-5 w-5 text-blue-500" />
                Reuniões da Semana
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
                  Nenhuma designação cadastrada para esta semana
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coluna direita - Limpeza + Próximo Discurso + Campo */}
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

          {/* Próximo Discurso Público */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Mic className="h-5 w-5 text-amber-500" />
                  Próximo Discurso Público
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
                  <p className="mb-1 text-base font-medium text-white">{proximoDiscurso.tema}</p>
                  {proximoDiscurso.orador_nome && (
                    <p className="text-sm text-zinc-400">Orador: {proximoDiscurso.orador_nome}</p>
                  )}
                </div>
              ) : (
                <div className="rounded-lg bg-zinc-800/30 p-4 text-center">
                  <p className="text-sm text-zinc-500">Nenhum discurso programado</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Serviço de Campo Durante a Semana */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="h-5 w-5 text-green-500" />
                  Serviço de Campo
                </CardTitle>
                <Link href="/admin/servico-campo" className="text-xs text-green-400 hover:underline">
                  Ver escala
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {campoSemana.length > 0 ? (
                <div className="space-y-2">
                  {campoSemana.slice(0, 3).map((dia, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
                      <span className="text-sm font-medium capitalize text-zinc-400">{dia.dia_semana}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white">{dia.dirigente_nome}</span>
                        <span className="rounded bg-green-600/20 px-1.5 py-0.5 text-xs text-green-400">
                          {dia.horario}
                        </span>
                      </div>
                    </div>
                  ))}
                  {campoSemana.length > 3 && (
                    <p className="text-center text-xs text-zinc-500">
                      +{campoSemana.length - 3} dias...
                    </p>
                  )}
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
