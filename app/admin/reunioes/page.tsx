"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, BookOpen, FileText, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

interface Semana {
  id: string
  data_inicio: string
  data_fim: string
  leitura_semanal: string
  mes_id: string
}

interface Estudo {
  id: string
  titulo: string
  data_estudo: string
  mes_id: string
}

export default function ReunioesPage() {
  const [semanas, setSemanas] = useState<Semana[]>([])
  const [estudos, setEstudos] = useState<Estudo[]>([])
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [loading, setLoading] = useState(true)

  const carregarDados = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    // Carregar semanas de Vida e Ministério
    const { data: semanasData } = await supabase
      .from("vida_ministerio_semanas")
      .select("*")
      .order("data_inicio", { ascending: true })

    // Carregar estudos de Sentinela
    const { data: estudosData } = await supabase
      .from("sentinela_estudos")
      .select("*")
      .order("data_estudo", { ascending: true })

    setSemanas(semanasData || [])
    setEstudos(estudosData || [])

    // Encontrar semana atual
    if (semanasData && semanasData.length > 0) {
      const hoje = new Date()
      const indiceSemanaAtual = semanasData.findIndex((s) => {
        const inicio = new Date(s.data_inicio)
        const fim = new Date(s.data_fim)
        fim.setHours(23, 59, 59, 999)
        return hoje >= inicio && hoje <= fim
      })
      setIndiceAtual(indiceSemanaAtual >= 0 ? indiceSemanaAtual : 0)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const semanaAtual = semanas[indiceAtual]

  // Encontrar estudo correspondente pela data
  const estudoAtual = semanaAtual
    ? estudos.find((e) => {
        const dataEstudo = new Date(e.data_estudo)
        const dataInicio = new Date(semanaAtual.data_inicio)
        const diffDias = Math.abs(
          (dataEstudo.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)
        )
        return diffDias <= 7
      })
    : null

  const irParaSemanaAnterior = () => {
    if (indiceAtual > 0) {
      setIndiceAtual(indiceAtual - 1)
    }
  }

  const irParaProximaSemana = () => {
    if (indiceAtual < semanas.length - 1) {
      setIndiceAtual(indiceAtual + 1)
    }
  }

  // Verificar se é a semana atual
  const isEstaSemana = semanaAtual
    ? (() => {
        const hoje = new Date()
        const inicio = new Date(semanaAtual.data_inicio)
        const fim = new Date(semanaAtual.data_fim)
        fim.setHours(23, 59, 59, 999)
        return hoje >= inicio && hoje <= fim
      })()
    : false

  // Formatar semana para exibição
  const formatarSemana = (dataInicio: string, dataFim: string) => {
    const inicio = new Date(dataInicio)
    const fim = new Date(dataFim)
    const diaInicio = inicio.getDate()
    const diaFim = fim.getDate()
    const mes = inicio.toLocaleDateString("pt-BR", { month: "long" })
    return `${diaInicio}-${diaFim} de ${mes}`
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!semanaAtual) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <p className="text-muted-foreground mb-4">Nenhuma reunião disponível</p>
        <p className="text-sm text-muted-foreground">
          Cadastre semanas em{" "}
          <Link href="/admin/vida-ministerio" className="text-blue-500 hover:underline">
            Vida e Ministério
          </Link>{" "}
          e{" "}
          <Link href="/admin/sentinela" className="text-blue-500 hover:underline">
            Estudo Sentinela
          </Link>
        </p>
      </div>
    )
  }

  const semanaFormatada = formatarSemana(semanaAtual.data_inicio, semanaAtual.data_fim)

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
          disabled={indiceAtual === semanas.length - 1}
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
          <Link href="/admin/vida-ministerio" className="block">
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
                    {semanaAtual.leitura_semanal || "Leitura da semana"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Estudo de A Sentinela */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">Estudo de A Sentinela</h2>
          {estudoAtual ? (
            <Link href="/admin/sentinela" className="block">
              <Card className="group cursor-pointer border-0 bg-card/50 shadow-sm transition-all hover:shadow-md hover:bg-accent/30">
                <CardContent className="flex items-center gap-5 p-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex-shrink-0 shadow-lg group-hover:shadow-red-500/25 transition-shadow">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase text-muted-foreground tracking-wider font-medium mb-1">
                      {semanaFormatada}
                    </p>
                    <p className="text-base font-medium text-red-500 transition-colors group-hover:text-red-400">
                      {estudoAtual.titulo}
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
                  <Link
                    href="/admin/sentinela"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Cadastrar estudo
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
