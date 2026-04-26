"use client"

import { useState, useEffect, useMemo } from "react"
import { CenteredLoader } from "@/components/ui/page-loader"
import { ArrowLeft, ArrowRight, Calendar, Clock, Mail, Sun, MapPin, Plus, Trash2, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SeletorPublicador, type Publicador } from "@/components/reuniao/seletor-publicador"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

// Tipos
interface CampoSemana {
  id?: string
  data: string
  mes: string
  dia_semana: string
  dirigente_id: string | null
  dirigente_nome: string
  periodo: string
  horario: string
  ativo: boolean
}

interface CampoCartas {
  id?: string
  data: string
  mes: string
  dia_semana: string
  descricao: string
  responsavel_id: string | null
  responsavel_nome: string
  periodo: string
  horario: string
  ativo: boolean
}

interface CampoSabado {
  id?: string
  data: string
  mes: string
  periodo: string
  horario: string
  dirigente_id: string | null
  dirigente_nome: string
}

interface CampoDomingo {
  id?: string
  data: string
  mes: string
  horario: string
  dirigente_id: string | null
  dirigente_nome: string | null
  tipo: "individual" | "grupo" | "salao"
}

const diasSemana = [
  { value: "segunda", label: "Segunda-feira" },
  { value: "terca", label: "Terça-feira" },
  { value: "quarta", label: "Quarta-feira" },
  { value: "quinta", label: "Quinta-feira" },
  { value: "sexta", label: "Sexta-feira" },
]

const periodos = [
  { value: "manha", label: "Manhã" },
  { value: "tarde", label: "Tarde" },
]

const mesesDisponiveis = [
  { value: "2026-01", label: "Janeiro 2026" },
  { value: "2026-02", label: "Fevereiro 2026" },
  { value: "2026-03", label: "Março 2026" },
  { value: "2026-04", label: "Abril 2026" },
  { value: "2026-05", label: "Maio 2026" },
  { value: "2026-06", label: "Junho 2026" },
]

// Gerar sábados ou domingos do mês
function gerarDiasDoMes(ano: number, mes: number, diaSemana: number): string[] {
  const datas: string[] = []
  const primeiroDia = new Date(ano, mes, 1)
  const ultimoDia = new Date(ano, mes + 1, 0)
  
  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    const data = new Date(ano, mes, dia)
    if (data.getDay() === diaSemana) {
      datas.push(data.toISOString().split("T")[0])
    }
  }
  
  return datas
}

