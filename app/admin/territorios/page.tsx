"use client"

import { useState, useEffect, useRef } from "react"
import {
  MapPin, Plus, Search, Pencil, Trash2, Upload, X,
  CheckCircle2, Clock, Map, ChevronDown, ImageIcon,
  Loader2, Navigation
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Territorio {
  id: string
  numero: string
  nome: string
  bairro: string | null
  cidade: string
  estado: string
  descricao: string | null
  latitude: number | null
  longitude: number | null
  foto_url: string | null
  foto_pathname: string | null
  status: "disponivel" | "em_campo" | "concluido"
  ultimo_trabalho: string | null
  publicador_responsavel: string | null
  observacoes: string | null
  created_at: string
}

const STATUS_CONFIG = {
  disponivel: { label: "Disponível", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
  em_campo: { label: "Em Campo", color: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: Clock },
  concluido: { label: "Concluído", color: "bg-blue-500/15 text-blue-400 border-blue-500/30", icon: Map },
}

const FORM_VAZIO = {
  numero: "", nome: "", bairro: "", cidade: "Taubaté", estado: "SP",
  descricao: "", latitude: "", longitude: "",
  status: "disponivel" as Territorio["status"],
  ultimo_trabalho: "", publicador_responsavel: "", observacoes: "",
  foto_url: "", foto_pathname: "",
}

export default function TerritoriosPage() {
  const [territorios, setTerritorios] = useState<Territorio[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [dialogAberto, setDialogAberto] = useState(false)
  const [editando, setEditando] = useState<Territorio | null>(null)
  const [excluindo, setExcluindo] = useState<Territorio | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [fazendoUpload, setFazendoUpload] = useState(false)
  const [previewFoto, setPreviewFoto] = useState<string | null>(null)
  const [form, setForm] = useState({ ...FORM_VAZIO })
  const inputFotoRef = useRef<HTMLInputElement>(null)

  const carregarTerritorios = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/territorios")
      if (!res.ok) throw new Error("Erro ao buscar")
      const data = await res.json()
      setTerritorios(data)
    } catch {
      toast.error("Erro ao carregar territórios")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregarTerritorios() }, [])

  const territoriosFiltrados = territorios.filter((t) => {
    const okBusca = busca === "" ||
      t.numero.toLowerCase().includes(busca.toLowerCase()) ||
      t.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (t.bairro?.toLowerCase().includes(busca.toLowerCase()) ?? false)
    const okStatus = filtroStatus === "todos" || t.status === filtroStatus
    return okBusca && okStatus
  })

  const abrirCadastro = () => {
    setEditando(null)
    setForm({ ...FORM_VAZIO })
    setPreviewFoto(null)
    setDialogAberto(true)
  }

  const abrirEdicao = (t: Territorio) => {
    setEditando(t)
    setForm({
      numero: t.numero,
      nome: t.nome,
      bairro: t.bairro || "",
      cidade: t.cidade,
      estado: t.estado,
      descricao: t.descricao || "",
      latitude: t.latitude?.toString() || "",
      longitude: t.longitude?.toString() || "",
      status: t.status,
      ultimo_trabalho: t.ultimo_trabalho || "",
      publicador_responsavel: t.publicador_responsavel || "",
      observacoes: t.observacoes || "",
      foto_url: t.foto_url || "",
      foto_pathname: t.foto_pathname || "",
    })
    setPreviewFoto(t.foto_url || null)
    setDialogAberto(true)
  }

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFazendoUpload(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/territorios/upload", { method: "POST", body: fd })
      if (!res.ok) throw new Error("Erro no upload")
      const { url, pathname } = await res.json()
      setForm((f) => ({ ...f, foto_url: url, foto_pathname: pathname }))
      setPreviewFoto(url)
      toast.success("Foto carregada com sucesso")
    } catch {
      toast.error("Erro ao fazer upload da foto")
    } finally {
      setFazendoUpload(false)
      if (inputFotoRef.current) inputFotoRef.current.value = ""
    }
  }

  const removerFoto = () => {
    setForm((f) => ({ ...f, foto_url: "", foto_pathname: "" }))
    setPreviewFoto(null)
  }

  const obterGeolocalizacao = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não suportada neste dispositivo")
      return
    }
    toast.info("Obtendo localização...")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(7),
          longitude: pos.coords.longitude.toFixed(7),
        }))
        toast.success("Coordenadas obtidas com sucesso")
      },
      () => toast.error("Não foi possível obter a localização")
    )
  }

  const salvar = async () => {
    if (!form.numero.trim() || !form.nome.trim()) {
      toast.error("Número e nome são obrigatórios")
      return
    }
    setSalvando(true)
    try {
      const payload = {
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        foto_url: form.foto_url || null,
        foto_pathname: form.foto_pathname || null,
        ultimo_trabalho: form.ultimo_trabalho || null,
        bairro: form.bairro || null,
        descricao: form.descricao || null,
        publicador_responsavel: form.publicador_responsavel || null,
        observacoes: form.observacoes || null,
      }
      if (editando) {
        const res = await fetch("/api/territorios", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editando.id, ...payload }),
        })
        if (!res.ok) throw new Error("Erro ao atualizar")
        toast.success("Território atualizado")
      } else {
        const res = await fetch("/api/territorios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Erro ao criar")
        toast.success("Território cadastrado")
      }
      setDialogAberto(false)
      carregarTerritorios()
    } catch {
      toast.error("Erro ao salvar território")
    } finally {
      setSalvando(false)
    }
  }

  const excluir = async () => {
    if (!excluindo) return
    try {
      const res = await fetch(`/api/territorios?id=${excluindo.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erro ao excluir")
      toast.success("Território excluído")
      setExcluindo(null)
      carregarTerritorios()
    } catch {
      toast.error("Erro ao excluir território")
    }
  }

  const contadores = {
    total: territorios.length,
    disponivel: territorios.filter((t) => t.status === "disponivel").length,
    em_campo: territorios.filter((t) => t.status === "em_campo").length,
    concluido: territorios.filter((t) => t.status === "concluido").length,
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="h-6 w-6 text-orange-400" />
            Territórios
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cadastro e gestão dos territórios de campo
          </p>
        </div>
        <Button onClick={abrirCadastro} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Território
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", valor: contadores.total, cor: "text-foreground", bg: "bg-muted/40" },
          { label: "Disponíveis", valor: contadores.disponivel, cor: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Em Campo", valor: contadores.em_campo, cor: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Concluídos", valor: contadores.concluido, cor: "text-blue-400", bg: "bg-blue-500/10" },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl p-4 ${item.bg} border border-border`}>
            <div className={`text-2xl font-bold ${item.cor}`}>{item.valor}</div>
            <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número, nome ou bairro..."
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filtrar status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="disponivel">Disponível</SelectItem>
            <SelectItem value="em_campo">Em Campo</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : territoriosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <Map className="h-12 w-12 text-muted-foreground/30" />
          <p className="text-muted-foreground">
            {territorios.length === 0
              ? "Nenhum território cadastrado ainda."
              : "Nenhum território encontrado com esses filtros."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {territoriosFiltrados.map((t) => {
            const statusCfg = STATUS_CONFIG[t.status]
            const StatusIcon = statusCfg.icon
            return (
              <Card key={t.id} className="group overflow-hidden hover:border-primary/30 transition-colors">
                {/* Foto do território */}
                <div className="relative h-36 bg-muted/40 overflow-hidden">
                  {t.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.foto_url}
                      alt={`Território ${t.numero}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Badge número */}
                  <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded-lg px-2.5 py-1 font-bold text-sm">
                    #{t.numero}
                  </div>
                  {/* Badge status */}
                  <div className={`absolute top-2 right-2 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${statusCfg.color} bg-background/80`}>
                    <StatusIcon className="h-3 w-3" />
                    {statusCfg.label}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{t.nome}</h3>
                      {t.bairro && (
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {t.bairro} — {t.cidade}/{t.estado}
                        </p>
                      )}
                      {t.publicador_responsavel && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Resp.: {t.publicador_responsavel}
                        </p>
                      )}
                      {t.ultimo_trabalho && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Último trabalho: {new Date(t.ultimo_trabalho + "T12:00:00").toLocaleDateString("pt-BR")}
                        </p>
                      )}
                      {t.latitude && t.longitude && (
                        <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
                          {t.latitude.toFixed(5)}, {t.longitude.toFixed(5)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => abrirEdicao(t)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setExcluindo(t)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Dialog de cadastro/edição */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-400" />
              {editando ? "Editar Território" : "Novo Território"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5 py-2">
            {/* Upload de foto */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">Foto / Mapa do Território</Label>
              <div
                className="relative rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer overflow-hidden"
                style={{ minHeight: previewFoto ? "200px" : "120px" }}
                onClick={() => !fazendoUpload && inputFotoRef.current?.click()}
              >
                {previewFoto ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewFoto} alt="Preview" className="w-full h-48 object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removerFoto() }}
                      className="absolute top-2 right-2 bg-background/90 hover:bg-background rounded-full p-1 shadow"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-28 gap-2 text-muted-foreground">
                    {fazendoUpload ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="text-sm">Enviando foto...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6" />
                        <span className="text-sm">Clique para fazer upload da foto ou mapa</span>
                        <span className="text-xs opacity-60">JPG, PNG, WebP — máx. 10MB</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <input
                ref={inputFotoRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadFoto}
              />
            </div>

            {/* Identificação */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  placeholder="Ex: 001"
                  value={form.numero}
                  onChange={(e) => setForm((f) => ({ ...f, numero: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as Territorio["status"] }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="em_campo">Em Campo</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="nome">Nome do Território *</Label>
              <Input
                id="nome"
                placeholder="Ex: Parque Sabará Norte"
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  placeholder="Ex: Parque Sabará"
                  value={form.bairro}
                  onChange={(e) => setForm((f) => ({ ...f, bairro: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={form.cidade}
                  onChange={(e) => setForm((f) => ({ ...f, cidade: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descrição do território, referências, limites..."
                value={form.descricao}
                onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                className="mt-1 resize-none"
                rows={2}
              />
            </div>

            {/* Coordenadas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Coordenadas GPS</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-7 text-xs"
                  onClick={obterGeolocalizacao}
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Usar minha localização
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="lat" className="text-xs text-muted-foreground">Latitude</Label>
                  <Input
                    id="lat"
                    placeholder="-23.0000000"
                    value={form.latitude}
                    onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
                    className="mt-1 font-mono text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="lng" className="text-xs text-muted-foreground">Longitude</Label>
                  <Input
                    id="lng"
                    placeholder="-45.0000000"
                    value={form.longitude}
                    onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
                    className="mt-1 font-mono text-sm"
                  />
                </div>
              </div>
              {form.latitude && form.longitude && (
                <a
                  href={`https://maps.google.com/?q=${form.latitude},${form.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1"
                >
                  <MapPin className="h-3 w-3" />
                  Ver no Google Maps
                </a>
              )}
            </div>

            {/* Publicador e datas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="publicador">Publicador Responsável</Label>
                <Input
                  id="publicador"
                  placeholder="Nome do publicador"
                  value={form.publicador_responsavel}
                  onChange={(e) => setForm((f) => ({ ...f, publicador_responsavel: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ultimo_trabalho">Último Trabalho</Label>
                <Input
                  id="ultimo_trabalho"
                  type="date"
                  value={form.ultimo_trabalho}
                  onChange={(e) => setForm((f) => ({ ...f, ultimo_trabalho: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações gerais, dificuldades de acesso, notas..."
                value={form.observacoes}
                onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAberto(false)} disabled={salvando}>
              Cancelar
            </Button>
            <Button onClick={salvar} disabled={salvando} className="gap-2">
              {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
              {editando ? "Salvar Alterações" : "Cadastrar Território"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmação de exclusão */}
      <AlertDialog open={!!excluindo} onOpenChange={(open) => !open && setExcluindo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Território</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o território <strong>#{excluindo?.numero} — {excluindo?.nome}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={excluir} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
