"use client"

import { useState, useEffect } from "react"
import { Activity, Filter, RefreshCw, ChevronDown, Clock, User, Database, Edit, Trash2, Plus, LogIn, LogOut } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { getActivityLogs, getActivityStats, type AcaoLog } from "@/lib/services/activity-logger"
import { format, formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface LogAtividade {
  id: string
  tabela: string
  registro_id: string | null
  acao: AcaoLog
  dados_antes: Record<string, unknown> | null
  dados_depois: Record<string, unknown> | null
  perfil: string | null
  usuario_email: string | null
  usuario_nome: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

const acaoConfig: Record<AcaoLog, { icon: typeof Plus; color: string; label: string }> = {
  criar: { icon: Plus, color: "text-green-400", label: "Criação" },
  editar: { icon: Edit, color: "text-blue-400", label: "Edição" },
  excluir: { icon: Trash2, color: "text-red-400", label: "Exclusão" },
  login: { icon: LogIn, color: "text-amber-400", label: "Login" },
  logout: { icon: LogOut, color: "text-zinc-400", label: "Logout" },
  outro: { icon: Activity, color: "text-purple-400", label: "Outro" },
}

const tabelaLabels: Record<string, string> = {
  publicadores: "Publicadores",
  equipe_tecnica: "Equipe Técnica",
  vida_ministerio_semanas: "Vida e Ministério",
  vida_ministerio_designacoes: "Designações V&M",
  sentinela_estudos: "Sentinela",
  discursos_publicos: "Discursos",
  limpeza_salao: "Limpeza",
  servico_campo_semana: "Serviço de Campo",
  grupos: "Grupos",
  usuarios: "Usuários",
  configuracoes: "Configurações",
}

interface LogAtividadesProps {
  className?: string
  limite?: number
  compacto?: boolean
}

export function LogAtividades({ className, limite = 20, compacto = false }: LogAtividadesProps) {
  const [logs, setLogs] = useState<LogAtividade[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtroAcao, setFiltroAcao] = useState<string>("todas")
  const [filtroTabela, setFiltroTabela] = useState<string>("todas")
  const [paginaAtual, setPaginaAtual] = useState(0)
  
  useEffect(() => {
    carregarLogs()
  }, [filtroAcao, filtroTabela, paginaAtual])
  
  const carregarLogs = async () => {
    setCarregando(true)
    try {
      const data = await getActivityLogs({
        acao: filtroAcao !== "todas" ? filtroAcao as AcaoLog : undefined,
        tabela: filtroTabela !== "todas" ? filtroTabela : undefined,
        limite,
        offset: paginaAtual * limite
      })
      setLogs(data as LogAtividade[])
    } catch (error) {
      console.error("Erro ao carregar logs:", error)
    } finally {
      setCarregando(false)
    }
  }
  
  const atualizar = () => {
    setPaginaAtual(0)
    carregarLogs()
  }
  
  if (carregando && logs.length === 0) {
    return (
      <Card className={cn("border-zinc-800 bg-zinc-900/50", className)}>
        <CardContent className="p-6">
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 bg-zinc-700 rounded" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-zinc-700 rounded" />
                  <div className="h-3 w-1/2 bg-zinc-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className={cn("border-zinc-800 bg-zinc-900/50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-5 w-5 text-primary" />
            Log de Atividades
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={atualizar} disabled={carregando}>
              <RefreshCw className={cn("h-4 w-4 text-zinc-500", carregando && "animate-spin")} />
            </Button>
          </div>
        </div>
        
        {!compacto && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Select value={filtroAcao} onValueChange={setFiltroAcao}>
              <SelectTrigger className="w-[130px] h-8 text-xs bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas ações</SelectItem>
                <SelectItem value="criar">Criação</SelectItem>
                <SelectItem value="editar">Edição</SelectItem>
                <SelectItem value="excluir">Exclusão</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filtroTabela} onValueChange={setFiltroTabela}>
              <SelectTrigger className="w-[150px] h-8 text-xs bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Tabela" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas tabelas</SelectItem>
                {Object.entries(tabelaLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-2">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <Activity className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nenhuma atividade registrada</p>
          </div>
        ) : (
          <>
            <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
              {logs.map((log) => {
                const config = acaoConfig[log.acao]
                const Icon = config.icon
                
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className={cn("p-1.5 rounded", 
                      log.acao === 'criar' && "bg-green-600/20",
                      log.acao === 'editar' && "bg-blue-600/20",
                      log.acao === 'excluir' && "bg-red-600/20",
                      log.acao === 'login' && "bg-amber-600/20",
                      log.acao === 'logout' && "bg-zinc-600/20",
                      log.acao === 'outro' && "bg-purple-600/20",
                    )}>
                      <Icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={cn("text-xs", config.color)}>
                          {config.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {tabelaLabels[log.tabela] || log.tabela}
                        </Badge>
                        {log.perfil && (
                          <Badge variant="outline" className="text-xs text-zinc-400">
                            {log.perfil}
                          </Badge>
                        )}
                      </div>
                      
                      {log.usuario_nome && (
                        <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.usuario_nome}
                        </p>
                      )}
                      
                      <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Paginação */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <Button
                variant="ghost"
                size="sm"
                disabled={paginaAtual === 0}
                onClick={() => setPaginaAtual(p => p - 1)}
              >
                Anterior
              </Button>
              <span className="text-xs text-zinc-500">Página {paginaAtual + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                disabled={logs.length < limite}
                onClick={() => setPaginaAtual(p => p + 1)}
              >
                Próxima
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Componente de estatísticas de atividades
export function AtividadesStats({ className }: { className?: string }) {
  const [stats, setStats] = useState<{
    totalAcoes: number
    porAcao: Record<string, number>
    porTabela: Record<string, number>
    porDia: Record<string, number>
  } | null>(null)
  const [carregando, setCarregando] = useState(true)
  
  useEffect(() => {
    async function carregar() {
      try {
        const data = await getActivityStats()
        setStats(data)
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])
  
  if (carregando || !stats) {
    return (
      <Card className={cn("border-zinc-800 bg-zinc-900/50", className)}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-40 bg-zinc-700 rounded" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-zinc-700 rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className={cn("border-zinc-800 bg-zinc-900/50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Resumo de Atividades (30 dias)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-zinc-800/50">
            <p className="text-2xl font-bold text-white">{stats.totalAcoes}</p>
            <p className="text-xs text-zinc-500">Total de ações</p>
          </div>
          <div className="p-3 rounded-lg bg-green-600/10">
            <p className="text-2xl font-bold text-green-400">{stats.porAcao['criar'] || 0}</p>
            <p className="text-xs text-zinc-500">Criações</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-600/10">
            <p className="text-2xl font-bold text-blue-400">{stats.porAcao['editar'] || 0}</p>
            <p className="text-xs text-zinc-500">Edições</p>
          </div>
          <div className="p-3 rounded-lg bg-red-600/10">
            <p className="text-2xl font-bold text-red-400">{stats.porAcao['excluir'] || 0}</p>
            <p className="text-xs text-zinc-500">Exclusões</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
