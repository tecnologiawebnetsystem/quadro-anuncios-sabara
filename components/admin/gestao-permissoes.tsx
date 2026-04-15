"use client"

import { useState, useEffect } from "react"
import { Shield, Save, Loader2, Check, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { createClient } from "@/lib/supabase/client"
import { logActivity } from "@/lib/services/activity-logger"

interface Funcionalidades {
  publicadores: { ver: boolean; criar: boolean; editar: boolean; excluir: boolean }
  designacoes: { ver: boolean; criar: boolean; editar: boolean; excluir: boolean }
  grupos: { ver: boolean; criar: boolean; editar: boolean; excluir: boolean }
  sentinela: { ver: boolean; criar: boolean; editar: boolean; excluir: boolean }
  relatorios: { ver: boolean; exportar: boolean }
  configuracoes: { ver: boolean; editar: boolean }
  usuarios: { ver: boolean; criar: boolean; editar: boolean; excluir: boolean }
  backup: { criar: boolean; restaurar: boolean }
  logs: { ver: boolean }
}

interface Permissao {
  id: string
  perfil: string
  funcionalidades: Funcionalidades
}

const FUNCIONALIDADES_INFO = {
  publicadores: {
    label: "Publicadores",
    descricao: "Gerenciar lista de publicadores da congregacao",
    acoes: ["ver", "criar", "editar", "excluir"]
  },
  designacoes: {
    label: "Designacoes",
    descricao: "Criar e gerenciar escalas de designacoes",
    acoes: ["ver", "criar", "editar", "excluir"]
  },
  grupos: {
    label: "Grupos",
    descricao: "Gerenciar grupos de servico de campo",
    acoes: ["ver", "criar", "editar", "excluir"]
  },
  sentinela: {
    label: "Sentinela",
    descricao: "Gerenciar escala da Sentinela",
    acoes: ["ver", "criar", "editar", "excluir"]
  },
  relatorios: {
    label: "Relatorios",
    descricao: "Visualizar e exportar relatorios",
    acoes: ["ver", "exportar"]
  },
  configuracoes: {
    label: "Configuracoes",
    descricao: "Configuracoes do sistema",
    acoes: ["ver", "editar"]
  },
  usuarios: {
    label: "Usuarios",
    descricao: "Gerenciar usuarios do sistema",
    acoes: ["ver", "criar", "editar", "excluir"]
  },
  backup: {
    label: "Backup",
    descricao: "Criar e restaurar backups",
    acoes: ["criar", "restaurar"]
  },
  logs: {
    label: "Logs",
    descricao: "Visualizar historico de atividades",
    acoes: ["ver"]
  }
}

const ACOES_LABELS: Record<string, string> = {
  ver: "Visualizar",
  criar: "Criar",
  editar: "Editar",
  excluir: "Excluir",
  exportar: "Exportar",
  restaurar: "Restaurar"
}

export function GestaoPermissoes() {
  const [permissoes, setPermissoes] = useState<Permissao[]>([])
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [perfilAtivo, setPerfilAtivo] = useState("anciao")

  useEffect(() => {
    carregarPermissoes()
  }, [])

  const carregarPermissoes = async () => {
    setLoading(true)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("permissoes")
      .select("*")
      .order("perfil")

    if (!error && data) {
      setPermissoes(data)
    }
    setLoading(false)
  }

  const atualizarPermissao = (
    perfil: string,
    funcionalidade: keyof Funcionalidades,
    acao: string,
    valor: boolean
  ) => {
    setPermissoes(prev => prev.map(p => {
      if (p.perfil === perfil) {
        return {
          ...p,
          funcionalidades: {
            ...p.funcionalidades,
            [funcionalidade]: {
              ...p.funcionalidades[funcionalidade],
              [acao]: valor
            }
          }
        }
      }
      return p
    }))
  }

  const salvar = async () => {
    setSalvando(true)
    const supabase = createClient()

    for (const permissao of permissoes) {
      await supabase
        .from("permissoes")
        .update({ funcionalidades: permissao.funcionalidades, updated_at: new Date().toISOString() })
        .eq("id", permissao.id)
    }

    await logActivity({
      tabela: "permissoes",
      acao: "editar",
      dados_depois: permissoes,
      perfil: "admin"
    })

    setSalvando(false)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 3000)
  }

  const permissaoAtiva = permissoes.find(p => p.perfil === perfilAtivo)

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Gestao de Permissoes</CardTitle>
              <CardDescription>
                Configure quais funcionalidades cada perfil pode acessar
              </CardDescription>
            </div>
          </div>
          <Button onClick={salvar} disabled={salvando} className="gap-2">
            {salvando ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : salvo ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {salvo ? "Salvo!" : "Salvar"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={perfilAtivo} onValueChange={setPerfilAtivo}>
          <TabsList className="mb-6">
            <TabsTrigger value="admin" className="gap-2">
              <Badge variant="default" className="h-5 px-1.5 text-[10px]">Admin</Badge>
            </TabsTrigger>
            <TabsTrigger value="anciao" className="gap-2">
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">Anciao</Badge>
            </TabsTrigger>
            <TabsTrigger value="publicador" className="gap-2">
              <Badge variant="outline" className="h-5 px-1.5 text-[10px]">Publicador</Badge>
            </TabsTrigger>
          </TabsList>

          {permissaoAtiva && (
            <TabsContent value={perfilAtivo} className="space-y-6">
              {Object.entries(FUNCIONALIDADES_INFO).map(([key, info]) => {
                const funcKey = key as keyof Funcionalidades
                const funcPermissoes = permissaoAtiva.funcionalidades[funcKey]
                
                return (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <h4 className="font-medium">{info.label}</h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{info.descricao}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {info.acoes.map(acao => (
                        <div key={acao} className="flex items-center space-x-2">
                          <Switch
                            id={`${key}-${acao}`}
                            checked={(funcPermissoes as Record<string, boolean>)[acao] || false}
                            onCheckedChange={(checked) => 
                              atualizarPermissao(perfilAtivo, funcKey, acao, checked)
                            }
                            disabled={perfilAtivo === "admin"}
                          />
                          <Label 
                            htmlFor={`${key}-${acao}`}
                            className="text-sm"
                          >
                            {ACOES_LABELS[acao]}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {perfilAtivo === "admin" && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  O perfil Administrador tem acesso total ao sistema e nao pode ser modificado.
                </p>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
