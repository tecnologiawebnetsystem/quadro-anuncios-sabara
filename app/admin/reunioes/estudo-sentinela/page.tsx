"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Calendar, 
  ChevronRight, 
  Search, 
  BookOpen, 
  Clock,
  Star,
  History,
  CheckCircle2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface EstudoResumo {
  id: number
  semana: string
  dataInicio: string
  dataFim: string
  titulo: string
  cantico: number
}

interface MesData {
  id: string
  nome: string
  ano: number
  cor: string
  estudos: EstudoResumo[]
}

// Dados dos meses
const mesesData: MesData[] = [
  {
    id: "marco-2026",
    nome: "Março",
    ano: 2026,
    cor: "#3b82f6",
    estudos: [
      { id: 1, semana: "Semana 1", dataInicio: "2", dataFim: "8 de março", titulo: "Continue cuidando da sua 'necessidade espiritual'", cantico: 97 },
      { id: 2, semana: "Semana 2", dataInicio: "9", dataFim: "15 de março", titulo: "Você é capaz de lutar contra sentimentos negativos!", cantico: 45 },
      { id: 3, semana: "Semana 3", dataInicio: "16", dataFim: "22 de março", titulo: "Por que precisamos do resgate?", cantico: 20 },
      { id: 4, semana: "Semana 4", dataInicio: "23", dataFim: "29 de março", titulo: "Como você vai mostrar sua gratidão pelo resgate?", cantico: 18 },
      { id: 5, semana: "Semana 5", dataInicio: "30 de março", dataFim: "5 de abril", titulo: "Fale a verdade de modo agradável", cantico: 76 },
    ]
  },
  {
    id: "abril-2026",
    nome: "Abril",
    ano: 2026,
    cor: "#8b5cf6",
    estudos: [
      { id: 1, semana: "Semana 1", dataInicio: "6", dataFim: "12 de abril", titulo: "Como podemos ajudar nossos parentes descrentes?", cantico: 82 },
      { id: 2, semana: "Semana 2", dataInicio: "13", dataFim: "19 de abril", titulo: "O significado e a importância do batismo", cantico: 52 },
      { id: 3, semana: "Semana 3", dataInicio: "20", dataFim: "26 de abril", titulo: "Continue se esforçando para se batizar", cantico: 49 },
      { id: 4, semana: "Semana 4", dataInicio: "27 de abril", dataFim: "3 de maio", titulo: "Como se preparar para desafios que podem surgir depois do batismo?", cantico: 99 },
    ]
  },
  {
    id: "maio-2026",
    nome: "Maio",
    ano: 2026,
    cor: "#10b981",
    estudos: [
      { id: 1, semana: "Semana 1", dataInicio: "4", dataFim: "10 de maio", titulo: "Como melhorar nossa 'arte de ensino'", cantico: 53 },
      { id: 2, semana: "Semana 2", dataInicio: "11", dataFim: "17 de maio", titulo: "Confie no Soberano do Universo", cantico: 7 },
      { id: 3, semana: "Semana 3", dataInicio: "18", dataFim: "24 de maio", titulo: "Tome cuidado com as distrações", cantico: 35 },
      { id: 4, semana: "Semana 4", dataInicio: "25", dataFim: "31 de maio", titulo: "Mostre perspicácia e você 'será bem-sucedido'", cantico: 135 },
      { id: 5, semana: "Semana 5", dataInicio: "1", dataFim: "7 de junho", titulo: "Você pode ser feliz mesmo sendo odiado!", cantico: 111 },
    ]
  }
]

// Função para verificar se é a semana atual
function isSemanaAtual(dataInicio: string, dataFim: string, mes: number, ano: number): boolean {
  const hoje = new Date()
  const mesAtual = hoje.getMonth() + 1
  const diaAtual = hoje.getDate()
  const anoAtual = hoje.getFullYear()
  
  const inicioNum = parseInt(dataInicio)
  const fimMatch = dataFim.match(/(\d+)/)
  const fimNum = fimMatch ? parseInt(fimMatch[1]) : 31
  
  if (anoAtual === ano && mesAtual === mes) {
    return diaAtual >= inicioNum && diaAtual <= fimNum
  }
  
  return false
}