function formatarData(dataStr: string): string {
  const data = new Date(dataStr + "T12:00:00")
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

export default function ServicoCampoPage() {
  const [activeTab, setActiveTab] = useState("semana")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  
  // Estados para cada seção
  const [campoSemana, setCampoSemana] = useState<CampoSemana[]>([])
  const [campoCartas, setCampoCartas] = useState<CampoCartas[]>([])
  const [campoSabado, setCampoSabado] = useState<CampoSabado[]>([])
  const [campoDomingo, setCampoDomingo] = useState<CampoDomingo[]>([])
  
  // Estado para navegação de meses (Sábados e Domingos)
  const [mesAtualIndex, setMesAtualIndex] = useState(2) // Março 2026
  const mesAtual = mesesDisponiveis[mesAtualIndex]
  
  // Estado para navegação de meses no arranjo de cartas
  const [mesCartasIndex, setMesCartasIndex] = useState(2) // Março 2026
  const mesCartas = mesesDisponiveis[mesCartasIndex]
  
  // Estado para navegação de meses no Durante a Semana
  const [mesSemanaIndex, setMesSemanaIndex] = useState(2) // Março 2026
  const mesSemana = mesesDisponiveis[mesSemanaIndex]

  // Carregar dados
  useEffect(() => {
    async function carregarDados() {
      setLoading(true)
      try {
        // Carregar campo durante a semana (inicial)
        const { data: semanaData } = await supabase
          .from("servico_campo_semana")
          .select("*")
          .eq("mes", mesesDisponiveis[2].value)
          .order("dia_semana")
        
        if (semanaData) setCampoSemana(semanaData)
        
        // Carregar arranjo de cartas (inicial)
        const { data: cartasData } = await supabase
          .from("servico_campo_cartas")
          .select("*")
          .eq("mes", mesesDisponiveis[2].value)
          .order("data")
        
        if (cartasData) setCampoCartas(cartasData)
        
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }
    
    carregarDados()
  }, [])
  
  // Carregar dados de sábado e domingo quando mês mudar
  useEffect(() => {
    async function carregarDadosMes() {
      try {
        // Carregar sábados
        const { data: sabadoData } = await supabase
          .from("servico_campo_sabado")
          .select("*")
          .eq("mes", mesAtual.value)
          .order("data")
        
        if (sabadoData) setCampoSabado(sabadoData)
        
        // Carregar domingos
        const { data: domingoData } = await supabase
          .from("servico_campo_domingo")
          .select("*")
          .eq("mes", mesAtual.value)
          .order("data")
        
        if (domingoData) setCampoDomingo(domingoData)
        
      } catch (error) {
        console.error("Erro ao carregar dados do mês:", error)
      }
    }
    
    carregarDadosMes()
  }, [mesAtual.value])
  
  // Carregar arranjo de cartas quando mês mudar
  useEffect(() => {
    async function carregarCartasMes() {
      try {
        const { data: cartasData } = await supabase
          .from("servico_campo_cartas")
          .select("*")
          .eq("mes", mesCartas.value)
          .order("data")
        
        if (cartasData) setCampoCartas(cartasData)
      } catch (error) {
        console.error("Erro ao carregar cartas:", error)
      }
    }
    
    carregarCartasMes()
  }, [mesCartas.value])
  
  // Carregar Durante a Semana quando mês mudar
  useEffect(() => {
    async function carregarSemanaMes() {
      try {
        const { data: semanaData } = await supabase
          .from("servico_campo_semana")
          .select("*")
          .eq("mes", mesSemana.value)
          .order("dia_semana")
        
        if (semanaData) setCampoSemana(semanaData)
      } catch (error) {
        console.error("Erro ao carregar semana:", error)
      }
    }
    
    carregarSemanaMes()
  }, [mesSemana.value])

  // Salvar campo durante a semana
  async function salvarCampoSemana(dia: string, publicador: Publicador | null, periodo: string, horario: string) {
    const existente = campoSemana.find(c => c.dia_semana === dia && c.mes === mesSemana.value)
    
    const dados: CampoSemana = {
      data: "", // Não usado, apenas para compatibilidade
      mes: mesSemana.value,
      dia_semana: dia,
      dirigente_id: publicador?.id || null,
      dirigente_nome: publicador?.nome || "",
      periodo,
      horario,
      ativo: true,
    }
    
    try {
      if (existente?.id) {
        const { error } = await supabase
          .from("servico_campo_semana")
          .update(dados)
          .eq("id", existente.id)
        
        if (error) throw error
        
        setCampoSemana(prev => prev.map(c => c.id === existente.id ? { ...c, ...dados } : c))
      } else {
        const { data, error } = await supabase
          .from("servico_campo_semana")
          .insert(dados)
          .select()
          .single()
        
        if (error) throw error
        
        setCampoSemana(prev => [...prev, data])
      }
      
      toast.success("Salvo com sucesso")
    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast.error("Erro ao salvar")
    }
  }

  // Salvar arranjo de cartas por semana
  async function salvarCartas(data: string, publicador: Publicador | null, horario?: string) {
    const existente = campoCartas.find(c => c.data === data)
    const horarioFinal = horario || existente?.horario || "17:00"
    
    const dados: Partial<CampoCartas> = {
      data,
      mes: mesCartas.value,
      dia_semana: "segunda", // Fixo para segunda-feira
      descricao: "Cartas",
      periodo: "tarde",
      horario: horarioFinal,
      responsavel_id: publicador?.id || null,
      responsavel_nome: publicador?.nome || "",
      ativo: true,
    }
    
    try {
      if (existente?.id) {
        const { error } = await supabase
          .from("servico_campo_cartas")
          .update(dados)
          .eq("id", existente.id)
        
        if (error) throw error
        
        setCampoCartas(prev => prev.map(c => c.id === existente.id ? { ...c, ...dados } as CampoCartas : c))
      } else {
        const { data: novoData, error } = await supabase
          .from("servico_campo_cartas")
          .insert(dados as CampoCartas)
          .select()
          .single()
        
        if (error) throw error
        
        setCampoCartas(prev => [...prev, novoData])
      }
      
      toast.success("Salvo com sucesso")
    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast.error("Erro ao salvar")
    }
  }

  // Salvar dirigente de sábado
  async function salvarSabado(data: string, periodo: string, publicador: Publicador | null, horario?: string) {
    const existente = campoSabado.find(c => c.data === data && c.periodo === periodo)
    const horarioFinal = horario || existente?.horario || (periodo === "manha" ? "8:45" : "16:45")
    
    const dados: Partial<CampoSabado> = {
      data,
      mes: mesAtual.value,
      periodo,
      horario: horarioFinal,
      dirigente_id: publicador?.id || null,
      dirigente_nome: publicador?.nome || "",
    }
    
    try {
      if (existente?.id) {
        const { error } = await supabase
          .from("servico_campo_sabado")
          .update(dados)
          .eq("id", existente.id)
        
        if (error) throw error
        
        setCampoSabado(prev => prev.map(c => c.id === existente.id ? { ...c, ...dados } as CampoSabado : c))
      } else {
        const { data: novoData, error } = await supabase
          .from("servico_campo_sabado")
          .insert(dados as CampoSabado)
          .select()
          .single()
        
        if (error) throw error
        
        setCampoSabado(prev => [...prev, novoData])
      }
      
      toast.success("Salvo com sucesso")
    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast.error("Erro ao salvar")
    }
  }

  // Salvar dirigente de domingo
  async function salvarDomingo(data: string, publicador: Publicador | null, tipo: "individual" | "grupo" | "salao", horario?: string) {
    const existente = campoDomingo.find(c => c.data === data)
    const horarioFinal = horario || existente?.horario || "8:45"
    
    const dados: Partial<CampoDomingo> = {
      data,
      mes: mesAtual.value,
      horario: horarioFinal,
      dirigente_id: tipo === "grupo" ? null : (publicador?.id || null),
      dirigente_nome: tipo === "grupo" ? "GRUPO" : (publicador?.nome || null),
      tipo,
    }
    
    try {
      if (existente?.id) {
        const { error } = await supabase
          .from("servico_campo_domingo")
          .update(dados)
          .eq("id", existente.id)
        
        if (error) throw error
        
        setCampoDomingo(prev => prev.map(c => c.id === existente.id ? { ...c, ...dados } as CampoDomingo : c))
      } else {
        const { data: novoData, error } = await supabase
          .from("servico_campo_domingo")
          .insert(dados as CampoDomingo)
          .select()
          .single()
        
        if (error) throw error
        
        setCampoDomingo(prev => [...prev, novoData])
      }
      
      toast.success("Salvo com sucesso")
    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast.error("Erro ao salvar")
    }
  }

  // Navegação de meses
  const irParaMesAnterior = () => {
    if (mesAtualIndex > 0) setMesAtualIndex(mesAtualIndex - 1)
  }
  
  const irParaProximoMes = () => {
    if (mesAtualIndex < mesesDisponiveis.length - 1) setMesAtualIndex(mesAtualIndex + 1)
  }
  
  // Navegação de meses para cartas
  const irParaMesAnteriorCartas = () => {
    if (mesCartasIndex > 0) setMesCartasIndex(mesCartasIndex - 1)
  }
  
  const irParaProximoMesCartas = () => {
    if (mesCartasIndex < mesesDisponiveis.length - 1) setMesCartasIndex(mesCartasIndex + 1)
  }
  
  // Navegação de meses para Durante a Semana
  const irParaMesAnteriorSemana = () => {
    if (mesSemanaIndex > 0) setMesSemanaIndex(mesSemanaIndex - 1)
  }
  
  const irParaProximoMesSemana = () => {
    if (mesSemanaIndex < mesesDisponiveis.length - 1) setMesSemanaIndex(mesSemanaIndex + 1)
  }

  // Gerar sábados e domingos do mês atual
  const sabadosDoMes = useMemo(() => {
    const [ano, mes] = mesAtual.value.split("-").map(Number)
    return gerarDiasDoMes(ano, mes - 1, 6)
  }, [mesAtual.value])

  const domingosDoMes = useMemo(() => {
    const [ano, mes] = mesAtual.value.split("-").map(Number)
    return gerarDiasDoMes(ano, mes - 1, 0)
  }, [mesAtual.value])

  // Gerar segundas-feiras do mês para arranjo de cartas
  const segundasDoMes = useMemo(() => {
    const [ano, mes] = mesCartas.value.split("-").map(Number)
    return gerarDiasDoMes(ano, mes - 1, 1) // 1 = segunda-feira
  }, [mesCartas.value])

  // Segundo domingo do mês (índice 1 no array)
  const segundoDomingo = domingosDoMes[1] ?? null

  if (loading) return <CenteredLoader />

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Serviço de Campo</h1>
        <p className="text-muted-foreground">Gerencie as designações do ministério de campo</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-zinc-800/50">
          <TabsTrigger value="semana" className="text-xs sm:text-sm">Durante a Semana</TabsTrigger>
          <TabsTrigger value="cartas" className="text-xs sm:text-sm">Arranjo de Cartas</TabsTrigger>
          <TabsTrigger value="sabado" className="text-xs sm:text-sm">Sábados</TabsTrigger>
          <TabsTrigger value="domingo" className="text-xs sm:text-sm">Domingos</TabsTrigger>
        </TabsList>

        {/* PROGRAMA DURANTE A SEMANA */}
        <TabsContent value="semana" className="mt-6">
          <div className="space-y-6">
            {/* Navegação de meses */}
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={irParaMesAnteriorSemana}
                disabled={mesSemanaIndex === 0}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-30 dark:border-blue-800 dark:bg-blue-950 dark:hover:bg-blue-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <span className="text-lg font-medium min-w-[150px] text-center">{mesSemana.label}</span>
              <button
                onClick={irParaProximoMesSemana}
                disabled={mesSemanaIndex === mesesDisponiveis.length - 1}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-30 dark:border-blue-800 dark:bg-blue-950 dark:hover:bg-blue-900"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <Card className="border-0 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Programa de Ministério de Campo Durante a Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
              <div className="space-y-4">
                {diasSemana.map((dia) => {
                  const registro = campoSemana.find(c => c.dia_semana === dia.value)
                  return (
                    <div key={dia.value} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg bg-zinc-800/30">
                      <div className="w-32 font-medium text-foreground">{dia.label}</div>
                      <div className="flex-1">
                        <SeletorPublicador
                          value={registro?.dirigente_id || undefined}
                          onSelect={(p) => salvarCampoSemana(
                            dia.value, 
                            p, 
                            registro?.periodo || "manha",
                            registro?.horario || "8:45"
                          )}
                          filtro="todos"
                          placeholder="Selecionar dirigente..."
                          className="w-full"
                        />
                      </div>
                      <Select
                        value={registro?.periodo || "manha"}
                        onValueChange={(value) => salvarCampoSemana(
                          dia.value,
                          registro?.dirigente_id ? { id: registro.dirigente_id, nome: registro.dirigente_nome } as Publicador : null,
                          value,
                          registro?.horario || "8:45"
                        )}
                      >
                        <SelectTrigger className="w-28 bg-zinc-800/50 border-zinc-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manha">Manhã</SelectItem>
                          <SelectItem value="tarde">Tarde</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          value={registro?.horario || "8:45"}
                          onChange={(e) => {
                            const novoHorario = e.target.value
                            setCampoSemana(prev => prev.map(c => 
                              c.dia_semana === dia.value ? { ...c, horario: novoHorario } : c
                            ))
                          }}
                          onBlur={(e) => salvarCampoSemana(
                            dia.value,
                            registro?.dirigente_id ? { id: registro.dirigente_id, nome: registro.dirigente_nome } as Publicador : null,
                            registro?.periodo || "manha",
                            e.target.value
                          )}
                          placeholder="8:45"
                          className="w-20 bg-zinc-800/50 border-zinc-700 text-center text-sm"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ARRANJO DE CARTAS */}
        <TabsContent value="cartas" className="mt-6">
          <div className="space-y-6">
            {/* Navegação de meses */}
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={irParaMesAnteriorCartas}
                disabled={mesCartasIndex === 0}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600 transition-all hover:bg-amber-100 disabled:opacity-30 dark:border-amber-800 dark:bg-amber-950 dark:hover:bg-amber-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <span className="text-lg font-medium min-w-[150px] text-center">{mesCartas.label}</span>
              <button
                onClick={irParaProximoMesCartas}
                disabled={mesCartasIndex === mesesDisponiveis.length - 1}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600 transition-all hover:bg-amber-100 disabled:opacity-30 dark:border-amber-800 dark:bg-amber-950 dark:hover:bg-amber-900"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <Card className="border-0 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-amber-500" />
                  Arranjo de Cartas - Segundas-feiras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {segundasDoMes.map((data) => {
                    const registro = campoCartas.find(c => c.data === data)
                    return (
                      <div key={data} className="p-3 rounded-lg bg-zinc-800/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{formatarData(data)}</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <Input
                              value={registro?.horario || "17:00"}
                              onChange={(e) => {
                                setCampoCartas(prev => prev.map(c => 
                                  c.data === data ? { ...c, horario: e.target.value } : c
                                ))
                              }}
                              onBlur={(e) => {
                                if (registro) {
                                  salvarCartas(data, registro.responsavel_id ? { id: registro.responsavel_id, nome: registro.responsavel_nome } as Publicador : null, e.target.value)
                                }
                              }}
                              className="w-16 h-7 text-xs bg-zinc-800/50 border-zinc-700 text-center"
                            />
                          </div>
                        </div>
                        <SeletorPublicador
                          value={registro?.responsavel_id || undefined}
                          onSelect={(p) => salvarCartas(data, p, registro?.horario || "17:00")}
                          filtro="todos"
                          placeholder="Responsável..."
                          className="w-full"
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* DIRIGENTES DE SÁBADO */}
        <TabsContent value="sabado" className="mt-6">
          <div className="space-y-6">
            {/* Navegação de meses */}
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={irParaMesAnterior}
                disabled={mesAtualIndex === 0}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-30 dark:border-blue-800 dark:bg-blue-950 dark:hover:bg-blue-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <span className="text-lg font-medium min-w-[150px] text-center">{mesAtual.label}</span>
              <button
                onClick={irParaProximoMes}
                disabled={mesAtualIndex === mesesDisponiveis.length - 1}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-30 dark:border-blue-800 dark:bg-blue-950 dark:hover:bg-blue-900"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Sábados Manhã */}
            <Card className="border-0 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-orange-500" />
                  Dirigentes de Campo aos Sábados - Manhã
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {sabadosDoMes.map((data) => {
                    const registro = campoSabado.find(c => c.data === data && c.periodo === "manha")
                    return (
                      <div key={`manha-${data}`} className="p-3 rounded-lg bg-zinc-800/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{formatarData(data)}</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <Input
                              value={registro?.horario || "8:45"}
                              onChange={(e) => {
                                setCampoSabado(prev => prev.map(c => 
                                  c.data === data && c.periodo === "manha" ? { ...c, horario: e.target.value } : c
                                ))
                              }}
                              onBlur={(e) => {
                                if (registro) {
                                  salvarSabado(data, "manha", registro.dirigente_id ? { id: registro.dirigente_id, nome: registro.dirigente_nome } as Publicador : null, e.target.value)
                                }
                              }}
                              className="w-16 h-7 text-xs bg-zinc-800/50 border-zinc-700 text-center"
                            />
                          </div>
                        </div>
                        <SeletorPublicador
                          value={registro?.dirigente_id || undefined}
                          onSelect={(p) => salvarSabado(data, "manha", p, registro?.horario || "8:45")}
                          filtro="todos"
                          placeholder="Dirigente..."
                          className="w-full"
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Sábados Tarde */}
            <Card className="border-0 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-purple-500" />
                  Dirigentes de Campo aos Sábados - Tarde
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {sabadosDoMes.map((data) => {
                    const registro = campoSabado.find(c => c.data === data && c.periodo === "tarde")
                    return (
                      <div key={`tarde-${data}`} className="p-3 rounded-lg bg-zinc-800/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{formatarData(data)}</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <Input
                              value={registro?.horario || "16:45"}
                              onChange={(e) => {
                                setCampoSabado(prev => prev.map(c => 
                                  c.data === data && c.periodo === "tarde" ? { ...c, horario: e.target.value } : c
                                ))
                              }}
                              onBlur={(e) => {
                                if (registro) {
                                  salvarSabado(data, "tarde", registro.dirigente_id ? { id: registro.dirigente_id, nome: registro.dirigente_nome } as Publicador : null, e.target.value)
                                }
                              }}
                              className="w-16 h-7 text-xs bg-zinc-800/50 border-zinc-700 text-center"
                            />
                          </div>
                        </div>
                        <SeletorPublicador
                          value={registro?.dirigente_id || undefined}
                          onSelect={(p) => salvarSabado(data, "tarde", p, registro?.horario || "16:45")}
                          filtro="todos"
                          placeholder="Dirigente..."
                          className="w-full"
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* DIRIGENTES DE DOMINGO */}
        <TabsContent value="domingo" className="mt-6">
          <div className="space-y-6">
            {/* Navegação de meses */}
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={irParaMesAnterior}
                disabled={mesAtualIndex === 0}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-600 transition-all hover:bg-green-100 disabled:opacity-30 dark:border-green-800 dark:bg-green-950 dark:hover:bg-green-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <span className="text-lg font-medium min-w-[150px] text-center">{mesAtual.label}</span>
              <button
                onClick={irParaProximoMes}
                disabled={mesAtualIndex === mesesDisponiveis.length - 1}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-600 transition-all hover:bg-green-100 disabled:opacity-30 dark:border-green-800 dark:bg-green-950 dark:hover:bg-green-900"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <Card className="border-0 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-500" />
                  Dirigentes de Campo aos Domingos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {domingosDoMes.map((data) => {
                    const registro = campoDomingo.find(c => c.data === data)
                    const tipo = registro?.tipo ?? "individual"
                    const isSegundoDomingo = data === segundoDomingo
                    return (
                      <div key={data} className="p-3 rounded-lg bg-zinc-800/30 space-y-2">
                        {/* Cabeçalho: data + horário */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-foreground">{formatarData(data)}</span>
                            {isSegundoDomingo && (
                              <span className="text-[10px] bg-blue-600/20 text-blue-400 rounded px-1 py-0.5 leading-none">2º Dom.</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <Input
                              value={registro?.horario || "8:45"}
                              onChange={(e) => {
                                setCampoDomingo(prev => prev.map(c =>
                                  c.data === data ? { ...c, horario: e.target.value } : c
                                ))
                              }}
                              onBlur={(e) => {
                                salvarDomingo(
                                  data,
                                  registro?.dirigente_id ? { id: registro.dirigente_id, nome: registro.dirigente_nome || "" } as Publicador : null,
                                  tipo,
                                  e.target.value
                                )
                              }}
                              className="w-16 h-7 text-xs bg-zinc-800/50 border-zinc-700 text-center"
                            />
                          </div>
                        </div>

                        {/* Botões de tipo */}
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant={tipo === "grupo" ? "default" : "outline"}
                            className={tipo === "grupo" ? "bg-green-600 hover:bg-green-700 h-7 text-xs flex-1" : "h-7 text-xs flex-1 border-zinc-600"}
                            onClick={() => salvarDomingo(data, null, "grupo", registro?.horario || "8:45")}
                          >
                            <Users className="h-3 w-3 mr-1" />
                            Grupo
                          </Button>
                          <Button
                            size="sm"
                            variant={tipo === "salao" ? "default" : "outline"}
                            className={tipo === "salao" ? "bg-blue-600 hover:bg-blue-700 h-7 text-xs flex-1" : "h-7 text-xs flex-1 border-zinc-600"}
                            onClick={() => salvarDomingo(data, null, "salao", registro?.horario || "8:45")}
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            Salão
                          </Button>
                        </div>

                        {/* Seletor de dirigente (individual ou salão) */}
                        {(tipo === "individual" || tipo === "salao") && (
                          <SeletorPublicador
                            value={registro?.dirigente_id || undefined}
                            onSelect={(p) => salvarDomingo(data, p, tipo, registro?.horario || "8:45")}
                            filtro="todos"
                            placeholder="Dirigente..."
                            className="w-full"
                          />
                        )}
                        {tipo === "grupo" && (
                          <div className="text-center py-1.5 text-xs text-green-400 font-semibold uppercase tracking-wide">
                            Saída em grupo
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
