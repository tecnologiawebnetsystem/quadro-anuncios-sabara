"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { CenteredLoader } from "@/components/ui/page-loader"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import { PrintVidaMinisterio } from "@/components/impressao/print-layouts"
import "@/app/impressao/print-styles.css"

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

const secoesCores: Record<string, string> = {
  tesouros: "#2a6b77",
  ministerio: "#c69214",
  vida: "#8b2332",
}

const secoesNomes: Record<string, string> = {
  tesouros: "Tesouros da Palavra de Deus",
  ministerio: "Faça Seu Melhor no Ministério",
  vida: "Nossa Vida Cristã",
}

interface Mes {
  id: string
  mes: number
  ano: number
  cor_tema: string
}

interface Semana {
  id: string
  mes_id: string
  data_inicio: string
  data_fim: string
  leitura_semanal: string
  livro_biblia: string | null
  cantico_inicial: number | null
  cantico_inicial_nome: string | null
  cantico_meio: number | null
  cantico_meio_nome: string | null
  cantico_final: number | null
  cantico_final_nome: string | null
  presidente: string | null
  oracao_inicial: string | null
  sem_reuniao: boolean
  motivo_sem_reuniao: string | null
}

interface Parte {
  id: string
  semana_id: string
  secao: string
  titulo: string
  tempo: string | null
  participante_id: string | null
  participante_nome: string | null
  ajudante_id: string | null
  ajudante_nome: string | null
  sala: string
  ordem: number
  textos: string[]
  licao: string | null
  descricao: string | null
  leitor_id: string | null
  leitor_nome: string | null
  oracao_final_id: string | null
  oracao_final_nome: string | null
}

