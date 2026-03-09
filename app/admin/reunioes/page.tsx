"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, BookOpen, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    <div className="space-y-8 p-6 max-w-3xl mx-auto">
      {/* Navegação da Semana */}
      <div className="flex items-center justify-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={irParaSemanaAnterior}
          disabled={indiceAtual === 0}
          className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="text-center">
          <span className="text-base text-foreground">
            {semanaFormatada}
            {isEstaSemana && (
              <span className="text-muted-foreground"> · Esta semana</span>
            )}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={irParaProximaSemana}
          disabled={indiceAtual === todasSemanasVidaMinisterio.length - 1}
          className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Cards das Reuniões */}
      <div className="space-y-8">
        {/* Vida e Ministério */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-foreground">Vida e Ministério</h2>
          <Link href={`/admin/reunioes/vida-ministerio/${semanaAtual.id}`}>
            <div className="flex items-center gap-4 py-3 px-2 cursor-pointer group rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex-shrink-0 shadow-md">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-blue-500 group-hover:text-blue-400 group-hover:underline transition-colors">
                  {semanaFormatada}
                </p>
              </div>
            </div>
          </Link>
        </section>
        
        {/* Estudo de A Sentinela */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-foreground">Estudo de A Sentinela</h2>
          {estudoSentinela ? (
            <Link href={`/admin/reunioes/estudo-sentinela/${estudoSentinela.mes}/${estudoSentinela.id}`}>
              <div className="flex items-center gap-4 py-3 px-2 cursor-pointer group rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-red-700 to-red-900 flex-shrink-0 shadow-md">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase text-muted-foreground tracking-wide font-medium">{estudoSentinela.semana}</p>
                  <p className="text-base font-medium text-red-500 group-hover:text-red-400 group-hover:underline transition-colors">
                    {estudoSentinela.titulo}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-4 py-3 px-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                <FileText className="h-7 w-7 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Não disponível para esta semana</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
