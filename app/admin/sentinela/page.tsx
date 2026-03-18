"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  BookOpen, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Trash2,
  MoreVertical,
  Wand2,
  Sparkles,
  Loader2
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import Link from "next/link"

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

interface Estudo {
  id: string
  mes_id: string
  numero_estudo: number
  titulo: string
  texto_tema?: string
  data_inicio: string
  data_fim: string
  cantico_inicial?: number
  cantico_final?: number
  dirigente_id?: string
  leitor_id?: string
}

interface Paragrafo {
  id: string
  estudo_id: string
  numero: string
  texto?: string
  pergunta: string
  resposta_ia?: string
  ordem: number
}

interface Publicador {
  id: string
  nome: string
}

export default function SentinelaPage() {
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [mesData, setMesData] = useState<{ id: string; mes: number; ano: number } | null>(null)
  const [estudos, setEstudos] = useState<Estudo[]>([])
  const [paragrafos, setParagrafos] = useState<Paragrafo[]>([])
  const [publicadores, setPublicadores] = useState<Publicador[]>([])
  const [estudoAtivo, setEstudoAtivo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [gerandoIA, setGerandoIA] = useState<string | null>(null)
  
  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    
    // Buscar mês
    const { data: mesData } = await supabase
      .from("sentinela_meses")
      .select("*")
      .eq("mes", mesAtual)
      .eq("ano", anoAtual)
      .single()
    
    setMesData(mesData)
    
    if (mesData) {
      // Buscar estudos do mês
      const { data: estudosData } = await supabase
        .from("sentinela_estudos")
        .select("*")
        .eq("mes_id", mesData.id)
        .order("numero_estudo")
      
      setEstudos(estudosData || [])
      
      if (estudosData && estudosData.length > 0) {
        if (!estudoAtivo || !estudosData.find(e => e.id === estudoAtivo)) {
          setEstudoAtivo(estudosData[0].id)
        }
        
        // Buscar parágrafos de todos os estudos
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
    
    // Buscar publicadores
    const { data: pubData } = await supabase
      .from("publicadores")
      .select("id, nome")
      .eq("ativo", true)
      .order("nome")
    
    setPublicadores(pubData || [])
    
    setLoading(false)
  }, [mesAtual, anoAtual, supabase, estudoAtivo])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const navegarMes = (direcao: number) => {
    let novoMes = mesAtual + direcao
    let novoAno = anoAtual
    
    if (novoMes > 12) {
      novoMes = 1
      novoAno++
    } else if (novoMes < 1) {
      novoMes = 12
      novoAno--
    }
    
    setMesAtual(novoMes)
    setAnoAtual(novoAno)
    setEstudoAtivo(null)
  }

  const adicionarEstudo = async () => {
    try {
      let mesId = mesData?.id
      
      if (!mesId) {
        const { data: mesExistente } = await supabase
          .from("sentinela_meses")
          .select("id")
          .eq("mes", mesAtual)
          .eq("ano", anoAtual)
          .single()
        
        if (mesExistente) {
          mesId = mesExistente.id
          setMesData({ id: mesId, mes: mesAtual, ano: anoAtual })
        } else {
          const { data: novoMes, error: erroMes } = await supabase
            .from("sentinela_meses")
            .insert({ mes: mesAtual, ano: anoAtual })
            .select()
            .single()
          
          if (erroMes || !novoMes) return
          
          mesId = novoMes.id
          setMesData(novoMes)
        }
      }

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

      if (error) return
      
      if (novoEstudo) {
        setEstudos(prev => [...prev, novoEstudo])
        setEstudoAtivo(novoEstudo.id)
      }
    } catch {
      // erro silencioso
    }
  }

  const atualizarEstudo = async (estudoId: string, campo: string, valor: unknown) => {
    const { error } = await supabase
      .from("sentinela_estudos")
      .update({ [campo]: valor })
      .eq("id", estudoId)

    if (!error) {
      setEstudos(prev => prev.map(e => 
        e.id === estudoId ? { ...e, [campo]: valor } : e
      ))
    }
  }

  const removerEstudo = async (estudoId: string) => {
    if (!confirm("Tem certeza que deseja remover este estudo?")) return
    
    await supabase.from("sentinela_paragrafos").delete().eq("estudo_id", estudoId)
    const { error } = await supabase.from("sentinela_estudos").delete().eq("id", estudoId)

    if (!error) {
      setEstudos(prev => prev.filter(e => e.id !== estudoId))
      setParagrafos(prev => prev.filter(p => p.estudo_id !== estudoId))
      if (estudoAtivo === estudoId) {
        setEstudoAtivo(estudos.find(e => e.id !== estudoId)?.id || null)
      }
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
        texto: "",
        ordem: proximoNumero
      })
      .select()
      .single()

    if (!error && novoParagrafo) {
      setParagrafos([...paragrafos, novoParagrafo])
    }
  }

  const atualizarParagrafo = async (paragrafoId: string, campo: string, valor: string) => {
    const { error } = await supabase
      .from("sentinela_paragrafos")
      .update({ [campo]: valor })
      .eq("id", paragrafoId)

    if (!error) {
      setParagrafos(prev => prev.map(p => 
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
      setParagrafos(prev => prev.filter(p => p.id !== paragrafoId))
    }
  }

  const gerarRespostaIA = async (paragrafo: Paragrafo) => {
    if (!paragrafo.texto || !paragrafo.pergunta) {
      alert("Preencha o texto e a pergunta do parágrafo antes de gerar a resposta.")
      return
    }

    setGerandoIA(paragrafo.id)

    try {
      const response = await fetch("/api/sentinela/gerar-resposta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: paragrafo.texto,
          pergunta: paragrafo.pergunta
        })
      })

      if (!response.ok) throw new Error("Erro ao gerar resposta")

      const data = await response.json()
      
      if (data.resposta) {
        await atualizarParagrafo(paragrafo.id, "resposta_ia", data.resposta)
      }
    } catch {
      alert("Erro ao gerar resposta com IA. Tente novamente.")
    } finally {
      setGerandoIA(null)
    }
  }

  const formatarData = (dataInicio: string, dataFim: string) => {
    try {
      const inicio = parseISO(dataInicio)
      const fim = parseISO(dataFim)
      return `${format(inicio, "d 'de' MMM", { locale: ptBR })} - ${format(fim, "d 'de' MMM", { locale: ptBR })}`
    } catch {
      return "Data inválida"
    }
  }

  const estudoAtualData = estudos.find(e => e.id === estudoAtivo)
  const paragrafosAtuais = paragrafos.filter(p => p.estudo_id === estudoAtivo).sort((a, b) => a.ordem - b.ordem)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Estudo de A Sentinela</h1>
          <p className="text-muted-foreground">Gerencie os estudos da Sentinela por mês</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Estudo
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={adicionarEstudo}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Manual
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/importar">
                <Wand2 className="w-4 h-4 mr-2" />
                Importar com IA
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navegação de Mês */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navegarMes(-1)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h2 className="text-xl font-semibold">{meses[mesAtual - 1]} {anoAtual}</h2>
              <p className="text-sm text-zinc-500">{estudos.length} estudo(s) cadastrado(s)</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navegarMes(1)}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Estudos */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Estudos</CardTitle>
                <Button size="sm" onClick={adicionarEstudo}>
                  <Plus className="w-4 h-4 mr-1" /> Novo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {estudos.length === 0 ? (
                <p className="text-zinc-500 text-sm py-4">Nenhum estudo cadastrado</p>
              ) : (
                estudos.map((estudo) => (
                  <div
                    key={estudo.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors border",
                      estudoAtivo === estudo.id 
                        ? "bg-red-600/20 border-red-600" 
                        : "bg-zinc-800/50 border-transparent hover:bg-zinc-800"
                    )}
                    onClick={() => setEstudoAtivo(estudo.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-white">{estudo.titulo}</h3>
                        <p className="text-sm text-zinc-400">
                          {formatarData(estudo.data_inicio, estudo.data_fim)}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="text-red-400"
                            onClick={(e) => {
                              e.stopPropagation()
                              removerEstudo(estudo.id)
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Editor de Estudo */}
          <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800">
            {estudoAtualData ? (
              <>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Editar Estudo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Título e Data */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Título do Estudo</Label>
                      <Input
                        value={estudoAtualData.titulo}
                        onChange={(e) => atualizarEstudo(estudoAtualData.id, "titulo", e.target.value)}
                        placeholder="Título do estudo"
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Data do Estudo</Label>
                      <Input
                        type="date"
                        value={estudoAtualData.data_inicio || ""}
                        onChange={(e) => atualizarEstudo(estudoAtualData.id, "data_inicio", e.target.value)}
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                  </div>

                  {/* Texto Tema */}
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Texto Tema</Label>
                    <Input
                      value={estudoAtualData.texto_tema || ""}
                      onChange={(e) => atualizarEstudo(estudoAtualData.id, "texto_tema", e.target.value)}
                      placeholder="Ex: 'Confia em Jeová e faze o bem.' — Sal. 37:3"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>

                  {/* Cânticos */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Cântico do Meio</Label>
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
                  </div>

                  {/* Dirigente e Leitor */}
                  <div className="grid grid-cols-2 gap-4">
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
                  <div className="space-y-3 pt-4 border-t border-zinc-800">
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

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {paragrafosAtuais.length === 0 ? (
                        <p className="text-zinc-500 text-sm py-4">Nenhum parágrafo cadastrado</p>
                      ) : (
                        paragrafosAtuais.map((paragrafo) => (
                          <div 
                            key={paragrafo.id} 
                            className="bg-zinc-800/50 rounded-lg p-4 space-y-3"
                          >
                            {/* Header do Parágrafo */}
                            <div className="flex items-center justify-between">
                              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                Parágrafo {paragrafo.numero}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removerParagrafo(paragrafo.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </Button>
                            </div>
                            
                            {/* Texto do Parágrafo */}
                            <div className="space-y-1">
                              <Label className="text-xs text-zinc-500">Texto do Parágrafo</Label>
                              <Textarea
                                value={paragrafo.texto || ""}
                                onChange={(e) => atualizarParagrafo(paragrafo.id, "texto", e.target.value)}
                                placeholder="Cole aqui o texto do parágrafo..."
                                className="bg-zinc-900 border-zinc-700 text-sm min-h-[80px]"
                              />
                            </div>

                            {/* Pergunta */}
                            <div className="space-y-1">
                              <Label className="text-xs text-zinc-500">Pergunta</Label>
                              <Input
                                value={paragrafo.pergunta || ""}
                                onChange={(e) => atualizarParagrafo(paragrafo.id, "pergunta", e.target.value)}
                                placeholder="Digite a pergunta do parágrafo..."
                                className="bg-zinc-900 border-zinc-700 text-sm"
                              />
                            </div>

                            {/* Botão Gerar Resposta IA */}
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => gerarRespostaIA(paragrafo)}
                                disabled={gerandoIA === paragrafo.id || !paragrafo.texto || !paragrafo.pergunta}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                              >
                                {gerandoIA === paragrafo.id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Gerando...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    IA Responder
                                  </>
                                )}
                              </Button>
                              {(!paragrafo.texto || !paragrafo.pergunta) && (
                                <span className="text-xs text-zinc-500">
                                  Preencha texto e pergunta
                                </span>
                              )}
                            </div>

                            {/* Resposta IA */}
                            {paragrafo.resposta_ia && (
                              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-3 border border-purple-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                  <Sparkles className="w-4 h-4 text-purple-400" />
                                  <span className="text-xs font-medium text-purple-400">Resposta IA</span>
                                </div>
                                <p className="text-sm text-zinc-200">{paragrafo.resposta_ia}</p>
                              </div>
                            )}
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
