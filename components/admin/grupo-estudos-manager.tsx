"use client"

import { useState, useEffect, useTransition, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import {
  Plus,
  Users,
  Pencil,
  Trash2,
  UserPlus,
  UserCheck,
  Loader2,
  RefreshCw,
  MapPin,
  GripVertical,
} from "lucide-react"
import {
  getGrupos,
  getPublicadores,
  createGrupo,
  updateGrupo,
  deleteGrupo,
  createPublicador,
  updatePublicador,
  movePublicador,
  deletePublicador,
  seedGruposEPublicadores,
  type Grupo,
  type PublicadorGrupo,
} from "@/lib/actions/grupos"

export function GrupoEstudosManager() {
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [publicadores, setPublicadores] = useState<PublicadorGrupo[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // Drag and drop states
  const [draggingPublicador, setDraggingPublicador] = useState<PublicadorGrupo | null>(null)
  const [dragOverGrupoId, setDragOverGrupoId] = useState<string | null>(null)
  const [isMoving, setIsMoving] = useState(false)

  // Estados dos dialogs
  const [dialogGrupoOpen, setDialogGrupoOpen] = useState(false)
  const [dialogPublicadorOpen, setDialogPublicadorOpen] = useState(false)
  const [dialogAdicionarExistenteOpen, setDialogAdicionarExistenteOpen] = useState(false)
  const [grupoParaAdicionarPublicador, setGrupoParaAdicionarPublicador] = useState<Grupo | null>(null)
  const [alertDeleteGrupo, setAlertDeleteGrupo] = useState<Grupo | null>(null)
  const [alertDeletePublicador, setAlertDeletePublicador] = useState<PublicadorGrupo | null>(null)

  // Estados de formulário
  const [editandoGrupo, setEditandoGrupo] = useState<Grupo | null>(null)
  const [editandoPublicador, setEditandoPublicador] = useState<PublicadorGrupo | null>(null)

  // Formulário grupo
  const [grupoForm, setGrupoForm] = useState({ numero: "", nome: "", local: "" })
  // Formulário publicador
  const [publicadorForm, setPublicadorForm] = useState({
    nome: "",
    grupo_id: "",
    is_lider: false,
    is_auxiliar: false,
  })

  // Carregar dados
  async function carregarDados() {
    setLoading(true)
    try {
      const [gruposData, publicadoresData] = await Promise.all([
        getGrupos(),
        getPublicadores(),
      ])
      setGrupos(gruposData)
      setPublicadores(publicadoresData)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast.error("Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  // Seed dados iniciais
  async function handleSeed() {
    startTransition(async () => {
      const result = await seedGruposEPublicadores()
      if (result.success) {
        toast.success(result.message || "Dados criados com sucesso!")
        carregarDados()
      } else {
        toast.error(result.error || "Erro ao criar dados")
      }
    })
  }

  // ===== DRAG AND DROP =====
  function handleDragStart(e: React.DragEvent, publicador: PublicadorGrupo) {
    setDraggingPublicador(publicador)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", publicador.id)
    
    // Adiciona uma pequena opacidade ao elemento sendo arrastado
    const target = e.target as HTMLElement
    setTimeout(() => {
      target.style.opacity = "0.5"
    }, 0)
  }

  function handleDragEnd(e: React.DragEvent) {
    const target = e.target as HTMLElement
    target.style.opacity = "1"
    setDraggingPublicador(null)
    setDragOverGrupoId(null)
  }

  function handleDragOver(e: React.DragEvent, grupoId: string) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    
    if (dragOverGrupoId !== grupoId) {
      setDragOverGrupoId(grupoId)
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    // Só limpa se realmente saiu do card (não para elementos filhos)
    const relatedTarget = e.relatedTarget as HTMLElement
    const currentTarget = e.currentTarget as HTMLElement
    if (!currentTarget.contains(relatedTarget)) {
      setDragOverGrupoId(null)
    }
  }

  async function handleDrop(e: React.DragEvent, grupoDestinoId: string) {
    e.preventDefault()
    setDragOverGrupoId(null)
    
    if (!draggingPublicador) return
    
    // Não faz nada se soltar no mesmo grupo
    if (draggingPublicador.grupo_id === grupoDestinoId) {
      setDraggingPublicador(null)
      return
    }

    const publicadorNome = draggingPublicador.nome
    const grupoDestino = grupos.find(g => g.id === grupoDestinoId)
    
    setIsMoving(true)
    
    // Atualiza localmente primeiro para feedback instantâneo
    setPublicadores(prev => 
      prev.map(p => 
        p.id === draggingPublicador.id 
          ? { ...p, grupo_id: grupoDestinoId }
          : p
      )
    )
    
    // Salva no banco
    const result = await movePublicador(draggingPublicador.id, grupoDestinoId)
    
    if (result.success) {
      toast.success(`${publicadorNome} movido para ${grupoDestino?.nome || "outro grupo"}`)
    } else {
      // Reverte se falhou
      toast.error(result.error || "Erro ao mover publicador")
      carregarDados()
    }
    
    setDraggingPublicador(null)
    setIsMoving(false)
  }

  // CRUD Grupo
  function abrirDialogGrupo(grupo?: Grupo) {
    if (grupo) {
      setEditandoGrupo(grupo)
      setGrupoForm({
        numero: grupo.numero.toString(),
        nome: grupo.nome,
        local: grupo.local || "",
      })
    } else {
      setEditandoGrupo(null)
      const proximoNumero = grupos.length > 0 ? Math.max(...grupos.map((g) => g.numero)) + 1 : 1
      setGrupoForm({ numero: proximoNumero.toString(), nome: `Grupo ${proximoNumero}`, local: "" })
    }
    setDialogGrupoOpen(true)
  }

  async function handleSalvarGrupo() {
    if (!grupoForm.nome.trim()) {
      toast.error("Nome do grupo é obrigatório")
      return
    }

    startTransition(async () => {
      if (editandoGrupo) {
        const result = await updateGrupo(editandoGrupo.id, {
          numero: parseInt(grupoForm.numero),
          nome: grupoForm.nome,
          local: grupoForm.local || undefined,
        })
        if (result.success) {
          toast.success("Grupo atualizado com sucesso!")
          setDialogGrupoOpen(false)
          carregarDados()
        } else {
          toast.error(result.error || "Erro ao atualizar grupo")
        }
      } else {
        const result = await createGrupo({
          numero: parseInt(grupoForm.numero),
          nome: grupoForm.nome,
          local: grupoForm.local || undefined,
        })
        if (result.success) {
          toast.success("Grupo criado com sucesso!")
          setDialogGrupoOpen(false)
          carregarDados()
        } else {
          toast.error(result.error || "Erro ao criar grupo")
        }
      }
    })
  }

  async function handleExcluirGrupo() {
    if (!alertDeleteGrupo) return

    startTransition(async () => {
      const result = await deleteGrupo(alertDeleteGrupo.id)
      if (result.success) {
        toast.success("Grupo excluído com sucesso!")
        setAlertDeleteGrupo(null)
        carregarDados()
      } else {
        toast.error(result.error || "Erro ao excluir grupo")
      }
    })
  }

  // CRUD Publicador
  function abrirDialogPublicador(publicador?: PublicadorGrupo, grupoId?: string) {
    if (publicador) {
      setEditandoPublicador(publicador)
      setPublicadorForm({
        nome: publicador.nome,
        grupo_id: publicador.grupo_id || "",
        is_lider: publicador.is_lider,
        is_auxiliar: publicador.is_auxiliar,
      })
    } else {
      setEditandoPublicador(null)
      setPublicadorForm({
        nome: "",
        grupo_id: grupoId || "",
        is_lider: false,
        is_auxiliar: false,
      })
    }
    setDialogPublicadorOpen(true)
  }

  async function handleSalvarPublicador() {
    if (!publicadorForm.nome.trim()) {
      toast.error("Nome do publicador é obrigatório")
      return
    }

    startTransition(async () => {
      if (editandoPublicador) {
        const result = await updatePublicador(editandoPublicador.id, {
          nome: publicadorForm.nome,
          grupo_id: publicadorForm.grupo_id || null,
          is_lider: publicadorForm.is_lider,
          is_auxiliar: publicadorForm.is_auxiliar,
        })
        if (result.success) {
          toast.success("Publicador atualizado com sucesso!")
          setDialogPublicadorOpen(false)
          carregarDados()
        } else {
          toast.error(result.error || "Erro ao atualizar publicador")
        }
      } else {
        const result = await createPublicador({
          nome: publicadorForm.nome,
          grupo_id: publicadorForm.grupo_id || null,
          is_lider: publicadorForm.is_lider,
          is_auxiliar: publicadorForm.is_auxiliar,
        })
        if (result.success) {
          toast.success("Publicador adicionado com sucesso!")
          setDialogPublicadorOpen(false)
          carregarDados()
        } else {
          toast.error(result.error || "Erro ao criar publicador")
        }
      }
    })
  }

  async function handleExcluirPublicador() {
    if (!alertDeletePublicador) return

    startTransition(async () => {
      const result = await deletePublicador(alertDeletePublicador.id)
      if (result.success) {
        toast.success("Publicador excluído com sucesso!")
        setAlertDeletePublicador(null)
        carregarDados()
      } else {
        toast.error(result.error || "Erro ao excluir publicador")
      }
    })
  }

  // Obter publicadores de um grupo
  function getPublicadoresDoGrupo(grupoId: string) {
    return publicadores
      .filter((p) => p.grupo_id === grupoId)
      .sort((a, b) => {
        if (a.is_lider && !b.is_lider) return -1
        if (!a.is_lider && b.is_lider) return 1
        if (a.is_auxiliar && !b.is_auxiliar) return -1
        if (!a.is_auxiliar && b.is_auxiliar) return 1
        return a.nome.localeCompare(b.nome)
      })
  }

  // Obter publicadores sem grupo (para adicionar a um grupo)
  function getPublicadoresSemGrupo() {
    return publicadores
      .filter((p) => !p.grupo_id)
      .sort((a, b) => a.nome.localeCompare(b.nome))
  }

  // Abrir dialog para adicionar publicador existente ao grupo
  function abrirDialogAdicionarExistente(grupo: Grupo) {
    setGrupoParaAdicionarPublicador(grupo)
    setDialogAdicionarExistenteOpen(true)
  }

  // Adicionar publicador existente ao grupo
  async function handleAdicionarExistenteAoGrupo(publicadorId: string) {
    if (!grupoParaAdicionarPublicador) return
    
    setIsMoving(true)
    const publicador = publicadores.find(p => p.id === publicadorId)
    
    // Atualiza localmente primeiro para feedback instantâneo
    setPublicadores(prev => 
      prev.map(p => 
        p.id === publicadorId 
          ? { ...p, grupo_id: grupoParaAdicionarPublicador.id }
          : p
      )
    )
    
    const result = await movePublicador(publicadorId, grupoParaAdicionarPublicador.id)
    
    if (result.success) {
      toast.success(`${publicador?.nome} adicionado ao ${grupoParaAdicionarPublicador.nome}`)
    } else {
      toast.error(result.error || "Erro ao adicionar publicador ao grupo")
      carregarDados()
    }
    
    setIsMoving(false)
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grupos de Estudos</h1>
          <p className="text-muted-foreground">
            Arraste e solte os publicadores para movimentar entre grupos
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {grupos.length === 0 && (
            <Button onClick={handleSeed} disabled={isPending} variant="outline">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Carregar Dados Iniciais
            </Button>
          )}
          <Button onClick={() => abrirDialogPublicador()} variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Publicador
          </Button>
          <Button onClick={() => abrirDialogGrupo()}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Grupo
          </Button>
        </div>
      </div>

      {/* Indicador de movimentação */}
      {isMoving && (
        <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Salvando...
        </div>
      )}

      {/* Grid de Grupos */}
      {grupos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum grupo cadastrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Clique em &quot;Carregar Dados Iniciais&quot; para importar os grupos e publicadores
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {grupos.map((grupo) => {
            const publicadoresGrupo = getPublicadoresDoGrupo(grupo.id)
            const isDragOver = dragOverGrupoId === grupo.id

            return (
              <Card 
                key={grupo.id} 
                className={`flex flex-col transition-all duration-200 ${
                  isDragOver 
                    ? "ring-2 ring-primary ring-offset-2 bg-primary/5" 
                    : ""
                } ${
                  draggingPublicador && draggingPublicador.grupo_id !== grupo.id
                    ? "border-dashed"
                    : ""
                }`}
                onDragOver={(e) => handleDragOver(e, grupo.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, grupo.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {grupo.nome}
                        <Badge variant="secondary" className="text-xs">
                          {publicadoresGrupo.length}
                        </Badge>
                      </CardTitle>
                      {grupo.local && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {grupo.local}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => abrirDialogGrupo(grupo)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar grupo</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setAlertDeleteGrupo(grupo)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir grupo</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pt-0">
                  <ScrollArea className="h-[280px] pr-4">
                    <div className="space-y-1">
                      {publicadoresGrupo.map((publicador) => (
                        <div
                          key={publicador.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, publicador)}
                          onDragEnd={handleDragEnd}
                          className={`group flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-all ${
                            draggingPublicador?.id === publicador.id
                              ? "opacity-50 bg-muted"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 opacity-50 group-hover:opacity-100" />
                            <span
                              className={`truncate text-sm select-none ${
                                publicador.is_lider
                                  ? "font-bold text-destructive"
                                  : publicador.is_auxiliar
                                  ? "font-semibold text-primary"
                                  : ""
                              }`}
                            >
                              {publicador.nome}
                            </span>
                            {publicador.is_lider && (
                              <Badge variant="destructive" className="text-xs shrink-0">
                                Dirigente
                              </Badge>
                            )}
                            {publicador.is_auxiliar && (
                              <Badge variant="default" className="text-xs shrink-0">
                                Auxiliar
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => abrirDialogPublicador(publicador)}
                              title="Editar publicador"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => setAlertDeletePublicador(publicador)}
                              title="Excluir publicador"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {publicadoresGrupo.length === 0 && (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                          {isDragOver ? (
                            <span className="text-primary font-medium">Solte aqui para adicionar</span>
                          ) : (
                            "Arraste publicadores para cá"
                          )}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
<div className="mt-3 pt-3 border-t space-y-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full"
                                      onClick={() => abrirDialogPublicador(undefined, grupo.id)}
                                    >
                                      <UserPlus className="mr-2 h-4 w-4" />
                                      Novo Publicador
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full"
                                      onClick={() => abrirDialogAdicionarExistente(grupo)}
                                    >
                                      <UserCheck className="mr-2 h-4 w-4" />
                                      Adicionar Existente
                                    </Button>
                                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Dialog Grupo */}
      <Dialog open={dialogGrupoOpen} onOpenChange={setDialogGrupoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editandoGrupo ? "Editar Grupo" : "Novo Grupo"}
            </DialogTitle>
            <DialogDescription>
              {editandoGrupo
                ? "Atualize as informações do grupo"
                : "Preencha as informações para criar um novo grupo"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número do Grupo</Label>
              <Input
                id="numero"
                type="number"
                value={grupoForm.numero}
                onChange={(e) => setGrupoForm({ ...grupoForm, numero: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Grupo</Label>
              <Input
                id="nome"
                value={grupoForm.nome}
                onChange={(e) => setGrupoForm({ ...grupoForm, nome: e.target.value })}
                placeholder="Ex: Grupo 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="local">Local (opcional)</Label>
              <Input
                id="local"
                value={grupoForm.local}
                onChange={(e) => setGrupoForm({ ...grupoForm, local: e.target.value })}
                placeholder="Ex: Casa do Irmão João"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogGrupoOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarGrupo} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editandoGrupo ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Publicador */}
      <Dialog open={dialogPublicadorOpen} onOpenChange={setDialogPublicadorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editandoPublicador ? "Editar Publicador" : "Novo Publicador"}
            </DialogTitle>
            <DialogDescription>
              {editandoPublicador
                ? "Atualize as informações do publicador"
                : "Preencha as informações para adicionar um novo publicador"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome-publicador">Nome</Label>
              <Input
                id="nome-publicador"
                value={publicadorForm.nome}
                onChange={(e) =>
                  setPublicadorForm({ ...publicadorForm, nome: e.target.value })
                }
                placeholder="Nome do publicador"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grupo-publicador">Grupo</Label>
              <Select
                value={publicadorForm.grupo_id}
                onValueChange={(value) =>
                  setPublicadorForm({ ...publicadorForm, grupo_id: value })
                }
              >
                <SelectTrigger id="grupo-publicador">
                  <SelectValue placeholder="Selecione um grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sem-grupo">Sem grupo</SelectItem>
                  {grupos.map((grupo) => (
                    <SelectItem key={grupo.id} value={grupo.id}>
                      {grupo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-lider"
                checked={publicadorForm.is_lider}
                onCheckedChange={(checked) =>
                  setPublicadorForm({
                    ...publicadorForm,
                    is_lider: checked === true,
                    is_auxiliar: checked === true ? false : publicadorForm.is_auxiliar,
                  })
                }
              />
              <Label htmlFor="is-lider" className="text-sm font-normal">
                Dirigente do grupo
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-auxiliar"
                checked={publicadorForm.is_auxiliar}
                onCheckedChange={(checked) =>
                  setPublicadorForm({
                    ...publicadorForm,
                    is_auxiliar: checked === true,
                    is_lider: checked === true ? false : publicadorForm.is_lider,
                  })
                }
              />
              <Label htmlFor="is-auxiliar" className="text-sm font-normal">
                Auxiliar do grupo
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogPublicadorOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarPublicador} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editandoPublicador ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Adicionar Publicador Existente ao Grupo */}
      <Dialog open={dialogAdicionarExistenteOpen} onOpenChange={setDialogAdicionarExistenteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Adicionar Publicador ao {grupoParaAdicionarPublicador?.nome}
            </DialogTitle>
            <DialogDescription>
              Selecione um publicador que ainda não está em nenhum grupo para adicionar a este grupo.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {getPublicadoresSemGrupo().length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Todos os publicadores já estão em algum grupo.</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-1">
                  {getPublicadoresSemGrupo().map((publicador) => (
                    <div
                      key={publicador.id}
                      className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50 cursor-pointer group"
                      onClick={() => handleAdicionarExistenteAoGrupo(publicador.id)}
                    >
                      <span className="text-sm">{publicador.nome}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isMoving}
                      >
                        {isMoving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAdicionarExistenteOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Delete Grupo */}
      <AlertDialog
        open={!!alertDeleteGrupo}
        onOpenChange={(open) => !open && setAlertDeleteGrupo(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir grupo?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o grupo &quot;{alertDeleteGrupo?.nome}&quot;?
              Os publicadores deste grupo ficarão sem grupo atribuído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleExcluirGrupo}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Delete Publicador */}
      <AlertDialog
        open={!!alertDeletePublicador}
        onOpenChange={(open) => !open && setAlertDeletePublicador(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir publicador?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir &quot;{alertDeletePublicador?.nome}&quot;?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleExcluirPublicador}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
