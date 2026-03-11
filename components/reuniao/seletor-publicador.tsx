"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { usePublicadoresStore, type Publicador } from "@/lib/store/publicadores"

export type FiltroPublicador = "todos" | "anciao" | "servo" | "anciao_servo"

interface SeletorPublicadorProps {
  value?: string
  onSelect: (publicador: Publicador | null) => void
  filtro?: FiltroPublicador
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function SeletorPublicador({
  value,
  onSelect,
  filtro = "todos",
  placeholder = "Selecionar publicador...",
  className,
  disabled = false,
}: SeletorPublicadorProps) {
  const [open, setOpen] = useState(false)
  const publicadores = usePublicadoresStore((state) => state.publicadores)
  
  // Filtrar publicadores baseado no filtro
  const publicadoresFiltrados = publicadores.filter((p) => {
    if (!p.ativo) return false
    
    switch (filtro) {
      case "anciao":
        return p.anciao
      case "servo":
        return p.servoMinisterial
      case "anciao_servo":
        return p.anciao || p.servoMinisterial
      default:
        return true
    }
  })

  // Ordenar por nome
  const publicadoresOrdenados = [...publicadoresFiltrados].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR")
  )

  // Encontrar publicador selecionado
  const publicadorSelecionado = publicadores.find((p) => p.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "justify-between bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <User className="h-4 w-4 shrink-0 opacity-50" />
            <span className="truncate">
              {publicadorSelecionado ? publicadorSelecionado.nome : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 bg-zinc-900 border-zinc-700 z-50" align="start" sideOffset={4}>
        <Command className="bg-transparent">
          <CommandInput placeholder="Buscar publicador..." className="border-zinc-700" />
          <CommandList>
            <CommandEmpty>Nenhum publicador encontrado.</CommandEmpty>
            <CommandGroup>
              {/* Opção para limpar seleção */}
              {value && (
                <CommandItem
                  value=""
                  onSelect={() => {
                    onSelect(null)
                    setOpen(false)
                  }}
                  className="text-muted-foreground"
                >
                  <span className="italic">Limpar seleção</span>
                </CommandItem>
              )}
              {publicadoresOrdenados.map((publicador) => (
                <CommandItem
                  key={publicador.id}
                  value={publicador.nome}
                  onSelect={() => {
                    onSelect(publicador)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === publicador.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{publicador.nome}</span>
                  {publicador.anciao && (
                    <span className="ml-auto text-xs text-blue-400">Ancião</span>
                  )}
                  {publicador.servoMinisterial && (
                    <span className="ml-auto text-xs text-amber-400">Servo</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
