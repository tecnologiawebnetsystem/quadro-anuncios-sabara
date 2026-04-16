"use client"

import { useState, useEffect } from "react"
import { History, User, Calendar, TrendingUp, TrendingDown, Minus, Search, Filter, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { 
  getRelatorioEquilibrio, 
  getHistoricoPublicador,
  formatarDataDesignacao,
  type HistoricoDesignacao,
  type DesignacaoDetalhada
} from "@/lib/services/historico-designacoes"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface HistoricoDesignacoesProps {
  className?: string
}

export function HistoricoDesignacoesRelatorio({ className }: HistoricoDesignacoesProps) {
  const [relatorio, setRelatorio] = useState<HistoricoDesignacao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [meses, setMeses] = useState("6")
  const [busca, setBusca] = useState("")
  const [ordenacao, setOrdenacao] = useState<"menos" | "mais" | "nome">("menos")
  
  useEffect(() => {
    carregarRelatorio()
  }, [meses])
  
  const carregarRelatorio = async () => {
    setCarregando(true)
    try {
      const dados = await getRelatorioEquilibrio(parseInt(meses))
      setRelatorio(dados)
    } catch (error) {
      console.error("Erro ao carregar relatório:", error)
    } finally {
      setCarregando(false)
    }
  }
  
  // Filtrar e ordenar
  const dadosFiltrados = relatorio
    .filter(r => r.publicador_nome.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => {
      if (ordenacao === "nome") return a.publicador_nome.localeCompare(b.publicador_nome)
      if (ordenacao === "mais") return b.total_designacoes - a.total_designacoes
      return a.total_designacoes - b.total_designacoes
    })
  
  // Calcular media
  const media = relatorio.length > 0 
    ? Math.round(relatorio.reduce((acc, r) => acc + r.total_designacoes, 0) / relatorio.length)
    : 0
  
  const maximo = Math.max(...relatorio.map(r => r.total_designacoes), 1)
  
  if (carregando) {
    return (
      <Card className={cn("border-zinc-800 bg-zinc-900/50", className)}>
        <CardContent className="p-6">
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-48 bg-zinc-700 rounded" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 bg-zinc-700 rounded" />
                <div className="flex-1 h-4 bg-zinc-700 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className={cn("border-zinc-800 bg-zinc-900/50", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Equilibrio de Designacoes
        </CardTitle>
        <CardDescription>
          Analise a distribuicao de designacoes entre os publicadores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Buscar publicador..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 bg-zinc-800/50 border-zinc-700"
            />
          </div>
          
          <Select value={meses} onValueChange={setMeses}>
            <SelectTrigger className="w-[140px] bg-zinc-800/50 border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Ultimos 3 meses</SelectItem>
              <SelectItem value="6">Ultimos 6 meses</SelectItem>
              <SelectItem value="12">Ultimo ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={ordenacao} onValueChange={(v) => setOrdenacao(v as typeof ordenacao)}>
            <SelectTrigger className="w-[160px] bg-zinc-800/50 border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="menos">Menos designacoes</SelectItem>
              <SelectItem value="mais">Mais designacoes</SelectItem>
              <SelectItem value="nome">Por nome</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Resumo */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-zinc-800/50 text-center">
            <p className="text-2xl font-bold text-white">{relatorio.length}</p>
            <p className="text-xs text-zinc-500">Publicadores</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-800/50 text-center">
            <p className="text-2xl font-bold text-blue-400">{media}</p>
            <p className="text-xs text-zinc-500">Media</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-800/50 text-center">
            <p className="text-2xl font-bold text-green-400">{maximo}</p>
            <p className="text-xs text-zinc-500">Maximo</p>
          </div>
        </div>
        
        {/* Lista */}
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
          {dadosFiltrados.map((item) => {
            const percentual = (item.total_designacoes / maximo) * 100
            const abaixoMedia = item.total_designacoes < media * 0.7
            const acimaMedia = item.total_designacoes > media * 1.3
            
            return (
              <div
                key={item.publicador_id}
                className="p-3 rounded-lg border border-zinc-800 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-zinc-500" />
                    <span className="font-medium text-white text-sm">{item.publicador_nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {abaixoMedia && (
                      <Badge variant="outline" className="text-xs text-amber-400 border-amber-600/30">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Pouco utilizado
                      </Badge>
                    )}
                    {acimaMedia && (
                      <Badge variant="outline" className="text-xs text-green-400 border-green-600/30">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Muito ativo
                      </Badge>
                    )}
                    <span className="text-lg font-bold text-white">{item.total_designacoes}</span>
                  </div>
                </div>
                
                <Progress 
                  value={percentual} 
                  className={cn(
                    "h-2",
                    abaixoMedia && "[&>div]:bg-amber-500",
                    acimaMedia && "[&>div]:bg-green-500",
                    !abaixoMedia && !acimaMedia && "[&>div]:bg-blue-500"
                  )}
                />
                
                {item.ultima_designacao && (
                  <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Ultima: {formatarDataDesignacao(item.ultima_designacao)}
                  </p>
                )}
              </div>
            )
          })}
        </div>
        
        {dadosFiltrados.length === 0 && (
          <div className="text-center py-8 text-zinc-500">
            <History className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nenhum publicador encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Componente para ver histórico detalhado de um publicador
interface HistoricoPublicadorProps {
  publicadorId: string
  publicadorNome: string
  className?: string
}

export function HistoricoPublicadorDetalhado({ publicadorId, publicadorNome, className }: HistoricoPublicadorProps) {
  const [designacoes, setDesignacoes] = useState<DesignacaoDetalhada[]>([])
  const [carregando, setCarregando] = useState(true)
  const [meses, setMeses] = useState(6)
  
  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      try {
        const dados = await getHistoricoPublicador(publicadorId, meses)
        setDesignacoes(dados)
      } catch (error) {
        console.error("Erro ao carregar histórico:", error)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [publicadorId, meses])
  
  // Agrupar por tipo
  const porTipo: Record<string, number> = {}
  designacoes.forEach(d => {
    const key = d.tipo
    porTipo[key] = (porTipo[key] || 0) + 1
  })
  
  return (
    <Card className={cn("border-zinc-800 bg-zinc-900/50", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Historico: {publicadorNome}
        </CardTitle>
        <CardDescription>
          {designacoes.length} designacoes nos ultimos {meses} meses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resumo por tipo */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(porTipo).map(([tipo, qtd]) => (
            <Badge key={tipo} variant="outline" className="text-xs">
              {tipo}: {qtd}
            </Badge>
          ))}
        </div>
        
        {/* Timeline */}
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
          {carregando ? (
            <div className="animate-pulse space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-zinc-700 rounded" />
              ))}
            </div>
          ) : designacoes.length === 0 ? (
            <p className="text-center text-zinc-500 py-4">Nenhuma designacao encontrada</p>
          ) : (
            designacoes.map((d, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-zinc-800/30">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{d.funcao}</p>
                  <p className="text-xs text-zinc-400">{d.tipo}</p>
                  {d.detalhes && (
                    <p className="text-xs text-zinc-500 truncate">{d.detalhes}</p>
                  )}
                </div>
                <span className="text-xs text-zinc-500 flex-shrink-0">
                  {format(new Date(d.data), "dd/MM/yy", { locale: ptBR })}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
