import { Users, Megaphone, Calendar, Heart } from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { MembrosChart, EventosChart, MinisteriosChart } from "@/components/admin/dashboard-charts"
import { RecentActivity } from "@/components/admin/recent-activity"
import { UpcomingEvents } from "@/components/admin/upcoming-events"

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
          title="Eventos Agendados"
          value="12"
          description="Proximos 30 dias"
          icon={Calendar}
          trend={{ value: 8, isPositive: true }}
          variant="accent"
        />
        <StatsCard
          title="Ministerios"
          value="6"
          description="Ministerios ativos"
          icon={Heart}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MembrosChart />
        <EventosChart />
      </div>

      {/* Second Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <MinisteriosChart />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* Upcoming Events */}
      <UpcomingEvents />
    </div>
  )
}
