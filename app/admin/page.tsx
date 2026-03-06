import { Users, UserCheck, Shield, Flag } from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { MembrosChart, AnunciosChart } from "@/components/admin/dashboard-charts"
import { RecentActivity } from "@/components/admin/recent-activity"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel administrativo do Quadro de Anuncios
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Publicadores"
          value="0"
          description="Publicadores ativos"
          icon={Users}
          variant="primary"
        />
        <StatsCard
          title="Total de Anciaos"
          value="0"
          description="Anciaos ativos"
          icon={UserCheck}
          variant="accent"
        />
        <StatsCard
          title="Total de Servos Ministeriais"
          value="0"
          description="Servos ministeriais ativos"
          icon={Shield}
        />
        <StatsCard
          title="Total de Pioneiros"
          value="0"
          description="Pioneiros ativos"
          icon={Flag}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MembrosChart />
        <AnunciosChart />
      </div>

      {/* Activity */}
      <RecentActivity />
    </div>
  )
}
