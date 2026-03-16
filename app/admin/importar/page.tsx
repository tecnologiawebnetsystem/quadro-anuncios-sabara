"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, CheckCircle2, AlertCircle, BookOpen, FileText, Copy, Trash2 } from "lucide-react"
import { toast } from "sonner"

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

export default function ImportarPage() {
  const [texto, setTexto] = useState("")
  const [processando, setProcessando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [dados, setDados] = useState<DadosReuniao | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  const supabase = createClient()

  async function processarTexto() {
    if (!texto.trim()) {
      toast.error("Cole o texto da reunião primeiro")
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

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao processar")
      }

      setDados(result.dados)
      toast.success("Texto processado com sucesso!")
    } catch (error) {
      console.error(error)
      setErro("Erro ao processar o texto. Verifique se o formato está correto e tente novamente.")
      toast.error("Erro ao processar o texto")
    } finally {
      setProcessando(false)
    }
  }

  async function salvarDados() {
    if (!dados) return

    setSalvando(true)

    try {
      if (dados.tipo === "vida_ministerio") {
        // Buscar ou criar o mês
        const dataInicio = dados.dataInicio ? new Date(dados.dataInicio) : new Date()
        const mes = dataInicio.getMonth() + 1
        const ano = dataInicio.getFullYear()

        // Verificar se o mês existe
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

        // Criar a semana
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

        // Criar as partes
        if (dados.partes.length > 0) {
          const partesParaInserir = dados.partes.map(parte => ({
            semana_id: semana.id,
            secao: parte.secao,
            titulo: parte.titulo,
            tempo: parte.tempo,
            ordem: parte.ordem
          }))

          const { error: erroPartes } = await supabase
            .from("vida_ministerio_partes")
            .insert(partesParaInserir)

          if (erroPartes) throw erroPartes
        }

        toast.success("Vida e Ministério cadastrado com sucesso!")

      } else if (dados.tipo === "sentinela") {
        // Buscar ou criar o mês
        const dataInicio = dados.dataInicio ? new Date(dados.dataInicio) : new Date()
        const mes = dataInicio.getMonth() + 1
        const ano = dataInicio.getFullYear()

        // Verificar se o mês existe
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

        // Contar estudos existentes para definir o número
        const { count } = await supabase
          .from("sentinela_estudos")
          .select("*", { count: "exact", head: true })
          .eq("mes_id", mesId)

        const numeroEstudo = (count || 0) + 1

        // Criar o estudo
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

        // Criar os parágrafos
        if (dados.paragrafos.length > 0) {
          const paragrafosParaInserir = dados.paragrafos.map(p => ({
            estudo_id: estudo.id,
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

        toast.success("Estudo da Sentinela cadastrado com sucesso!")
      }

      // Limpar após salvar
      setDados(null)
      setTexto("")

    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast.error("Erro ao salvar os dados")
    } finally {
      setSalvando(false)
    }
  }

  function formatarData(data: string | null) {
    if (!data) return "-"
    return new Date(data).toLocaleDateString("pt-BR")
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
        {/* Área de entrada */}
        <Card className="border-0 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5 text-blue-500" />
              Colar Texto
            </CardTitle>
            <CardDescription>
              Copie o conteúdo da reunião do JW Library e cole abaixo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Cole aqui o texto da reunião...

Exemplo para Vida e Ministério:
- Semana de 3-9 de março
- Cântico 77
- TESOUROS DA PALAVRA DE DEUS
- Moisés Recapitula a História de Israel (10 min)
...

Exemplo para Estudo da Sentinela:
- Artigo de Estudo 10
- Jeová É Nosso Refúgio
- Texto tema: Salmo 9:9
- Parágrafos com perguntas..."
              className="min-h-[400px] bg-zinc-800/50 border-zinc-700 font-mono text-sm"
            />

            <div className="flex gap-3">
              <Button
                onClick={processarTexto}
                disabled={processando || !texto.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {processando ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando com IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Processar com IA
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setTexto("")
                  setDados(null)
                  setErro(null)
                }}
                disabled={processando}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {erro && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {erro}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Área de prévia */}
        <Card className="border-0 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Prévia dos Dados
            </CardTitle>
            <CardDescription>
              Confira os dados extraídos antes de salvar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!dados ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
                <Sparkles className="h-12 w-12 mb-4 opacity-20" />
                <p>Cole o texto e clique em "Processar com IA"</p>
                <p className="text-sm">Os dados extraídos aparecerão aqui</p>
              </div>
            ) : dados.tipo === "vida_ministerio" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Vida e Ministério
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatarData(dados.dataInicio)} - {formatarData(dados.dataFim)}
                  </span>
                </div>

                {dados.leituraSemanal && (
                  <div className="p-3 rounded-lg bg-zinc-800/50">
                    <span className="text-xs text-muted-foreground">Leitura Semanal</span>
                    <p className="font-medium">{dados.leituraSemanal}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-zinc-800/50 text-center">
                    <span className="text-xs text-muted-foreground block">Cântico Inicial</span>
                    <span className="font-bold text-lg">{dados.canticoInicial || "-"}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-800/50 text-center">
                    <span className="text-xs text-muted-foreground block">Cântico Meio</span>
                    <span className="font-bold text-lg">{dados.canticoMeio || "-"}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-800/50 text-center">
                    <span className="text-xs text-muted-foreground block">Cântico Final</span>
                    <span className="font-bold text-lg">{dados.canticoFinal || "-"}</span>
                  </div>
                </div>

                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  <span className="text-xs text-muted-foreground">Partes ({dados.partes.length})</span>
                  {dados.partes.map((parte, i) => (
                    <div key={i} className="p-2 rounded-lg bg-zinc-800/30 text-sm">
                      <Badge variant="outline" className="text-xs mb-1">
                        {parte.secao}
                      </Badge>
                      <p className="font-medium">{parte.titulo}</p>
                      {parte.tempo && (
                        <span className="text-xs text-muted-foreground">{parte.tempo}</span>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={salvarDados}
                  disabled={salvando}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {salvando ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Salvar no Banco de Dados
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                    <FileText className="h-3 w-3 mr-1" />
                    Estudo da Sentinela
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatarData(dados.dataInicio)} - {formatarData(dados.dataFim)}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-zinc-800/50">
                  <span className="text-xs text-muted-foreground">Título</span>
                  <p className="font-bold text-lg">{dados.titulo}</p>
                  {dados.textoTema && (
                    <p className="text-sm text-muted-foreground mt-1 italic">"{dados.textoTema}"</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-zinc-800/50 text-center">
                    <span className="text-xs text-muted-foreground block">Cântico Inicial</span>
                    <span className="font-bold text-lg">{dados.canticoInicial || "-"}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-800/50 text-center">
                    <span className="text-xs text-muted-foreground block">Cântico Final</span>
                    <span className="font-bold text-lg">{dados.canticoFinal || "-"}</span>
                  </div>
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  <span className="text-xs text-muted-foreground">Parágrafos ({dados.paragrafos.length})</span>
                  {dados.paragrafos.map((p, i) => (
                    <div key={i} className="p-2 rounded-lg bg-zinc-800/30 text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">Par. {p.numero}</Badge>
                        {p.textoBase && (
                          <span className="text-xs text-muted-foreground">{p.textoBase}</span>
                        )}
                      </div>
                      <p className="font-medium">{p.pergunta}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={salvarDados}
                  disabled={salvando}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {salvando ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Salvar no Banco de Dados
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dicas */}
      <Card className="border-0 bg-card/30">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <span><strong>Vida e Ministério:</strong> Cole o texto com as seções Tesouros, Ministério e Vida Cristã</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              <span><strong>Sentinela:</strong> Cole o artigo de estudo com título, texto tema e parágrafos</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
