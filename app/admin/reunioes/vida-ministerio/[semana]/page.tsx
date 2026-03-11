"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Gem, Wheat, Heart, Music, Clock, FileText, Loader2 } from "lucide-react"
import { reunioesMarco2026 } from "@/lib/data/vida-ministerio-marco"
import { semanasAbril } from "@/lib/data/vida-ministerio-abril"
import { SeletorPublicador, type FiltroPublicador } from "@/components/reuniao/seletor-publicador"
import { useDesignacoes } from "@/lib/hooks/use-designacoes"
import { type Publicador } from "@/lib/store/publicadores"
import { useEffect, useState } from "react"

// Mapeamento de partes para seus filtros de publicador
const FILTROS_PARTES: Record<string, FiltroPublicador> = {
  // Presidente - apenas anciãos
  presidente: "anciao",
  // Tesouros da Palavra de Deus
  tesouros_1: "anciao_servo", // Discurso - ancião ou servo
  tesouros_2: "anciao_servo", // Joias espirituais - ancião ou servo
  tesouros_3: "todos", // Leitura da Bíblia - qualquer irmão
  // Faça seu Melhor no Ministério
  ministerio_4: "todos",
  ministerio_5: "todos",
  ministerio_6: "todos",
  ministerio_7: "todos",
  // Nossa Vida Cristã
  vida_crista_8: "anciao_servo",
  vida_crista_9: "anciao_servo",
  vida_crista_10: "anciao_servo",
  vida_crista_estudo: "anciao",
  // Oração final - qualquer publicador (igual à leitura da Bíblia)
  oracao_final: "todos",
}

// Labels para os filtros
const FILTRO_LABELS: Record<FiltroPublicador, string> = {
  anciao: "Apenas anciãos",
  servo: "Apenas servos",
  anciao_servo: "Ancião ou Servo",
  todos: "Qualquer publicador",
  irmaos: "Irmão batizado",
}

