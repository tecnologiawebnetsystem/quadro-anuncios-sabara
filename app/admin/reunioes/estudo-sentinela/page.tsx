import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, BookOpen } from "lucide-react"

export default function EstudoSentinelaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Estudo de A Sentinela</h1>
        <p className="text-muted-foreground">
          Gerencie as designações do Estudo de A Sentinela
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Reunião</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Domingo</div>
            <p className="text-xs text-muted-foreground">10:00h</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 hora</div>
            <p className="text-xs text-muted-foreground">Estudo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artigo</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Desta semana</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programa do Domingo</CardTitle>
          <CardDescription>
            Designações e partes da reunião pública e Estudo de A Sentinela
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Reunião Pública */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary border-b pb-2">
                Reunião Pública
              </h3>
              <div className="grid gap-2">
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Presidente</span>
                  <span className="text-sm font-medium">-</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Cântico Inicial</span>
                  <span className="text-sm font-medium">-</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Oração Inicial</span>
                  <span className="text-sm font-medium">-</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Discurso Público (30 min)</span>
                  <span className="text-sm font-medium">-</span>
                </div>
              </div>
            </div>

            {/* Estudo de A Sentinela */}
            <div className="space-y-3">
              <h3 className="font-semibold text-red-700 border-b pb-2">
                Estudo de A Sentinela
              </h3>
              <div className="grid gap-2">
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Cântico</span>
                  <span className="text-sm font-medium">-</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Condutor</span>
                  <span className="text-sm font-medium">-</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Leitor</span>
                  <span className="text-sm font-medium">-</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Artigo de Estudo</span>
                  <span className="text-sm font-medium">-</span>
                </div>
              </div>
            </div>

            {/* Encerramento */}
            <div className="space-y-3">
              <h3 className="font-semibold text-muted-foreground border-b pb-2">
                Encerramento
              </h3>
              <div className="grid gap-2">
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Cântico Final</span>
                  <span className="text-sm font-medium">-</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                  <span className="text-sm">Oração Final</span>
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
