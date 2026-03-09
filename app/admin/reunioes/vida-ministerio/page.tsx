"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ChevronRight, BookOpen, Gem, Wheat, Heart, Music } from "lucide-react"
import Link from "next/link"
import { reunioesMarco2026 } from "@/lib/data/vida-ministerio-marco"
import { semanasAbril } from "@/lib/data/vida-ministerio-abril"

export default function VidaMinisterioPage() {
  const [mesSelecionado, setMesSelecionado] = useState("marco-2026")

  // Dados dos meses disponíveis
  const mesesDisponiveis = [
    { id: "marco-2026", nome: "Março", ano: "2026", cor: "bg-blue-500" },
    { id: "abril-2026", nome: "Abril", ano: "2026", cor: "bg-purple-500" },
    { id: "maio-2026", nome: "Maio", ano: "2026", cor: "bg-emerald-500" },
  ]

  const mesAtual = mesesDisponiveis.find(m => m.id === mesSelecionado)

  // Selecionar reuniões de acordo com o mês
  const reunioes = mesSelecionado === "marco-2026" 
    ? reunioesMarco2026 
    : mesSelecionado === "abril-2026" 
      ? semanasAbril 
      : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vida e Ministério</h1>
          <p className="text-muted-foreground">
            Programa da Reunião Vida e Ministério Cristão
          </p>
        </div>

        {/* Seletor de Mês */}
        <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
          <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white">
            <SelectValue>
              {mesAtual && (
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${mesAtual.cor}`} />
                  {mesAtual.nome}/{mesAtual.ano}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700 z-[9999]" position="popper" sideOffset={5}>
            {mesesDisponiveis.map((mes) => (
              <SelectItem 
                key={mes.id} 
                value={mes.id}
                className="text-white focus:bg-zinc-700 focus:text-white cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${mes.cor}`} />
                  {mes.nome}/{mes.ano}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Legenda das Seções */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center">
            <Gem className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-sm text-muted-foreground">Tesouros da Palavra de Deus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-600 flex items-center justify-center">
            <Wheat className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-sm text-muted-foreground">Faça Seu Melhor no Ministério</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-700 flex items-center justify-center">
            <Heart className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-sm text-muted-foreground">Nossa Vida Cristã</span>
        </div>
      </div>

      {/* Lista de Reuniões da Semana */}
      <div className="grid gap-4">
        {reunioes.length === 0 ? (
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma reunião disponível para este mês.</p>
            </CardContent>
          </Card>
        ) : (
          reunioes.map((reuniao) => (
            <Link key={reuniao.id} href={`/admin/reunioes/vida-ministerio/${reuniao.id}`}>
              <Card className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                          {reuniao.semana}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{reuniao.leituraSemana}</span>
                      </div>
                      <CardTitle className="text-xl mt-2">
                        Semana de {reuniao.semana}
                      </CardTitle>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-white transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Preview das Seções */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Tesouros */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <Gem className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-400 font-medium">Tesouros</p>
                        <p className="text-sm font-medium text-white">{reuniao.tesouros.partes.length} partes</p>
                      </div>
                    </div>

                    {/* Ministério */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-600/10 border border-amber-600/20">
                      <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
                        <Wheat className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-amber-400 font-medium">Ministério</p>
                        <p className="text-sm font-medium text-white">{reuniao.ministerio.partes.length} partes</p>
                      </div>
                    </div>

                    {/* Vida Cristã */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-red-700/10 border border-red-700/20">
                      <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-red-400 font-medium">Vida Cristã</p>
                        <p className="text-sm font-medium text-white">{reuniao.vidaCrista.partes.length} partes</p>
                      </div>
                    </div>
                  </div>

                  {/* Cânticos */}
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Cânticos:</span>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-zinc-800">{reuniao.canticoInicial}</Badge>
                      <Badge variant="secondary" className="bg-zinc-800">{reuniao.canticoMeio}</Badge>
                      <Badge variant="secondary" className="bg-zinc-800">{reuniao.canticoFinal}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
