"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, CheckCircle2, AlertCircle, BookOpen, Wand2, User, BookMarked } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Paragrafo = {
  numero: string
  textoBase: string | null
  pergunta: string
  resposta: string | null
  ordem: number
}

type DadosSentinela = {
  dataInicio: string | null
  dataFim: string | null
  titulo: string
  textoTema: string | null
  canticoInicial: number | null
  canticoFinal: number | null
  objetivo: string | null
  paragrafos: Paragrafo[]
}

type Publicador = {
  id: string
  nome: string
}

type RegistroExistente = {
  id: string
  dataInicio: string
}

export default function ImportarSentinelaPage() {
  const [texto, setTexto] = useState("")
  const [processando, setProcessando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [dados, setDados] = useState<DadosSentinela | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarModalAtualizar, setMostrarModalAtualizar] = useState(false)
  const [registroExistente, setRegistroExistente] = useState<RegistroExistente | null>(null)
  
  // Dirigente e Leitor
  const [publicadores, setPublicadores] = useState<Publicador[]>([])
  const [dirigenteId, setDirigenteId] = useState<string>("")
  const [leitorId, setLeitorId] = useState<string>("")
  
  // Estado para geração de respostas
  const [gerandoRespostas, setGerandoRespostas] = useState(false)
  const [progressoRespostas, setProgressoRespostas] = useState(0)

  const router = useRouter()
  const supabase = createClient()

  // Carregar publicadores
  useEffect(() => {
    async function carregarPublicadores() {
      const { data } = await supabase
        .from("publicadores")
        .select("id, nome")
        .order("nome")
      
      if (data) setPublicadores(data)
    }
    carregarPublicadores()
  }, [supabase])

  async function processarTexto() {
    if (!texto.trim()) {
      toast.error("Cole o texto da Sentinela primeiro")
      return
    }

    setProcessando(true)
    setErro(null)
    setDados(null)

    try {
      const response = await fetch("/api/importar-reuniao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, tipoEsperado: "sentinela" })
      })

      if (!response.ok) {
        throw new Error("Erro ao processar o texto")
      }

      const resultado = await response.json()
      
      if (resultado.erro) {
        setErro(resultado.erro)
      } else if (resultado.tipo !== "sentinela") {
        setErro("O texto informado nao parece ser de um estudo da Sentinela. Por favor, verifique o conteudo.")
      } else {
        // Remover o campo "tipo" e manter só os dados da sentinela
        const { tipo, ...dadosSentinela } = resultado
        setDados(dadosSentinela)
        toast.success("Texto processado com sucesso!")
      }
    } catch {
      setErro("Erro ao processar o texto. Verifique se o formato esta correto e tente novamente.")
    } finally {
      setProcessando(false)
    }
  }

  // Gerar todas as respostas com IA
  async function gerarTodasRespostas() {
    if (!dados || !dados.paragrafos || dados.paragrafos.length === 0) return
    
    setGerandoRespostas(true)
    setProgressoRespostas(0)
    toast.loading("Gerando respostas com IA...", { id: "gerando-respostas" })
    
    const novosParagrafos = [...dados.paragrafos]
    
    try {
      for (let i = 0; i < novosParagrafos.length; i++) {
        const paragrafo = novosParagrafos[i]
        
        const response = await fetch("/api/gerar-resposta-ia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "resposta_paragrafo",
            pergunta: paragrafo.pergunta,
            textoBase: paragrafo.textoBase,
            contexto: dados.titulo
          })
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.resposta) {
            novosParagrafos[i] = { ...paragrafo, resposta: result.resposta }
          }
        }
        
        setProgressoRespostas(Math.round(((i + 1) / novosParagrafos.length) * 100))
      }
      
      setDados({ ...dados, paragrafos: novosParagrafos })
      toast.dismiss("gerando-respostas")
      toast.success(`${novosParagrafos.length} respostas geradas com sucesso!`)
    } catch (error) {
      console.error("Erro ao gerar respostas:", error)
      toast.dismiss("gerando-respostas")
      toast.error("Erro ao gerar respostas")
    } finally {
      setGerandoRespostas(false)
      setProgressoRespostas(0)
    }
  }

  async function verificarExistente(): Promise<RegistroExistente | null> {
    if (!dados || !dados.dataInicio) return null

    const { data: estudoExistente } = await supabase
      .from("sentinela_estudos")
      .select("id")
      .eq("data_inicio", dados.dataInicio)
      .maybeSingle()

    if (estudoExistente) {
      return { id: estudoExistente.id, dataInicio: dados.dataInicio }
    }

    return null
  }

  async function salvarDados(forcarAtualizacao = false) {
    if (!dados) return

    setSalvando(true)
    toast.loading("Salvando estudo...", { id: "salvando" })

    try {
      // Verificar se já existe
      if (!forcarAtualizacao) {
        const existente = await verificarExistente()
        if (existente) {
          setRegistroExistente(existente)
          setMostrarModalAtualizar(true)
          setSalvando(false)
          toast.dismiss("salvando")
          return
        }
      }

      // Pegar nomes do dirigente e leitor
      const dirigente = publicadores.find(p => p.id === dirigenteId)
      const leitor = publicadores.find(p => p.id === leitorId)

      let estudoId: string

      if (forcarAtualizacao && registroExistente) {
        // Atualizar estudo existente
        const { error: erroEstudo } = await supabase
          .from("sentinela_estudos")
          .update({
            data_fim: dados.dataFim,
            titulo: dados.titulo,
            texto_tema: dados.textoTema,
            cantico_inicial: dados.canticoInicial,
            cantico_final: dados.canticoFinal,
            objetivo: dados.objetivo,
            dirigente_id: dirigenteId || null,
            dirigente_nome: dirigente?.nome || null,
            leitor_id: leitorId || null,
            leitor_nome: leitor?.nome || null
          })
          .eq("id", registroExistente.id)

        if (erroEstudo) throw erroEstudo
        estudoId = registroExistente.id

        // Deletar parágrafos antigos
        const { error: erroDelete } = await supabase
          .from("sentinela_paragrafos")
          .delete()
          .eq("estudo_id", estudoId)
        
        if (erroDelete) throw erroDelete

      } else {
        // Contar estudos existentes para definir o número
        const { count } = await supabase
          .from("sentinela_estudos")
          .select("*", { count: "exact", head: true })

        // Criar novo estudo
        const { data: novoEstudo, error: erroEstudo } = await supabase
          .from("sentinela_estudos")
          .insert({
            numero: (count || 0) + 1,
            data_inicio: dados.dataInicio,
            data_fim: dados.dataFim,
            titulo: dados.titulo,
            texto_tema: dados.textoTema,
            cantico_inicial: dados.canticoInicial,
            cantico_final: dados.canticoFinal,
            objetivo: dados.objetivo,
            dirigente_id: dirigenteId || null,
            dirigente_nome: dirigente?.nome || null,
            leitor_id: leitorId || null,
            leitor_nome: leitor?.nome || null
          })
          .select("id")
          .single()

        if (erroEstudo) throw erroEstudo
        estudoId = novoEstudo.id
      }

      // Inserir parágrafos
      if (dados.paragrafos && dados.paragrafos.length > 0) {
        const paragrafosParaInserir = dados.paragrafos.map(p => ({
          estudo_id: estudoId,
          numero: p.numero,
          texto_base: p.textoBase,
          pergunta: p.pergunta,
          resposta: p.resposta,
          ordem: p.ordem
        }))

        const { error: erroParagrafos } = await supabase
          .from("sentinela_paragrafos")
          .insert(paragrafosParaInserir)

        if (erroParagrafos) throw erroParagrafos
      }

      toast.dismiss("salvando")
      toast.success(forcarAtualizacao ? "Estudo atualizado com sucesso!" : "Estudo salvo com sucesso!")
      
      // Limpar estado e redirecionar
      setDados(null)
      setTexto("")
      setDirigenteId("")
      setLeitorId("")
      setMostrarModalAtualizar(false)
      setRegistroExistente(null)
      
      router.push("/admin/sentinela")

    } catch (error: unknown) {
      toast.dismiss("salvando")
      const errorObj = error as { code?: string; message?: string; details?: string }
      const errorMessage = errorObj?.message || errorObj?.details || "Erro desconhecido ao salvar"
      toast.error("Erro ao salvar", { duration: 5000, description: errorMessage })
    } finally {
      setSalvando(false)
    }
  }

  function limparDados() {
    setTexto("")
    setDados(null)
    setErro(null)
    setDirigenteId("")
    setLeitorId("")
    setRegistroExistente(null)
  }

  const respostasGeradas = dados?.paragrafos?.filter(p => p.resposta)?.length || 0
  const totalParagrafos = dados?.paragrafos?.length || 0

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600">
          <BookMarked className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Importar Sentinela</h1>
          <p className="text-sm text-muted-foreground">
            Cole o texto do estudo e a IA gerara as respostas automaticamente
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna Esquerda - Input */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-violet-500" />
              Texto do Estudo
            </CardTitle>
            <CardDescription>
              Copie o texto completo do estudo da Sentinela do JW Library ou jw.org
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Seleção de Dirigente e Leitor */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-sm">
                  <User className="h-4 w-4" />
                  Dirigente
                </Label>
                <Select value={dirigenteId} onValueChange={setDirigenteId}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {publicadores.map(pub => (
                      <SelectItem key={pub.id} value={pub.id}>
                        {pub.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-sm">
                  <BookOpen className="h-4 w-4" />
                  Leitor
                </Label>
                <Select value={leitorId} onValueChange={setLeitorId}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {publicadores.map(pub => (
                      <SelectItem key={pub.id} value={pub.id}>
                        {pub.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Cole aqui o texto completo do estudo da Sentinela..."
              className="min-h-[300px] bg-zinc-900 border-zinc-700 resize-none font-mono text-sm"
            />
            
            <div className="flex gap-2">
              <Button
                onClick={processarTexto}
                disabled={processando || !texto.trim()}
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                {processando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Processar com IA
                  </>
                )}
              </Button>
              
              {(dados || texto) && (
                <Button variant="outline" onClick={limparDados}>
                  Limpar
                </Button>
              )}
            </div>

            {erro && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{erro}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coluna Direita - Preview */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Preview do Estudo
            </CardTitle>
            <CardDescription>
              Visualize os dados extraidos antes de salvar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dados ? (
              <div className="space-y-4">
                {/* Info do Estudo */}
                <div className="p-3 rounded-lg bg-zinc-800/50 space-y-2">
                  <h3 className="font-semibold text-white">{dados.titulo}</h3>
                  {dados.textoTema && (
                    <p className="text-sm text-amber-400 italic">"{dados.textoTema}"</p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline">
                      {dados.dataInicio} - {dados.dataFim}
                    </Badge>
                    {dados.canticoInicial && (
                      <Badge variant="outline">Cantico {dados.canticoInicial}</Badge>
                    )}
                    {dados.canticoFinal && (
                      <Badge variant="outline">Cantico {dados.canticoFinal}</Badge>
                    )}
                  </div>
                </div>

                {/* Botão Gerar Respostas */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-violet-600/10 border border-violet-600/20">
                  <div>
                    <p className="text-sm font-medium text-violet-400">Respostas com IA</p>
                    <p className="text-xs text-zinc-400">
                      {respostasGeradas}/{totalParagrafos} respostas geradas
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={gerarTodasRespostas}
                    disabled={gerandoRespostas || totalParagrafos === 0}
                    className="border-violet-600/30 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400"
                  >
                    {gerandoRespostas ? (
                      <>
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        {progressoRespostas}%
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-1 h-4 w-4" />
                        Gerar Todas
                      </>
                    )}
                  </Button>
                </div>

                {/* Parágrafos */}
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                  <p className="text-sm font-medium text-muted-foreground sticky top-0 bg-zinc-900/90 py-1">
                    Paragrafos ({totalParagrafos}):
                  </p>
                  {dados.paragrafos.map((p, idx) => (
                    <div key={idx} className="p-3 rounded bg-zinc-800/30 text-sm space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <span className="font-medium text-blue-400">Par. {p.numero}:</span>
                          <p className="text-zinc-300 mt-1">{p.pergunta}</p>
                        </div>
                        {p.resposta && (
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      {p.resposta && (
                        <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                          <p className="text-xs text-green-200">{p.resposta}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Botão Salvar */}
                <Button
                  onClick={() => salvarDados(false)}
                  disabled={salvando}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {salvando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Salvar Estudo
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <BookMarked className="h-16 w-16 text-zinc-700 mb-4" />
                <p className="text-zinc-500">
                  Cole o texto do estudo da Sentinela e clique em "Processar com IA"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmação para Atualizar */}
      <AlertDialog open={mostrarModalAtualizar} onOpenChange={setMostrarModalAtualizar}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Estudo ja existe</AlertDialogTitle>
            <AlertDialogDescription>
              Ja existe um estudo da Sentinela cadastrado para a data {registroExistente?.dataInicio}.
              Deseja atualizar os dados existentes?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => salvarDados(true)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Atualizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
