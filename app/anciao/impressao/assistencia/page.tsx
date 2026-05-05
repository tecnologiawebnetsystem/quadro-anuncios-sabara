"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { BarChart3, Loader2, Users, Monitor, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { PrintActionButtons } from "@/components/impressao/print-action-buttons"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import "@/app/impressao/print-styles.css"

interface AssistenciaReuniao {
  id: string
  data: string
  dia_semana: string
  presencial: number
  zoom: number
}

// ─── Componente imprimível ────────────────────────────────────────────────────

const PrintAssistencia = ({ dados }: { dados: AssistenciaReuniao[] }) => {
  const congregacao = "Congregação Parque Sabará — Taubaté SP"
  const geradoEm = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR })

  const totalPresencial = dados.reduce((acc, d) => acc + (d.presencial || 0), 0)
  const totalZoom       = dados.reduce((acc, d) => acc + (d.zoom || 0), 0)
  const mediaPresencial = dados.length > 0 ? Math.round(totalPresencial / dados.length) : 0
  const mediaZoom       = dados.length > 0 ? Math.round(totalZoom       / dados.length) : 0
  const mediaTotal      = mediaPresencial + mediaZoom

  const maxPresencial = Math.max(...dados.map(d => d.presencial || 0), 1)
  const maxZoom       = Math.max(...dados.map(d => d.zoom || 0), 1)
  const maxTotal      = Math.max(...dados.map(d => (d.presencial || 0) + (d.zoom || 0)), 1)

  // Tendência: compara última metade com primeira metade
  const metade = Math.floor(dados.length / 2)
  const mediaAntiga  = metade > 0
    ? Math.round(dados.slice(0, metade).reduce((acc, d) => acc + (d.presencial || 0) + (d.zoom || 0), 0) / metade)
    : 0
  const mediaRecente = metade > 0
    ? Math.round(dados.slice(metade).reduce((acc, d) => acc + (d.presencial || 0) + (d.zoom || 0), 0) / (dados.length - metade))
    : 0
  const tendencia = mediaRecente > mediaAntiga ? "alta" : mediaRecente < mediaAntiga ? "baixa" : "estavel"

  return (
    <div
      className="bg-white text-black font-sans"
      style={{ minWidth: 600, maxWidth: 900, margin: "0 auto", padding: "32px 40px" }}
    >
      {/* Cabeçalho */}
      <div style={{ borderBottom: "2px solid #1e3a5f", paddingBottom: 16, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>
              Relatório de Assistência
            </h1>
            <p style={{ fontSize: 12, color: "#555", margin: "4px 0 0" }}>{congregacao}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: "#777", margin: 0 }}>Gerado em {geradoEm}</p>
            <p style={{ fontSize: 11, color: "#777", margin: "2px 0 0" }}>{dados.length} reuniões registradas</p>
          </div>
        </div>
      </div>

      {/* Cards de resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Média Presencial", valor: mediaPresencial, cor: "#1d4ed8", bg: "#eff6ff" },
          { label: "Média Zoom",       valor: mediaZoom,       cor: "#0891b2", bg: "#ecfeff" },
          { label: "Média Total",      valor: mediaTotal,      cor: "#166534", bg: "#f0fdf4" },
          { label: "Total Registros",  valor: dados.length,    cor: "#92400e", bg: "#fffbeb" },
        ].map(card => (
          <div
            key={card.label}
            style={{ background: card.bg, border: `1px solid ${card.cor}30`, borderRadius: 8, padding: "12px 14px" }}
          >
            <p style={{ fontSize: 10, color: "#555", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>
              {card.label}
            </p>
            <p style={{ fontSize: 26, fontWeight: 700, color: card.cor, margin: 0 }}>{card.valor}</p>
          </div>
        ))}
      </div>

      {/* Tendência */}
      <div
        style={{
          background: tendencia === "alta" ? "#f0fdf4" : tendencia === "baixa" ? "#fff1f2" : "#f8fafc",
          border: `1px solid ${tendencia === "alta" ? "#bbf7d0" : tendencia === "baixa" ? "#fecdd3" : "#e2e8f0"}`,
          borderRadius: 8,
          padding: "10px 16px",
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 11, color: "#555" }}>
          <strong>Tendência:</strong>{" "}
          {tendencia === "alta"
            ? `Crescimento — média recente de ${mediaRecente} vs. ${mediaAntiga} nas reuniões anteriores`
            : tendencia === "baixa"
            ? `Queda — média recente de ${mediaRecente} vs. ${mediaAntiga} nas reuniões anteriores`
            : "Estável — sem variação significativa entre os períodos"}
        </span>
      </div>

      {/* Gráfico de barras simples (horizontal) */}
      <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f", marginBottom: 14, marginTop: 0 }}>
        Histórico de Assistência
      </h2>
      <div style={{ marginBottom: 28 }}>
        {dados.map((d, i) => {
          const total      = (d.presencial || 0) + (d.zoom || 0)
          const pct        = Math.round((total / maxTotal) * 100)
          const pctPres    = Math.round(((d.presencial || 0) / maxTotal) * 100)
          const pctZoom    = Math.round(((d.zoom || 0) / maxTotal) * 100)
          const dataFormatada = format(parseISO(d.data), "dd/MM/yy", { locale: ptBR })
          const diaSemana     = d.dia_semana
            ? d.dia_semana.charAt(0).toUpperCase() + d.dia_semana.slice(1, 3).toLowerCase()
            : ""

          return (
            <div key={d.id || i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: "#222", fontWeight: 600, width: 60, flexShrink: 0, textAlign: "right" }}>
                {diaSemana} {dataFormatada}
              </span>
              <div style={{ flex: 1, display: "flex", height: 16, borderRadius: 4, overflow: "hidden", background: "#f1f5f9" }}>
                <div style={{ width: `${pctPres}%`, background: "#1d4ed8", transition: "width 0.3s" }} title={`Presencial: ${d.presencial}`} />
                <div style={{ width: `${pctZoom}%`, background: "#0891b2", transition: "width 0.3s" }} title={`Zoom: ${d.zoom}`} />
              </div>
              <span style={{ fontSize: 10, color: "#333", width: 60, flexShrink: 0 }}>
                <span style={{ color: "#1d4ed8", fontWeight: 600 }}>{d.presencial || 0}</span>
                {" + "}
                <span style={{ color: "#0891b2", fontWeight: 600 }}>{d.zoom || 0}</span>
                {" = "}
                <strong>{total}</strong>
              </span>
            </div>
          )
        })}
        {/* Legenda */}
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#555" }}>
            <span style={{ width: 12, height: 12, background: "#1d4ed8", borderRadius: 2, display: "inline-block" }} />
            Presencial
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#555" }}>
            <span style={{ width: 12, height: 12, background: "#0891b2", borderRadius: 2, display: "inline-block" }} />
            Zoom
          </span>
        </div>
      </div>

      {/* Tabela detalhada */}
      <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f", marginBottom: 10, marginTop: 0 }}>
        Detalhamento por Reunião
      </h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr style={{ background: "#1e3a5f", color: "#fff" }}>
            <th style={{ padding: "7px 10px", textAlign: "left",  fontWeight: 600 }}>Data</th>
            <th style={{ padding: "7px 10px", textAlign: "left",  fontWeight: 600 }}>Dia</th>
            <th style={{ padding: "7px 10px", textAlign: "center", fontWeight: 600 }}>Presencial</th>
            <th style={{ padding: "7px 10px", textAlign: "center", fontWeight: 600 }}>Zoom</th>
            <th style={{ padding: "7px 10px", textAlign: "center", fontWeight: 600 }}>Total</th>
            <th style={{ padding: "7px 10px", textAlign: "center", fontWeight: 600 }}>vs. Média</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((d, i) => {
            const total   = (d.presencial || 0) + (d.zoom || 0)
            const diff    = total - mediaTotal
            const isAlta  = diff > 0
            const isBaixa = diff < 0
            return (
              <tr
                key={d.id || i}
                style={{ background: i % 2 === 0 ? "#fff" : "#f0f4f8", borderBottom: "1px solid #cbd5e1" }}
              >
                <td style={{ padding: "6px 10px", color: "#111", fontWeight: 500 }}>
                  {format(parseISO(d.data), "dd/MM/yyyy", { locale: ptBR })}
                </td>
                <td style={{ padding: "6px 10px", textTransform: "capitalize", color: "#111", fontWeight: 500 }}>
                  {d.dia_semana || "—"}
                </td>
                <td style={{ padding: "6px 10px", textAlign: "center", color: "#1d4ed8", fontWeight: 600 }}>
                  {d.presencial || 0}
                </td>
                <td style={{ padding: "6px 10px", textAlign: "center", color: "#0891b2", fontWeight: 600 }}>
                  {d.zoom || 0}
                </td>
                <td style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700 }}>
                  {total}
                </td>
                <td style={{ padding: "6px 10px", textAlign: "center", color: isAlta ? "#166534" : isBaixa ? "#991b1b" : "#555", fontWeight: 600 }}>
                  {diff > 0 ? `+${diff}` : diff === 0 ? "—" : diff}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr style={{ background: "#1e3a5f", color: "#fff", fontWeight: 700 }}>
            <td colSpan={2} style={{ padding: "7px 10px" }}>Média</td>
            <td style={{ padding: "7px 10px", textAlign: "center" }}>{mediaPresencial}</td>
            <td style={{ padding: "7px 10px", textAlign: "center" }}>{mediaZoom}</td>
            <td style={{ padding: "7px 10px", textAlign: "center" }}>{mediaTotal}</td>
            <td style={{ padding: "7px 10px", textAlign: "center" }}>—</td>
          </tr>
        </tfoot>
      </table>

      {/* Rodapé */}
      <div style={{ marginTop: 28, borderTop: "1px solid #e2e8f0", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: 9, color: "#aaa", margin: 0 }}>QuadroAnúncios — {congregacao}</p>
        <p style={{ fontSize: 9, color: "#aaa", margin: 0 }}>Gerado em {geradoEm}</p>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ImpressaoAssistenciaPage() {
  const [dados, setDados]   = useState<AssistenciaReuniao[]>([])
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from("assistencia_reunioes")
        .select("*")
        .order("data", { ascending: true })
      setDados(data || [])
    } catch (error) {
      console.error("Erro ao carregar assistência:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => { carregarDados() }, [carregarDados])

  const mediaPresencial = dados.length > 0
    ? Math.round(dados.reduce((acc, d) => acc + (d.presencial || 0), 0) / dados.length)
    : 0
  const mediaZoom = dados.length > 0
    ? Math.round(dados.reduce((acc, d) => acc + (d.zoom || 0), 0) / dados.length)
    : 0

  const documentTitle = "Assistência — Congregação Parque Sabará"

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra de controle — não imprime */}
      <div className="print:hidden sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30">
            <BarChart3 className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-base font-bold">Assistência</h1>
            <p className="text-xs text-muted-foreground">
              {loading
                ? "Carregando..."
                : `${dados.length} reuniões · Média: ${mediaPresencial + mediaZoom} (${mediaPresencial} presencial + ${mediaZoom} Zoom)`}
            </p>
          </div>
        </div>
        <PrintActionButtons
          printRef={printRef}
          documentTitle={documentTitle}
          colorScheme="blue"
        />
      </div>

      {/* Estatísticas rápidas — tela */}
      {!loading && dados.length > 0 && (
        <div className="print:hidden px-6 pt-5 pb-0 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: "Média Presencial", valor: mediaPresencial,              icon: Users,      cor: "text-blue-400",  bg: "bg-blue-500/10",  borda: "border-blue-500/20" },
              { label: "Média Zoom",       valor: mediaZoom,                    icon: Monitor,    cor: "text-cyan-400",  bg: "bg-cyan-500/10",  borda: "border-cyan-500/20" },
              { label: "Média Total",      valor: mediaPresencial + mediaZoom,  icon: BarChart3,  cor: "text-green-400", bg: "bg-green-500/10", borda: "border-green-500/20" },
              { label: "Reuniões",         valor: dados.length,                 icon: TrendingUp, cor: "text-amber-400", bg: "bg-amber-500/10", borda: "border-amber-500/20" },
            ].map(card => (
              <div key={card.label} className={`rounded-xl border ${card.borda} ${card.bg} p-4 flex items-center gap-3`}>
                <card.icon className={`h-5 w-5 flex-shrink-0 ${card.cor}`} />
                <div>
                  <p className="text-2xl font-bold text-foreground">{card.valor}</p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Área de conteúdo */}
      <div className="p-6 max-w-4xl mx-auto print:p-0 print:max-w-none">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : dados.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
            <BarChart3 className="h-10 w-10 opacity-30" />
            <p className="text-sm">Nenhum registro de assistência encontrado.</p>
          </div>
        ) : (
          <>
            {/* Preview na tela */}
            <div className="print:hidden rounded-xl border border-border bg-card overflow-hidden">
              <div ref={printRef}>
                <PrintAssistencia dados={dados} />
              </div>
            </div>

            {/* Conteúdo oculto para impressão */}
            <div className="hidden print:block">
              <div ref={printRef}>
                <PrintAssistencia dados={dados} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
