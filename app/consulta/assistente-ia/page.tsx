"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  MessageSquare, 
  BookOpen, 
  Users, 
  Loader2, 
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  Lightbulb,
  Target,
  Clock,
  Book
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Comentario {
  texto: string
  tipo: string
}

interface PreparacaoMinisterio {
  introducao?: string
  perguntasSondagem?: string[]
  textosBiblicos?: { referencia: string; aplicacao: string }[]
  transicaoProximaVisita?: string
  materiaisSugeridos?: string[]
  apresentacoes?: {
    abertura: string
    pergunta: string
    textoBiblico: string
    oferta: string
    fechamento: string
  }[]
  dicasGerais?: string[]
  revisaoAnterior?: string[]
  pontosPrincipais?: { ponto: string; textoBase: string; explicacao: string }[]
  ilustracoes?: { conceito: string; ilustracao: string }[]
  aplicacaoPratica?: string[]
  encorajamento?: string
}

interface PreparacaoParte {
  pontosPrincipais?: { ponto: string; porque: string }[]
  ilustracoes?: { ideia: string; como_usar: string }[]
  perguntasAudiencia?: string[]
  dicasApresentacao?: { dica: string; exemplo: string }[]
  textosBiblicos?: { referencia: string; aplicacao: string }[]
  checklistPreparacao?: string[]
  tempoSugerido?: { introducao: string; desenvolvimento: string; conclusao: string }
}

