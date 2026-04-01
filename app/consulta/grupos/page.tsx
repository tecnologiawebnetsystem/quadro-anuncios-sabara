"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CenteredLoader } from "@/components/ui/page-loader"
import { Users, User, Shield, Loader2 } from "lucide-react"
import { usePublicadoresSupabase } from "@/lib/hooks/use-publicadores-supabase"

export default function GruposConsultaPage() {
  const { 
    publicadores, 
    grupos, 
    carregando, 
    erro,
    getPublicadoresPorGrupo,
    getDirigente,
    getAuxiliar 
  } = usePublicadoresSupabase()
  
  if (carregando) return <CenteredLoader />

  if (erro) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-2">{erro}</p>
          <p className="text-zinc-500 text-sm">Tente recarregar a página</p>
        </div>
      </div>
    )
  }

  // Agrupar publicadores por grupo
  const publicadoresPorGrupo = grupos.map(grupo => {
    const membros = getPublicadoresPorGrupo(grupo.id)
    const dirigente = getDirigente(grupo.id)
    const auxiliar = getAuxiliar(grupo.id)
    
    return {
      ...grupo,
      membros,
      dirigente,
      auxiliar,
      totalMembros: membros.length,
      anciaos: membros.filter(m => m.anciao).length,
      servos: membros.filter(m => m.servo_ministerial).length,
    }
  })

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Grupos de Serviço
            </h1>
            <p className="text-zinc-400 text-sm">
              {grupos.length} grupos | {publicadores.filter(p => p.ativo).length} publicadores ativos
            </p>
          </div>
        </div>
      </div>

      {/* Grupos */}
      <div className="grid gap-6 md:grid-cols-2">
        {publicadoresPorGrupo.map((grupo) => (
          <Card key={grupo.id} className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold">
                    {grupo.numero}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Grupo {grupo.numero}</h3>
                    {grupo.dirigente && (
                      <p className="text-sm">
                        <span className="text-zinc-500">Dirigente:</span>{" "}
                        <span className="text-emerald-400">{grupo.dirigente.nome}</span>
                      </p>
                    )}
                    {grupo.auxiliar && (
                      <p className="text-sm">
                        <span className="text-zinc-500">Auxiliar:</span>{" "}
                        <span className="text-blue-400">{grupo.auxiliar.nome}</span>
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-zinc-500 border-zinc-700">
                  {grupo.totalMembros} membros
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                {grupo.anciaos > 0 && (
                  <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30 text-xs">
                    {grupo.anciaos} ancião{grupo.anciaos > 1 ? 's' : ''}
                  </Badge>
                )}
                {grupo.servos > 0 && (
                  <Badge className="bg-amber-600/20 text-amber-300 border-amber-600/30 text-xs">
                    {grupo.servos} servo{grupo.servos > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                {grupo.membros.map((membro) => (
                  <div 
                    key={membro.id} 
                    className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/30"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm text-zinc-300">{membro.nome}</span>
                    </div>
                    <div className="flex gap-1">
                      {membro.anciao && (
                        <Badge className="bg-blue-600/20 text-blue-400 border-0 text-xs px-1.5">
                          <Shield className="w-3 h-3" />
                        </Badge>
                      )}
                      {membro.servo_ministerial && (
                        <Badge className="bg-amber-600/20 text-amber-400 border-0 text-xs px-1.5">
                          SM
                        </Badge>
                      )}
                      {membro.pioneiro_regular && (
                        <Badge className="bg-emerald-600/20 text-emerald-400 border-0 text-xs px-1.5">
                          PR
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legenda */}
      <Card className="mt-8 bg-zinc-900/30 border-zinc-800">
        <CardContent className="py-4">
          <p className="text-xs text-zinc-500 text-center mb-3">LEGENDA</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600/20 text-blue-400 border-0 text-xs">
                <Shield className="w-3 h-3" />
              </Badge>
              <span className="text-xs text-zinc-400">Ancião</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-600/20 text-amber-400 border-0 text-xs">
                SM
              </Badge>
              <span className="text-xs text-zinc-400">Servo Ministerial</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600/20 text-emerald-400 border-0 text-xs">
                PR
              </Badge>
              <span className="text-xs text-zinc-400">Pioneiro Regular</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
