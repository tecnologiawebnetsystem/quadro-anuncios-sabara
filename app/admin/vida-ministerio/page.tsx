"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Trash2, 
  Save, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Music,
  Users,
  Gem,
  MessageSquare,
  Heart,
  Wand2,
  Loader2,
  Sparkles
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const meses = [
  { valor: 1, nome: "Janeiro" },
  { valor: 2, nome: "Fevereiro" },
  { valor: 3, nome: "Março" },
  { valor: 4, nome: "Abril" },
  { valor: 5, nome: "Maio" },
  { valor: 6, nome: "Junho" },
  { valor: 7, nome: "Julho" },
  { valor: 8, nome: "Agosto" },
  { valor: 9, nome: "Setembro" },
  { valor: 10, nome: "Outubro" },
  { valor: 11, nome: "Novembro" },
  { valor: 12, nome: "Dezembro" },
]

const secoes = [
  { id: "tesouros", nome: "Tesouros da Palavra de Deus", cor: "text-amber-500", icon: Gem },
  { id: "ministerio", nome: "Faça Seu Melhor no Ministério", cor: "text-yellow-500", icon: MessageSquare },
  { id: "vida", nome: "Nossa Vida Cristã", cor: "text-red-500", icon: Heart },
]

interface Mes {
  id: string
  mes: number
  ano: number
  cor_tema: string
}

interface Semana {
  id: string
  mes_id: string
  data_inicio: string
  data_fim: string
  leitura_semanal: string
  cantico_inicial: number | null
  cantico_inicial_nome: string | null
  cantico_meio: number | null
  cantico_meio_nome: string | null
  cantico_final: number | null
  cantico_final_nome: string | null
}

interface Parte {
  id: string
  semana_id: string
  secao: string
  titulo: string
  tempo: string | null
  participante_id: string | null
  participante_nome: string | null
  ajudante_id: string | null
  ajudante_nome: string | null
  sala: string
  ordem: number
}

interface Publicador {
  id: string
  nome: string
}

