"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Shield, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { PrintActionButtons } from "@/components/impressao/print-action-buttons"
import { PrintLideranca, type MembroLideranca } from "@/components/impressao/print-lideranca"
import "@/app/impressao/print-styles.css"

export default function ImpressaoLiderancaPage() {
  const [anciaos, setAnciaos] = useState<MembroLideranca[]>([])
  const [servos, setServos] = useState<MembroLideranca[]>([])
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from("publicadores")
        .select("id, nome, telefone, data_batismo, anciao, servo_ministerial")
        .eq("ativo", true)
        .or("anciao.eq.true,servo_ministerial.eq.true")
        .order("nome", { ascending: true })

      const lista: MembroLideranca[] = (data || []).map((p: any) => ({
        id: p.id,
        nome: p.nome,
        telefone: p.telefone ?? null,
        data_batismo: p.data_batismo ?? null,
        anciao: p.anciao ?? false,
        servo_ministerial: p.servo_ministerial ?? false,
      }))

      setAnciaos(lista.filter((p) => p.anciao))
      setServos(lista.filter((p) => p.servo_ministerial && !p.anciao))
    } catch (error) {
      console.error("Erro ao carregar liderança:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => { carregarDados() }, [carregarDados])

  const total = anciaos.length + servos.length

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra de controle */}
      <div className="print:hidden sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 border border-blue-500/30">
            <Shield className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h1 className="text-base font-bold">Anciãos e Servos Ministeriais</h1>
            <p className="text-xs text-muted-foreground">
              {loading
                ? "Carregando..."
                : `${anciaos.length} ${anciaos.length === 1 ? "ancião" : "anciãos"} · ${servos.length} ${servos.length === 1 ? "servo" : "servos"}`}
            </p>
          </div>
        </div>
        <PrintActionButtons
          printRef={printRef}
          documentTitle="Anciãos e Servos Ministeriais - Congregação Parque Sabará"
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
            <div className="print:hidden rounded-xl border border-border bg-card p-4 shadow-sm">
              <PrintLideranca ref={printRef} anciaos={anciaos} servos={servos} />
            </div>
            <div className="hidden print:block">
              <PrintLideranca ref={printRef} anciaos={anciaos} servos={servos} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
