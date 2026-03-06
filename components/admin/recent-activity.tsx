import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  type: "membro" | "anuncio" | "evento" | "ministerio"
  title: string
  description: string
  time: string
  user?: {
    name: string
    initials: string
  }
}

const activities: Activity[] = [
  {
    id: "1",
    type: "membro",
    title: "Novo membro cadastrado",
    description: "Maria Silva se cadastrou como novo membro",
    time: "Ha 5 minutos",
    user: { name: "Maria Silva", initials: "MS" },
  },
  {
    id: "2",
    type: "anuncio",
    title: "Anuncio publicado",
    description: "Campanha de arrecadacao de alimentos",
    time: "Ha 1 hora",
  },
  {
    id: "3",
    type: "evento",
    title: "Evento criado",
    description: "Culto especial de acao de gracas",
    time: "Ha 2 horas",
  },
  {
    id: "4",
    type: "membro",
    title: "Novo membro cadastrado",
    description: "Joao Pedro entrou no ministerio de louvor",
    time: "Ha 3 horas",
    user: { name: "Joao Pedro", initials: "JP" },
  },
  {
    id: "5",
    type: "ministerio",
    title: "Ministerio atualizado",
    description: "Ministerio infantil adicionou nova programacao",
    time: "Ha 5 horas",
  },
]

const typeColors = {
  membro: "bg-chart-2 text-white",
  anuncio: "bg-chart-1 text-white",
  evento: "bg-chart-3 text-white",
  ministerio: "bg-chart-4 text-white",
}

const typeLabels = {
  membro: "Membro",
  anuncio: "Anuncio",
  evento: "Evento",
  ministerio: "Ministerio",
}

export function RecentActivity() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Atividade Recente</CardTitle>
        <CardDescription>Ultimas acoes realizadas no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-lg border border-border bg-secondary/30 p-4"
            >
              {activity.user ? (
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-accent text-accent-foreground text-sm">
                    {activity.user.initials}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <span className="text-xs font-medium text-muted-foreground">SYS</span>
                </div>
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{activity.title}</span>
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", typeColors[activity.type])}
                  >
                    {typeLabels[activity.type]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
