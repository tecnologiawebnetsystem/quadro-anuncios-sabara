"use client"

import { use } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  BookMarked, 
  Music,
  User,
  BookOpen,
  HelpCircle,
  MessageSquare,
  RotateCcw
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
        
        <div className="flex items-start gap-3 mb-4">
          <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400 flex-shrink-0">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs text-purple-400 border-purple-700/50">
                {estudo.semana}
              </Badge>
              <span className="text-xs text-zinc-500">
                {estudo.dataInicio}-{estudo.dataFim}
              </span>
            </div>
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
            <p className="text-purple-400 text-sm mt-1">{estudo.textoTemaRef}</p>
          </div>
          {estudo.objetivo && (
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <p className="text-zinc-400 text-sm text-center">
                <strong className="text-zinc-300">Objetivo:</strong> {estudo.objetivo}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Perguntas do Estudo */}
      {estudo.perguntas && estudo.perguntas.length > 0 && (
        <Card className="bg-zinc-900/50 border-zinc-800 mb-6">
          <CardContent className="py-6">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Perguntas do Estudo</h3>
            </div>
            
            <div className="space-y-6">
              {estudo.perguntas.map((pergunta, index) => (
                <div key={index} className="border-l-2 border-purple-600/50 pl-4">
                  {/* Número do Parágrafo */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-purple-600/30 text-purple-300 border-purple-600/40 text-xs">
                      Parágrafo {pergunta.paragrafo}
                    </Badge>
                  </div>
                  
                  {/* Texto do Parágrafo */}
                  {pergunta.textoBase && (
                    <div className="mb-4 bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                      <p className="text-zinc-300 text-sm leading-relaxed">{pergunta.textoBase}</p>
                    </div>
                  )}
                  
                  {/* Pergunta */}
                  <div className="mb-3">
                    <div className="flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                      <p className="text-white font-medium">{pergunta.pergunta}</p>
                    </div>
                  </div>
                  
                  {/* Resposta */}
                  <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-700/30">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                      <p className="text-emerald-200 text-sm leading-relaxed">{pergunta.resposta}</p>
                    </div>
                  </div>
                  
                  {/* Imagem se houver */}
                  {pergunta.imagem && (
                    <div className="mt-4">
                      <div className="relative rounded-lg overflow-hidden bg-zinc-800">
                        <Image
                          src={pergunta.imagem}
                          alt={pergunta.imagemDescricao || "Imagem do estudo"}
                          width={800}
                          height={450}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                      {pergunta.imagemLegenda && (
                        <p className="text-xs text-zinc-500 mt-2 text-center italic">
                          {pergunta.imagemLegenda}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Perguntas de Recapitulação */}
      {estudo.recapitulacao && estudo.recapitulacao.length > 0 && (
        <Card className="bg-zinc-900/50 border-zinc-800 mb-6">
          <CardContent className="py-6">
            <div className="flex items-center gap-2 mb-6">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">Perguntas de Recapitulação</h3>
            </div>
            
            <div className="space-y-4">
              {estudo.recapitulacao.map((item, index) => (
                <div key={index} className="border-l-2 border-amber-600/50 pl-4">
                  {/* Pergunta */}
                  <div className="mb-2">
                    <div className="flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                      <p className="text-white font-medium">{item.pergunta}</p>
                    </div>
                  </div>
                  
                  {/* Resposta */}
                  <div className="bg-amber-900/20 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-amber-300 mt-1 flex-shrink-0" />
                      <p className="text-zinc-300 text-sm leading-relaxed">{item.resposta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cântico Final */}
      <Card className="bg-gradient-to-r from-purple-900/30 via-purple-800/20 to-purple-900/30 border-purple-700/30">
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-3">
            <Music className="w-5 h-5 text-purple-400" />
            <div className="text-center">
              <p className="text-purple-400 font-bold">CÂNTICO {estudo.canticoFinal}</p>
              <p className="text-zinc-400 text-sm">{estudo.canticoFinalTitulo}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