export default function AssistenteIAPage() {
  // Estado para Comentários
  const [temaComentario, setTemaComentario] = useState("")
  const [paragrafoNum, setParagrafoNum] = useState("")
  const [perguntaComentario, setPerguntaComentario] = useState("")
  const [textoBaseComentario, setTextoBaseComentario] = useState("")
  const [comentariosGerados, setComentariosGerados] = useState<Comentario[]>([])
  const [gerandoComentarios, setGerandoComentarios] = useState(false)
  const [textosBiblicosComentario, setTextosBiblicosComentario] = useState<string[]>([])
  const [pontoChave, setPontoChave] = useState("")

  // Estado para Ministério
  const [tipoMinisterio, setTipoMinisterio] = useState<"revisita" | "estudo_biblico" | "apresentacao_inicial">("apresentacao_inicial")
  const [contextoMinisterio, setContextoMinisterio] = useState("")
  const [situacaoMinisterio, setSituacaoMinisterio] = useState("")
  const [preparacaoMinisterio, setPreparacaoMinisterio] = useState<PreparacaoMinisterio | null>(null)
  const [gerandoMinisterio, setGerandoMinisterio] = useState(false)

  // Estado para Preparador de Partes
  const [tituloParte, setTituloParte] = useState("")
  const [secaoParte, setSecaoParte] = useState("")
  const [tempoParte, setTempoParte] = useState("")
  const [textoBaseParte, setTextoBaseParte] = useState("")
  const [preparacaoParte, setPreparacaoParte] = useState<PreparacaoParte | null>(null)
  const [gerandoParte, setGerandoParte] = useState(false)

  const [copiado, setCopiado] = useState<string | null>(null)

  const copiarTexto = (texto: string, id: string) => {
    navigator.clipboard.writeText(texto)
    setCopiado(id)
    toast.success("Copiado!")
    setTimeout(() => setCopiado(null), 2000)
  }

  // Gerar comentários
  const gerarComentarios = async () => {
    if (!perguntaComentario) {
      toast.error("Informe pelo menos a pergunta do paragrafo")
      return
    }

    setGerandoComentarios(true)
    try {
      const response = await fetch("/api/ia/assistente-comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "comentario_sentinela",
          tema: temaComentario,
          paragrafo: paragrafoNum,
          pergunta: perguntaComentario,
          textoBase: textoBaseComentario
        })
      })

      if (response.ok) {
        const data = await response.json()
        setComentariosGerados(data.comentarios || [])
        setTextosBiblicosComentario(data.textosBiblicos || [])
        setPontoChave(data.pontoChave || "")
        toast.success("Comentarios gerados!")
      } else {
        toast.error("Erro ao gerar comentarios")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao gerar comentarios")
    } finally {
      setGerandoComentarios(false)
    }
  }

  // Gerar preparação ministério
  const gerarPreparacaoMinisterio = async () => {
    setGerandoMinisterio(true)
    try {
      const response = await fetch("/api/ia/preparacao-ministerio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: tipoMinisterio,
          contexto: contextoMinisterio,
          situacao: situacaoMinisterio
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPreparacaoMinisterio(data)
        toast.success("Preparacao gerada!")
      } else {
        toast.error("Erro ao gerar preparacao")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao gerar preparacao")
    } finally {
      setGerandoMinisterio(false)
    }
  }

  // Gerar preparação de parte
  const gerarPreparacaoParte = async () => {
    if (!tituloParte) {
      toast.error("Informe o titulo da parte")
      return
    }

    setGerandoParte(true)
    try {
      const response = await fetch("/api/ia/preparador-partes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: tituloParte,
          secao: secaoParte,
          tempo: tempoParte,
          textoBase: textoBaseParte
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPreparacaoParte(data)
        toast.success("Preparacao gerada!")
      } else {
        toast.error("Erro ao gerar preparacao")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao gerar preparacao")
    } finally {
      setGerandoParte(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600">
              <Brain className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Assistente IA
          </h1>
          <p className="text-sm text-muted-foreground">
            Ferramentas de IA para ajudar na preparacao de reunioes e ministerio
          </p>
        </div>

        {/* Tabs principais */}
        <Tabs defaultValue="comentarios" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comentarios" className="gap-1 text-xs md:text-sm">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Comentarios</span>
            </TabsTrigger>
            <TabsTrigger value="ministerio" className="gap-1 text-xs md:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Ministerio</span>
            </TabsTrigger>
            <TabsTrigger value="partes" className="gap-1 text-xs md:text-sm">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Minhas Partes</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Comentários */}
          <TabsContent value="comentarios" className="mt-4 space-y-4">
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Assistente de Comentarios
                </CardTitle>
                <CardDescription>
                  Gere sugestoes de comentarios para o Estudo de A Sentinela ou Vida e Ministerio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tema do Artigo</Label>
                    <Input
                      value={temaComentario}
                      onChange={(e) => setTemaComentario(e.target.value)}
                      placeholder="Ex: Como fortalecer nossa fe"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Numero do Paragrafo</Label>
                    <Input
                      value={paragrafoNum}
                      onChange={(e) => setParagrafoNum(e.target.value)}
                      placeholder="Ex: 5"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pergunta do Paragrafo *</Label>
                  <Textarea
                    value={perguntaComentario}
                    onChange={(e) => setPerguntaComentario(e.target.value)}
                    placeholder="Cole aqui a pergunta do paragrafo..."
                    className="bg-zinc-800 border-zinc-700 min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Texto do Paragrafo (opcional)</Label>
                  <Textarea
                    value={textoBaseComentario}
                    onChange={(e) => setTextoBaseComentario(e.target.value)}
                    placeholder="Cole aqui o texto do paragrafo para respostas mais precisas..."
                    className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={gerarComentarios}
                  disabled={gerandoComentarios}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  {gerandoComentarios ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Gerar Sugestoes de Comentarios
                </Button>

                {/* Resultados */}
                {comentariosGerados.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-zinc-800">
                    {pontoChave && (
                      <div className="p-3 rounded-lg bg-amber-600/10 border border-amber-600/20">
                        <p className="text-sm font-medium text-amber-400 flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          Ponto-chave do paragrafo
                        </p>
                        <p className="text-sm text-amber-200 mt-1">{pontoChave}</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <p className="text-sm font-medium text-zinc-400">Sugestoes de Comentarios:</p>
                      {comentariosGerados.map((comentario, idx) => (
                        <div 
                          key={idx} 
                          className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <Badge variant="outline" className="text-xs mb-2 capitalize">
                                {comentario.tipo}
                              </Badge>
                              <p className="text-sm text-zinc-200">{comentario.texto}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copiarTexto(comentario.texto, `com-${idx}`)}
                              className="shrink-0"
                            >
                              {copiado === `com-${idx}` ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {textosBiblicosComentario.length > 0 && (
                      <div className="p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
                        <p className="text-sm font-medium text-blue-400 flex items-center gap-1">
                          <Book className="h-4 w-4" />
                          Textos Biblicos Relacionados
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {textosBiblicosComentario.map((texto, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-blue-600/20 text-blue-300">
                              {texto}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Ministério */}
          <TabsContent value="ministerio" className="mt-4 space-y-4">
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Preparacao para o Ministerio
                </CardTitle>
                <CardDescription>
                  Roteiros de apresentacoes, revisitas e estudos biblicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tipo de Ministério */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={tipoMinisterio === "apresentacao_inicial" ? "default" : "outline"}
                    onClick={() => setTipoMinisterio("apresentacao_inicial")}
                    className={cn(
                      "h-auto py-3 flex-col gap-1",
                      tipoMinisterio === "apresentacao_inicial" && "bg-green-600 hover:bg-green-700"
                    )}
                  >
                    <Users className="h-5 w-5" />
                    <span className="text-xs">Apresentacao</span>
                  </Button>
                  <Button
                    variant={tipoMinisterio === "revisita" ? "default" : "outline"}
                    onClick={() => setTipoMinisterio("revisita")}
                    className={cn(
                      "h-auto py-3 flex-col gap-1",
                      tipoMinisterio === "revisita" && "bg-green-600 hover:bg-green-700"
                    )}
                  >
                    <ChevronRight className="h-5 w-5" />
                    <span className="text-xs">Revisita</span>
                  </Button>
                  <Button
                    variant={tipoMinisterio === "estudo_biblico" ? "default" : "outline"}
                    onClick={() => setTipoMinisterio("estudo_biblico")}
                    className={cn(
                      "h-auto py-3 flex-col gap-1",
                      tipoMinisterio === "estudo_biblico" && "bg-green-600 hover:bg-green-700"
                    )}
                  >
                    <BookOpen className="h-5 w-5" />
                    <span className="text-xs">Estudo</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>
                    {tipoMinisterio === "apresentacao_inicial" && "Tema da Apresentacao"}
                    {tipoMinisterio === "revisita" && "Contexto da Revisita"}
                    {tipoMinisterio === "estudo_biblico" && "Tema do Estudo"}
                  </Label>
                  <Input
                    value={contextoMinisterio}
                    onChange={(e) => setContextoMinisterio(e.target.value)}
                    placeholder={
                      tipoMinisterio === "apresentacao_inicial" 
                        ? "Ex: O proposito da vida" 
                        : tipoMinisterio === "revisita"
                        ? "Ex: Pessoa interessada em saber mais sobre a Biblia"
                        : "Ex: Estudo do livro Desfrute a Vida"
                    }
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Situacao Especifica (opcional)</Label>
                  <Textarea
                    value={situacaoMinisterio}
                    onChange={(e) => setSituacaoMinisterio(e.target.value)}
                    placeholder="Descreva a situacao ou caracteristicas do morador/estudante..."
                    className="bg-zinc-800 border-zinc-700 min-h-[80px]"
                  />
                </div>

                <Button
                  onClick={gerarPreparacaoMinisterio}
                  disabled={gerandoMinisterio}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {gerandoMinisterio ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Gerar Roteiro com IA
                </Button>

                {/* Resultados Ministério */}
                {preparacaoMinisterio && (
                  <div className="space-y-4 pt-4 border-t border-zinc-800">
                    {/* Apresentações */}
                    {preparacaoMinisterio.apresentacoes && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-zinc-400">Opcoes de Apresentacao:</p>
                        {preparacaoMinisterio.apresentacoes.map((apres, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 space-y-3">
                            <Badge className="bg-green-600/20 text-green-400">Opcao {idx + 1}</Badge>
                            <div className="space-y-2 text-sm">
                              <p><span className="text-green-400 font-medium">Abertura:</span> {apres.abertura}</p>
                              <p><span className="text-blue-400 font-medium">Pergunta:</span> {apres.pergunta}</p>
                              <p><span className="text-amber-400 font-medium">Texto:</span> {apres.textoBiblico}</p>
                              <p><span className="text-purple-400 font-medium">Oferta:</span> {apres.oferta}</p>
                              <p><span className="text-cyan-400 font-medium">Fechamento:</span> {apres.fechamento}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copiarTexto(
                                `${apres.abertura}\n\nPergunta: ${apres.pergunta}\n\nTexto: ${apres.textoBiblico}\n\nOferta: ${apres.oferta}\n\n${apres.fechamento}`,
                                `apres-${idx}`
                              )}
                            >
                              {copiado === `apres-${idx}` ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                              Copiar
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Revisita */}
                    {preparacaoMinisterio.introducao && (
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-green-600/10 border border-green-600/20">
                          <p className="text-sm font-medium text-green-400">Introducao</p>
                          <p className="text-sm text-green-200 mt-1">{preparacaoMinisterio.introducao}</p>
                        </div>

                        {preparacaoMinisterio.perguntasSondagem && (
                          <div className="p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
                            <p className="text-sm font-medium text-blue-400">Perguntas de Sondagem</p>
                            <ul className="mt-2 space-y-1">
                              {preparacaoMinisterio.perguntasSondagem.map((p, i) => (
                                <li key={i} className="text-sm text-blue-200 flex items-start gap-2">
                                  <span className="text-blue-400">{i + 1}.</span> {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {preparacaoMinisterio.transicaoProximaVisita && (
                          <div className="p-3 rounded-lg bg-purple-600/10 border border-purple-600/20">
                            <p className="text-sm font-medium text-purple-400">Transicao para Proxima Visita</p>
                            <p className="text-sm text-purple-200 mt-1">{preparacaoMinisterio.transicaoProximaVisita}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Dicas Gerais */}
                    {preparacaoMinisterio.dicasGerais && (
                      <div className="p-3 rounded-lg bg-amber-600/10 border border-amber-600/20">
                        <p className="text-sm font-medium text-amber-400 flex items-center gap-1">
                          <Lightbulb className="h-4 w-4" />
                          Dicas
                        </p>
                        <ul className="mt-2 space-y-1">
                          {preparacaoMinisterio.dicasGerais.map((d, i) => (
                            <li key={i} className="text-sm text-amber-200">• {d}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Minhas Partes */}
          <TabsContent value="partes" className="mt-4 space-y-4">
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-violet-500" />
                  Preparador de Partes
                </CardTitle>
                <CardDescription>
                  Ajuda personalizada para preparar suas designacoes nas reunioes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Titulo da Parte *</Label>
                    <Input
                      value={tituloParte}
                      onChange={(e) => setTituloParte(e.target.value)}
                      placeholder="Ex: Faca revisitas para fazer discipulos"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Secao</Label>
                    <Input
                      value={secaoParte}
                      onChange={(e) => setSecaoParte(e.target.value)}
                      placeholder="Ex: Faca Seu Melhor no Ministerio"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tempo da Parte</Label>
                  <Input
                    value={tempoParte}
                    onChange={(e) => setTempoParte(e.target.value)}
                    placeholder="Ex: 4 min"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Conteudo Base (opcional)</Label>
                  <Textarea
                    value={textoBaseParte}
                    onChange={(e) => setTextoBaseParte(e.target.value)}
                    placeholder="Cole aqui instrucoes ou conteudo adicional da parte..."
                    className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={gerarPreparacaoParte}
                  disabled={gerandoParte}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                >
                  {gerandoParte ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Preparar Minha Parte com IA
                </Button>

                {/* Resultados Parte */}
                {preparacaoParte && (
                  <div className="space-y-4 pt-4 border-t border-zinc-800">
                    {/* Tempo Sugerido */}
                    {preparacaoParte.tempoSugerido && (
                      <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                        <p className="text-sm font-medium text-zinc-400 flex items-center gap-1 mb-2">
                          <Clock className="h-4 w-4" />
                          Distribuicao de Tempo
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 rounded bg-blue-600/10">
                            <p className="text-xs text-blue-400">Introducao</p>
                            <p className="text-sm font-medium text-blue-200">{preparacaoParte.tempoSugerido.introducao}</p>
                          </div>
                          <div className="p-2 rounded bg-green-600/10">
                            <p className="text-xs text-green-400">Desenvolvimento</p>
                            <p className="text-sm font-medium text-green-200">{preparacaoParte.tempoSugerido.desenvolvimento}</p>
                          </div>
                          <div className="p-2 rounded bg-amber-600/10">
                            <p className="text-xs text-amber-400">Conclusao</p>
                            <p className="text-sm font-medium text-amber-200">{preparacaoParte.tempoSugerido.conclusao}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pontos Principais */}
                    {preparacaoParte.pontosPrincipais && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-violet-400 flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          Pontos Principais
                        </p>
                        {preparacaoParte.pontosPrincipais.map((p, i) => (
                          <div key={i} className="p-3 rounded-lg bg-violet-600/10 border border-violet-600/20">
                            <p className="text-sm font-medium text-violet-200">{p.ponto}</p>
                            <p className="text-xs text-violet-400 mt-1">{p.porque}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Ilustrações */}
                    {preparacaoParte.ilustracoes && preparacaoParte.ilustracoes.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-amber-400 flex items-center gap-1">
                          <Lightbulb className="h-4 w-4" />
                          Ilustracoes Sugeridas
                        </p>
                        {preparacaoParte.ilustracoes.map((il, i) => (
                          <div key={i} className="p-3 rounded-lg bg-amber-600/10 border border-amber-600/20">
                            <p className="text-sm font-medium text-amber-200">{il.ideia}</p>
                            <p className="text-xs text-amber-400 mt-1">Como usar: {il.como_usar}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dicas de Apresentação */}
                    {preparacaoParte.dicasApresentacao && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-cyan-400">Dicas de Apresentacao</p>
                        {preparacaoParte.dicasApresentacao.map((d, i) => (
                          <div key={i} className="p-3 rounded-lg bg-cyan-600/10 border border-cyan-600/20">
                            <p className="text-sm font-medium text-cyan-200">{d.dica}</p>
                            <p className="text-xs text-cyan-400 mt-1">Exemplo: {d.exemplo}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Textos Bíblicos */}
                    {preparacaoParte.textosBiblicos && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-blue-400 flex items-center gap-1">
                          <Book className="h-4 w-4" />
                          Textos Biblicos
                        </p>
                        {preparacaoParte.textosBiblicos.map((t, i) => (
                          <div key={i} className="p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
                            <p className="text-sm font-medium text-blue-200">{t.referencia}</p>
                            <p className="text-xs text-blue-400 mt-1">{t.aplicacao}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Checklist */}
                    {preparacaoParte.checklistPreparacao && (
                      <div className="p-3 rounded-lg bg-green-600/10 border border-green-600/20">
                        <p className="text-sm font-medium text-green-400 flex items-center gap-1 mb-2">
                          <Check className="h-4 w-4" />
                          Checklist de Preparacao
                        </p>
                        <ul className="space-y-1">
                          {preparacaoParte.checklistPreparacao.map((item, i) => (
                            <li key={i} className="text-sm text-green-200 flex items-center gap-2">
                              <input type="checkbox" className="rounded border-green-600/50" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
