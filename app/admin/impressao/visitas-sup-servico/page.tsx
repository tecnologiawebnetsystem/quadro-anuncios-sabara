"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { PrintActionButtons } from "@/components/impressao/print-action-buttons"
import { PrintVisitasSupServico } from "@/components/impressao/print-layouts"
import "@/app/impressao/print-styles.css"

type Visita = {
  id: string
  data: string
  created_at: string
  anciao: { nome?: string | null } | null
  grupo: { nome?: string | null } | null
}

export default function ImpressaoVisitasSupServicoPage() {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const carregarVisitas = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("visitas_sup_servico")
        .select("id, data, created_at, anciao:publicadores!anciao_id(nome), grupo:grupos!grupo_id(nome)")
        .order("created_at", { ascending: true })

      if (!error) setVisitas((data || []) as unknown as Visita[])
      setLoading(false)
    }

    carregarVisitas()
  }, [])

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-6 print:bg-white print:p-0">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <PrintActionButtons printRef={printRef} documentTitle="Visita do Sup. Serviço" colorScheme="orange" />
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="size-7 animate-spin text-primary" /></div>
        ) : (
          <PrintVisitasSupServico
            ref={printRef}
            mes={new Date().getMonth() + 1}
            ano={new Date().getFullYear()}
            visitas={visitas}
          />
        )}
      </div>
    </main>
  )
}
