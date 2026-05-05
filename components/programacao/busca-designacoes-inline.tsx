"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  Search, X, Loader2, User, Calendar, Wrench, BookOpen,
  MapPin, Mic, Sparkles, ChevronDown, ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { buscarDesignacoesPorNome, getPublicadoresParaBusca, type DesignacaoEncontrada } from "@/lib/services/busca-designacoes"

const tipoConfig: Record<DesignacaoEncontrada["tipo"], { icon: typeof Calendar; color: string; bgColor: string; label: string }> = {
  equipe_tecnica: { icon: Wrench,   color: "text-orange-400", bgColor: "bg-orange-500/15", label: "Equipe Técnica" },
  vida_ministerio:{ icon: BookOpen, color: "text-blue-400",   bgColor: "bg-blue-500/15",   label: "Vida e Ministério" },
  limpeza:        { icon: Sparkles, color: "text-cyan-400",   bgColor: "bg-cyan-500/15",   label: "Limpeza" },
  campo:          { icon: MapPin,   color: "text-green-400",  bgColor: "bg-green-500/15",  label: "Serviço de Campo" },
  discurso:       { icon: Mic,      color: "text-amber-400",  bgColor: "bg-amber-500/15",  label: "Discurso Público" },
  sentinela:      { icon: Calendar, color: "text-red-400",    bgColor: "bg-red-500/15",    label: "Sentinela" },
}

