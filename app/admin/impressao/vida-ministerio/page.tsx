"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { Printer, ChevronLeft, ChevronRight, Gem, Loader2, Save, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { createClient } from "@/lib/supabase/client"
import { PrintVidaMinisterio } from "@/components/impressao/print-layouts"
import "@/app/impressao/print-styles.css"

const meses = [
  { valor: 1, nome: "Janeiro" },
  { valor: 2, nome: "Fevereiro" },
  { valor: 3, nome: "Março" },
  { valor: 4, nome: "Abril" },
  { valor: 5, nome: "Maio" },
  { valor: 6, nome: "Junho" },
  { valor: 7, nome: "Julho" },
  { valor: 8, nome: "Agosto" },
  { valor: 9, nome: "Setembro" },
  { valor: 10, nome: "Outubro" },
  { valor: 11, nome: "Novembro" },
  { valor: 12, nome: "Dezembro" },
]

interface Semana {
  id: string
  mes_id: string
  data_inicio: string
  data_fim: string
  leitura_semanal: string
  livro_biblia: string | null
  cantico_inicial: number | null
  cantico_inicial_nome: string | null
  cantico_meio: number | null
  cantico_meio_nome: string | null
  cantico_final: number | null
  cantico_final_nome: string | null
  presidente: string | null
  oracao_inicial: string | null
  sem_reuniao: boolean
  motivo_sem_reuniao: string | null
}

interface Parte {
  id: string
  semana_id: string
  secao: string
  titulo: string
  tempo: string | null
  participante_id: string | null
  participante_nome: string | null
  ajudante_id: string | null
  ajudante_nome: string | null
  sala: string
  ordem: number
  textos: string[]
  licao: string | null
  descricao: string | null
  leitor_id: string | null
  leitor_nome: string | null
  oracao_final_id: string | null
  oracao_final_nome: string | null
}

interface Cantico {
  id: string
  numero: number
  descricao: string
}

export default function ImpressaoVidaMinisterioPage() {
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [semanas, setSemanas] = useState<Semana[]>([])
  const [partes, setPartes] = useState<Parte[]>([])
  const [canticos, setCanticos] = useState<Cantico[]>([])
  const [loading, setLoading] = useState(true)

  const printRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Vida_Ministerio_${meses.find((m) => m.valor === mesAtual)?.nome}_${anoAtual}`,
  })

  const handleSaveAs = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Vida_Ministerio_${meses.find((m) => m.valor === mesAtual)?.nome}_${anoAtual}`,
    print: async (printIframe) => {
      const contentWindow = printIframe.contentWindow
      if (contentWindow) {
        contentWindow.print()
      }
    },
  })

  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      const { data: canticosData } = await supabase
        .from("canticos")
        .select("id, numero, descricao")
        .order("numero")
      setCanticos(canticosData || [])

      const { data: mes } = await supabase
        .from("vida_ministerio_meses")
        .select("*")
        .eq("mes", mesAtual)
        .eq("ano", anoAtual)
        .single()

      if (!mes) {
        setSemanas([])
        setPartes([])
        return
      }

      const { data: semanasData } = await supabase
        .from("vida_ministerio_semanas")
        .select("*")
        .eq("mes_id", mes.id)
        .order("data_inicio")

      setSemanas(semanasData || [])

      if (semanasData && semanasData.length > 0) {
        const { data: partesData } = await supabase
          .from("vida_ministerio_partes")
          .select("*")
          .in("semana_id", semanasData.map((s) => s.id))
          .order("ordem")

        setPartes(
          (partesData || []).map((p) => ({
            ...p,
            textos: Array.isArray(p.textos) ? p.textos : [],
          }))
        )
      } else {
        setPartes([])
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }, [mesAtual, anoAtual, supabase])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const mesAnterior = () => {
    if (mesAtual === 1) { setMesAtual(12); setAnoAtual(anoAtual - 1) }
    else setMesAtual(mesAtual - 1)
  }
  const mesProximo = () => {
    if (mesAtual === 12) { setMesAtual(1); setAnoAtual(anoAtual + 1) }
    else setMesAtual(mesAtual + 1)
  }

  const nomesMes = meses.find((m) => m.valor === mesAtual)?.nome

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra de controle — não imprime */}
      <div className="print:hidden sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 border border-blue-500/30">
              <Gem className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h1 className="text-base font-bold">Vida e Ministério</h1>
              <p className="text-xs text-muted-foreground">Visualização para impressão</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={mesAnterior}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold min-w-[130px] text-center">
              {nomesMes} {anoAtual}
            </span>
            <button
              onClick={mesProximo}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <TooltipProvider delayDuration={0}>
          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => handleSaveAs()} 
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-blue-600/50 text-blue-400 hover:bg-blue-600/10 hover:text-blue-300 transition-colors"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-zinc-800 border-zinc-700">
                <p>Salvar como PDF</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => handlePrint()} 
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-blue-600/50 text-blue-400 hover:bg-blue-600/10 hover:text-blue-300 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-zinc-800 border-zinc-700">
                <p>Imprimir</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => {
                    const texto = `Vida e Ministério - ${nomesMes} ${anoAtual}`
                    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`
                    window.open(url, '_blank')
                  }} 
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-green-600/50 text-green-400 hover:bg-green-600/10 hover:text-green-300 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-zinc-800 border-zinc-700">
                <p>Enviar por WhatsApp</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* Área de conteúdo */}
      <div className="p-6 max-w-4xl mx-auto print:p-0 print:max-w-none">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : semanas.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-muted-foreground gap-3">
            <Gem className="h-12 w-12 opacity-30" />
            <p className="text-sm">Nenhuma semana cadastrada para {nomesMes} {anoAtual}.</p>
          </div>
        ) : (
          <>
            {/* Preview na tela */}
            <div className="print:hidden rounded-xl border border-border bg-card p-6">
              <PrintVidaMinisterio
                ref={printRef}
                mes={mesAtual}
                ano={anoAtual}
                semanas={semanas}
                partes={partes}
                canticos={canticos}
              />
            </div>

            {/* Conteúdo oculto para impressão */}
            <div className="hidden print:block">
              <PrintVidaMinisterio
                ref={printRef}
                mes={mesAtual}
                ano={anoAtual}
                semanas={semanas}
                partes={partes}
                canticos={canticos}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
