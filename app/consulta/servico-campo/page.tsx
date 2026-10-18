"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { CenteredLoader } from "@/components/ui/page-loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Clock, Mail, Sun, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { useSync } from "@/lib/contexts/sync-context"
import { createClient } from "@/lib/supabase/client"

interface CampoSemana {
  id: string
  mes: string
  dia_semana: string
  dirigente_nome: string
  periodo: string
  horario: string
}

interface CampoCartas {
  id: string
  data: string
  mes: string
  dia_semana: string
  descricao: string
  responsavel_nome: string
  periodo: string
  horario: string
}

interface CampoSabado {
  id: string
  data: string
  mes: string
  periodo: string
  horario: string
  dirigente_nome: string
}

interface CampoDomingo {
  id: string
  data: string
  mes: string
  horario: string
  dirigente_nome: string | null
  tipo: "individual" | "grupo" | "salao"
}

const meses = [
  { valor: "2026-01", label: "Janeiro 2026" },
  { valor: "2026-02", label: "Fevereiro 2026" },
  { valor: "2026-03", label: "Março 2026" },
  { valor: "2026-04", label: "Abril 2026" },
  { valor: "2026-05", label: "Maio 2026" },
  { valor: "2026-06", label: "Junho 2026" },
  { valor: "2026-07", label: "Julho 2026" },
  { valor: "2026-08", label: "Agosto 2026" },
  { valor: "2026-09", label: "Setembro 2026" },
  { valor: "2026-10", label: "Outubro 2026" },
  { valor: "2026-11", label: "Novembro 2026" },
  { valor: "2026-12", label: "Dezembro 2026" },
]

