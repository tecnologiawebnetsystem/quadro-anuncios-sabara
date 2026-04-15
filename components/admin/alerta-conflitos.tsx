"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Users, Calendar, ChevronRight, X, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { verificarConflitosNoMes, type Conflito } from "@/lib/services/verificar-conflitos"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface AlertaConflitosProps {
  mes?: string
  className?: string
  onVerDetalhes?: (conflito: Conflito) => void
}

export function AlertaConflitos({ mes, className, onVerDetalhes }: AlertaConflitosProps) {
  const [conflitos, setConflitos] = useState<Conflito[]>([])
  const [carregando, setCarregando] = useState(true)
  const [expandido, setExpandido] = useState(false)
  
  const mesAtual = mes || format(new Date(), "yyyy-MM")
  
  useEffect(() => {
    async function verificar() {
      setCarregando(true)
      try {
        const resultados = await verificarConflitosNoMes(mesAtual)
        setConflitos(resultados)
      } catch (error) {
        console.error("Erro ao verificar conflitos:", error)
      } finally {
        setCarregando(false)
      }
    }
    verificar()
  }, [mesAtual])
  
  const atualizar = async () => {
    setCarregando(true)
    try {
      const resultados = await verificarConflitosNoMes(mesAtual)
      setConflitos(resultados)
    } catch (error) {
      console.error("Erro ao verificar conflitos:", error)
    } finally {
      setCarregando(false)
    }
  }
  
  if (carregando) {
    return (
      <Card className={cn("border-zinc-800 bg-zinc-900/50", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="h-10 w-10 bg-zinc-700 rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-zinc-700 rounded" />
              <div className="h-3 w-24 bg-zinc-700 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (conflitos.length === 0) {
    return (
      <Card className={cn("border-zinc-800 bg-zinc-900/50 border-green-600/20", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-600/20">
                <Users className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="font-medium text-green-400">Sem conflitos</p>
                <p className="text-xs text-zinc-500">
                  Nenhum publicador com múltiplas designações
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={atualizar}>
              <RefreshCw className="h-4 w-4 text-zinc-500" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className={cn("border-zinc-800 bg-zinc-900/50 border-amber-600/30", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Conflitos de Designação
            <Badge className="bg-amber-600/20 text-amber-400 ml-2">
              {conflitos.length}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={atualizar}>
              <RefreshCw className="h-4 w-4 text-zinc-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setExpandido(!expandido)}
              className="text-xs"
            >
              {expandido ? "Recolher" : "Expandir"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Lista resumida ou expandida */}
        <div className={cn("space-y-2", expandido ? "" : "max-h-48 overflow-hidden")}>
          {conflitos.slice(0, expandido ? undefined : 3).map((conflito) => (
            <div
              key={conflito.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-amber-600/20 bg-amber-600/5 hover:bg-amber-600/10 transition-colors cursor-pointer"
              onClick={() => onVerDetalhes?.(conflito)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white text-sm">{conflito.publicador_nome}</p>
                  <Badge variant="outline" className="text-xs text-amber-400">
                    {conflito.funcoes.length} funções
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  {format(new Date(conflito.data), "EEEE, d 'de' MMMM", { locale: ptBR })}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {conflito.funcoes.map((f, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {f.funcao}
                    </Badge>
                  ))}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-500 flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>
        
        {!expandido && conflitos.length > 3 && (
          <Button 
            variant="ghost" 
            className="w-full text-xs text-amber-400 hover:text-amber-300"
            onClick={() => setExpandido(true)}
          >
            Ver mais {conflitos.length - 3} conflito{conflitos.length - 3 !== 1 ? "s" : ""}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Componente de modal para detalhes do conflito
export function ModalConflitoDetalhes({ 
  conflito, 
  aberto, 
  onFechar 
}: { 
  conflito: Conflito | null
  aberto: boolean
  onFechar: () => void 
}) {
  if (!conflito || !aberto) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold text-white">Conflito Detectado</h3>
          </div>
          <button onClick={onFechar} className="text-zinc-500 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-zinc-400">Publicador</p>
            <p className="text-lg font-medium text-white">{conflito.publicador_nome}</p>
          </div>
          
          <div>
            <p className="text-sm text-zinc-400">Data</p>
            <p className="text-white">
              {format(new Date(conflito.data), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-zinc-400 mb-2">Designações no mesmo dia</p>
            <div className="space-y-2">
              {conflito.funcoes.map((f, i) => (
                <div key={i} className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{f.funcao}</p>
                    <Badge variant="outline" className="text-xs">{f.tipo}</Badge>
                  </div>
                  {f.detalhes && (
                    <p className="text-xs text-zinc-500 mt-1">{f.detalhes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-zinc-800">
            <p className="text-xs text-amber-400/80">
              Considere reorganizar as designações para evitar sobrecarga do publicador.
            </p>
          </div>
        </div>
        
        <Button className="w-full mt-4" onClick={onFechar}>
          Entendi
        </Button>
      </div>
    </div>
  )
}
