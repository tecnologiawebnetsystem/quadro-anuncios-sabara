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

  const reunioesMes = useMemo(() => reunioes.filter((reuniao) => {
    try {
      return isSameMonth(parseISO(reuniao.data), mesAtual)
    } catch {
      return false
    }
  }), [reunioes, mesAtual])

  const totais = useMemo(() => reunioesMes.reduce((resultado, reuniao) => ({
    presencial: resultado.presencial + (reuniao.presencial || 0),
    zoom: resultado.zoom + (reuniao.zoom || 0),
    total: resultado.total + (reuniao.total || 0),
  }), { presencial: 0, zoom: 0, total: 0 }), [reunioesMes])

  const podeVoltar = mesAtual > MES_INICIAL

  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-blue-400/15 bg-blue-900/20 p-6 shadow-sm sm:p-9">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-green-400" aria-hidden="true" />
            <h1 className="text-2xl font-bold tracking-tight">Assistência às Reuniões</h1>
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <caption className="mb-5 text-left text-lg font-semibold">{reunioesMes[0]?.dia_semana || "Reuniões"}</caption>
              <thead>
                <tr className="border-b border-blue-300/20 text-blue-100">
                  <th scope="col" className="px-3 py-3 font-semibold">Tipo</th>
                  {reunioesMes.map((reuniao) => (
                    <th scope="col" key={reuniao.id} className="px-3 py-3 text-center font-semibold">
                      {format(parseISO(reuniao.data), "dd/MM")}
                    </th>
                  ))}
                  <th scope="col" className="px-3 py-3 text-center font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-blue-300/15">
                  <th scope="row" className="px-3 py-5 font-semibold">Presencial</th>
                  {reunioesMes.map((reuniao) => <td key={reuniao.id} className="px-3 py-5 text-center text-lg font-semibold">{reuniao.presencial || 0}</td>)}
                  <td className="px-3 py-5 text-center text-lg font-bold text-blue-400">{totais.presencial}</td>
                </tr>
                <tr>
                  <th scope="row" className="px-3 py-5 font-semibold">Zoom</th>
                  {reunioesMes.map((reuniao) => <td key={reuniao.id} className="px-3 py-5 text-center text-lg font-semibold">{reuniao.zoom || 0}</td>)}
                  <td className="px-3 py-5 text-center text-lg font-bold text-blue-400">{totais.zoom}</td>
                </tr>
              </tbody>
            </table>
            {!reunioesMes.length && <p className="py-8 text-center text-sm text-blue-200">Não há dados de assistência para este mês.</p>}
          </div>
        )}
      </section>
    </main>
  )
}
