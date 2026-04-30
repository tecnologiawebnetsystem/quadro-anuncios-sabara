"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { PrintLimpezaSalao } from "@/components/impressao/print-layouts"
import { PrintActionButtons } from "@/components/impressao/print-action-buttons"
import "@/app/impressao/print-styles.css"

const NOMES_MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

interface LimpezaSalaoMes {
  mes: number
  ano: number
  escalas: {
    id: string
    semana: number
    data_inicio: string
    data_fim: string
    grupo_nome: string | null
    limpeza_semanal_grupo_nome: string | null
  }[]
}

export default function ImpressaoLimpezaSalaoPage() {
  const hoje = new Date()
  const [mesAtual, setMesAtual] = useState(hoje.getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear())
  const [meses4, setMeses4] = useState<LimpezaSalaoMes[]>([])
  const [loading, setLoading] = useState(true)

  const printRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Calcula o 4º mês do período
  const calcularMesFinal = () => {
    const total = (mesAtual - 1) + 3
    const mesFinal = (total % 12) + 1
    const anoFinal = anoAtual + Math.floor(total / 12)
    return { mesFinal, anoFinal }
  }

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      const resultado: LimpezaSalaoMes[] = []
      for (let i = 0; i < 4; i++) {
        const total = (mesAtual - 1) + i
        const mesLoop = (total % 12) + 1
        const anoLoop = anoAtual + Math.floor(total / 12)
        const mesLoopStr = `${anoLoop}-${String(mesLoop).padStart(2, "0")}`

        const { data } = await supabase
          .from("limpeza_salao")
          .select("id, semana, data_inicio, data_fim, grupo_nome, limpeza_semanal_grupo_nome")
          .eq("mes", mesLoopStr)
          .order("semana", { ascending: true })

        resultado.push({ mes: mesLoop, ano: anoLoop, escalas: data || [] })
      }
      setMeses4(resultado)
    } catch (error) {
      console.error("Erro ao carregar dados de limpeza:", error)
    } finally {
      setLoading(false)
    }
  }, [mesAtual, anoAtual, supabase])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const mesAnterior = () => {
    if (mesAtual === 1) { setMesAtual(12); setAnoAtual(a => a - 1) }
    else setMesAtual(m => m - 1)
  }
  const mesProximo = () => {
    if (mesAtual === 12) { setMesAtual(1); setAnoAtual(a => a + 1) }
    else setMesAtual(m => m + 1)
  }

  const nomeMesInicio = NOMES_MESES[mesAtual - 1]
  const { mesFinal, anoFinal } = calcularMesFinal()
  const nomeMesFinal = NOMES_MESES[mesFinal - 1]
  const documentTitle = `Escala de Limpeza - ${nomeMesInicio} a ${nomeMesFinal} ${anoFinal}`

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra de controle — não imprime */}
      <div className="print:hidden sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30">
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-base font-bold">Limpeza do Salão</h1>
              <p className="text-xs text-muted-foreground">Impressão de 4 meses</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={mesAnterior}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-center min-w-[170px]">
              <span className="text-sm font-semibold block">
                {nomeMesInicio} a {nomeMesFinal} {anoFinal}
              </span>
              <span className="text-xs text-muted-foreground">início: {nomeMesInicio} {anoAtual}</span>
            </div>
            <button
              onClick={mesProximo}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <PrintActionButtons
          printRef={printRef}
          documentTitle={documentTitle}
          colorScheme="blue"
        />
      </div>

      {/* Área de conteúdo */}
      <div className="p-6 max-w-4xl mx-auto print:p-0 print:max-w-none">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Preview na tela */}
            <div className="print:hidden rounded-xl border border-border bg-card p-6">
              <PrintLimpezaSalao
                ref={printRef}
                mes={mesAtual}
                ano={anoAtual}
                escalas={[]}
                meses={meses4}
              />
            </div>

            {/* Conteúdo oculto para impressão */}
            <div className="hidden print:block">
              <PrintLimpezaSalao
                ref={printRef}
                mes={mesAtual}
                ano={anoAtual}
                escalas={[]}
                meses={meses4}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
