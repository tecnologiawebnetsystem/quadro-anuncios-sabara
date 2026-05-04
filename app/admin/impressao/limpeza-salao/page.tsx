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
    grupo_local: string | null
    limpeza_semanal_grupo_nome: string | null
    limpeza_semanal_grupo_local: string | null
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

        // Buscar semanas cujo dia de limpeza (quinta = inicio+4, ou domingo = inicio+7)
        // cai dentro do mês. Para isso, o domingo de início pode começar até 7 dias
        // antes do primeiro dia do mês (semana que "vaza" do mês anterior).
        // Limite superior: semanas cujo domingo de início é até o último dia do mês
        // (a quinta dessa semana cai no mês seguinte, mas filtramos abaixo).
        const ultimoDia = new Date(anoLoop, mesLoop, 0).getDate()
        const primeiroDiaDate = new Date(anoLoop, mesLoop - 1, 1)
        const ultimoDiaDate  = new Date(anoLoop, mesLoop - 1, ultimoDia)

        // Recua 7 dias para capturar semanas que começam no mês anterior mas têm
        // a quinta ou o domingo dentro deste mês.
        const inicioRangeDate = new Date(primeiroDiaDate)
        inicioRangeDate.setDate(inicioRangeDate.getDate() - 7)
        const inicioRangeStr = inicioRangeDate.toISOString().slice(0, 10)
        const ultimoDiaStr   = `${anoLoop}-${String(mesLoop).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`

        const { data: rawData } = await supabase
          .from("limpeza_salao")
          .select("id, semana, data_inicio, data_fim, grupo_nome, limpeza_semanal_grupo_nome, grupos:grupo_id(local), limpeza_semanal_grupos:limpeza_semanal_grupo_id(local)")
          .gte("data_inicio", inicioRangeStr)
          .lte("data_inicio", ultimoDiaStr)
          .order("data_inicio", { ascending: true })

        // Regra definitiva de pertencimento (impressão):
        //
        // Quando a quinta e o domingo caem no MESMO mês → usa qualquer um (quinta).
        //
        // Quando a quinta e o domingo caem em MESES DIFERENTES (semana cruzada):
        //   → a semana vai para o mês do DOMINGO.
        //
        // Exemplos:
        //   Qui 29/05 / Dom 01/06 → meses diferentes → mês do domingo = JUNHO
        //   Qui 30/07 / Dom 02/08 → meses diferentes → mês do domingo = AGOSTO ✓
        //   Qui 28/05 / Dom 31/05 → mesmo mês maio → MAIO ✓
        //
        // ATENÇÃO: para maio aparecer com 5 semanas, o cadastro da semana
        // "Qui 29/05 / Dom 01/06" deve estar em JUNHO no banco.
        // Se estiver em maio no banco, esta regra o moverá para junho na impressão.
        const data = (rawData || []).filter((item) => {
          const dom = new Date(item.data_inicio + "T12:00:00")
          const quinta = new Date(dom); quinta.setDate(dom.getDate() + 4)
          const domingoLimpeza = new Date(dom); domingoLimpeza.setDate(dom.getDate() + 7)

          // Verifica se quinta e domingo estão em meses diferentes
          const cruzaMes = quinta.getMonth() !== domingoLimpeza.getMonth()
            || quinta.getFullYear() !== domingoLimpeza.getFullYear()

          // Se cruza mês → pertence ao mês do domingo; senão → mês da quinta
          const dataReferencia = cruzaMes ? domingoLimpeza : quinta
          return dataReferencia >= primeiroDiaDate && dataReferencia <= ultimoDiaDate
        })

        // Deduplicar por data_inicio: manter apenas um registro por semana,
        // preferindo o que tem grupo_nome preenchido
        const vistos = new Map<string, typeof data[0]>()
        for (const item of (data || [])) {
          const chave = item.data_inicio
          if (!vistos.has(chave)) {
            vistos.set(chave, item)
          } else {
            const existente = vistos.get(chave)!
            if (!existente.grupo_nome && item.grupo_nome) {
              vistos.set(chave, item)
            }
          }
        }
        const escalasDedup = Array.from(vistos.values())
          .sort((a, b) => a.data_inicio.localeCompare(b.data_inicio))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => ({
            ...item,
            grupo_local: item.grupos?.local ?? null,
            limpeza_semanal_grupo_local: item.limpeza_semanal_grupos?.local ?? null,
          }))

        resultado.push({ mes: mesLoop, ano: anoLoop, escalas: escalasDedup })
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
