"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Users, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { PrintActionButtons } from "@/components/impressao/print-action-buttons"
import { PrintPublicadores } from "@/components/impressao/print-publicadores"
import "@/app/impressao/print-styles.css"

export interface PublicadorImpressao {
  id: string
  nome: string
  anciao: boolean
  servo_ministerial: boolean
  pioneiro_regular: boolean
  pioneiro_auxiliar: boolean
  ativo: boolean
}

export default function ImpressaoPublicadoresPage() {
  const [publicadores, setPublicadores] = useState<PublicadorImpressao[]>([])
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from("publicadores")
        .select("id, nome, anciao, servo_ministerial, pioneiro_regular, pioneiro_auxiliar, ativo")
        .eq("ativo", true)
        .order("nome", { ascending: true })

      setPublicadores(data || [])
    } catch (error) {
      console.error("Erro ao carregar publicadores:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const documentTitle = "Lista de Publicadores - Congregação"

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra de controle — não imprime */}
      <div className="print:hidden sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/30">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold">Publicadores</h1>
            <p className="text-xs text-muted-foreground">
              {loading ? "Carregando..." : `${publicadores.length} publicadores ativos`}
            </p>
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
              <PrintPublicadores ref={printRef} publicadores={publicadores} />
            </div>

            {/* Conteúdo oculto para impressão */}
            <div className="hidden print:block">
              <PrintPublicadores ref={printRef} publicadores={publicadores} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
