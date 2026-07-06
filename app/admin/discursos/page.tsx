"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
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
import { Plus, Pencil, Trash2, Mic2, Search, Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface Discurso {
  id: string
  numero: number
  titulo: string
  created_at: string
  updated_at: string
}

export default function DiscursosPage() {
  const [discursos, setDiscursos] = useState<Discurso[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDiscurso, setSelectedDiscurso] = useState<Discurso | null>(null)
  const [saving, setSaving] = useState(false)

  const [numero, setNumero] = useState("")
  const [titulo, setTitulo] = useState("")

  const supabase = createClient()

  useEffect(() => {
    loadDiscursos()
  }, [])

  async function loadDiscursos() {
    setLoading(true)
    const { data, error } = await supabase
      .from("discursos")
      .select("*")
      .order("numero", { ascending: true })

    if (error) {
      toast.error("Erro ao carregar discursos")
    } else {
      setDiscursos(data || [])
    }
    setLoading(false)
  }

  function openAddDialog() {
    setSelectedDiscurso(null)
    setNumero("")
    setTitulo("")
    setDialogOpen(true)
  }

  function openEditDialog(discurso: Discurso) {
    setSelectedDiscurso(discurso)
    setNumero(discurso.numero.toString())
    setTitulo(discurso.titulo)
    setDialogOpen(true)
  }

  function openDeleteDialog(discurso: Discurso) {
    setSelectedDiscurso(discurso)
    setDeleteDialogOpen(true)
  }

  async function handleSave() {
    if (!numero || !titulo) {
      toast.error("Preencha todos os campos")
      return
    }

    const numeroInt = parseInt(numero)
    if (isNaN(numeroInt) || numeroInt < 1) {
      toast.error("Número do discurso inválido")
      return
    }

    setSaving(true)

    if (selectedDiscurso) {
      const { error } = await supabase
        .from("discursos")
        .update({
          numero: numeroInt,
          titulo: titulo.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedDiscurso.id)

      if (error) {
        if (error.code === "23505") {
          toast.error("Este número de discurso já existe")
        } else {
          toast.error("Erro ao atualizar discurso")
        }
      } else {
        toast.success("Discurso atualizado com sucesso")
        setDialogOpen(false)
        loadDiscursos()
      }
    } else {
      const { error } = await supabase
        .from("discursos")
        .insert({
          numero: numeroInt,
          titulo: titulo.trim(),
        })

      if (error) {
        if (error.code === "23505") {
          toast.error("Este número de discurso já existe")
        } else {
          toast.error("Erro ao adicionar discurso")
        }
      } else {
        toast.success("Discurso adicionado com sucesso")
        setDialogOpen(false)
        loadDiscursos()
      }
    }

    setSaving(false)
  }

  async function handleDelete() {
    if (!selectedDiscurso) return

    setSaving(true)

    const { error } = await supabase
      .from("discursos")
      .delete()
      .eq("id", selectedDiscurso.id)

    if (error) {
      toast.error("Erro ao excluir discurso")
    } else {
      toast.success("Discurso excluído com sucesso")
      setDeleteDialogOpen(false)
      loadDiscursos()
    }

    setSaving(false)
  }

  const filteredDiscursos = discursos.filter(
    (d) =>
      d.numero.toString().includes(search) ||
      d.titulo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Mic2 className="w-6 h-6 text-sky-400" />
            Discursos Públicos
          </h1>
          <p className="text-sm text-zinc-500">
            Gerencie os esboços S-99 com seus números e títulos
          </p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Discurso
        </Button>
      </div>

      {/* Busca e stats */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Buscar por número ou título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-zinc-900/50 border-zinc-800"
          />
        </div>
        <div className="text-sm text-zinc-500">
          {discursos.length} discurso(s) cadastrado(s)
        </div>
      </div>

      {/* Tabela */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
            </div>
          ) : filteredDiscursos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Mic2 className="w-12 h-12 mb-4 opacity-50" />
              <p>{search ? "Nenhum discurso encontrado" : "Nenhum discurso cadastrado"}</p>
              {!search && (
                <Button variant="outline" onClick={openAddDialog} className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Primeiro Discurso
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-zinc-800/50 border-zinc-800">
                  <TableHead className="w-24">Número</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="w-32 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiscursos.map((discurso) => (
                  <TableRow key={discurso.id} className="hover:bg-zinc-800/50 border-zinc-800">
                    <TableCell className="font-medium">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 font-bold text-sm">
                        {discurso.numero}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{discurso.titulo}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(discurso)}
                          className="h-8 w-8 hover:bg-zinc-800"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(discurso)}
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

      {/* Dialog Adicionar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mic2 className="w-5 h-5 text-sky-400" />
              {selectedDiscurso ? "Editar Discurso" : "Adicionar Discurso"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número do Discurso (S-99)</Label>
              <Input
                id="numero"
                type="number"
                min="1"
                max="194"
                placeholder="Ex: 15"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titulo">Título do Discurso</Label>
              <Input
                id="titulo"
                placeholder="Ex: Faça o bem a todos"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
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
              {selectedDiscurso ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Excluir */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Excluir Discurso
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-zinc-400">
              Tem certeza que deseja excluir o discurso{" "}
              <span className="font-semibold text-white">
                {selectedDiscurso?.numero} — {selectedDiscurso?.titulo}
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
