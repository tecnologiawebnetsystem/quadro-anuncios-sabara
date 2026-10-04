"use client"

import { useState, useEffect, useCallback } from "react"
import { CenteredLoader } from "@/components/ui/page-loader"
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

  if (loading) return <CenteredLoader />
  
  return (
    <div className="min-h-screen bg-[#f4f7fb] -m-4 p-4 text-[#172338] md:-m-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="overflow-hidden rounded-3xl bg-[#123b68] px-6 py-7 text-white shadow-lg md:px-10 md:py-9">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e9a72f] text-[#123b68] shadow-sm">
                <BookMarked className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b9d5ed]">Quadro de Anúncios</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">A Sentinela</h1>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#d8e7f5] md:text-right">Consulte o estudo semanal, os parágrafos e as respostas cadastradas.</p>
          </div>
        </header>

        <section className="rounded-2xl border border-[#dbe5ef] bg-white p-4 shadow-sm md:p-5" aria-label="Navegação de mês">
          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" size="icon" onClick={mesAnterior} className="h-11 w-11 rounded-xl border-[#cbd9e7] text-[#123b68] hover:bg-[#eef5fb]">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Mês anterior</span>
            </Button>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#66809a]">Edições disponíveis</p>
              <h2 className="mt-1 text-2xl font-bold text-[#172338] md:text-3xl">
                {meses.find(m => m.valor === mesAtual)?.nome} {anoAtual}
              </h2>
            </div>
            <Button variant="outline" size="icon" onClick={mesProximo} className="h-11 w-11 rounded-xl border-[#cbd9e7] text-[#123b68] hover:bg-[#eef5fb]">
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Próximo mês</span>
            </Button>
          </div>
        </section>

      {loading ? (
        <div className="text-center text-zinc-500 py-12">Carregando...</div>
      ) : estudos.length === 0 ? (
        <Card className="rounded-3xl border-[#dbe5ef] bg-white shadow-sm">
          <CardContent className="py-12 text-center text-zinc-500">
            Nenhum estudo cadastrado para este mês
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Seletor de Semanas */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {estudos.map((estudo, index) => {
              const isAtual = index === indiceSemanaAtual
              return (
                <Button
                  key={estudo.id}
                  variant={estudoAtivo === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEstudoAtivo(index)}
                  className={cn(
                    "relative h-auto min-h-20 justify-start rounded-2xl border-[#dbe5ef] bg-white px-4 py-3 text-left text-[#172338] shadow-sm hover:border-[#123b68] hover:bg-[#f7fbff]",
                    estudoAtivo === index && "border-[#123b68] bg-[#123b68] text-white hover:bg-[#123b68]",
                    isAtual && estudoAtivo !== index && "border-[#e9a72f]"
                  )}
                >
                  {formatarPeriodoCurto(estudo.data_inicio, estudo.data_fim)}
                  {isAtual && (
                    <span className="ml-1.5 text-[10px] bg-zinc-950 text-[#252525] px-1.5 py-0.5 rounded-full font-medium border border-zinc-700">
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
                <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-amber-400 mb-2">
                          Não haverá reunião esta semana
                        </h3>
                        <p className="text-[#444]">
                          Semana de {formatarPeriodo(estudoAtualData.data_inicio, estudoAtualData.data_fim)}
                        </p>
                        {estudoAtualData.motivo_sem_reuniao && (
                          <p className="text-[#666] mt-3 text-sm">
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
              <Card className="overflow-hidden rounded-3xl border-[#dbe5ef] bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-[#666]">
                      <Calendar className="w-4 h-4" />
                      <span>Semana de {formatarPeriodo(estudoAtualData.data_inicio, estudoAtualData.data_fim)}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#252525]">
                      {estudoAtualData.titulo}
                    </h2>
                    {estudoAtualData.texto_tema && (
                      <p className="text-[#444] italic border-l-2 border-red-500 pl-4">
                        &ldquo;{estudoAtualData.texto_tema}&rdquo;
                      </p>
                    )}
                    {estudoAtualData.objetivo && (
                      <p className="text-[#666] text-sm">
                        <span className="font-semibold">Objetivo:</span> {estudoAtualData.objetivo}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 pt-2">
                      {estudoAtualData.cantico_inicial && (
                        <div className="flex items-center gap-1 text-sm text-[#666]">
                          <Music className="w-4 h-4" />
                          <span>Cântico {estudoAtualData.cantico_inicial}{estudoAtualData.cantico_inicial_nome && ` - ${estudoAtualData.cantico_inicial_nome}`}</span>
                        </div>
                      )}
                      {estudoAtualData.cantico_final && (
                        <div className="flex items-center gap-1 text-sm text-[#666]">
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
                <Card className="overflow-hidden rounded-3xl border-[#dbe5ef] bg-white shadow-sm">
                  <CardHeader className="border-b border-[#e8eef4] bg-[#f8fbfe] pb-4">
                    <CardTitle className="flex items-center gap-2 text-base text-[#172338]">
                      <FileText className="h-5 w-5 text-[#123b68]" />
                      Parágrafos ({paragrafosAtuais.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {paragrafosAtuais.map((paragrafo) => (
                      <div 
                        key={paragrafo.id} 
                        className="border-b border-[#e2e2e2] bg-white py-5 first:pt-2 last:border-b-0"
                      >
                        <div className="flex gap-3">
                          <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-[#e9a72f] px-2 text-sm font-bold text-[#123b68]">
                            {paragrafo.numero}
                          </span>
                          <div className="flex-1 space-y-3">
                            {paragrafo.pergunta && (
                              <p className="text-lg font-semibold leading-7 text-[#172338]">
                                {paragrafo.pergunta}
                              </p>
                            )}
                            {paragrafo.texto_base && (
                              <p className="text-[#666] leading-relaxed">
                                {paragrafo.texto_base}
                              </p>
                            )}
                            {/* Resposta cadastrada */}
                            {paragrafo.resposta && (
                              <p className="rounded-xl border border-[#dbe5ef] border-l-4 border-l-[#e9a72f] bg-[#fffaf0] p-4 leading-7 text-[#34465a]">
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
                                  <p className="text-sm text-[#666] italic">
                                    {paragrafo.imagem_descricao}
                                  </p>
                                )}
                                {paragrafo.imagem_explicacao && (
                                  <p className="text-[#444] leading-relaxed bg-zinc-900/50 p-3 rounded border-l-2 border-green-500">
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
    </div>
  )
}
