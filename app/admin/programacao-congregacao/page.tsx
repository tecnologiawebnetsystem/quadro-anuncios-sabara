"use client"

import { useState, useEffect, useRef, forwardRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Printer, ClipboardList, Loader2, Save, Share2 } from "lucide-react"
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
  
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Programacao_${mesNome}_${anoAtual}`,
  })

  const handleSaveAs = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Programacao_${mesNome}_${anoAtual}`,
    print: async (printIframe) => {
      const contentWindow = printIframe.contentWindow
      if (contentWindow) {
        contentWindow.print()
      }
    },
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

  // ──────────────────────────────────────────────
  // WhatsApp - Compartilhar Programação
  // ──────────────────────────────────────────────
  const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )

  const formatarDataCompleta = (data: string) => {
    const d = new Date(data + "T12:00:00")
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
  }

  const getDiaSemana = (data: string) => {
    const d = new Date(data + "T12:00:00")
    const dias = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"]
    return dias[d.getDay()]
  }

  // Compartilhar Designação Técnica
  const compartilharDesignacaoTecnica = (designacao: DesignacaoTecnica, funcao: string, nome: string) => {
    const dataFormatada = formatarDataCompleta(designacao.data)
    const diaSemana = getDiaSemana(designacao.data)
    
    let mensagem = `*DESIGNAÇÃO TÉCNICA*\n\n`
    mensagem += `Olá, ${nome}!\n\n`
    mensagem += `Você foi designado para a função de *${funcao}* na reunião.\n\n`
    mensagem += `*Data:* ${dataFormatada} (${diaSemana})\n`
    
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`
    window.open(url, "_blank")
  }

  // Compartilhar Reunião Pública (Presidente ou Leitor)
  const compartilharReuniaoPublica = (designacao: DesignacaoReuniaoPublica, funcao: string, nome: string) => {
    const dataFormatada = formatarDataCompleta(designacao.data)
    
    let mensagem = `*DESIGNAÇÃO - REUNIÃO PÚBLICA*\n\n`
    mensagem += `Olá, ${nome}!\n\n`
    mensagem += `Você foi designado como *${funcao}* na Reunião Pública.\n\n`
    mensagem += `*Data:* ${dataFormatada} (domingo)\n`
    
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`
    window.open(url, "_blank")
  }

  // Compartilhar Arranjo de Discurso
  const compartilharDiscurso = (arranjo: ArranjoDiscurso) => {
    if (!arranjo.orador) return
    
    const dataFormatada = formatarDataCompleta(arranjo.data)
    
    let mensagem = `*DESIGNAÇÃO - DISCURSO PÚBLICO*\n\n`
    mensagem += `Olá, ${arranjo.orador}!\n\n`
    mensagem += `Você foi designado para proferir o Discurso Público.\n\n`
    mensagem += `*Data:* ${dataFormatada} (domingo)\n`
    if (arranjo.tema) {
      mensagem += `*Tema:* ${arranjo.tema}\n`
    }
    
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`
    window.open(url, "_blank")
  }

  // Botão WhatsApp reutilizável
  const BotaoWhatsAppInline = ({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      disabled={disabled}
      className={`inline-flex items-center justify-center h-6 w-6 rounded text-green-500 hover:text-green-400 hover:bg-green-500/10 transition-colors print:hidden ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
      title="Enviar por WhatsApp"
    >
      <WhatsAppIcon />
    </button>
  )

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
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => handleSaveAs()} 
            variant="outline"
            className="gap-2 border-amber-600/50 text-amber-400 hover:bg-amber-600/10"
          >
            <Save className="h-4 w-4" />
            Salvar como
          </Button>
          <Button onClick={() => handlePrint()} className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
        </div>
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
                onCompartilharTecnica={compartilharDesignacaoTecnica}
                onCompartilharReuniaoPublica={compartilharReuniaoPublica}
                onCompartilharDiscurso={compartilharDiscurso}
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
  onCompartilharTecnica?: (designacao: DesignacaoTecnica, funcao: string, nome: string) => void
  onCompartilharReuniaoPublica?: (designacao: DesignacaoReuniaoPublica, funcao: string, nome: string) => void
  onCompartilharDiscurso?: (arranjo: ArranjoDiscurso) => void
}

