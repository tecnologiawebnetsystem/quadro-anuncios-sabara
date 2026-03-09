"use client"

import { useEffect, useState } from "react"
import { Users, UserCheck, Shield, Flag, Loader2 } from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { getPublicadores, type PublicadorGrupo } from "@/lib/actions/grupos"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [publicadores, setPublicadores] = useState<PublicadorGrupo[]>([])
  
  useEffect(() => {
    async function carregarDados() {
      try {
        const data = await getPublicadores()
        setPublicadores(data)
      } catch (error) {
        console.error("Erro ao carregar publicadores:", error)
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [])

  // Usar APENAS os campos específicos de cargo na congregação
  // NÃO usar is_lider/is_auxiliar que são para dirigente/auxiliar de GRUPO DE ESTUDO
  const totalAtivos = publicadores.filter((p) => p.ativo).length
  const totalAnciaos = publicadores.filter((p) => p.anciao && p.ativo).length
  const totalServos = publicadores.filter((p) => p.servo_ministerial && p.ativo).length
  const totalPioneirosRegulares = publicadores.filter((p) => p.pioneiro_regular && p.ativo).length
  const totalPioneirosAuxiliares = publicadores.filter((p) => p.pioneiro_auxiliar && p.ativo).length

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel administrativo do Quadro de Anúncios
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Publicadores"
          value={totalAtivos}
          description="Clique para ver todos"
          icon={Users}
          href="/admin/publicadores"
          variant="primary"
        />
        <StatsCard
          title="Total de Anciãos"
          value={totalAnciaos}
          description="Clique para ver todos"
          icon={UserCheck}
          href="/admin/publicadores/anciaos"
          variant="accent"
        />
        <StatsCard
          title="Total de Servos Ministeriais"
          value={totalServos}
          description="Clique para ver todos"
          icon={Shield}
          href="/admin/publicadores/servos-ministeriais"
        />
        <StatsCard
          title="Total de Pioneiros"
          value={totalPioneirosRegulares}
          description="Clique para ver todos"
          icon={Flag}
          href="/admin/publicadores/pioneiros-regulares"
          badge={{ label: "Auxiliares", value: totalPioneirosAuxiliares }}
        />
      </div>
    </div>
  )
}
