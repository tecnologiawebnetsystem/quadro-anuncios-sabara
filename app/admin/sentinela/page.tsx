"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookOpen, ChevronLeft, ChevronRight, Plus, MoreVertical, Trash2, FileText, Wand2, Sparkles, Loader2, ImagePlus, X, ImageIcon, AlertTriangle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
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
  sem_reuniao?: boolean
  motivo_sem_reuniao?: string
}

interface Paragrafo {
  id: string
  estudo_id: string
  numero: string
  texto_base?: string
  pergunta: string
  resposta?: string
  ordem: number
  imagem_url?: string
  imagem_descricao?: string
  imagem_explicacao?: string
}

export default function SentinelaPage() {
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [mesData, setMesData] = useState<{ id: string; mes: number; ano: number } | null>(null)
  const [estudos, setEstudos] = useState<Estudo[]>([])
  const [estudoAtivo, setEstudoAtivo] = useState<string | null>(null)
  const [paragrafos, setParagrafos] = useState<Paragrafo[]>([])
  const [gerandoResposta, setGerandoResposta] = useState<string | null>(null)
  const [gerandoExplicacao, setGerandoExplicacao] = useState<string | null>(null)
  const [gerandoDescricao, setGerandoDescricao] = useState<string | null>(null)
  const [enviandoImagem, setEnviandoImagem] = useState<string | null>(null)
  
  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    // Buscar ou criar mês
    const { data: mesExistente } = await supabase
      .from("sentinela_meses")
      .select("*")
      .eq("mes", mesAtual)
      .eq("ano", anoAtual)
      .single()

    if (mesExistente) {
      setMesData(mesExistente)
      
      // Carregar estudos do mês
      const { data: estudosData } = await supabase
        .from("sentinela_estudos")
        .select("*")
        .eq("mes_id", mesExistente.id)
        .order("data_inicio")
      
      setEstudos(estudosData || [])
      
      if (estudosData && estudosData.length > 0) {
        if (!estudoAtivo || !estudosData.find(e => e.id === estudoAtivo)) {
          setEstudoAtivo(estudosData[0].id)
        }
        
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
      setMesData(null)
      setEstudos([])
      setEstudoAtivo(null)
      setParagrafos([])
    }
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

      if (!error && novoEstudo) {
        setEstudos(prev => [...prev, novoEstudo])
        setEstudoAtivo(novoEstudo.id)
      }
    } catch (err) {
      // erro silencioso
    }
  }

  const atualizarEstudo = async (estudoId: string, campo: string, valor: string | number | null) => {
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

  const excluirEstudo = async (estudoId: string) => {
    // Primeiro excluir parágrafos
    await supabase
      .from("sentinela_paragrafos")
      .delete()
      .eq("estudo_id", estudoId)
    
    const { error } = await supabase
      .from("sentinela_estudos")
      .delete()
      .eq("id", estudoId)

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
        ordem: proximoNumero
      })
      .select()
      .single()

    if (!error && novoParagrafo) {
      setParagrafos(prev => [...prev, novoParagrafo])
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

  const excluirParagrafo = async (paragrafoId: string) => {
    const { error } = await supabase
      .from("sentinela_paragrafos")
      .delete()
      .eq("id", paragrafoId)

    if (!error) {
      setParagrafos(prev => prev.filter(p => p.id !== paragrafoId))
    }
  }

  const gerarRespostaIA = async (paragrafo: Paragrafo) => {
    if (!paragrafo.texto_base || !paragrafo.pergunta) {
      return
    }

    setGerandoResposta(paragrafo.id)

    try {
      const response = await fetch("/api/ai/responder-paragrafo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: paragrafo.texto_base,
          pergunta: paragrafo.pergunta
        })
      })

      if (response.ok) {
        const data = await response.json()
        await atualizarParagrafo(paragrafo.id, "resposta", data.resposta)
      }
    } catch (err) {
      // erro silencioso
    } finally {
      setGerandoResposta(null)
    }
  }

  const uploadImagem = async (paragrafoId: string, file: File) => {
    setEnviandoImagem(paragrafoId)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-imagem", {
        method: "POST",
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        await atualizarParagrafo(paragrafoId, "imagem_url", data.url)
      }
    } catch (err) {
      // erro silencioso
    } finally {
      setEnviandoImagem(null)
    }
  }

  const removerImagem = async (paragrafoId: string) => {
    const { error } = await supabase
      .from("sentinela_paragrafos")
      .update({ 
        imagem_url: null, 
        imagem_descricao: null, 
        imagem_explicacao: null 
      })
      .eq("id", paragrafoId)

    if (!error) {
      setParagrafos(prev => prev.map(p => 
        p.id === paragrafoId ? { ...p, imagem_url: undefined, imagem_descricao: undefined, imagem_explicacao: undefined } : p
      ))
    }
  }

  const gerarDescricaoImagem = async (paragrafo: Paragrafo) => {
    if (!paragrafo.imagem_url) {
      return
    }

    setGerandoDescricao(paragrafo.id)

    try {
      const response = await fetch("/api/ai/explicar-imagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagemUrl: paragrafo.imagem_url,
          textoBase: paragrafo.texto_base,
          pergunta: paragrafo.pergunta,
          modo: "descrever"
        })
      })

      if (response.ok) {
        const data = await response.json()
        await atualizarParagrafo(paragrafo.id, "imagem_descricao", data.descricao)
      }
    } catch (err) {
      // erro silencioso
    } finally {
      setGerandoDescricao(null)
    }
  }

  const gerarExplicacaoImagem = async (paragrafo: Paragrafo) => {
    if (!paragrafo.imagem_url) {
      return
    }

    setGerandoExplicacao(paragrafo.id)

    try {
      const response = await fetch("/api/ai/explicar-imagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagemUrl: paragrafo.imagem_url,
          textoBase: paragrafo.texto_base,
          pergunta: paragrafo.pergunta,
          modo: "explicar"
        })
      })

      if (response.ok) {
        const data = await response.json()
        await atualizarParagrafo(paragrafo.id, "imagem_explicacao", data.explicacao)
      }
    } catch (err) {
      // erro silencioso
    } finally {
      setGerandoExplicacao(null)
    }
  }

  const formatarData = (dataInicio: string, dataFim: string) => {
    try {
      const mesesCurtos = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
      const inicio = new Date(dataInicio + "T12:00:00")
      const fim = new Date(dataFim + "T12:00:00")
      const diaInicio = inicio.getDate()
      const diaFim = fim.getDate()
      const mesInicio = mesesCurtos[inicio.getMonth()]
      const mesFim = mesesCurtos[fim.getMonth()]
      
      if (mesInicio === mesFim) {
        return `${diaInicio}-${diaFim} ${mesInicio}`
      }
      return `${diaInicio}/${mesInicio}-${diaFim}/${mesFim}`
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
          <p className="text-zinc-400">Gerencie os estudos da Sentinela por mês</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={adicionarEstudo}>
              <FileText className="w-4 h-4 mr-2" />
              Novo Estudo Manual
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

      {/* Seletor de Mês */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="py-6">
          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navegarMes(-1)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center min-w-[200px]">
              <h2 className="text-xl font-bold">{meses[mesAtual - 1]} {anoAtual}</h2>
              <p className="text-sm text-zinc-400">{estudos.length} estudo(s) cadastrado(s)</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navegarMes(1)}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Semanas */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Semanas</CardTitle>
              <Button size="sm" onClick={adicionarEstudo}>
                <Plus className="w-4 h-4 mr-1" /> Nova
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {estudos.length === 0 ? (
              <p className="text-zinc-500 text-sm">Nenhuma semana cadastrada</p>
            ) : (
              estudos.map((estudo) => (
                <div
                  key={estudo.id}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-colors border",
                    estudoAtivo === estudo.id 
                      ? "bg-red-600/20 border-red-600" 
                      : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                  )}
                  onClick={() => setEstudoAtivo(estudo.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{formatarData(estudo.data_inicio, estudo.data_fim)}</p>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                        {estudo.titulo || "Novo Estudo"}
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
                          className="text-red-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            excluirEstudo(estudo.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
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
        <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {estudoAtualData ? "Editar Estudo" : "Selecione um Estudo"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {estudoAtualData ? (
              <div className="space-y-6">
                {/* Informações do Estudo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Título do Estudo</Label>
                    <Input
                      value={estudoAtualData.titulo || ""}
                      onChange={(e) => atualizarEstudo(estudoAtualData.id, "titulo", e.target.value)}
                      placeholder="Ex: Sirva a Jeová com alegria"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Texto Tema</Label>
                    <Input
                      value={estudoAtualData.texto_tema || ""}
                      onChange={(e) => atualizarEstudo(estudoAtualData.id, "texto_tema", e.target.value)}
                      placeholder="Ex: 'Sirvam a Jeová com alegria.' — Sal. 100:2"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>

                {/* Checkbox Sem Reunião */}
                <div className="space-y-3 p-4 rounded-lg border border-zinc-700 bg-zinc-800/50">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`sem-reuniao-${estudoAtualData.id}`}
                      checked={estudoAtualData.sem_reuniao || false}
                      onCheckedChange={(checked) =>
                        atualizarEstudo(estudoAtualData.id, "sem_reuniao", checked === true)
                      }
                    />
                    <Label 
                      htmlFor={`sem-reuniao-${estudoAtualData.id}`}
                      className="text-amber-400 font-medium cursor-pointer flex items-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Semana especial (sem reunião)
                    </Label>
                  </div>
                  
                  {estudoAtualData.sem_reuniao && (
                    <div className="space-y-2 pt-2">
                      <Label className="text-zinc-400 text-sm">Motivo</Label>
                      <Textarea
                        value={estudoAtualData.motivo_sem_reuniao || ""}
                        onChange={(e) =>
                          atualizarEstudo(estudoAtualData.id, "motivo_sem_reuniao", e.target.value)
                        }
                        placeholder="Ex: Assembleia de Circuito, Congresso Regional, Celebração da Morte de Cristo..."
                        className="bg-zinc-900 border-zinc-600 min-h-[60px]"
                      />
                    </div>
                  )}
                </div>

                {!estudoAtualData.sem_reuniao && (
                <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                </>
                )}

                {/* Parágrafos */}
                {!estudoAtualData.sem_reuniao && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Parágrafos ({paragrafosAtuais.length})
                    </h3>
                    <Button size="sm" variant="outline" onClick={() => adicionarParagrafo(estudoAtualData.id)}>
                      <Plus className="w-4 h-4 mr-1" /> Parágrafo
                    </Button>
                  </div>

                  {paragrafosAtuais.length === 0 ? (
                    <p className="text-zinc-500 text-sm">Nenhum parágrafo cadastrado</p>
                  ) : (
                    <div className="space-y-4">
                      {paragrafosAtuais.map((paragrafo) => (
                        <Card key={paragrafo.id} className="bg-zinc-800 border-zinc-700">
                          <CardContent className="pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Label className="text-zinc-400">Parágrafo</Label>
                                <Input
                                  value={paragrafo.numero}
                                  onChange={(e) => atualizarParagrafo(paragrafo.id, "numero", e.target.value)}
                                  placeholder="1"
                                  className="bg-zinc-900 border-zinc-600 w-20"
                                />
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                onClick={() => excluirParagrafo(paragrafo.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-zinc-400">Texto do Parágrafo</Label>
                              <Textarea
                                value={paragrafo.texto_base || ""}
                                onChange={(e) => atualizarParagrafo(paragrafo.id, "texto_base", e.target.value)}
                                placeholder="Cole aqui o texto do parágrafo..."
                                className="bg-zinc-900 border-zinc-600 min-h-[80px]"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-zinc-400">Pergunta</Label>
                              <Input
                                value={paragrafo.pergunta || ""}
                                onChange={(e) => atualizarParagrafo(paragrafo.id, "pergunta", e.target.value)}
                                placeholder="Qual é a pergunta deste parágrafo?"
                                className="bg-zinc-900 border-zinc-600"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-zinc-400">Resposta</Label>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                                  onClick={() => gerarRespostaIA(paragrafo)}
                                  disabled={gerandoResposta === paragrafo.id || !paragrafo.texto_base || !paragrafo.pergunta}
                                >
                                  {gerandoResposta === paragrafo.id ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                      Gerando...
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-4 h-4 mr-1" />
                                      IA Responder
                                    </>
                                  )}
                                </Button>
                              </div>
                              <Textarea
                                value={paragrafo.resposta || ""}
                                onChange={(e) => atualizarParagrafo(paragrafo.id, "resposta", e.target.value)}
                                placeholder="A resposta aparecerá aqui após clicar em 'IA Responder' ou digite manualmente..."
                                className="bg-zinc-900 border-zinc-600 min-h-[60px]"
                              />
                            </div>

                            {/* Seção de Imagem */}
                            <div className="space-y-3 pt-3 border-t border-zinc-700">
                              <div className="flex items-center justify-between">
                                <Label className="text-zinc-400 flex items-center gap-2">
                                  <ImageIcon className="w-4 h-4" />
                                  Imagem do Parágrafo
                                </Label>
                                {!paragrafo.imagem_url && (
                                  <label className="cursor-pointer">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) uploadImagem(paragrafo.id, file)
                                      }}
                                      disabled={enviandoImagem === paragrafo.id}
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                                      asChild
                                    >
                                      <span>
                                        {enviandoImagem === paragrafo.id ? (
                                          <>
                                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                            Enviando...
                                          </>
                                        ) : (
                                          <>
                                            <ImagePlus className="w-4 h-4 mr-1" />
                                            Adicionar Imagem
                                          </>
                                        )}
                                      </span>
                                    </Button>
                                  </label>
                                )}
                              </div>

                              {paragrafo.imagem_url && (
                                <div className="space-y-3">
                                  <div className="relative rounded-lg overflow-hidden bg-zinc-900 border border-zinc-600">
                                    <img 
                                      src={paragrafo.imagem_url} 
                                      alt="Imagem do parágrafo"
                                      className="max-h-48 w-auto mx-auto"
                                    />
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="absolute top-2 right-2 bg-zinc-900/80 hover:bg-red-500/20 text-red-400 h-7 w-7"
                                      onClick={() => removerImagem(paragrafo.id)}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-zinc-400">Descrição da Imagem</Label>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-amber-500 text-amber-400 hover:bg-amber-500/10"
                                        onClick={() => gerarDescricaoImagem(paragrafo)}
                                        disabled={gerandoDescricao === paragrafo.id}
                                      >
                                        {gerandoDescricao === paragrafo.id ? (
                                          <>
                                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                            Analisando...
                                          </>
                                        ) : (
                                          <>
                                            <Sparkles className="w-4 h-4 mr-1" />
                                            IA Descrever
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                    <Textarea
                                      value={paragrafo.imagem_descricao || ""}
                                      onChange={(e) => atualizarParagrafo(paragrafo.id, "imagem_descricao", e.target.value)}
                                      placeholder="Clique em 'IA Descrever' para a IA analisar a imagem automaticamente ou digite manualmente..."
                                      className="bg-zinc-900 border-zinc-600 min-h-[60px]"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-zinc-400">Explicação da Imagem</Label>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-green-500 text-green-400 hover:bg-green-500/10"
                                        onClick={() => gerarExplicacaoImagem(paragrafo)}
                                        disabled={gerandoExplicacao === paragrafo.id}
                                      >
                                        {gerandoExplicacao === paragrafo.id ? (
                                          <>
                                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                            Gerando...
                                          </>
                                        ) : (
                                          <>
                                            <Sparkles className="w-4 h-4 mr-1" />
                                            IA Explicar
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                    <Textarea
                                      value={paragrafo.imagem_explicacao || ""}
                                      onChange={(e) => atualizarParagrafo(paragrafo.id, "imagem_explicacao", e.target.value)}
                                      placeholder="A explicação da imagem aparecerá aqui após clicar em 'IA Explicar' ou digite manualmente..."
                                      className="bg-zinc-900 border-zinc-600 min-h-[60px]"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )})}
                    </div>
                  )}
                </div>
                )}
              </div>
            ) : (
              <p className="text-zinc-500 text-center py-8">
                Selecione ou crie um estudo para editar
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
