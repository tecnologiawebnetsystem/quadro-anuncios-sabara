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

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [publicadores, setPublicadores] = useState<PublicadorGrupo[]>([])
  const [equipeHoje, setEquipeHoje] = useState<EquipeTecnica | null>(null)
  const [limpezaSemana, setLimpezaSemana] = useState<LimpezaSemana | null>(null)
  const [diaReuniao, setDiaReuniao] = useState<string>("")
  
  useEffect(() => {
    async function carregarDados() {
      try {
        // Carregar publicadores
        const data = await getPublicadores()
        setPublicadores(data)
        
        // Carregar equipe técnica de hoje
        const hoje = new Date()
        const diaSemana = hoje.getDay() // 0=domingo, 4=quinta
        
        // Verificar se hoje é dia de reunião (quinta=4 ou domingo=0)
        if (diaSemana === 4 || diaSemana === 0) {
          const dataFormatada = format(hoje, "yyyy-MM-dd")
          const diaTexto = diaSemana === 4 ? "quinta" : "domingo"
          setDiaReuniao(diaTexto === "quinta" ? "Quinta-feira" : "Domingo")
          
          const resEquipe = await fetch(`/api/equipe-tecnica?data=${dataFormatada}`)
          if (resEquipe.ok) {
            const equipeData = await resEquipe.json()
            if (equipeData.length > 0) {
              setEquipeHoje(equipeData[0])
            }
          }
        }
        
        // Carregar limpeza da semana atual
        const mesAtual = format(hoje, "yyyy-MM")
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
    <div className="space-y-6">
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

      {/* Equipe de Hoje e Limpeza da Semana */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Equipe Técnica de Hoje */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              {diaReuniao ? `Reunião de Hoje (${diaReuniao})` : "Próxima Reunião"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {equipeHoje ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Wrench className="h-4 w-4 text-green-500" />
                    Indicadores
                  </div>
                  <div className="ml-6 space-y-1">
                    <p className="text-sm text-foreground">{equipeHoje.indicador1_nome || "Não designado"}</p>
                    <p className="text-sm text-foreground">{equipeHoje.indicador2_nome || "Não designado"}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mic className="h-4 w-4 text-purple-500" />
                    Microfone Volante
                  </div>
                  <div className="ml-6 space-y-1">
                    <p className="text-sm text-foreground">{equipeHoje.microvolante1_nome || "Não designado"}</p>
                    <p className="text-sm text-foreground">{equipeHoje.microvolante2_nome || "Não designado"}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Volume2 className="h-4 w-4 text-blue-500" />
                    Som
                  </div>
                  <div className="ml-6">
                    <p className="text-sm text-foreground">{equipeHoje.som_nome || "Não designado"}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {diaReuniao ? "Nenhuma designação cadastrada para hoje" : "Não há reunião hoje"}
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
