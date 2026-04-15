"use client"

import { useState } from "react"
import { Calendar, Download, Check, Loader2 } from "lucide-react"
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
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Designacao {
  id: string
  titulo: string
  data: Date
  hora?: string
  local?: string
  descricao?: string
  tipo: string
}

interface ExportarAgendaProps {
  designacoes: Designacao[]
  publicadorNome?: string
}

// Função para criar evento ICS
function criarEventoICS(designacao: Designacao): string {
  const dataInicio = format(designacao.data, "yyyyMMdd")
  const dataFim = format(addDays(designacao.data, 1), "yyyyMMdd")
  const uid = `${designacao.id}@quadro-anuncios`
  const agora = format(new Date(), "yyyyMMdd'T'HHmmss'Z'")

  return `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${agora}
DTSTART;VALUE=DATE:${dataInicio}
DTEND;VALUE=DATE:${dataFim}
SUMMARY:${designacao.titulo}
DESCRIPTION:${designacao.descricao || designacao.tipo}
LOCATION:${designacao.local || "Salao do Reino"}
STATUS:CONFIRMED
END:VEVENT`
}

// Função para criar arquivo ICS completo
function criarArquivoICS(designacoes: Designacao[]): string {
  const eventos = designacoes.map(criarEventoICS).join("\n")
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Quadro de Anuncios//PT
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Minhas Designacoes
X-WR-TIMEZONE:America/Sao_Paulo
${eventos}
END:VCALENDAR`
}

// Função para criar URL do Google Calendar
function criarLinkGoogleCalendar(designacao: Designacao): string {
  const dataInicio = format(designacao.data, "yyyyMMdd")
  const dataFim = format(addDays(designacao.data, 1), "yyyyMMdd")
  
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: designacao.titulo,
    dates: `${dataInicio}/${dataFim}`,
    details: designacao.descricao || designacao.tipo,
    location: designacao.local || "Salao do Reino",
  })
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function ExportarAgenda({ designacoes, publicadorNome }: ExportarAgendaProps) {
  const [open, setOpen] = useState(false)
  const [selecionados, setSelecionados] = useState<string[]>([])
  const [exportando, setExportando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  const toggleSelecao = (id: string) => {
    setSelecionados(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const selecionarTodos = () => {
    if (selecionados.length === designacoes.length) {
      setSelecionados([])
    } else {
      setSelecionados(designacoes.map(d => d.id))
    }
  }

  const exportarICS = () => {
    setExportando(true)
    
    const designacoesSelecionadas = designacoes.filter(d => selecionados.includes(d.id))
    const conteudo = criarArquivoICS(designacoesSelecionadas)
    
    const blob = new Blob([conteudo], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement("a")
    link.href = url
    link.download = `designacoes-${publicadorNome || "minha"}-${format(new Date(), "yyyy-MM-dd")}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    setExportando(false)
    setSucesso(true)
    setTimeout(() => setSucesso(false), 3000)
  }

  const abrirGoogleCalendar = (designacao: Designacao) => {
    window.open(criarLinkGoogleCalendar(designacao), "_blank")
  }

  if (designacoes.length === 0) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          Exportar para Agenda
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar Designacoes</DialogTitle>
          <DialogDescription>
            Selecione as designacoes que deseja adicionar a sua agenda pessoal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selecionar todos */}
          <div className="flex items-center space-x-2 pb-2 border-b">
            <Checkbox
              id="selecionar-todos"
              checked={selecionados.length === designacoes.length}
              onCheckedChange={selecionarTodos}
            />
            <Label htmlFor="selecionar-todos" className="font-medium">
              Selecionar todas ({designacoes.length})
            </Label>
          </div>

          {/* Lista de designações */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {designacoes.map((designacao) => (
              <div
                key={designacao.id}
                className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={designacao.id}
                  checked={selecionados.includes(designacao.id)}
                  onCheckedChange={() => toggleSelecao(designacao.id)}
                />
                <div className="flex-1 min-w-0">
                  <Label htmlFor={designacao.id} className="font-medium cursor-pointer">
                    {designacao.titulo}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {format(designacao.data, "EEEE, d 'de' MMMM", { locale: ptBR })}
                    {designacao.hora && ` as ${designacao.hora}`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0"
                  onClick={() => abrirGoogleCalendar(designacao)}
                  title="Adicionar ao Google Calendar"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm1-8h3l-4 4-4-4h3V7h2v5z"/>
                  </svg>
                </Button>
              </div>
            ))}
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={exportarICS}
              disabled={selecionados.length === 0 || exportando}
              className="flex-1 gap-2"
            >
              {exportando ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : sucesso ? (
                <Check className="h-4 w-4" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {sucesso ? "Exportado!" : `Baixar .ICS (${selecionados.length})`}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            O arquivo .ICS e compativel com Apple Calendar, Outlook e outros aplicativos de agenda.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
