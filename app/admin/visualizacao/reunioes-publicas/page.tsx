"use client"

import { useState, useEffect, useMemo } from "react"
import { CenteredLoader } from "@/components/ui/page-loader"
import { ArrowLeft, ArrowRight, Calendar, Users, Mic, BookOpen, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useSync } from "@/lib/contexts/sync-context"

// Tipos
interface DesignacaoReuniao {
  id: string
  data: string
  mes: string
  presidente_nome: string
  leitor_sentinela_nome: string
}

interface DiscursoPublico {
  id: string
  data: string
  tema: string
  orador_nome: string | null
  orador_congregacao: string | null
}

interface AssistenciaReuniao {
  id: string
  data: string
  mes: string
  dia_semana: string
  presencial: number
  zoom: number
  total: number
}

const mesesDisponiveis = [
  { value: "2026-01", label: "Janeiro 2026" },
  { value: "2026-02", label: "Fevereiro 2026" },
  { value: "2026-03", label: "Março 2026" },
  { value: "2026-04", label: "Abril 2026" },
  { value: "2026-05", label: "Maio 2026" },
  { value: "2026-06", label: "Junho 2026" },
  { value: "2026-07", label: "Julho 2026" },
  { value: "2026-08", label: "Agosto 2026" },
  { value: "2026-09", label: "Setembro 2026" },
  { value: "2026-10", label: "Outubro 2026" },
  { value: "2026-11", label: "Novembro 2026" },
  { value: "2026-12", label: "Dezembro 2026" },
]

// Extrai dia/mês diretamente da string "YYYY-MM-DD" para evitar offset UTC
const MESES_ABREV = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."]
function formatarData(dataStr: string): string {
  const [, m, d] = dataStr.split("-").map(Number)
  return `${String(d).padStart(2, "0")} de ${MESES_ABREV[m - 1]}`
}

function formatarDataCurta(dataStr: string): string {
  const [, m, d] = dataStr.split("-")
  return `${d}/${m}`
}

