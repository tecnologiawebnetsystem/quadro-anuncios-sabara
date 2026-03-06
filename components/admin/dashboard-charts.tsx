"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
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

const eventosData = [
  { nome: "Cultos", quantidade: 12, fill: "var(--color-chart-1)" },
  { nome: "Estudos", quantidade: 8, fill: "var(--color-chart-2)" },
  { nome: "Encontros", quantidade: 4, fill: "var(--color-chart-3)" },
  { nome: "Acoes Sociais", quantidade: 3, fill: "var(--color-chart-4)" },
]

const ministeriosData = [
  { nome: "Louvor", membros: 25 },
  { nome: "Infantil", membros: 18 },
  { nome: "Jovens", membros: 32 },
  { nome: "Mulheres", membros: 28 },
  { nome: "Homens", membros: 22 },
  { nome: "Casais", membros: 15 },
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

export function EventosChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Eventos por Tipo</CardTitle>
        <CardDescription>Distribuicao de eventos este mes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={eventosData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="quantidade"
                nameKey="nome"
              >
                {eventosData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
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
                  <span style={{ color: "var(--color-foreground)" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function MinisteriosChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Membros por Ministerio</CardTitle>
        <CardDescription>Quantidade de membros ativos em cada ministerio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ministeriosData} layout="vertical">
              <XAxis
                type="number"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey="nome"
                type="category"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  color: "var(--color-foreground)",
                }}
              />
              <Bar
                dataKey="membros"
                fill="var(--color-chart-2)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
