"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CenteredLoader } from "@/components/ui/page-loader"
import { Mic2, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { normalizar } from "@/lib/utils"

interface Discurso {
  id: string
  numero: number
  titulo: string
}

export default function DiscursosConsultaPage() {
  const [discursos, setDiscursos] = useState<Discurso[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState("")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("discursos")
        .select("id, numero, titulo")
        .order("numero", { ascending: true })
      setDiscursos(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtrados = useMemo(() => {
    if (!busca) return discursos
    return discursos.filter(
      (d) =>
        d.numero.toString().includes(busca) ||
        normalizar(d.titulo).includes(normalizar(busca))
    )
  }, [busca, discursos])

  if (loading) return <CenteredLoader />

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-sky-600/20 text-sky-400">
            <Mic2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Discursos Públicos</h1>
            <p className="text-zinc-400 text-sm">
              {discursos.length} esboços S-99 cadastrados
            </p>
          </div>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Buscar por número ou título..."
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
                <p className="text-zinc-500">Nenhum discurso encontrado</p>
              </div>
            ) : (
              filtrados.map((discurso) => (
                <div
                  key={discurso.id}
                  className="flex items-center gap-4 p-4 hover:bg-zinc-800/30 transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-sky-500/10 text-sky-400 font-bold text-sm flex-shrink-0">
                    {discurso.numero}
                  </span>
                  <p className="text-white text-sm leading-snug">{discurso.titulo}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {busca && (
        <p className="text-center text-zinc-600 text-sm mt-4">
          Mostrando {filtrados.length} de {discursos.length} discursos
        </p>
      )}
    </div>
  )
}
