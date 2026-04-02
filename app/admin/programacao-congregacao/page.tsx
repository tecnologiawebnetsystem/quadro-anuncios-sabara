"use client"

import { useState, useEffect, useRef, forwardRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { CenteredLoader } from "@/components/ui/page-loader"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import "@/app/impressao/print-styles.css"

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface DesignacaoTecnica {
  id: string
  data: string
  dia_semana: string
  indicador1: string | null
  indicador2: string | null
  mic_volante1: string | null
  mic_volante2: string | null
  audio_video: string | null
  palco: string | null
}

interface DesignacaoReuniaoPublica {
  id: string
  data: string
  presidente: string | null
  leitor_sentinela: string | null
}

interface ArranjoDiscurso {
  id: string
  data: string
  tema: string | null
  orador: string | null
}

interface AssistenciaReuniao {
  id: string
  mes: number
  ano: number
  data: string
  dia_semana: string
  presencial: number
  zoom: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const coresSec: Record<string, string> = {
  tecnica: "#2a6b77",
  publica: "#c69214",
  discurso: "#8b2332",
  assistencia: "#374151",
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ProgramacaoCongregacaoPage() {
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [designacoesTecnicas, setDesignacoesTecnicas] = useState<DesignacaoTecnica[]>([])
  const [designacoesReuniaoPublica, setDesignacoesReuniaoPublica] = useState<DesignacaoReuniaoPublica[]>([])
  const [arranjoDiscursos, setArranjoDiscursos] = useState<ArranjoDiscurso[]>([])
  const [assistencias, setAssistencias] = useState<AssistenciaReuniao[]>([])
  const [loading, setLoading] = useState(true)

  const printRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Programacao_${meses.find((m) => m.valor === mesAtual)?.nome}_${anoAtual}`,
  })

  const supabase = createClient()

  const formatarData = (data: string) => {
    const d = new Date(data + "T12:00:00")
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`
  }

  const gerarDatasDoMes = () => {
    const datas: { data: string; dia_semana: string }[] = []
    const primeiroDia = new Date(anoAtual, mesAtual - 1, 1)
    const ultimoDia = new Date(anoAtual, mesAtual, 0)
    for (let d = new Date(primeiroDia); d <= ultimoDia; d.setDate(d.getDate() + 1)) {
      const diaSemana = d.getDay()
      if (diaSemana === 4) datas.push({ data: d.toISOString().split("T")[0], dia_semana: "QUINTA" })
      else if (diaSemana === 0) datas.push({ data: d.toISOString().split("T")[0], dia_semana: "DOMINGO" })
    }
    return datas
  }

  const carregarDados = async () => {
    setLoading(true)
    const primeiroDia = `${anoAtual}-${String(mesAtual).padStart(2, "0")}-01`
    const ultimoDia = new Date(anoAtual, mesAtual, 0).toISOString().split("T")[0]

    const [{ data: tecnicas }, { data: reuniaoPublica }, { data: discursos }, { data: assist }] =
      await Promise.all([
        supabase.from("designacoes_tecnicas").select("*").gte("data", primeiroDia).lte("data", ultimoDia).order("data"),
        supabase.from("designacoes_reuniao_publica").select("*").gte("data", primeiroDia).lte("data", ultimoDia).order("data"),
        supabase.from("arranjo_discursos").select("*").gte("data", primeiroDia).lte("data", ultimoDia).order("data"),
        supabase.from("assistencia_reunioes").select("*").eq("mes", mesAtual).eq("ano", anoAtual).order("data"),
      ])

    const datasDoMes = gerarDatasDoMes()
    const domingos = datasDoMes.filter((d) => d.dia_semana === "DOMINGO")

    setDesignacoesTecnicas(
      datasDoMes.map(({ data, dia_semana }) =>
        tecnicas?.find((t) => t.data === data) || {
          id: `temp-${data}`, data, dia_semana,
          indicador1: null, indicador2: null,
          mic_volante1: null, mic_volante2: null,
          audio_video: null, palco: null,
        }
      )
    )
    setDesignacoesReuniaoPublica(
      domingos.map(({ data }) =>
        reuniaoPublica?.find((r) => r.data === data) || { id: `temp-${data}`, data, presidente: null, leitor_sentinela: null }
      )
    )
    setArranjoDiscursos(
      domingos.map(({ data }) =>
        discursos?.find((d) => d.data === data) || { id: `temp-${data}`, data, tema: null, orador: null }
      )
    )
    setAssistencias(
      datasDoMes.map(({ data, dia_semana }) =>
        assist?.find((a) => a.data === data) || {
          id: `temp-${data}`, mes: mesAtual, ano: anoAtual, data, dia_semana, presencial: 0, zoom: 0,
        }
      )
    )
    setLoading(false)
  }

  useEffect(() => { carregarDados() }, [mesAtual, anoAtual])

  const mesAnterior = () => {
    if (mesAtual === 1) { setMesAtual(12); setAnoAtual(anoAtual - 1) }
    else setMesAtual(mesAtual - 1)
  }
  const mesProximo = () => {
    if (mesAtual === 12) { setMesAtual(1); setAnoAtual(anoAtual + 1) }
    else setMesAtual(mesAtual + 1)
  }

  const assistenciasQuintas = assistencias.filter((a) => a.dia_semana === "QUINTA")
  const assistenciasDomingos = assistencias.filter((a) => a.dia_semana === "DOMINGO")

  if (loading) return <CenteredLoader />

  return (
    <div className="space-y-6 pb-10">
      {/* Seletor de mês + imprimir */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={mesAnterior}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">
                {meses.find((m) => m.valor === mesAtual)?.nome} {anoAtual}
              </h2>
              <p className="text-sm text-zinc-500">Programação da Congregação — Somente Leitura</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePrint()}
                className="border-zinc-700 hover:bg-zinc-800"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="ghost" size="icon" onClick={mesProximo}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Designações Técnicas ── */}
      <div className="rounded-md overflow-hidden border border-zinc-700/50">
        <div
          className="px-4 py-2 text-xs font-bold text-white uppercase tracking-wide"
          style={{ backgroundColor: coresSec.tecnica }}
        >
          Designações Técnicas
        </div>
        <div className="overflow-x-auto bg-zinc-900/50">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-700 bg-zinc-800/60">
                <th className="text-left px-3 py-2 text-zinc-400 font-semibold">Data</th>
                <th className="text-left px-3 py-2 text-zinc-400 font-semibold">Indicadores</th>
                <th className="text-left px-3 py-2 text-zinc-400 font-semibold">Mic. Volante</th>
                <th className="text-left px-3 py-2 text-zinc-400 font-semibold">Áudio / Vídeo</th>
                <th className="text-left px-3 py-2 text-zinc-400 font-semibold">Palco</th>
              </tr>
            </thead>
            <tbody>
              {designacoesTecnicas.map((d) => (
                <tr
                  key={d.data}
                  className={`border-b border-zinc-800 ${d.dia_semana === "DOMINGO" ? "bg-zinc-800/30" : ""}`}
                >
                  <td className="px-3 py-2 font-semibold text-white whitespace-nowrap">
                    {formatarData(d.data)}{" "}
                    <span className="text-zinc-500 font-normal">{d.dia_semana}</span>
                  </td>
                  <td className="px-3 py-2 text-zinc-200">
                    {[d.indicador1, d.indicador2].filter(Boolean).join(" / ") || <span className="text-zinc-600 italic">—</span>}
                  </td>
                  <td className="px-3 py-2 text-zinc-200">
                    {[d.mic_volante1, d.mic_volante2].filter(Boolean).join(" / ") || <span className="text-zinc-600 italic">—</span>}
                  </td>
                  <td className="px-3 py-2 text-zinc-200">
                    {d.audio_video || <span className="text-zinc-600 italic">—</span>}
                  </td>
                  <td className="px-3 py-2 text-zinc-200">
                    {d.palco || <span className="text-zinc-600 italic">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Reunião Pública ── */}
      <div className="rounded-md overflow-hidden border border-zinc-700/50">
        <div
          className="px-4 py-2 text-xs font-bold text-white uppercase tracking-wide"
          style={{ backgroundColor: coresSec.publica }}
        >
          Reunião Pública — Presidente e Leitor
        </div>
        <div className="overflow-x-auto bg-zinc-900/50">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-700 bg-zinc-800/60">
                <th className="text-left px-3 py-2 text-zinc-400 font-semibold">Data</th>
                <th className="text-left px-3 py-2 text-zinc-400 font-semibold">Presidente de Conferência</th>
                <th className="text-left px-3 py-2 text-zinc-400 font-semibold">Leitor de A Sentinela</th>
              </tr>
            </thead>
            <tbody>
              {designacoesReuniaoPublica.map((r) => (
                <tr key={r.data} className="border-b border-zinc-800">
                  <td className="px-3 py-2 font-semibold text-white">{formatarData(r.data)}</td>
                  <td className="px-3 py-2 text-zinc-200">{r.presidente || <span className="text-zinc-600 italic">—</span>}</td>
                  <td className="px-3 py-2 text-zinc-200">{r.leitor_sentinela || <span className="text-zinc-600 italic">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Arranjo de Discursos ── */}
      <div className="rounded-md overflow-hidden border border-zinc-700/50">
        <div
          className="px-4 py-2 text-xs font-bold text-white uppercase tracking-wide"
          style={{ backgroundColor: coresSec.discurso }}
        >
          Arranjo de Discursos
        </div>
        <div className="overflow-x-auto bg-zinc-900/50">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-700 bg-zinc-800/60">
                <th className="text-left px-3 py-2 text-zinc-400 font-semibold">Data</th>
                <th className="text-left px-3 py-2 text-zinc-400 font-semibold">Tema</th>
                <th className="text-left px-3 py-2 text-zinc-400 font-semibold">Orador</th>
              </tr>
            </thead>
            <tbody>
              {arranjoDiscursos.map((d) => (
                <tr key={d.data} className="border-b border-zinc-800">
                  <td className="px-3 py-2 font-semibold text-white">{formatarData(d.data)}</td>
                  <td className="px-3 py-2 text-zinc-200">{d.tema || <span className="text-zinc-600 italic">—</span>}</td>
                  <td className="px-3 py-2 text-zinc-200">{d.orador || <span className="text-zinc-600 italic">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Assistência às Reuniões ── */}
      <div className="rounded-md overflow-hidden border border-zinc-700/50">
        <div
          className="px-4 py-2 text-xs font-bold text-white uppercase tracking-wide"
          style={{ backgroundColor: coresSec.assistencia }}
        >
          Assistência às Reuniões — {meses.find((m) => m.valor === mesAtual)?.nome}
        </div>
        <div className="bg-zinc-900/50 p-4 space-y-6">
          {/* Quinta-feira */}
          <TabelaAssistencia titulo="QUINTA" registros={assistenciasQuintas} formatarData={formatarData} />
          {/* Domingo */}
          <TabelaAssistencia titulo="DOMINGO" registros={assistenciasDomingos} formatarData={formatarData} />
        </div>
      </div>

      {/* Componente oculto para impressão */}
      <div className="hidden">
        <PrintProgramacao
          ref={printRef}
          mes={mesAtual}
          ano={anoAtual}
          designacoesTecnicas={designacoesTecnicas}
          designacoesReuniaoPublica={designacoesReuniaoPublica}
          arranjoDiscursos={arranjoDiscursos}
          assistencias={assistencias}
        />
      </div>
    </div>
  )
}

// ─── Tabela de Assistência (visual da página) ─────────────────────────────────

function TabelaAssistencia({
  titulo,
  registros,
  formatarData,
}: {
  titulo: string
  registros: AssistenciaReuniao[]
  formatarData: (d: string) => string
}) {
  if (registros.length === 0) return null

  return (
    <div className="flex gap-0 rounded-md overflow-hidden border border-zinc-700">
      {/* Coluna de labels */}
      <table className="text-xs border-collapse shrink-0">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center font-bold text-white bg-zinc-700 border border-zinc-600 whitespace-nowrap">
              {titulo}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 text-center font-bold text-zinc-200 bg-zinc-800/50 border border-zinc-700 whitespace-nowrap">
              PRESENCIAL
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 text-center font-bold text-zinc-200 bg-zinc-800/50 border border-zinc-700 whitespace-nowrap">
              ZOOM
            </td>
          </tr>
        </tbody>
      </table>

      {/* Colunas de datas */}
      <table className="text-xs border-collapse flex-1">
        <thead>
          <tr>
            {registros.map((a) => (
              <th
                key={a.data}
                className="px-3 py-2 text-center text-zinc-300 font-semibold bg-zinc-800/30 border border-zinc-700 whitespace-nowrap"
              >
                {formatarData(a.data)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {registros.map((a) => (
              <td key={a.data} className="px-3 py-2 text-center text-zinc-200 border border-zinc-700 min-w-[56px]">
                {a.presencial > 0 ? a.presencial : ""}
              </td>
            ))}
          </tr>
          <tr>
            {registros.map((a) => (
              <td key={a.data} className="px-3 py-2 text-center text-zinc-200 border border-zinc-700 min-w-[56px]">
                {a.zoom > 0 ? a.zoom : ""}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ─── Componente de Impressão ──────────────────────────────────────────────────

interface PrintProgramacaoProps {
  mes: number
  ano: number
  designacoesTecnicas: DesignacaoTecnica[]
  designacoesReuniaoPublica: DesignacaoReuniaoPublica[]
  arranjoDiscursos: ArranjoDiscurso[]
  assistencias: AssistenciaReuniao[]
}

const PrintProgramacao = forwardRef<HTMLDivElement, PrintProgramacaoProps>(
  ({ mes, ano, designacoesTecnicas, designacoesReuniaoPublica, arranjoDiscursos, assistencias }, ref) => {
    const mesNome = meses.find((m) => m.valor === mes)?.nome || ""

    const formatarData = (data: string) => {
      const d = new Date(data + "T12:00:00")
      return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`
    }

    const assistenciasQuintas = assistencias.filter((a) => a.dia_semana === "QUINTA")
    const assistenciasDomingos = assistencias.filter((a) => a.dia_semana === "DOMINGO")

    const border = "1px solid #d1d5db"
    const thBase: React.CSSProperties = { border, padding: "4px 6px", textAlign: "left", fontSize: "8px" }
    const tdBase: React.CSSProperties = { border, padding: "4px 6px", fontSize: "8px" }
    const headerBar = (color: string): React.CSSProperties => ({
      backgroundColor: color, color: "white",
      padding: "5px 8px", fontWeight: "bold",
      fontSize: "9px", marginBottom: "1px",
      textTransform: "uppercase",
    })

    return (
      <div
        ref={ref}
        style={{ backgroundColor: "white", padding: "20px", color: "black", fontFamily: "Arial, sans-serif", maxWidth: "210mm" }}
      >
        {/* Cabeçalho */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #374151", paddingBottom: "8px", marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", fontWeight: "bold" }}>Parque Sabará — Taubaté SP</div>
          <div style={{ fontSize: "11px", fontWeight: "bold" }}>Programação da Congregação</div>
        </div>
        <div style={{ textAlign: "center", fontSize: "11px", fontWeight: "bold", marginBottom: "14px", textTransform: "uppercase" }}>
          Programação da Congregação — {mesNome.toUpperCase()} {ano}
        </div>

        {/* Designações Técnicas */}
        <div style={{ marginBottom: "12px" }}>
          <div style={headerBar("#2a6b77")}>Designações Técnicas</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={thBase}>Data</th>
                <th style={thBase}>Indicadores</th>
                <th style={thBase}>Mic. Volante</th>
                <th style={thBase}>Áudio e Vídeo</th>
                <th style={thBase}>Palco</th>
              </tr>
            </thead>
            <tbody>
              {designacoesTecnicas.map((d) => (
                <tr key={d.data} style={{ backgroundColor: d.dia_semana === "DOMINGO" ? "#f9fafb" : "white" }}>
                  <td style={{ ...tdBase, fontWeight: "bold", whiteSpace: "nowrap" }}>
                    {formatarData(d.data)} {d.dia_semana}
                  </td>
                  <td style={tdBase}>{[d.indicador1, d.indicador2].filter(Boolean).join(" / ")}</td>
                  <td style={tdBase}>{[d.mic_volante1, d.mic_volante2].filter(Boolean).join(" / ")}</td>
                  <td style={tdBase}>{d.audio_video || ""}</td>
                  <td style={tdBase}>{d.palco || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reunião Pública */}
        <div style={{ marginBottom: "12px" }}>
          <div style={headerBar("#c69214")}>Reunião Pública — Presidente e Leitor</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={thBase}>Data</th>
                <th style={thBase}>Presidente de Conferência</th>
                <th style={thBase}>Leitor de A Sentinela</th>
              </tr>
            </thead>
            <tbody>
              {designacoesReuniaoPublica.map((r) => (
                <tr key={r.data}>
                  <td style={{ ...tdBase, fontWeight: "bold" }}>{formatarData(r.data)}</td>
                  <td style={tdBase}>{r.presidente || ""}</td>
                  <td style={tdBase}>{r.leitor_sentinela || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Arranjo de Discursos */}
        <div style={{ marginBottom: "16px" }}>
          <div style={headerBar("#8b2332")}>Arranjo de Discursos</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={thBase}>Data</th>
                <th style={thBase}>Tema</th>
                <th style={thBase}>Orador</th>
              </tr>
            </thead>
            <tbody>
              {arranjoDiscursos.map((d) => (
                <tr key={d.data}>
                  <td style={{ ...tdBase, fontWeight: "bold" }}>{formatarData(d.data)}</td>
                  <td style={tdBase}>{d.tema || ""}</td>
                  <td style={tdBase}>{d.orador || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Assistência às Reuniões */}
        <div>
          <div style={{ ...headerBar("#374151"), textAlign: "center", fontSize: "10px", fontWeight: "bold" }}>
            Assistência às Reuniões — {mesNome.toUpperCase()}
          </div>
          <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
            {/* Quinta */}
            <PrintTabelaAssistencia titulo="QUINTA" registros={assistenciasQuintas} formatarData={formatarData} />
            {/* Domingo */}
            <PrintTabelaAssistencia titulo="DOMINGO" registros={assistenciasDomingos} formatarData={formatarData} />
          </div>
        </div>
      </div>
    )
  }
)
PrintProgramacao.displayName = "PrintProgramacao"

// ─── Tabela Assistência para impressão ───────────────────────────────────────

function PrintTabelaAssistencia({
  titulo,
  registros,
  formatarData,
}: {
  titulo: string
  registros: AssistenciaReuniao[]
  formatarData: (d: string) => string
}) {
  if (registros.length === 0) return null

  const border = "1px solid #9ca3af"
  const cell = (extra?: React.CSSProperties): React.CSSProperties => ({
    border, padding: "4px 8px", fontSize: "8px", textAlign: "center", ...extra,
  })

  return (
    <div style={{ display: "flex", gap: 0 }}>
      {/* Labels */}
      <table style={{ borderCollapse: "collapse", flexShrink: 0 }}>
        <thead>
          <tr>
            <th style={cell({ fontWeight: "bold", backgroundColor: "#e5e7eb", whiteSpace: "nowrap" })}>{titulo}</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={cell({ fontWeight: "bold", whiteSpace: "nowrap" })}>PRESENCIAL</td></tr>
          <tr><td style={cell({ fontWeight: "bold", whiteSpace: "nowrap" })}>ZOOM</td></tr>
        </tbody>
      </table>

      {/* Datas */}
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {registros.map((a) => (
              <th key={a.data} style={cell({ backgroundColor: "#e5e7eb", whiteSpace: "nowrap", minWidth: "46px" })}>
                {formatarData(a.data)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {registros.map((a) => (
              <td key={a.data} style={cell({ minWidth: "46px" })}>
                {a.presencial > 0 ? a.presencial : ""}
              </td>
            ))}
          </tr>
          <tr>
            {registros.map((a) => (
              <td key={a.data} style={cell({ minWidth: "46px" })}>
                {a.zoom > 0 ? a.zoom : ""}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
