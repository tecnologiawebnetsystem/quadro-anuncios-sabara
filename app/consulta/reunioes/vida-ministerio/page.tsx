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
  Users,
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

const TESOUROS_ORDEM = { DISCURSO: 1, JOIAS: 2, LEITURA: 3 }

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
  // Tesouros extras
  textos: string[] | null
  pergunta1: string | null
  resposta1: string | null
  pergunta2: string | null
  resposta2: string | null
  texto_biblia: string | null
  licao: string | null
  // Ministério extras
  descricao: string | null
  // Estudo Bíblico de Congregação
  leitor_nome: string | null
  oracao_final_nome: string | null
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
      const { data: mes } = await supabase
        .from("vida_ministerio_meses")
        .select("id")
        .eq("mes", mesAtual)
        .eq("ano", anoAtual)
        .single()

      if (mes) {
        const { data: semanasData } = await supabase
          .from("vida_ministerio_semanas")
          .select("*")
          .eq("mes_id", mes.id)
          .order("data_inicio")

        setSemanas(semanasData || [])

        if (semanasData && semanasData.length > 0) {
          const { data: partesData } = await supabase
            .from("vida_ministerio_partes")
            .select("*")
            .in("semana_id", semanasData.map((s) => s.id))
            .order("ordem")

          setPartes(
            (partesData || []).map((p) => ({
              ...p,
              textos: Array.isArray(p.textos) ? p.textos : [],
            }))
          )
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
    if (mesAtual === 1) { setMesAtual(12); setAnoAtual(anoAtual - 1) }
    else setMesAtual(mesAtual - 1)
    setSemanaAtiva(0)
  }

  const mesProximo = () => {
    if (mesAtual === 12) { setMesAtual(1); setAnoAtual(anoAtual + 1) }
    else setMesAtual(mesAtual + 1)
    setSemanaAtiva(0)
  }

  const semanaAtual = semanas[semanaAtiva]
  const partesAtuais = partes.filter((p) => p.semana_id === semanaAtual?.id)

  const formatarData = (data: string) =>
    new Date(data + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })

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
                {meses.find((m) => m.valor === mesAtual)?.nome} {anoAtual}
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
                    {semanaAtual.cantico_inicial && (
                      <div className="flex items-center gap-1 text-sm text-zinc-400">
                        <Music className="w-4 h-4" />
                        <span>Cântico {semanaAtual.cantico_inicial}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Seções */}
              {(() => {
                const numTesouros = partesAtuais.filter((p) => p.secao === "tesouros").length
                const numMinisterio = partesAtuais.filter((p) => p.secao === "ministerio").length
                const offsetMinisterio = numTesouros + 1
                const offsetVida = numTesouros + numMinisterio + 1

                return secoes.map((secao) => {
                  const partesSecao = partesAtuais.filter((p) => p.secao === secao.id)
                  if (partesSecao.length === 0) return null

                  const Icon = secao.icon
                  const offset =
                    secao.id === "ministerio" ? offsetMinisterio
                    : secao.id === "vida" ? offsetVida
                    : 1

                  return (
                    <Card key={secao.id} className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
                      <div className={cn("h-1", secao.cor)} />
                      <CardHeader className="pb-2">
                        <CardTitle className={cn("text-base flex items-center gap-2", secao.textCor)}>
                          <Icon className="w-4 h-4" />
                          {secao.nome}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {partesSecao.map((parte, idx) => {
                          // Número da parte para ministério e vida
                          const numeroParte =
                            secao.id === "tesouros" ? null : offset + idx

                          // Rótulo para tesouros
                          const labelTesouro =
                            parte.ordem === TESOUROS_ORDEM.DISCURSO ? "Parte 1 – Discurso" :
                            parte.ordem === TESOUROS_ORDEM.JOIAS ? "Parte 2 – Joias Espirituais" :
                            "Parte 3 – Leitura da Bíblia"

                          const temAjudante = !!parte.ajudante_nome

                          return (
                            <div key={parte.id} className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                              {/* Cabeçalho da parte */}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="space-y-0.5">
                                  {secao.id === "tesouros" && (
                                    <p className="text-xs text-zinc-500">{labelTesouro}</p>
                                  )}
                                  {numeroParte && (
                                    <p className="text-xs text-zinc-500">Parte {numeroParte}</p>
                                  )}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-medium text-white">{parte.titulo}</h4>
                                    {parte.tempo && (
                                      <span className="text-xs bg-zinc-700 px-2 py-0.5 rounded text-zinc-300">
                                        {parte.tempo} min
                                      </span>
                                    )}
                                    {/* Badge tipo ministério */}
                                    {secao.id === "ministerio" && (
                                      <span className={cn(
                                        "text-xs px-2 py-0.5 rounded",
                                        temAjudante
                                          ? "bg-yellow-600/20 text-yellow-400"
                                          : "bg-zinc-700 text-zinc-300"
                                      )}>
                                        {temAjudante ? "Duas pessoas" : "Discurso"}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Participante(s) */}
                                <div className="flex items-center gap-3 text-sm">
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

                              {/* Tesouros – Parte 1: pontos do discurso */}
                              {secao.id === "tesouros" && parte.ordem === TESOUROS_ORDEM.DISCURSO && (parte.textos || []).length > 0 && (
                                <ul className="space-y-1 pl-1">
                                  {(parte.textos || []).map((texto, i) => (
                                    <li key={i} className="text-sm text-zinc-300 flex gap-2">
                                      <span className="text-zinc-600 shrink-0">•</span>
                                      <span>{texto}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {/* Tesouros – Parte 2: perguntas e respostas */}
                              {secao.id === "tesouros" && parte.ordem === TESOUROS_ORDEM.JOIAS && (
                                <div className="space-y-3">
                                  {parte.pergunta1 && (
                                    <div className="space-y-1">
                                      <p className="text-sm text-amber-400 font-medium">{parte.pergunta1}</p>
                                      {parte.resposta1 && (
                                        <p className="text-sm text-zinc-300 pl-3 border-l border-zinc-700">{parte.resposta1}</p>
                                      )}
                                    </div>
                                  )}
                                  {parte.pergunta2 && (
                                    <div className="space-y-1">
                                      <p className="text-sm text-amber-400 font-medium">{parte.pergunta2}</p>
                                      {parte.resposta2 && (
                                        <p className="text-sm text-zinc-300 pl-3 border-l border-zinc-700">{parte.resposta2}</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Tesouros – Parte 3: texto bíblico e lição */}
                              {secao.id === "tesouros" && parte.ordem === TESOUROS_ORDEM.LEITURA && (
                                <div className="flex flex-wrap gap-3 text-sm text-zinc-300">
                                  {parte.texto_biblia && (
                                    <span className="flex items-center gap-1">
                                      <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
                                      {parte.texto_biblia}
                                    </span>
                                  )}
                                  {parte.licao && (
                                    <span className="text-zinc-500">({parte.licao})</span>
                                  )}
                                </div>
                              )}

                              {/* Ministério: descrição */}
                              {secao.id === "ministerio" && parte.descricao && (
                                <p className="text-sm text-zinc-300 leading-relaxed">{parte.descricao}</p>
                              )}

                              {/* Vida Cristã: leitor e oração final do Estudo Bíblico */}
                              {secao.id === "vida" && parte.titulo?.toLowerCase().includes("estudo bíblico") && (
                                <div className="space-y-1.5 pt-1 border-t border-zinc-700/50">
                                  {parte.leitor_nome && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="rounded bg-blue-600/20 px-1.5 py-0.5 text-blue-400 text-xs font-medium whitespace-nowrap">Leitor</span>
                                      <span className="text-zinc-300">{parte.leitor_nome}</span>
                                    </div>
                                  )}
                                  {parte.oracao_final_nome && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="rounded bg-red-600/20 px-1.5 py-0.5 text-red-400 text-xs font-medium whitespace-nowrap">Oração Final</span>
                                      <span className="text-zinc-300">{parte.oracao_final_nome}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </CardContent>

                      {/* Cântico do meio antes de Nossa Vida Cristã */}
                      {secao.id === "ministerio" && semanaAtual.cantico_meio && (
                        <CardContent className="pt-0">
                          <div className="flex items-center gap-2 text-sm text-zinc-400 justify-center py-2 border-t border-zinc-800">
                            <Music className="w-4 h-4" />
                            <span>Cântico {semanaAtual.cantico_meio}</span>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )
                })
              })()}

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
