"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Monitor, Search, Check, X, Loader2, BarChart3,
  Calendar, Trophy, ArrowUpDown, ChevronLeft, ChevronRight,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { format, parseISO, startOfMonth, endOfMonth, addMonths, subMonths, isSameMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mês inicial fixo: maio de 2026
const MES_INICIAL = new Date(2026, 4, 1)

interface Reuniao {
  id: string
  data: string
  dia_semana: string
  presencial: number
  zoom: number
}

interface Publicador {
  id: string
  nome: string
  ativo: boolean
}

interface ZoomEntry {
  id: string
  publicador_id: string
  publicador_nome: string
}

interface RankingItem {
  publicador_nome: string
  total: number
}

export default function AssistenciaZoomPage() {
  const supabase = createClient()

  // ── dados base ──
  const [reunioes,     setReunioes]     = useState<Reuniao[]>([])
  const [publicadores, setPublicadores] = useState<Publicador[]>([])
  const [loadingBase,  setLoadingBase]  = useState(true)

  // ── reunião selecionada ──
  const [reuniaoId,   setReuniaoId]   = useState<string | null>(null)
  const [zoomEntries, setZoomEntries] = useState<ZoomEntry[]>([])
  const [loadingZoom, setLoadingZoom] = useState(false)
  const [salvando,    setSalvando]    = useState<string | null>(null)

  // ── ranking ──
  const [ranking,        setRanking]        = useState<RankingItem[]>([])
  const [loadingRanking, setLoadingRanking] = useState(false)

  // ── busca ──
  const [busca, setBusca] = useState("")

  // ── aba ──
  const [aba, setAba] = useState<"registro" | "ranking">("registro")

  // ── mês exibido ──
  const [mesAtual, setMesAtual] = useState<Date>(MES_INICIAL)
  const irMesAnterior = () => setMesAtual(prev => { const m = subMonths(prev, 1); return m < MES_INICIAL ? prev : m })
  const irProximoMes  = () => setMesAtual(prev => addMonths(prev, 1))

  // ── carregamento inicial ──
  const carregarBase = useCallback(async () => {
    setLoadingBase(true)
    const [{ data: r }, { data: p }] = await Promise.all([
      supabase.from("assistencia_reunioes").select("*").order("data", { ascending: false }),
      supabase.from("publicadores").select("id,nome,ativo").eq("ativo", true).order("nome"),
    ])
    setReunioes(r || [])
    setPublicadores(p || [])
    setLoadingBase(false)
  }, [supabase])

  useEffect(() => { carregarBase() }, [carregarBase])

  // ── carrega zoom da reunião selecionada ──
  const carregarZoom = useCallback(async (id: string) => {
    setLoadingZoom(true)
    const { data } = await supabase
      .from("assistencia_zoom_publicadores")
      .select("id, publicador_id, publicador_nome")
      .eq("assistencia_id", id)
    setZoomEntries(data || [])
    setLoadingZoom(false)
  }, [supabase])

  useEffect(() => {
    if (reuniaoId) carregarZoom(reuniaoId)
    else setZoomEntries([])
  }, [reuniaoId, carregarZoom])

  // ── carrega ranking ──
  const carregarRanking = useCallback(async () => {
    setLoadingRanking(true)
    const { data } = await supabase
      .from("assistencia_zoom_publicadores")
      .select("publicador_nome")
    const contagem: Record<string, number> = {}
    ;(data || []).forEach(r => {
      contagem[r.publicador_nome] = (contagem[r.publicador_nome] || 0) + 1
    })
    const sorted = Object.entries(contagem)
      .map(([publicador_nome, total]) => ({ publicador_nome, total }))
      .sort((a, b) => b.total - a.total)
    setRanking(sorted)
    setLoadingRanking(false)
  }, [supabase])

  useEffect(() => {
    if (aba === "ranking") carregarRanking()
  }, [aba, carregarRanking])

  // ── toggle publicador no zoom ──
  const toggleZoom = async (pub: Publicador) => {
    if (!reuniaoId) return
    setSalvando(pub.id)
    const jaEsta = zoomEntries.some(e => e.publicador_id === pub.id)
    try {
      if (jaEsta) {
        await supabase
          .from("assistencia_zoom_publicadores")
          .delete()
          .eq("assistencia_id", reuniaoId)
          .eq("publicador_id", pub.id)
        setZoomEntries(prev => prev.filter(e => e.publicador_id !== pub.id))
      } else {
        const { data } = await supabase
          .from("assistencia_zoom_publicadores")
          .insert({ assistencia_id: reuniaoId, publicador_id: pub.id, publicador_nome: pub.nome })
          .select()
          .single()
        if (data) setZoomEntries(prev => [...prev, data])
      }
    } catch (err) {
      console.error("[v0] Erro ao salvar zoom:", err)
    } finally {
      setSalvando(null)
    }
  }

  // ── derivados ──
  const reuniaoSelecionada = reunioes.find(r => r.id === reuniaoId)
  const publicadoresFiltrados = publicadores.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )
  const reunioesMes = reunioes.filter(r => {
    try { return isSameMonth(parseISO(r.data), mesAtual) } catch { return false }
  }).sort((a, b) => a.data.localeCompare(b.data))

  // Não muda de mês para trás de maio
  const podeIrAntes = mesAtual > MES_INICIAL

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30">
            <Monitor className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-base font-bold">Assistência — Zoom</h1>
            <p className="text-xs text-muted-foreground">
              Registre quais publicadores participaram pelo Zoom em cada reunião
            </p>
          </div>
        </div>

        {/* Abas */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1">
          <button
            onClick={() => setAba("registro")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              aba === "registro"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Calendar className="h-3.5 w-3.5" />
            Registro
          </button>
          <button
            onClick={() => setAba("ranking")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              aba === "ranking"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Trophy className="h-3.5 w-3.5" />
            Ranking
          </button>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto">

        {loadingBase ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : aba === "registro" ? (

          /* ── ABA REGISTRO ────────────────────────────────────────────── */
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

            {/* Coluna esquerda: navegador de meses + reuniões */}
            <div className="space-y-3">

              {/* Navegador de mês */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2">
                <button
                  onClick={irMesAnterior}
                  disabled={!podeIrAntes}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg transition-all",
                    podeIrAntes
                      ? "hover:bg-muted/50 text-foreground"
                      : "opacity-25 cursor-not-allowed text-muted-foreground"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="text-center">
                  <p className="text-sm font-bold capitalize">
                    {format(mesAtual, "MMMM", { locale: ptBR })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(mesAtual, "yyyy")}
                  </p>
                </div>

                <button
                  onClick={irProximoMes}
                  className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted/50 transition-all text-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Reuniões do mês */}
              <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
                {reunioesMes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
                    <Calendar className="h-8 w-8 opacity-30" />
                    <p className="text-xs text-center">Nenhuma reunião cadastrada<br />em {format(mesAtual, "MMMM 'de' yyyy", { locale: ptBR })}</p>
                  </div>
                ) : reunioesMes.map(r => {
                  const ativa  = r.id === reuniaoId
                  const dataBR = format(parseISO(r.data), "dd/MM/yyyy", { locale: ptBR })
                  const diaNome = r.dia_semana
                    ? r.dia_semana.charAt(0).toUpperCase() + r.dia_semana.slice(1).toLowerCase()
                    : ""
                  const diaNum = format(parseISO(r.data), "d")
                  return (
                    <button
                      key={r.id}
                      onClick={() => { setReuniaoId(r.id); setBusca("") }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all",
                        ativa
                          ? "border-cyan-500/50 bg-cyan-500/10"
                          : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
                      )}
                    >
                      {/* Bolinha com dia */}
                      <div className={cn(
                        "flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-xl border-2 font-bold transition-all",
                        ativa
                          ? "border-cyan-400 bg-cyan-500/20 text-cyan-400"
                          : "border-border bg-muted/20 text-foreground"
                      )}>
                        <span className="text-base leading-none">{diaNum}</span>
                        <span className="text-[9px] leading-none uppercase tracking-wide opacity-70">
                          {diaNome.slice(0, 3)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-semibold truncate", ativa ? "text-cyan-400" : "text-foreground")}>
                          {diaNome}
                        </p>
                        <p className="text-xs text-muted-foreground">{dataBR}</p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-xs">
                          <span className="text-blue-400 font-semibold">{r.presencial}</span>
                          <span className="text-muted-foreground"> + </span>
                          <span className="text-cyan-400 font-semibold">{r.zoom}</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground">pres.+zoom</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Coluna direita: lista de publicadores */}
            <div className="space-y-4">
              {!reuniaoId ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border text-muted-foreground">
                  <Calendar className="h-10 w-10 opacity-30" />
                  <p className="text-sm">Selecione uma reunião para registrar quem participou pelo Zoom</p>
                </div>
              ) : (
                <>
                  {/* Header da coluna direita */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold">
                        {reuniaoSelecionada
                          ? `${format(parseISO(reuniaoSelecionada.data), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}`
                          : "Reunião"}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {loadingZoom
                          ? "Carregando..."
                          : `${zoomEntries.length} publicador${zoomEntries.length !== 1 ? "es" : ""} no Zoom`}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 bg-cyan-500/10">
                      <Monitor className="h-3 w-3 mr-1" />
                      {zoomEntries.length} no Zoom
                    </Badge>
                  </div>

                  {/* Busca */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar publicador..."
                      value={busca}
                      onChange={e => setBusca(e.target.value)}
                      className="pl-9 bg-muted/30 border-border"
                    />
                    {busca && (
                      <button onClick={() => setBusca("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                  </div>

                  {/* Lista de publicadores */}
                  {loadingZoom ? (
                    <div className="flex h-32 items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto pr-1">
                      {publicadoresFiltrados.map(pub => {
                        const marcado   = zoomEntries.some(e => e.publicador_id === pub.id)
                        const carregando = salvando === pub.id
                        return (
                          <button
                            key={pub.id}
                            onClick={() => toggleZoom(pub)}
                            disabled={carregando}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all",
                              marcado
                                ? "border-cyan-500/50 bg-cyan-500/10"
                                : "border-border bg-card hover:border-border/80 hover:bg-muted/30",
                              carregando && "opacity-60 cursor-wait"
                            )}
                          >
                            <div className={cn(
                              "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all",
                              marcado
                                ? "border-cyan-400 bg-cyan-400/20"
                                : "border-border bg-muted/30"
                            )}>
                              {carregando
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                                : marcado
                                ? <Check className="h-3.5 w-3.5 text-cyan-400" />
                                : <Monitor className="h-3 w-3 text-muted-foreground/40" />
                              }
                            </div>
                            <span className={cn(
                              "text-sm font-medium flex-1 truncate",
                              marcado ? "text-foreground" : "text-muted-foreground"
                            )}>
                              {pub.nome}
                            </span>
                            {marcado && (
                              <Badge className="text-[10px] h-4 px-1.5 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                                Zoom
                              </Badge>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        ) : (

          /* ── ABA RANKING ─────────────────────────────────────────────── */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Ranking de Participação pelo Zoom</h2>
                <p className="text-xs text-muted-foreground">
                  Publicadores que mais participaram das reuniões pelo Zoom
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={carregarRanking} className="gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Atualizar
              </Button>
            </div>

            {loadingRanking ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : ranking.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border text-muted-foreground">
                <BarChart3 className="h-10 w-10 opacity-30" />
                <p className="text-sm">Nenhum registro de participação no Zoom ainda.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Pódio top 3 */}
                {ranking.length >= 3 && (
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[ranking[1], ranking[0], ranking[2]].map((p, i) => {
                      if (!p) return null
                      const pos    = i === 1 ? 1 : i === 0 ? 2 : 3
                      const cores  = ["text-silver-400", "text-amber-400", "text-orange-400"]
                      const bgs    = ["bg-zinc-500/10 border-zinc-500/30", "bg-amber-500/10 border-amber-500/30", "bg-orange-500/10 border-orange-500/30"]
                      const alturas = ["h-20", "h-28", "h-16"]
                      return (
                        <div key={p.publicador_nome} className={cn(
                          "flex flex-col items-center justify-end rounded-xl border p-3 gap-1",
                          bgs[i], alturas[i]
                        )}>
                          <p className="text-xs font-bold text-muted-foreground">{pos}º</p>
                          <p className="text-sm font-bold text-center text-foreground leading-tight">{p.publicador_nome}</p>
                          <Badge className={cn("text-xs", i === 1 ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30")}>
                            {p.total}x
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Tabela completa */}
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="py-2.5 px-4 text-left text-xs font-semibold text-muted-foreground w-12">#</th>
                        <th className="py-2.5 px-4 text-left text-xs font-semibold text-muted-foreground">Publicador</th>
                        <th className="py-2.5 px-4 text-center text-xs font-semibold text-muted-foreground w-24">Participações</th>
                        <th className="py-2.5 px-4 text-left text-xs font-semibold text-muted-foreground">Frequência</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.map((p, i) => {
                        const max = ranking[0].total
                        const pct = Math.round((p.total / max) * 100)
                        return (
                          <tr key={p.publicador_nome} className={cn(
                            "border-b border-border/50 last:border-0 transition-colors hover:bg-muted/20",
                            i < 3 && "bg-cyan-500/5"
                          )}>
                            <td className="py-2.5 px-4">
                              <span className={cn(
                                "text-sm font-bold",
                                i === 0 ? "text-amber-400"
                                : i === 1 ? "text-zinc-400"
                                : i === 2 ? "text-orange-400"
                                : "text-muted-foreground"
                              )}>
                                {i + 1}
                              </span>
                            </td>
                            <td className="py-2.5 px-4">
                              <span className="text-sm font-medium text-foreground">{p.publicador_nome}</span>
                            </td>
                            <td className="py-2.5 px-4 text-center">
                              <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 bg-cyan-500/10 font-bold">
                                {p.total}x
                              </Badge>
                            </td>
                            <td className="py-2.5 px-4">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 rounded-full bg-muted/50 overflow-hidden">
                                  <div
                                    className={cn("h-full rounded-full transition-all", i < 3 ? "bg-cyan-400" : "bg-muted-foreground/40")}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
