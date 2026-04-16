"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, setMonth, setYear } from "date-fns"
import { ptBR } from "date-fns/locale"

interface FiltroCalendarioProps {
  mesAtual: Date
  onMesChange: (data: Date) => void
  tiposDesignacao?: string[]
  tiposFiltrados?: string[]
  onTiposFiltradosChange?: (tipos: string[]) => void
}

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

const TIPOS_DESIGNACAO = [
  { id: "leitura", label: "Leitura da Biblia", cor: "bg-blue-500" },
  { id: "demonstracao", label: "Demonstração", cor: "bg-green-500" },
  { id: "discurso", label: "Discurso", cor: "bg-amber-500" },
  { id: "oracao", label: "Oração", cor: "bg-purple-500" },
  { id: "sentinela", label: "Sentinela", cor: "bg-rose-500" },
  { id: "revisita", label: "Revisita", cor: "bg-cyan-500" },
  { id: "estudo", label: "Estudo Biblico", cor: "bg-emerald-500" },
]

export function FiltroCalendario({
  mesAtual,
  onMesChange,
  tiposFiltrados = [],
  onTiposFiltradosChange
}: FiltroCalendarioProps) {
  const [seletorAberto, setSeletorAberto] = useState(false)
  const [filtrosAberto, setFiltrosAberto] = useState(false)
  
  const anoAtual = mesAtual.getFullYear()
  const mesIndex = mesAtual.getMonth()

  const irParaMesAnterior = () => {
    onMesChange(subMonths(mesAtual, 1))
  }

  const irParaProximoMes = () => {
    onMesChange(addMonths(mesAtual, 1))
  }

  const irParaHoje = () => {
    onMesChange(new Date())
  }

  const selecionarMes = (mes: number) => {
    onMesChange(setMonth(mesAtual, mes))
    setSeletorAberto(false)
  }

  const selecionarAno = (ano: number) => {
    onMesChange(setYear(mesAtual, ano))
  }

  const toggleTipo = (tipoId: string) => {
    if (!onTiposFiltradosChange) return
    
    if (tiposFiltrados.includes(tipoId)) {
      onTiposFiltradosChange(tiposFiltrados.filter(t => t !== tipoId))
    } else {
      onTiposFiltradosChange([...tiposFiltrados, tipoId])
    }
  }

  const limparFiltros = () => {
    onTiposFiltradosChange?.([])
  }

  const anosDisponiveis = Array.from({ length: 5 }, (_, i) => anoAtual - 2 + i)

  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      {/* Navegação do mês */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={irParaMesAnterior}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Popover open={seletorAberto} onOpenChange={setSeletorAberto}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[180px] justify-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(mesAtual, "MMMM yyyy", { locale: ptBR })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="center">
            {/* Seletor de ano */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => selecionarAno(anoAtual - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <select
                value={anoAtual}
                onChange={(e) => selecionarAno(parseInt(e.target.value))}
                className="bg-transparent border rounded px-2 py-1 text-sm font-medium"
              >
                {anosDisponiveis.map(ano => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => selecionarAno(anoAtual + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Grid de meses */}
            <div className="grid grid-cols-3 gap-2">
              {MESES.map((mes, index) => (
                <Button
                  key={mes}
                  variant={index === mesIndex ? "default" : "ghost"}
                  size="sm"
                  className="text-xs"
                  onClick={() => selecionarMes(index)}
                >
                  {mes.slice(0, 3)}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={irParaProximoMes}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={irParaHoje}
          className="text-xs"
        >
          Hoje
        </Button>
      </div>

      {/* Filtros de tipo */}
      {onTiposFiltradosChange && (
        <div className="flex items-center gap-2">
          {tiposFiltrados.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              {tiposFiltrados.length} filtro(s)
              <button onClick={limparFiltros}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Popover open={filtrosAberto} onOpenChange={setFiltrosAberto}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Tipos de Designação</h4>
                {TIPOS_DESIGNACAO.map(tipo => (
                  <div key={tipo.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={tipo.id}
                      checked={tiposFiltrados.includes(tipo.id)}
                      onCheckedChange={() => toggleTipo(tipo.id)}
                    />
                    <Label htmlFor={tipo.id} className="flex items-center gap-2 cursor-pointer">
                      <span className={`w-2 h-2 rounded-full ${tipo.cor}`} />
                      {tipo.label}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  )
}