export default function ConsultaReunioesPublicasPage() {
  const [loading, setLoading] = useState(true)
  const { syncTrigger } = useSync()
  const supabase = createClient()
  
  // Estados
  const [designacoes, setDesignacoes] = useState<DesignacaoReuniao[]>([])
  const [discursos, setDiscursos] = useState<DiscursoPublico[]>([])
  const [assistenciaQuinta, setAssistenciaQuinta] = useState<AssistenciaReuniao[]>([])
  const [assistenciaDomingo, setAssistenciaDomingo] = useState<AssistenciaReuniao[]>([])
  
  // Estado para navegação de meses
  const [mesAtualIndex, setMesAtualIndex] = useState(2) // Março 2026
  const mesAtual = mesesDisponiveis[mesAtualIndex]

  // Carregar dados quando mês mudar
  useEffect(() => {
    async function carregarDados() {
      setLoading(true)

      const [anoStr, mesStr] = mesAtual.value.split("-")
      const ultimoDiaDoMes = new Date(Number(anoStr), Number(mesStr), 0).getDate()
      const dataInicio = `${mesAtual.value}-01`
      const dataFim = `${mesAtual.value}-${String(ultimoDiaDoMes).padStart(2, "0")}`

      try {
        const { data: designacoesData, error } = await supabase
          .from("reuniao_publica_designacoes")
          .select("*")
          .eq("mes", mesAtual.value)
          .gte("data", dataInicio)
          .lte("data", dataFim)
          .order("data", { ascending: true })
        if (error) console.error("Erro designações:", error)
        else setDesignacoes(designacoesData ?? [])
      } catch (e) { console.error("Erro designações:", e) }

      try {
        const { data: discursosData, error } = await supabase
          .from("discursos_publicos")
          .select("*")
          .gte("data", dataInicio)
          .lte("data", dataFim)
          .order("data", { ascending: true })
        if (error) console.error("Erro discursos:", error)
        else setDiscursos(discursosData ?? [])
      } catch (e) { console.error("Erro discursos:", e) }

      try {
        const { data: assistenciaQuintaData, error } = await supabase
          .from("assistencia_reunioes")
          .select("*")
          .eq("mes", mesAtual.value)
          .eq("dia_semana", "quinta")
          .gte("data", dataInicio)
          .lte("data", dataFim)
          .order("data", { ascending: true })
        if (error) console.error("Erro assistência quinta:", error)
        else setAssistenciaQuinta(assistenciaQuintaData ?? [])
      } catch (e) { console.error("Erro assistência quinta:", e) }

      try {
        const { data: assistenciaDomingoData, error } = await supabase
          .from("assistencia_reunioes")
          .select("*")
          .eq("mes", mesAtual.value)
          .eq("dia_semana", "domingo")
          .gte("data", dataInicio)
          .lte("data", dataFim)
          .order("data", { ascending: true })
        if (error) console.error("Erro assistência domingo:", error)
        else setAssistenciaDomingo(assistenciaDomingoData ?? [])
      } catch (e) { console.error("Erro assistência domingo:", e) }

      setLoading(false)
    }

    carregarDados()
  }, [mesAtual.value, syncTrigger])

  // Navegação de meses
  const irParaMesAnterior = () => {
    if (mesAtualIndex > 0) setMesAtualIndex(mesAtualIndex - 1)
  }
  
  const irParaProximoMes = () => {
    if (mesAtualIndex < mesesDisponiveis.length - 1) setMesAtualIndex(mesAtualIndex + 1)
  }

  // Calcular totais de assistência
  const totaisQuinta = useMemo(() => {
    const presencial = assistenciaQuinta.reduce((acc, a) => acc + (a.presencial || 0), 0)
    const zoom = assistenciaQuinta.reduce((acc, a) => acc + (a.zoom || 0), 0)
    return { presencial, zoom, total: presencial + zoom }
  }, [assistenciaQuinta])

  const totaisDomingo = useMemo(() => {
    const presencial = assistenciaDomingo.reduce((acc, a) => acc + (a.presencial || 0), 0)
    const zoom = assistenciaDomingo.reduce((acc, a) => acc + (a.zoom || 0), 0)
    return { presencial, zoom, total: presencial + zoom }
  }, [assistenciaDomingo])

  if (loading) return <CenteredLoader />

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Reuniões Públicas</h1>
        <p className="text-muted-foreground">Designações e assistência das reuniões</p>
      </div>

      {/* Navegação de meses */}
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={irParaMesAnterior}
          disabled={mesAtualIndex === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-30 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">{mesAtual.label}</h2>
        </div>
        <button
          onClick={irParaProximoMes}
          disabled={mesAtualIndex === mesesDisponiveis.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-30 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* PRESIDENTE E LEITOR DE SENTINELA */}
      {designacoes.length > 0 && (
        <Card className="border-0 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-blue-500" />
              Presidente de Conferência / Leitor de A Sentinela
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Data</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Presidente de Conferência</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Leitor de A Sentinela</th>
                  </tr>
                </thead>
                <tbody>
                  {designacoes.map((d) => (
                    <tr key={d.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatarData(d.data)}</span>
                          <span className="text-xs text-muted-foreground">Domingo</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-foreground">{d.presidente_nome || "-"}</td>
                      <td className="py-3 px-3 text-foreground">{d.leitor_sentinela_nome || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ARRANJO DE DISCURSOS */}
      {discursos.length > 0 && (
        <Card className="border-0 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mic className="h-5 w-5 text-amber-500" />
              Arranjo de Discursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Data</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Tema</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Orador</th>
                  </tr>
                </thead>
                <tbody>
                  {discursos.map((d) => (
                    <tr key={d.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatarData(d.data)}</span>
                          <span className="text-xs text-muted-foreground">Domingo</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-foreground">{d.tema || "-"}</td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="text-foreground font-medium">{d.orador_nome || "-"}</span>
                          {d.orador_congregacao && (
                            <span className="text-xs text-muted-foreground">{d.orador_congregacao}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ASSISTÊNCIA ÀS REUNIÕES */}
      {(assistenciaQuinta.length > 0 || assistenciaDomingo.length > 0) && (
        <Card className="border-0 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Assistência às Reuniões - {mesAtual.label.split(" ")[0]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Quinta-feira */}
              {assistenciaQuinta.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Quinta-feira</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-700">
                          <th className="text-left py-2 px-2 text-sm text-muted-foreground w-24">Tipo</th>
                          {assistenciaQuinta.map(a => (
                            <th key={a.id} className="text-center py-2 px-2 text-sm text-muted-foreground">
                              {formatarDataCurta(a.data)}
                            </th>
                          ))}
                          <th className="text-center py-2 px-2 text-sm text-muted-foreground font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-800/50">
                          <td className="py-3 px-2 text-sm font-medium">Presencial</td>
                          {assistenciaQuinta.map(a => (
                            <td key={a.id} className="py-3 px-2 text-center text-lg font-semibold text-foreground">
                              {a.presencial || "-"}
                            </td>
                          ))}
                          <td className="py-3 px-2 text-center text-lg font-bold text-blue-500">
                            {totaisQuinta.presencial}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-2 text-sm font-medium">Zoom</td>
                          {assistenciaQuinta.map(a => (
                            <td key={a.id} className="py-3 px-2 text-center text-lg font-semibold text-foreground">
                              {a.zoom || "-"}
                            </td>
                          ))}
                          <td className="py-3 px-2 text-center text-lg font-bold text-blue-500">
                            {totaisQuinta.zoom}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Domingo */}
              {assistenciaDomingo.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Domingo</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-700">
                          <th className="text-left py-2 px-2 text-sm text-muted-foreground w-24">Tipo</th>
                          {assistenciaDomingo.map(a => (
                            <th key={a.id} className="text-center py-2 px-2 text-sm text-muted-foreground">
                              {formatarDataCurta(a.data)}
                            </th>
                          ))}
                          <th className="text-center py-2 px-2 text-sm text-muted-foreground font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-800/50">
                          <td className="py-3 px-2 text-sm font-medium">Presencial</td>
                          {assistenciaDomingo.map(a => (
                            <td key={a.id} className="py-3 px-2 text-center text-lg font-semibold text-foreground">
                              {a.presencial || "-"}
                            </td>
                          ))}
                          <td className="py-3 px-2 text-center text-lg font-bold text-blue-500">
                            {totaisDomingo.presencial}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-2 text-sm font-medium">Zoom</td>
                          {assistenciaDomingo.map(a => (
                            <td key={a.id} className="py-3 px-2 text-center text-lg font-semibold text-foreground">
                              {a.zoom || "-"}
                            </td>
                          ))}
                          <td className="py-3 px-2 text-center text-lg font-bold text-blue-500">
                            {totaisDomingo.zoom}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensagem se não houver dados */}
      {designacoes.length === 0 && discursos.length === 0 && assistenciaQuinta.length === 0 && assistenciaDomingo.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Nenhuma informação cadastrada para {mesAtual.label}</p>
        </div>
      )}
    </div>
  )
}
