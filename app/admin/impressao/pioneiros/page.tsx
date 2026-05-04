"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Flag, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { PrintActionButtons } from "@/components/impressao/print-action-buttons"
import { PrintPioneiros, type PioneiroImpressao } from "@/components/impressao/print-pioneiros"
import "@/app/impressao/print-styles.css"

export default function ImpressaoPioneirosPage() {
  const [pioneiros, setPioneiros] = useState<PioneiroImpressao[]>([])
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from("publicadores")
        .select(`
          id,
          nome,
          telefone,
          email,
          endereco,
          data_batismo,
          data_nascimento,
          anciao,
          servo_ministerial,
          grupos:grupo_id(nome)
        `)
        .eq("ativo", true)
        .eq("pioneiro_regular", true)
        .order("nome", { ascending: true })

      const lista = (data || []).map((p: any) => ({
        ...p,
        grupo_nome: p.grupos?.nome ?? null,
      }))

      setPioneiros(lista)
    } catch (error) {
      console.error("Erro ao carregar pioneiros:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra de controle — não imprime */}
      <div className="print:hidden sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30">
            <Flag className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <h1 className="text-base font-bold">Pioneiros Regulares</h1>
            <p className="text-xs text-muted-foreground">
              {loading ? "Carregando..." : `${pioneiros.length} ${pioneiros.length === 1 ? "pioneiro cadastrado" : "pioneiros cadastrados"}`}
            </p>
          </div>
        </div>
        <PrintActionButtons
          printRef={printRef}
          documentTitle="Pioneiros Regulares - Congregação Parque Sabará"
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
            <div className="print:hidden rounded-xl border border-border bg-card p-4 shadow-sm">
              <PrintPioneiros ref={printRef} pioneiros={pioneiros} />
            </div>

            {/* Área de impressão real */}
            <div className="hidden print:block">
              <PrintPioneiros ref={printRef} pioneiros={pioneiros} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
