"use client"

import { useState, useEffect, useRef, forwardRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ClipboardList, Loader2 } from "lucide-react"
import { PrintActionButtons } from "@/components/impressao/print-action-buttons"

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
  const mesNome = meses.find((m) => m.valor === mesAtual)?.nome || ""
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
        supabase.from("equipe_tecnica").select("*").gte("data", primeiroDia).lte("data", ultimoDia).order("data"),
        supabase.from("reuniao_publica_designacoes").select("*").gte("data", primeiroDia).lte("data", ultimoDia).order("data"),
        supabase.from("discursos_publicos").select("*").gte("data", primeiroDia).lte("data", ultimoDia).order("data"),
        supabase.from("assistencia_reunioes").select("*").eq("mes", mesAtual).eq("ano", anoAtual).order("data"),
      ])

    const datasDoMes = gerarDatasDoMes()
    const domingos = datasDoMes.filter((d) => d.dia_semana === "DOMINGO")

    setDesignacoesTecnicas(
      datasDoMes.map(({ data, dia_semana }) =>
        tecnicas?.find((t) => t.data === data) || {
          id: `temp-${data}`, data, dia_semana,
          indicador1_nome: null, indicador2_nome: null,
          microvolante1_nome: null, microvolante2_nome: null,
          som_nome: null, microvolante_palco: null,
        }
      )
    )
    setDesignacoesReuniaoPublica(
      domingos.map(({ data }) =>
        reuniaoPublica?.find((r) => r.data === data) || { id: `temp-${data}`, data, presidente_nome: null, leitor_sentinela_nome: null }
      )
    )
    setArranjoDiscursos(
      domingos.map(({ data }) =>
        discursos?.find((d) => d.data === data) || { id: `temp-${data}`, data, tema: null, orador_nome: null }
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra de controle — não imprime */}
      <div className="print:hidden sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30">
              <ClipboardList className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <h1 className="text-base font-bold">Programação da Congregação</h1>
              <p className="text-xs text-muted-foreground">Visualização para impressão</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={mesAnterior}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold min-w-[130px] text-center">
              {mesNome} {anoAtual}
            </span>
            <button
              onClick={mesProximo}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <PrintActionButtons
          printRef={printRef}
          documentTitle={`Programação da Congregação - ${mesNome} ${anoAtual}`}
          colorScheme="orange"
        />
      </div>

      {/* Área de conteúdo */}
      <div className="p-6 max-w-4xl mx-auto print:p-0 print:max-w-none">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Preview na tela */}
            <div className="print:hidden rounded-xl border border-border bg-card p-6">
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

            {/* Conteúdo oculto para impressão */}
            <div className="hidden print:block">
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
          </>
        )}
      </div>
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

    const cell = (extra?: React.CSSProperties): React.CSSProperties => ({
      border: "1px solid #d1d5db",
      padding: "8px 12px",
      fontSize: "13px",
      color: "#111",
      ...extra,
    })

    const headerBar = (color: string): React.CSSProperties => ({
      backgroundColor: color,
      color: "white",
      padding: "10px 16px",
      fontWeight: "bold",
      fontSize: "14px",
      marginBottom: "1px",
      textTransform: "uppercase",
      borderRadius: "4px 4px 0 0",
    })

    return (
      <div
        ref={ref}
        style={{ backgroundColor: "white", padding: "20mm 15mm", color: "black", fontFamily: "Arial, sans-serif" }}
      >
        {/* Cabeçalho */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #374151",
          paddingBottom: "10px",
          marginBottom: "16px"
        }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#111827" }}>Parque Sabará — Taubaté SP</div>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#111827" }}>Programação da Congregação</div>
        </div>

        {/* Título */}
        <div style={{
          backgroundColor: "#1f2937",
          color: "white",
          padding: "12px 18px",
          marginBottom: "20px",
          borderRadius: "4px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "16px", fontWeight: "bold", textTransform: "uppercase" }}>
            {mesNome} {ano}
          </div>
        </div>

        {/* Designações Técnicas */}
        <div style={{ marginBottom: "20px" }}>
          <div style={headerBar("#2a6b77")}>Designações Técnicas</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold", fontSize: "12px" })}>Data</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold", fontSize: "12px" })}>Indicadores</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold", fontSize: "12px" })}>Mic. Volante</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold", fontSize: "12px" })}>Áudio e Vídeo</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold", fontSize: "12px" })}>Palco</th>
              </tr>
            </thead>
            <tbody>
              {designacoesTecnicas.map((d) => (
                <tr key={d.data} style={{ backgroundColor: d.dia_semana === "DOMINGO" ? "#f9fafb" : "white" }}>
                  <td style={cell({ fontWeight: "bold", whiteSpace: "nowrap" })}>
                    {formatarData(d.data)}
                  </td>
                  <td style={cell()}>{[d.indicador1_nome, d.indicador2_nome].filter(Boolean).join(" / ") || "—"}</td>
                  <td style={cell()}>{[d.microvolante1_nome, d.microvolante2_nome].filter(Boolean).join(" / ") || "—"}</td>
                  <td style={cell()}>{d.som_nome}</td>
                  <td style={cell()}>{d.microvolante_palco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reunião Pública */}
        <div style={{ marginBottom: "20px" }}>
          <div style={headerBar("#c69214")}>Reunião Pública — Presidente e Leitor</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold", fontSize: "12px" })}>Data</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold", fontSize: "12px" })}>Presidente de Conferência</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold", fontSize: "12px" })}>Leitor de A Sentinela</th>
              </tr>
            </thead>
            <tbody>
              {designacoesReuniaoPublica.map((r) => (
                <tr key={r.data}>
                  <td style={cell({ fontWeight: "bold" })}>{formatarData(r.data)}</td>
                  <td style={cell()}>{r.presidente_nome || "—"}</td>
                  <td style={cell()}>{r.leitor_sentinela_nome || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Arranjo de Discursos */}
        <div style={{ marginBottom: "20px" }}>
          <div style={headerBar("#8b2332")}>Arranjo de Discursos</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold", fontSize: "12px" })}>Data</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold", fontSize: "12px" })}>Tema</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold", fontSize: "12px" })}>Orador</th>
              </tr>
            </thead>
            <tbody>
              {arranjoDiscursos.map((d) => (
                <tr key={d.data}>
                  <td style={cell({ fontWeight: "bold" })}>{formatarData(d.data)}</td>
                  <td style={cell()}>{d.tema || "—"}</td>
                  <td style={cell()}>{d.orador_nome || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Assistência às Reuniões */}
        <div style={{ marginBottom: "20px" }}>
          <div style={headerBar("#374151")}>Assistência às Reuniões — {mesNome}</div>
          <div style={{ padding: "12px", backgroundColor: "#f9fafb", borderRadius: "0 0 4px 4px", border: "1px solid #d1d5db", borderTop: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Quinta */}
              <PrintTabelaAssistencia titulo="QUINTA" registros={assistenciasQuintas} formatarData={formatarData} />
              {/* Domingo */}
              <PrintTabelaAssistencia titulo="DOMINGO" registros={assistenciasDomingos} formatarData={formatarData} />
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div style={{
          marginTop: "24px",
          paddingTop: "12px",
          borderTop: "1px solid #e5e7eb",
          textAlign: "center",
          fontSize: "11px",
          color: "#666"
        }}>
          Congregação Pq. Sabará - Programação da Congregação
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

  const cell = (extra?: React.CSSProperties): React.CSSProperties => ({
    border: "1px solid #c9cdd1",
    padding: "6px 10px",
    fontSize: "11px",
    textAlign: "center",
    ...extra,
  })

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={cell({ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#e5e7eb", minWidth: "80px" })}>{titulo}</th>
            {registros.map((a) => (
              <th key={a.data} style={cell({ fontWeight: "600", whiteSpace: "nowrap", backgroundColor: "#f3f4f6", minWidth: "50px" })}>
                {formatarData(a.data)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cell({ fontWeight: "600", whiteSpace: "nowrap", backgroundColor: "#fff" })}>PRESENCIAL</td>
            {registros.map((a) => (
              <td key={a.data} style={cell({ backgroundColor: "#fff" })}>
                {a.presencial > 0 ? a.presencial : ""}
              </td>
            ))}
          </tr>
          <tr>
            <td style={cell({ fontWeight: "600", whiteSpace: "nowrap", backgroundColor: "#fff" })}>ZOOM</td>
            {registros.map((a) => (
              <td key={a.data} style={cell({ backgroundColor: "#fff" })}>
                {a.zoom > 0 ? a.zoom : ""}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
