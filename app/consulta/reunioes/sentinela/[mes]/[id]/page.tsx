"use client"

import { use } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  BookMarked, 
  Music,
  User,
  BookOpen
} from "lucide-react"
import { estudosMarco } from "@/lib/data/estudos-marco"
import { estudosAbril } from "@/lib/data/estudos-abril"
import { estudosMaio } from "@/lib/data/estudos-maio"
import { useDesignacoes } from "@/lib/hooks/use-designacoes"

const estudosPorMes: Record<string, typeof estudosMarco> = {
  marco: estudosMarco,
  abril: estudosAbril,
  maio: estudosMaio,
}

export default function SentinelaDetalheConsulta({ 
  params 
}: { 
  params: Promise<{ mes: string; id: string }> 
}) {
  const { mes, id } = use(params)
  const estudos = estudosPorMes[mes] || []
  const estudo = estudos.find(e => e.id === Number(id))
  
  const reuniaoId = `sentinela_${mes}_${id}`
  const { getDesignacao, carregando } = useDesignacoes(reuniaoId)

  if (!estudo) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-zinc-400">Estudo não encontrado</p>
        <Link href="/consulta/reunioes/sentinela" className="text-purple-400 hover:underline mt-4 inline-block">
          Voltar
        </Link>
      </div>
    )
  }

  const dirigente = getDesignacao("sentinela_dirigente")
  const leitor = getDesignacao("sentinela_leitor")

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/consulta/reunioes/sentinela" 
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Voltar</span>
        </Link>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <Badge variant="outline" className="text-xs text-purple-400 border-purple-700/50 mb-1">
              {estudo.data}
            </Badge>
            <h1 className="text-xl font-bold text-white">
              {estudo.titulo}
            </h1>
          </div>
        </div>
      </div>

      {/* Cântico Inicial */}
      <Card className="bg-gradient-to-r from-purple-900/30 via-purple-800/20 to-purple-900/30 border-purple-700/30 mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-3">
            <Music className="w-5 h-5 text-purple-400" />
            <div className="text-center">
              <p className="text-purple-400 font-bold">CÂNTICO {estudo.canticoInicial}</p>
              <p className="text-zinc-400 text-sm">{estudo.canticoInicialTitulo}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Designações */}
      <Card className="bg-zinc-900/50 border-zinc-800 mb-6">
        <CardContent className="py-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-4 text-center">DESIGNAÇÕES</h3>
          
          {carregando ? (
            <p className="text-center text-zinc-600">Carregando...</p>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-xs text-zinc-500 mb-2">Dirigente</p>
                {dirigente?.publicador_nome ? (
                  <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30 text-sm px-4 py-2">
                    <User className="w-4 h-4 mr-2" />
                    {dirigente.publicador_nome}
                  </Badge>
                ) : (
                  <span className="text-zinc-600 italic text-sm">Não designado</span>
                )}
              </div>
              
              <div className="text-center">
                <p className="text-xs text-zinc-500 mb-2">Leitor</p>
                {leitor?.publicador_nome ? (
                  <Badge className="bg-emerald-600/20 text-emerald-300 border-emerald-600/30 text-sm px-4 py-2">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {leitor.publicador_nome}
                  </Badge>
                ) : (
                  <span className="text-zinc-600 italic text-sm">Não designado</span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tema e Texto */}
      <Card className="bg-zinc-900/50 border-zinc-800 mb-6">
        <CardContent className="py-6">
          <div className="text-center mb-4">
            <p className="text-zinc-400 text-sm mb-2">Texto Tema</p>
            <p className="text-white font-medium text-lg italic">"{estudo.textoTema}"</p>
            <p className="text-purple-400 text-sm mt-1">{estudo.textoTemaReferencia}</p>
          </div>
        </CardContent>
      </Card>

      {/* Perguntas */}
      {estudo.perguntas && estudo.perguntas.length > 0 && (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="py-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-4">PERGUNTAS DO ESTUDO</h3>
            <div className="space-y-3">
              {estudo.perguntas.slice(0, 5).map((pergunta, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/30">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 text-xs font-bold">
                    {pergunta.numero}
                  </div>
                  <p className="text-zinc-300 text-sm">{pergunta.texto}</p>
                </div>
              ))}
              {estudo.perguntas.length > 5 && (
                <p className="text-zinc-500 text-sm text-center">
                  E mais {estudo.perguntas.length - 5} perguntas...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
