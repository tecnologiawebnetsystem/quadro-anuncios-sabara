"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, BookOpen, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { reunioesMarco2026 } from "@/lib/data/vida-ministerio-marco"
import { semanasAbril } from "@/lib/data/vida-ministerio-abril"
import { getTodosEstudosSentinela, type EstudoSentinela } from "@/lib/data/estudo-sentinela"

// Combinar todas as semanas de vida e ministério
const todasSemanasVidaMinisterio = [...reunioesMarco2026, ...semanasAbril]

// Função para determinar a semana atual baseado na data
function getSemanaAtual() {
  const hoje = new Date()
  
  // Encontrar a semana que contém a data atual
  for (const semana of todasSemanasVidaMinisterio) {
    const inicio = new Date(semana.dataInicio)
    const fim = new Date(semana.dataFim)
    fim.setHours(23, 59, 59, 999)
    
    if (hoje >= inicio && hoje <= fim) {
      return semana.id
    }
  }
  
  // Se não encontrar, retornar a primeira semana
  return todasSemanasVidaMinisterio[0]?.id || ""
}

// Função para encontrar o estudo da sentinela correspondente à semana
function getEstudoSentinelaPorSemana(semanaId: string): EstudoSentinela | null {
  const semana = todasSemanasVidaMinisterio.find(s => s.id === semanaId)
  if (!semana) return null
  
  // Buscar o estudo da sentinela que corresponde à mesma semana pela data
  const todosEstudos = getTodosEstudosSentinela()
  
  // Comparar por data de início
  const estudoExato = todosEstudos.find(e => e.dataInicio === semana.dataInicio)
  if (estudoExato) return estudoExato
  
  // Se não encontrar por data exata, buscar por proximidade
  const dataInicioSemana = new Date(semana.dataInicio)
  for (const estudo of todosEstudos) {
    const dataInicioEstudo = new Date(estudo.dataInicio)
    const diffDias = Math.abs((dataInicioSemana.getTime() - dataInicioEstudo.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDias <= 7) {
      return estudo
    }
  }
  
  return null
}

export default function ReunioesPage() {
  const [semanaAtualId, setSemanaAtualId] = useState(getSemanaAtual)
  
  // Encontrar índice da semana atual
  const indiceAtual = useMemo(() => {
    return todasSemanasVidaMinisterio.findIndex(s => s.id === semanaAtualId)
  }, [semanaAtualId])
  
  const semanaAtual = todasSemanasVidaMinisterio[indiceAtual]
  const estudoSentinela = getEstudoSentinelaPorSemana(semanaAtualId)
  
  // Navegação entre semanas
  const irParaSemanaAnterior = () => {
    if (indiceAtual > 0) {
      setSemanaAtualId(todasSemanasVidaMinisterio[indiceAtual - 1].id)
    }
  }
  
  const irParaProximaSemana = () => {
    if (indiceAtual < todasSemanasVidaMinisterio.length - 1) {
      setSemanaAtualId(todasSemanasVidaMinisterio[indiceAtual + 1].id)
    }
  }
  
  // Verificar se é a semana atual
  const isEstaSemana = useMemo(() => {
    if (!semanaAtual) return false
    const hoje = new Date()
    const inicio = new Date(semanaAtual.dataInicio)
    const fim = new Date(semanaAtual.dataFim)
    fim.setHours(23, 59, 59, 999)
    return hoje >= inicio && hoje <= fim
  }, [semanaAtual])
  
  if (!semanaAtual) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Nenhuma reunião disponível</p>
      </div>
    )
  }

  // Formatar semana para exibição (ex: "9-15 de março")
  const semanaFormatada = semanaAtual.semana.toLowerCase()

  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Navegação da Semana */}
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={irParaSemanaAnterior}
          disabled={indiceAtual === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-200 bg-purple-50 text-purple-600 transition-all hover:bg-purple-100 hover:border-purple-300 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-purple-50 dark:border-purple-800 dark:bg-purple-950 dark:hover:bg-purple-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div className="text-center min-w-[200px]">
          <p className="text-lg font-medium text-foreground">
            {semanaFormatada}
            {isEstaSemana && (
              <span className="text-muted-foreground font-normal"> · Esta semana</span>
            )}
          </p>
        </div>
        
        <button
          onClick={irParaProximaSemana}
          disabled={indiceAtual === todasSemanasVidaMinisterio.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-200 bg-purple-50 text-purple-600 transition-all hover:bg-purple-100 hover:border-purple-300 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-purple-50 dark:border-purple-800 dark:bg-purple-950 dark:hover:bg-purple-900"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      
      {/* Cards das Reuniões */}
      <div className="space-y-6">
        {/* Vida e Ministério */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">Vida e Ministério</h2>
          <Link href={`/admin/reunioes/vida-ministerio/${semanaAtual.id}`} className="block">
            <Card className="group cursor-pointer border-0 bg-card/50 shadow-sm transition-all hover:shadow-md hover:bg-accent/30">
              <CardContent className="flex items-center gap-5 p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex-shrink-0 shadow-lg group-hover:shadow-blue-500/25 transition-shadow">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-blue-500 transition-colors group-hover:text-blue-400">
                    {semanaFormatada}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {semanaAtual.leituraSemana}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>
        
        {/* Estudo de A Sentinela */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">Estudo de A Sentinela</h2>
          {estudoSentinela ? (
            <Link href={`/admin/reunioes/estudo-sentinela/${estudoSentinela.mes}/${estudoSentinela.id}`} className="block">
              <Card className="group cursor-pointer border-0 bg-card/50 shadow-sm transition-all hover:shadow-md hover:bg-accent/30">
                <CardContent className="flex items-center gap-5 p-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex-shrink-0 shadow-lg group-hover:shadow-red-500/25 transition-shadow">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase text-muted-foreground tracking-wider font-medium mb-1">{estudoSentinela.semana}</p>
                    <p className="text-base font-medium text-red-500 transition-colors group-hover:text-red-400">
                      {estudoSentinela.titulo}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card className="border-0 bg-muted/30">
              <CardContent className="flex items-center gap-5 p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted flex-shrink-0">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Não disponível para esta semana</p>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
