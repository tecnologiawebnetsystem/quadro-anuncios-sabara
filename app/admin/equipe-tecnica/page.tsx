"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, ArrowRight, Mic, Volume2, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SeletorPublicador, type Publicador } from "@/components/reuniao/seletor-publicador"
import { toast } from "sonner"

interface EquipeTecnica {
  id?: string
  mes: string
  data: string
  dia_semana: string
  indicador1_id: string | null
  indicador1_nome: string | null
  indicador2_id: string | null
  indicador2_nome: string | null
  microvolante1_id: string | null
  microvolante1_nome: string | null
  microvolante2_id: string | null
  microvolante2_nome: string | null
  som_id: string | null
  som_nome: string | null
}

// Gerar datas das reuniões para um mês específico
function gerarReunioesDoMes(ano: number, mes: number): { data: string; dia_semana: "quinta" | "domingo" }[] {
  const reunioes: { data: string; dia_semana: "quinta" | "domingo" }[] = []
  const primeiroDia = new Date(ano, mes, 1)
  const ultimoDia = new Date(ano, mes + 1, 0)
  
  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    const data = new Date(ano, mes, dia)
    const diaSemana = data.getDay()
    
    // Quinta-feira = 4, Domingo = 0
    if (diaSemana === 4) {
      reunioes.push({
        data: data.toISOString().split("T")[0],
        dia_semana: "quinta"
      })
    } else if (diaSemana === 0) {
      reunioes.push({
        data: data.toISOString().split("T")[0],
        dia_semana: "domingo"
      })
    }
  }
  
  return reunioes
}

// Formatar data para exibição
function formatarData(dataStr: string): string {
  const data = new Date(dataStr + "T12:00:00")
  return data.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })
}

// Lista de meses disponíveis
const mesesDisponiveis = [
  { value: "2026-03", label: "Março 2026" },
  { value: "2026-04", label: "Abril 2026" },
  { value: "2026-05", label: "Maio 2026" },
  { value: "2026-06", label: "Junho 2026" },
]

