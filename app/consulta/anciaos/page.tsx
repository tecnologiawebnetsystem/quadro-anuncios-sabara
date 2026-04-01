"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CenteredLoader } from "@/components/ui/page-loader"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Publicador {
  id: string
  nome: string
  anciao: boolean
  ativo: boolean
}

export default function ConsultaAnciaoPage() {
  const [anciaos, setAnciaos] = useState<Publicador[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarAnciaos() {
      try {
        const response = await fetch("/api/publicadores")
        if (response.ok) {
          const data = await response.json()
          const listaAnciaos = data.filter((p: Publicador) => p.anciao && p.ativo)
          setAnciaos(listaAnciaos)
        }
      } catch (error) {
        console.error("Erro ao carregar anciãos:", error)
      } finally {
        setLoading(false)
      }
    }
    carregarAnciaos()
  }, [])

  if (loading) return <CenteredLoader />

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/consulta" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Anciãos</h1>
          <p className="text-zinc-400">Lista de anciãos da congregação</p>
        </div>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Shield className="h-5 w-5 text-red-500" />
            Total: {anciaos.length} anciãos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {anciaos.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {anciaos.map((anciao) => (
                <div
                  key={anciao.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600/20 text-red-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-white">{anciao.nome}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-center py-8">Nenhum ancião cadastrado</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
