"use client"

import { useState, useEffect, useMemo } from "react"
import { CenteredLoader } from "@/components/ui/page-loader"
import { ArrowLeft, ArrowRight, Mic, Volume2, Users, Loader2, CalendarOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  microvolante_palco: 1 | 2 | null
  som_id: string | null
  som_nome: string | null
  sem_reuniao?: boolean
  motivo_sem_reuniao?: string | null
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
  { value: "2026-01", label: "Janeiro 2026" },
  { value: "2026-02", label: "Fevereiro 2026" },
  { value: "2026-03", label: "Março 2026" },
  { value: "2026-04", label: "Abril 2026" },
  { value: "2026-05", label: "Maio 2026" },
  { value: "2026-06", label: "Junho 2026" },
  { value: "2026-07", label: "Julho 2026" },
  { value: "2026-08", label: "Agosto 2026" },
  { value: "2026-09", label: "Setembro 2026" },
  { value: "2026-10", label: "Outubro 2026" },
  { value: "2026-11", label: "Novembro 2026" },
  { value: "2026-12", label: "Dezembro 2026" },
]

// Calcular índice do mês atual baseado na data do sistema
function calcularIndiceMesAtual(): number {
  const agora = new Date()
  const mesAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}`
  const indice = mesesDisponiveis.findIndex(m => m.value === mesAtual)
  return indice >= 0 ? indice : 0
}

export default function EquipeTecnicaPage() {
  const [mesAtualIndex, setMesAtualIndex] = useState(() => calcularIndiceMesAtual())
  const [designacoes, setDesignacoes] = useState<Record<string, EquipeTecnica>>({})
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState<string | null>(null)
  const [motivosLocais, setMotivosLocais] = useState<Record<string, string>>({})
  
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
  
  // Salvar campos genéricos (ex: sem_reuniao / motivo_sem_reuniao)
  async function salvarCampos(
    reuniao: { data: string; dia_semana: string },
    campos: Partial<EquipeTecnica>
  ) {
    const chave = `${reuniao.data}-${reuniao.dia_semana}`
    setSalvando(chave)

    const designacaoExistente = designacoes[chave]

    const novaDesignacao: EquipeTecnica = {
      ...designacaoExistente,
      mes: mesAtual.value,
      data: reuniao.data,
      dia_semana: reuniao.dia_semana,
      ...campos,
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
        setDesignacoes(prev => ({ ...prev, [chave]: data }))
        toast.success("Salvo")
      } else {
        toast.error("Erro ao salvar")
      }
    } catch {
      toast.error("Erro ao salvar")
    } finally {
      setSalvando(null)
    }
  }

  // Salvar qual microfone volante cuida do palco
  async function salvarPalco(
    reuniao: { data: string; dia_semana: string },
    numero: 1 | 2,
    marcado: boolean
  ) {
    const chave = `${reuniao.data}-${reuniao.dia_semana}`
    const designacaoExistente = designacoes[chave]
    const valorAtual = designacaoExistente?.microvolante_palco ?? null
    // Se já está marcado e clicou de novo, desmarca (toggle)
    const novoValor: 1 | 2 | null = marcado ? numero : (valorAtual === numero ? null : numero)

    const novaDesignacao: EquipeTecnica = {
      ...designacaoExistente,
      mes: mesAtual.value,
      data: reuniao.data,
      dia_semana: reuniao.dia_semana,
      microvolante_palco: novoValor,
    }

    setSalvando(chave)
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
        setDesignacoes(prev => ({ ...prev, [chave]: data }))
        toast.success(novoValor ? `Microfone ${novoValor} marcado como Palco` : "Palco desmarcado")
      } else {
        toast.error("Erro ao salvar")
      }
    } catch {
      toast.error("Erro ao salvar")
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

  if (loading) return <CenteredLoader />

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
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Buscando informações...</p>
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
                  {/* Não haverá reunião */}
                  <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/40">
                    <Checkbox
                      id={`sem-reuniao-${chave}`}
                      checked={!!designacao.sem_reuniao}
                      onCheckedChange={(checked) =>
                        salvarCampos(reuniao, { sem_reuniao: checked === true })
                      }
                      disabled={salvando === chave}
                      className="border-amber-500 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                    />
                    <Label
                      htmlFor={`sem-reuniao-${chave}`}
                      className="flex items-center gap-2 text-sm font-medium text-amber-700 cursor-pointer select-none dark:text-amber-400"
                    >
                      <CalendarOff className="h-4 w-4" />
                      Não haverá reunião neste dia
                    </Label>
                  </div>

                  {designacao.sem_reuniao ? (
                    /* Motivo (linha inteira) */
                    <div className="space-y-2">
                      <Label htmlFor={`motivo-${chave}`} className="text-sm font-medium text-foreground">
                        Motivo
                      </Label>
                      <Textarea
                        id={`motivo-${chave}`}
                        value={motivosLocais[chave] ?? designacao.motivo_sem_reuniao ?? ""}
                        onChange={(e) =>
                          setMotivosLocais((prev) => ({ ...prev, [chave]: e.target.value }))
                        }
                        onBlur={() =>
                          salvarCampos(reuniao, {
                            motivo_sem_reuniao: motivosLocais[chave] ?? designacao.motivo_sem_reuniao ?? "",
                          })
                        }
                        placeholder="Ex: Assembleia de Circuito, Congresso Regional, Celebração da Morte de Cristo..."
                        className="min-h-[80px]"
                        disabled={salvando === chave}
                      />
                    </div>
                  ) : (
                  <>
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
                  
                  {/* Microfone Volante */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Mic className="h-4 w-4 text-purple-500" />
                      Microfone Volante
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Microfone Volante 1 */}
                      <div className="space-y-2">
                        <SeletorPublicador
                          value={designacao.microvolante1_id || undefined}
                          onSelect={(p) => salvarDesignacao(reuniao, "microvolante1", p)}
                          filtro="todos"
                          placeholder="Microfone Volante 1"
                          disabled={salvando === chave}
                        />
                        <div className="flex items-center gap-2 pl-1">
                          <Checkbox
                            id={`palco-1-${chave}`}
                            checked={designacao.microvolante_palco === 1}
                            onCheckedChange={(checked) =>
                              salvarPalco(reuniao, 1, !!checked)
                            }
                            disabled={salvando === chave || !designacao.microvolante1_id}
                            className="border-purple-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                          <Label
                            htmlFor={`palco-1-${chave}`}
                            className="text-xs text-muted-foreground cursor-pointer select-none"
                          >
                            Palco
                          </Label>
                        </div>
                      </div>

                      {/* Microfone Volante 2 */}
                      <div className="space-y-2">
                        <SeletorPublicador
                          value={designacao.microvolante2_id || undefined}
                          onSelect={(p) => salvarDesignacao(reuniao, "microvolante2", p)}
                          filtro="todos"
                          placeholder="Microfone Volante 2"
                          disabled={salvando === chave}
                        />
                        <div className="flex items-center gap-2 pl-1">
                          <Checkbox
                            id={`palco-2-${chave}`}
                            checked={designacao.microvolante_palco === 2}
                            onCheckedChange={(checked) =>
                              salvarPalco(reuniao, 2, !!checked)
                            }
                            disabled={salvando === chave || !designacao.microvolante2_id}
                            className="border-purple-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                          <Label
                            htmlFor={`palco-2-${chave}`}
                            className="text-xs text-muted-foreground cursor-pointer select-none"
                          >
                            Palco
                          </Label>
                        </div>
                      </div>
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
                  </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
