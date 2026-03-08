import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Users } from "lucide-react"

export default function VidaMinisterioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vida e Ministério</h1>
        <p className="text-muted-foreground">
          Gerencie as designações da reunião Vida e Ministério Cristão
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Reunião</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Quinta-feira</div>
            <p className="text-xs text-muted-foreground">19:30h</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1h 45min</div>
            <p className="text-xs text-muted-foreground">Tempo total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Designações</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programa da Semana</CardTitle>
          <CardDescription>
            Designações e partes da reunião Vida e Ministério Cristão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Tesouros da Palavra de Deus */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary border-b pb-2">
                Tesouros da Palavra de Deus
              </h3>
              <div className="grid gap-2">
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Discurso (10 min)</span>
                  <span className="text-sm font-medium">-</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Joias Espirituais (10 min)</span>
                  <span className="text-sm font-medium">-</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Leitura da Bíblia (4 min)</span>
                  <span className="text-sm font-medium">-</span>
                </div>
              </div>
            </div>

            {/* Faça Seu Melhor no Ministério */}
            <div className="space-y-3">
              <h3 className="font-semibold text-amber-600 border-b pb-2">
                Faça Seu Melhor no Ministério
              </h3>
              <div className="grid gap-2">
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Primeira Conversa (3 min)</span>
                  <span className="text-sm font-medium">-</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Revisita (4 min)</span>
                  <span className="text-sm font-medium">-</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Estudo Bíblico (5 min)</span>
                  <span className="text-sm font-medium">-</span>
                </div>
              </div>
            </div>

            {/* Nossa Vida Cristã */}
            <div className="space-y-3">
              <h3 className="font-semibold text-red-600 border-b pb-2">
                Nossa Vida Cristã
              </h3>
              <div className="grid gap-2">
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Cântico</span>
                  <span className="text-sm font-medium">-</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Parte 1 (15 min)</span>
                  <span className="text-sm font-medium">-</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Estudo Bíblico de Congregação (30 min)</span>
                  <span className="text-sm font-medium">-</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
