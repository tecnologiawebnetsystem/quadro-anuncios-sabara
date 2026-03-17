"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, CheckCircle2, AlertCircle, BookOpen, FileText, Trash2, RefreshCw, Wand2, ImagePlus, Brain } from "lucide-react"
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

type VidaMinisterio = {
  tipo: "vida_ministerio"
  dataInicio: string | null
  dataFim: string | null
  leituraSemanal: string | null
  canticoInicial: number | null
  canticoInicialNome: string | null
  canticoMeio: number | null
  canticoMeioNome: string | null
  canticoFinal: number | null
  canticoFinalNome: string | null
  partes: Array<{
    secao: string
    titulo: string
    tempo: string | null
    ordem: number
  }>
}

type Sentinela = {
  tipo: "sentinela"
  dataInicio: string | null
  dataFim: string | null
  titulo: string
  textoTema: string | null
  canticoInicial: number | null
  canticoInicialNome: string | null
  canticoFinal: number | null
  canticoFinalNome: string | null
  objetivo: string | null
  paragrafos: Array<{
    numero: string
    textoBase: string | null
    pergunta: string
    resposta: string | null
    ordem: number
  }>
}

type DadosReuniao = VidaMinisterio | Sentinela

type RegistroExistente = {
  id: string
  tipo: "vida_ministerio" | "sentinela"
  dataInicio: string
}

