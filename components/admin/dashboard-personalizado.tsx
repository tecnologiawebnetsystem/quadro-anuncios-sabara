"use client"

import { useState, useEffect } from "react"
import { GripVertical, Settings2, X, Plus, LayoutGrid } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface WidgetConfig {
  id: string
  titulo: string
  componente: string
  habilitado: boolean
  ordem: number
}

interface DashboardPersonalizadoProps {
  widgets: WidgetConfig[]
  onWidgetsChange: (widgets: WidgetConfig[]) => void
  renderWidget: (widgetId: string) => React.ReactNode
}

const WIDGETS_DISPONIVEIS: WidgetConfig[] = [
  { id: "estatisticas", titulo: "Estatisticas Gerais", componente: "estatisticas", habilitado: true, ordem: 0 },
  { id: "proximas-designacoes", titulo: "Proximas Designacoes", componente: "proximas", habilitado: true, ordem: 1 },
  { id: "alertas-conflitos", titulo: "Alertas de Conflitos", componente: "conflitos", habilitado: true, ordem: 2 },
  { id: "acoes-rapidas", titulo: "Acoes Rapidas", componente: "acoes", habilitado: true, ordem: 3 },
  { id: "publicadores-ativos", titulo: "Publicadores Ativos", componente: "publicadores", habilitado: false, ordem: 4 },
  { id: "calendario-mes", titulo: "Calendario do Mes", componente: "calendario", habilitado: false, ordem: 5 },
  { id: "atividades-recentes", titulo: "Atividades Recentes", componente: "atividades", habilitado: true, ordem: 6 },
  { id: "ausencias", titulo: "Ausencias Programadas", componente: "ausencias", habilitado: false, ordem: 7 },
]

export function useDashboardPersonalizado() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(WIDGETS_DISPONIVEIS)

  useEffect(() => {
    const saved = localStorage.getItem("dashboard-widgets")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Merge com widgets disponíveis para incluir novos widgets
        const merged = WIDGETS_DISPONIVEIS.map(w => {
          const savedWidget = parsed.find((s: WidgetConfig) => s.id === w.id)
          return savedWidget ? { ...w, ...savedWidget } : w
        })
        setWidgets(merged)
      } catch {
        setWidgets(WIDGETS_DISPONIVEIS)
      }
    }
  }, [])

  const salvarWidgets = (newWidgets: WidgetConfig[]) => {
    setWidgets(newWidgets)
    localStorage.setItem("dashboard-widgets", JSON.stringify(newWidgets))
  }

  return { widgets, setWidgets: salvarWidgets }
}

export function ConfigurarDashboard({ widgets, onWidgetsChange }: Omit<DashboardPersonalizadoProps, "renderWidget">) {
  const [open, setOpen] = useState(false)
  const [tempWidgets, setTempWidgets] = useState<WidgetConfig[]>(widgets)

  const toggleWidget = (id: string) => {
    setTempWidgets(prev => prev.map(w => 
      w.id === id ? { ...w, habilitado: !w.habilitado } : w
    ))
  }

  const moverWidget = (id: string, direcao: "up" | "down") => {
    setTempWidgets(prev => {
      const index = prev.findIndex(w => w.id === id)
      if (index === -1) return prev
      
      const newIndex = direcao === "up" ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev

      const newWidgets = [...prev]
      const [widget] = newWidgets.splice(index, 1)
      newWidgets.splice(newIndex, 0, widget)
      
      return newWidgets.map((w, i) => ({ ...w, ordem: i }))
    })
  }

  const salvar = () => {
    onWidgetsChange(tempWidgets)
    setOpen(false)
  }

  const resetar = () => {
    setTempWidgets(WIDGETS_DISPONIVEIS)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) setTempWidgets(widgets) }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LayoutGrid className="h-4 w-4" />
          Personalizar Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Personalizar Dashboard</DialogTitle>
          <DialogDescription>
            Escolha quais widgets exibir e sua ordem
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tempWidgets.map((widget, index) => (
            <div
              key={widget.id}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => moverWidget(widget.id, "up")}
                  disabled={index === 0}
                >
                  <span className="text-xs">^</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => moverWidget(widget.id, "down")}
                  disabled={index === tempWidgets.length - 1}
                >
                  <span className="text-xs rotate-180">^</span>
                </Button>
              </div>
              
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              
              <Checkbox
                id={widget.id}
                checked={widget.habilitado}
                onCheckedChange={() => toggleWidget(widget.id)}
              />
              
              <Label htmlFor={widget.id} className="flex-1 cursor-pointer">
                {widget.titulo}
              </Label>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={resetar}>
            Resetar
          </Button>
          <Button onClick={salvar} className="flex-1">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function DashboardPersonalizado({ widgets, renderWidget }: Omit<DashboardPersonalizadoProps, "onWidgetsChange">) {
  const widgetsHabilitados = widgets
    .filter(w => w.habilitado)
    .sort((a, b) => a.ordem - b.ordem)

  if (widgetsHabilitados.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Plus className="h-8 w-8 mb-2" />
          <p>Nenhum widget habilitado</p>
          <p className="text-sm">Use o botao Personalizar Dashboard para adicionar widgets</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {widgetsHabilitados.map(widget => (
        <div key={widget.id}>
          {renderWidget(widget.id)}
        </div>
      ))}
    </div>
  )
}
