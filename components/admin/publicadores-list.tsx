"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Search, MoreHorizontal, Edit, Trash2, Power, Plus } from "lucide-react"
import { Publicador, usePublicadoresStore } from "@/lib/store/publicadores"
import { PublicadorModal } from "./publicador-modal"

interface PublicadoresListProps {
  filtro?: "anciaos" | "servos" | "pioneiros-regulares" | "pioneiros-auxiliares"
  titulo: string
}

export function PublicadoresList({ filtro, titulo }: PublicadoresListProps) {
  const { publicadores, addPublicador, updatePublicador, deletePublicador, toggleAtivo } =
    usePublicadoresStore()
  const [busca, setBusca] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPublicador, setEditingPublicador] = useState<Publicador | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [publicadorToDelete, setPublicadorToDelete] = useState<Publicador | null>(null)

  // Filtrar publicadores
  let filteredPublicadores = publicadores
  if (filtro === "anciaos") {
    filteredPublicadores = publicadores.filter((p) => p.anciao)
  } else if (filtro === "servos") {
    filteredPublicadores = publicadores.filter((p) => p.servoMinisterial)
  } else if (filtro === "pioneiros-regulares") {
    filteredPublicadores = publicadores.filter((p) => p.pioneiroRegular)
  } else if (filtro === "pioneiros-auxiliares") {
    filteredPublicadores = publicadores.filter((p) => p.pioneiroAuxiliar)
  }

  // Busca por nome
  if (busca) {
    filteredPublicadores = filteredPublicadores.filter((p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase())
    )
  }

  const handleSave = (data: Omit<Publicador, "id" | "criadoEm" | "atualizadoEm">) => {
    if (editingPublicador) {
      updatePublicador(editingPublicador.id, data)
    } else {
      addPublicador(data)
    }
    setEditingPublicador(null)
  }

  const handleEdit = (publicador: Publicador) => {
    setEditingPublicador(publicador)
    setModalOpen(true)
  }

  const handleDelete = (publicador: Publicador) => {
    setPublicadorToDelete(publicador)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (publicadorToDelete) {
      deletePublicador(publicadorToDelete.id)
      setPublicadorToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  const handleNewPublicador = () => {
    setEditingPublicador(null)
    setModalOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {titulo}
          </h1>
          <p className="text-muted-foreground">
            {filteredPublicadores.length} publicador(es) encontrado(s)
          </p>
        </div>
        <Button onClick={handleNewPublicador} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-9 bg-background"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Nome</TableHead>
              <TableHead className="text-muted-foreground hidden sm:table-cell">Designações</TableHead>
              <TableHead className="text-muted-foreground hidden md:table-cell">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPublicadores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Nenhum publicador encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredPublicadores.map((publicador) => (
                <TableRow key={publicador.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    {publicador.nome}
                    {/* Mobile badges */}
                    <div className="flex flex-wrap gap-1 mt-1 sm:hidden">
                      {publicador.anciao && (
                        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                          Ancião
                        </Badge>
                      )}
                      {publicador.servoMinisterial && (
                        <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30">
                          Servo
                        </Badge>
                      )}
                      {publicador.pioneiroRegular && (
                        <Badge variant="outline" className="text-xs">PR</Badge>
                      )}
                      {publicador.pioneiroAuxiliar && (
                        <Badge variant="outline" className="text-xs">PA</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {publicador.anciao && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                          Ancião
                        </Badge>
                      )}
                      {publicador.servoMinisterial && (
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                          Servo Ministerial
                        </Badge>
                      )}
                      {publicador.pioneiroRegular && (
                        <Badge variant="outline">Pioneiro Regular</Badge>
                      )}
                      {publicador.pioneiroAuxiliar && (
                        <Badge variant="outline">Pioneiro Auxiliar</Badge>
                      )}
                      {!publicador.anciao && !publicador.servoMinisterial && !publicador.pioneiroRegular && !publicador.pioneiroAuxiliar && (
                        <Badge variant="secondary">Publicador</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant={publicador.ativo ? "default" : "secondary"}
                      className={publicador.ativo ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}
                    >
                      {publicador.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu de ações</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem onClick={() => handleEdit(publicador)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleAtivo(publicador.id)} className="cursor-pointer">
                          <Power className="mr-2 h-4 w-4" />
                          {publicador.ativo ? "Desativar" : "Ativar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(publicador)}
                          className="cursor-pointer text-red-500 focus:text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      <PublicadorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        publicador={editingPublicador}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o publicador{" "}
              <strong>{publicadorToDelete?.nome}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
