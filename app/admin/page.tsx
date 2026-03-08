"use client"

import { useEffect, useState } from "react"
import { Users, UserCheck, Shield, Flag } from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { usePublicadoresStore } from "@/lib/store/publicadores"

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const { publicadores } = usePublicadoresStore()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const totalAtivos = publicadores.filter((p) => p.ativo).length
  const totalAnciaos = publicadores.filter((p) => p.anciao && p.ativo).length
  const totalServos = publicadores.filter((p) => p.servoMinisterial && p.ativo).length
  const totalPioneirosRegulares = publicadores.filter((p) => p.pioneiroRegular && p.ativo).length
  const totalPioneirosAuxiliares = publicadores.filter((p) => p.pioneiroAuxiliar && p.ativo).length

  if (!mounted) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
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