const PrintProgramacao = forwardRef<HTMLDivElement, PrintProgramacaoProps>(
  ({ mes, ano, designacoesTecnicas, designacoesReuniaoPublica, arranjoDiscursos, assistencias, onCompartilharTecnica, onCompartilharReuniaoPublica, onCompartilharDiscurso }, ref) => {
    
    // Ícone WhatsApp para uso interno
    const WhatsAppIconSmall = () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: "14px", height: "14px" }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    )

    const BotaoWppCell = ({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => (
      <button
        onClick={(e) => { e.stopPropagation(); onClick() }}
        disabled={disabled}
        className="print:hidden"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "20px",
          borderRadius: "4px",
          color: disabled ? "#ccc" : "#22c55e",
          cursor: disabled ? "not-allowed" : "pointer",
          border: "none",
          background: "transparent",
          marginLeft: "4px",
        }}
        title="Enviar por WhatsApp"
      >
        <WhatsAppIconSmall />
      </button>
    )
    const mesNome = meses.find((m) => m.valor === mes)?.nome || ""

    const formatarData = (data: string) => {
      const d = new Date(data + "T12:00:00")
      return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`
    }

    const assistenciasQuintas = assistencias.filter((a) => a.dia_semana === "QUINTA")
    const assistenciasDomingos = assistencias.filter((a) => a.dia_semana === "DOMINGO")

    const cell = (extra?: React.CSSProperties): React.CSSProperties => ({
      border: "1px solid #d1d5db",
      padding: "6px 10px",
      fontSize: "10px",
      color: "#111",
      ...extra,
    })

    const headerBar = (color: string): React.CSSProperties => ({
      backgroundColor: color, 
      color: "white",
      padding: "8px 12px", 
      fontWeight: "bold",
      fontSize: "11px", 
      marginBottom: "1px",
      textTransform: "uppercase",
      borderRadius: "4px 4px 0 0",
    })

    return (
      <div
        ref={ref}
        style={{ backgroundColor: "white", padding: "16px", color: "black", fontFamily: "Arial, sans-serif" }}
      >
        {/* Cabeçalho */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          borderBottom: "2px solid #374151", 
          paddingBottom: "8px", 
          marginBottom: "12px" 
        }}>
          <div style={{ fontSize: "14px", fontWeight: "bold", color: "#111827" }}>Parque Sabará — Taubaté SP</div>
          <div style={{ fontSize: "14px", fontWeight: "bold", color: "#111827" }}>Programação da Congregação</div>
        </div>

        {/* Título */}
        <div style={{ 
          backgroundColor: "#1f2937", 
          color: "white", 
          padding: "10px 14px",
          marginBottom: "16px",
          borderRadius: "4px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase" }}>
            {mesNome} {ano}
          </div>
        </div>

        {/* Designações Técnicas */}
        <div style={{ marginBottom: "14px" }}>
          <div style={headerBar("#2a6b77")}>Designações Técnicas</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold" })}>Data</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold" })}>Indicadores</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold" })}>Mic. Volante</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold" })}>Áudio e Vídeo</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold" })}>Palco</th>
              </tr>
            </thead>
            <tbody>
              {designacoesTecnicas.map((d) => (
                <tr key={d.data} style={{ backgroundColor: d.dia_semana === "DOMINGO" ? "#f9fafb" : "white" }}>
                  <td style={cell({ fontWeight: "bold", whiteSpace: "nowrap" })}>
                    {formatarData(d.data)} <span style={{ fontWeight: "normal", color: "#666" }}>{d.dia_semana}</span>
                  </td>
                  <td style={cell()}>
                    {[d.indicador1, d.indicador2].filter(Boolean).map((nome, i) => (
                      <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                        {i > 0 && " / "}{nome}
                        {onCompartilharTecnica && <BotaoWppCell onClick={() => onCompartilharTecnica(d, "Indicador", nome!)} />}
                      </span>
                    ))}
                    {![d.indicador1, d.indicador2].filter(Boolean).length && "—"}
                  </td>
                  <td style={cell()}>
                    {[d.mic_volante1, d.mic_volante2].filter(Boolean).map((nome, i) => (
                      <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                        {i > 0 && " / "}{nome}
                        {onCompartilharTecnica && <BotaoWppCell onClick={() => onCompartilharTecnica(d, "Microfone Volante", nome!)} />}
                      </span>
                    ))}
                    {![d.mic_volante1, d.mic_volante2].filter(Boolean).length && "—"}
                  </td>
                  <td style={cell()}>
                    {d.audio_video ? (
                      <span style={{ display: "inline-flex", alignItems: "center" }}>
                        {d.audio_video}
                        {onCompartilharTecnica && <BotaoWppCell onClick={() => onCompartilharTecnica(d, "Áudio e Vídeo", d.audio_video!)} />}
                      </span>
                    ) : "—"}
                  </td>
                  <td style={cell()}>
                    {d.palco ? (
                      <span style={{ display: "inline-flex", alignItems: "center" }}>
                        {d.palco}
                        {onCompartilharTecnica && <BotaoWppCell onClick={() => onCompartilharTecnica(d, "Palco", d.palco!)} />}
                      </span>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reunião Pública */}
        <div style={{ marginBottom: "14px" }}>
          <div style={headerBar("#c69214")}>Reunião Pública — Presidente e Leitor</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold" })}>Data</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold" })}>Presidente de Conferência</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold" })}>Leitor de A Sentinela</th>
              </tr>
            </thead>
            <tbody>
              {designacoesReuniaoPublica.map((r) => (
                <tr key={r.data}>
                  <td style={cell({ fontWeight: "bold" })}>{formatarData(r.data)}</td>
                  <td style={cell()}>
                    {r.presidente ? (
                      <span style={{ display: "inline-flex", alignItems: "center" }}>
                        {r.presidente}
                        {onCompartilharReuniaoPublica && <BotaoWppCell onClick={() => onCompartilharReuniaoPublica(r, "Presidente de Conferência", r.presidente!)} />}
                      </span>
                    ) : "—"}
                  </td>
                  <td style={cell()}>
                    {r.leitor_sentinela ? (
                      <span style={{ display: "inline-flex", alignItems: "center" }}>
                        {r.leitor_sentinela}
                        {onCompartilharReuniaoPublica && <BotaoWppCell onClick={() => onCompartilharReuniaoPublica(r, "Leitor de A Sentinela", r.leitor_sentinela!)} />}
                      </span>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Arranjo de Discursos */}
        <div style={{ marginBottom: "14px" }}>
          <div style={headerBar("#8b2332")}>Arranjo de Discursos</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold" })}>Data</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold" })}>Tema</th>
                <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold" })}>Orador</th>
              </tr>
            </thead>
            <tbody>
              {arranjoDiscursos.map((d) => (
                <tr key={d.data}>
                  <td style={cell({ fontWeight: "bold" })}>{formatarData(d.data)}</td>
                  <td style={cell()}>{d.tema || "—"}</td>
<td style={cell()}>
                    {d.orador ? (
                      <span style={{ display: "inline-flex", alignItems: "center" }}>
                        {d.orador}
                        {onCompartilharDiscurso && <BotaoWppCell onClick={() => onCompartilharDiscurso(d)} />}
                      </span>
                    ) : "—"}
                  </td>
                  </tr>
                  ))}
                  </tbody>
          </table>
        </div>

        {/* Assistência às Reuniões */}
        <div style={{ marginBottom: "14px" }}>
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
          marginTop: "20px", 
          paddingTop: "10px", 
          borderTop: "1px solid #e5e7eb",
          textAlign: "center",
          fontSize: "9px",
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
    padding: "4px 8px", 
    fontSize: "8px", 
    textAlign: "center", 
    ...extra,
  })

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={cell({ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#e5e7eb", minWidth: "70px" })}>{titulo}</th>
            {registros.map((a) => (
              <th key={a.data} style={cell({ fontWeight: "600", whiteSpace: "nowrap", backgroundColor: "#f3f4f6", minWidth: "45px" })}>
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
