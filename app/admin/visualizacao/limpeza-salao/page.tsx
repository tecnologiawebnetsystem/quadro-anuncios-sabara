"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Sparkles, Users, Calendar } from "lucide-react"
import { useSync } from "@/lib/contexts/sync-context"

interface LimpezaSalao {
  id: string
  mes: string
  semana: number
  data_inicio: string
  data_fim: string
  grupo_nome: string | null
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

export default function ConsultaLimpezaSalaoPage() {
  const [mesAtual, setMesAtual] = useState(() => calcularIndiceMesAtual())
  const [designacoes, setDesignacoes] = useState<LimpezaSalao[]>([])
  const [loading, setLoading] = useState(true)
  const { syncTrigger } = useSync()

  const mes = meses[mesAtual]

  const carregarDesignacoes = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/limpeza-salao?mes=${mes.valor}`)
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
    const d = new Date(data + "T12:00:00")
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-cyan-500" />
            Limpeza do Salão
          </h1>
          <p className="text-zinc-400 text-sm">Escala semanal de limpeza</p>
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
              <Calendar className="h-5 w-5 text-cyan-500" />
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
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
            <Card key={d.id} className="bg-zinc-900/50 border-zinc-800 hover:border-cyan-800/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-600/20 flex items-center justify-center">
                      <span className="text-cyan-400 font-bold">{d.semana}ª</span>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">Semana {d.semana}</p>
                      <p className="text-white font-medium">
                        {formatarData(d.data_inicio)} a {formatarData(d.data_fim)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-cyan-500" />
                    <span className="text-lg font-semibold text-white">
                      {d.grupo_nome || "Não designado"}
                    </span>
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