// Calcular índice do mês atual baseado na data do sistema
function calcularIndiceMesAtual(): number {
  const agora = new Date()
  const mesAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}`
  const indice = meses.findIndex(m => m.valor === mesAtual)
  return indice >= 0 ? indice : 0
}

const diasSemanaLabel: Record<string, string> = {
  segunda: "Segunda",
  terca: "Terça",
  quarta: "Quarta",
  quinta: "Quinta",
  sexta: "Sexta",
}

export default function ConsultaServicoCampoPage() {
  const [mesAtual, setMesAtual] = useState(() => calcularIndiceMesAtual())
  const [campoSemana, setCampoSemana] = useState<CampoSemana[]>([])
  const [campoCartas, setCampoCartas] = useState<CampoCartas[]>([])
  const [campoSabado, setCampoSabado] = useState<CampoSabado[]>([])
  const [campoDomingo, setCampoDomingo] = useState<CampoDomingo[]>([])
  const [loading, setLoading] = useState(true)
  const { syncTrigger } = useSync()
  
  const supabase = createClient()
  const mes = meses[mesAtual]

  // Carregar somente os registros ativos do mês selecionado.
  const carregarDadosFixos = useCallback(async () => {
    try {
      const { data: semanaData } = await supabase
        .from("servico_campo_semana")
        .select("*")
        .eq("mes", mes.valor)
        .eq("ativo", true)
        .not("dia_semana", "is", null)
        .neq("dia_semana", "")
        .order("dia_semana")
      
      if (semanaData) setCampoSemana(semanaData)
      
      const { data: cartasData } = await supabase
        .from("servico_campo_cartas")
        .select("*")
        .eq("mes", mes.valor)
        .eq("ativo", true)
        .order("data")
      
      if (cartasData) setCampoCartas(cartasData)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }, [mes.valor])

  // Carregar dados mensais (sábados e domingos)
  const carregarDadosMes = useCallback(async () => {
    setLoading(true)
    try {
      const { data: sabadoData } = await supabase
        .from("servico_campo_sabado")
        .select("*")
        .eq("mes", mes.valor)
        .order("data")
      
      if (sabadoData) setCampoSabado(sabadoData)
      
      const { data: domingoData } = await supabase
        .from("servico_campo_domingo")
        .select("*")
        .eq("mes", mes.valor)
        .order("data")
      
      if (domingoData) setCampoDomingo(domingoData)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }, [mes.valor])

  useEffect(() => {
    carregarDadosFixos()
  }, [carregarDadosFixos, syncTrigger])

  useEffect(() => {
    carregarDadosMes()
  }, [carregarDadosMes, syncTrigger])

  const navegarMes = (direcao: "anterior" | "proximo") => {
    if (direcao === "anterior" && mesAtual > 0) {
      setMesAtual(mesAtual - 1)
    } else if (direcao === "proximo" && mesAtual < meses.length - 1) {
      setMesAtual(mesAtual + 1)
    }
  }

  const formatarData = (data: string) => {
    // Extrai dia/mês direto da string para evitar offset UTC
    const [, m, d] = data.split("-")
    return `${d}/${m}`
  }

  // Agrupar sábados por período
  const sabadosManha = campoSabado.filter(s => s.periodo === "manha")
  const sabadosTarde = campoSabado.filter(s => s.periodo === "tarde")

  // Ordenar dias da semana
  const ordemDias = ["segunda", "terca", "quarta", "quinta", "sexta"]
  const campoSemanaOrdenado = [...campoSemana]
  .filter((item) => ordemDias.includes(item.dia_semana))
  .sort((a, b) => ordemDias.indexOf(a.dia_semana) - ordemDias.indexOf(b.dia_semana))

  if (loading) return <CenteredLoader />
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/consulta">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MapPin className="h-6 w-6 text-green-500" />
            Serviço de Campo
          </h1>
          <p className="text-zinc-400 text-sm">Dirigentes e programação do ministério</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* PROGRAMA DURANTE A SEMANA */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Programa de Ministério de Campo Durante a Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            {campoSemanaOrdenado.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-4">Nenhum programa cadastrado</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {campoSemanaOrdenado.map((item) => (
                  <article key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-white">{diasSemanaLabel[item.dia_semana]}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.periodo === "manha"
                          ? "bg-amber-600/20 text-amber-300"
                          : "bg-purple-600/20 text-purple-300"
                      }`}>
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        {item.periodo === "manha" ? "Manhã" : "Tarde"} · {item.horario || "Horário não informado"}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400">Dirigente</p>
                    <p className="mt-1 text-base font-medium text-white">{item.dirigente_nome || "Não informado"}</p>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ARRANJO DE CARTAS */}
        {campoCartas.length > 0 && (
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-amber-500" />
                Arranjo de Cartas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {campoCartas.length === 0 ? (
                <p className="py-4 text-center text-sm text-zinc-500">Nenhum arranjo cadastrado para {mes.label}.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {campoCartas.map((carta) => (
                    <article key={carta.id} className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {carta.data ? formatarData(carta.data) : diasSemanaLabel[carta.dia_semana]}
                          </p>
                          <p className="text-xs text-zinc-400">{diasSemanaLabel[carta.dia_semana] || "Dia não informado"}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-600/20 px-2.5 py-1 text-xs font-medium text-purple-300">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {carta.periodo === "manha" ? "Manhã" : "Tarde"} · {carta.horario || "Horário não informado"}
                        </span>
                      </div>
                      <p className="text-xs uppercase tracking-wide text-zinc-400">Atividade</p>
                      <p className="mt-1 text-sm font-medium text-white">{carta.descricao || "Cartas"}</p>
                      <p className="mt-3 text-xs uppercase tracking-wide text-zinc-400">Responsável</p>
                      <p className="mt-1 text-sm font-medium text-green-400">{carta.responsavel_nome || "Não informado"}</p>
                    </article>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navegação de Mês */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navegarMes("anterior")}
                disabled={mesAtual === 0}
                className="text-zinc-400 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                <span className="text-lg font-semibold text-white">{mes.label}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navegarMes("proximo")}
                disabled={mesAtual === meses.length - 1}
                className="text-zinc-400 hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
          </div>
        ) : (
          <>
            {/* DIRIGENTES DE SÁBADO - MANHÃ */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-white flex items-center gap-2">
                  <Sun className="h-5 w-5 text-orange-500" />
                  Dirigentes de Campo aos Sábados - Manhã
                  {sabadosManha.length > 0 && (
                    <span className="text-sm font-normal text-zinc-400">({sabadosManha[0]?.horario || "8:45"}h)</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sabadosManha.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-4">Nenhum dirigente cadastrado</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {sabadosManha.map((item) => (
                      <div key={item.id} className="p-3 rounded-lg bg-zinc-800/50 text-center">
                        <div className="text-xs text-zinc-400 mb-1">{formatarData(item.data)} - {item.horario}</div>
                        <div className="text-sm font-medium text-white">{item.dirigente_nome}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* DIRIGENTES DE SÁBADO - TARDE */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-white flex items-center gap-2">
                  <Sun className="h-5 w-5 text-purple-500" />
                  Dirigentes de Campo aos Sábados - Tarde
                  {sabadosTarde.length > 0 && (
                    <span className="text-sm font-normal text-zinc-400">({sabadosTarde[0]?.horario || "16:45"}h)</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sabadosTarde.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-4">Nenhum dirigente cadastrado</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {sabadosTarde.map((item) => (
                      <div key={item.id} className="p-3 rounded-lg bg-zinc-800/50 text-center">
                        <div className="text-xs text-zinc-400 mb-1">{formatarData(item.data)} - {item.horario}</div>
                        <div className="text-sm font-medium text-white">{item.dirigente_nome}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* DIRIGENTES DE DOMINGO */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-500" />
                  Dirigentes de Campo aos Domingos
                  {campoDomingo.length > 0 && (
                    <span className="text-sm font-normal text-zinc-400">({campoDomingo[0]?.horario || "8:45"}h)</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {campoDomingo.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-4">Nenhum dirigente cadastrado</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {campoDomingo.map((item) => (
                      <div key={item.id} className="p-3 rounded-lg bg-zinc-800/50 text-center">
                        <div className="text-xs text-zinc-400 mb-1">{formatarData(item.data)} - {item.horario}</div>
                        {item.tipo === "grupo" ? (
                          <div className="text-sm font-medium text-green-400 flex items-center justify-center gap-1">
                            <Users className="h-3 w-3" />
                            GRUPO
                          </div>
                        ) : item.tipo === "salao" ? (
                          <div>
                            <div className="text-xs text-blue-400 font-semibold uppercase mb-0.5">No Salão</div>
                            <div className="text-sm font-medium text-white">{item.dirigente_nome || "-"}</div>
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-white">{item.dirigente_nome || "-"}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
