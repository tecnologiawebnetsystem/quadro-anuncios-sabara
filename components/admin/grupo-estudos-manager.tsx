"use client"

import { useState, useEffect, useTransition } from "react"
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
import { toast } from "sonner"
import {
  Plus,
  Users,
  Pencil,
  Trash2,
  ArrowRightLeft,
  UserPlus,
  Loader2,
  RefreshCw,
  MapPin,
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

  // Estados dos dialogs
  const [dialogGrupoOpen, setDialogGrupoOpen] = useState(false)
  const [dialogPublicadorOpen, setDialogPublicadorOpen] = useState(false)
  const [dialogMoverOpen, setDialogMoverOpen] = useState(false)
  const [alertDeleteGrupo, setAlertDeleteGrupo] = useState<Grupo | null>(null)
  const [alertDeletePublicador, setAlertDeletePublicador] = useState<PublicadorGrupo | null>(null)

  // Estados de formulário
  const [editandoGrupo, setEditandoGrupo] = useState<Grupo | null>(null)
  const [editandoPublicador, setEditandoPublicador] = useState<PublicadorGrupo | null>(null)
  const [publicadorParaMover, setPublicadorParaMover] = useState<PublicadorGrupo | null>(null)
  const [grupoDestinoId, setGrupoDestinoId] = useState<string>("")

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

  // Mover publicador
  function abrirDialogMover(publicador: PublicadorGrupo) {
    setPublicadorParaMover(publicador)
    setGrupoDestinoId("")
    setDialogMoverOpen(true)
  }

  async function handleMoverPublicador() {
    if (!publicadorParaMover || !grupoDestinoId) {
      toast.error("Selecione o grupo de destino")
      return
    }

    startTransition(async () => {
      const result = await movePublicador(
        publicadorParaMover.id,
        grupoDestinoId === "sem-grupo" ? null : grupoDestinoId
      )
      if (result.success) {
        const grupoDestino = grupos.find((g) => g.id === grupoDestinoId)
        toast.success(
          `${publicadorParaMover.nome} movido para ${grupoDestino?.nome || "Sem grupo"}`
        )
        setDialogMoverOpen(false)
        setPublicadorParaMover(null)
        carregarDados()
      } else {
        toast.error(result.error || "Erro ao mover publicador")
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
            Gerencie os grupos e movimente os publicadores entre eles
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
            const lider = publicadoresGrupo.find((p) => p.is_lider)

            return (
              <Card key={grupo.id} className="flex flex-col">
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
                  {lider && (
                    <p className="text-sm font-medium text-primary">
                      Dirigente: {lider.nome}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex-1 pt-0">
                  <ScrollArea className="h-[280px] pr-4">
                    <div className="space-y-1">
                      {publicadoresGrupo.map((publicador) => (
                        <div
                          key={publicador.id}
                          className="group flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`truncate text-sm ${
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
                              onClick={() => abrirDialogMover(publicador)}
                              title="Mover para outro grupo"
                            >
                              <ArrowRightLeft className="h-3.5 w-3.5" />
                            </Button>
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
                    </div>
                  </ScrollArea>
                  <div className="mt-3 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => abrirDialogPublicador(undefined, grupo.id)}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Adicionar Publicador
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
              <Label htmlFor="grupo">Grupo</Label>
              <Select
                value={publicadorForm.grupo_id}
                onValueChange={(value) =>
                  setPublicadorForm({ ...publicadorForm, grupo_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grupo" />
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
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_lider"
                  checked={publicadorForm.is_lider}
                  onChange={(e) =>
                    setPublicadorForm({
                      ...publicadorForm,
                      is_lider: e.target.checked,
                      is_auxiliar: e.target.checked ? false : publicadorForm.is_auxiliar,
                    })
                  }
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="is_lider" className="text-sm font-normal">
                  Dirigente
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_auxiliar"
                  checked={publicadorForm.is_auxiliar}
                  onChange={(e) =>
                    setPublicadorForm({
                      ...publicadorForm,
                      is_auxiliar: e.target.checked,
                      is_lider: e.target.checked ? false : publicadorForm.is_lider,
                    })
                  }
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="is_auxiliar" className="text-sm font-normal">
                  Auxiliar
                </Label>
              </div>
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

      {/* Dialog Mover Publicador */}
      <Dialog open={dialogMoverOpen} onOpenChange={setDialogMoverOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mover Publicador</DialogTitle>
            <DialogDescription>
              Selecione o grupo de destino para{" "}
              <strong>{publicadorParaMover?.nome}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Grupo de Destino</Label>
              <Select value={grupoDestinoId} onValueChange={setGrupoDestinoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sem-grupo">Remover do grupo</SelectItem>
                  {grupos
                    .filter((g) => g.id !== publicadorParaMover?.grupo_id)
                    .map((grupo) => (
                      <SelectItem key={grupo.id} value={grupo.id}>
                        {grupo.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMoverOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleMoverPublicador} disabled={isPending || !grupoDestinoId}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mover
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
            <AlertDialogTitle>Excluir Grupo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o grupo{" "}
              <strong>{alertDeleteGrupo?.nome}</strong>? Os publicadores deste
              grupo ficarão sem grupo atribuído.
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
            <AlertDialogTitle>Excluir Publicador</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir{" "}
              <strong>{alertDeletePublicador?.nome}</strong>? Esta ação não pode
              ser desfeita.
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
