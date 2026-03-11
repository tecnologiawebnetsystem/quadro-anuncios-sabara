"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, User, Crown, Shield } from "lucide-react"
import { usePublicadoresStore } from "@/lib/store/publicadores"

// Grupos de serviço
const gruposServico = [
  { id: "1", nome: "Grupo 1 - Antônio V." },
  { id: "2", nome: "Grupo 2 - Cristian" },
  { id: "3", nome: "Grupo 3 - Guido" },
  { id: "4", nome: "Grupo 4 - Marcos" },
  { id: "5", nome: "Grupo 5 - Reinaldo" },
  { id: "6", nome: "Grupo 6 - Flávio" },
]

export default function GruposConsultaPage() {
  const publicadores = usePublicadoresStore((state) => state.publicadores)
  
  // Agrupar publicadores por grupo
  const publicadoresPorGrupo = gruposServico.map(grupo => {
    const membros = publicadores.filter(p => p.grupoServicoId === grupo.id && p.ativo)
    const dirigente = membros.find(m => m.anciao && m.id === (
      grupo.id === "1" ? "1" :
      grupo.id === "2" ? "19" :
      grupo.id === "3" ? "40" :
      grupo.id === "4" ? "60" :
      grupo.id === "5" ? "78" :
      grupo.id === "6" ? "97" : ""
    ))
    
    return {
      ...grupo,
      membros,
      dirigente,
      totalMembros: membros.length,
      anciaos: membros.filter(m => m.anciao).length,
      servos: membros.filter(m => m.servoMinisterial).length,
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
              {gruposServico.length} grupos | {publicadores.filter(p => p.ativo).length} publicadores ativos
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
                    {grupo.id}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Grupo {grupo.id}</h3>
                    {grupo.dirigente && (
                      <p className="text-emerald-400 text-sm flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        {grupo.dirigente.nome}
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
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
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
                      {membro.servoMinisterial && (
                        <Badge className="bg-amber-600/20 text-amber-400 border-0 text-xs px-1.5">
                          SM
                        </Badge>
                      )}
                      {membro.pioneiroRegular && (
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