export default function ImportarPage() {
  const [texto, setTexto] = useState("")
  const [processando, setProcessando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [dados, setDados] = useState<DadosReuniao | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarModalAtualizar, setMostrarModalAtualizar] = useState(false)
  const [registroExistente, setRegistroExistente] = useState<RegistroExistente | null>(null)
  
  // Estados para funcionalidades de IA
  const [gerandoRespostas, setGerandoRespostas] = useState(false)
  const [gerandoAplicacoes, setGerandoAplicacoes] = useState(false)
  const [aplicacoesGeradas, setAplicacoesGeradas] = useState<Record<number, string[]>>({})
  const [respostasGeradas, setRespostasGeradas] = useState<Record<number, string>>({})
  const [uploadandoImagem, setUploadandoImagem] = useState(false)
  const [imagemUrl, setImagemUrl] = useState<string | null>(null)
  const [analisandoImagem, setAnalisandoImagem] = useState(false)
  const [analiseImagem, setAnaliseImagem] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  async function processarTexto() {
    if (!texto.trim()) {
      toast.error("Cole o texto da reuniao primeiro")
      return
    }

    setProcessando(true)
    setErro(null)
    setDados(null)

    try {
      const response = await fetch("/api/importar-reuniao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto })
      })

      if (!response.ok) {
        throw new Error("Erro ao processar o texto")
      }

      const resultado = await response.json()
      
      if (resultado.erro) {
        setErro(resultado.erro)
      } else {
        setDados(resultado)
        toast.success("Texto processado com sucesso!")
      }
    } catch {
      setErro("Erro ao processar o texto. Verifique se o formato esta correto e tente novamente.")
    } finally {
      setProcessando(false)
    }
  }

  async function verificarExistente(): Promise<RegistroExistente | null> {
    if (!dados || !dados.dataInicio) return null

    if (dados.tipo === "vida_ministerio") {
      const { data: semanaExistente } = await supabase
        .from("vida_ministerio_semanas")
        .select("id")
        .eq("data_inicio", dados.dataInicio)
        .maybeSingle()

      if (semanaExistente) {
        return { id: semanaExistente.id, tipo: "vida_ministerio", dataInicio: dados.dataInicio }
      }
    } else if (dados.tipo === "sentinela") {
      const { data: estudoExistente } = await supabase
        .from("sentinela_estudos")
        .select("id")
        .eq("data_inicio", dados.dataInicio)
        .maybeSingle()

      if (estudoExistente) {
        return { id: estudoExistente.id, tipo: "sentinela", dataInicio: dados.dataInicio }
      }
    }

    return null
  }

  // Gerar respostas com IA para parágrafos da Sentinela
  async function gerarRespostasIA() {
    if (!dados || dados.tipo !== "sentinela" || !dados.paragrafos) return
    
    setGerandoRespostas(true)
    toast.loading("Gerando respostas com IA...", { id: "gerando-respostas" })
    
    const novasRespostas: Record<number, string> = {}
    
    try {
      for (let i = 0; i < dados.paragrafos.length; i++) {
        const paragrafo = dados.paragrafos[i]
        
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
            novasRespostas[i] = result.resposta
          }
        }
      }
      
      setRespostasGeradas(novasRespostas)
      
      // Atualizar os dados com as respostas geradas
      if (dados.tipo === "sentinela") {
        const novosParagrafos = dados.paragrafos.map((p, idx) => ({
          ...p,
          resposta: novasRespostas[idx] || p.resposta
        }))
        setDados({ ...dados, paragrafos: novosParagrafos })
      }
      
      toast.dismiss("gerando-respostas")
      toast.success(`${Object.keys(novasRespostas).length} respostas geradas com sucesso!`)
    } catch (error) {
      console.error("Erro ao gerar respostas:", error)
      toast.dismiss("gerando-respostas")
      toast.error("Erro ao gerar respostas")
    } finally {
      setGerandoRespostas(false)
    }
  }

  // Gerar textos de aplicação para Vida e Ministério
  async function gerarAplicacoesIA(parteIndex: number, titulo: string) {
    setGerandoAplicacoes(true)
    toast.loading("Gerando aplicacoes praticas...", { id: "gerando-aplicacoes" })
    
    try {
      const response = await fetch("/api/gerar-resposta-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "aplicacao_vida",
          contexto: titulo
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.aplicacoes) {
          setAplicacoesGeradas(prev => ({
            ...prev,
            [parteIndex]: result.aplicacoes
          }))
          toast.dismiss("gerando-aplicacoes")
          toast.success("Aplicacoes praticas geradas!")
        }
      }
    } catch (error) {
      console.error("Erro ao gerar aplicacoes:", error)
      toast.dismiss("gerando-aplicacoes")
      toast.error("Erro ao gerar aplicacoes")
    } finally {
      setGerandoAplicacoes(false)
    }
  }

  // Upload de imagem
  async function uploadImagem(file: File) {
    setUploadandoImagem(true)
    toast.loading("Enviando imagem...", { id: "upload-imagem" })
    
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const response = await fetch("/api/upload-imagem", {
        method: "POST",
        body: formData
      })
      
      if (response.ok) {
        const result = await response.json()
        setImagemUrl(result.url)
        toast.dismiss("upload-imagem")
        toast.success("Imagem enviada com sucesso!")
      } else {
        const error = await response.json()
        toast.dismiss("upload-imagem")
        toast.error(error.erro || "Erro no upload")
      }
    } catch (error) {
      console.error("Erro no upload:", error)
      toast.dismiss("upload-imagem")
      toast.error("Erro ao enviar imagem")
    } finally {
      setUploadandoImagem(false)
    }
  }

  // Analisar imagem com IA
  async function analisarImagemIA() {
    if (!imagemUrl) return
    
    setAnalisandoImagem(true)
    toast.loading("Analisando imagem com IA...", { id: "analisando-imagem" })
    
    try {
      const contexto = dados?.tipo === "vida_ministerio" 
        ? dados.partes?.[0]?.titulo 
        : dados?.tipo === "sentinela" 
          ? dados.titulo 
          : ""
      
      const response = await fetch("/api/gerar-resposta-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "analise_imagem",
          imagemUrl,
          contexto
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setAnaliseImagem(result.resposta)
        toast.dismiss("analisando-imagem")
        toast.success("Imagem analisada!")
      }
    } catch (error) {
      console.error("Erro ao analisar imagem:", error)
      toast.dismiss("analisando-imagem")
      toast.error("Erro ao analisar imagem")
    } finally {
      setAnalisandoImagem(false)
    }
  }

  async function salvarDados(forcarAtualizacao = false) {
    if (!dados) return

    setSalvando(true)
    toast.loading(forcarAtualizacao ? "Atualizando dados..." : "Salvando dados...", { id: "salvando" })

    try {
      // Verificar se já existe (somente se não estiver forçando atualização)
      if (!forcarAtualizacao) {
        const existente = await verificarExistente()
        if (existente) {
          setRegistroExistente(existente)
          setMostrarModalAtualizar(true)
          toast.dismiss("salvando")
          setSalvando(false)
          return
        }
      }

      if (dados.tipo === "vida_ministerio") {
        await salvarVidaMinisterio(forcarAtualizacao)
      } else if (dados.tipo === "sentinela") {
        await salvarSentinela(forcarAtualizacao)
      }

    } catch (error: unknown) {
      toast.dismiss("salvando")
      const errorObj = error as { code?: string; message?: string; details?: string }
      const errorMessage = errorObj?.message || errorObj?.details || "Erro desconhecido ao salvar"
      toast.error("Erro ao salvar", { duration: 5000, description: errorMessage })
    } finally {
      setSalvando(false)
    }
  }

  async function salvarVidaMinisterio(atualizar: boolean) {
    if (!dados || dados.tipo !== "vida_ministerio") return

    const dataInicio = dados.dataInicio ? new Date(dados.dataInicio) : new Date()
    const mes = dataInicio.getMonth() + 1
    const ano = dataInicio.getFullYear()

    // Buscar ou criar o mês
    let { data: mesExistente } = await supabase
      .from("vida_ministerio_meses")
      .select("id")
      .eq("mes", mes)
      .eq("ano", ano)
      .single()

    let mesId = mesExistente?.id

    if (!mesId) {
      const { data: novoMes, error: erroMes } = await supabase
        .from("vida_ministerio_meses")
        .insert({ mes, ano, cor_tema: "blue" })
        .select("id")
        .single()

      if (erroMes) throw erroMes
      mesId = novoMes.id
    }

    let semanaId: string

    if (atualizar && registroExistente) {
      // Atualizar semana existente
      const { error: erroSemana } = await supabase
        .from("vida_ministerio_semanas")
        .update({
          mes_id: mesId,
          data_fim: dados.dataFim,
          leitura_semanal: dados.leituraSemanal,
          cantico_inicial: dados.canticoInicial,
          cantico_inicial_nome: dados.canticoInicialNome,
          cantico_meio: dados.canticoMeio,
          cantico_meio_nome: dados.canticoMeioNome,
          cantico_final: dados.canticoFinal,
          cantico_final_nome: dados.canticoFinalNome
        })
        .eq("id", registroExistente.id)

      if (erroSemana) throw erroSemana
      semanaId = registroExistente.id

      // Deletar partes antigas
      const { error: erroDelete } = await supabase
        .from("vida_ministerio_partes")
        .delete()
        .eq("semana_id", semanaId)
      
      if (erroDelete) throw erroDelete

    } else {
      // Criar nova semana
      const { data: semana, error: erroSemana } = await supabase
        .from("vida_ministerio_semanas")
        .insert({
          mes_id: mesId,
          data_inicio: dados.dataInicio,
          data_fim: dados.dataFim,
          leitura_semanal: dados.leituraSemanal,
          cantico_inicial: dados.canticoInicial,
          cantico_inicial_nome: dados.canticoInicialNome,
          cantico_meio: dados.canticoMeio,
          cantico_meio_nome: dados.canticoMeioNome,
          cantico_final: dados.canticoFinal,
          cantico_final_nome: dados.canticoFinalNome
        })
        .select("id")
        .single()

      if (erroSemana) throw erroSemana
      semanaId = semana.id
    }

    // Mapeamento de nomes de seção para IDs
    const mapearSecao = (secaoNome: string): string => {
      const secaoLower = secaoNome.toLowerCase()
      if (secaoLower.includes("tesouros")) return "tesouros"
      if (secaoLower.includes("ministério") || secaoLower.includes("ministerio")) return "ministerio"
      if (secaoLower.includes("vida")) return "vida"
      return secaoNome // fallback
    }

    // Criar as partes
    if (dados.partes.length > 0) {
      const partesParaInserir = dados.partes.map(parte => ({
        semana_id: semanaId,
        secao: mapearSecao(parte.secao),
        titulo: parte.titulo,
        tempo: parte.tempo,
        ordem: parte.ordem
      }))

      const { error: erroPartes } = await supabase
        .from("vida_ministerio_partes")
        .insert(partesParaInserir)
      
      if (erroPartes) throw erroPartes
    }

    toast.dismiss("salvando")
    toast.success(atualizar ? "Vida e Ministerio atualizado!" : "Vida e Ministerio cadastrado!", {
      duration: 3000,
      description: "Redirecionando para a pagina..."
    })
    
    setDados(null)
    setTexto("")
    setRegistroExistente(null)
    setTimeout(() => router.push("/admin/vida-ministerio"), 2000)
  }

  async function salvarSentinela(atualizar: boolean) {
    if (!dados || dados.tipo !== "sentinela") return

    const dataInicio = dados.dataInicio ? new Date(dados.dataInicio) : new Date()
    const mes = dataInicio.getMonth() + 1
    const ano = dataInicio.getFullYear()

    // Buscar ou criar o mês
    let { data: mesExistente } = await supabase
      .from("sentinela_meses")
      .select("id")
      .eq("mes", mes)
      .eq("ano", ano)
      .single()

    let mesId = mesExistente?.id

    if (!mesId) {
      const { data: novoMes, error: erroMes } = await supabase
        .from("sentinela_meses")
        .insert({ mes, ano, cor_tema: "red" })
        .select("id")
        .single()

      if (erroMes) throw erroMes
      mesId = novoMes.id
    }

    let estudoId: string

    if (atualizar && registroExistente) {
      // Atualizar estudo existente
      const { error: erroEstudo } = await supabase
        .from("sentinela_estudos")
        .update({
          mes_id: mesId,
          data_fim: dados.dataFim,
          titulo: dados.titulo,
          texto_tema: dados.textoTema,
          cantico_inicial: dados.canticoInicial,
          cantico_inicial_nome: dados.canticoInicialNome,
          cantico_final: dados.canticoFinal,
          cantico_final_nome: dados.canticoFinalNome,
          objetivo: dados.objetivo
        })
        .eq("id", registroExistente.id)

      if (erroEstudo) throw erroEstudo
      estudoId = registroExistente.id

      // Deletar parágrafos antigos
      const { error: erroDeleteParagrafos } = await supabase
        .from("sentinela_paragrafos")
        .delete()
        .eq("estudo_id", estudoId)
      
      if (erroDeleteParagrafos) throw erroDeleteParagrafos

    } else {
      // Contar estudos existentes para definir o número
      const { count } = await supabase
        .from("sentinela_estudos")
        .select("*", { count: "exact", head: true })
        .eq("mes_id", mesId)

      const numeroEstudo = (count || 0) + 1

      // Criar novo estudo
      const { data: estudo, error: erroEstudo } = await supabase
        .from("sentinela_estudos")
        .insert({
          mes_id: mesId,
          numero_estudo: numeroEstudo,
          data_inicio: dados.dataInicio,
          data_fim: dados.dataFim,
          titulo: dados.titulo,
          texto_tema: dados.textoTema,
          cantico_inicial: dados.canticoInicial,
          cantico_inicial_nome: dados.canticoInicialNome,
          cantico_final: dados.canticoFinal,
          cantico_final_nome: dados.canticoFinalNome,
          objetivo: dados.objetivo
        })
        .select("id")
        .single()

      if (erroEstudo) throw erroEstudo
      estudoId = estudo.id
    }

    // Criar os parágrafos
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
    toast.success(atualizar ? "Estudo da Sentinela atualizado!" : "Estudo da Sentinela cadastrado!", {
      duration: 3000,
      description: "Redirecionando para a pagina..."
    })
    
    setDados(null)
    setTexto("")
    setRegistroExistente(null)
    setTimeout(() => router.push("/admin/sentinela"), 2000)
  }

  function confirmarAtualizacao() {
    setMostrarModalAtualizar(false)
    salvarDados(true)
  }

  function cancelarAtualizacao() {
    setMostrarModalAtualizar(false)
    setRegistroExistente(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Importacao Inteligente</h1>
        <p className="text-muted-foreground">
          Cole o texto copiado do JW Library ou jw.org e a IA vai identificar e cadastrar automaticamente
        </p>
      </div>

      {/* Tutorial - Como Usar */}
      <Card className="border-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Como Usar - Passo a Passo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm shrink-0">1</div>
              <div>
                <p className="font-medium text-sm">Abra o JW Library</p>
                <p className="text-xs text-muted-foreground">Ou acesse jw.org no navegador</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm shrink-0">2</div>
              <div>
                <p className="font-medium text-sm">Copie o texto da reuniao</p>
                <p className="text-xs text-muted-foreground">Vida e Ministerio ou Sentinela</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm shrink-0">3</div>
              <div>
                <p className="font-medium text-sm">Cole no campo abaixo</p>
                <p className="text-xs text-muted-foreground">Clique em "Processar com IA"</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white font-bold text-sm shrink-0">4</div>
              <div>
                <p className="font-medium text-sm">Confira e salve</p>
                <p className="text-xs text-muted-foreground">Dados vao direto para o banco</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Área de Input */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Texto da Reuniao
            </CardTitle>
            <CardDescription>
              Cole aqui o conteudo copiado do JW Library ou jw.org
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Cole aqui o texto da reuniao...

Exemplo para Vida e Ministerio:
- Copie a pagina completa da apostila ou do site
- Inclua todas as partes (Tesouros, Ministerio, Vida Crista)

Exemplo para Sentinela:
- Copie o artigo de estudo completo
- Inclua titulo, texto tema e paragrafos"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="min-h-[300px] bg-zinc-800/50 border-zinc-700 font-mono text-sm"
            />
            
            <div className="flex gap-2">
              <Button
                onClick={processarTexto}
                disabled={processando || !texto.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {processando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Processar com IA
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => { setTexto(""); setDados(null); setErro(null) }}
                disabled={!texto}
                className="border-zinc-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {erro && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{erro}</p>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span>Vida e Ministerio: Cole o texto com as secoes Tesouros, Ministerio e Vida Crista</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span>Sentinela: Cole o artigo de estudo com titulo, texto tema e paragrafos</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Área de Preview */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              Preview dos Dados
            </CardTitle>
            <CardDescription>
              Confira as informacoes extraidas antes de salvar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!dados ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <BookOpen className="h-12 w-12 mb-4 opacity-20" />
                <p>Nenhum dado processado ainda</p>
                <p className="text-sm">Cole o texto e clique em "Processar com IA"</p>
              </div>
            ) : dados.tipo === "vida_ministerio" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Vida e Ministerio
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {dados.dataInicio} a {dados.dataFim}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="p-2 rounded bg-zinc-800/50">
                    <span className="text-muted-foreground">Cantico Inicial:</span>
                    <span className="ml-2 font-medium">{dados.canticoInicial || "-"}</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-800/50">
                    <span className="text-muted-foreground">Cantico Meio:</span>
                    <span className="ml-2 font-medium">{dados.canticoMeio || "-"}</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-800/50">
                    <span className="text-muted-foreground">Cantico Final:</span>
                    <span className="ml-2 font-medium">{dados.canticoFinal || "-"}</span>
                  </div>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  <p className="text-sm font-medium text-muted-foreground">Partes ({dados.partes.length}):</p>
                  {dados.partes.map((parte, idx) => (
                    <div key={idx} className="p-3 rounded bg-zinc-800/30 text-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{parte.titulo}</span>
                        <Badge variant="outline" className="text-xs">{parte.tempo}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{parte.secao}</span>
                      
                      {/* Botão para gerar aplicações práticas */}
                      <div className="pt-2 border-t border-zinc-700/50">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => gerarAplicacoesIA(idx, parte.titulo)}
                          disabled={gerandoAplicacoes}
                          className="w-full text-xs"
                        >
                          {gerandoAplicacoes ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          ) : (
                            <Brain className="mr-1 h-3 w-3" />
                          )}
                          Gerar Aplicacoes Praticas
                        </Button>
                        
                        {/* Mostrar aplicações geradas */}
                        {aplicacoesGeradas[idx] && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium text-amber-400">Aplicacoes para a vida:</p>
                            {aplicacoesGeradas[idx].map((aplicacao, aIdx) => (
                              <div key={aIdx} className="p-2 rounded bg-amber-500/10 text-xs text-amber-200 border border-amber-500/20">
                                {aIdx + 1}. {aplicacao}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => salvarDados(false)}
                  disabled={salvando}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {salvando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Salvar no Banco de Dados
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    Estudo de A Sentinela
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {dados.dataInicio} a {dados.dataFim}
                  </span>
                </div>

                {dados.tipo === "sentinela" && (
                  <div className="p-3 rounded bg-zinc-800/50">
                    <p className="font-medium">{dados.titulo}</p>
                    <p className="text-sm text-muted-foreground mt-1">{dados.textoTema}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 rounded bg-zinc-800/50">
                    <span className="text-muted-foreground">Cantico Inicial:</span>
                    <span className="ml-2 font-medium">{dados.canticoInicial || "-"}</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-800/50">
                    <span className="text-muted-foreground">Cantico Final:</span>
                    <span className="ml-2 font-medium">{dados.canticoFinal || "-"}</span>
                  </div>
                </div>

                {dados.tipo === "sentinela" && dados.paragrafos && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">
                        Paragrafos ({dados.paragrafos.length}):
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={gerarRespostasIA}
                        disabled={gerandoRespostas}
                        className="text-xs"
                      >
                        {gerandoRespostas ? (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                          <Wand2 className="mr-1 h-3 w-3" />
                        )}
                        Gerar Todas as Respostas com IA
                      </Button>
                    </div>
                    
                    <div className="space-y-2 max-h-[250px] overflow-y-auto">
                      {dados.paragrafos.map((p, idx) => (
                        <div key={idx} className="p-3 rounded bg-zinc-800/30 text-sm space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-medium text-blue-400">Par. {p.numero}:</span>
                              <p className="text-muted-foreground mt-1">{p.pergunta}</p>
                            </div>
                          </div>
                          {p.resposta && (
                            <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                              <p className="text-xs font-medium text-green-400 mb-1">Resposta:</p>
                              <p className="text-xs text-green-200">{p.resposta}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload de Imagem */}
                <div className="border border-dashed border-zinc-700 rounded-lg p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Imagem do Estudo (opcional):</p>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) uploadImagem(file)
                        }}
                        disabled={uploadandoImagem}
                      />
                      <div className="flex items-center gap-2 px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors">
                        {uploadandoImagem ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ImagePlus className="h-4 w-4" />
                        )}
                        <span className="text-sm">Enviar Imagem</span>
                      </div>
                    </label>
                    
                    {imagemUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={analisarImagemIA}
                        disabled={analisandoImagem}
                      >
                        {analisandoImagem ? (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                          <Brain className="mr-1 h-3 w-3" />
                        )}
                        Analisar com IA
                      </Button>
                    )}
                  </div>
                  
                  {imagemUrl && (
                    <div className="mt-3">
                      <img src={imagemUrl} alt="Imagem do estudo" className="rounded max-h-32 object-cover" />
                    </div>
                  )}
                  
                  {analiseImagem && (
                    <div className="mt-3 p-3 rounded bg-purple-500/10 border border-purple-500/20">
                      <p className="text-xs font-medium text-purple-400 mb-1">Analise da Imagem (IA):</p>
                      <p className="text-xs text-purple-200">{analiseImagem}</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => salvarDados(false)}
                  disabled={salvando}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {salvando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Salvar no Banco de Dados
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmação para Atualizar */}
      <AlertDialog open={mostrarModalAtualizar} onOpenChange={setMostrarModalAtualizar}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-amber-500" />
              Registro ja existe!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {registroExistente?.tipo === "vida_ministerio" ? (
                <>
                  A semana de <span className="font-medium text-foreground">{registroExistente?.dataInicio}</span> ja esta cadastrada no sistema.
                  <br /><br />
                  Deseja <span className="font-medium text-amber-500">atualizar</span> os dados existentes com as novas informacoes?
                </>
              ) : (
                <>
                  O estudo da semana de <span className="font-medium text-foreground">{registroExistente?.dataInicio}</span> ja esta cadastrado no sistema.
                  <br /><br />
                  Deseja <span className="font-medium text-amber-500">atualizar</span> os dados existentes com as novas informacoes?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={cancelarAtualizacao}
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarAtualizacao}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sim, Atualizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
