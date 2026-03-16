"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  ChevronRight, 
  BookMarked,
  Music,
  FileText,
  Calendar
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useSync } from "@/lib/contexts/sync-context"

const meses = [
  { valor: 1, nome: "Janeiro" },
  { valor: 2, nome: "Fevereiro" },
  { valor: 3, nome: "Março" },
  { valor: 4, nome: "Abril" },
  { valor: 5, nome: "Maio" },
  { valor: 6, nome: "Junho" },
  { valor: 7, nome: "Julho" },
  { valor: 8, nome: "Agosto" },
  { valor: 9, nome: "Setembro" },
  { valor: 10, nome: "Outubro" },
  { valor: 11, nome: "Novembro" },
  { valor: 12, nome: "Dezembro" },
]

interface Estudo {
  id: string
  titulo: string
  data_estudo: string
  texto_tema: string | null
  cantico_inicial: number | null
  cantico_final: number | null
}

interface Paragrafo {
  id: string
  estudo_id: string
  numero: number
  conteudo: string
  perguntas: string | null
}

export default function ConsultaSentinelaPage() {
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [estudos, setEstudos] = useState<Estudo[]>([])
  const [paragrafos, setParagrafos] = useState<Paragrafo[]>([])
  const [loading, setLoading] = useState(true)
  const [estudoAtivo, setEstudoAtivo] = useState(0)
  const { syncTrigger } = useSync()

  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      // Buscar mês
      const { data: mes } = await supabase
        .from("sentinela_meses")
        .select("id")
        .eq("mes", mesAtual)
        .eq("ano", anoAtual)
        .single()

      if (mes) {
        // Carregar estudos do mês
        const { data: estudosData } = await supabase
          .from("sentinela_estudos")
          .select("*")
          .eq("mes_id", mes.id)
          .order("data_estudo")
        
        setEstudos(estudosData || [])
        
        if (estudosData && estudosData.length > 0) {
          // Carregar parágrafos de todos os estudos
          const { data: paragrafosData } = await supabase
            .from("sentinela_paragrafos")
            .select("*")
            .in("estudo_id", estudosData.map(e => e.id))
            .order("numero")
          
          setParagrafos(paragrafosData || [])
        } else {
          setParagrafos([])
        }
      } else {
        setEstudos([])
        setParagrafos([])
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }, [mesAtual, anoAtual, supabase, syncTrigger])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const mesAnterior = () => {
    if (mesAtual === 1) {
      setMesAtual(12)
      setAnoAtual(anoAtual - 1)
    } else {
      setMesAtual(mesAtual - 1)
    }
    setEstudoAtivo(0)
  }

  const mesProximo = () => {
    if (mesAtual === 12) {
      setMesAtual(1)
      setAnoAtual(anoAtual + 1)
    } else {
      setMesAtual(mesAtual + 1)
    }
    setEstudoAtivo(0)
  }

  const estudoAtual = estudos[estudoAtivo]
  const paragrafosAtuais = paragrafos.filter(p => p.estudo_id === estudoAtual?.id)

  const formatarData = (data: string) => {
    return new Date(data + "T12:00:00").toLocaleDateString("pt-BR", { 
      day: "2-digit", 
      month: "long",
      year: "numeric"
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Estudo de A Sentinela</h1>
        <p className="text-zinc-400">Artigos de estudo por mês</p>
      </div>

      {/* Navegação de Mês */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={mesAnterior}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">
                {meses.find(m => m.valor === mesAtual)?.nome} {anoAtual}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={mesProximo}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center text-zinc-500 py-12">Carregando...</div>
      ) : estudos.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="py-12 text-center text-zinc-500">
            Nenhum estudo cadastrado para este mês
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Seletor de Estudos */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {estudos.map((estudo, index) => (
              <Button
                key={estudo.id}
                variant={estudoAtivo === index ? "default" : "outline"}
                size="sm"
                onClick={() => setEstudoAtivo(index)}
                className="whitespace-nowrap"
              >
                Estudo {index + 1}
              </Button>
            ))}
          </div>

          {/* Conteúdo do Estudo */}
          {estudoAtual && (
            <div className="space-y-4">
              {/* Header do Estudo */}
              <Card className="bg-gradient-to-r from-red-900/30 to-zinc-900 border-red-800/50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Calendar className="w-4 h-4" />
                      <span>Semana de {formatarData(estudoAtual.data_estudo)}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      {estudoAtual.titulo}
                    </h2>
                    {estudoAtual.texto_tema && (
                      <p className="text-zinc-300 italic border-l-2 border-red-500 pl-4">
                        {estudoAtual.texto_tema}
                      </p>
                    )}
                    <div className="flex gap-4 pt-2">
                      {estudoAtual.cantico_inicial && (
                        <div className="flex items-center gap-1 text-sm text-zinc-400">
                          <Music className="w-4 h-4" />
                          <span>Cântico Inicial: {estudoAtual.cantico_inicial}</span>
                        </div>
                      )}
                      {estudoAtual.cantico_final && (
                        <div className="flex items-center gap-1 text-sm text-zinc-400">
                          <Music className="w-4 h-4" />
                          <span>Cântico Final: {estudoAtual.cantico_final}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Parágrafos */}
              {paragrafosAtuais.length > 0 && (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-white">
                      <FileText className="w-4 h-4 text-red-500" />
                      Parágrafos ({paragrafosAtuais.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {paragrafosAtuais.map((paragrafo) => (
                      <div 
                        key={paragrafo.id} 
                        className="bg-zinc-800/50 rounded-lg p-4"
                      >
                        <div className="flex gap-3">
                          <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded text-sm font-bold h-fit">
                            {paragrafo.numero}
                          </span>
                          <div className="flex-1 space-y-2">
                            <p className="text-zinc-300 leading-relaxed">
                              {paragrafo.conteudo}
                            </p>
                            {paragrafo.perguntas && (
                              <p className="text-sm text-zinc-500 italic border-l-2 border-zinc-700 pl-3">
                                {paragrafo.perguntas}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
