"use client"

import { useState } from "react"
import { Calendar, BookOpen, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  estudos: EstudoResumo[]
}

const mesesDisponiveis: MesEstudos[] = [
  {
    mes: "Março",
    ano: 2026,
    estudos: [
      {
        id: 1,
        semana: "Semana 1",
        dataInicio: "2",
        dataFim: "8 de março",
        titulo: "Continue cuidando da sua 'necessidade espiritual'",
        imagem: "/images/estudo-marco-semana1.jpg"
      },
      {
        id: 2,
        semana: "Semana 2",
        dataInicio: "9",
        dataFim: "15 de março",
        titulo: "Você é capaz de lutar contra sentimentos negativos!",
        imagem: "/images/estudo-marco-semana2.jpg"
      },
      {
        id: 3,
        semana: "Semana 3",
        dataInicio: "16",
        dataFim: "22 de março",
        titulo: "Por que precisamos do resgate?",
        imagem: "/images/estudo-marco-semana3.jpg"
      },
      {
        id: 4,
        semana: "Semana 4",
        dataInicio: "23",
        dataFim: "29 de março",
        titulo: "Como você vai mostrar sua gratidão pelo resgate?",
        imagem: "/images/estudo-marco-semana4.jpg"
      },
      {
        id: 5,
        semana: "Semana 5",
        dataInicio: "30 de março",
        dataFim: "5 de abril",
        titulo: "Fale a verdade de modo agradável",
        imagem: "/images/estudo-marco-semana5.jpg"
      }
    ]
  }
]

export default function EstudoSentinelaPage() {
  const [mesSelecionado, setMesSelecionado] = useState("Março-2026")
  
  const mesAtual = mesesDisponiveis.find(
    m => `${m.mes}-${m.ano}` === mesSelecionado
  ) || mesesDisponiveis[0]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-800 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <h1 className="text-xl font-bold">Estudo de A Sentinela</h1>
            </div>
            <Badge variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700">
              {mesAtual.estudos.length} Estudos
            </Badge>
          </div>
          
          {/* Seletor de Mês */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-zinc-400" />
            <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
              <SelectTrigger className="w-[200px] bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {mesesDisponiveis.map((mes) => (
                  <SelectItem 
                    key={`${mes.mes}-${mes.ano}`} 
                    value={`${mes.mes}-${mes.ano}`}
                    className="text-white hover:bg-zinc-700"
                  >
                    {mes.mes} de {mes.ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Lista de Estudos */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="space-y-3">
          {mesAtual.estudos.map((estudo) => (
            <Link 
              key={estudo.id} 
              href={`/admin/reunioes/estudo-sentinela/${mesSelecionado.toLowerCase().replace(" ", "-")}/${estudo.id}`}
            >
              <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4">
                    {/* Imagem do Estudo */}
                    <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-zinc-700 rounded-l-lg overflow-hidden">
                      {estudo.imagem ? (
                        <img 
                          src={estudo.imagem} 
                          alt={estudo.titulo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-zinc-500" />
                        </div>
                      )}
                    </div>
                    
                    {/* Informações do Estudo */}
                    <div className="flex-1 py-3 pr-4">
                      <p className="text-sm text-zinc-400 uppercase tracking-wide mb-1">
                        {estudo.dataInicio}-{estudo.dataFim} DE {mesAtual.ano}
                      </p>
                      <h2 className="text-lg md:text-xl font-semibold text-blue-300 leading-tight">
                        {estudo.titulo}
                      </h2>
                    </div>
                    
                    {/* Seta */}
                    <div className="pr-4">
                      <ChevronRight className="w-6 h-6 text-zinc-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
