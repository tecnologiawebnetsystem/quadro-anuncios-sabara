"use client"

import { useState, useEffect, useRef, forwardRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import "@/app/impressao/print-styles.css"

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

  const gerarDatasDoMes = () => {
    const datas: { data: string; dia_semana: string }[] = []
    const primeiroDia = new Date(anoAtual, mesAtual - 1, 1)
    const ultimoDia = new Date(anoAtual, mesAtual, 0)

    for (let d = new Date(primeiroDia); d <= ultimoDia; d.setDate(d.getDate() + 1)) {
      const diaSemana = d.getDay()
      if (diaSemana === 4) {
        datas.push({ data: d.toISOString().split("T")[0], dia_semana: "QUINTA" })
      } else if (diaSemana === 0) {
        datas.push({ data: d.toISOString().split("T")[0], dia_semana: "DOMINGO" })
      }
    }
    return datas
  }

  const carregarDados = async () => {
    setLoading(true)
    const primeiroDia = `${anoAtual}-${String(mesAtual).padStart(2, "0")}-01`
    const ultimoDia = new Date(anoAtual, mesAtual, 0).toISOString().split("T")[0]

    const { data: tecnicas } = await supabase
      .from("designacoes_tecnicas")
      .select("*")
      .gte("data", primeiroDia)
      .lte("data", ultimoDia)
      .order("data")

    const { data: reuniaoPublica } = await supabase
      .from("designacoes_reuniao_publica")
      .select("*")
      .gte("data", primeiroDia)
      .lte("data", ultimoDia)
      .order("data")

    const { data: discursos } = await supabase
      .from("arranjo_discursos")
      .select("*")
      .gte("data", primeiroDia)
      .lte("data", ultimoDia)
      .order("data")

    const { data: assist } = await supabase
      .from("assistencia_reunioes")
      .select("*")
      .eq("mes", mesAtual)
      .eq("ano", anoAtual)
      .order("data")

    const datasDoMes = gerarDatasDoMes()

    const tecnicasCompletas = datasDoMes.map(({ data, dia_semana }) => {
      const existente = tecnicas?.find((t) => t.data === data)
      return (
        existente || {
          id: `temp-${data}`,
          data,
          dia_semana,
          indicador1: null,
          indicador2: null,
          mic_volante1: null,
          mic_volante2: null,
          audio_video: null,
          palco: null,
        }
      )
    })

    const domingos = datasDoMes.filter((d) => d.dia_semana === "DOMINGO")
    const reuniaoPublicaCompleta = domingos.map(({ data }) => {
      const existente = reuniaoPublica?.find((r) => r.data === data)
      return existente || { id: `temp-${data}`, data, presidente: null, leitor_sentinela: null }
    })

    const discursosCompletos = domingos.map(({ data }) => {
      const existente = discursos?.find((d) => d.data === data)
      return existente || { id: `temp-${data}`, data, tema: null, orador: null }
    })

    const assistenciasCompletas = datasDoMes.map(({ data, dia_semana }) => {
      const existente = assist?.find((a) => a.data === data)
      return existente || { id: `temp-${data}`, mes: mesAtual, ano: anoAtual, data, dia_semana, presencial: 0, zoom: 0 }
    })

    setDesignacoesTecnicas(tecnicasCompletas)
    setDesignacoesReuniaoPublica(reuniaoPublicaCompleta)
    setArranjoDiscursos(discursosCompletos)
    setAssistencias(assistenciasCompletas)
    setLoading(false)
  }

  useEffect(() => {
    carregarDados()
  }, [mesAtual, anoAtual])

  const mesAnterior = () => {
    if (mesAtual === 1) { setMesAtual(12); setAnoAtual(anoAtual - 1) }
    else setMesAtual(mesAtual - 1)
  }

  const mesProximo = () => {
    if (mesAtual === 12) { setMesAtual(1); setAnoAtual(anoAtual + 1) }
    else setMesAtual(mesAtual + 1)
  }

  const formatarData = (data: string) => {
    const d = new Date(data + "T12:00:00")
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`
  }

  const celula = "px-3 py-2 text-sm text-zinc-200"
  const celulaVazia = "text-zinc-500 italic"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Navegação de Mês */}
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

      {/* Designações Técnicas */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2a6b77]"></div>
            Designações Técnicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left p-2 text-zinc-400">Data</th>
                  <th className="text-left p-2 text-zinc-400">Indicadores</th>
                  <th className="text-left p-2 text-zinc-400">Mic. Volante</th>
                  <th className="text-left p-2 text-zinc-400">Áudio/Vídeo</th>
                  <th className="text-left p-2 text-zinc-400">Palco</th>
                </tr>
              </thead>
              <tbody>
                {designacoesTecnicas.map((d) => (
                  <tr key={d.data} className={`border-b border-zinc-800 ${d.dia_semana === "DOMINGO" ? "bg-zinc-800/30" : ""}`}>
                    <td className="p-2 text-white font-medium whitespace-nowrap">
                      {formatarData(d.data)} <span className="text-zinc-500 text-xs">{d.dia_semana}</span>
                    </td>
                    <td className={celula}>
                      {[d.indicador1, d.indicador2].filter(Boolean).join(" / ") || <span className={celulaVazia}>—</span>}
                    </td>
                    <td className={celula}>
                      {[d.mic_volante1, d.mic_volante2].filter(Boolean).join(" / ") || <span className={celulaVazia}>—</span>}
                    </td>
                    <td className={celula}>{d.audio_video || <span className={celulaVazia}>—</span>}</td>
                    <td className={celula}>{d.palco || <span className={celulaVazia}>—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reunião Pública */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#c69214]"></div>
            Reunião Pública (Domingos)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left p-2 text-zinc-400">Data</th>
                <th className="text-left p-2 text-zinc-400">Presidente</th>
                <th className="text-left p-2 text-zinc-400">Leitor de A Sentinela</th>
              </tr>
            </thead>
            <tbody>
              {designacoesReuniaoPublica.map((r) => (
                <tr key={r.data} className="border-b border-zinc-800">
                  <td className="p-2 text-white font-medium">{formatarData(r.data)}</td>
                  <td className={celula}>{r.presidente || <span className={celulaVazia}>—</span>}</td>
                  <td className={celula}>{r.leitor_sentinela || <span className={celulaVazia}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Arranjo de Discursos */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8b2332]"></div>
            Arranjo de Discursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left p-2 text-zinc-400">Data</th>
                <th className="text-left p-2 text-zinc-400">Tema</th>
                <th className="text-left p-2 text-zinc-400">Orador</th>
              </tr>
            </thead>
            <tbody>
              {arranjoDiscursos.map((d) => (
                <tr key={d.data} className="border-b border-zinc-800">
                  <td className="p-2 text-white font-medium">{formatarData(d.data)}</td>
                  <td className={celula}>{d.tema || <span className={celulaVazia}>—</span>}</td>
                  <td className={celula}>{d.orador || <span className={celulaVazia}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Assistência às Reuniões */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white">Assistência às Reuniões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quinta-feira */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-400 mb-2">QUINTA-FEIRA</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left p-2 text-zinc-400">Data</th>
                    <th className="text-center p-2 text-zinc-400 w-20">Presencial</th>
                    <th className="text-center p-2 text-zinc-400 w-16">Zoom</th>
                  </tr>
                </thead>
                <tbody>
                  {assistencias
                    .filter((a) => a.dia_semana === "QUINTA")
                    .map((a) => (
                      <tr key={a.data} className="border-b border-zinc-800">
                        <td className="p-2 text-white">{formatarData(a.data)}</td>
                        <td className="p-2 text-center text-zinc-200 font-medium">
                          {a.presencial > 0 ? a.presencial : <span className="text-zinc-600">—</span>}
                        </td>
                        <td className="p-2 text-center text-zinc-200 font-medium">
                          {a.zoom > 0 ? a.zoom : <span className="text-zinc-600">—</span>}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Domingo */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-400 mb-2">DOMINGO</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left p-2 text-zinc-400">Data</th>
                    <th className="text-center p-2 text-zinc-400 w-20">Presencial</th>
                    <th className="text-center p-2 text-zinc-400 w-16">Zoom</th>
                  </tr>
                </thead>
                <tbody>
                  {assistencias
                    .filter((a) => a.dia_semana === "DOMINGO")
                    .map((a) => (
                      <tr key={a.data} className="border-b border-zinc-800">
                        <td className="p-2 text-white">{formatarData(a.data)}</td>
                        <td className="p-2 text-center text-zinc-200 font-medium">
                          {a.presencial > 0 ? a.presencial : <span className="text-zinc-600">—</span>}
                        </td>
                        <td className="p-2 text-center text-zinc-200 font-medium">
                          {a.zoom > 0 ? a.zoom : <span className="text-zinc-600">—</span>}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Componente de Impressão (oculto) */}
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

// Componente de impressão
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

    const thStyle: React.CSSProperties = { border: "1px solid #d1d5db", padding: "3px", textAlign: "left" }
    const tdStyle: React.CSSProperties = { border: "1px solid #d1d5db", padding: "3px" }
    const tdNumStyle: React.CSSProperties = { border: "1px solid #d1d5db", padding: "3px", textAlign: "center", width: "50px" }

    return (
      <div
        ref={ref}
        style={{ backgroundColor: "white", padding: "20px", color: "black", fontFamily: "Arial, sans-serif", maxWidth: "210mm" }}
      >
        {/* Cabeçalho */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #374151", paddingBottom: "10px", marginBottom: "15px" }}>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>Parque Sabará - Taubaté SP</div>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>Programação da Congregação</div>
        </div>

        <div style={{ textAlign: "center", fontSize: "12px", fontWeight: "bold", marginBottom: "15px", textTransform: "uppercase" }}>
          PROGRAMAÇÃO DA CONGREGAÇÃO - {mesNome.toUpperCase()} {ano}
        </div>

        {/* Designações Técnicas */}
        <div style={{ marginBottom: "15px" }}>
          <div style={{ backgroundColor: "#2a6b77", color: "white", padding: "6px 10px", fontWeight: "bold", fontSize: "10px", marginBottom: "1px" }}>
            DESIGNAÇÕES TÉCNICAS
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={thStyle}>DATA</th>
                <th style={thStyle}>INDICADORES</th>
                <th style={thStyle}>MIC. VOLANTE</th>
                <th style={thStyle}>ÁUDIO E VÍDEO</th>
                <th style={thStyle}>PALCO</th>
              </tr>
            </thead>
            <tbody>
              {designacoesTecnicas.map((d) => (
                <tr key={d.data} style={{ backgroundColor: d.dia_semana === "DOMINGO" ? "#f9fafb" : "white" }}>
                  <td style={{ ...tdStyle, fontWeight: "bold", whiteSpace: "nowrap" }}>
                    {formatarData(d.data)} {d.dia_semana}
                  </td>
                  <td style={tdStyle}>{[d.indicador1, d.indicador2].filter(Boolean).join(" / ")}</td>
                  <td style={tdStyle}>{[d.mic_volante1, d.mic_volante2].filter(Boolean).join(" / ")}</td>
                  <td style={tdStyle}>{d.audio_video || ""}</td>
                  <td style={tdStyle}>{d.palco || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reunião Pública */}
        <div style={{ marginBottom: "15px" }}>
          <div style={{ backgroundColor: "#c69214", color: "white", padding: "6px 10px", fontWeight: "bold", fontSize: "10px", marginBottom: "1px" }}>
            REUNIÃO PÚBLICA - PRESIDENTE E LEITOR
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={thStyle}>DATA</th>
                <th style={thStyle}>PRESIDENTE DE CONFERÊNCIA</th>
                <th style={thStyle}>LEITOR DE A SENTINELA</th>
              </tr>
            </thead>
            <tbody>
              {designacoesReuniaoPublica.map((r) => (
                <tr key={r.data}>
                  <td style={{ ...tdStyle, fontWeight: "bold" }}>{formatarData(r.data)}</td>
                  <td style={tdStyle}>{r.presidente || ""}</td>
                  <td style={tdStyle}>{r.leitor_sentinela || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Arranjo de Discursos */}
        <div style={{ marginBottom: "15px" }}>
          <div style={{ backgroundColor: "#8b2332", color: "white", padding: "6px 10px", fontWeight: "bold", fontSize: "10px", marginBottom: "1px" }}>
            ARRANJO DE DISCURSOS
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={thStyle}>DATA</th>
                <th style={thStyle}>TEMA</th>
                <th style={thStyle}>ORADOR</th>
              </tr>
            </thead>
            <tbody>
              {arranjoDiscursos.map((d) => (
                <tr key={d.data}>
                  <td style={{ ...tdStyle, fontWeight: "bold" }}>{formatarData(d.data)}</td>
                  <td style={tdStyle}>{d.tema || ""}</td>
                  <td style={tdStyle}>{d.orador || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Assistência às Reuniões */}
        <div>
          <div style={{ backgroundColor: "#374151", color: "white", padding: "6px 10px", fontWeight: "bold", fontSize: "10px", marginBottom: "1px" }}>
            ASSISTÊNCIA ÀS REUNIÕES - {mesNome.toUpperCase()}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f3f4f6" }}>
                    <th colSpan={3} style={{ ...thStyle, textAlign: "center" }}>QUINTA</th>
                  </tr>
                  <tr style={{ backgroundColor: "#f3f4f6" }}>
                    <th style={thStyle}>DATA</th>
                    <th style={tdNumStyle}>PRESENCIAL</th>
                    <th style={tdNumStyle}>ZOOM</th>
                  </tr>
                </thead>
                <tbody>
                  {assistenciasQuintas.map((a) => (
                    <tr key={a.data}>
                      <td style={tdStyle}>{formatarData(a.data)}</td>
                      <td style={tdNumStyle}>{a.presencial || ""}</td>
                      <td style={tdNumStyle}>{a.zoom || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f3f4f6" }}>
                    <th colSpan={3} style={{ ...thStyle, textAlign: "center" }}>DOMINGO</th>
                  </tr>
                  <tr style={{ backgroundColor: "#f3f4f6" }}>
                    <th style={thStyle}>DATA</th>
                    <th style={tdNumStyle}>PRESENCIAL</th>
                    <th style={tdNumStyle}>ZOOM</th>
                  </tr>
                </thead>
                <tbody>
                  {assistenciasDomingos.map((a) => (
                    <tr key={a.data}>
                      <td style={tdStyle}>{formatarData(a.data)}</td>
                      <td style={tdNumStyle}>{a.presencial || ""}</td>
                      <td style={tdNumStyle}>{a.zoom || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
PrintProgramacao.displayName = "PrintProgramacao"
