"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { BookMarked, CalendarDays, Printer, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CenteredLoader } from "@/components/ui/page-loader"
import { formatarRotuloImpressaoSentinela, ordenarParagrafosSentinela } from "@/lib/sentinela-order"

type FiltroPeriodo = "semana" | "mes" | "ano"

interface Estudo {
  id: string
  numero_estudo: number
  titulo: string
  data_inicio: string
  data_fim: string
}

interface Paragrafo {
  id: string
  estudo_id: string
  numero: string
  texto_base: string | null
  pergunta: string | null
  resposta: string | null
  imagem_url: string | null
  imagem_descricao: string | null
  imagem_explicacao: string | null
  ordem: number
}

function temConteudo(imagem: Pick<Paragrafo, "texto_base" | "pergunta" | "resposta" | "imagem_url" | "imagem_descricao" | "imagem_explicacao">) {
  return [imagem.texto_base, imagem.pergunta, imagem.resposta, imagem.imagem_url, imagem.imagem_descricao, imagem.imagem_explicacao]
    .some((conteudo) => Boolean(conteudo?.trim()))
}

const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

function dataLocal(data: string) {
  return new Date(`${data}T12:00:00`)
}

function formatarData(data: string) {
  return dataLocal(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export default function ImpressaoSentinelaPage() {
  const hoje = new Date()
  const [periodo, setPeriodo] = useState<FiltroPeriodo>("mes")
  const [mes, setMes] = useState(String(hoje.getMonth() + 1))
  const [ano, setAno] = useState(String(hoje.getFullYear()))
  const [semanaId, setSemanaId] = useState("todas")
  const [estudos, setEstudos] = useState<Estudo[]>([])
  const [paragrafos, setParagrafos] = useState<Paragrafo[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [imprimindo, setImprimindo] = useState(false)

  const supabase = createClient()

  const imprimir = async () => {
    setImprimindo(true)
    try {
      const imagens = Array.from(document.querySelectorAll<HTMLImageElement>("#sentinela-print img"))
      await Promise.all(imagens.map((imagem) => imagem.decode().catch(() => undefined)))
      window.print()
    } finally {
      setImprimindo(false)
    }
  }

  const carregarDados = useCallback(async () => {
    setLoading(true)
    setErro(null)
    const { data: mesesData, error: mesesError } = await supabase
      .from("sentinela_meses")
      .select("id, mes, ano")
      .eq("ano", Number(ano))
      .order("mes")

    if (mesesError) {
      setErro("Não foi possível carregar os estudos da Sentinela.")
      setLoading(false)
      return
    }

    const mesesFiltrados = mesesData?.filter((item) => periodo === "ano" || item.mes === Number(mes)) ?? []
    const mesIds = mesesFiltrados.map((item) => item.id)

    if (!mesIds.length) {
      setEstudos([])
      setParagrafos([])
      setLoading(false)
      return
    }

    const { data: estudosData, error: estudosError } = await supabase
      .from("sentinela_estudos")
      .select("id, numero_estudo, titulo, data_inicio, data_fim")
      .in("mes_id", mesIds)
      .order("data_inicio")

    if (estudosError) {
      setErro("Não foi possível carregar os estudos da Sentinela.")
      setLoading(false)
      return
    }

    const estudosCarregados = estudosData ?? []
    const { data: paragrafosData, error: paragrafosError } = estudosCarregados.length
      ? await supabase
          .from("sentinela_paragrafos")
          .select("id, estudo_id, numero, texto_base, pergunta, resposta, imagem_url, imagem_descricao, imagem_explicacao, ordem")
          .in("estudo_id", estudosCarregados.map((estudo) => estudo.id))
          .order("ordem")
      : { data: [], error: null }

    if (paragrafosError) {
      setErro("Não foi possível carregar os parágrafos da Sentinela.")
      setLoading(false)
      return
    }

    setEstudos(estudosCarregados)
    setParagrafos(paragrafosData ?? [])
    setSemanaId("todas")
    setLoading(false)
  }, [ano, mes, periodo, supabase])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const semanasDisponiveis = useMemo(() => estudos, [estudos])
  const estudosSelecionados = useMemo(
    () => periodo === "semana" && semanaId !== "todas" ? estudos.filter((estudo) => estudo.id === semanaId) : estudos,
    [estudos, periodo, semanaId],
  )
  const paragrafosSelecionados = useMemo(
    () => paragrafos.filter((paragrafo) => estudosSelecionados.some((estudo) => estudo.id === paragrafo.estudo_id)),
    [paragrafos, estudosSelecionados],
  )
  const estudosComDados = estudosSelecionados.filter((estudo) => paragrafosSelecionados.some((paragrafo) =>
    paragrafo.estudo_id === estudo.id && temConteudo(paragrafo),
  ))

  const tituloPeriodo = periodo === "ano"
    ? `Ano de ${ano}`
    : periodo === "semana" && semanaId !== "todas"
      ? (() => {
          const estudo = estudos.find((item) => item.id === semanaId)
          return estudo ? `${formatarData(estudo.data_inicio)} a ${formatarData(estudo.data_fim)}` : "Semana selecionada"
        })()
      : `${meses[Number(mes) - 1]} de ${ano}`

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @media print {
          @page { size: A4 portrait; margin: 12mm; }
          html, body { background: #fff !important; }
          body * { visibility: hidden !important; }
          #sentinela-print, #sentinela-print * { visibility: visible !important; }
          #sentinela-print { position: absolute; inset: 0 auto auto 0; width: 100%; max-width: none; min-height: 0; margin: 0; padding: 0; border: 0; border-radius: 0; box-shadow: none; color: #172338; background: #fff; }
          .no-print { display: none !important; }
          .sentinela-print-study { break-inside: auto; page-break-inside: auto; margin-bottom: 18px !important; }
          .sentinela-print-entry { break-inside: avoid; page-break-inside: avoid; box-shadow: none !important; }
          .sentinela-print-entry h4, .sentinela-print-entry h5, .sentinela-print-study h3 { color: #172338 !important; }
          .sentinela-print-entry p { color: #26394d !important; }
          .sentinela-print-image { display: block; max-width: 100%; max-height: 150mm; object-fit: contain; break-inside: avoid; page-break-inside: avoid; }
          .sentinela-print-entry figure { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      <div className="no-print flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground"><BookMarked className="h-6 w-6 text-red-500" /> Impressão de A Sentinela</h1>
          <p className="text-muted-foreground">Imprima parágrafos, perguntas e respostas cadastradas pela IA.</p>
        </div>
        <Button onClick={imprimir} disabled={!paragrafosSelecionados.length || imprimindo} className="gap-2"><Printer className="h-4 w-4" /> {imprimindo ? "Preparando impressão..." : "Imprimir"}</Button>
      </div>

      <Card className="no-print">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CalendarDays className="h-4 w-4" /> Filtro de período</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2"><Label>Visualizar por</Label><Select value={periodo} onValueChange={(value) => setPeriodo(value as FiltroPeriodo)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="semana">Semana</SelectItem><SelectItem value="mes">Mês</SelectItem><SelectItem value="ano">Ano</SelectItem></SelectContent></Select></div>
          <div className="space-y-2"><Label>Ano</Label><Select value={ano} onValueChange={setAno}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[hoje.getFullYear() - 1, hoje.getFullYear(), hoje.getFullYear() + 1].map((item) => <SelectItem key={item} value={String(item)}>{item}</SelectItem>)}</SelectContent></Select></div>
          {periodo !== "ano" && <div className="space-y-2"><Label>{periodo === "semana" ? "Mês da semana" : "Mês"}</Label><Select value={mes} onValueChange={setMes}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{meses.map((item, index) => <SelectItem key={item} value={String(index + 1)}>{item}</SelectItem>)}</SelectContent></Select></div>}
          {periodo === "semana" && <div className="space-y-2 md:col-span-3"><Label>Semana</Label><Select value={semanaId} onValueChange={setSemanaId}><SelectTrigger><SelectValue placeholder="Todas as semanas" /></SelectTrigger><SelectContent><SelectItem value="todas">Todas as semanas do mês</SelectItem>{semanasDisponiveis.map((estudo) => <SelectItem key={estudo.id} value={estudo.id}>{formatarData(estudo.data_inicio)} a {formatarData(estudo.data_fim)} — {estudo.titulo}</SelectItem>)}</SelectContent></Select></div>}
        </CardContent>
      </Card>

      {loading ? <CenteredLoader /> : erro ? <Card><CardContent className="py-10 text-center text-destructive">{erro}</CardContent></Card> : (
        <div id="sentinela-print" className="sentinela-print-sheet mx-auto w-full max-w-5xl rounded-xl bg-white p-6 text-slate-900 shadow-lg md:p-10">
          <header className="mb-8 flex flex-col gap-2 border-b-2 border-slate-800 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Congregação Parque Sabará · Taubaté — SP</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">A Sentinela</h2>
            </div>
            <p className="text-sm font-semibold text-slate-600">{tituloPeriodo}</p>
          </header>
          {!estudosComDados.length ? (
            <div className="py-10 text-center text-slate-500">
              <Search className="mx-auto mb-2 size-8" />
              <p>Nenhum parágrafo com conteúdo encontrado para este período.</p>
            </div>
          ) : (
            <div className="sentinela-print-list">
              {estudosComDados.map((estudo) => {
                const itens = paragrafosSelecionados
                  .filter((item) =>
                    item.estudo_id === estudo.id && temConteudo(item),
                  )
                  .sort(ordenarParagrafosSentinela)

                return (
                  <section key={estudo.id} className="sentinela-print-study">
                    <div className="mb-4 border-b border-slate-300 pb-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Estudo {estudo.numero_estudo}</p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900">{estudo.titulo}</h3>
                      <p className="mt-1 text-sm text-slate-600">{formatarData(estudo.data_inicio)} a {formatarData(estudo.data_fim)}</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      {itens.map((item) => (
                        <article key={item.id} className="sentinela-print-entry rounded-lg border border-slate-300 px-4 py-3">
                          <h4 className="text-base font-bold text-slate-900">{formatarRotuloImpressaoSentinela(item.numero)}</h4>
                          {item.texto_base?.trim() && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">{item.texto_base}</p>}
                          <div className="mt-3 grid gap-3 border-t border-slate-200 pt-3">
                            <div>
                              <h5 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Pergunta</h5>
                              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-800">{item.pergunta?.trim() || "Não cadastrada"}</p>
                            </div>
                            <div>
                              <h5 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Resposta</h5>
                              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-800">{item.resposta?.trim() || "Sem resposta cadastrada"}</p>
                            </div>
                          </div>
                          {item.imagem_url && (
                            <figure className="mt-3">
                              <img
                                src={item.imagem_url}
                                alt={item.imagem_descricao || `Imagem de ${formatarRotuloImpressaoSentinela(item.numero)}`}
                                className="sentinela-print-image mx-auto rounded-md"
                              />
                              {item.imagem_descricao && <figcaption className="mt-2 text-center text-xs italic text-slate-600">{item.imagem_descricao}</figcaption>}
                              {item.imagem_explicacao && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">{item.imagem_explicacao}</p>}
                            </figure>
                          )}
                        </article>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
