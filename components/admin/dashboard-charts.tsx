"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"

const membrosData = [
  { mes: "Jan", membros: 120, novos: 8 },
  { mes: "Fev", membros: 128, novos: 12 },
  { mes: "Mar", membros: 140, novos: 15 },
  { mes: "Abr", membros: 155, novos: 10 },
  { mes: "Mai", membros: 165, novos: 18 },
  { mes: "Jun", membros: 183, novos: 22 },
]

const anunciosData = [
  { mes: "Jan", anuncios: 5, visualizacoes: 420 },
  { mes: "Fev", anuncios: 7, visualizacoes: 580 },
  { mes: "Mar", anuncios: 6, visualizacoes: 510 },
  { mes: "Abr", anuncios: 9, visualizacoes: 720 },
  { mes: "Mai", anuncios: 8, visualizacoes: 890 },
  { mes: "Jun", anuncios: 8, visualizacoes: 1284 },
]

export function MembrosChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Crescimento de Membros</CardTitle>
        <CardDescription>Evolucao mensal de membros cadastrados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={membrosData}>
              <defs>
                <linearGradient id="colorMembros" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="mes"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  color: "var(--color-foreground)",
                }}
              />
              <Area
                type="monotone"
                dataKey="membros"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMembros)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function AnunciosChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Anuncios e Visualizacoes</CardTitle>
        <CardDescription>Performance dos anuncios por mes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={anunciosData}>
              <XAxis
                dataKey="mes"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  color: "var(--color-foreground)",
                }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: "var(--color-foreground)" }}>
                    {value === "anuncios" ? "Anuncios" : "Visualizacoes"}
                  </span>
                )}
              />
              <Bar
                yAxisId="left"
                dataKey="anuncios"
                fill="var(--color-chart-1)"
                radius={[4, 4, 0, 0]}
                name="anuncios"
              />
              <Bar
                yAxisId="right"
                dataKey="visualizacoes"
                fill="var(--color-chart-2)"
                radius={[4, 4, 0, 0]}
                name="visualizacoes"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