export default function AdminVidaMinisterioPage() {
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [semanas, setSemanas] = useState<Semana[]>([])
  const [partes, setPartes] = useState<Parte[]>([])
  const [canticos, setCanticos] = useState<{ id: string; numero: number; descricao: string }[]>([])
  const [loading, setLoading] = useState(true)

  const printRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Vida_Ministerio_${meses.find((m) => m.valor === mesAtual)?.nome}_${anoAtual}`,
  })

  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      const { data: canticosData } = await supabase
        .from("canticos")
        .select("id, numero, descricao")
        .order("numero")
      setCanticos(canticosData || [])

      const { data: mes } = await supabase
        .from("vida_ministerio_meses")
        .select("*")
        .eq("mes", mesAtual)
        .eq("ano", anoAtual)
        .single()

      if (!mes) {
        setSemanas([])
        setPartes([])
        setLoading(false)
        return
      }

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
    } catch {
      // mês ainda não cadastrado
      setSemanas([])
      setPartes([])
    } finally {
      setLoading(false)
    }
  }, [mesAtual, anoAtual, supabase])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const mesAnterior = () => {
    if (mesAtual === 1) { setMesAtual(12); setAnoAtual(anoAtual - 1) }
    else setMesAtual(mesAtual - 1)
  }
  const mesProximo = () => {
    if (mesAtual === 12) { setMesAtual(1); setAnoAtual(anoAtual + 1) }
    else setMesAtual(mesAtual + 1)
  }

  const formatarData = (data: string) =>
    new Date(data + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })

  const formatarPeriodo = (inicio: string, fim: string) => {
    const mesesNomes = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
    const di = new Date(inicio + "T12:00:00")
    const df = new Date(fim + "T12:00:00")
    if (di.getMonth() === df.getMonth()) {
      return `${di.getDate()}-${df.getDate()} de ${mesesNomes[di.getMonth()]}`
    }
    return `${di.getDate()} ${mesesNomes[di.getMonth()]} – ${df.getDate()} ${mesesNomes[df.getMonth()]}`
  }

  const getCanticoDescricao = (numero: number | null) => {
    if (!numero) return ""
    const c = canticos.find(c => c.numero === numero)
    return c ? c.descricao : ""
  }

  if (loading) return <CenteredLoader />

  const semanasVisiveis = semanas.filter(s => !s.sem_reuniao)

  return (
    <div className="space-y-6 pb-10">
      {/* Seletor de mês + botão imprimir */}
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
              <p className="text-sm text-zinc-500">Vida e Ministério — Impressão</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePrint()}
                className="border-zinc-700 hover:bg-zinc-800"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="ghost" size="icon" onClick={mesProximo}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview das semanas */}
      {semanas.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-8 text-center text-zinc-500">
            Nenhuma semana cadastrada para este mês.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {semanas.map((semana, idx) => {
            if (semana.sem_reuniao) {
              return (
                <Card key={semana.id} className="bg-zinc-900/50 border-zinc-800 opacity-60">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="text-sm text-zinc-400 font-medium">
                      Semana {idx + 1} — {formatarPeriodo(semana.data_inicio, semana.data_fim)}
                    </div>
                    <span className="text-xs text-zinc-500 italic">
                      {semana.motivo_sem_reuniao || "Sem reunião"}
                    </span>
                  </CardContent>
                </Card>
              )
            }

            const partesSemanais = partes.filter(p => p.semana_id === semana.id)
            const tesouros = partesSemanais.filter(p => p.secao === "tesouros").sort((a, b) => a.ordem - b.ordem)
            const ministerio = partesSemanais.filter(p => p.secao === "ministerio").sort((a, b) => a.ordem - b.ordem)
            const vida = partesSemanais.filter(p => p.secao === "vida").sort((a, b) => a.ordem - b.ordem)
            const oracaoFinal = vida.find(p => p.oracao_final_nome)

            return (
              <Card key={semana.id} className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
                {/* Cabeçalho da semana */}
                <div className="bg-zinc-800 px-4 py-3 flex items-center justify-between border-b border-zinc-700">
                  <div>
                    <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wide">
                      Semana {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      {formatarPeriodo(semana.data_inicio, semana.data_fim)}
                    </h3>
                    {semana.livro_biblia && (
                      <p className="text-xs text-zinc-400 mt-0.5">{semana.livro_biblia}</p>
                    )}
                  </div>
                  <div className="text-right space-y-0.5">
                    {semana.presidente && (
                      <p className="text-xs text-zinc-300">
                        <span className="text-zinc-500">Presidente:</span> {semana.presidente}
                      </p>
                    )}
                    {semana.oracao_inicial && (
                      <p className="text-xs text-zinc-300">
                        <span className="text-zinc-500">Oração:</span> {semana.oracao_inicial}
                      </p>
                    )}
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Cântico inicial */}
                  {semana.cantico_inicial && (
                    <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-md px-3 py-2 text-xs text-indigo-300 font-medium">
                      Cântico {semana.cantico_inicial}
                      {getCanticoDescricao(semana.cantico_inicial) && `: ${getCanticoDescricao(semana.cantico_inicial)}`}
                    </div>
                  )}

                  {/* Tesouros */}
                  {tesouros.length > 0 && (
                    <div className="rounded-md overflow-hidden border border-zinc-700/50">
                      <div className="px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: secoesCores.tesouros }}>
                        {secoesNomes.tesouros.toUpperCase()}
                      </div>
                      <div className="divide-y divide-zinc-800">
                        {tesouros.map((parte) => (
                          <div key={parte.id} className="px-3 py-2 flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <span className="text-xs text-zinc-200">{parte.titulo || "—"}</span>
                              {parte.tempo && (
                                <span className="text-xs text-zinc-500 ml-1">({parte.tempo} min)</span>
                              )}
                            </div>
                            <span className="text-xs font-medium text-zinc-300 shrink-0">
                              {parte.participante_nome || "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ministério */}
                  {ministerio.length > 0 && (
                    <div className="rounded-md overflow-hidden border border-zinc-700/50">
                      <div className="px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: secoesCores.ministerio }}>
                        {secoesNomes.ministerio.toUpperCase()}
                      </div>
                      <div className="divide-y divide-zinc-800">
                        {ministerio.map((parte) => (
                          <div key={parte.id} className="px-3 py-2 flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <span className="text-xs text-zinc-200">{parte.titulo || "—"}</span>
                              {parte.tempo && (
                                <span className="text-xs text-zinc-500 ml-1">({parte.tempo} min)</span>
                              )}
                            </div>
                            <span className="text-xs font-medium text-zinc-300 shrink-0">
                              {parte.participante_nome || "—"}
                              {parte.ajudante_nome && ` / ${parte.ajudante_nome}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cântico do meio */}
                  {semana.cantico_meio && (
                    <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-md px-3 py-2 text-xs text-indigo-300 font-medium">
                      Cântico {semana.cantico_meio}
                      {getCanticoDescricao(semana.cantico_meio) && `: ${getCanticoDescricao(semana.cantico_meio)}`}
                    </div>
                  )}

                  {/* Nossa Vida Cristã */}
                  {vida.length > 0 && (
                    <div className="rounded-md overflow-hidden border border-zinc-700/50">
                      <div className="px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: secoesCores.vida }}>
                        {secoesNomes.vida.toUpperCase()}
                      </div>
                      <div className="divide-y divide-zinc-800">
                        {vida.map((parte) => (
                          <div key={parte.id} className="px-3 py-2 flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <span className="text-xs text-zinc-200">{parte.titulo || "—"}</span>
                              {parte.tempo && (
                                <span className="text-xs text-zinc-500 ml-1">({parte.tempo} min)</span>
                              )}
                            </div>
                            <span className="text-xs font-medium text-zinc-300 shrink-0">
                              {parte.participante_nome || "—"}
                              {parte.leitor_nome && ` / ${parte.leitor_nome}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cântico final + oração */}
                  {semana.cantico_final && (
                    <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-md px-3 py-2 flex items-center justify-between">
                      <span className="text-xs text-indigo-300 font-medium">
                        Cântico {semana.cantico_final}
                        {getCanticoDescricao(semana.cantico_final) && `: ${getCanticoDescricao(semana.cantico_final)}`}
                      </span>
                      {oracaoFinal?.oracao_final_nome && (
                        <span className="text-xs text-zinc-400">
                          Oração: <span className="text-zinc-300 font-medium">{oracaoFinal.oracao_final_nome}</span>
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Componente oculto para impressão */}
      <div className="hidden">
        <PrintVidaMinisterio
          ref={printRef}
          mes={mesAtual}
          ano={anoAtual}
          semanas={semanas}
          partes={partes}
          canticos={canticos}
        />
      </div>
    </div>
  )
}
