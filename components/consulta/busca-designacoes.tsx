"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Calendar, Wrench, BookOpen, MapPin, Mic, Sparkles, User, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { buscarDesignacoesPorNome, getPublicadoresParaBusca, type DesignacaoEncontrada } from "@/lib/services/busca-designacoes"

const tipoConfig: Record<DesignacaoEncontrada['tipo'], { icon: typeof Calendar; color: string; bgColor: string; label: string }> = {
  equipe_tecnica: { icon: Wrench, color: "text-orange-400", bgColor: "bg-orange-600/20", label: "Equipe Técnica" },
  vida_ministerio: { icon: BookOpen, color: "text-blue-400", bgColor: "bg-blue-600/20", label: "Vida e Ministério" },
  limpeza: { icon: Sparkles, color: "text-cyan-400", bgColor: "bg-cyan-600/20", label: "Limpeza" },
  campo: { icon: MapPin, color: "text-green-400", bgColor: "bg-green-600/20", label: "Serviço de Campo" },
  discurso: { icon: Mic, color: "text-amber-400", bgColor: "bg-amber-600/20", label: "Discurso Público" },
  sentinela: { icon: Calendar, color: "text-red-400", bgColor: "bg-red-600/20", label: "Sentinela" },
}

interface BuscaDesignacoesProps {
  className?: string
}

export function BuscaDesignacoes({ className }: BuscaDesignacoesProps) {
  const [busca, setBusca] = useState("")
  const [resultados, setResultados] = useState<DesignacaoEncontrada[]>([])
  const [carregando, setCarregando] = useState(false)
  const [sugestoes, setSugestoes] = useState<string[]>([])
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)
  const [publicadores, setPublicadores] = useState<string[]>([])
  const [buscaRealizada, setBuscaRealizada] = useState(false)
  
  // Carregar lista de publicadores para autocomplete
  useEffect(() => {
    getPublicadoresParaBusca().then(setPublicadores)
  }, [])
  
  // Filtrar sugestões baseado na busca
  useEffect(() => {
    if (busca.length >= 2) {
      const filtradas = publicadores
        .filter(p => p.toLowerCase().includes(busca.toLowerCase()))
        .slice(0, 5)
      setSugestoes(filtradas)
      setMostrarSugestoes(filtradas.length > 0)
    } else {
      setSugestoes([])
      setMostrarSugestoes(false)
    }
  }, [busca, publicadores])
  
  const realizarBusca = useCallback(async (nome: string) => {
    if (nome.length < 2) return
    
    setCarregando(true)
    setBuscaRealizada(true)
    setMostrarSugestoes(false)
    
    try {
      const resultados = await buscarDesignacoesPorNome(nome)
      setResultados(resultados)
    } catch (error) {
      console.error("Erro na busca:", error)
      setResultados([])
    } finally {
      setCarregando(false)
    }
  }, [])
  
  const selecionarSugestao = (nome: string) => {
    setBusca(nome)
    setMostrarSugestoes(false)
    realizarBusca(nome)
  }
  
  const limparBusca = () => {
    setBusca("")
    setResultados([])
    setBuscaRealizada(false)
    setMostrarSugestoes(false)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      realizarBusca(busca)
    }
  }
  
  return (
    <Card className={cn("border-zinc-800 bg-zinc-900/50", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-primary" />
          Minhas Designações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campo de busca */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Digite seu nome para buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-10 bg-zinc-800/50 border-zinc-700"
            />
            {busca && (
              <button
                onClick={limparBusca}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Dropdown de sugestões */}
          {mostrarSugestoes && (
            <div className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg">
              {sugestoes.map((nome) => (
                <button
                  key={nome}
                  onClick={() => selecionarSugestao(nome)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 transition-colors first:rounded-t-md last:rounded-b-md"
                >
                  {nome}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Botão de busca */}
        <Button
          onClick={() => realizarBusca(busca)}
          disabled={busca.length < 2 || carregando}
          className="w-full"
        >
          {carregando ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Buscar Designações
            </>
          )}
        </Button>
        
        {/* Resultados */}
        {buscaRealizada && !carregando && (
          <div className="space-y-3">
            {resultados.length === 0 ? (
              <div className="text-center py-6 text-zinc-500">
                <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Nenhuma designação encontrada</p>
                <p className="text-xs mt-1">Verifique se o nome está correto</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-400">
                    {resultados.length} designação{resultados.length !== 1 ? "ões" : ""} encontrada{resultados.length !== 1 ? "s" : ""}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Próximas
                  </Badge>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
                  {resultados.map((designacao) => {
                    const config = tipoConfig[designacao.tipo]
                    const Icon = config.icon
                    
                    return (
                      <div
                        key={designacao.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className={cn("p-2 rounded-lg", config.bgColor)}>
                          <Icon className={cn("h-4 w-4", config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-white text-sm">{designacao.funcao}</p>
                            <Badge variant="outline" className={cn("text-xs", config.color)}>
                              {config.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 capitalize">
                            {designacao.dataFormatada}
                          </p>
                          {designacao.detalhes && (
                            <p className="text-xs text-zinc-500 mt-1 truncate">
                              {designacao.detalhes}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
