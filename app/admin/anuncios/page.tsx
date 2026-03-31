"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar, 
  Image as ImageIcon,
  GripVertical,
  Eye,
  EyeOff,
  ExternalLink,
  Megaphone
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Anuncio {
  id: string
  titulo: string
  texto: string
  imagem_url: string | null
  ativo: boolean
  ordem: number
  data_evento: string | null
  created_at: string
  updated_at: string
}

interface AnuncioForm {
  titulo: string
  texto: string
  imagem_url: string
  data_evento: string
  ativo: boolean
}

const initialForm: AnuncioForm = {
  titulo: "",
  texto: "",
  imagem_url: "",
  data_evento: "",
  ativo: true,
}

export default function AnunciosAdminPage() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAnuncio, setEditingAnuncio] = useState<Anuncio | null>(null)
  const [deleteAnuncio, setDeleteAnuncio] = useState<Anuncio | null>(null)
  const [form, setForm] = useState<AnuncioForm>(initialForm)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadAnuncios()
  }, [])

  async function loadAnuncios() {
    setLoading(true)
    const { data, error } = await supabase
      .from("anuncios")
      .select("*")
      .order("ordem", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) {
      toast.error("Erro ao carregar anúncios")
      console.error(error)
    } else {
      setAnuncios(data || [])
    }
    setLoading(false)
  }

  function openCreateDialog() {
    setEditingAnuncio(null)
    setForm(initialForm)
    setIsDialogOpen(true)
  }

  function openEditDialog(anuncio: Anuncio) {
    setEditingAnuncio(anuncio)
    setForm({
      titulo: anuncio.titulo,
      texto: anuncio.texto,
      imagem_url: anuncio.imagem_url || "",
      data_evento: anuncio.data_evento 
        ? new Date(anuncio.data_evento).toISOString().slice(0, 16) 
        : "",
      ativo: anuncio.ativo,
    })
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!form.titulo.trim() || !form.texto.trim()) {
      toast.error("Título e texto são obrigatórios")
      return
    }

    setSaving(true)

    const payload = {
      titulo: form.titulo.trim(),
      texto: form.texto.trim(),
      imagem_url: form.imagem_url.trim() || null,
      data_evento: form.data_evento ? new Date(form.data_evento).toISOString() : null,
      ativo: form.ativo,
      updated_at: new Date().toISOString(),
    }

    if (editingAnuncio) {
      // Atualizar
      const { error } = await supabase
        .from("anuncios")
        .update(payload)
        .eq("id", editingAnuncio.id)

      if (error) {
        toast.error("Erro ao atualizar anúncio")
        console.error(error)
      } else {
        toast.success("Anúncio atualizado com sucesso")
        setIsDialogOpen(false)
        loadAnuncios()
      }
    } else {
      // Criar
      const { error } = await supabase
        .from("anuncios")
        .insert({ ...payload, ordem: anuncios.length })

      if (error) {
        toast.error("Erro ao criar anúncio")
        console.error(error)
      } else {
        toast.success("Anúncio criado com sucesso")
        setIsDialogOpen(false)
        loadAnuncios()
      }
    }

    setSaving(false)
  }

  async function handleDelete() {
    if (!deleteAnuncio) return

    const { error } = await supabase
      .from("anuncios")
      .delete()
      .eq("id", deleteAnuncio.id)

    if (error) {
      toast.error("Erro ao excluir anúncio")
      console.error(error)
    } else {
      toast.success("Anúncio excluído com sucesso")
      loadAnuncios()
    }
    setDeleteAnuncio(null)
  }

  async function toggleAtivo(anuncio: Anuncio) {
    const { error } = await supabase
      .from("anuncios")
      .update({ ativo: !anuncio.ativo, updated_at: new Date().toISOString() })
      .eq("id", anuncio.id)

    if (error) {
      toast.error("Erro ao atualizar status")
      console.error(error)
    } else {
      toast.success(anuncio.ativo ? "Anúncio desativado" : "Anúncio ativado")
      loadAnuncios()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" />
            Quadro de Anúncios
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os anúncios e eventos da congregação
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <a href="/" target="_blank" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Ver Página
            </a>
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Anúncio
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingAnuncio ? "Editar Anúncio" : "Novo Anúncio"}
                </DialogTitle>
                <DialogDescription>
                  {editingAnuncio 
                    ? "Atualize as informações do anúncio" 
                    : "Preencha os campos para criar um novo anúncio"}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    placeholder="Ex: Reunião Especial"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="texto">Texto *</Label>
                  <Textarea
                    id="texto"
                    value={form.texto}
                    onChange={(e) => setForm({ ...form, texto: e.target.value })}
                    placeholder="Descreva o anúncio ou evento..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imagem_url">URL da Imagem (opcional)</Label>
                  <Input
                    id="imagem_url"
                    type="url"
                    value={form.imagem_url}
                    onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  {form.imagem_url && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted mt-2">
                      <Image
                        src={form.imagem_url}
                        alt="Preview"
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = ""
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_evento">Data e Hora do Evento (opcional)</Label>
                  <Input
                    id="data_evento"
                    type="datetime-local"
                    value={form.data_evento}
                    onChange={(e) => setForm({ ...form, data_evento: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="ativo" className="cursor-pointer">Anúncio ativo</Label>
                  <Switch
                    id="ativo"
                    checked={form.ativo}
                    onCheckedChange={(checked) => setForm({ ...form, ativo: checked })}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvando..." : editingAnuncio ? "Atualizar" : "Criar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Lista de Anúncios */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-6 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : anuncios.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Megaphone className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Nenhum anúncio</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie seu primeiro anúncio para começar
            </p>
            <Button onClick={openCreateDialog} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Anúncio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {anuncios.map((anuncio) => (
            <Card 
              key={anuncio.id} 
              className={cn(
                "transition-all",
                !anuncio.ativo && "opacity-60"
              )}
            >
              <CardContent className="p-0">
                <div className="flex">
                  {/* Drag Handle */}
                  <div className="flex items-center justify-center w-10 border-r border-border bg-muted/30 cursor-grab">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>

                  {/* Imagem */}
                  {anuncio.imagem_url && (
                    <div className="relative w-24 h-24 flex-shrink-0 border-r border-border">
                      <Image
                        src={anuncio.imagem_url}
                        alt={anuncio.titulo}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Conteúdo */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {anuncio.titulo}
                          </h3>
                          <Badge variant={anuncio.ativo ? "default" : "secondary"} className="flex-shrink-0">
                            {anuncio.ativo ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {anuncio.texto}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          {anuncio.data_evento && (
                            <span className="flex items-center gap-1 text-primary">
                              <Calendar className="h-3 w-3" />
                              {formatDate(anuncio.data_evento)}
                            </span>
                          )}
                          {anuncio.imagem_url && (
                            <span className="flex items-center gap-1">
                              <ImageIcon className="h-3 w-3" />
                              Com imagem
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleAtivo(anuncio)}
                          title={anuncio.ativo ? "Desativar" : "Ativar"}
                        >
                          {anuncio.ativo ? (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(anuncio)}
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteAnuncio(anuncio)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!deleteAnuncio} onOpenChange={() => setDeleteAnuncio(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir anúncio?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o anúncio &quot;{deleteAnuncio?.titulo}&quot;? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