export default function EquipeTecnicaPage() {
  const [mesAtualIndex, setMesAtualIndex] = useState(0)
  const [designacoes, setDesignacoes] = useState<Record<string, EquipeTecnica>>({})
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState<string | null>(null)
  
  const mesAtual = mesesDisponiveis[mesAtualIndex]
  
  // Gerar reuniões do mês
  const reunioesMes = useMemo(() => {
    const [ano, mes] = mesAtual.value.split("-").map(Number)
    return gerarReunioesDoMes(ano, mes - 1)
  }, [mesAtual])
  
  // Carregar designações do mês
  useEffect(() => {
    async function carregarDesignacoes() {
      setLoading(true)
      try {
        const response = await fetch(`/api/equipe-tecnica?mes=${mesAtual.value}`)
        if (response.ok) {
          const data: EquipeTecnica[] = await response.json()
          const designacoesMap: Record<string, EquipeTecnica> = {}
          data.forEach(d => {
            designacoesMap[`${d.data}-${d.dia_semana}`] = d
          })
          setDesignacoes(designacoesMap)
        }
      } catch (error) {
        console.error("Erro ao carregar designações:", error)
      } finally {
        setLoading(false)
      }
    }
    
    carregarDesignacoes()
  }, [mesAtual])
  
  // Salvar designação
  async function salvarDesignacao(
    reuniao: { data: string; dia_semana: string },
    campo: string,
    publicador: Publicador | null
  ) {
    const chave = `${reuniao.data}-${reuniao.dia_semana}`
    setSalvando(chave)
    
    const designacaoExistente = designacoes[chave]
    
    const novaDesignacao: EquipeTecnica = {
      ...designacaoExistente,
      mes: mesAtual.value,
      data: reuniao.data,
      dia_semana: reuniao.dia_semana,
      [`${campo}_id`]: publicador?.id || null,
      [`${campo}_nome`]: publicador?.nome || null,
    }
    
    try {
      const method = designacaoExistente?.id ? "PUT" : "POST"
      const body = designacaoExistente?.id 
        ? { id: designacaoExistente.id, ...novaDesignacao }
        : novaDesignacao
      
      const response = await fetch("/api/equipe-tecnica", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      
      if (response.ok) {
        const data = await response.json()
        setDesignacoes(prev => ({
          ...prev,
          [chave]: data
        }))
        toast.success("Designação salva")
      } else {
        toast.error("Erro ao salvar designação")
      }
    } catch (error) {
      toast.error("Erro ao salvar designação")
    } finally {
      setSalvando(null)
    }
  }
  
  // Navegação entre meses
  const irParaMesAnterior = () => {
    if (mesAtualIndex > 0) {
      setMesAtualIndex(mesAtualIndex - 1)
    }
  }
  
  const irParaProximoMes = () => {
    if (mesAtualIndex < mesesDisponiveis.length - 1) {
      setMesAtualIndex(mesAtualIndex + 1)
    }
  }

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      {/* Navegação do Mês */}
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={irParaMesAnterior}
          disabled={mesAtualIndex === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-600 transition-all hover:bg-green-100 hover:border-green-300 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-green-50 dark:border-green-800 dark:bg-green-950 dark:hover:bg-green-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div className="text-center min-w-[200px]">
          <h1 className="text-2xl font-bold text-foreground">Equipe Técnica</h1>
          <p className="text-lg font-medium text-muted-foreground mt-1">
            {mesAtual.label}
          </p>
        </div>
        
        <button
          onClick={irParaProximoMes}
          disabled={mesAtualIndex === mesesDisponiveis.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-600 transition-all hover:bg-green-100 hover:border-green-300 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-green-50 dark:border-green-800 dark:bg-green-950 dark:hover:bg-green-900"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      
      {/* Lista de Reuniões */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-6">
          {reunioesMes.map((reuniao) => {
            const chave = `${reuniao.data}-${reuniao.dia_semana}`
            const designacao = designacoes[chave] || {}
            const isQuinta = reuniao.dia_semana === "quinta"
            
            return (
              <Card key={chave} className="border-0 bg-card/50 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      isQuinta 
                        ? "bg-gradient-to-br from-blue-500 to-blue-700" 
                        : "bg-gradient-to-br from-orange-500 to-orange-700"
                    } shadow-lg`}>
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {isQuinta ? "Quinta-feira" : "Domingo"}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {formatarData(reuniao.data)} {isQuinta ? "· 19h30" : "· 9h00"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Indicadores */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Users className="h-4 w-4 text-blue-500" />
                      Indicadores
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <SeletorPublicador
                        value={designacao.indicador1_id || undefined}
                        onSelect={(p) => salvarDesignacao(reuniao, "indicador1", p)}
                        filtro="todos"
                        placeholder="Indicador 1"
                        disabled={salvando === chave}
                      />
                      <SeletorPublicador
                        value={designacao.indicador2_id || undefined}
                        onSelect={(p) => salvarDesignacao(reuniao, "indicador2", p)}
                        filtro="todos"
                        placeholder="Indicador 2"
                        disabled={salvando === chave}
                      />
                    </div>
                  </div>
                  
                  {/* Micro-volante */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Mic className="h-4 w-4 text-purple-500" />
                      Micro-volante
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <SeletorPublicador
                        value={designacao.microvolante1_id || undefined}
                        onSelect={(p) => salvarDesignacao(reuniao, "microvolante1", p)}
                        filtro="todos"
                        placeholder="Micro-volante 1"
                        disabled={salvando === chave}
                      />
                      <SeletorPublicador
                        value={designacao.microvolante2_id || undefined}
                        onSelect={(p) => salvarDesignacao(reuniao, "microvolante2", p)}
                        filtro="todos"
                        placeholder="Micro-volante 2"
                        disabled={salvando === chave}
                      />
                    </div>
                  </div>
                  
                  {/* Som */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Volume2 className="h-4 w-4 text-green-500" />
                      Som
                    </div>
                    <div className="max-w-xs">
                      <SeletorPublicador
                        value={designacao.som_id || undefined}
                        onSelect={(p) => salvarDesignacao(reuniao, "som", p)}
                        filtro="todos"
                        placeholder="Operador de som"
                        disabled={salvando === chave}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
