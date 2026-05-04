"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CenteredLoader } from "@/components/ui/page-loader"
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
  ImageIcon,
  Eye,
  EyeOff,
  Megaphone,
  Upload,
  X,
  CheckCircle2,
  XCircle,
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
  created_at: string
  updated_at: string
}

interface AnuncioForm {
  titulo: string
  texto: string
  ativo: boolean
}

const initialForm: AnuncioForm = {
  titulo: "",
  texto: "",
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
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Upload de imagem
  const [imagemFile, setImagemFile] = useState<File | null>(null)
  const [imagemPreview, setImagemPreview] = useState<string | null>(null)
  const [imagemAtualUrl, setImagemAtualUrl] = useState<string | null>(null)
  const [uploadando, setUploadando] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    } else {
      setAnuncios(data || [])
    }
    setLoading(false)
  }

  function openCreateDialog() {
    setEditingAnuncio(null)
    setForm(initialForm)
    setImagemFile(null)
    setImagemPreview(null)
    setImagemAtualUrl(null)
    setIsDialogOpen(true)
  }

  function openEditDialog(anuncio: Anuncio) {
    setEditingAnuncio(anuncio)
    setForm({
      titulo: anuncio.titulo,
      texto: anuncio.texto,
      ativo: anuncio.ativo,
    })
    setImagemFile(null)
    setImagemPreview(null)
    setImagemAtualUrl(anuncio.imagem_url)
    setIsDialogOpen(true)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione apenas arquivos de imagem")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB")
      return
    }

    setImagemFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagemPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function removerImagem() {
    setImagemFile(null)
    setImagemPreview(null)
    setImagemAtualUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function uploadImagem(): Promise<string | null> {
    if (!imagemFile) return imagemAtualUrl

    setUploadando(true)
    const fd = new FormData()
    fd.append("file", imagemFile)

    const res = await fetch("/api/upload/anuncios", { method: "POST", body: fd })
    const json = await res.json()
    setUploadando(false)

    if (!res.ok) {
      toast.error(json.error || "Falha no upload da imagem")
      return null
    }
    return json.url as string
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.titulo.trim() || !form.texto.trim()) {
      toast.error("Título e texto são obrigatórios")
      return
    }

    setSaving(true)

    const imagemUrl = await uploadImagem()
    if (imagemFile && imagemUrl === null) {
      // upload falhou
      setSaving(false)
      return
    }

    const payload = {
      titulo: form.titulo.trim(),
      texto: form.texto.trim(),
      imagem_url: imagemUrl,
      ativo: form.ativo,
      updated_at: new Date().toISOString(),
    }

    if (editingAnuncio) {
      const { error } = await supabase
        .from("anuncios")
        .update(payload)
        .eq("id", editingAnuncio.id)

      if (error) {
        toast.error("Erro ao atualizar anúncio")
      } else {
        toast.success("Anúncio atualizado com sucesso")
        setIsDialogOpen(false)
        loadAnuncios()
      }
    } else {
      const { error } = await supabase
        .from("anuncios")
        .insert({ ...payload, ordem: anuncios.length })

      if (error) {
        toast.error("Erro ao criar anúncio")
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
    const { error } = await supabase.from("anuncios").delete().eq("id", deleteAnuncio.id)
    if (error) {
      toast.error("Erro ao excluir anúncio")
    } else {
      toast.success("Anúncio excluído")
      loadAnuncios()
    }
    setDeleteAnuncio(null)
  }

  async function toggleAtivo(anuncio: Anuncio) {
    setTogglingId(anuncio.id)
    const { error } = await supabase
      .from("anuncios")
      .update({ ativo: !anuncio.ativo, updated_at: new Date().toISOString() })
      .eq("id", anuncio.id)

    if (error) {
      toast.error("Erro ao atualizar status")
    } else {
      setAnuncios((prev) =>
        prev.map((a) => (a.id === anuncio.id ? { ...a, ativo: !a.ativo } : a))
      )
      toast.success(anuncio.ativo ? "Anúncio desativado" : "Anúncio ativado")
    }
    setTogglingId(null)
  }

  const imagemExibida = imagemPreview || imagemAtualUrl

  if (loading) return <CenteredLoader />

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
            {anuncios.length} anúncio{anuncios.length !== 1 ? "s" : ""} cadastrado{anuncios.length !== 1 ? "s" : ""}
            {" · "}
            {anuncios.filter((a) => a.ativo).length} ativo{anuncios.filter((a) => a.ativo).length !== 1 ? "s" : ""}
          </p>
        </div>

        <Button onClick={openCreateDialog} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Novo Anúncio
        </Button>
      </div>

      {/* Lista */}
      {anuncios.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Megaphone className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Nenhum anúncio cadastrado</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Crie o primeiro anúncio para exibir no quadro
            </p>
            <Button onClick={openCreateDialog} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Anúncio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {anuncios.map((anuncio) => (
            <Card
              key={anuncio.id}
              className={cn(
                "border transition-all duration-200",
                anuncio.ativo
                  ? "border-border/60 bg-card"
                  : "border-border/30 bg-muted/30 opacity-60"
              )}
            >
              <CardContent className="p-0">
                <div className="flex items-stretch">
                  {/* Indicador lateral de status */}
                  <div
                    className={cn(
                      "w-1.5 rounded-l-lg shrink-0 transition-colors",
                      anuncio.ativo ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  />

                  {/* Imagem thumbnail */}
                  {anuncio.imagem_url && (
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 self-center ml-3 rounded-lg overflow-hidden border border-border/40">
                      <Image
                        src={anuncio.imagem_url}
                        alt={anuncio.titulo}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Conteúdo */}
                  <div className="flex-1 p-4 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {anuncio.titulo}
                          </h3>
                          <Badge
                            variant={anuncio.ativo ? "default" : "secondary"}
                            className={cn(
                              "shrink-0 text-xs",
                              anuncio.ativo && "bg-primary/15 text-primary border-primary/30"
                            )}
                          >
                            {anuncio.ativo ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {anuncio.texto}
                        </p>
                        {anuncio.imagem_url && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <ImageIcon className="h-3 w-3" />
                            Com imagem
                          </span>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Toggle ativo — botão grande e claro */}
                        <button
                          onClick={() => toggleAtivo(anuncio)}
                          disabled={togglingId === anuncio.id}
                          title={anuncio.ativo ? "Clique para desativar" : "Clique para ativar"}
                          className={cn(
                            "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all border",
                            anuncio.ativo
                              ? "bg-primary/10 text-primary border-primary/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                              : "bg-muted text-muted-foreground border-border hover:bg-primary/10 hover:text-primary hover:border-primary/20",
                            togglingId === anuncio.id && "opacity-50 pointer-events-none"
                          )}
                        >
                          {anuncio.ativo ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Ativo</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Inativo</span>
                            </>
                          )}
                        </button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(anuncio)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={() => setDeleteAnuncio(anuncio)}
                          title="Excluir"
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

      {/* Dialog criar / editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            {/* Título */}
            <div className="space-y-1.5">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ex: Reunião Especial"
                required
              />
            </div>

            {/* Texto */}
            <div className="space-y-1.5">
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

            {/* Upload de imagem */}
            <div className="space-y-1.5">
              <Label>Imagem (opcional)</Label>

              {imagemExibida ? (
                <div className="relative rounded-xl overflow-hidden border border-border bg-muted">
                  <div className="relative w-full h-40">
                    <Image
                      src={imagemExibida}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removerImagem}
                    className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1 hover:bg-background transition-colors"
                  >
                    <X className="h-4 w-4 text-foreground" />
                  </button>
                  {imagemFile && (
                    <p className="text-xs text-muted-foreground px-3 py-1.5">
                      {imagemFile.name} ({(imagemFile.size / 1024).toFixed(0)} KB)
                    </p>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                >
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Clique para fazer upload</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WebP — até 5MB</p>
                  </div>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Status ativo */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
              <div>
                <Label htmlFor="ativo" className="cursor-pointer font-medium">
                  Anúncio ativo
                </Label>
                <p className="text-xs text-muted-foreground">
                  Anúncios ativos aparecem no quadro público
                </p>
              </div>
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
              <Button type="submit" disabled={saving || uploadando}>
                {uploadando ? "Enviando imagem..." : saving ? "Salvando..." : editingAnuncio ? "Atualizar" : "Criar Anúncio"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmação de exclusão */}
      <AlertDialog open={!!deleteAnuncio} onOpenChange={() => setDeleteAnuncio(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir anúncio?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir &quot;{deleteAnuncio?.titulo}&quot;? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
