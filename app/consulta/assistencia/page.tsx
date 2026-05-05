"use client"

import { useState, useEffect, useMemo } from "react"
import {
  BarChart3, Users, Monitor, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown, Minus, Trophy, Calendar,
  Filter, ArrowUpDown,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { format, parseISO, isSameMonth, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface Reuniao {
  id: string
  data: string
  mes: string
  dia_semana: string
  presencial: number
  zoom: number
  total: number
}

interface ZoomPublicador {
  publicador_id: string
  publicador_nome: string
  total: number
}

const MES_INICIAL = new Date(2026, 4, 1) // maio 2026

// ── Componente principal ───────────────────────────────────────────────────────

export default function ConsultaAssistenciaPage() {
  const [reunioes, setReunioes]         = useState<Reuniao[]>([])
  const [ranking, setRanking]           = useState<ZoomPublicador[]>([])
  const [loading, setLoading]           = useState(true)
  const [mesAtual, setMesAtual]         = useState<Date>(MES_INICIAL)
  const [filtroTipo, setFiltroTipo]     = useState<"todos" | "quinta" | "domingo">("todos")
  const [abaAtiva, setAbaAtiva]         = useState<"resumo" | "historico" | "ranking">("resumo")

  const supabase = createClient()

  // ── Carga de dados ─────────────────────────────────────────────────────────
  useEffect(() => {
    async function carregar() {
      setLoading(true)
      const { data: r } = await supabase
        .from("assistencia_reunioes")
        .select("id, data, mes, dia_semana, presencial, zoom, total")
        .gte("data", "2026-05-01")
        .order("data", { ascending: true })

      const { data: zp } = await supabase
        .from("assistencia_zoom_publicadores")
        .select("publicador_id, publicador_nome")

      // Agrega contagem por publicador
      const contagem: Record<string, { nome: string; total: number }> = {}
      ;(zp || []).forEach(row => {
        if (!contagem[row.publicador_id]) contagem[row.publicador_id] = { nome: row.publicador_nome, total: 0 }
        contagem[row.publicador_id].total++
      })
      const rankingSorted = Object.entries(contagem)
        .map(([id, v]) => ({ publicador_id: id, publicador_nome: v.nome, total: v.total }))
        .sort((a, b) => b.total - a.total)

      setReunioes(r || [])
      setRanking(rankingSorted)
      setLoading(false)
    }
    carregar()
  }, [])

  // ── Filtragem por mês ──────────────────────────────────────────────────────
  const reunioesMes = useMemo(() =>
    reunioes.filter(r => {
      try {
        const mesOk = isSameMonth(parseISO(r.data), mesAtual)
        const tipoOk = filtroTipo === "todos"
          || (filtroTipo === "quinta"  && r.dia_semana?.toLowerCase() === "quinta")
          || (filtroTipo === "domingo" && r.dia_semana?.toLowerCase() === "domingo")
        return mesOk && tipoOk
      } catch { return false }
    })
  , [reunioes, mesAtual, filtroTipo])

  // ── Estatísticas do mês ────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!reunioesMes.length) return { mediaTotal: 0, mediaPresencial: 0, mediaZoom: 0, maiorPresenca: 0, menorPresenca: Infinity, tendencia: 0 }
    const totais      = reunioesMes.map(r => r.total)
    const mediaTotal  = Math.round(totais.reduce((a, b) => a + b, 0) / totais.length)
    const mediaPresencial = Math.round(reunioesMes.reduce((a, r) => a + r.presencial, 0) / reunioesMes.length)
    const mediaZoom   = Math.round(reunioesMes.reduce((a, r) => a + r.zoom, 0) / reunioesMes.length)
    const maiorPresenca = Math.max(...totais)
    const menorPresenca = Math.min(...totais)
    // Tendência: compara media da 2a metade vs 1a metade
    const metade = Math.floor(totais.length / 2)
    const primeira = totais.slice(0, metade || 1).reduce((a, b) => a + b, 0) / (metade || 1)
    const segunda  = totais.slice(metade).reduce((a, b) => a + b, 0) / (totais.length - metade || 1)
    const tendencia = Math.round(segunda - primeira)
    return { mediaTotal, mediaPresencial, mediaZoom, maiorPresenca, menorPresenca: menorPresenca === Infinity ? 0 : menorPresenca, tendencia }
  }, [reunioesMes])

  // ── Histórico geral (todas as reuniões com dados) ─────────────────────────
  const reunioesComDados = useMemo(() =>
    reunioes.filter(r => r.total > 0).slice(-20)
  , [reunioes])

  const maxTotal = useMemo(() =>
    Math.max(...reunioesComDados.map(r => r.total), 1)
  , [reunioesComDados])

  const podeVoltar = mesAtual > MES_INICIAL

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 ring-1 ring-cyan-500/30">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Assistência</h1>
            <p className="text-sm text-muted-foreground">Resumo de presenças nas reuniões</p>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="flex gap-1 rounded-xl border border-border bg-card p-1">
        {([
          { id: "resumo",    label: "Resumo do Mês" },
          { id: "historico", label: "Histórico" },
          { id: "ranking",   label: "Ranking Zoom" },
        ] as const).map(aba => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
              abaAtiva === aba.id
                ? "bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {aba.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        </div>
      ) : (

        <>
          {/* ── ABA RESUMO ─────────────────────────────────────────────────── */}
          {abaAtiva === "resumo" && (
            <div className="space-y-6">

              {/* Navegador de mês + filtro tipo */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Mês */}
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 self-start">
                  <button
                    onClick={() => setMesAtual(prev => subMonths(prev, 1))}
                    disabled={!podeVoltar}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg transition-all",
                      podeVoltar ? "hover:bg-muted/50" : "opacity-25 cursor-not-allowed"
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="min-w-[100px] text-center">
                    <p className="text-sm font-bold capitalize">
                      {format(mesAtual, "MMMM", { locale: ptBR })}
                    </p>
                    <p className="text-xs text-muted-foreground">{format(mesAtual, "yyyy")}</p>
                  </div>
                  <button
                    onClick={() => setMesAtual(prev => addMonths(prev, 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted/50 transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Filtro tipo */}
                <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground ml-2" />
                  {([
                    { id: "todos",   label: "Todas" },
                    { id: "quinta",  label: "Quinta" },
                    { id: "domingo", label: "Domingo" },
                  ] as const).map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFiltroTipo(f.id)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                        filtroTipo === f.id
                          ? "bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards de métricas */}
              {reunioesMes.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground rounded-xl border border-dashed border-border">
                  <Calendar className="h-10 w-10 opacity-30" />
                  <p className="text-sm text-center">
                    Nenhuma reunião com dados em{" "}
                    <span className="font-semibold capitalize">{format(mesAtual, "MMMM 'de' yyyy", { locale: ptBR })}</span>
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: "Média Total",      value: stats.mediaTotal,      color: "text-cyan-400",   bg: "bg-cyan-500/10",   ring: "ring-cyan-500/20",   icon: Users },
                      { label: "Média Presencial", value: stats.mediaPresencial, color: "text-blue-400",   bg: "bg-blue-500/10",   ring: "ring-blue-500/20",   icon: Users },
                      { label: "Média Zoom",       value: stats.mediaZoom,       color: "text-violet-400", bg: "bg-violet-500/10", ring: "ring-violet-500/20", icon: Monitor },
                      { label: "Maior Presença",   value: stats.maiorPresenca,   color: "text-amber-400",  bg: "bg-amber-500/10",  ring: "ring-amber-500/20",  icon: TrendingUp },
                    ].map(card => (
                      <div key={card.label} className={cn("flex flex-col gap-2 rounded-xl border border-border p-4 ring-1", card.ring)}>
                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", card.bg)}>
                          <card.icon className={cn("h-4 w-4", card.color)} />
                        </div>
                        <div>
                          <p className={cn("text-2xl font-bold tabular-nums", card.color)}>{card.value}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tendência */}
                  <div className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm",
                    stats.tendencia > 0
                      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                      : stats.tendencia < 0
                        ? "border-red-500/20 bg-red-500/5 text-red-400"
                        : "border-border bg-card text-muted-foreground"
                  )}>
                    {stats.tendencia > 0
                      ? <TrendingUp className="h-4 w-4 flex-shrink-0" />
                      : stats.tendencia < 0
                        ? <TrendingDown className="h-4 w-4 flex-shrink-0" />
                        : <Minus className="h-4 w-4 flex-shrink-0" />
                    }
                    <span>
                      {stats.tendencia > 0
                        ? `Tendência de alta: +${stats.tendencia} pessoas na segunda metade do mês`
                        : stats.tendencia < 0
                          ? `Tendência de queda: ${stats.tendencia} pessoas na segunda metade do mês`
                          : "Presença estável ao longo do mês"
                      }
                    </span>
                  </div>

                  {/* Gráfico de barras do mês */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold">Reuniões do mês</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500 inline-block" /> Presencial</span>
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-violet-500 inline-block" /> Zoom</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {reunioesMes.map(r => {
                        const pct  = stats.maiorPresenca > 0 ? (r.total / stats.maiorPresenca) * 100 : 0
                        const pctP = r.total > 0 ? (r.presencial / r.total) * 100 : 0
                        const pctZ = r.total > 0 ? (r.zoom / r.total) * 100 : 0
                        const diaNome = r.dia_semana ? r.dia_semana.charAt(0).toUpperCase() + r.dia_semana.slice(1).toLowerCase() : ""
                        const dataFmt = format(parseISO(r.data), "dd/MM", { locale: ptBR })
                        return (
                          <div key={r.id} className="flex items-center gap-3">
                            <div className="w-24 flex-shrink-0 text-right">
                              <p className="text-xs font-medium text-foreground">{diaNome}</p>
                              <p className="text-[10px] text-muted-foreground">{dataFmt}</p>
                            </div>
                            <div className="flex-1 min-w-0">
                              {r.total === 0 ? (
                                <div className="h-5 rounded-full bg-muted/30 flex items-center px-2">
                                  <span className="text-[10px] text-muted-foreground">Sem dados</span>
                                </div>
                              ) : (
                                <div className="h-5 w-full rounded-full bg-muted/30 overflow-hidden flex" style={{ maxWidth: `${pct}%` }}>
                                  <div className="h-full bg-blue-500/70 rounded-l-full" style={{ width: `${pctP}%` }} />
                                  <div className="h-full bg-violet-500/70 rounded-r-full" style={{ width: `${pctZ}%` }} />
                                </div>
                              )}
                            </div>
                            <div className="w-10 flex-shrink-0 text-right">
                              <span className="text-xs font-bold tabular-nums text-foreground">{r.total || "—"}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── ABA HISTÓRICO ──────────────────────────────────────────────── */}
          {abaAtiva === "historico" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Últimas {reunioesComDados.length} reuniões com dados registrados</p>

              {reunioesComDados.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground rounded-xl border border-dashed border-border">
                  <BarChart3 className="h-10 w-10 opacity-30" />
                  <p className="text-sm">Nenhuma reunião com dados ainda</p>
                </div>
              ) : (
                <>
                  {/* Gráfico de barras verticais */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold">Evolução de presença</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500 inline-block" /> Presencial</span>
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-violet-500 inline-block" /> Zoom</span>
                      </div>
                    </div>
                    <div className="flex items-end gap-1.5 h-36 overflow-x-auto scrollbar-thin pb-1">
                      {reunioesComDados.map(r => {
                        const alturaP = maxTotal > 0 ? (r.presencial / maxTotal) * 100 : 0
                        const alturaZ = maxTotal > 0 ? (r.zoom / maxTotal) * 100 : 0
                        const diaNome = r.dia_semana?.slice(0, 3) || ""
                        const dia     = format(parseISO(r.data), "d", { locale: ptBR })
                        return (
                          <div key={r.id} className="flex flex-col items-center gap-1 flex-shrink-0 group" style={{ minWidth: 28 }}>
                            <span className="text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">{r.total}</span>
                            <div className="flex items-end gap-0.5 h-28">
                              <div className="w-2.5 rounded-t-sm bg-blue-500/70 transition-all" style={{ height: `${alturaP}%`, minHeight: alturaP > 0 ? 2 : 0 }} />
                              <div className="w-2.5 rounded-t-sm bg-violet-500/70 transition-all" style={{ height: `${alturaZ}%`, minHeight: alturaZ > 0 ? 2 : 0 }} />
                            </div>
                            <span className="text-[9px] text-muted-foreground tabular-nums">{dia}</span>
                            <span className="text-[8px] text-muted-foreground/60 capitalize">{diaNome.charAt(0).toUpperCase() + diaNome.slice(1).toLowerCase()}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Tabela compacta */}
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-0">
                      {/* Header */}
                      <div className="contents">
                        {["Data", "Dia", "Presencial", "Zoom", "Total"].map(h => (
                          <div key={h} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/20">
                            {h}
                          </div>
                        ))}
                      </div>
                      {/* Linhas */}
                      {[...reunioesComDados].reverse().map((r, i) => {
                        const acimaDaMedia = r.total >= (reunioesComDados.reduce((a, b) => a + b.total, 0) / reunioesComDados.length)
                        return (
                          <div key={r.id} className="contents group">
                            {[
                              <span key="data" className="font-medium text-foreground">{format(parseISO(r.data), "dd/MM/yyyy")}</span>,
                              <span key="dia"  className="capitalize text-muted-foreground">{r.dia_semana?.toLowerCase()}</span>,
                              <span key="pres" className="font-semibold text-blue-400 tabular-nums">{r.presencial}</span>,
                              <span key="zoom" className="font-semibold text-violet-400 tabular-nums">{r.zoom}</span>,
                              <div key="total" className="flex items-center gap-1.5">
                                <span className="font-bold text-foreground tabular-nums">{r.total}</span>
                                {acimaDaMedia
                                  ? <TrendingUp  className="h-3 w-3 text-emerald-400" />
                                  : <TrendingDown className="h-3 w-3 text-red-400" />
                                }
                              </div>,
                            ].map((cell, ci) => (
                              <div key={ci} className={cn(
                                "px-3 py-2 text-xs border-b border-border/50 flex items-center",
                                i % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                              )}>
                                {cell}
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── ABA RANKING ZOOM ───────────────────────────────────────────── */}
          {abaAtiva === "ranking" && (
            <div className="space-y-4">

              {ranking.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground rounded-xl border border-dashed border-border">
                  <Monitor className="h-10 w-10 opacity-30" />
                  <p className="text-sm">Nenhum dado de Zoom registrado ainda</p>
                </div>
              ) : (
                <>
                  {/* Pódio top 3 */}
                  {ranking.length >= 3 && (
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { pos: 1, idx: 0, color: "text-amber-400",   bg: "bg-amber-500/10",   ring: "ring-amber-500/25",   h: "h-20" },
                        { pos: 2, idx: 1, color: "text-zinc-300",    bg: "bg-zinc-500/10",    ring: "ring-zinc-500/20",    h: "h-14" },
                        { pos: 3, idx: 2, color: "text-orange-400",  bg: "bg-orange-500/10",  ring: "ring-orange-500/20",  h: "h-10" },
                      ].sort((a, b) => (a.pos === 1 ? -1 : b.pos === 1 ? 1 : a.pos - b.pos)).map(({ pos, idx, color, bg, ring, h }) => {
                        const pub = ranking[idx]
                        return (
                          <div key={pos} className={cn(
                            "flex flex-col items-center gap-2 rounded-xl border p-3 text-center ring-1",
                            bg, ring,
                            pos === 1 ? "border-amber-500/30" : pos === 2 ? "border-zinc-500/20" : "border-orange-500/20"
                          )}>
                            <div className={cn("flex items-center justify-center rounded-full font-bold text-sm", color, bg, h, "w-full aspect-square max-w-[48px] max-h-[48px]")}>
                              {pos === 1 ? <Trophy className="h-5 w-5" /> : `${pos}°`}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground leading-tight">{pub.publicador_nome.split(" ")[0]}</p>
                              <p className={cn("text-lg font-bold tabular-nums", color)}>{pub.total}</p>
                              <p className="text-[10px] text-muted-foreground">reuniões</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Tabela completa */}
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-sm font-semibold">Todos os publicadores no Zoom</p>
                      <Badge variant="secondary" className="ml-auto text-xs">{ranking.length}</Badge>
                    </div>
                    <div className="divide-y divide-border/50">
                      {ranking.map((pub, i) => {
                        const pct = ranking[0]?.total > 0 ? (pub.total / ranking[0].total) * 100 : 0
                        const medalha = i === 0 ? "text-amber-400" : i === 1 ? "text-zinc-300" : i === 2 ? "text-orange-400" : "text-muted-foreground"
                        return (
                          <div key={pub.publicador_id} className={cn(
                            "flex items-center gap-3 px-4 py-2.5",
                            i % 2 === 0 ? "bg-transparent" : "bg-muted/5"
                          )}>
                            <span className={cn("w-6 text-center text-sm font-bold tabular-nums flex-shrink-0", medalha)}>
                              {i < 3 ? ["1°","2°","3°"][i] : i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{pub.publicador_nome}</p>
                              <div className="mt-1 h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-bold tabular-nums text-violet-400">{pub.total}</p>
                              <p className="text-[10px] text-muted-foreground">reuniões</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
