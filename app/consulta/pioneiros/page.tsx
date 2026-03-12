"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flag, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Publicador {
  id: string
  nome: string
  pioneiro_regular: boolean
  ativo: boolean
}

export default function ConsultaPioneirosPage() {
  const [pioneiros, setPioneiros] = useState<Publicador[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarPioneiros() {
      try {
        const response = await fetch("/api/publicadores")
        if (response.ok) {
          const data = await response.json()
          const listaPioneiros = data.filter((p: Publicador) => p.pioneiro_regular && p.ativo)
          setPioneiros(listaPioneiros)
        }
      } catch (error) {
        console.error("Erro ao carregar pioneiros:", error)
      } finally {
        setLoading(false)
      }
    }
    carregarPioneiros()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/consulta" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Pioneiros Regulares</h1>
          <p className="text-zinc-400">Lista de pioneiros regulares da congregação</p>
        </div>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Flag className="h-5 w-5 text-pink-500" />
            Total: {pioneiros.length} pioneiros regulares
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pioneiros.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pioneiros.map((pioneiro) => (
                <div
                  key={pioneiro.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-600/20 text-pink-400">
                    <Flag className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-white">{pioneiro.nome}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-center py-8">Nenhum pioneiro regular cadastrado</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
