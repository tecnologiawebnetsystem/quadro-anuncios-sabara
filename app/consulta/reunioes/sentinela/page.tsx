"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  ChevronRight, 
  BookMarked,
  Music,
  FileText,
  Calendar,
  AlertTriangle
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

interface Estudo {
  id: string
  numero_estudo: number
  titulo: string
  data_inicio: string
  data_fim: string
  texto_tema: string | null
  objetivo: string | null
  cantico_inicial: number | null
  cantico_inicial_nome: string | null
  cantico_final: number | null
  cantico_final_nome: string | null
  imagem_capa: string | null
  sem_reuniao: boolean
  motivo_sem_reuniao: string | null
}

interface Paragrafo {
  id: string
  estudo_id: string
  numero: string
  texto_base: string | null
  pergunta: string | null
  resposta: string | null
  imagem_url: string | null
  imagem_descricao: string | null
  imagem_explicacao: string | null
  ordem: number
}

export default function ConsultaSentinelaPage() {
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [estudos, setEstudos] = useState<Estudo[]>([])
  const [paragrafos, setParagrafos] = useState<Paragrafo[]>([])
  const [loading, setLoading] = useState(true)
  const [estudoAtivo, setEstudoAtivo] = useState(0)
  const { syncTrigger } = useSync()

  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      // Buscar mês
      const { data: mes } = await supabase
        .from("sentinela_meses")
        .select("id")
        .eq("mes", mesAtual)
        .eq("ano", anoAtual)
        .single()

      if (mes) {
        // Carregar estudos do mês
        const { data: estudosData } = await supabase
          .from("sentinela_estudos")
          .select("*")
          .eq("mes_id", mes.id)
          .order("numero_estudo")
        
        setEstudos(estudosData || [])
        
        if (estudosData && estudosData.length > 0) {
          // Carregar parágrafos de todos os estudos
          const { data: paragrafosData } = await supabase
            .from("sentinela_paragrafos")
            .select("*")
            .in("estudo_id", estudosData.map(e => e.id))
            .order("ordem")
          
          setParagrafos(paragrafosData || [])
        } else {
          setParagrafos([])
        }
      } else {
        setEstudos([])
        setParagrafos([])
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
    setEstudoAtivo(0)
  }

  const mesProximo = () => {
    if (mesAtual === 12) {
      setMesAtual(1)
      setAnoAtual(anoAtual + 1)
    } else {
      setMesAtual(mesAtual + 1)
    }
    setEstudoAtivo(0)
  }

  const estudoAtualData = estudos[estudoAtivo]
  const paragrafosAtuais = paragrafos.filter(p => p.estudo_id === estudoAtualData?.id)

  // Identificar qual semana é a atual (baseado na data de hoje)
  // Usa ano/mês/dia locais para evitar offset UTC que deslocaria a data
  const hoje = new Date()
  const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`
  const indiceSemanaAtual = estudos.findIndex(
    (e) => hojeStr >= e.data_inicio && hojeStr <= e.data_fim
  )
  // Se hoje não está em nenhuma semana, usar a próxima semana futura
  const indiceSemanaEfetivo = indiceSemanaAtual >= 0
    ? indiceSemanaAtual
    : estudos.findIndex((e) => e.data_inicio > hojeStr)

  // Selecionar automaticamente a semana atual quando carregar os dados
  useEffect(() => {
    if (estudos.length > 0 && indiceSemanaEfetivo >= 0) {
      setEstudoAtivo(indiceSemanaEfetivo)
    }
  }, [estudos, indiceSemanaEfetivo])

  const formatarData = (data: string) => {
    return new Date(data + "T12:00:00").toLocaleDateString("pt-BR", { 
      day: "2-digit", 
      month: "long"
    })
  }

  const formatarPeriodoCurto = (inicio: string, fim: string) => {
    const mesesCurtos = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    const dataInicio = new Date(inicio + "T12:00:00")
    const dataFim = new Date(fim + "T12:00:00")
    const diaInicio = dataInicio.getDate()
    const diaFim = dataFim.getDate()
    const mesInicio = mesesCurtos[dataInicio.getMonth()]
    const mesFim = mesesCurtos[dataFim.getMonth()]
    
    if (mesInicio === mesFim) {
      return `${diaInicio}-${diaFim} ${mesInicio}`
    }
    return `${diaInicio}/${mesInicio}-${diaFim}/${mesFim}`
  }

  const formatarPeriodo = (inicio: string, fim: string) => {
    const dataInicio = new Date(inicio + "T12:00:00")
    const dataFim = new Date(fim + "T12:00:00")
    const diaInicio = dataInicio.getDate()
    const diaFim = dataFim.getDate()
    const mesInicio = dataInicio.toLocaleDateString("pt-BR", { month: "long" })
    const mesFim = dataFim.toLocaleDateString("pt-BR", { month: "long" })
    
    // Se o estudo cruza dois meses diferentes
    if (mesInicio !== mesFim) {
      return `${diaInicio} de ${mesInicio} - ${diaFim} de ${mesFim}`
    }
    return `${diaInicio}-${diaFim} de ${mesInicio}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Estudo de A Sentinela</h1>
        <p className="text-zinc-400">Artigos de estudo por mês</p>
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
      ) : estudos.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="py-12 text-center text-zinc-500">
            Nenhum estudo cadastrado para este mês
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Seletor de Semanas */}
          <div className="flex flex-wrap gap-2">
            {estudos.map((estudo, index) => {
              const isAtual = index === indiceSemanaAtual
              return (
                <Button
                  key={estudo.id}
                  variant={estudoAtivo === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEstudoAtivo(index)}
                  className={cn(
                    "relative",
                    isAtual && estudoAtivo !== index && "border-red-800 text-red-400"
                  )}
                >
                  {formatarPeriodoCurto(estudo.data_inicio, estudo.data_fim)}
                  {isAtual && (
                    <span className="ml-1.5 text-[10px] bg-zinc-950 text-white px-1.5 py-0.5 rounded-full font-medium border border-zinc-700">
                      Atual
                    </span>
                  )}
                </Button>
              )
            })}
          </div>

          {/* Conteúdo do Estudo */}
          {estudoAtualData && (
            <div className="space-y-4">
              {/* Aviso de Semana sem Reunião */}
              {estudoAtualData.sem_reuniao ? (
                <Card className="bg-amber-500/10 border-amber-500/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-amber-400 mb-2">
                          Não haverá reunião esta semana
                        </h3>
                        <p className="text-zinc-300">
                          Semana de {formatarPeriodo(estudoAtualData.data_inicio, estudoAtualData.data_fim)}
                        </p>
                        {estudoAtualData.motivo_sem_reuniao && (
                          <p className="text-zinc-400 mt-3 text-sm">
                            Motivo: {estudoAtualData.motivo_sem_reuniao}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
              <>
              {/* Header do Estudo */}
              <Card className="bg-gradient-to-r from-red-900/30 to-zinc-900 border-red-800/50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Calendar className="w-4 h-4" />
                      <span>Semana de {formatarPeriodo(estudoAtualData.data_inicio, estudoAtualData.data_fim)}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      {estudoAtualData.titulo}
                    </h2>
                    {estudoAtualData.texto_tema && (
                      <p className="text-zinc-300 italic border-l-2 border-red-500 pl-4">
                        &ldquo;{estudoAtualData.texto_tema}&rdquo;
                      </p>
                    )}
                    {estudoAtualData.objetivo && (
                      <p className="text-zinc-400 text-sm">
                        <span className="font-semibold">Objetivo:</span> {estudoAtualData.objetivo}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 pt-2">
                      {estudoAtualData.cantico_inicial && (
                        <div className="flex items-center gap-1 text-sm text-zinc-400">
                          <Music className="w-4 h-4" />
                          <span>Cântico {estudoAtualData.cantico_inicial}{estudoAtualData.cantico_inicial_nome && ` - ${estudoAtualData.cantico_inicial_nome}`}</span>
                        </div>
                      )}
                      {estudoAtualData.cantico_final && (
                        <div className="flex items-center gap-1 text-sm text-zinc-400">
                          <Music className="w-4 h-4" />
                          <span>Cântico {estudoAtualData.cantico_final}{estudoAtualData.cantico_final_nome && ` - ${estudoAtualData.cantico_final_nome}`}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Parágrafos */}
              {paragrafosAtuais.length > 0 && (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-white">
                      <FileText className="w-4 h-4 text-red-500" />
                      Parágrafos ({paragrafosAtuais.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {paragrafosAtuais.map((paragrafo) => (
                      <div 
                        key={paragrafo.id} 
                        className="bg-zinc-800/50 rounded-lg p-4"
                      >
                        <div className="flex gap-3">
                          <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded text-sm font-bold h-fit">
                            {paragrafo.numero}
                          </span>
                          <div className="flex-1 space-y-3">
                            {paragrafo.pergunta && (
                              <p className="text-zinc-200 font-medium">
                                {paragrafo.pergunta}
                              </p>
                            )}
                            {paragrafo.texto_base && (
                              <p className="text-zinc-400 leading-relaxed">
                                {paragrafo.texto_base}
                              </p>
                            )}
                            {paragrafo.resposta && (
                              <p className="text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded border-l-2 border-red-500">
                                {paragrafo.resposta}
                              </p>
                            )}
                            {paragrafo.imagem_url && (
                              <div className="mt-3 space-y-2">
                                <img 
                                  src={paragrafo.imagem_url} 
                                  alt={paragrafo.imagem_descricao || "Imagem do parágrafo"} 
                                  className="rounded-lg max-w-full h-auto max-h-64 object-contain"
                                />
                                {paragrafo.imagem_descricao && (
                                  <p className="text-sm text-zinc-400 italic">
                                    {paragrafo.imagem_descricao}
                                  </p>
                                )}
                                {paragrafo.imagem_explicacao && (
                                  <p className="text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded border-l-2 border-green-500">
                                    {paragrafo.imagem_explicacao}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
