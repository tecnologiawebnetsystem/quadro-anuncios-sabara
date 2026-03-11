"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Calendar, BookMarked, User } from "lucide-react"
import { estudosMarco } from "@/lib/data/estudos-marco"
import { estudosAbril } from "@/lib/data/estudos-abril"
import { estudosMaio } from "@/lib/data/estudos-maio"
import { useDesignacoes } from "@/lib/hooks/use-designacoes"

// Componente para exibir dirigente/leitor na lista
function EstudoCard({ estudo, mes }: { estudo: typeof estudosMarco[0]; mes: string }) {
  const reuniaoId = `sentinela_${mes}_${estudo.id}`
  const { getDesignacao, carregando } = useDesignacoes(reuniaoId)

  const dirigente = getDesignacao("sentinela_dirigente")
  const leitor = getDesignacao("sentinela_leitor")

  return (
    <Link href={`/consulta/reunioes/sentinela/${mes}/${estudo.id}`}>
      <Card className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer group">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="text-xs text-purple-400 border-purple-700/50">
                  {estudo.data}
                </Badge>
              </div>
              <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors mb-1 line-clamp-2">
                {estudo.titulo}
              </h3>
              <p className="text-sm text-zinc-500 mb-3 line-clamp-1">
                {estudo.textoTema}
              </p>
              
              {/* Designações */}
              <div className="flex flex-wrap gap-2">
                {carregando ? (
                  <span className="text-xs text-zinc-600">Carregando...</span>
                ) : (
                  <>
                    {dirigente?.publicador_nome && (
                      <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30 text-xs">
                        <User className="w-3 h-3 mr-1" />
                        Dirigente: {dirigente.publicador_nome}
                      </Badge>
                    )}
                    {leitor?.publicador_nome && (
                      <Badge className="bg-emerald-600/20 text-emerald-300 border-emerald-600/30 text-xs">
                        <User className="w-3 h-3 mr-1" />
                        Leitor: {leitor.publicador_nome}
                      </Badge>
                    )}
                    {!dirigente?.publicador_nome && !leitor?.publicador_nome && (
                      <span className="text-xs text-zinc-600 italic">Sem designações</span>
                    )}
                  </>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function SentinelaConsultaPage() {
  const meses = [
    { nome: "Março 2025", key: "marco", estudos: estudosMarco },
    { nome: "Abril 2025", key: "abril", estudos: estudosAbril },
    { nome: "Maio 2025", key: "maio", estudos: estudosMaio },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Estudo Sentinela
            </h1>
            <p className="text-zinc-400 text-sm">
              Dirigentes e leitores designados
            </p>
          </div>
        </div>
      </div>

      {/* Meses */}
      <div className="space-y-8">
        {meses.map((mes) => (
          <div key={mes.key}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-zinc-500" />
              {mes.nome}
            </h2>
            <div className="space-y-3">
              {mes.estudos.map((estudo) => (
                <EstudoCard key={estudo.id} estudo={estudo} mes={mes.key} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
