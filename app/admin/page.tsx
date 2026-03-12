"use client"

import { useEffect, useState } from "react"
import { Users, UserCheck, Shield, Flag, Loader2, Wrench, Mic, Volume2, Sparkles, Calendar } from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPublicadores, type PublicadorGrupo } from "@/lib/actions/grupos"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface EquipeTecnica {
  indicador1_nome: string | null
  indicador2_nome: string | null
  microvolante1_nome: string | null
  microvolante2_nome: string | null
  som_nome: string | null
  data: string
  dia_semana: string
}

interface LimpezaSemana {
  grupo_nome: string | null
  data_inicio: string
  data_fim: string
  semana: number
}

// Função para obter início e fim da semana (segunda a domingo)
function getWeekRange(date: Date) {
  const day = date.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diffToMonday)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return { monday, sunday }
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [publicadores, setPublicadores] = useState<PublicadorGrupo[]>([])
  const [equipeSemana, setEquipeSemana] = useState<EquipeTecnica[]>([])
  const [limpezaSemana, setLimpezaSemana] = useState<LimpezaSemana | null>(null)
  const [periodoSemana, setPeriodoSemana] = useState<string>("")
  
  useEffect(() => {
    async function carregarDados() {
      try {
        // Carregar publicadores
        const data = await getPublicadores()
        setPublicadores(data)
        
        const hoje = new Date()
        const { monday, sunday } = getWeekRange(hoje)
        
        // Definir período da semana
        setPeriodoSemana(`${format(monday, "d", { locale: ptBR })} a ${format(sunday, "d 'de' MMMM", { locale: ptBR })}`)
        
        // Buscar equipe técnica da semana toda
        const mesAtual = format(hoje, "yyyy-MM")
        const resEquipe = await fetch(`/api/equipe-tecnica?mes=${mesAtual}`)
        if (resEquipe.ok) {
          const equipeData = await resEquipe.json()
          // Filtrar apenas as reuniões da semana atual
          const reunioesSemana = equipeData.filter((e: EquipeTecnica) => {
            const dataReuniao = new Date(e.data)
            return dataReuniao >= monday && dataReuniao <= sunday
          })
          setEquipeSemana(reunioesSemana)
        }
        
        // Carregar limpeza da semana atual
        const resLimpeza = await fetch(`/api/limpeza-salao?mes=${mesAtual}`)
        if (resLimpeza.ok) {
          const limpezaData = await resLimpeza.json()
          // Encontrar a semana atual
          const semanaAtual = limpezaData.find((l: LimpezaSemana) => {
            const inicio = new Date(l.data_inicio)
            const fim = new Date(l.data_fim)
            return hoje >= inicio && hoje <= fim
          })
          if (semanaAtual) {
            setLimpezaSemana(semanaAtual)
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [])

  // Usar APENAS os campos específicos de cargo na congregação
  // NÃO usar is_lider/is_auxiliar que são para dirigente/auxiliar de GRUPO DE ESTUDO
  const totalAtivos = publicadores.filter((p) => p.ativo).length
  const totalAnciaos = publicadores.filter((p) => p.anciao && p.ativo).length
  const totalServos = publicadores.filter((p) => p.servo_ministerial && p.ativo).length
  const totalPioneirosRegulares = publicadores.filter((p) => p.pioneiro_regular && p.ativo).length
  const totalPioneirosAuxiliares = publicadores.filter((p) => p.pioneiro_auxiliar && p.ativo).length

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6" key="dashboard-v2">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel administrativo do InfoFlow
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Publicadores"
          value={totalAtivos}
          description="Clique para ver todos"
          icon={Users}
          href="/admin/publicadores"
          variant="primary"
        />
        <StatsCard
          title="Total de Anciãos"
          value={totalAnciaos}
          description="Clique para ver todos"
          icon={UserCheck}
          href="/admin/publicadores/anciaos"
          variant="accent"
        />
        <StatsCard
          title="Total de Servos Ministeriais"
          value={totalServos}
          description="Clique para ver todos"
          icon={Shield}
          href="/admin/publicadores/servos-ministeriais"
        />
        <StatsCard
          title="Total de Pioneiros"
          value={totalPioneirosRegulares}
          description="Clique para ver todos"
          icon={Flag}
          href="/admin/publicadores/pioneiros-regulares"
          badge={{ label: "Auxiliares", value: totalPioneirosAuxiliares }}
        />
      </div>

      {/* Equipe da Semana e Limpeza da Semana */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Equipe Técnica da Semana */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Reuniões da Semana
            </CardTitle>
            <p className="text-sm text-muted-foreground">Semana de {periodoSemana}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {equipeSemana.length > 0 ? (
              equipeSemana.map((reuniao, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <span className="text-sm font-semibold text-foreground">
                      {reuniao.dia_semana === "quinta" ? "Quinta-feira" : "Domingo"} - {format(new Date(reuniao.data), "dd/MM", { locale: ptBR })}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Wrench className="h-3 w-3 text-green-500" />
                        <span className="text-xs">Indicadores</span>
                      </div>
                      <p className="text-foreground">{reuniao.indicador1_nome || "-"}</p>
                      <p className="text-foreground">{reuniao.indicador2_nome || "-"}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Mic className="h-3 w-3 text-purple-500" />
                        <span className="text-xs">Microfone</span>
                      </div>
                      <p className="text-foreground">{reuniao.microvolante1_nome || "-"}</p>
                      <p className="text-foreground">{reuniao.microvolante2_nome || "-"}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Volume2 className="h-3 w-3 text-blue-500" />
                        <span className="text-xs">Som</span>
                      </div>
                      <p className="text-foreground">{reuniao.som_nome || "-"}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma designação cadastrada para esta semana
              </p>
            )}
          </CardContent>
        </Card>

        {/* Limpeza da Semana */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-cyan-500" />
              Limpeza da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            {limpezaSemana ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Grupo responsável:</span>
                  <span className="text-lg font-semibold text-foreground">{limpezaSemana.grupo_nome}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Período:</span>
                  <span className="text-sm text-foreground">
                    {format(new Date(limpezaSemana.data_inicio), "dd/MM", { locale: ptBR })} a {format(new Date(limpezaSemana.data_fim), "dd/MM", { locale: ptBR })}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum grupo designado para esta semana</p>
            )}
            </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Dashboard atualizado: mostra Equipe Técnica do dia e Limpeza da Semana
