"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CenteredLoader } from "@/components/ui/page-loader"
import { Music, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { normalizar } from "@/lib/utils"

interface Cantico {
  id: string
  numero: number
  descricao: string
}

export default function CanticosConsultaPage() {
  const [canticos, setCanticos] = useState<Cantico[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState("")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("canticos")
        .select("id, numero, descricao")
        .order("numero", { ascending: true })
      setCanticos(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtrados = useMemo(() => {
    if (!busca) return canticos
    return canticos.filter(
      (c) =>
        c.numero.toString().includes(busca) ||
        normalizar(c.descricao).includes(normalizar(busca))
    )
  }, [busca, canticos])

  if (loading) return <CenteredLoader />

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-amber-600/20 text-amber-400">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Cânticos</h1>
            <p className="text-zinc-400 text-sm">
              {canticos.length} cântico(s) cadastrado(s)
            </p>
          </div>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Buscar por número ou nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-zinc-700 text-white"
          />
        </div>
      </div>

      {/* Lista */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-800">
            {filtrados.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-zinc-500">Nenhum cântico encontrado</p>
              </div>
            ) : (
              filtrados.map((cantico) => (
                <div
                  key={cantico.id}
                  className="flex items-center gap-4 p-4 hover:bg-zinc-800/30 transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-sm flex-shrink-0">
                    {cantico.numero}
                  </span>
                  <p className="text-white text-sm leading-snug">{cantico.descricao}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {busca && (
        <p className="text-center text-zinc-600 text-sm mt-4">
          Mostrando {filtrados.length} de {canticos.length} cânticos
        </p>
      )}
    </div>
  )
}
