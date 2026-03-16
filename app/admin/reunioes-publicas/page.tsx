"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, ArrowRight, Calendar, Users, Mic, BookOpen, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { SeletorPublicador, type Publicador } from "@/components/reuniao/seletor-publicador"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

// Tipos
interface DesignacaoReuniao {
  id?: string
  data: string
  mes: string
  presidente_id: string | null
  presidente_nome: string
  leitor_sentinela_id: string | null
  leitor_sentinela_nome: string
}

interface DiscursoPublico {
  id?: string
  data: string
  tema: string
  orador_id: string | null
  orador_nome: string | null
  orador_congregacao: string | null
  observacoes: string | null
}

interface AssistenciaReuniao {
  id?: string
  data: string
  mes: string
  dia_semana: string
  presencial: number
  zoom: number
}

const mesesDisponiveis = [
  { value: "2026-01", label: "Janeiro 2026" },
  { value: "2026-02", label: "Fevereiro 2026" },
  { value: "2026-03", label: "Março 2026" },
  { value: "2026-04", label: "Abril 2026" },
  { value: "2026-05", label: "Maio 2026" },
  { value: "2026-06", label: "Junho 2026" },
  { value: "2026-07", label: "Julho 2026" },
  { value: "2026-08", label: "Agosto 2026" },
  { value: "2026-09", label: "Setembro 2026" },
  { value: "2026-10", label: "Outubro 2026" },
  { value: "2026-11", label: "Novembro 2026" },
  { value: "2026-12", label: "Dezembro 2026" },
]