export function BuscaDesignacoesProgramacao() {
  const [aberto, setAberto]                   = useState(false)
  const [busca, setBusca]                     = useState("")
  const [publicadores, setPublicadores]       = useState<string[]>([])
  const [sugestoes, setSugestoes]             = useState<string[]>([])
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)
  const [resultados, setResultados]           = useState<DesignacaoEncontrada[]>([])
  const [carregando, setCarregando]           = useState(false)
  const [buscaRealizada, setBuscaRealizada]   = useState(false)
  const [nomeBuscado, setNomeBuscado]         = useState("")
  const nomeJaSelecionado = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getPublicadoresParaBusca().then(setPublicadores)
  }, [])

  useEffect(() => {
    // Não reexibir o dropdown quando o nome foi selecionado via clique
    if (nomeJaSelecionado.current) {
      nomeJaSelecionado.current = false
      return
    }
    if (busca.length >= 2) {
      const filtradas = publicadores
        .filter(p => p.toLowerCase().includes(busca.toLowerCase()))
        .slice(0, 6)
      setSugestoes(filtradas)
      setMostrarSugestoes(filtradas.length > 0)
    } else {
      setSugestoes([])
      setMostrarSugestoes(false)
    }
  }, [busca, publicadores])

  const realizarBusca = useCallback(async (nome: string) => {
    if (nome.length < 2) return
    setCarregando(true)
    setBuscaRealizada(true)
    setMostrarSugestoes(false)
    setNomeBuscado(nome)
    try {
      const res = await buscarDesignacoesPorNome(nome)
      setResultados(res)
    } catch {
      setResultados([])
    } finally {
      setCarregando(false)
    }
  }, [])

  const selecionarSugestao = (nome: string) => {
    nomeJaSelecionado.current = true
    setSugestoes([])
    setMostrarSugestoes(false)
    setBusca(nome)
    realizarBusca(nome)
  }

  const limpar = () => {
    setBusca("")
    setResultados([])
    setBuscaRealizada(false)
    setMostrarSugestoes(false)
    setNomeBuscado("")
    setAberto(false)
  }

  const abrirBusca = () => {
    setAberto(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  /* ── Fechado: botão compacto ── */
  if (!aberto) {
    return (
      <div className="max-w-lg mx-auto px-4 mt-6 mb-2">
        <button
          onClick={abrirBusca}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(var(--sidebar-primary-rgb, 99, 102, 241), 0.18)" }}>
            <Search className="h-4 w-4 text-sidebar-primary" />
          </div>
          <span className="flex-1 text-left text-sm text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80 transition-colors">
            Buscar minhas designações...
          </span>
          <ChevronDown className="h-4 w-4 text-sidebar-foreground/30 group-hover:text-sidebar-foreground/60 transition-colors" />
        </button>
      </div>
    )
  }

  /* ── Aberto: painel completo ── */
  return (
    <div className="max-w-lg mx-auto px-4 mt-6 mb-2">
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
      >
        {/* Cabeçalho do painel */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <User className="h-4 w-4 text-sidebar-primary flex-shrink-0" />
          <span className="flex-1 text-sm font-semibold text-sidebar-foreground">Minhas Designações</span>
          <button
            onClick={limpar}
            className="w-7 h-7 rounded-full flex items-center justify-center text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-white/10 transition-all"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 py-3 space-y-3">
          {/* Input de busca com autocomplete */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-sidebar-foreground/40 pointer-events-none" />
              <input
                ref={inputRef}
                value={busca}
                onChange={e => setBusca(e.target.value)}
                onKeyDown={e => e.key === "Enter" && realizarBusca(busca)}
                placeholder="Digite seu nome..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/30 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              />
              {busca && (
                <button
                  onClick={() => { setBusca(""); setResultados([]); setBuscaRealizada(false); setNomeBuscado(""); }}
                  className="absolute right-3 text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Dropdown de sugestões */}
            {mostrarSugestoes && (
              <div
                className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden shadow-2xl"
                style={{ background: "#1e2d4a", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                {sugestoes.map(nome => (
                  <button
                    key={nome}
                    onClick={() => selecionarSugestao(nome)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm text-sidebar-foreground hover:bg-white/8 transition-colors"
                  >
                    <User className="h-3.5 w-3.5 text-sidebar-primary/60 flex-shrink-0" />
                    {nome}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botão buscar */}
          {!buscaRealizada && (
            <button
              onClick={() => realizarBusca(busca)}
              disabled={busca.length < 2 || carregando}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
              style={{ background: "rgba(var(--sidebar-primary-rgb, 99, 102, 241), 0.25)", color: "hsl(var(--sidebar-primary))" }}
            >
              {carregando ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Buscando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Search className="h-4 w-4" /> Buscar Designações
                </span>
              )}
            </button>
          )}

          {/* Resultados */}
          {carregando && buscaRealizada && (
            <div className="flex items-center justify-center py-6 gap-2 text-sidebar-foreground/40">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Buscando...</span>
            </div>
          )}

          {buscaRealizada && !carregando && (
            <div className="space-y-2">
              {/* Cabeçalho resultados */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-sidebar-foreground/50">
                  {resultados.length === 0
                    ? `Nenhuma designação encontrada para "${nomeBuscado}"`
                    : `${resultados.length} designaç${resultados.length === 1 ? "ão" : "ões"} encontrada${resultados.length === 1 ? "" : "s"} — ${nomeBuscado}`
                  }
                </p>
                <button
                  onClick={() => { setResultados([]); setBuscaRealizada(false); setBusca(""); setNomeBuscado(""); }}
                  className="text-xs text-sidebar-foreground/40 hover:text-sidebar-foreground/70 transition-colors underline"
                >
                  nova busca
                </button>
              </div>

              {resultados.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="h-9 w-9 mx-auto mb-2 text-sidebar-foreground/20" />
                  <p className="text-xs text-sidebar-foreground/40">Verifique se o nome está correto</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-80 overflow-y-auto pr-0.5">
                  {resultados.map((d) => {
                    const cfg = tipoConfig[d.tipo]
                    const Icon = cfg.icon
                    return (
                      <div
                        key={d.id}
                        className="flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <div className={cn("p-1.5 rounded-lg flex-shrink-0 mt-0.5", cfg.bgColor)}>
                          <Icon className={cn("h-3.5 w-3.5", cfg.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-sidebar-foreground">{d.funcao}</p>
                            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-md", cfg.bgColor, cfg.color)}>
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-xs text-sidebar-foreground/50 mt-0.5 capitalize">{d.dataFormatada}</p>
                          {d.detalhes && (
                            <p className="text-xs text-sidebar-foreground/35 mt-0.5 truncate">{d.detalhes}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
