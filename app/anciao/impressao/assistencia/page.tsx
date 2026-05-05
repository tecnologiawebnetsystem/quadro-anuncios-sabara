"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { BarChart3, Loader2, Users, Monitor, TrendingUp } from "lucide-react"
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

interface ZoomPublicador {
  publicador_nome: string
  total: number
}

// ─── Componente imprimível ────────────────────────────────────────────────────

const PrintAssistencia = ({
  dados,
  rankingZoom,
}: {
  dados: AssistenciaReuniao[]
  rankingZoom: ZoomPublicador[]
}) => {
  const congregacao = "Congregação Parque Sabará — Taubaté SP"
  const geradoEm   = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR })

  const totalPresencial = dados.reduce((acc, d) => acc + (d.presencial || 0), 0)
  const totalZoom       = dados.reduce((acc, d) => acc + (d.zoom       || 0), 0)
  const mediaPresencial = dados.length > 0 ? Math.round(totalPresencial / dados.length) : 0
  const mediaZoom       = dados.length > 0 ? Math.round(totalZoom       / dados.length) : 0
  const mediaTotal      = mediaPresencial + mediaZoom
  const maxTotal        = Math.max(...dados.map(d => (d.presencial || 0) + (d.zoom || 0)), 1)

  // Tendência
  const metade       = Math.floor(dados.length / 2)
  const mediaAntiga  = metade > 0 ? Math.round(dados.slice(0, metade).reduce((acc, d) => acc + (d.presencial || 0) + (d.zoom || 0), 0) / metade) : 0
  const mediaRecente = metade > 0 ? Math.round(dados.slice(metade).reduce((acc, d) => acc + (d.presencial || 0) + (d.zoom || 0), 0) / (dados.length - metade)) : 0
  const tendencia    = mediaRecente > mediaAntiga ? "alta" : mediaRecente < mediaAntiga ? "baixa" : "estavel"

  // Dados agrupados por mês para gráfico da 2ª página
  const porMes: Record<string, { presencial: number; zoom: number; count: number }> = {}
  dados.forEach(d => {
    const mes = format(parseISO(d.data), "MMM/yy", { locale: ptBR })
    if (!porMes[mes]) porMes[mes] = { presencial: 0, zoom: 0, count: 0 }
    porMes[mes].presencial += d.presencial || 0
    porMes[mes].zoom       += d.zoom       || 0
    porMes[mes].count++
  })
  const meses    = Object.entries(porMes)
  const maxMedia = Math.max(...meses.map(([, v]) => Math.round((v.presencial + v.zoom) / v.count)), 1)

  // Pizza: proporção presencial vs zoom
  const totalGeral  = totalPresencial + totalZoom
  const pctPres     = totalGeral > 0 ? Math.round((totalPresencial / totalGeral) * 100) : 0
  const pctZoom100  = 100 - pctPres
  // SVG donut
  const r = 60, cx = 80, cy = 80, circunf = 2 * Math.PI * r
  const dashPres = (pctPres / 100) * circunf
  const dashZoom = (pctZoom100 / 100) * circunf
  const offsetZoom = circunf - dashPres

  const headerStyle: React.CSSProperties = {
    borderBottom: "2px solid #1e3a5f",
    paddingBottom: 16,
    marginBottom: 24,
  }

  return (
    <>
      {/* ── PÁGINA 1: resumo + histórico + tabela ─────────────────────────── */}
      <div
        className="bg-white text-black font-sans"
        style={{ minWidth: 600, maxWidth: 900, margin: "0 auto", padding: "32px 40px" }}
      >
        {/* Cabeçalho */}
        <div style={headerStyle}>
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

        {/* Cards de resumo — sem "Total Registros" */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Média Presencial", valor: mediaPresencial, cor: "#1d4ed8", bg: "#eff6ff" },
            { label: "Média Zoom",       valor: mediaZoom,       cor: "#0891b2", bg: "#ecfeff" },
            { label: "Média Total",      valor: mediaTotal,      cor: "#166534", bg: "#f0fdf4" },
          ].map(card => (
            <div
              key={card.label}
              style={{ background: card.bg, border: `1px solid ${card.cor}30`, borderRadius: 8, padding: "12px 14px" }}
            >
              <p style={{ fontSize: 10, color: "#555", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {card.label}
              </p>
              <p style={{ fontSize: 28, fontWeight: 700, color: card.cor, margin: 0 }}>{card.valor}</p>
            </div>
          ))}
        </div>

        {/* Tendência */}
        <div style={{
          background: tendencia === "alta" ? "#f0fdf4" : tendencia === "baixa" ? "#fff1f2" : "#f8fafc",
          border: `1px solid ${tendencia === "alta" ? "#bbf7d0" : tendencia === "baixa" ? "#fecdd3" : "#e2e8f0"}`,
          borderRadius: 8, padding: "10px 16px", marginBottom: 24,
        }}>
          <span style={{ fontSize: 11, color: "#333" }}>
            <strong>Tendência:</strong>{" "}
            {tendencia === "alta"
              ? `Crescimento — média recente de ${mediaRecente} vs. ${mediaAntiga} nas reuniões anteriores`
              : tendencia === "baixa"
              ? `Queda — média recente de ${mediaRecente} vs. ${mediaAntiga} nas reuniões anteriores`
              : "Estável — sem variação significativa entre os períodos"}
          </span>
        </div>

        {/* Gráfico de barras horizontal */}
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f", marginBottom: 14, marginTop: 0 }}>
          Histórico de Assistência
        </h2>
        <div style={{ marginBottom: 24 }}>
          {dados.map((d, i) => {
            const total      = (d.presencial || 0) + (d.zoom || 0)
            const pctPres    = Math.round(((d.presencial || 0) / maxTotal) * 100)
            const pctZ       = Math.round(((d.zoom       || 0) / maxTotal) * 100)
            const dataFmt    = format(parseISO(d.data), "dd/MM/yy", { locale: ptBR })
            const diaSem     = d.dia_semana ? d.dia_semana.charAt(0).toUpperCase() + d.dia_semana.slice(1, 3).toLowerCase() : ""
            return (
              <div key={d.id || i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <span style={{ fontSize: 10, color: "#222", fontWeight: 600, width: 64, flexShrink: 0, textAlign: "right" }}>
                  {diaSem} {dataFmt}
                </span>
                <div style={{ flex: 1, display: "flex", height: 14, borderRadius: 3, overflow: "hidden", background: "#f1f5f9" }}>
                  <div style={{ width: `${pctPres}%`, background: "#1d4ed8" }} />
                  <div style={{ width: `${pctZ}%`,    background: "#0891b2" }} />
                </div>
                <span style={{ fontSize: 10, color: "#333", width: 68, flexShrink: 0 }}>
                  <span style={{ color: "#1d4ed8", fontWeight: 600 }}>{d.presencial || 0}</span>
                  {" + "}
                  <span style={{ color: "#0891b2", fontWeight: 600 }}>{d.zoom || 0}</span>
                  {" = "}
                  <strong>{total}</strong>
                </span>
              </div>
            )
          })}
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#555" }}>
              <span style={{ width: 12, height: 12, background: "#1d4ed8", borderRadius: 2, display: "inline-block" }} /> Presencial
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#555" }}>
              <span style={{ width: 12, height: 12, background: "#0891b2", borderRadius: 2, display: "inline-block" }} /> Zoom
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
              <th style={{ padding: "7px 10px", textAlign: "left",   fontWeight: 600 }}>Data</th>
              <th style={{ padding: "7px 10px", textAlign: "left",   fontWeight: 600 }}>Dia</th>
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
                  <td style={{ padding: "6px 10px", textAlign: "center", color: "#1d4ed8", fontWeight: 600 }}>{d.presencial || 0}</td>
                  <td style={{ padding: "6px 10px", textAlign: "center", color: "#0891b2", fontWeight: 600 }}>{d.zoom || 0}</td>
                  <td style={{ padding: "6px 10px", textAlign: "center", fontWeight: 700 }}>{total}</td>
                  <td style={{ padding: "6px 10px", textAlign: "center", fontWeight: 600,
                    color: diff > 0 ? "#166534" : diff < 0 ? "#991b1b" : "#555" }}>
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

        {/* Rodapé pág 1 */}
        <div style={{ marginTop: 24, borderTop: "1px solid #e2e8f0", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
          <p style={{ fontSize: 9, color: "#aaa", margin: 0 }}>QuadroAnúncios — {congregacao}</p>
          <p style={{ fontSize: 9, color: "#aaa", margin: 0 }}>Gerado em {geradoEm} · Página 1</p>
        </div>
      </div>

      {/* ── PÁGINA 2: gráficos e estatísticas ─────────────────────────────── */}
      <div
        className="bg-white text-black font-sans"
        style={{ minWidth: 600, maxWidth: 900, margin: "0 auto", padding: "32px 40px", pageBreakBefore: "always" }}
      >
        {/* Cabeçalho pág 2 */}
        <div style={headerStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>
                Estatísticas de Assistência
              </h1>
              <p style={{ fontSize: 12, color: "#555", margin: "4px 0 0" }}>{congregacao}</p>
            </div>
            <p style={{ fontSize: 11, color: "#777", margin: 0 }}>Gerado em {geradoEm}</p>
          </div>
        </div>

        {/* Linha superior: donut + distribuição por dia */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>

          {/* Gráfico donut presencial vs zoom */}
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px" }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#1e3a5f", margin: "0 0 14px" }}>
              Distribuição Presencial × Zoom
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <svg width={160} height={160} viewBox="0 0 160 160">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth={20} />
                <circle
                  cx={cx} cy={cy} r={r} fill="none"
                  stroke="#1d4ed8" strokeWidth={20}
                  strokeDasharray={`${dashPres} ${circunf}`}
                  strokeDashoffset={circunf / 4}
                  strokeLinecap="butt"
                />
                <circle
                  cx={cx} cy={cy} r={r} fill="none"
                  stroke="#0891b2" strokeWidth={20}
                  strokeDasharray={`${dashZoom} ${circunf}`}
                  strokeDashoffset={circunf / 4 - dashPres}
                  strokeLinecap="butt"
                />
                <text x={cx} y={cy - 8}  textAnchor="middle" fontSize={18} fontWeight={700} fill="#1e3a5f">{pctPres}%</text>
                <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9}  fill="#777">presencial</text>
              </svg>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ width: 12, height: 12, background: "#1d4ed8", borderRadius: 2, display: "inline-block" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#1d4ed8" }}>Presencial</span>
                  </div>
                  <p style={{ fontSize: 20, fontWeight: 700, color: "#1d4ed8", margin: 0 }}>{pctPres}%</p>
                  <p style={{ fontSize: 10, color: "#555", margin: "2px 0 0" }}>Média: {mediaPresencial}/reunião</p>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ width: 12, height: 12, background: "#0891b2", borderRadius: 2, display: "inline-block" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#0891b2" }}>Zoom</span>
                  </div>
                  <p style={{ fontSize: 20, fontWeight: 700, color: "#0891b2", margin: 0 }}>{pctZoom100}%</p>
                  <p style={{ fontSize: 10, color: "#555", margin: "2px 0 0" }}>Média: {mediaZoom}/reunião</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de barras: média por dia da semana */}
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px" }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#1e3a5f", margin: "0 0 14px" }}>
              Média por Dia da Semana
            </h3>
            {(() => {
              const porDia: Record<string, number[]> = {}
              dados.forEach(d => {
                const dia = d.dia_semana || "?"
                if (!porDia[dia]) porDia[dia] = []
                porDia[dia].push((d.presencial || 0) + (d.zoom || 0))
              })
              const diasOrdem = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"]
              const diasFiltrados = diasOrdem.filter(d => porDia[d])
              const maxDia = Math.max(...diasFiltrados.map(d => Math.round(porDia[d].reduce((a, b) => a + b, 0) / porDia[d].length)), 1)
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {diasFiltrados.map(dia => {
                    const media = Math.round(porDia[dia].reduce((a, b) => a + b, 0) / porDia[dia].length)
                    const pct   = Math.round((media / maxDia) * 100)
                    return (
                      <div key={dia} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#333", width: 50, flexShrink: 0, textTransform: "capitalize" }}>
                          {dia.slice(0, 3)}
                        </span>
                        <div style={{ flex: 1, height: 14, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "#1e3a5f" }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#1e3a5f", width: 28, textAlign: "right" }}>{media}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>
        </div>

        {/* Média mensal — barras verticais */}
        {meses.length > 0 && (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 28 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#1e3a5f", margin: "0 0 16px" }}>
              Evolução Mensal (média de assistência)
            </h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
              {meses.map(([mes, v]) => {
                const media = Math.round((v.presencial + v.zoom) / v.count)
                const pct   = Math.round((media / maxMedia) * 100)
                const pctP  = Math.round((v.presencial / v.count / media) * 100)
                const pctZ  = 100 - pctP
                return (
                  <div key={mes} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#1e3a5f" }}>{media}</span>
                    <div style={{ width: "100%", height: `${pct}px`, display: "flex", flexDirection: "column", borderRadius: "3px 3px 0 0", overflow: "hidden" }}>
                      <div style={{ flex: pctP, background: "#1d4ed8" }} />
                      <div style={{ flex: pctZ, background: "#0891b2" }} />
                    </div>
                    <span style={{ fontSize: 8, color: "#555", textAlign: "center", lineHeight: 1.2 }}>{mes}</span>
                  </div>
                )
              })}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#555" }}>
                <span style={{ width: 12, height: 12, background: "#1d4ed8", borderRadius: 2, display: "inline-block" }} /> Presencial
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#555" }}>
                <span style={{ width: 12, height: 12, background: "#0891b2", borderRadius: 2, display: "inline-block" }} /> Zoom
              </span>
            </div>
          </div>
        )}

        {/* Ranking de publicadores no Zoom */}
        {rankingZoom.length > 0 && (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#1e3a5f", margin: "0 0 14px" }}>
              Publicadores que mais participam pelo Zoom
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px 20px" }}>
              {rankingZoom.slice(0, 20).map((p, i) => {
                const pct = Math.round((p.total / rankingZoom[0].total) * 100)
                return (
                  <div key={p.publicador_nome} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: i < 3 ? "#1d4ed8" : "#555", width: 16, textAlign: "right" }}>
                      {i + 1}.
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#111" }}>{p.publicador_nome}</span>
                        <span style={{ fontSize: 10, color: "#0891b2", fontWeight: 700 }}>{p.total}x</span>
                      </div>
                      <div style={{ height: 5, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: i < 3 ? "#1d4ed8" : "#0891b2" }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Rodapé pág 2 */}
        <div style={{ marginTop: 8, borderTop: "1px solid #e2e8f0", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
          <p style={{ fontSize: 9, color: "#aaa", margin: 0 }}>QuadroAnúncios — {congregacao}</p>
          <p style={{ fontSize: 9, color: "#aaa", margin: 0 }}>Gerado em {geradoEm} · Página 2</p>
        </div>
      </div>
    </>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ImpressaoAssistenciaPage() {
  const [dados,       setDados]       = useState<AssistenciaReuniao[]>([])
  const [rankingZoom, setRankingZoom] = useState<ZoomPublicador[]>([])
  const [loading,     setLoading]     = useState(true)
  const printRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      const [{ data: assistencia }, { data: zoom }] = await Promise.all([
        supabase.from("assistencia_reunioes").select("*").order("data", { ascending: true }),
        supabase
          .from("assistencia_zoom_publicadores")
          .select("publicador_nome")
          .order("publicador_nome"),
      ])

      setDados(assistencia || [])

      // Contagem local de aparições por nome
      const contagem: Record<string, number> = {}
      ;(zoom || []).forEach(r => {
        contagem[r.publicador_nome] = (contagem[r.publicador_nome] || 0) + 1
      })
      const ranking = Object.entries(contagem)
        .map(([publicador_nome, total]) => ({ publicador_nome, total }))
        .sort((a, b) => b.total - a.total)
      setRankingZoom(ranking)
    } catch (err) {
      console.error("[v0] Erro ao carregar assistência:", err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => { carregarDados() }, [carregarDados])

  const mediaPresencial = dados.length > 0
    ? Math.round(dados.reduce((acc, d) => acc + (d.presencial || 0), 0) / dados.length) : 0
  const mediaZoom = dados.length > 0
    ? Math.round(dados.reduce((acc, d) => acc + (d.zoom || 0), 0) / dados.length) : 0

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra de controle */}
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
                : `${dados.length} reuniões · Média total: ${mediaPresencial + mediaZoom} (${mediaPresencial} presencial + ${mediaZoom} Zoom)`}
            </p>
          </div>
        </div>
        <PrintActionButtons
          printRef={printRef}
          documentTitle="Assistência — Congregação Parque Sabará"
          colorScheme="blue"
        />
      </div>

      {/* Cards rápidos na tela */}
      {!loading && dados.length > 0 && (
        <div className="print:hidden px-6 pt-5 pb-0 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {[
              { label: "Média Presencial", valor: mediaPresencial,              icon: Users,      cor: "text-blue-400",  bg: "bg-blue-500/10",  borda: "border-blue-500/20" },
              { label: "Média Zoom",       valor: mediaZoom,                    icon: Monitor,    cor: "text-cyan-400",  bg: "bg-cyan-500/10",  borda: "border-cyan-500/20" },
              { label: "Média Total",      valor: mediaPresencial + mediaZoom,  icon: TrendingUp, cor: "text-green-400", bg: "bg-green-500/10", borda: "border-green-500/20" },
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
          <div ref={printRef}>
            <div className="print:hidden rounded-xl border border-border bg-white overflow-hidden shadow-sm">
              <PrintAssistencia dados={dados} rankingZoom={rankingZoom} />
            </div>
            <div className="hidden print:block">
              <PrintAssistencia dados={dados} rankingZoom={rankingZoom} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
