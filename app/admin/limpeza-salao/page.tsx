"use client"

import { useState, useEffect, useMemo } from "react"
import { CenteredLoader } from "@/components/ui/page-loader"
import { ChevronLeft, ChevronRight, Sparkles, Users, Calendar } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Grupo {
  id: string
  nome: string
}

interface LimpezaDesignacao {
  id?: string
  mes: string
  semana: number
  data_inicio: string
  data_fim: string
  grupo_id: string | null
  grupo_nome: string | null
  limpeza_semanal_grupo_id: string | null
  limpeza_semanal_grupo_nome: string | null
}

interface Semana {
  numero: number
  inicio: Date
  fim: Date
}

export default function LimpezaSalaoPage() {
  const [mesAtual, setMesAtual] = useState(new Date())
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [designacoes, setDesignacoes] = useState<LimpezaDesignacao[]>([])
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState<number | null>(null)
  const [salvandoSemanal, setSalvandoSemanal] = useState<number | null>(null)

  const mesFormatado = format(mesAtual, "yyyy-MM")
  const mesExibicao = format(mesAtual, "MMMM 'de' yyyy", { locale: ptBR })

  // Gerar semanas do mês
  const semanas = useMemo(() => {
    const inicio = startOfMonth(mesAtual)
    const fim = endOfMonth(mesAtual)
    const semanasDoMes: Semana[] = []

    let dataAtual = startOfWeek(inicio, { weekStartsOn: 0 }) // Domingo
    let numeroSemana = 1

    while (dataAtual <= fim) {
      const inicioSemana = dataAtual
      const fimSemana = endOfWeek(dataAtual, { weekStartsOn: 0 })

      // Só incluir semanas que tenham pelo menos um dia no mês
      if (fimSemana >= inicio && inicioSemana <= fim) {
        semanasDoMes.push({
          numero: numeroSemana,
          inicio: inicioSemana,
          fim: fimSemana,
        })
        numeroSemana++
      }

      dataAtual = addDays(fimSemana, 1)
    }

    return semanasDoMes
  }, [mesAtual])

  // Carregar grupos
  useEffect(() => {
    async function carregarGrupos() {
      try {
        const response = await fetch("/api/grupos")
        if (response.ok) {
          const data = await response.json()
          setGrupos(data)
        }
      } catch (error) {
        console.error("Erro ao carregar grupos:", error)
      }
    }
    carregarGrupos()
  }, [])

  // Carregar designações do mês
  useEffect(() => {
    async function carregarDesignacoes() {
      setLoading(true)
      try {
        const response = await fetch(`/api/limpeza-salao?mes=${mesFormatado}`)
        if (response.ok) {
          const data = await response.json()
          setDesignacoes(data)
        }
      } catch (error) {
        console.error("Erro ao carregar designações:", error)
      } finally {
        setLoading(false)
      }
    }
    carregarDesignacoes()
  }, [mesFormatado])

  const navegarMes = (direcao: "anterior" | "proximo") => {
    setMesAtual(prev =>
      direcao === "anterior" ? subMonths(prev, 1) : addMonths(prev, 1)
    )
  }

  const getDesignacao = (semana: number): LimpezaDesignacao | undefined => {
    return designacoes.find(d => d.semana === semana)
  }

  const salvarDesignacao = async (semana: Semana, grupoId: string) => {
    setSalvando(semana.numero)

    const grupo = grupos.find(g => g.id === grupoId)
    const designacaoAtual = getDesignacao(semana.numero)

    try {
      const response = await fetch("/api/limpeza-salao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mes: mesFormatado,
          semana: semana.numero,
          data_inicio: format(semana.inicio, "yyyy-MM-dd"),
          data_fim: format(semana.fim, "yyyy-MM-dd"),
          grupo_id: grupoId,
          grupo_nome: grupo?.nome || null,
          limpeza_semanal_grupo_id: designacaoAtual?.limpeza_semanal_grupo_id ?? null,
          limpeza_semanal_grupo_nome: designacaoAtual?.limpeza_semanal_grupo_nome ?? null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setDesignacoes(prev => {
          const index = prev.findIndex(d => d.semana === semana.numero)
          if (index >= 0) {
            const updated = [...prev]
            updated[index] = data
            return updated
          }
          return [...prev, data]
        })
      }
    } catch (error) {
      console.error("Erro ao salvar designação:", error)
    } finally {
      setSalvando(null)
    }
  }

  const salvarDesignacaoSemanal = async (semana: Semana, grupoId: string) => {
    setSalvandoSemanal(semana.numero)

    const grupo = grupos.find(g => g.id === grupoId)
    const designacaoAtual = getDesignacao(semana.numero)

    try {
      const response = await fetch("/api/limpeza-salao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mes: mesFormatado,
          semana: semana.numero,
          data_inicio: format(semana.inicio, "yyyy-MM-dd"),
          data_fim: format(semana.fim, "yyyy-MM-dd"),
          grupo_id: designacaoAtual?.grupo_id ?? null,
          grupo_nome: designacaoAtual?.grupo_nome ?? null,
          limpeza_semanal_grupo_id: grupoId,
          limpeza_semanal_grupo_nome: grupo?.nome || null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setDesignacoes(prev => {
          const index = prev.findIndex(d => d.semana === semana.numero)
          if (index >= 0) {
            const updated = [...prev]
            updated[index] = data
            return updated
          }
          return [...prev, data]
        })
        toast.success("Limpeza semanal salva com sucesso!")
      }
    } catch (error) {
      console.error("Erro ao salvar limpeza semanal:", error)
      toast.error("Erro ao salvar limpeza semanal.")
    } finally {
      setSalvandoSemanal(null)
    }
  }

  if (loading) return <CenteredLoader />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
            <Sparkles className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Limpeza do Salão</h1>
            <p className="text-sm text-muted-foreground">
              Designar grupos responsáveis pela limpeza semanal
            </p>
          </div>
        </div>
      </div>

      {/* Navega��ão do Mês */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navegarMes("anterior")}
              className="h-9 w-9"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <span className="text-lg font-semibold capitalize text-foreground">
                {mesExibicao}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => navegarMes("proximo")}
              className="h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Semanas */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {semanas.map((semana) => {
            const designacao = getDesignacao(semana.numero)
            const isSalvando = salvando === semana.numero

            return (
              <Card
                key={semana.numero}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-500 font-semibold text-sm">
                        {semana.numero}
                      </div>
                      <div>
                        <span className="text-base font-medium text-foreground">
                          Semana {semana.numero}
                        </span>
                        <p className="text-sm text-muted-foreground font-normal">
                          {format(semana.inicio, "dd/MM", { locale: ptBR })} a {format(semana.fim, "dd/MM", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {/* Limpeza do Salão */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Limpeza do Salão</p>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={designacao?.grupo_id || ""}
                        onValueChange={(value) => salvarDesignacao(semana, value)}
                        disabled={isSalvando}
                      >
                        <SelectTrigger className="flex-1 bg-background/50">
                          <SelectValue placeholder="Selecionar grupo responsável..." />
                        </SelectTrigger>
                        <SelectContent>
                          {grupos.map((grupo) => (
                            <SelectItem key={grupo.id} value={grupo.id}>
                              {grupo.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isSalvando && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                      )}
                    </div>
                  </div>

                  {/* Limpeza Semanal */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Limpeza Semanal</p>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={designacao?.limpeza_semanal_grupo_id || ""}
                        onValueChange={(value) => salvarDesignacaoSemanal(semana, value)}
                        disabled={salvandoSemanal === semana.numero}
                      >
                        <SelectTrigger className="flex-1 bg-background/50">
                          <SelectValue placeholder="Selecionar grupo para limpeza semanal..." />
                        </SelectTrigger>
                        <SelectContent>
                          {grupos.map((grupo) => (
                            <SelectItem key={grupo.id} value={grupo.id}>
                              {grupo.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {salvandoSemanal === semana.numero && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                      )}
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
