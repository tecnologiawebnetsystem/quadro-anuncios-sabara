"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { BookMarked, CalendarDays, Printer, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CenteredLoader } from "@/components/ui/page-loader"

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
  ordem: number
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

  const supabase = createClient()

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
          .select("id, estudo_id, numero, texto_base, pergunta, resposta, ordem")
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
  const estudosComDados = estudosSelecionados.filter((estudo) => paragrafosSelecionados.some((paragrafo) => paragrafo.estudo_id === estudo.id))

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
          body * { visibility: hidden !important; }
          #sentinela-print, #sentinela-print * { visibility: visible !important; }
          #sentinela-print { position: absolute; inset: 0; width: 210mm; min-height: 297mm; margin: 0 auto; padding: 7mm 8mm; box-sizing: border-box; color: #000; background: white; }
          .no-print { display: none !important; }
          .sentinela-print-list { column-count: 2; column-gap: 7mm; }
          .sentinela-print-item { break-inside: avoid; page-break-inside: avoid; margin-bottom: 7px !important; }
          .sentinela-print-item > div { font-size: 10px !important; padding: 4px 6px !important; }
          .sentinela-print-table { font-size: 9px !important; }
          .sentinela-print-table th, .sentinela-print-table td { padding: 3px 4px !important; }
          @page { size: A4 portrait; margin: 0; }
        }
      `}</style>

      <div className="no-print flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground"><BookMarked className="h-6 w-6 text-red-500" /> Impressão de A Sentinela</h1>
          <p className="text-muted-foreground">Imprima parágrafos, perguntas e respostas cadastradas pela IA.</p>
        </div>
        <Button onClick={() => window.print()} disabled={!paragrafosSelecionados.length} className="gap-2"><Printer className="h-4 w-4" /> Imprimir</Button>
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
        <div id="sentinela-print" style={{ width: "210mm", minHeight: "297mm", margin: "0 auto", padding: "8mm 10mm", boxSizing: "border-box", backgroundColor: "white", color: "black" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #333", paddingBottom: "8px", marginBottom: "8px" }}>
            <h1 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>Parque Sabará - Taubaté SP</h1>
            <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>A Sentinela - {tituloPeriodo}</h2>
          </header>
          {!estudosComDados.length ? <div style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}><Search className="mx-auto mb-2 h-8 w-8" /><p>Nenhum parágrafo com pergunta e resposta encontrado para este período.</p></div> : <div className="sentinela-print-list">{estudosComDados.map((estudo) => {
            const itens = paragrafosSelecionados.filter((item) => item.estudo_id === estudo.id && item.pergunta && item.resposta)
            return <section key={estudo.id} className="sentinela-print-item" style={{ marginBottom: "12px" }}>
              <div style={{ backgroundColor: "#2a6b77", color: "white", padding: "5px 10px", fontWeight: "bold", fontSize: "13px" }}>Estudo {estudo.numero_estudo}: {estudo.titulo} — {formatarData(estudo.data_inicio)} a {formatarData(estudo.data_fim)}</div>
              <table className="sentinela-print-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead><tr style={{ backgroundColor: "#f3f4f6" }}><th style={{ padding: "5px 8px", border: "1px solid #999", textAlign: "left", width: "12%" }}>Parágrafo</th><th style={{ padding: "5px 8px", border: "1px solid #999", textAlign: "left", width: "44%" }}>Pergunta</th><th style={{ padding: "5px 8px", border: "1px solid #999", textAlign: "left", width: "44%" }}>Resposta</th></tr></thead>
                <tbody>{itens.map((item, index) => <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? "white" : "#f5f5f5" }}><td style={{ padding: "5px 8px", border: "1px solid #ddd", fontWeight: "bold", verticalAlign: "top" }}>{item.numero}</td><td style={{ padding: "5px 8px", border: "1px solid #ddd", verticalAlign: "top" }}>{item.pergunta}</td><td style={{ padding: "5px 8px", border: "1px solid #ddd", verticalAlign: "top" }}>{item.resposta}</td></tr>)}</tbody>
              </table>
            </section>
          })}</div>}
        </div>
      )}
    </div>
  )
}
