"use client"
// Sentinela Management Page - InfoFlow v2.1
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  FileText,
  Wand2,
  ChevronDown,
  Save
} from "lucide-react"
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

interface Mes {
  id: string
  mes: number
  ano: number
}

interface Estudo {
  id: string
  mes_id: string
  numero_estudo: number
  titulo: string
  data_inicio: string
  data_fim: string
  texto_tema: string | null
  cantico_inicial: number | null
  cantico_final: number | null
  dirigente_id: string | null
  leitor_id: string | null
}

interface Paragrafo {
  id: string
  estudo_id: string
  numero: string
  pergunta: string
  resposta_ia: string | null
  ordem: number
}

interface Publicador {
  id: string
  nome: string
}

export default function AdminSentinelaPage() {
  const router = useRouter()
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [mesData, setMesData] = useState<Mes | null>(null)
  const [estudos, setEstudos] = useState<Estudo[]>([])
  const [paragrafos, setParagrafos] = useState<Paragrafo[]>([])
  const [publicadores, setPublicadores] = useState<Publicador[]>([])
  const [loading, setLoading] = useState(true)
  const [estudoAtivo, setEstudoAtivo] = useState<string | null>(null)

  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      // Carregar publicadores
      const { data: pubsData } = await supabase
        .from("publicadores")
        .select("id, nome")
        .order("nome")
      setPublicadores(pubsData || [])

      // Buscar mês existente
      const { data: mes } = await supabase
        .from("sentinela_meses")
        .select("*")
        .eq("mes", mesAtual)
        .eq("ano", anoAtual)
        .single()

      setMesData(mes || null)

      if (mes) {
        // Carregar estudos do mês
        const { data: estudosData } = await supabase
          .from("sentinela_estudos")
          .select("*")
          .eq("mes_id", mes.id)
          .order("data_inicio")
        
        setEstudos(estudosData || [])
        
        if (estudosData && estudosData.length > 0) {
          setEstudoAtivo(estudosData[0].id)
          
          // Carregar parágrafos de todos os estudos
          const { data: paragrafosData } = await supabase
            .from("sentinela_paragrafos")
            .select("*")
            .in("estudo_id", estudosData.map(e => e.id))
            .order("ordem")
          
          setParagrafos(paragrafosData || [])
        } else {
          setEstudoAtivo(null)
          setParagrafos([])
        }
      } else {
        setEstudos([])
        setEstudoAtivo(null)
        setParagrafos([])
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

  const adicionarEstudo = async () => {
    try {
      let mesId = mesData?.id
      
      // Se não tem mês, criar
      if (!mesId) {
        const { data: novoMes, error: erroMes } = await supabase
          .from("sentinela_meses")
          .insert({ mes: mesAtual, ano: anoAtual })
          .select()
          .single()
        
        if (erroMes || !novoMes) return
        
        mesId = novoMes.id
        setMesData(novoMes)
      }

      // Calcular próxima data de estudo (próximo domingo)
      let dataInicio: Date
      let numeroEstudo = 1
      
      if (estudos.length > 0) {
        const ultimoEstudo = estudos[estudos.length - 1]
        dataInicio = new Date(ultimoEstudo.data_inicio + "T12:00:00")
        dataInicio.setDate(dataInicio.getDate() + 7)
        numeroEstudo = (ultimoEstudo.numero_estudo || estudos.length) + 1
      } else {
        dataInicio = new Date(anoAtual, mesAtual - 1, 1)
        while (dataInicio.getDay() !== 0) {
          dataInicio.setDate(dataInicio.getDate() + 1)
        }
      }
      
      // Data fim é 6 dias depois (sábado)
      const dataFim = new Date(dataInicio)
      dataFim.setDate(dataFim.getDate() + 6)

      const { data: novoEstudo, error } = await supabase
        .from("sentinela_estudos")
        .insert({
          mes_id: mesId,
          numero_estudo: numeroEstudo,
          titulo: "Novo Estudo",
          data_inicio: dataInicio.toISOString().split("T")[0],
          data_fim: dataFim.toISOString().split("T")[0],
          cantico_inicial: 1,
          cantico_final: 1
        })
        .select()
        .single()

      if (error || !novoEstudo) return
      
      setEstudos(prev => [...prev, novoEstudo])
      setEstudoAtivo(novoEstudo.id)
    } catch (err) {
      console.error("Erro ao adicionar estudo:", err)
    }
  }

  const removerEstudo = async (estudoId: string) => {
    // Primeiro remove os parágrafos
    await supabase
      .from("sentinela_paragrafos")
      .delete()
      .eq("estudo_id", estudoId)

    const { error } = await supabase
      .from("sentinela_estudos")
      .delete()
      .eq("id", estudoId)

    if (!error) {
      const novosEstudos = estudos.filter(e => e.id !== estudoId)
      setEstudos(novosEstudos)
      setParagrafos(paragrafos.filter(p => p.estudo_id !== estudoId))
      if (estudoAtivo === estudoId) {
        setEstudoAtivo(novosEstudos[0]?.id || null)
      }
    }
  }

  const atualizarEstudo = async (estudoId: string, campo: string, valor: string | number | null) => {
    const { error } = await supabase
      .from("sentinela_estudos")
      .update({ [campo]: valor })
      .eq("id", estudoId)

    if (!error) {
      setEstudos(estudos.map(e => 
        e.id === estudoId ? { ...e, [campo]: valor } : e
      ))
    }
  }

  const adicionarParagrafo = async (estudoId: string) => {
    const paragrafosEstudo = paragrafos.filter(p => p.estudo_id === estudoId)
    const proximoNumero = paragrafosEstudo.length + 1

    const { data: novoParagrafo, error } = await supabase
      .from("sentinela_paragrafos")
      .insert({
        estudo_id: estudoId,
        numero: String(proximoNumero),
        pergunta: "",
        ordem: proximoNumero
      })
      .select()
      .single()

    if (!error && novoParagrafo) {
      setParagrafos([...paragrafos, novoParagrafo])
    }
  }

  const atualizarParagrafo = async (paragrafoId: string, campo: string, valor: string | null) => {
    const { error } = await supabase
      .from("sentinela_paragrafos")
      .update({ [campo]: valor })
      .eq("id", paragrafoId)

    if (!error) {
      setParagrafos(paragrafos.map(p => 
        p.id === paragrafoId ? { ...p, [campo]: valor } : p
      ))
    }
  }

  const removerParagrafo = async (paragrafoId: string) => {
    const { error } = await supabase
      .from("sentinela_paragrafos")
      .delete()
      .eq("id", paragrafoId)

    if (!error) {
      setParagrafos(paragrafos.filter(p => p.id !== paragrafoId))
    }
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

  const estudoAtualData = estudos.find(e => e.id === estudoAtivo)
  const paragrafosAtuais = paragrafos.filter(p => p.estudo_id === estudoAtivo)

  const formatarData = (dataInicio: string, dataFim: string) => {
    const inicio = new Date(dataInicio + "T12:00:00")
    const fim = new Date(dataFim + "T12:00:00")
    return `${inicio.getDate()} de ${inicio.toLocaleDateString("pt-BR", { month: "short" })} - ${fim.getDate()} de ${fim.toLocaleDateString("pt-BR", { month: "short" })}.`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Estudo de A Sentinela</h1>
          <p className="text-zinc-400">Gerencie os estudos da Sentinela por mês</p>
        </div>
        
        {/* Menu de ações no canto superior direito */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={adicionarEstudo}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Estudo Manual
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/importar")}>
              <Wand2 className="w-4 h-4 mr-2" />
              Importar com IA
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
              <p className="text-sm text-zinc-500">{estudos.length} estudo(s) cadastrado(s)</p>
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
          {/* Lista de Estudos */}
          <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Estudos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {estudos.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-4">
                  Nenhum estudo cadastrado
                </p>
              ) : (
                estudos.map((estudo) => (
                  <div
                    key={estudo.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between group",
                      estudoAtivo === estudo.id
                        ? "bg-red-600/20 border border-red-500/50"
                        : "bg-zinc-800/50 hover:bg-zinc-800"
                    )}
                    onClick={() => setEstudoAtivo(estudo.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {estudo.titulo || `Estudo ${estudo.numero_estudo}`}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {formatarData(estudo.data_inicio, estudo.data_fim)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-7 w-7 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        removerEstudo(estudo.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Detalhes do Estudo */}
          <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-3">
            {estudoAtualData ? (
              <>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-red-500" />
                    Editar Estudo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Informações do Estudo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Título do Estudo</Label>
                      <Input
                        value={estudoAtualData.titulo || ""}
                        onChange={(e) => atualizarEstudo(estudoAtualData.id, "titulo", e.target.value)}
                        placeholder="Título do artigo"
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-zinc-400">Data Início</Label>
                        <Input
                          type="date"
                          value={estudoAtualData.data_inicio || ""}
                          onChange={(e) => atualizarEstudo(estudoAtualData.id, "data_inicio", e.target.value)}
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-zinc-400">Data Fim</Label>
                        <Input
                          type="date"
                          value={estudoAtualData.data_fim || ""}
                          onChange={(e) => atualizarEstudo(estudoAtualData.id, "data_fim", e.target.value)}
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-400">Texto Tema</Label>
                    <Input
                      value={estudoAtualData.texto_tema || ""}
                      onChange={(e) => atualizarEstudo(estudoAtualData.id, "texto_tema", e.target.value)}
                      placeholder="Ex: 'Confia em Jeová e faze o bem.' — Sal. 37:3"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Cântico Inicial</Label>
                      <Input
                        type="number"
                        value={estudoAtualData.cantico_inicial || ""}
                        onChange={(e) => atualizarEstudo(estudoAtualData.id, "cantico_inicial", e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="Nº"
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Cântico Final</Label>
                      <Input
                        type="number"
                        value={estudoAtualData.cantico_final || ""}
                        onChange={(e) => atualizarEstudo(estudoAtualData.id, "cantico_final", e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="Nº"
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Dirigente</Label>
                      <select
                        value={estudoAtualData.dirigente_id || ""}
                        onChange={(e) => atualizarEstudo(estudoAtualData.id, "dirigente_id", e.target.value || null)}
                        className="w-full h-9 rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm px-3"
                      >
                        <option value="">Selecione...</option>
                        {publicadores.map(p => (
                          <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Leitor</Label>
                      <select
                        value={estudoAtualData.leitor_id || ""}
                        onChange={(e) => atualizarEstudo(estudoAtualData.id, "leitor_id", e.target.value || null)}
                        className="w-full h-9 rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm px-3"
                      >
                        <option value="">Selecione...</option>
                        {publicadores.map(p => (
                          <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Parágrafos */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Parágrafos ({paragrafosAtuais.length})
                      </h3>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => adicionarParagrafo(estudoAtualData.id)}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Parágrafo
                      </Button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {paragrafosAtuais.length === 0 ? (
                        <p className="text-zinc-500 text-sm py-4">Nenhum parágrafo cadastrado</p>
                      ) : (
                        paragrafosAtuais.map((paragrafo) => (
                          <div 
                            key={paragrafo.id} 
                            className="bg-zinc-800/50 rounded-lg p-3 space-y-2"
                          >
                            <div className="flex items-start gap-3">
                              <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded text-sm font-medium min-w-8 text-center">
                                {paragrafo.numero}
                              </span>
                              <div className="flex-1 space-y-2">
                                <Input
                                  value={paragrafo.pergunta || ""}
                                  onChange={(e) => atualizarParagrafo(paragrafo.id, "pergunta", e.target.value)}
                                  placeholder="Pergunta do parágrafo"
                                  className="bg-zinc-900 border-zinc-700 text-sm"
                                />
                                {paragrafo.resposta_ia && (
                                  <div className="bg-zinc-900 rounded p-2 text-sm text-zinc-300">
                                    <span className="text-xs text-green-400 block mb-1">Resposta IA:</span>
                                    {paragrafo.resposta_ia}
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removerParagrafo(paragrafo.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="py-12 text-center text-zinc-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">Selecione ou crie um estudo para editar</p>
                <Button onClick={adicionarEstudo} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Estudo
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