export default function SemanaDetalhesPage({ params }: { params: Promise<{ semana: string }> }) {
  const { semana } = use(params)
  const router = useRouter()
  const [salvando, setSalvando] = useState<string | null>(null)

  // Buscar a reunião pelo ID em todos os meses
  const todasReunioes = [...reunioesMarco2026, ...semanasAbril]
  const reuniao = todasReunioes.find(r => r.id === semana)

  // Hook para gerenciar designações
  const { designacoes, loading, salvarDesignacao, removerDesignacao, getDesignacao } = useDesignacoes(semana)

  // Handler para selecionar publicador
  const handleSelecionarPublicador = async (tipoParte: string, publicador: Publicador | null) => {
    setSalvando(tipoParte)
    
    if (publicador) {
      // Manter o ajudante existente se houver
      const designacaoExistente = getDesignacao(tipoParte)
      await salvarDesignacao(
        tipoParte, 
        publicador.id, 
        publicador.nome,
        designacaoExistente?.ajudante_id,
        designacaoExistente?.ajudante_nome
      )
    } else {
      await removerDesignacao(tipoParte)
    }
    
    setSalvando(null)
  }

  // Handler para selecionar ajudante
  const handleSelecionarAjudante = async (tipoParte: string, ajudante: Publicador | null) => {
    setSalvando(`${tipoParte}_ajudante`)
    
    const designacaoExistente = getDesignacao(tipoParte)
    if (designacaoExistente) {
      await salvarDesignacao(
        tipoParte,
        designacaoExistente.publicador_id,
        designacaoExistente.publicador_nome,
        ajudante?.id || null,
        ajudante?.nome || null
      )
    }
    
    setSalvando(null)
  }

  // Partes que podem ter ajudante (Iniciando conversa, Cultivando interesse)
  const partesComAjudante = ["Iniciando conversa", "Cultivando o interesse"]
  
  // Verificar se é parte com ajudante
  const temAjudante = (titulo: string) => {
    return partesComAjudante.some(p => titulo.toLowerCase().includes(p.toLowerCase()))
  }

  if (!reuniao) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Reunião não encontrada.</p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    )
  }

  // Componente para mostrar o seletor de publicador
  const DesignacaoSelector = ({ 
    tipoParte, 
    filtro, 
    mostrarAjudante = false 
  }: { 
    tipoParte: string; 
    filtro: FiltroPublicador;
    mostrarAjudante?: boolean;
  }) => {
    const designacao = getDesignacao(tipoParte)
    const isSalvando = salvando === tipoParte
    const isSalvandoAjudante = salvando === `${tipoParte}_ajudante`

    return (
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <SeletorPublicador
            value={designacao?.publicador_id}
            onSelect={(p) => handleSelecionarPublicador(tipoParte, p)}
            filtro={filtro}
            placeholder={FILTRO_LABELS[filtro]}
            className="w-[180px]"
            disabled={isSalvando}
          />
          {isSalvando && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        
        {mostrarAjudante && designacao?.publicador_id && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Ajudante:</span>
            <SeletorPublicador
              value={designacao?.ajudante_id || undefined}
              onSelect={(p) => handleSelecionarAjudante(tipoParte, p)}
              filtro="todos"
              placeholder="Selecionar..."
              className="w-[160px]"
              disabled={isSalvandoAjudante}
              side="right"
            />
            {isSalvandoAjudante && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
        )}
      </div>
    )
  }

  // Componente para o Estudo Bíblico com leitor
  const EstudoBiblicoSelector = ({ tipoParte }: { tipoParte: string }) => {
    const designacao = getDesignacao(tipoParte)
    const tipoParteLeitor = `${tipoParte}_leitor`
    const designacaoLeitor = getDesignacao(tipoParteLeitor)
    const isSalvando = salvando === tipoParte
    const isSalvandoLeitor = salvando === tipoParteLeitor

    return (
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Dirigente:</span>
          <SeletorPublicador
            value={designacao?.publicador_id}
            onSelect={(p) => handleSelecionarPublicador(tipoParte, p)}
            filtro="anciao"
            placeholder="Apenas anciãos"
            className="w-[160px]"
            disabled={isSalvando}
          />
          {isSalvando && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Leitor:</span>
          <SeletorPublicador
            value={designacaoLeitor?.publicador_id}
            onSelect={(p) => handleSelecionarPublicador(tipoParteLeitor, p)}
            filtro="todos"
            placeholder="Qualquer irmão"
            className="w-[160px]"
            disabled={isSalvandoLeitor}
            side="right"
          />
          {isSalvandoLeitor && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{reuniao.semana}</h1>
          <p className="text-muted-foreground">{reuniao.leituraSemana}</p>
        </div>
      </div>

      {/* Informações Iniciais com Presidente */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Seletor de Presidente */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-700">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Presidente:</span>
              </div>
              <DesignacaoSelector tipoParte="presidente" filtro="anciao" />
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Cântico {reuniao.canticoInicial}</span>
                <span className="text-muted-foreground">e oração</span>
              </div>
              <Separator orientation="vertical" className="h-6 hidden md:block" />
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Comentários iniciais ({reuniao.comentariosIniciais})</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TESOUROS DA PALAVRA DE DEUS */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <Gem className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-blue-400">TESOUROS DA PALAVRA DE DEUS</h2>
        </div>

        <div className="space-y-3">
          {reuniao.tesouros.partes.map((parte) => {
            const tipoParte = `tesouros_${parte.numero}`
            const filtro = FILTROS_PARTES[tipoParte] || "anciao_servo"
            
            return (
              <Card key={parte.numero} className="bg-zinc-900/50 border-zinc-800 border-l-4 border-l-blue-600">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {parte.numero}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-blue-300">{parte.titulo}</h3>
                          <Badge variant="outline" className="text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {parte.duracao}
                          </Badge>
                        </div>
                        <DesignacaoSelector tipoParte={tipoParte} filtro={filtro} />
                      </div>
                      
                      {parte.descricao && (
                        <p className="text-sm text-muted-foreground">{parte.descricao}</p>
                      )}

                      {parte.textosBiblicos && parte.textosBiblicos.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {parte.textosBiblicos.map((texto, i) => (
                            <Badge key={i} variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30">
                              {texto}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {parte.perguntasPesquisa && (
                        <div className="mt-3 p-3 bg-blue-600/10 rounded-lg border border-blue-600/20">
                          <p className="text-xs text-blue-400 font-medium mb-1">PARA PESQUISAR:</p>
                          <p className="text-sm text-white">{parte.perguntasPesquisa}</p>
                        </div>
                      )}

                      {parte.joiasEspirituais && parte.joiasEspirituais.length > 0 && (
                        <div className="space-y-3 mt-3">
                          {parte.joiasEspirituais.map((joia, i) => (
                            <div key={i} className="p-3 bg-blue-600/10 rounded-lg border border-blue-600/20">
                              <p className="text-sm text-blue-300 font-medium">{joia.texto}</p>
                              <p className="text-sm text-white mt-1">{joia.pergunta}</p>
                              {joia.referencia && (
                                <p className="text-xs text-muted-foreground mt-2">({joia.referencia})</p>
                              )}
                            </div>
                          ))}
                          <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                            <p className="text-sm text-muted-foreground italic">
                              Que joias espirituais você encontrou na leitura da Bíblia desta semana?
                            </p>
                          </div>
                        </div>
                      )}

                      {parte.referencia && !parte.joiasEspirituais && (
                        <p className="text-xs text-muted-foreground italic">({parte.referencia})</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* FAÇA SEU MELHOR NO MINISTÉRIO */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center">
            <Wheat className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-amber-400">FAÇA SEU MELHOR NO MINISTÉRIO</h2>
        </div>

        <div className="space-y-3">
          {reuniao.ministerio.partes.map((parte) => {
            const tipoParte = `ministerio_${parte.numero}`
            const filtro = FILTROS_PARTES[tipoParte] || "todos"
            const podeAjudante = temAjudante(parte.titulo)
            
            return (
              <Card key={parte.numero} className="bg-zinc-900/50 border-zinc-800 border-l-4 border-l-amber-600">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
                      {parte.numero}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-amber-300">{parte.titulo}</h3>
                            <Badge variant="outline" className="text-muted-foreground">
                              <Clock className="w-3 h-3 mr-1" />
                              {parte.duracao}
                            </Badge>
                          </div>
                          {parte.tipo && (
                            <Badge className="bg-amber-600/20 text-amber-300 border-amber-600/30 w-fit">
                              {parte.tipo}
                            </Badge>
                          )}
                        </div>
                        <DesignacaoSelector 
                          tipoParte={tipoParte} 
                          filtro={filtro} 
                          mostrarAjudante={podeAjudante}
                        />
                      </div>

                      {parte.descricao && (
                        <p className="text-sm text-muted-foreground">{parte.descricao}</p>
                      )}

                      {parte.referencia && (
                        <p className="text-xs text-muted-foreground italic">({parte.referencia})</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* NOSSA VIDA CRISTÃ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-700 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-red-400">NOSSA VIDA CRISTÃ</h2>
        </div>

        {/* Cântico do Meio */}
        <Card className="bg-red-700/10 border-red-700/30">
          <CardContent className="py-3">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-red-400" />
              <span className="font-medium text-red-300">Cântico {reuniao.canticoMeio}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {reuniao.vidaCrista.partes.map((parte) => {
            const isEstudoBiblico = parte.titulo.toLowerCase().includes("estudo bíblico")
            const tipoParte = isEstudoBiblico ? "vida_crista_estudo" : `vida_crista_${parte.numero}`
            const filtro = FILTROS_PARTES[tipoParte] || "anciao_servo"
            
            return (
              <Card key={parte.numero} className="bg-zinc-900/50 border-zinc-800 border-l-4 border-l-red-700">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-700 flex items-center justify-center text-white font-bold text-sm">
                      {parte.numero}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-red-300">{parte.titulo}</h3>
                          <Badge variant="outline" className="text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {parte.duracao}
                          </Badge>
                        </div>
                        {isEstudoBiblico ? (
                          <EstudoBiblicoSelector tipoParte={tipoParte} />
                        ) : (
                          <DesignacaoSelector tipoParte={tipoParte} filtro={filtro} />
                        )}
                      </div>

                      {parte.descricao && (
                        <p className="text-sm text-muted-foreground">{parte.descricao}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Encerramento */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Comentários finais ({reuniao.comentariosFinais})</span>
              </div>
              <Separator orientation="vertical" className="h-6 hidden md:block" />
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-red-400" />
                <span className="font-medium">Cântico {reuniao.canticoFinal}</span>
                <span className="text-muted-foreground">e oração</span>
              </div>
            </div>

            {/* Seletor de Oração Final */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-700">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Oração final:</span>
              </div>
              <DesignacaoSelector tipoParte="oracao_final" filtro="anciao_servo" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
