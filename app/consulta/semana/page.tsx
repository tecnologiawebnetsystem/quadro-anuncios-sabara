"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Wrench,
  Volume2,
  Users,
  BookOpen,
  Sparkles,
  Mic,
  User
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useSync } from "@/lib/contexts/sync-context"
import { cn } from "@/lib/utils"
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isWithinInterval, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

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

interface DesignacaoReuniao {
  data: string
  presidente_nome: string | null
  leitor_sentinela_nome: string | null
}

interface DiscursoPublico {
  data: string
  tema: string | null
  orador_nome: string | null
}

interface EstudoLivro {
  data: string
  leitor_nome: string | null
  dirigente_nome: string | null
}

export default function SemanaProgramacaoPage() {
  const [semanaAtual, setSemanaAtual] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [equipeTecnica, setEquipeTecnica] = useState<EquipeTecnica[]>([])
  const [limpeza, setLimpeza] = useState<LimpezaSemana | null>(null)
  const [designacaoReuniao, setDesignacaoReuniao] = useState<DesignacaoReuniao | null>(null)
  const [discurso, setDiscurso] = useState<DiscursoPublico | null>(null)
  
  const { syncTrigger } = useSync()
  const supabase = createClient()
  
  const inicioSemana = startOfWeek(semanaAtual, { weekStartsOn: 1 }) // Segunda
  const fimSemana = endOfWeek(semanaAtual, { weekStartsOn: 1 }) // Domingo

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      const dataInicio = format(inicioSemana, "yyyy-MM-dd")
      const dataFim = format(fimSemana, "yyyy-MM-dd")
      
      // Buscar equipe tecnica da semana (quinta e domingo)
      const { data: equipeData } = await supabase
        .from("equipe_tecnica")
        .select("*")
        .gte("data", dataInicio)
        .lte("data", dataFim)
        .order("data")
      
      setEquipeTecnica(equipeData || [])
      
      // Buscar limpeza da semana
      const { data: limpezaData } = await supabase
        .from("limpeza_salao")
        .select("*")
        .lte("data_inicio", dataFim)
        .gte("data_fim", dataInicio)
        .limit(1)
      
      setLimpeza(limpezaData && limpezaData.length > 0 ? limpezaData[0] : null)
      
      // Buscar designacao de reuniao (presidente e leitor do domingo)
      const { data: designacaoData } = await supabase
        .from("designacoes_reuniao")
        .select("*")
        .gte("data", dataInicio)
        .lte("data", dataFim)
        .limit(1)
      
      setDesignacaoReuniao(designacaoData && designacaoData.length > 0 ? designacaoData[0] : null)
      
      // Buscar discurso publico do domingo
      const { data: discursoData } = await supabase
        .from("discursos_publicos")
        .select("*")
        .gte("data", dataInicio)
        .lte("data", dataFim)
        .limit(1)
      
      setDiscurso(discursoData && discursoData.length > 0 ? discursoData[0] : null)
      
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }, [inicioSemana, fimSemana, supabase])

  useEffect(() => {
    carregarDados()
  }, [semanaAtual, syncTrigger, carregarDados])

  const irSemanaAnterior = () => setSemanaAtual(subWeeks(semanaAtual, 1))
  const irProximaSemana = () => setSemanaAtual(addWeeks(semanaAtual, 1))
  const irSemanaAtual = () => setSemanaAtual(new Date())

  // Encontrar equipe de quinta e domingo
  const equipeQuinta = equipeTecnica.find(e => e.dia_semana === "quinta")
  const equipeDomingo = equipeTecnica.find(e => e.dia_semana === "domingo")

  // Verificar se e a semana atual
  const ehSemanaAtual = isWithinInterval(new Date(), { start: inicioSemana, end: fimSemana })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-9 w-9 bg-zinc-800 rounded animate-pulse" />
            <div className="h-9 w-24 bg-zinc-800 rounded animate-pulse" />
            <div className="h-9 w-9 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-5 w-32 bg-zinc-800 rounded" />
                  <div className="h-4 w-24 bg-zinc-800 rounded" />
                  <div className="h-4 w-20 bg-zinc-800 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com seletor de semana */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Programação da Semana</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {format(inicioSemana, "d 'de' MMMM", { locale: ptBR })} — {format(fimSemana, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        
        {/* Navegacao de semanas */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={irSemanaAnterior}
            className="border-zinc-700 hover:bg-zinc-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant={ehSemanaAtual ? "default" : "outline"}
            onClick={irSemanaAtual}
            className={cn(
              "min-w-[100px]",
              ehSemanaAtual 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "border-zinc-700 hover:bg-zinc-800"
            )}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Hoje
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={irProximaSemana}
            className="border-zinc-700 hover:bg-zinc-800"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {ehSemanaAtual && (
        <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
          Semana Atual
        </Badge>
      )}

      {/* Cards de Designacoes */}
      <div className="grid gap-4 sm:grid-cols-2">
        
        {/* Card: Indicadores */}
        <Card className="border-zinc-800 bg-gradient-to-br from-orange-600/10 to-orange-900/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="p-1.5 rounded-lg bg-orange-600">
                <Wrench className="h-4 w-4 text-white" />
              </div>
              Indicadores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quinta */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Quinta-feira</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-zinc-800/50 p-2">
                  <p className="text-[10px] text-zinc-500 mb-0.5">Indicador 1</p>
                  <p className="text-sm font-medium text-white truncate">
                    {equipeQuinta?.indicador1_nome || "—"}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-800/50 p-2">
                  <p className="text-[10px] text-zinc-500 mb-0.5">Indicador 2</p>
                  <p className="text-sm font-medium text-white truncate">
                    {equipeQuinta?.indicador2_nome || "—"}
                  </p>
                </div>
              </div>
            </div>
            {/* Domingo */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Domingo</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-zinc-800/50 p-2">
                  <p className="text-[10px] text-zinc-500 mb-0.5">Indicador 1</p>
                  <p className="text-sm font-medium text-white truncate">
                    {equipeDomingo?.indicador1_nome || "—"}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-800/50 p-2">
                  <p className="text-[10px] text-zinc-500 mb-0.5">Indicador 2</p>
                  <p className="text-sm font-medium text-white truncate">
                    {equipeDomingo?.indicador2_nome || "—"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Volantes (Microfonistas) */}
        <Card className="border-zinc-800 bg-gradient-to-br from-blue-600/10 to-blue-900/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="p-1.5 rounded-lg bg-blue-600">
                <Users className="h-4 w-4 text-white" />
              </div>
              Volantes (Microfone)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quinta */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Quinta-feira</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-zinc-800/50 p-2">
                  <p className="text-[10px] text-zinc-500 mb-0.5">Volante 1</p>
                  <p className="text-sm font-medium text-white truncate">
                    {equipeQuinta?.microvolante1_nome || "—"}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-800/50 p-2">
                  <p className="text-[10px] text-zinc-500 mb-0.5">Volante 2</p>
                  <p className="text-sm font-medium text-white truncate">
                    {equipeQuinta?.microvolante2_nome || "—"}
                  </p>
                </div>
              </div>
            </div>
            {/* Domingo */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Domingo</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-zinc-800/50 p-2">
                  <p className="text-[10px] text-zinc-500 mb-0.5">Volante 1</p>
                  <p className="text-sm font-medium text-white truncate">
                    {equipeDomingo?.microvolante1_nome || "—"}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-800/50 p-2">
                  <p className="text-[10px] text-zinc-500 mb-0.5">Volante 2</p>
                  <p className="text-sm font-medium text-white truncate">
                    {equipeDomingo?.microvolante2_nome || "—"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Som */}
        <Card className="border-zinc-800 bg-gradient-to-br from-purple-600/10 to-purple-900/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="p-1.5 rounded-lg bg-purple-600">
                <Volume2 className="h-4 w-4 text-white" />
              </div>
              Operador de Som
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-zinc-800/50 p-3">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Quinta-feira</p>
                <p className="text-base font-semibold text-white">
                  {equipeQuinta?.som_nome || "—"}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-3">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Domingo</p>
                <p className="text-base font-semibold text-white">
                  {equipeDomingo?.som_nome || "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Leitores */}
        <Card className="border-zinc-800 bg-gradient-to-br from-emerald-600/10 to-emerald-900/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="p-1.5 rounded-lg bg-emerald-600">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              Leitores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-lg bg-zinc-800/50 p-3">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Leitor Sentinela (Domingo)</p>
                <p className="text-base font-semibold text-white">
                  {designacaoReuniao?.leitor_sentinela_nome || "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Limpeza */}
        <Card className="border-zinc-800 bg-gradient-to-br from-cyan-600/10 to-cyan-900/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="p-1.5 rounded-lg bg-cyan-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              Limpeza do Salão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-zinc-800/50 p-3">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Grupo Responsável</p>
              <p className="text-lg font-semibold text-white">
                {limpeza?.grupo_nome || "Não definido"}
              </p>
              {limpeza && (
                <p className="text-xs text-zinc-500 mt-1">
                  {format(parseISO(limpeza.data_inicio), "dd/MM", { locale: ptBR })} — {format(parseISO(limpeza.data_fim), "dd/MM", { locale: ptBR })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card: Presidente */}
        <Card className="border-zinc-800 bg-gradient-to-br from-amber-600/10 to-amber-900/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="p-1.5 rounded-lg bg-amber-600">
                <User className="h-4 w-4 text-white" />
              </div>
              Presidente (Domingo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-zinc-800/50 p-3">
              <p className="text-lg font-semibold text-white">
                {designacaoReuniao?.presidente_nome || "—"}
              </p>
              {discurso && discurso.tema && (
                <div className="mt-3 pt-3 border-t border-zinc-700">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Discurso</p>
                  <p className="text-sm text-zinc-300">{discurso.tema}</p>
                  {discurso.orador_nome && (
                    <p className="text-xs text-zinc-500 mt-1">Orador: {discurso.orador_nome}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Mensagem quando não há dados */}
      {equipeTecnica.length === 0 && !limpeza && !designacaoReuniao && (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="py-8 text-center">
            <Calendar className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400">Nenhuma programação cadastrada para esta semana.</p>
            <p className="text-sm text-zinc-600 mt-1">As informações serão exibidas quando forem adicionadas pelo administrador.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
