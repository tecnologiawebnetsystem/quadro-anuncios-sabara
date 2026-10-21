"use client"

import { useEffect, useMemo, useState } from "react"
import { BarChart3, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { format, isSameMonth, parseISO, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { createClient } from "@/lib/supabase/client"

interface Reuniao {
  id: string
  data: string
  dia_semana: string
  presencial: number
  zoom: number
  total: number
}

const MES_INICIAL = new Date(2026, 4, 1)

export default function ConsultaAssistenciaPage() {
  const supabase = createClient()
  const [reunioes, setReunioes] = useState<Reuniao[]>([])
  const [loading, setLoading] = useState(true)
  const [mesAtual, setMesAtual] = useState(MES_INICIAL)

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      const { data } = await supabase
        .from("assistencia_reunioes")
        .select("id, data, dia_semana, presencial, zoom, total")
        .gte("data", "2026-05-01")
        .order("data", { ascending: true })

      setReunioes(data || [])
      setLoading(false)
    }

    carregar()
  }, [supabase])

  const reunioesMes = useMemo(() => {
    const reunioesDoMes = reunioes.filter((reuniao) => {
      try {
        const data = parseISO(reuniao.data)
        return isSameMonth(data, mesAtual) && (data.getDay() === 0 || data.getDay() === 4)
      } catch {
        return false
      }
    })

    const porData = new Map<string, Reuniao>()
    for (const reuniao of reunioesDoMes) {
      const existente = porData.get(reuniao.data)
      if (existente) {
        existente.presencial += reuniao.presencial || 0
        existente.zoom += reuniao.zoom || 0
        existente.total += reuniao.total || 0
      } else {
        porData.set(reuniao.data, { ...reuniao })
      }
    }

    return Array.from(porData.values()).sort((a, b) => a.data.localeCompare(b.data))
  }, [reunioes, mesAtual])

  const podeVoltar = mesAtual > MES_INICIAL

  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-blue-400/15 bg-blue-900/20 p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-green-400" aria-hidden="true" />
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Assistência às Reuniões</h1>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-blue-300/20 bg-blue-950/30 p-1">
            <button
              type="button"
              onClick={() => setMesAtual((mes) => subMonths(mes, 1))}
              disabled={!podeVoltar}
              aria-label="Mês anterior"
              className="rounded-md p-1.5 text-blue-200 transition hover:bg-blue-400/15 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-32 text-center text-sm font-semibold capitalize">
              {format(mesAtual, "MMMM 'de' yyyy", { locale: ptBR })}
            </span>
            <button
              type="button"
              onClick={() => setMesAtual((mes) => addMonths(mes, 1))}
              aria-label="Próximo mês"
              className="rounded-md p-1.5 text-blue-200 transition hover:bg-blue-400/15"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-blue-300" aria-label="Carregando assistência" />
          </div>
        ) : (
          <div>
            {reunioesMes.length ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {reunioesMes.map((reuniao) => (
                  <article key={reuniao.id} className="rounded-xl border border-blue-300/15 bg-blue-950/20 p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between border-b border-blue-300/15 pb-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-blue-300">{reuniao.dia_semana}</p>
                        <h2 className="text-lg font-bold">{format(parseISO(reuniao.data), "dd/MM")}</h2>
                      </div>
                      <span className="rounded-full bg-blue-400/10 px-2.5 py-1 text-xs font-semibold text-blue-200">Reunião</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-blue-400/10 px-3 py-2">
                        <p className="text-xs text-blue-200">Presencial</p>
                        <p className="text-xl font-bold">{reuniao.presencial || 0}</p>
                      </div>
                      <div className="rounded-lg bg-violet-400/10 px-3 py-2">
                        <p className="text-xs text-violet-200">Zoom</p>
                        <p className="text-xl font-bold">{reuniao.zoom || 0}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-blue-200">Não há dados de assistência para este mês.</p>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
