"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, User, Shield, Users } from "lucide-react"
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

export default function PublicadoresConsultaPage() {
  const [busca, setBusca] = useState("")
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "anciao" | "servo">("todos")
  const publicadores = usePublicadoresStore((state) => state.publicadores)

  const publicadoresFiltrados = useMemo(() => {
    return publicadores
      .filter(p => p.ativo)
      .filter(p => {
        if (busca) {
          return p.nome.toLowerCase().includes(busca.toLowerCase())
        }
        return true
      })
      .filter(p => {
        if (filtroTipo === "anciao") return p.anciao
        if (filtroTipo === "servo") return p.servoMinisterial
        return true
      })
      .sort((a, b) => a.nome.localeCompare(b.nome))
  }, [busca, filtroTipo, publicadores])

  const stats = useMemo(() => ({
    total: publicadores.filter(p => p.ativo).length,
    anciaos: publicadores.filter(p => p.ativo && p.anciao).length,
    servos: publicadores.filter(p => p.ativo && p.servoMinisterial).length,
    pioneiros: publicadores.filter(p => p.ativo && p.pioneiroRegular).length,
  }), [publicadores])

  const getGrupoNome = (grupoId?: string) => {
    if (!grupoId) return null
    const grupo = gruposServico.find(g => g.id === grupoId)
    return grupo ? `Grupo ${grupo.id}` : null
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-amber-600/20 text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Publicadores
            </h1>
            <p className="text-zinc-400 text-sm">
              {stats.total} publicadores ativos na congregação
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-zinc-500">Total</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{stats.anciaos}</p>
            <p className="text-xs text-zinc-500">Anciãos</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{stats.servos}</p>
            <p className="text-xs text-zinc-500">Servos</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{stats.pioneiros}</p>
            <p className="text-xs text-zinc-500">Pioneiros</p>
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Buscar publicador..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-zinc-700 text-white"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFiltroTipo("todos")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroTipo === "todos"
                ? "bg-zinc-700 text-white"
                : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltroTipo("anciao")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroTipo === "anciao"
                ? "bg-blue-600/30 text-blue-300"
                : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            Anciãos
          </button>
          <button
            onClick={() => setFiltroTipo("servo")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroTipo === "servo"
                ? "bg-amber-600/30 text-amber-300"
                : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            Servos
          </button>
        </div>
      </div>

      {/* Lista */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-800">
            {publicadoresFiltrados.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-zinc-500">Nenhum publicador encontrado</p>
              </div>
            ) : (
              publicadoresFiltrados.map((pub) => (
                <div 
                  key={pub.id} 
                  className="flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{pub.nome}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {getGrupoNome(pub.grupoServicoId) && (
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {getGrupoNome(pub.grupoServicoId)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {pub.anciao && (
                      <Badge className="bg-blue-600/20 text-blue-400 border-0 text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Ancião
                      </Badge>
                    )}
                    {pub.servoMinisterial && (
                      <Badge className="bg-amber-600/20 text-amber-400 border-0 text-xs">
                        Servo
                      </Badge>
                    )}
                    {pub.pioneiroRegular && (
                      <Badge className="bg-emerald-600/20 text-emerald-400 border-0 text-xs">
                        Pioneiro
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-zinc-600 text-sm mt-4">
        Mostrando {publicadoresFiltrados.length} de {stats.total} publicadores
      </p>
    </div>
  )
}