export default function AdminVidaMinisterioPage() {
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [mesData, setMesData] = useState<Mes | null>(null)
  const [semanas, setSemanas] = useState<Semana[]>([])
  const [partes, setPartes] = useState<Parte[]>([])
  const [publicadores, setPublicadores] = useState<Publicador[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [semanaAtiva, setSemanaAtiva] = useState<string | null>(null)
  const [sugestoes, setSugestoes] = useState<Record<string, { id: string; nome: string; motivo: string }[]>>({})
  const [buscandoSugestao, setBuscandoSugestao] = useState<string | null>(null)

  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      // Carregar publicadores
      const { data: pubs } = await supabase
        .from("publicadores")
        .select("id, nome")
        .order("nome")
      setPublicadores(pubs || [])

      // Carregar ou criar mês
      let { data: mes } = await supabase
        .from("vida_ministerio_meses")
        .select("*")
        .eq("mes", mesAtual)
        .eq("ano", anoAtual)
        .single()

      if (!mes) {
        const { data: novoMes } = await supabase
          .from("vida_ministerio_meses")
          .insert({ mes: mesAtual, ano: anoAtual })
          .select()
          .single()
        mes = novoMes
      }

      setMesData(mes)

      if (mes) {
        // Carregar semanas do mês
        const { data: semanasData } = await supabase
          .from("vida_ministerio_semanas")
          .select("*")
          .eq("mes_id", mes.id)
          .order("data_inicio")
        
        setSemanas(semanasData || [])
        
        if (semanasData && semanasData.length > 0) {
          setSemanaAtiva(semanasData[0].id)
          
          // Carregar partes de todas as semanas
          const { data: partesData } = await supabase
            .from("vida_ministerio_partes")
            .select("*")
            .in("semana_id", semanasData.map(s => s.id))
            .order("ordem")
          
          setPartes(partesData || [])
        } else {
          setPartes([])
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }, [mesAtual, anoAtual, supabase])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const adicionarSemana = async () => {
    if (!mesData) return

    const ultimaSemana = semanas[semanas.length - 1]
    let dataInicio: Date
    
    if (ultimaSemana) {
      dataInicio = new Date(ultimaSemana.data_fim)
      dataInicio.setDate(dataInicio.getDate() + 1)
    } else {
      dataInicio = new Date(anoAtual, mesAtual - 1, 1)
      // Encontrar a primeira segunda-feira
      while (dataInicio.getDay() !== 1) {
        dataInicio.setDate(dataInicio.getDate() + 1)
      }
    }

    const dataFim = new Date(dataInicio)
    dataFim.setDate(dataFim.getDate() + 6)

    const { data: novaSemana, error } = await supabase
      .from("vida_ministerio_semanas")
      .insert({
        mes_id: mesData.id,
        data_inicio: dataInicio.toISOString().split("T")[0],
        data_fim: dataFim.toISOString().split("T")[0],
        leitura_semanal: ""
      })
      .select()
      .single()

    if (!error && novaSemana) {
      setSemanas([...semanas, novaSemana])
      setSemanaAtiva(novaSemana.id)
    }
  }

  const removerSemana = async (semanaId: string) => {
    const { error } = await supabase
      .from("vida_ministerio_semanas")
      .delete()
      .eq("id", semanaId)

    if (!error) {
      setSemanas(semanas.filter(s => s.id !== semanaId))
      setPartes(partes.filter(p => p.semana_id !== semanaId))
      if (semanaAtiva === semanaId) {
        setSemanaAtiva(semanas[0]?.id || null)
      }
    }
  }

  const atualizarSemana = async (semanaId: string, campo: string, valor: string | number | null) => {
    const { error } = await supabase
      .from("vida_ministerio_semanas")
      .update({ [campo]: valor })
      .eq("id", semanaId)

    if (!error) {
      setSemanas(semanas.map(s => 
        s.id === semanaId ? { ...s, [campo]: valor } : s
      ))
    }
  }

  const adicionarParte = async (semanaId: string, secao: string) => {
    const partesSecao = partes.filter(p => p.semana_id === semanaId && p.secao === secao)
    const ordem = partesSecao.length + 1

    const { data: novaParte, error } = await supabase
      .from("vida_ministerio_partes")
      .insert({
        semana_id: semanaId,
        secao,
        titulo: "",
        ordem,
        sala: "principal"
      })
      .select()
      .single()

    if (!error && novaParte) {
      setPartes([...partes, novaParte])
    }
  }

  const atualizarParte = async (parteId: string, campo: string, valor: string | null) => {
    const { error } = await supabase
      .from("vida_ministerio_partes")
      .update({ [campo]: valor })
      .eq("id", parteId)

    if (!error) {
      setPartes(partes.map(p => 
        p.id === parteId ? { ...p, [campo]: valor } : p
      ))
    }
  }

  const removerParte = async (parteId: string) => {
    const { error } = await supabase
      .from("vida_ministerio_partes")
      .delete()
      .eq("id", parteId)

    if (!error) {
      setPartes(partes.filter(p => p.id !== parteId))
    }
  }

  // Buscar sugestões de IA para uma parte
  const buscarSugestoesIA = async (parteId: string, titulo: string, secao: string) => {
    setBuscandoSugestao(parteId)
    
    try {
      const response = await fetch("/api/ia/sugerir-designacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: secao,
          parte: titulo,
          quantidade: 3
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSugestoes(prev => ({
          ...prev,
          [parteId]: data.sugestoes || []
        }))
      }
    } catch (error) {
      console.error("Erro ao buscar sugestoes:", error)
      toast.error("Erro ao buscar sugestoes")
    } finally {
      setBuscandoSugestao(null)
    }
  }

  // Aplicar sugestão
  const aplicarSugestao = async (parteId: string, publicadorId: string, publicadorNome: string) => {
    await atualizarParte(parteId, "participante_id", publicadorId)
    await atualizarParte(parteId, "participante_nome", publicadorNome)
    toast.success(`${publicadorNome} designado!`)
    // Limpar sugestões
    setSugestoes(prev => {
      const novo = { ...prev }
      delete novo[parteId]
      return novo
    })
  }

  const mesAnterior = () => {
    if (mesAtual === 1) {
      setMesAtual(12)
      setAnoAtual(anoAtual - 1)
    } else {
      setMesAtual(mesAtual - 1)
    }
  }

  const mesProximo = () => {
    if (mesAtual === 12) {
      setMesAtual(1)
      setAnoAtual(anoAtual + 1)
    } else {
      setMesAtual(mesAtual + 1)
    }
  }

  const semanaAtualData = semanas.find(s => s.id === semanaAtiva)
  const partesAtuais = partes.filter(p => p.semana_id === semanaAtiva)

  const formatarData = (data: string) => {
    return new Date(data + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Vida e Ministério</h1>
          <p className="text-zinc-400">Gerencie as designações da reunião de meio de semana</p>
        </div>
      </div>

      {/* Navegação de Mês */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={mesAnterior}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">
                {meses.find(m => m.valor === mesAtual)?.nome} {anoAtual}
              </h2>
              <p className="text-sm text-zinc-500">{semanas.length} semana(s) cadastrada(s)</p>
            </div>
            <Button variant="ghost" size="icon" onClick={mesProximo}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center text-zinc-500 py-12">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lista de Semanas */}
          <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">Semanas</CardTitle>
                <Button size="sm" onClick={adicionarSemana}>
                  <Plus className="w-4 h-4 mr-1" /> Nova
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {semanas.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-4">
                  Nenhuma semana cadastrada
                </p>
              ) : (
                semanas.map((semana, index) => (
                  <div
                    key={semana.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between group",
                      semanaAtiva === semana.id
                        ? "bg-blue-600/20 border border-blue-500/50"
                        : "bg-zinc-800/50 hover:bg-zinc-800"
                    )}
                    onClick={() => setSemanaAtiva(semana.id)}
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        Semana {index + 1}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {formatarData(semana.data_inicio)} - {formatarData(semana.data_fim)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        removerSemana(semana.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Detalhes da Semana */}
          <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-3">
            {semanaAtualData ? (
              <>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {formatarData(semanaAtualData.data_inicio)} - {formatarData(semanaAtualData.data_fim)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cânticos da Semana */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label className="text-zinc-400 text-xs">Cantico Inicial</Label>
                      <Input
                        type="number"
                        value={semanaAtualData.cantico_inicial || ""}
                        onChange={(e) => atualizarSemana(semanaAtualData.id, "cantico_inicial", e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="Numero"
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400 text-xs">Cantico Meio</Label>
                      <Input
                        type="number"
                        value={semanaAtualData.cantico_meio || ""}
                        onChange={(e) => atualizarSemana(semanaAtualData.id, "cantico_meio", e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="Numero"
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400 text-xs">Cantico Final</Label>
                      <Input
                        type="number"
                        value={semanaAtualData.cantico_final || ""}
                        onChange={(e) => atualizarSemana(semanaAtualData.id, "cantico_final", e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="Numero"
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                  </div>

                  {/* Seções */}
                  {secoes.map((secao) => {
                    const partesSecao = partesAtuais.filter(p => p.secao === secao.id)
                    const Icon = secao.icon

                    return (
                      <div key={secao.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className={cn("font-semibold flex items-center gap-2", secao.cor)}>
                            <Icon className="w-4 h-4" />
                            {secao.nome}
                          </h3>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => adicionarParte(semanaAtualData.id, secao.id)}
                          >
                            <Plus className="w-3 h-3 mr-1" /> Parte
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {partesSecao.length === 0 ? (
                            <p className="text-zinc-500 text-sm py-2">Nenhuma parte cadastrada</p>
                          ) : (
                            partesSecao.map((parte) => (
                              <div 
                                key={parte.id} 
                                className="bg-zinc-800/50 rounded-lg p-3 space-y-3"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                                    <div className="md:col-span-2">
                                      <Input
                                        value={parte.titulo || ""}
                                        onChange={(e) => atualizarParte(parte.id, "titulo", e.target.value)}
                                        placeholder="Título da parte"
                                        className="bg-zinc-900 border-zinc-700 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <Input
                                        value={parte.tempo || ""}
                                        onChange={(e) => atualizarParte(parte.id, "tempo", e.target.value)}
                                        placeholder="Tempo (ex: 10 min)"
                                        className="bg-zinc-900 border-zinc-700 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <Select
                                        value={parte.sala}
                                        onValueChange={(value) => atualizarParte(parte.id, "sala", value)}
                                      >
                                        <SelectTrigger className="bg-zinc-900 border-zinc-700 text-sm">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="principal">Principal</SelectItem>
                                          <SelectItem value="auxiliar">Auxiliar</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => removerParte(parte.id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                  </Button>
                                </div>
                                {/* Botão para Sugestões de IA */}
                                <div className="flex items-center gap-2 mb-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => buscarSugestoesIA(parte.id, parte.titulo, secao.id)}
                                    disabled={buscandoSugestao === parte.id}
                                    className="text-xs border-violet-600/30 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400"
                                  >
                                    {buscandoSugestao === parte.id ? (
                                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    ) : (
                                      <Sparkles className="h-3 w-3 mr-1" />
                                    )}
                                    Sugerir com IA
                                  </Button>
                                  
                                  {/* Mostrar sugestões */}
                                  {sugestoes[parte.id] && sugestoes[parte.id].length > 0 && (
                                    <div className="flex items-center gap-1 flex-wrap">
                                      {sugestoes[parte.id].map((sug, idx) => (
                                        <button
                                          key={idx}
                                          onClick={() => aplicarSugestao(parte.id, sug.id, sug.nome)}
                                          className="px-2 py-1 rounded text-xs bg-violet-600/20 text-violet-300 hover:bg-violet-600/40 transition-colors"
                                          title={sug.motivo}
                                        >
                                          {sug.nome}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  <Select
                                    value={parte.participante_id || "none"}
                                    onValueChange={(value) => {
                                      const pub = publicadores.find(p => p.id === value)
                                      atualizarParte(parte.id, "participante_id", value === "none" ? null : value)
                                      atualizarParte(parte.id, "participante_nome", pub?.nome || null)
                                    }}
                                  >
                                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-sm">
                                      <SelectValue placeholder="Participante" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">Selecione o participante</SelectItem>
                                      {publicadores.map((pub) => (
                                        <SelectItem key={pub.id} value={pub.id}>
                                          {pub.nome}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={parte.ajudante_id || "none"}
                                    onValueChange={(value) => {
                                      const pub = publicadores.find(p => p.id === value)
                                      atualizarParte(parte.id, "ajudante_id", value === "none" ? null : value)
                                      atualizarParte(parte.id, "ajudante_nome", pub?.nome || null)
                                    }}
                                  >
                                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-sm">
                                      <SelectValue placeholder="Ajudante (opcional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">Sem ajudante</SelectItem>
                                      {publicadores.map((pub) => (
                                        <SelectItem key={pub.id} value={pub.id}>
                                          {pub.nome}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </>
            ) : (
              <CardContent className="py-12 text-center text-zinc-500">
                Selecione ou crie uma semana para editar
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
