"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CenteredLoader } from "@/components/ui/page-loader"
import { UserCheck, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Publicador {
  id: string
  nome: string
  servo_ministerial: boolean
  ativo: boolean
}

export default function ConsultaServosPage() {
  const [servos, setServos] = useState<Publicador[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarServos() {
      try {
        const response = await fetch("/api/publicadores")
        if (response.ok) {
          const data = await response.json()
          const listaServos = data.filter((p: Publicador) => p.servo_ministerial && p.ativo)
          setServos(listaServos)
        }
      } catch (error) {
        console.error("Erro ao carregar servos ministeriais:", error)
      } finally {
        setLoading(false)
      }
    }
    carregarServos()
  }, [])

  if (loading) return <CenteredLoader />

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/consulta" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Servos Ministeriais</h1>
          <p className="text-zinc-400">Lista de servos ministeriais da congregação</p>
        </div>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <UserCheck className="h-5 w-5 text-indigo-500" />
            Total: {servos.length} servos ministeriais
          </CardTitle>
        </CardHeader>
        <CardContent>
          {servos.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {servos.map((servo) => (
                <div
                  key={servo.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600/20 text-indigo-400">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-white">{servo.nome}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-center py-8">Nenhum servo ministerial cadastrado</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
