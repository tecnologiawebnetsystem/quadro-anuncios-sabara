import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: "culto" | "estudo" | "encontro" | "acao"
}

const events: Event[] = [
  {
    id: "1",
    title: "Culto de Domingo",
    date: "10 Mar 2024",
    time: "09:00",
    location: "Templo Principal",
    type: "culto",
  },
  {
    id: "2",
    title: "Estudo Biblico",
    date: "12 Mar 2024",
    time: "19:30",
    location: "Sala de Estudos",
    type: "estudo",
  },
  {
    id: "3",
    title: "Encontro de Jovens",
    date: "15 Mar 2024",
    time: "18:00",
    location: "Salao Social",
    type: "encontro",
  },
  {
    id: "4",
    title: "Acao Social",
    date: "20 Mar 2024",
    time: "08:00",
    location: "Comunidade Local",
    type: "acao",
  },
]

const typeColors = {
  culto: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  estudo: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  encontro: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  acao: "bg-chart-4/20 text-chart-4 border-chart-4/30",
}

const typeLabels = {
  culto: "Culto",
  estudo: "Estudo",
  encontro: "Encontro",
  acao: "Acao Social",
}

export function UpcomingEvents() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Proximos Eventos</CardTitle>
        <CardDescription>Eventos agendados para os proximos dias</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50"
            >
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="text-lg font-bold leading-none">
                  {event.date.split(" ")[0]}
                </span>
                <span className="text-xs uppercase">
                  {event.date.split(" ")[1]}
                </span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{event.title}</span>
                  <Badge variant="outline" className={typeColors[event.type]}>
                    {typeLabels[event.type]}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
