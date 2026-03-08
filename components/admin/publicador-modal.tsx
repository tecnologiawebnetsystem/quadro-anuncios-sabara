"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Publicador } from "@/lib/store/publicadores"

interface PublicadorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  publicador?: Publicador | null
  onSave: (data: Omit<Publicador, "id" | "criadoEm" | "atualizadoEm">) => void
}

export function PublicadorModal({
  open,
  onOpenChange,
  publicador,
  onSave,
}: PublicadorModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    observacoes: "",
    anciao: false,
    servoMinisterial: false,
    pioneiroRegular: false,
    pioneiroAuxiliar: false,
    ativo: true,
  })

  useEffect(() => {
    if (publicador) {
      setFormData({
        nome: publicador.nome,
        telefone: publicador.telefone || "",
        email: publicador.email || "",
        observacoes: publicador.observacoes || "",
        anciao: publicador.anciao,
        servoMinisterial: publicador.servoMinisterial,
        pioneiroRegular: publicador.pioneiroRegular,
        pioneiroAuxiliar: publicador.pioneiroAuxiliar,
        ativo: publicador.ativo,
      })
    } else {
      setFormData({
        nome: "",
        telefone: "",
        email: "",
        observacoes: "",
        anciao: false,
        servoMinisterial: false,
        pioneiroRegular: false,
        pioneiroAuxiliar: false,
        ativo: true,
      })
    }
  }, [publicador, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {publicador ? "Editar Publicador" : "Novo Publicador"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Nome do publicador"
              required
              className="bg-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Designações</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anciao"
                  checked={formData.anciao}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, anciao: checked as boolean })
                  }
                />
                <Label htmlFor="anciao" className="text-sm font-normal cursor-pointer">
                  Ancião
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="servoMinisterial"
                  checked={formData.servoMinisterial}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, servoMinisterial: checked as boolean })
                  }
                />
                <Label htmlFor="servoMinisterial" className="text-sm font-normal cursor-pointer">
                  Servo Ministerial
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pioneiroRegular"
                  checked={formData.pioneiroRegular}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, pioneiroRegular: checked as boolean })
                  }
                />
                <Label htmlFor="pioneiroRegular" className="text-sm font-normal cursor-pointer">
                  Pioneiro Regular
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pioneiroAuxiliar"
                  checked={formData.pioneiroAuxiliar}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, pioneiroAuxiliar: checked as boolean })
                  }
                />
                <Label htmlFor="pioneiroAuxiliar" className="text-sm font-normal cursor-pointer">
                  Pioneiro Auxiliar
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações sobre o publicador..."
              className="bg-background resize-none"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="ativo"
              checked={formData.ativo}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, ativo: checked as boolean })
              }
            />
            <Label htmlFor="ativo" className="text-sm font-normal cursor-pointer">
              Publicador Ativo
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {publicador ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