export default function EstudoSentinelaPage() {
  const router = useRouter()
  const [mesSelecionado, setMesSelecionado] = useState("marco-2026")
  const [busca, setBusca] = useState("")
  const [abaAtiva, setAbaAtiva] = useState("estudos")
  const [favoritos, setFavoritos] = useState<number[]>([])
  const [historico, setHistorico] = useState<{id: number, data: string}[]>([])
  const [concluidos, setConcluidos] = useState<number[]>([])

  // Carregar dados do localStorage
  useEffect(() => {
    const favoritosStorage = localStorage.getItem("sentinela_favoritos")
    const historicoStorage = localStorage.getItem("sentinela_historico")
    const concluidosStorage = localStorage.getItem("sentinela_concluidos")
    
    if (favoritosStorage) setFavoritos(JSON.parse(favoritosStorage))
    if (historicoStorage) setHistorico(JSON.parse(historicoStorage))
    if (concluidosStorage) setConcluidos(JSON.parse(concluidosStorage))
  }, [])

  const mesAtual = useMemo(() => {
    return mesesData.find(m => m.id === mesSelecionado) || mesesData[0]
  }, [mesSelecionado])

  const estudosFiltrados = useMemo(() => {
    if (!busca) return mesAtual.estudos
    const termoBusca = busca.toLowerCase()
    return mesAtual.estudos.filter(e => 
      e.titulo.toLowerCase().includes(termoBusca) ||
      e.semana.toLowerCase().includes(termoBusca)
    )
  }, [mesAtual.estudos, busca])

  const estudosFavoritos = useMemo(() => {
    return mesAtual.estudos.filter(e => favoritos.includes(e.id))
  }, [mesAtual.estudos, favoritos])

  const handleAbrirEstudo = (estudoId: number) => {
    const novoHistorico = [
      { id: estudoId, data: new Date().toISOString() },
      ...historico.filter(h => h.id !== estudoId)
    ].slice(0, 20)
    
    setHistorico(novoHistorico)
    localStorage.setItem("sentinela_historico", JSON.stringify(novoHistorico))
    
    router.push(`/admin/reunioes/estudo-sentinela/${mesSelecionado}/${estudoId}`)
  }

  const renderEstudoCard = (estudo: EstudoResumo, showSemanaAtual = true) => {
    const semanaAtual = showSemanaAtual && isSemanaAtual(estudo.dataInicio, estudo.dataFim, 3, 2026)
    const isFavorito = favoritos.includes(estudo.id)
    const isConcluido = concluidos.includes(estudo.id)
    
    return (
      <Card 
        key={estudo.id}
        className={`group cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border-0 overflow-hidden ${
          semanaAtual 
            ? "ring-2 ring-green-500 shadow-lg shadow-green-500/20" 
            : "hover:shadow-xl"
        }`}
        style={{ 
          background: `linear-gradient(135deg, ${mesAtual.cor}15 0%, ${mesAtual.cor}05 100%)`,
          borderLeft: `4px solid ${isConcluido ? '#22c55e' : mesAtual.cor}`
        }}
        onClick={() => handleAbrirEstudo(estudo.id)}
      >
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start gap-4">
            {/* Número do Estudo */}
            <div 
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                isConcluido ? 'bg-green-500/20' : ''
              }`}
              style={{ backgroundColor: isConcluido ? undefined : `${mesAtual.cor}20` }}
            >
              {isConcluido ? (
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              ) : (
                <span className="text-2xl font-bold" style={{ color: mesAtual.cor }}>{estudo.id}</span>
              )}
            </div>
            
            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  {estudo.dataInicio} - {estudo.dataFim}
                </span>
                {semanaAtual && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] px-1.5 py-0">
                    Semana Atual
                  </Badge>
                )}
                {isFavorito && (
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                )}
                {isConcluido && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] px-1.5 py-0">
                    Concluído
                  </Badge>
                )}
              </div>
              
              <h3 className="text-base sm:text-lg font-semibold text-zinc-100 line-clamp-2 group-hover:text-white transition-colors">
                {estudo.titulo}
              </h3>
              
              <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {estudo.semana}
                </span>
                <span>Cântico {estudo.cantico}</span>
              </div>
            </div>
            
            {/* Seta */}
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Estudo de A Sentinela
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Prepare-se para as reuniões de fim de semana
              </p>
            </div>
            
            {/* Seletor de mês */}
            <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
              <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 z-[100]">
                {mesesData.map((mes) => (
                  <SelectItem 
                    key={mes.id} 
                    value={mes.id}
                    className="text-white focus:bg-zinc-700 focus:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: mes.cor }}
                      />
                      {mes.nome} {mes.ano}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Abas */}
        <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="mb-6">
          <TabsList className="bg-zinc-800/50 border border-zinc-700/50 p-1 w-full sm:w-auto">
            <TabsTrigger 
              value="estudos" 
              className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white flex-1 sm:flex-none"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Estudos
            </TabsTrigger>
            <TabsTrigger 
              value="favoritos"
              className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white flex-1 sm:flex-none"
            >
              <Star className="w-4 h-4 mr-2" />
              Favoritos
            </TabsTrigger>
            <TabsTrigger 
              value="historico"
              className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white flex-1 sm:flex-none"
            >
              <History className="w-4 h-4 mr-2" />
              Histórico
            </TabsTrigger>
          </TabsList>

          {/* Aba Estudos */}
          <TabsContent value="estudos" className="mt-6">
            {/* Busca */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                type="text"
                placeholder="Buscar estudo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Info do mês */}
            <div className="flex items-center gap-2 mb-4">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: mesAtual.cor }}
              />
              <span className="text-lg font-semibold text-white">
                {mesAtual.nome} {mesAtual.ano}
              </span>
              <Badge variant="outline" className="text-zinc-400 border-zinc-700 ml-2">
                {estudosFiltrados.length} estudos
              </Badge>
            </div>

            {/* Lista de estudos */}
            <div className="space-y-3">
              {estudosFiltrados.map((estudo) => renderEstudoCard(estudo))}
              
              {estudosFiltrados.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum estudo encontrado</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Aba Favoritos */}
          <TabsContent value="favoritos" className="mt-6">
            {estudosFavoritos.length > 0 ? (
              <div className="space-y-3">
                {estudosFavoritos.map((estudo) => renderEstudoCard(estudo, false))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum estudo favoritado</p>
                <p className="text-sm mt-2">Clique na estrela dentro de um estudo para adicionar</p>
              </div>
            )}
          </TabsContent>

          {/* Aba Histórico */}
          <TabsContent value="historico" className="mt-6">
            {historico.length > 0 ? (
              <div className="space-y-3">
                {historico.map((item) => {
                  const estudo = mesAtual.estudos.find(e => e.id === item.id)
                  if (!estudo) return null
                  return (
                    <div key={`${item.id}-${item.data}`} className="relative">
                      {renderEstudoCard(estudo, false)}
                      <div className="absolute top-2 right-12 text-[10px] text-zinc-500 bg-zinc-900/80 px-2 py-1 rounded">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(item.data).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum estudo acessado recentemente</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