// Gerar domingos ou quintas do mês
function gerarDiasDoMes(ano: number, mes: number, diaSemana: number): string[] {
  const datas: string[] = []
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
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

function formatarDataCurta(dataStr: string): string {
  const data = new Date(dataStr + "T12:00:00")
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

export default function ReunioesPublicasPage() {
  const [activeTab, setActiveTab] = useState("designacoes")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  
  // Estados
  const [designacoes, setDesignacoes] = useState<DesignacaoReuniao[]>([])
  const [discursos, setDiscursos] = useState<DiscursoPublico[]>([])
  const [assistencia, setAssistencia] = useState<AssistenciaReuniao[]>([])
  
  // Estado para navegação de meses
  const [mesAtualIndex, setMesAtualIndex] = useState(2) // Março 2026
  const mesAtual = mesesDisponiveis[mesAtualIndex]

  // Carregar dados quando mês mudar
  useEffect(() => {
    async function carregarDados() {
      setLoading(true)
      try {
        // Carregar designações (presidente e leitor)
        const { data: designacoesData } = await supabase
          .from("reuniao_publica_designacoes")
          .select("*")
          .eq("mes", mesAtual.value)
          .order("data")
        
        if (designacoesData) setDesignacoes(designacoesData)
        
        // Carregar discursos públicos
        const { data: discursosData } = await supabase
          .from("discursos_publicos")
          .select("*")
          .gte("data", `${mesAtual.value}-01`)
          .lte("data", `${mesAtual.value}-31`)
          .order("data")
        
        if (discursosData) setDiscursos(discursosData)
        
        // Carregar assistência
        const { data: assistenciaData } = await supabase
          .from("assistencia_reunioes")
          .select("*")
          .eq("mes", mesAtual.value)
          .order("data")
        
        if (assistenciaData) setAssistencia(assistenciaData)
        
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }
    
    carregarDados()
  }, [mesAtual.value])

  // Salvar designação (presidente e leitor)
  async function salvarDesignacao(
    data: string, 
    campo: "presidente" | "leitor_sentinela", 
    publicador: Publicador | null
  ) {
    const existente = designacoes.find(d => d.data === data)
    
    const dadosBase: Partial<DesignacaoReuniao> = {
      data,
      mes: mesAtual.value,
    }
    
    if (campo === "presidente") {
      dadosBase.presidente_id = publicador?.id || null
      dadosBase.presidente_nome = publicador?.nome || ""
    } else {
      dadosBase.leitor_sentinela_id = publicador?.id || null
      dadosBase.leitor_sentinela_nome = publicador?.nome || ""
    }
    
    try {
      if (existente?.id) {
        const { error } = await supabase
          .from("reuniao_publica_designacoes")
          .update(dadosBase)
          .eq("id", existente.id)
        
        if (error) throw error
        
        setDesignacoes(prev => prev.map(d => d.id === existente.id ? { ...d, ...dadosBase } as DesignacaoReuniao : d))
      } else {
        // Criar novo registro com valores padrão
        const novosDados: DesignacaoReuniao = {
          data,
          mes: mesAtual.value,
          presidente_id: campo === "presidente" ? (publicador?.id || null) : null,
          presidente_nome: campo === "presidente" ? (publicador?.nome || "") : "",
          leitor_sentinela_id: campo === "leitor_sentinela" ? (publicador?.id || null) : null,
          leitor_sentinela_nome: campo === "leitor_sentinela" ? (publicador?.nome || "") : "",
        }
        
        const { data: novoData, error } = await supabase
          .from("reuniao_publica_designacoes")
          .insert(novosDados)
          .select()
          .single()
        
        if (error) throw error
        
        setDesignacoes(prev => [...prev, novoData])
      }
      
      toast.success("Salvo com sucesso")
    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast.error("Erro ao salvar")
    }
  }

  // Salvar discurso público
  async function salvarDiscurso(data: string, campo: string, valor: string | Publicador | null) {
    const existente = discursos.find(d => d.data === data)
    
    const dadosBase: Partial<DiscursoPublico> = { data }
    
    if (campo === "tema") {
      dadosBase.tema = valor as string
    } else if (campo === "orador") {
      const pub = valor as Publicador | null
      dadosBase.orador_id = pub?.id || null
      dadosBase.orador_nome = pub?.nome || null
    } else if (campo === "orador_nome") {
      dadosBase.orador_nome = valor as string
      dadosBase.orador_id = null
    } else if (campo === "orador_congregacao") {
      dadosBase.orador_congregacao = valor as string
    }
    
    try {
      if (existente?.id) {
        const { error } = await supabase
          .from("discursos_publicos")
          .update(dadosBase)
          .eq("id", existente.id)
        
        if (error) throw error
        
        setDiscursos(prev => prev.map(d => d.id === existente.id ? { ...d, ...dadosBase } as DiscursoPublico : d))
      } else {
        const novosDados: DiscursoPublico = {
          data,
          tema: campo === "tema" ? (valor as string) : "",
          orador_id: campo === "orador" ? ((valor as Publicador)?.id || null) : null,
          orador_nome: campo === "orador" ? ((valor as Publicador)?.nome || null) : (campo === "orador_nome" ? (valor as string) : null),
          orador_congregacao: campo === "orador_congregacao" ? (valor as string) : null,
          observacoes: null,
        }
        
        const { data: novoData, error } = await supabase
          .from("discursos_publicos")
          .insert(novosDados)
          .select()
          .single()
        
        if (error) throw error
        
        setDiscursos(prev => [...prev, novoData])
      }
      
      toast.success("Salvo com sucesso")
    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast.error("Erro ao salvar")
    }
  }

  // Salvar assistência
  async function salvarAssistencia(data: string, diaSemana: string, campo: "presencial" | "zoom", valor: number) {
    const existente = assistencia.find(a => a.data === data && a.dia_semana === diaSemana)
    
    const dadosBase: Partial<AssistenciaReuniao> = {
      data,
      mes: mesAtual.value,
      dia_semana: diaSemana,
    }
    
    if (campo === "presencial") {
      dadosBase.presencial = valor
    } else {
      dadosBase.zoom = valor
    }
    
    try {
      if (existente?.id) {
        const { error } = await supabase
          .from("assistencia_reunioes")
          .update(dadosBase)
          .eq("id", existente.id)
        
        if (error) throw error
        
        setAssistencia(prev => prev.map(a => a.id === existente.id ? { ...a, ...dadosBase } as AssistenciaReuniao : a))
      } else {
        const novosDados: AssistenciaReuniao = {
          data,
          mes: mesAtual.value,
          dia_semana: diaSemana,
          presencial: campo === "presencial" ? valor : 0,
          zoom: campo === "zoom" ? valor : 0,
        }
        
        const { data: novoData, error } = await supabase
          .from("assistencia_reunioes")
          .insert(novosDados)
          .select()
          .single()
        
        if (error) throw error
        
        setAssistencia(prev => [...prev, novoData])
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

  // Gerar domingos e quintas do mês atual
  const domingosDoMes = useMemo(() => {
    const [ano, mes] = mesAtual.value.split("-").map(Number)
    return gerarDiasDoMes(ano, mes - 1, 0)
  }, [mesAtual.value])

  const quintasDoMes = useMemo(() => {
    const [ano, mes] = mesAtual.value.split("-").map(Number)
    return gerarDiasDoMes(ano, mes - 1, 4)
  }, [mesAtual.value])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Reuniões Públicas</h1>
        <p className="text-muted-foreground">Gerencie as designações e assistência das reuniões</p>
      </div>

      {/* Navegação de meses */}
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={irParaMesAnterior}
          disabled={mesAtualIndex === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-30 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">{mesAtual.label}</h2>
        </div>
        <button
          onClick={irParaProximoMes}
          disabled={mesAtualIndex === mesesDisponiveis.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-30 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-800/50">
          <TabsTrigger value="designacoes" className="text-xs sm:text-sm">Presidente/Leitor</TabsTrigger>
          <TabsTrigger value="discursos" className="text-xs sm:text-sm">Discursos</TabsTrigger>
          <TabsTrigger value="assistencia" className="text-xs sm:text-sm">Assistência</TabsTrigger>
        </TabsList>

        {/* PRESIDENTE E LEITOR DE SENTINELA */}
        <TabsContent value="designacoes" className="mt-6">
          <Card className="border-0 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Presidente de Conferência / Leitor de A Sentinela
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Cabeçalho */}
                <div className="hidden sm:grid grid-cols-3 gap-4 pb-2 border-b border-zinc-700">
                  <div className="text-sm font-medium text-muted-foreground">Data</div>
                  <div className="text-sm font-medium text-muted-foreground">Presidente de Conferência</div>
                  <div className="text-sm font-medium text-muted-foreground">Leitor de A Sentinela</div>
                </div>
                
                {domingosDoMes.map((data) => {
                  const registro = designacoes.find(d => d.data === data)
                  return (
                    <div key={data} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-lg bg-zinc-800/30">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground sm:hidden" />
                        <span className="font-medium text-foreground">{formatarData(data)}</span>
                        <span className="text-xs text-muted-foreground">Domingo</span>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground sm:hidden mb-1 block">Presidente</label>
                        <SeletorPublicador
                          value={registro?.presidente_id || undefined}
                          onSelect={(p) => salvarDesignacao(data, "presidente", p)}
                          filtro="irmaos"
                          placeholder="Selecionar presidente..."
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground sm:hidden mb-1 block">Leitor</label>
                        <SeletorPublicador
                          value={registro?.leitor_sentinela_id || undefined}
                          onSelect={(p) => salvarDesignacao(data, "leitor_sentinela", p)}
                          filtro="irmaos"
                          placeholder="Selecionar leitor..."
                          className="w-full"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ARRANJO DE DISCURSOS */}
        <TabsContent value="discursos" className="mt-6">
          <Card className="border-0 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-amber-500" />
                Arranjo de Discursos Públicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domingosDoMes.map((data) => {
                  const registro = discursos.find(d => d.data === data)
                  return (
                    <div key={data} className="p-4 rounded-lg bg-zinc-800/30 space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{formatarData(data)}</span>
                        <span className="text-xs text-muted-foreground">Domingo</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Tema do Discurso</label>
                          <Input
                            value={registro?.tema || ""}
                            onChange={(e) => setDiscursos(prev => {
                              const existe = prev.find(d => d.data === data)
                              if (existe) {
                                return prev.map(d => d.data === data ? { ...d, tema: e.target.value } : d)
                              }
                              return [...prev, { data, tema: e.target.value } as DiscursoPublico]
                            })}
                            onBlur={(e) => salvarDiscurso(data, "tema", e.target.value)}
                            placeholder="Digite o tema do discurso..."
                            className="bg-zinc-800/50 border-zinc-700"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Orador (da congregação)</label>
                          <SeletorPublicador
                            value={registro?.orador_id || undefined}
                            onSelect={(p) => salvarDiscurso(data, "orador", p)}
                            filtro="irmaos"
                            placeholder="Selecionar orador..."
                            className="w-full"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Orador Visitante (nome)</label>
                          <Input
                            value={registro?.orador_nome || ""}
                            onChange={(e) => setDiscursos(prev => {
                              const existe = prev.find(d => d.data === data)
                              if (existe) {
                                return prev.map(d => d.data === data ? { ...d, orador_nome: e.target.value, orador_id: null } : d)
                              }
                              return [...prev, { data, orador_nome: e.target.value, tema: "" } as DiscursoPublico]
                            })}
                            onBlur={(e) => salvarDiscurso(data, "orador_nome", e.target.value)}
                            placeholder="Nome do orador visitante..."
                            className="bg-zinc-800/50 border-zinc-700"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Congregação do Visitante</label>
                          <Input
                            value={registro?.orador_congregacao || ""}
                            onChange={(e) => setDiscursos(prev => {
                              const existe = prev.find(d => d.data === data)
                              if (existe) {
                                return prev.map(d => d.data === data ? { ...d, orador_congregacao: e.target.value } : d)
                              }
                              return [...prev, { data, orador_congregacao: e.target.value, tema: "" } as DiscursoPublico]
                            })}
                            onBlur={(e) => salvarDiscurso(data, "orador_congregacao", e.target.value)}
                            placeholder="Congregação..."
                            className="bg-zinc-800/50 border-zinc-700"
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ASSISTÊNCIA ÀS REUNIÕES */}
        <TabsContent value="assistencia" className="mt-6">
          <div className="space-y-6">
            {/* Quinta-feira */}
            <Card className="border-0 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  Assistência às Reuniões - Quinta-feira
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-700">
                        <th className="text-left py-2 px-2 text-sm text-muted-foreground">Tipo</th>
                        {quintasDoMes.map(data => (
                          <th key={data} className="text-center py-2 px-2 text-sm text-muted-foreground">
                            {formatarDataCurta(data)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-800">
                        <td className="py-3 px-2 text-sm font-medium">Presencial</td>
                        {quintasDoMes.map(data => {
                          const registro = assistencia.find(a => a.data === data && a.dia_semana === "quinta")
                          return (
                            <td key={data} className="py-2 px-1">
                              <Input
                                type="number"
                                min="0"
                                value={registro?.presencial || ""}
                                onChange={(e) => setAssistencia(prev => {
                                  const existe = prev.find(a => a.data === data && a.dia_semana === "quinta")
                                  if (existe) {
                                    return prev.map(a => a.data === data && a.dia_semana === "quinta" 
                                      ? { ...a, presencial: parseInt(e.target.value) || 0 } : a)
                                  }
                                  return [...prev, { data, mes: mesAtual.value, dia_semana: "quinta", presencial: parseInt(e.target.value) || 0, zoom: 0 } as AssistenciaReuniao]
                                })}
                                onBlur={(e) => salvarAssistencia(data, "quinta", "presencial", parseInt(e.target.value) || 0)}
                                className="w-16 text-center bg-zinc-800/50 border-zinc-700"
                              />
                            </td>
                          )
                        })}
                      </tr>
                      <tr>
                        <td className="py-3 px-2 text-sm font-medium">Zoom</td>
                        {quintasDoMes.map(data => {
                          const registro = assistencia.find(a => a.data === data && a.dia_semana === "quinta")
                          return (
                            <td key={data} className="py-2 px-1">
                              <Input
                                type="number"
                                min="0"
                                value={registro?.zoom || ""}
                                onChange={(e) => setAssistencia(prev => {
                                  const existe = prev.find(a => a.data === data && a.dia_semana === "quinta")
                                  if (existe) {
                                    return prev.map(a => a.data === data && a.dia_semana === "quinta" 
                                      ? { ...a, zoom: parseInt(e.target.value) || 0 } : a)
                                  }
                                  return [...prev, { data, mes: mesAtual.value, dia_semana: "quinta", presencial: 0, zoom: parseInt(e.target.value) || 0 } as AssistenciaReuniao]
                                })}
                                onBlur={(e) => salvarAssistencia(data, "quinta", "zoom", parseInt(e.target.value) || 0)}
                                className="w-16 text-center bg-zinc-800/50 border-zinc-700"
                              />
                            </td>
                          )
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Domingo */}
            <Card className="border-0 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Assistência às Reuniões - Domingo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-700">
                        <th className="text-left py-2 px-2 text-sm text-muted-foreground">Tipo</th>
                        {domingosDoMes.map(data => (
                          <th key={data} className="text-center py-2 px-2 text-sm text-muted-foreground">
                            {formatarDataCurta(data)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-800">
                        <td className="py-3 px-2 text-sm font-medium">Presencial</td>
                        {domingosDoMes.map(data => {
                          const registro = assistencia.find(a => a.data === data && a.dia_semana === "domingo")
                          return (
                            <td key={data} className="py-2 px-1">
                              <Input
                                type="number"
                                min="0"
                                value={registro?.presencial || ""}
                                onChange={(e) => setAssistencia(prev => {
                                  const existe = prev.find(a => a.data === data && a.dia_semana === "domingo")
                                  if (existe) {
                                    return prev.map(a => a.data === data && a.dia_semana === "domingo" 
                                      ? { ...a, presencial: parseInt(e.target.value) || 0 } : a)
                                  }
                                  return [...prev, { data, mes: mesAtual.value, dia_semana: "domingo", presencial: parseInt(e.target.value) || 0, zoom: 0 } as AssistenciaReuniao]
                                })}
                                onBlur={(e) => salvarAssistencia(data, "domingo", "presencial", parseInt(e.target.value) || 0)}
                                className="w-16 text-center bg-zinc-800/50 border-zinc-700"
                              />
                            </td>
                          )
                        })}
                      </tr>
                      <tr>
                        <td className="py-3 px-2 text-sm font-medium">Zoom</td>
                        {domingosDoMes.map(data => {
                          const registro = assistencia.find(a => a.data === data && a.dia_semana === "domingo")
                          return (
                            <td key={data} className="py-2 px-1">
                              <Input
                                type="number"
                                min="0"
                                value={registro?.zoom || ""}
                                onChange={(e) => setAssistencia(prev => {
                                  const existe = prev.find(a => a.data === data && a.dia_semana === "domingo")
                                  if (existe) {
                                    return prev.map(a => a.data === data && a.dia_semana === "domingo" 
                                      ? { ...a, zoom: parseInt(e.target.value) || 0 } : a)
                                  }
                                  return [...prev, { data, mes: mesAtual.value, dia_semana: "domingo", presencial: 0, zoom: parseInt(e.target.value) || 0 } as AssistenciaReuniao]
                                })}
                                onBlur={(e) => salvarAssistencia(data, "domingo", "zoom", parseInt(e.target.value) || 0)}
                                className="w-16 text-center bg-zinc-800/50 border-zinc-700"
                              />
                            </td>
                          )
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
