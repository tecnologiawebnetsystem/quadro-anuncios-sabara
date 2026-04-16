"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Users, Calendar, Download, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"

interface EstatisticaMensal {
  mes: string
  designacoes: number
  publicadoresAtivos: number
}

interface EstatisticaGrupo {
  grupo: string
  totalDesignacoes: number
  publicadores: number
  mediaDesignacoes: number
}

interface EstatisticaPublicador {
  nome: string
  totalDesignacoes: number
  ultimaDesignacao: string | null
}

export function RelatoriosAvancados() {
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState("6")
  const [dadosMensais, setDadosMensais] = useState<EstatisticaMensal[]>([])
  const [dadosGrupos, setDadosGrupos] = useState<EstatisticaGrupo[]>([])
  const [dadosPublicadores, setDadosPublicadores] = useState<EstatisticaPublicador[]>([])

  useEffect(() => {
    carregarDados()
  }, [periodo])

  const carregarDados = async () => {
    setLoading(true)
    const supabase = createClient()
    const meses = parseInt(periodo)
    
    // Carregar dados dos últimos N meses
    const dadosMensaisTemp: EstatisticaMensal[] = []
    
    for (let i = meses - 1; i >= 0; i--) {
      const data = subMonths(new Date(), i)
      const inicio = startOfMonth(data)
      const fim = endOfMonth(data)
      
      // Contar designações do mês
      const { count: designacoes } = await supabase
        .from("designacoes_vida_ministerio")
        .select("*", { count: "exact", head: true })
        .gte("data", inicio.toISOString())
        .lte("data", fim.toISOString())

      // Contar publicadores ativos (com designação no mês)
      const { data: pubsAtivos } = await supabase
        .from("designacoes_vida_ministerio")
        .select("publicador_id")
        .gte("data", inicio.toISOString())
        .lte("data", fim.toISOString())

      const publicadoresUnicos = new Set(pubsAtivos?.map(p => p.publicador_id) || [])

      dadosMensaisTemp.push({
        mes: format(data, "MMM/yy", { locale: ptBR }),
        designacoes: designacoes || 0,
        publicadoresAtivos: publicadoresUnicos.size
      })
    }
    
    setDadosMensais(dadosMensaisTemp)

    // Carregar dados por grupo
    const { data: grupos } = await supabase
      .from("grupos")
      .select(`
        id,
        nome,
        publicadores:publicadores(id)
      `)

    if (grupos) {
      const dadosGruposTemp: EstatisticaGrupo[] = []
      
      for (const grupo of grupos) {
        const publicadorIds = grupo.publicadores?.map((p: { id: string }) => p.id) || []
        
        // Contar designações do grupo nos últimos N meses
        const { count: totalDesignacoes } = await supabase
          .from("designacoes_vida_ministerio")
          .select("*", { count: "exact", head: true })
          .in("publicador_id", publicadorIds.length > 0 ? publicadorIds : ["00000000-0000-0000-0000-000000000000"])
          .gte("data", subMonths(new Date(), meses).toISOString())

        dadosGruposTemp.push({
          grupo: grupo.nome,
          totalDesignacoes: totalDesignacoes || 0,
          publicadores: publicadorIds.length,
          mediaDesignacoes: publicadorIds.length > 0 ? Math.round((totalDesignacoes || 0) / publicadorIds.length * 10) / 10 : 0
        })
      }
      
      setDadosGrupos(dadosGruposTemp.sort((a, b) => b.totalDesignacoes - a.totalDesignacoes))
    }

    // Carregar top publicadores
    const { data: publicadores } = await supabase
      .from("publicadores")
      .select("id, nome")
      .eq("ativo", true)
      .limit(20)

    if (publicadores) {
      const dadosPublicadoresTemp: EstatisticaPublicador[] = []
      
      for (const pub of publicadores) {
        const { count } = await supabase
          .from("designacoes_vida_ministerio")
          .select("*", { count: "exact", head: true })
          .eq("publicador_id", pub.id)
          .gte("data", subMonths(new Date(), meses).toISOString())

        const { data: ultimaDesig } = await supabase
          .from("designacoes_vida_ministerio")
          .select("data")
          .eq("publicador_id", pub.id)
          .order("data", { ascending: false })
          .limit(1)
          .single()

        dadosPublicadoresTemp.push({
          nome: pub.nome,
          totalDesignacoes: count || 0,
          ultimaDesignacao: ultimaDesig?.data || null
        })
      }
      
      setDadosPublicadores(dadosPublicadoresTemp.sort((a, b) => b.totalDesignacoes - a.totalDesignacoes))
    }

    setLoading(false)
  }

  const exportarRelatorio = () => {
    const conteudo = {
      periodo: `Ultimos ${periodo} meses`,
      geradoEm: new Date().toISOString(),
      dadosMensais,
      dadosGrupos,
      topPublicadores: dadosPublicadores.slice(0, 10)
    }
    
    const blob = new Blob([JSON.stringify(conteudo, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `relatorio-${format(new Date(), "yyyy-MM-dd")}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const maxDesignacoes = Math.max(...dadosMensais.map(d => d.designacoes), 1)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Relatorios Avancados</CardTitle>
              <CardDescription>
                Analise detalhada de designacoes e participacao
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Ultimos 3 meses</SelectItem>
                <SelectItem value="6">Ultimos 6 meses</SelectItem>
                <SelectItem value="12">Ultimo ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={exportarRelatorio} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="evolucao">
            <TabsList className="mb-6">
              <TabsTrigger value="evolucao" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Evolucao
              </TabsTrigger>
              <TabsTrigger value="grupos" className="gap-2">
                <Users className="h-4 w-4" />
                Por Grupo
              </TabsTrigger>
              <TabsTrigger value="publicadores" className="gap-2">
                <Calendar className="h-4 w-4" />
                Publicadores
              </TabsTrigger>
            </TabsList>

            <TabsContent value="evolucao" className="space-y-6">
              {/* Gráfico de barras simples */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">Designacoes por Mes</h4>
                <div className="space-y-2">
                  {dadosMensais.map((dado) => (
                    <div key={dado.mes} className="flex items-center gap-4">
                      <span className="w-16 text-sm text-muted-foreground">{dado.mes}</span>
                      <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${(dado.designacoes / maxDesignacoes) * 100}%` }}
                        />
                      </div>
                      <span className="w-12 text-sm font-medium text-right">{dado.designacoes}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cards de resumo */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {dadosMensais.reduce((acc, d) => acc + d.designacoes, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total de Designacoes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {Math.round(dadosMensais.reduce((acc, d) => acc + d.designacoes, 0) / dadosMensais.length)}
                  </p>
                  <p className="text-xs text-muted-foreground">Media Mensal</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {Math.max(...dadosMensais.map(d => d.publicadoresAtivos))}
                  </p>
                  <p className="text-xs text-muted-foreground">Max. Publicadores Ativos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {dadosGrupos.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Grupos Ativos</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="grupos" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-sm font-medium">Grupo</th>
                      <th className="text-center py-3 px-2 text-sm font-medium">Publicadores</th>
                      <th className="text-center py-3 px-2 text-sm font-medium">Designacoes</th>
                      <th className="text-center py-3 px-2 text-sm font-medium">Media/Pub</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosGrupos.map((grupo, i) => (
                      <tr key={grupo.grupo} className="border-b last:border-0">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">{i + 1}.</span>
                            <span className="font-medium">{grupo.grupo}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">{grupo.publicadores}</td>
                        <td className="py-3 px-2 text-center font-medium">{grupo.totalDesignacoes}</td>
                        <td className="py-3 px-2 text-center text-muted-foreground">{grupo.mediaDesignacoes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="publicadores" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-sm font-medium">Publicador</th>
                      <th className="text-center py-3 px-2 text-sm font-medium">Designacoes</th>
                      <th className="text-right py-3 px-2 text-sm font-medium">Ultima Designacao</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosPublicadores.slice(0, 15).map((pub, i) => (
                      <tr key={pub.nome} className="border-b last:border-0">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">{i + 1}.</span>
                            <span className="font-medium">{pub.nome}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center font-medium">{pub.totalDesignacoes}</td>
                        <td className="py-3 px-2 text-right text-sm text-muted-foreground">
                          {pub.ultimaDesignacao 
                            ? format(new Date(pub.ultimaDesignacao), "dd/MM/yyyy", { locale: ptBR })
                            : "-"
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
