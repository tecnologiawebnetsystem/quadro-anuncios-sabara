import { Users, Megaphone, Eye, TrendingUp } from "lucide-react"
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
          Bem-vindo ao painel administrativo da Igreja Simao de Jova
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Membros"
          value="183"
          description="Membros ativos"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatsCard
          title="Anuncios Ativos"
          value="8"
          description="Publicados este mes"
          icon={Megaphone}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Visualizacoes"
          value="1.284"
          description="Total este mes"
          icon={Eye}
          trend={{ value: 18, isPositive: true }}
          variant="accent"
        />
        <StatsCard
          title="Engajamento"
          value="89%"
          description="Taxa de leitura"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
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
