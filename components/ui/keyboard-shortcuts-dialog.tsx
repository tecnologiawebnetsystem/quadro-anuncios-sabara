"use client"

import { useState, useEffect } from "react"
import { Keyboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Atalho {
  teclas: string[]
  descricao: string
  categoria: string
}

const ATALHOS: Atalho[] = [
  // Navegação
  { teclas: ["G", "H"], descricao: "Ir para Home/Dashboard", categoria: "Navegação" },
  { teclas: ["G", "P"], descricao: "Ir para Publicadores", categoria: "Navegação" },
  { teclas: ["G", "D"], descricao: "Ir para Designações", categoria: "Navegação" },
  { teclas: ["G", "C"], descricao: "Ir para Configurações", categoria: "Navegação" },
  { teclas: ["G", "G"], descricao: "Ir para Grupos", categoria: "Navegação" },
  
  // Ações
  { teclas: ["N"], descricao: "Nova designação/item", categoria: "Ações" },
  { teclas: ["S"], descricao: "Salvar alterações", categoria: "Ações" },
  { teclas: ["Esc"], descricao: "Fechar modal/cancelar", categoria: "Ações" },
  { teclas: ["/"], descricao: "Focar na busca", categoria: "Ações" },
  
  // Visualização
  { teclas: ["T"], descricao: "Alternar tema claro/escuro", categoria: "Visualização" },
  { teclas: ["?"], descricao: "Mostrar atalhos de teclado", categoria: "Visualização" },
  
  // Seleção
  { teclas: ["J"], descricao: "Próximo item na lista", categoria: "Seleção" },
  { teclas: ["K"], descricao: "Item anterior na lista", categoria: "Seleção" },
  { teclas: ["Enter"], descricao: "Abrir/editar item selecionado", categoria: "Seleção" },
]

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift + ? para abrir atalhos
      if (e.shiftKey && e.key === "?") {
        e.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const categorias = [...new Set(ATALHOS.map(a => a.categoria))]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Keyboard className="h-4 w-4" />
          <span className="hidden sm:inline">Atalhos</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Atalhos de Teclado
          </DialogTitle>
          <DialogDescription>
            Use estes atalhos para navegar mais rapidamente pelo sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {categorias.map(categoria => (
            <div key={categoria}>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                {categoria}
              </h4>
              <div className="space-y-2">
                {ATALHOS.filter(a => a.categoria === categoria).map((atalho, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{atalho.descricao}</span>
                    <div className="flex items-center gap-1">
                      {atalho.teclas.map((tecla, j) => (
                        <span key={j} className="flex items-center gap-1">
                          {j > 0 && <span className="text-xs text-muted-foreground">+</span>}
                          <Badge variant="outline" className="font-mono text-xs px-2">
                            {tecla}
                          </Badge>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Pressione <Badge variant="outline" className="font-mono text-[10px] mx-1">Shift</Badge> + <Badge variant="outline" className="font-mono text-[10px] mx-1">?</Badge> a qualquer momento para ver esta lista
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    let keySequence: string[] = []
    let timeout: NodeJS.Timeout

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar se estiver em um input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      clearTimeout(timeout)
      keySequence.push(e.key.toUpperCase())

      // Verificar sequências de 1 ou 2 teclas
      const seq1 = keySequence[keySequence.length - 1]
      const seq2 = keySequence.slice(-2).join("")

      if (shortcuts[seq2]) {
        e.preventDefault()
        shortcuts[seq2]()
        keySequence = []
        return
      }

      if (shortcuts[seq1]) {
        e.preventDefault()
        shortcuts[seq1]()
        keySequence = []
        return
      }

      // Limpar sequência após 1 segundo
      timeout = setTimeout(() => {
        keySequence = []
      }, 1000)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      clearTimeout(timeout)
    }
  }, [shortcuts])
}
