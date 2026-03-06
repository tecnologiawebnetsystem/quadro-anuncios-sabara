"use client"

import { useState } from "react"
import { Plus, Shield, ShieldCheck, ShieldAlert, Users, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// Tipos de alçadas
interface Alcada {
  id: string
  nome: string
  tipo: string
  descricao: string
  cor: string
  permissoes: string[]
  usuarios: number
}

// Dados de exemplo
const alcadasExemplo: Alcada[] = [
  {
    id: "1",
    nome: "Administrador",
    tipo: "ADMIN",
    descricao: "Acesso total ao sistema",
    cor: "bg-red-500",
    permissoes: ["Todas as permissões"],
    usuarios: 1,
  },
  {
    id: "2",
    nome: "Ancião",
    tipo: "ANCIAO",
    descricao: "Acesso de supervisão da congregação",
    cor: "bg-blue-500",
    permissoes: ["Visualizar publicadores", "Criar anúncios", "Publicar anúncios", "Relatórios"],
    usuarios: 0,
  },
  {
    id: "3",
    nome: "Servo Ministerial",
    tipo: "SERVO_MINISTERIAL",
    descricao: "Acesso auxiliar para servos ministeriais",
    cor: "bg-green-500",
    permissoes: ["Visualizar publicadores", "Criar anúncios", "Visualizar relatórios"],
    usuarios: 0,
  },
  {
    id: "4",
    nome: "Pioneiro",
    tipo: "PIONEIRO",
    descricao: "Acesso para pioneiros regulares e auxiliares",
    cor: "bg-yellow-500",
    permissoes: ["Visualizar anúncios", "Visualizar relatórios"],
    usuarios: 0,
  },
  {
    id: "5",
    nome: "Publicador",
    tipo: "PUBLICADOR",
    descricao: "Acesso básico para publicadores",
    cor: "bg-gray-500",
    permissoes: ["Visualizar anúncios"],
    usuarios: 0,
  },
]

const todasPermissoes = [
  { id: "VISUALIZAR_PUBLICADORES", label: "Visualizar Publicadores" },
  { id: "CRIAR_PUBLICADOR", label: "Criar Publicador" },
  { id: "EDITAR_PUBLICADOR", label: "Editar Publicador" },
  { id: "EXCLUIR_PUBLICADOR", label: "Excluir Publicador" },
  { id: "VISUALIZAR_ANUNCIOS", label: "Visualizar Anúncios" },
  { id: "CRIAR_ANUNCIO", label: "Criar Anúncio" },
  { id: "EDITAR_ANUNCIO", label: "Editar Anúncio" },
  { id: "EXCLUIR_ANUNCIO", label: "Excluir Anúncio" },
  { id: "PUBLICAR_ANUNCIO", label: "Publicar Anúncio" },
  { id: "GERENCIAR_ALCADAS", label: "Gerenciar Alçadas" },
  { id: "GERENCIAR_CONFIGURACOES", label: "Gerenciar Configurações" },
  { id: "VISUALIZAR_RELATORIOS", label: "Visualizar Relatórios" },
  { id: "EXPORTAR_RELATORIOS", label: "Exportar Relatórios" },
]

export default function AlcadasPage() {
  const [alcadas] = useState<Alcada[]>(alcadasExemplo)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPermissoes, setSelectedPermissoes] = useState<string[]>([])

  const handlePermissaoChange = (permissaoId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissoes([...selectedPermissoes, permissaoId])
    } else {
      setSelectedPermissoes(selectedPermissoes.filter((p) => p !== permissaoId))
    }
  }

  const getIconForTipo = (tipo: string) => {
    switch (tipo) {
      case "ADMIN":
        return <ShieldAlert className="h-5 w-5" />
      case "ANCIAO":
        return <ShieldCheck className="h-5 w-5" />
      case "SERVO_MINISTERIAL":
        return <Shield className="h-5 w-5" />
      default:
        return <Users className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Alçadas
          </h1>
          <p className="text-muted-foreground">
            Gerencie as permissões e níveis de acesso do sistema
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Alçada
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Alçada</DialogTitle>
              <DialogDescription>
                Defina o nome, descrição e as permissões para esta alçada
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome da Alçada</Label>
                <Input id="nome" placeholder="Ex: Ancião Coordenador" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" placeholder="Descreva o propósito desta alçada" />
              </div>
              <div className="grid gap-2">
                <Label>Permissões</Label>
                <div className="grid grid-cols-1 gap-3 rounded-lg border border-border p-4 sm:grid-cols-2">
                  {todasPermissoes.map((permissao) => (
                    <div key={permissao.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={permissao.id}
                        checked={selectedPermissoes.includes(permissao.id)}
                        onCheckedChange={(checked) =>
                          handlePermissaoChange(permissao.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={permissao.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {permissao.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setDialogOpen(false)}>Criar Alçada</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {alcadas.map((alcada) => (
          <Card key={alcada.id} className="border-border bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className={`rounded-full p-2 ${alcada.cor} text-white`}>
                  {getIconForTipo(alcada.tipo)}
                </div>
                <CardTitle className="text-sm font-medium">{alcada.nome}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{alcada.descricao}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {alcada.usuarios} usuários
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabela de Alçadas */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Todas as Alçadas</CardTitle>
          <CardDescription>
            Lista completa de alçadas configuradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alçada</TableHead>
                  <TableHead className="hidden md:table-cell">Descrição</TableHead>
                  <TableHead className="hidden lg:table-cell">Permissões</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alcadas.map((alcada) => (
                  <TableRow key={alcada.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-1.5 ${alcada.cor} text-white`}>
                          {getIconForTipo(alcada.tipo)}
                        </div>
                        <span className="font-medium">{alcada.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {alcada.descricao}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {alcada.permissoes.slice(0, 2).map((perm, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                        {alcada.permissoes.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{alcada.permissoes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{alcada.usuarios}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          disabled={alcada.tipo === "ADMIN"}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
