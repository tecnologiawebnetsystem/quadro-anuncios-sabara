"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Wrench,
  Volume2,
  Users,
  Sparkles
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useSync } from "@/lib/contexts/sync-context"
import { cn } from "@/lib/utils"
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isWithinInterval, addDays, parseISO } from "date-fns"
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

export default function SemanaProgramacaoPage() {
  const [semanaAtual, setSemanaAtual] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [equipeTecnica, setEquipeTecnica] = useState<EquipeTecnica[]>([])
  const [limpeza, setLimpeza] = useState<LimpezaSemana | null>(null)
  
  const { syncTrigger } = useSync()
  const supabase = createClient()
  
  const inicioSemana = startOfWeek(semanaAtual, { weekStartsOn: 1 }) // Segunda
  const fimSemana = endOfWeek(semanaAtual, { weekStartsOn: 1 }) // Domingo
  
  // Calcular datas de quinta e domingo
  const quintaFeira = addDays(inicioSemana, 3) // Segunda + 3 = Quinta
  const domingo = addDays(inicioSemana, 6) // Segunda + 6 = Domingo

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
  
  // Formatar datas para exibicao
  const dataQuinta = format(quintaFeira, "d/MM", { locale: ptBR })
  const dataDomingo = format(domingo, "d/MM", { locale: ptBR })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="h-10 w-64 bg-zinc-800 rounded-full animate-pulse" />
        </div>
        <div className="grid gap-3 grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-zinc-800 bg-zinc-900/50">
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-24 bg-zinc-800 rounded" />
                  <div className="h-6 w-32 bg-zinc-800 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Seletor de Semana - Design compacto */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-full p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={irSemanaAnterior}
            className="h-8 w-8 rounded-full hover:bg-zinc-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <button
            onClick={irSemanaAtual}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              ehSemanaAtual 
                ? "bg-red-600 text-white" 
                : "hover:bg-zinc-800 text-zinc-300"
            )}
          >
            {format(inicioSemana, "d", { locale: ptBR })} — {format(fimSemana, "d 'de' MMM", { locale: ptBR })}
          </button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={irProximaSemana}
            className="h-8 w-8 rounded-full hover:bg-zinc-800"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cards de Designacoes - Grid 2 colunas */}
      <div className="grid gap-3 grid-cols-2">
        
        {/* Card: Indicadores - Quinta */}
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-400 mb-3">
              <Wrench className="h-4 w-4" />
              <span className="text-xs font-medium">Indicadores</span>
            </div>
            <p className="text-lg font-bold text-white mb-1">Quinta-Feira</p>
            <p className="text-sm text-zinc-500 mb-3">{dataQuinta}</p>
            <div className="flex flex-wrap gap-2">
              {equipeQuinta?.indicador1_nome && (
                <Badge className="bg-orange-600/20 text-orange-300 border-orange-600/30 text-xs">
                  {equipeQuinta.indicador1_nome}
                </Badge>
              )}
              {equipeQuinta?.indicador2_nome && (
                <Badge className="bg-orange-600/20 text-orange-300 border-orange-600/30 text-xs">
                  {equipeQuinta.indicador2_nome}
                </Badge>
              )}
              {!equipeQuinta?.indicador1_nome && !equipeQuinta?.indicador2_nome && (
                <span className="text-sm text-zinc-600">—</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card: Indicadores - Domingo */}
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-400 mb-3">
              <Wrench className="h-4 w-4" />
              <span className="text-xs font-medium">Indicadores</span>
            </div>
            <p className="text-lg font-bold text-white mb-1">Domingo</p>
            <p className="text-sm text-zinc-500 mb-3">{dataDomingo}</p>
            <div className="flex flex-wrap gap-2">
              {equipeDomingo?.indicador1_nome && (
                <Badge className="bg-orange-600/20 text-orange-300 border-orange-600/30 text-xs">
                  {equipeDomingo.indicador1_nome}
                </Badge>
              )}
              {equipeDomingo?.indicador2_nome && (
                <Badge className="bg-orange-600/20 text-orange-300 border-orange-600/30 text-xs">
                  {equipeDomingo.indicador2_nome}
                </Badge>
              )}
              {!equipeDomingo?.indicador1_nome && !equipeDomingo?.indicador2_nome && (
                <span className="text-sm text-zinc-600">—</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card: Volantes - Quinta */}
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-400 mb-3">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Volantes</span>
            </div>
            <p className="text-lg font-bold text-white mb-1">Quinta-Feira</p>
            <p className="text-sm text-zinc-500 mb-3">{dataQuinta}</p>
            <div className="flex flex-wrap gap-2">
              {equipeQuinta?.microvolante1_nome && (
                <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30 text-xs">
                  {equipeQuinta.microvolante1_nome}
                </Badge>
              )}
              {equipeQuinta?.microvolante2_nome && (
                <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30 text-xs">
                  {equipeQuinta.microvolante2_nome}
                </Badge>
              )}
              {!equipeQuinta?.microvolante1_nome && !equipeQuinta?.microvolante2_nome && (
                <span className="text-sm text-zinc-600">—</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card: Volantes - Domingo */}
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-400 mb-3">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Volantes</span>
            </div>
            <p className="text-lg font-bold text-white mb-1">Domingo</p>
            <p className="text-sm text-zinc-500 mb-3">{dataDomingo}</p>
            <div className="flex flex-wrap gap-2">
              {equipeDomingo?.microvolante1_nome && (
                <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30 text-xs">
                  {equipeDomingo.microvolante1_nome}
                </Badge>
              )}
              {equipeDomingo?.microvolante2_nome && (
                <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30 text-xs">
                  {equipeDomingo.microvolante2_nome}
                </Badge>
              )}
              {!equipeDomingo?.microvolante1_nome && !equipeDomingo?.microvolante2_nome && (
                <span className="text-sm text-zinc-600">—</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card: Som - Quinta */}
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-3">
              <Volume2 className="h-4 w-4" />
              <span className="text-xs font-medium">Som</span>
            </div>
            <p className="text-lg font-bold text-white mb-1">Quinta-Feira</p>
            <p className="text-sm text-zinc-500 mb-3">{dataQuinta}</p>
            <div className="flex flex-wrap gap-2">
              {equipeQuinta?.som_nome ? (
                <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30 text-xs">
                  {equipeQuinta.som_nome}
                </Badge>
              ) : (
                <span className="text-sm text-zinc-600">—</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card: Som - Domingo */}
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-3">
              <Volume2 className="h-4 w-4" />
              <span className="text-xs font-medium">Som</span>
            </div>
            <p className="text-lg font-bold text-white mb-1">Domingo</p>
            <p className="text-sm text-zinc-500 mb-3">{dataDomingo}</p>
            <div className="flex flex-wrap gap-2">
              {equipeDomingo?.som_nome ? (
                <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30 text-xs">
                  {equipeDomingo.som_nome}
                </Badge>
              ) : (
                <span className="text-sm text-zinc-600">—</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card: Limpeza - Largura total */}
        <Card className="border-zinc-800 bg-zinc-900/80 col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-cyan-400 mb-3">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium">Limpeza da Semana</span>
            </div>
            <p className="text-xl font-bold text-white">
              {limpeza?.grupo_nome || "Não definido"}
            </p>
            {limpeza && (
              <p className="text-sm text-zinc-500 mt-1">
                {format(parseISO(limpeza.data_inicio), "dd/MM", { locale: ptBR })} a {format(parseISO(limpeza.data_fim), "dd/MM", { locale: ptBR })}
              </p>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Mensagem quando não há dados */}
      {equipeTecnica.length === 0 && !limpeza && (
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
