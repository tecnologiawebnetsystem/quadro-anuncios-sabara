"use client"

import { useState, useMemo } from "react"
import { Calendar, BookOpen, ChevronRight, Search } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface EstudoResumo {
  id: number
  semana: string
  dataInicio: string
  dataFim: string
  titulo: string
  imagem?: string
}

interface MesEstudos {
  mes: string
  ano: number
  slug: string
  estudos: EstudoResumo[]
}

const mesesDisponiveis: MesEstudos[] = [
  {
    mes: "Marco",
    ano: 2026,
    slug: "marco-2026",
    estudos: [
      {
        id: 1,
        semana: "Semana 1",
        dataInicio: "2",
        dataFim: "8 de marco",
        titulo: "Continue cuidando da sua 'necessidade espiritual'",
      },
      {
        id: 2,
        semana: "Semana 2",
        dataInicio: "9",
        dataFim: "15 de marco",
        titulo: "Voce e capaz de lutar contra sentimentos negativos!",
      },
      {
        id: 3,
        semana: "Semana 3",
        dataInicio: "16",
        dataFim: "22 de marco",
        titulo: "Por que precisamos do resgate?",
      },
      {
        id: 4,
        semana: "Semana 4",
        dataInicio: "23",
        dataFim: "29 de marco",
        titulo: "Como voce vai mostrar sua gratidao pelo resgate?",
      },
      {
        id: 5,
        semana: "Semana 5",
        dataInicio: "30 de marco",
        dataFim: "5 de abril",
        titulo: "Fale a verdade de modo agradavel",
      }
    ]
  }
]

export default function EstudoSentinelaPage() {
  const [mesSelecionado, setMesSelecionado] = useState("marco-2026")
  const [busca, setBusca] = useState("")
  
  const mesAtual = useMemo(() => {
    return mesesDisponiveis.find(m => m.slug === mesSelecionado) || mesesDisponiveis[0]
  }, [mesSelecionado])

  const estudosFiltrados = useMemo(() => {
    if (!busca.trim()) return mesAtual.estudos
    const termo = busca.toLowerCase()
    return mesAtual.estudos.filter(e => 
      e.titulo.toLowerCase().includes(termo) ||
      e.semana.toLowerCase().includes(termo)
    )
  }, [mesAtual.estudos, busca])

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Estudo de A Sentinela</h1>
                <p className="text-xs text-zinc-500">Selecione o mes e o estudo</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700 px-3 py-1">
              {estudosFiltrados.length} Estudo{estudosFiltrados.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          {/* Seletor de Mês e Busca */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Calendar className="w-5 h-5 text-zinc-400" />
              <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
                <SelectTrigger className="flex-1 bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Selecione o mes" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {mesesDisponiveis.map((mes) => (
                    <SelectItem 
                      key={mes.slug} 
                      value={mes.slug}
                      className="text-white hover:bg-zinc-700 focus:bg-zinc-700"
                    >
                      {mes.mes} de {mes.ano}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative flex-1 sm:max-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                type="text"
                placeholder="Buscar estudo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Lista de Estudos */}
      <main className="max-w-4xl mx-auto p-4">
        {estudosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500">Nenhum estudo encontrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {estudosFiltrados.map((estudo, index) => (
              <Link 
                key={estudo.id} 
                href={`/admin/reunioes/estudo-sentinela/${mesSelecionado}/${estudo.id}`}
                className="block"
              >
                <Card className="bg-zinc-900/80 border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all duration-200 cursor-pointer group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4">
                      {/* Número/Imagem do Estudo */}
                      <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                        <span className="text-3xl md:text-4xl font-bold text-white/90">
                          {estudo.id}
                        </span>
                      </div>
                      
                      {/* Informações do Estudo */}
                      <div className="flex-1 py-3 pr-2">
                        <p className="text-xs md:text-sm text-zinc-500 uppercase tracking-wider mb-1 font-medium">
                          {estudo.dataInicio}-{estudo.dataFim} de {mesAtual.ano}
                        </p>
                        <h2 className="text-base md:text-lg font-semibold text-zinc-100 leading-tight group-hover:text-blue-300 transition-colors line-clamp-2">
                          {estudo.titulo}
                        </h2>
                      </div>
                      
                      {/* Seta */}
                      <div className="pr-4">
                        <div className="p-2 rounded-full bg-zinc-800 group-hover:bg-blue-600/20 transition-colors">
                          <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
        
        {/* Rodapé informativo */}
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-600">
            Toque em um estudo para ver as perguntas e respostas
          </p>
        </div>
      </main>
    </div>
  )
}
