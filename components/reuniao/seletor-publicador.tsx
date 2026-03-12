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
import { getPublicadores, type PublicadorGrupo } from "@/lib/actions/grupos"

export type FiltroPublicador = "todos" | "anciao" | "servo" | "anciao_servo" | "irmaos"

// Interface compatível com o formato esperado
export interface Publicador {
  id: string
  nome: string
  anciao: boolean
  servoMinisterial: boolean
  ativo: boolean
  sexo?: "M" | "F"
}

interface SeletorPublicadorProps {
  value?: string
  onSelect: (publicador: Publicador | null) => void
  filtro?: FiltroPublicador
  placeholder?: string
  className?: string
  disabled?: boolean
  side?: "top" | "bottom" | "left" | "right"
}

export function SeletorPublicador({
  value,
  onSelect,
  filtro = "todos",
  placeholder = "Selecionar publicador...",
  className,
  disabled = false,
  side = "bottom",
}: SeletorPublicadorProps) {
  const [open, setOpen] = useState(false)
  const [publicadores, setPublicadores] = useState<Publicador[]>([])
  const [loading, setLoading] = useState(true)
  
  // Carregar publicadores do Supabase
  useEffect(() => {
    async function carregarPublicadores() {
      try {
        const data = await getPublicadores()
        // Converter para o formato esperado
        const publicadoresConvertidos: Publicador[] = data.map(p => ({
          id: p.id,
          nome: p.nome,
          anciao: p.anciao ?? false,
          servoMinisterial: p.servo_ministerial ?? false,
          ativo: p.ativo,
          sexo: undefined, // Não temos esse campo no banco ainda
        }))
        setPublicadores(publicadoresConvertidos)
      } catch (error) {
        console.error("Erro ao carregar publicadores:", error)
      } finally {
        setLoading(false)
      }
    }
    
    carregarPublicadores()
  }, [])
  
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
      case "irmaos":
        // Qualquer publicador ativo (não temos campo sexo no banco ainda)
        return true
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
      <PopoverContent 
        className="w-[280px] p-0 bg-zinc-800 border-zinc-600 z-50 shadow-xl" 
        align="start" 
        side={side}
        sideOffset={4}
      >
        <Command className="bg-zinc-800">
          <CommandInput placeholder="Buscar publicador..." className="border-zinc-600 bg-zinc-800" />
          <CommandList className="bg-zinc-800 max-h-[300px]">
            <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">Nenhum publicador encontrado.</CommandEmpty>
            <CommandGroup className="bg-zinc-800">
              {/* Opção para limpar seleção */}
              {value && (
                <CommandItem
                  value=""
                  onSelect={() => {
                    onSelect(null)
                    setOpen(false)
                  }}
                  className="text-muted-foreground bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
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
                  className="bg-zinc-800 hover:bg-zinc-700 data-[selected=true]:bg-blue-600 cursor-pointer"
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
