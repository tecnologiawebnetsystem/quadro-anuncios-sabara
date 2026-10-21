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
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 ring-1 ring-cyan-500/30">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Assistência por Reunião</h1>
            <p className="text-sm text-muted-foreground">Escolha o tipo de assistência que deseja consultar</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 ring-1 ring-blue-500/10">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15">
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <h2 className="font-semibold">Assistência Presencial</h2>
          <p className="mt-1 text-sm text-muted-foreground">Consulte a assistência presencial das reuniões.</p>
        </div>

        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5 ring-1 ring-violet-500/10">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15">
            <Monitor className="h-5 w-5 text-violet-400" />
          </div>
          <h2 className="font-semibold">Assistência Zoom</h2>
          <p className="mt-1 text-sm text-muted-foreground">Consulte a assistência das reuniões pelo Zoom.</p>
        </div>
      </div>
    </div>
  )


}
