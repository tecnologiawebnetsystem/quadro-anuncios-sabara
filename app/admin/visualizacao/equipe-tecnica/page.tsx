"use client"

import { useState, useEffect, useCallback } from "react"
import { CenteredLoader } from "@/components/ui/page-loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Wrench, Users, Mic, Volume2, Calendar } from "lucide-react"
import { useSync } from "@/lib/contexts/sync-context"

interface EquipeTecnica {
  id: string
  mes: string
  data: string
  dia_semana: string
  indicador1_nome: string | null
  indicador2_nome: string | null
  microvolante1_nome: string | null
  microvolante2_nome: string | null
  microvolante_palco: 1 | 2 | null
  som_nome: string | null
}

const meses = [
  { valor: "2026-01", label: "Janeiro 2026" },
  { valor: "2026-02", label: "Fevereiro 2026" },
  { valor: "2026-03", label: "Março 2026" },
  { valor: "2026-04", label: "Abril 2026" },
  { valor: "2026-05", label: "Maio 2026" },
  { valor: "2026-06", label: "Junho 2026" },
]

// Calcular índice do mês atual baseado na data do sistema
function calcularIndiceMesAtual(): number {
  const agora = new Date()
  const mesAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}`
  const indice = meses.findIndex(m => m.valor === mesAtual)
  return indice >= 0 ? indice : 0
}

export default function ConsultaEquipeTecnicaPage() {
  const [mesAtual, setMesAtual] = useState(() => calcularIndiceMesAtual())
  const [designacoes, setDesignacoes] = useState<EquipeTecnica[]>([])
  const [loading, setLoading] = useState(true)
  const { syncTrigger } = useSync()

  const mes = meses[mesAtual]

  const carregarDesignacoes = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/equipe-tecnica?mes=${mes.valor}`)
      if (response.ok) {
        const data = await response.json()
        setDesignacoes(data)
      }
    } catch (error) {
      console.error("Erro ao carregar designações:", error)
    } finally {
      setLoading(false)
    }
  }, [mes.valor])

  useEffect(() => {
    carregarDesignacoes()
  }, [carregarDesignacoes, syncTrigger])

  const navegarMes = (direcao: "anterior" | "proximo") => {
    if (direcao === "anterior" && mesAtual > 0) {
      setMesAtual(mesAtual - 1)
    } else if (direcao === "proximo" && mesAtual < meses.length - 1) {
      setMesAtual(mesAtual + 1)
    }
  }

  const formatarData = (data: string) => {
    // Extrai dia/mês diretamente da string "YYYY-MM-DD" para evitar offset UTC
    const [, m, d] = data.split("-")
    return `${d}/${m}`
  }

  const getDiaSemanaLabel = (dia: string) => {
    return dia === "quinta" ? "Quinta-feira 19h30" : "Domingo 9h00"
  }

  if (loading) return <CenteredLoader />
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Wrench className="h-6 w-6 text-orange-500" />
            Equipe Técnica
          </h1>
          <p className="text-zinc-400 text-sm">Indicadores, Microfone Volante e Som</p>
        </div>
      </div>

      {/* Navegação de Mês */}
      <Card className="bg-zinc-900/50 border-zinc-800 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navegarMes("anterior")}
              disabled={mesAtual === 0}
              className="text-zinc-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <span className="text-lg font-semibold text-white">{mes.label}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navegarMes("proximo")}
              disabled={mesAtual === meses.length - 1}
              className="text-zinc-400 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Designações */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : designacoes.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-8 text-center">
            <p className="text-zinc-400">Nenhuma designação cadastrada para este mês.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {designacoes.map((d) => (
            <Card key={d.id} className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-white flex items-center justify-between">
                  <span>{formatarData(d.data)} - {getDiaSemanaLabel(d.dia_semana)}</span>
                  <span className={`text-xs px-2 py-1 rounded ${d.dia_semana === "quinta" ? "bg-blue-600/20 text-blue-400" : "bg-purple-600/20 text-purple-400"}`}>
                    {d.dia_semana === "quinta" ? "Meio de Semana" : "Fim de Semana"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Indicadores */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                      <Users className="h-4 w-4 text-blue-500" />
                      Indicadores
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-white">{d.indicador1_nome || "-"}</p>
                      <p className="text-sm text-white">{d.indicador2_nome || "-"}</p>
                    </div>
                  </div>

                  {/* Microfone Volante */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                      <Mic className="h-4 w-4 text-purple-500" />
                      Microfone Volante
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-white flex items-center gap-1.5">
                        {d.microvolante1_nome || "-"}
                        {d.microvolante_palco === 1 && (
                          <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.5 rounded">
                            Palco
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-white flex items-center gap-1.5">
                        {d.microvolante2_nome || "-"}
                        {d.microvolante_palco === 2 && (
                          <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.5 rounded">
                            Palco
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Som */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                      <Volume2 className="h-4 w-4 text-green-500" />
                      Som
                    </div>
                    <p className="text-sm text-white">{d.som_nome || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
