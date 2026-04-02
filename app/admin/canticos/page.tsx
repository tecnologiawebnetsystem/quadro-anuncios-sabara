"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Music, Search, Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface Cantico {
  id: string
  numero: number
  descricao: string
  created_at: string
  updated_at: string
}

export default function CanticosPage() {
  const [canticos, setCanticos] = useState<Cantico[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCantico, setSelectedCantico] = useState<Cantico | null>(null)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [numero, setNumero] = useState("")
  const [descricao, setDescricao] = useState("")

  const supabase = createClient()

  useEffect(() => {
    loadCanticos()
  }, [])

  async function loadCanticos() {
    setLoading(true)
    const { data, error } = await supabase
      .from("canticos")
      .select("*")
      .order("numero", { ascending: true })

    if (error) {
      toast.error("Erro ao carregar cânticos")
      console.error(error)
    } else {
      setCanticos(data || [])
    }
    setLoading(false)
  }

  function openAddDialog() {
    setSelectedCantico(null)
    setNumero("")
    setDescricao("")
    setDialogOpen(true)
  }

  function openEditDialog(cantico: Cantico) {
    setSelectedCantico(cantico)
    setNumero(cantico.numero.toString())
    setDescricao(cantico.descricao)
    setDialogOpen(true)
  }

  function openDeleteDialog(cantico: Cantico) {
    setSelectedCantico(cantico)
    setDeleteDialogOpen(true)
  }

  async function handleSave() {
    if (!numero || !descricao) {
      toast.error("Preencha todos os campos")
      return
    }

    const numeroInt = parseInt(numero)
    if (isNaN(numeroInt) || numeroInt < 1) {
      toast.error("Número do cântico inválido")
      return
    }

    setSaving(true)

    if (selectedCantico) {
      // Editar
      const { error } = await supabase
        .from("canticos")
        .update({
          numero: numeroInt,
          descricao: descricao.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedCantico.id)

      if (error) {
        if (error.code === "23505") {
          toast.error("Este número de cântico já existe")
        } else {
          toast.error("Erro ao atualizar cântico")
        }
      } else {
        toast.success("Cântico atualizado com sucesso")
        setDialogOpen(false)
        loadCanticos()
      }
    } else {
      // Adicionar
      const { error } = await supabase
        .from("canticos")
        .insert({
          numero: numeroInt,
          descricao: descricao.trim(),
        })

      if (error) {
        if (error.code === "23505") {
          toast.error("Este número de cântico já existe")
        } else {
          toast.error("Erro ao adicionar cântico")
        }
      } else {
        toast.success("Cântico adicionado com sucesso")
        setDialogOpen(false)
        loadCanticos()
      }
    }

    setSaving(false)
  }

  async function handleDelete() {
    if (!selectedCantico) return

    setSaving(true)

    const { error } = await supabase
      .from("canticos")
      .delete()
      .eq("id", selectedCantico.id)

    if (error) {
      toast.error("Erro ao excluir cântico")
    } else {
      toast.success("Cântico excluído com sucesso")
      setDeleteDialogOpen(false)
      loadCanticos()
    }

    setSaving(false)
  }

  const filteredCanticos = canticos.filter(
    (c) =>
      c.numero.toString().includes(search) ||
      c.descricao.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Music className="w-6 h-6 text-purple-400" />
            Cânticos
          </h1>
          <p className="text-sm text-zinc-500">
            Gerencie os cânticos com seus números e descrições
          </p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Cântico
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Buscar por número ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-zinc-900/50 border-zinc-800"
          />
        </div>
        <div className="text-sm text-zinc-500">
          {canticos.length} cântico(s) cadastrado(s)
        </div>
      </div>

      {/* Table */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
            </div>
          ) : filteredCanticos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Music className="w-12 h-12 mb-4 opacity-50" />
              <p>{search ? "Nenhum cântico encontrado" : "Nenhum cântico cadastrado"}</p>
              {!search && (
                <Button variant="outline" onClick={openAddDialog} className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Primeiro Cântico
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-zinc-800/50 border-zinc-800">
                  <TableHead className="w-24">Número</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-32 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCanticos.map((cantico) => (
                  <TableRow key={cantico.id} className="hover:bg-zinc-800/50 border-zinc-800">
                    <TableCell className="font-medium">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 font-bold">
                        {cantico.numero}
                      </span>
                    </TableCell>
                    <TableCell>{cantico.descricao}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(cantico)}
                          className="h-8 w-8 hover:bg-zinc-800"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(cantico)}
                          className="h-8 w-8 hover:bg-red-500/10 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-400" />
              {selectedCantico ? "Editar Cântico" : "Adicionar Cântico"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número do Cântico</Label>
              <Input
                id="numero"
                type="number"
                min="1"
                placeholder="Ex: 88"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição / Nome</Label>
              <Input
                id="descricao"
                placeholder="Ex: Os teus caminhos quero entender"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {selectedCantico ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Excluir Cântico
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-zinc-400">
              Tem certeza que deseja excluir o cântico{" "}
              <span className="font-semibold text-white">
                {selectedCantico?.numero} - {selectedCantico?.descricao}
              </span>
              ?
            </p>
            <p className="text-sm text-zinc-500 mt-2">
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
