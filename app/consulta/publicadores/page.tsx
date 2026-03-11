"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, User, Shield, Users, Loader2 } from "lucide-react"
import { usePublicadoresSupabase } from "@/lib/hooks/use-publicadores-supabase"

export default function PublicadoresConsultaPage() {
  const [busca, setBusca] = useState("")
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "anciao" | "servo" | "pioneiro">("todos")
  
  const { publicadores, grupos, carregando, erro } = usePublicadoresSupabase()

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
        if (filtroTipo === "servo") return p.servo_ministerial
        if (filtroTipo === "pioneiro") return p.pioneiro_regular
        return true
      })
      .sort((a, b) => a.nome.localeCompare(b.nome))
  }, [busca, filtroTipo, publicadores])

  const stats = useMemo(() => ({
    total: publicadores.filter(p => p.ativo).length,
    anciaos: publicadores.filter(p => p.ativo && p.anciao).length,
    servos: publicadores.filter(p => p.ativo && p.servo_ministerial).length,
    pioneiros: publicadores.filter(p => p.ativo && p.pioneiro_regular).length,
  }), [publicadores])

  const getGrupoNome = (grupoId: string | null) => {
    if (!grupoId) return null
    const grupo = grupos.find(g => g.id === grupoId)
    return grupo ? `Grupo ${grupo.numero}` : null
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-zinc-400">Carregando publicadores...</p>
        </div>
      </div>
    )
  }

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
        <div className="flex gap-2 flex-wrap">
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
          <button
            onClick={() => setFiltroTipo("pioneiro")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroTipo === "pioneiro"
                ? "bg-emerald-600/30 text-emerald-300"
                : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            Pioneiros
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
                        {getGrupoNome(pub.grupo_id) && (
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {getGrupoNome(pub.grupo_id)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {pub.anciao && (
                      <Badge className="bg-blue-600/20 text-blue-400 border-0 text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Ancião
                      </Badge>
                    )}
                    {pub.servo_ministerial && (
                      <Badge className="bg-amber-600/20 text-amber-400 border-0 text-xs">
                        Servo
                      </Badge>
                    )}
                    {pub.pioneiro_regular && (
                      <Badge className="bg-emerald-600/20 text-emerald-400 border-0 text-xs">
                        Pioneiro
                      </Badge>
                    )}
                    {pub.pioneiro_auxiliar && (
                      <Badge className="bg-teal-600/20 text-teal-400 border-0 text-xs">
                        Aux.
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
