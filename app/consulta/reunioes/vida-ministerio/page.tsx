"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Music, 
  Gem,
  MessageSquare,
  Heart,
  User,
  Users
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useSync } from "@/lib/contexts/sync-context"
import { cn } from "@/lib/utils"

const meses = [
  { valor: 1, nome: "Janeiro" },
  { valor: 2, nome: "Fevereiro" },
  { valor: 3, nome: "Março" },
  { valor: 4, nome: "Abril" },
  { valor: 5, nome: "Maio" },
  { valor: 6, nome: "Junho" },
  { valor: 7, nome: "Julho" },
  { valor: 8, nome: "Agosto" },
  { valor: 9, nome: "Setembro" },
  { valor: 10, nome: "Outubro" },
  { valor: 11, nome: "Novembro" },
  { valor: 12, nome: "Dezembro" },
]

const secoes = [
  { id: "tesouros", nome: "Tesouros da Palavra de Deus", cor: "bg-amber-500", textCor: "text-amber-500", icon: Gem },
  { id: "ministerio", nome: "Faça Seu Melhor no Ministério", cor: "bg-yellow-500", textCor: "text-yellow-500", icon: MessageSquare },
  { id: "vida", nome: "Nossa Vida Cristã", cor: "bg-red-500", textCor: "text-red-500", icon: Heart },
]

interface Semana {
  id: string
  data_inicio: string
  data_fim: string
  leitura_semanal: string
  cantico_inicial: number | null
  cantico_meio: number | null
  cantico_final: number | null
}

interface Parte {
  id: string
  semana_id: string
  secao: string
  titulo: string
  tempo: string | null
  participante_nome: string | null
  ajudante_nome: string | null
  sala: string
  ordem: number
}

export default function ConsultaVidaMinisterioPage() {
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [semanas, setSemanas] = useState<Semana[]>([])
  const [partes, setPartes] = useState<Parte[]>([])
  const [loading, setLoading] = useState(true)
  const [semanaAtiva, setSemanaAtiva] = useState(0)
  const { syncTrigger } = useSync()

  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      // Buscar mês
      const { data: mes } = await supabase
        .from("vida_ministerio_meses")
        .select("id")
        .eq("mes", mesAtual)
        .eq("ano", anoAtual)
        .single()

      if (mes) {
        // Carregar semanas do mês
        const { data: semanasData } = await supabase
          .from("vida_ministerio_semanas")
          .select("*")
          .eq("mes_id", mes.id)
          .order("data_inicio")
        
        setSemanas(semanasData || [])
        
        if (semanasData && semanasData.length > 0) {
          // Carregar partes de todas as semanas
          const { data: partesData } = await supabase
            .from("vida_ministerio_partes")
            .select("*")
            .in("semana_id", semanasData.map(s => s.id))
            .order("ordem")
          
          setPartes(partesData || [])
        } else {
          setPartes([])
        }
      } else {
        setSemanas([])
        setPartes([])
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }, [mesAtual, anoAtual, supabase, syncTrigger])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const mesAnterior = () => {
    if (mesAtual === 1) {
      setMesAtual(12)
      setAnoAtual(anoAtual - 1)
    } else {
      setMesAtual(mesAtual - 1)
    }
    setSemanaAtiva(0)
  }

  const mesProximo = () => {
    if (mesAtual === 12) {
      setMesAtual(1)
      setAnoAtual(anoAtual + 1)
    } else {
      setMesAtual(mesAtual + 1)
    }
    setSemanaAtiva(0)
  }

  const semanaAtual = semanas[semanaAtiva]
  const partesAtuais = partes.filter(p => p.semana_id === semanaAtual?.id)

  const formatarData = (data: string) => {
    return new Date(data + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
  }

  const formatarDataCompleta = (dataInicio: string, dataFim: string) => {
    const inicio = new Date(dataInicio + "T12:00:00")
    const fim = new Date(dataFim + "T12:00:00")
    return `${inicio.getDate()}-${fim.getDate()} de ${meses[inicio.getMonth()].nome}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Vida e Ministério</h1>
        <p className="text-zinc-400">Programa da reunião de meio de semana</p>
      </div>

      {/* Navegação de Mês */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={mesAnterior}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">
                {meses.find(m => m.valor === mesAtual)?.nome} {anoAtual}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={mesProximo}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center text-zinc-500 py-12">Carregando...</div>
      ) : semanas.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="py-12 text-center text-zinc-500">
            Nenhuma programação cadastrada para este mês
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Seletor de Semanas */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {semanas.map((semana, index) => (
              <Button
                key={semana.id}
                variant={semanaAtiva === index ? "default" : "outline"}
                size="sm"
                onClick={() => setSemanaAtiva(index)}
                className="whitespace-nowrap"
              >
                {formatarData(semana.data_inicio)} - {formatarData(semana.data_fim)}
              </Button>
            ))}
          </div>

          {/* Conteúdo da Semana */}
          {semanaAtual && (
            <div className="space-y-4">
              {/* Header da Semana */}
              <Card className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-700">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {formatarDataCompleta(semanaAtual.data_inicio, semanaAtual.data_fim)}
                      </h3>
                      {semanaAtual.leitura_semanal && (
                        <p className="text-sm text-zinc-400 flex items-center gap-2 mt-1">
                          <BookOpen className="w-4 h-4" />
                          Leitura: {semanaAtual.leitura_semanal}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-4">
                      {semanaAtual.cantico_inicial && (
                        <div className="flex items-center gap-1 text-sm text-zinc-400">
                          <Music className="w-4 h-4" />
                          <span>Cântico {semanaAtual.cantico_inicial}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seções */}
              {secoes.map((secao) => {
                const partesSecao = partesAtuais.filter(p => p.secao === secao.id)
                if (partesSecao.length === 0) return null

                const Icon = secao.icon

                return (
                  <Card key={secao.id} className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
                    <div className={cn("h-1", secao.cor)} />
                    <CardHeader className="pb-2">
                      <CardTitle className={cn("text-base flex items-center gap-2", secao.textCor)}>
                        <Icon className="w-4 h-4" />
                        {secao.nome}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {partesSecao.map((parte) => (
                        <div 
                          key={parte.id} 
                          className="bg-zinc-800/50 rounded-lg p-3"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-medium text-white">{parte.titulo}</h4>
                                {parte.tempo && (
                                  <span className="text-xs bg-zinc-700 px-2 py-0.5 rounded text-zinc-300">
                                    {parte.tempo}
                                  </span>
                                )}
                                {parte.sala === "auxiliar" && (
                                  <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded">
                                    Sala Auxiliar
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              {parte.participante_nome && (
                                <div className="flex items-center gap-1 text-zinc-300">
                                  <User className="w-3 h-3" />
                                  <span>{parte.participante_nome}</span>
                                </div>
                              )}
                              {parte.ajudante_nome && (
                                <div className="flex items-center gap-1 text-zinc-400">
                                  <Users className="w-3 h-3" />
                                  <span>{parte.ajudante_nome}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>

                    {/* Cântico do meio após a seção tesouros */}
                    {secao.id === "tesouros" && semanaAtual.cantico_meio && (
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2 text-sm text-zinc-400 justify-center py-2 border-t border-zinc-800">
                          <Music className="w-4 h-4" />
                          <span>Cântico {semanaAtual.cantico_meio}</span>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}

              {/* Cântico Final */}
              {semanaAtual.cantico_final && (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="py-3">
                    <div className="flex items-center gap-2 text-sm text-zinc-400 justify-center">
                      <Music className="w-4 h-4" />
                      <span>Cântico Final: {semanaAtual.cantico_final}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
