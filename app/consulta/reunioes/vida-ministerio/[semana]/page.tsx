"use client"

import { use } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  Clock, 
  Music, 
  Gem, 
  BookOpen, 
  Heart,
  User,
  Users
} from "lucide-react"
import { reunioesMarco } from "@/lib/data/vida-ministerio-marco"
import { useDesignacoes } from "@/lib/hooks/use-designacoes"

export default function VidaMinisterioDetalheConsulta({ 
  params 
}: { 
  params: Promise<{ semana: string }> 
}) {
  const { semana } = use(params)
  const reuniao = reunioesMarco.find(r => r.id === semana)
  const { getDesignacao, carregando } = useDesignacoes(semana)

  if (!reuniao) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-zinc-400">Reunião não encontrada</p>
        <Link href="/consulta/reunioes/vida-ministerio" className="text-blue-400 hover:underline mt-4 inline-block">
          Voltar
        </Link>
      </div>
    )
  }

  // Componente para exibir designação
  const DesignacaoExibir = ({ tipoParte, label }: { tipoParte: string; label?: string }) => {
    const designacao = getDesignacao(tipoParte)
    
    if (carregando) {
      return <span className="text-zinc-600 text-sm">Carregando...</span>
    }

    if (!designacao?.publicador_nome) {
      return <span className="text-zinc-600 text-sm italic">Não designado</span>
    }

    return (
      <div className="flex items-center gap-2">
        {label && <span className="text-zinc-500 text-xs">{label}</span>}
        <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30">
          <User className="w-3 h-3 mr-1" />
          {designacao.publicador_nome}
        </Badge>
        {designacao.ajudante_nome && (
          <Badge className="bg-emerald-600/20 text-emerald-300 border-emerald-600/30">
            <Users className="w-3 h-3 mr-1" />
            {designacao.ajudante_nome}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/consulta/reunioes/vida-ministerio" 
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Voltar</span>
        </Link>
        
        <h1 className="text-2xl font-bold text-white mb-1">
          {reuniao.semana}
        </h1>
        <p className="text-zinc-400">{reuniao.leituraSemanal}</p>
      </div>

      {/* Presidente */}
      <Card className="bg-zinc-900/50 border-zinc-800 mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">Cântico {reuniao.canticoInicial} e Oração</p>
                <p className="text-zinc-500 text-sm">Comentários Iniciais (1 min)</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 mb-1">Presidente</p>
              <DesignacaoExibir tipoParte="presidente" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TESOUROS DA PALAVRA DE DEUS */}
      <Card className="bg-zinc-900/50 border-zinc-800 border-l-4 border-l-blue-600 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-3 text-blue-400">
            <Gem className="w-5 h-5" />
            TESOUROS DA PALAVRA DE DEUS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reuniao.tesouros.partes.map((parte) => {
            const tipoParte = `tesouros_${parte.numero}`
            return (
              <div key={parte.numero} className="flex items-start gap-4 p-3 rounded-lg bg-zinc-800/30">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {parte.numero}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">{parte.titulo}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs text-zinc-500 border-zinc-700">
                          <Clock className="w-3 h-3 mr-1" />
                          {parte.duracao}
                        </Badge>
                      </div>
                    </div>
                    <DesignacaoExibir tipoParte={tipoParte} />
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* FAÇA SEU MELHOR NO MINISTÉRIO */}
      <Card className="bg-zinc-900/50 border-zinc-800 border-l-4 border-l-amber-600 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-3 text-amber-400">
            <BookOpen className="w-5 h-5" />
            FAÇA SEU MELHOR NO MINISTÉRIO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reuniao.ministerio.partes.map((parte) => {
            const tipoParte = `ministerio_${parte.numero}`
            return (
              <div key={parte.numero} className="flex items-start gap-4 p-3 rounded-lg bg-zinc-800/30">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm font-bold">
                  {parte.numero}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">{parte.titulo}</h4>
                      {parte.tipo && (
                        <Badge className="bg-amber-600/20 text-amber-300 border-amber-600/30 text-xs mt-1">
                          {parte.tipo}
                        </Badge>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs text-zinc-500 border-zinc-700">
                          <Clock className="w-3 h-3 mr-1" />
                          {parte.duracao}
                        </Badge>
                      </div>
                    </div>
                    <DesignacaoExibir tipoParte={tipoParte} />
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* NOSSA VIDA CRISTÃ */}
      <Card className="bg-zinc-900/50 border-zinc-800 border-l-4 border-l-red-700 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-3 text-red-400">
            <Heart className="w-5 h-5" />
            NOSSA VIDA CRISTÃ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reuniao.vidaCrista.partes.map((parte) => {
            const isEstudoBiblico = parte.titulo.toLowerCase().includes("estudo bíblico")
            const tipoParte = isEstudoBiblico ? "vida_crista_estudo" : `vida_crista_${parte.numero}`
            
            return (
              <div key={parte.numero} className="flex items-start gap-4 p-3 rounded-lg bg-zinc-800/30">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-red-700 flex items-center justify-center text-white text-sm font-bold">
                  {parte.numero}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">{parte.titulo}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs text-zinc-500 border-zinc-700">
                          <Clock className="w-3 h-3 mr-1" />
                          {parte.duracao}
                        </Badge>
                      </div>
                    </div>
                    {isEstudoBiblico ? (
                      <div className="flex flex-col gap-1 items-end">
                        <DesignacaoExibir tipoParte={tipoParte} label="Dirigente:" />
                        <DesignacaoExibir tipoParte={`${tipoParte}_leitor`} label="Leitor:" />
                      </div>
                    ) : (
                      <DesignacaoExibir tipoParte={tipoParte} />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Cântico Final e Oração */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-zinc-400" />
              <div>
                <p className="text-white font-medium">Cântico {reuniao.canticoFinal} e Oração</p>
              </div>
            </div>
            <DesignacaoExibir tipoParte="oracao_final" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
