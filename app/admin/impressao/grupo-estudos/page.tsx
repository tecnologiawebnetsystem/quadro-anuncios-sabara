"use client"

import { useState, useEffect, useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { Printer, Users, MapPin, Loader2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  getGrupos,
  getPublicadores,
  type Grupo,
  type PublicadorGrupo,
} from "@/lib/actions/grupos"
import "@/app/impressao/print-styles.css"

// Paleta de cores para os grupos (ciclica)
const GROUP_COLORS = [
  { bg: "bg-blue-950/60", border: "border-blue-700/50", header: "bg-blue-900/80", text: "text-blue-300", badge: "bg-blue-800/60 text-blue-200", lider: "text-blue-300", auxiliar: "text-sky-300" },
  { bg: "bg-emerald-950/60", border: "border-emerald-700/50", header: "bg-emerald-900/80", text: "text-emerald-300", badge: "bg-emerald-800/60 text-emerald-200", lider: "text-emerald-300", auxiliar: "text-teal-300" },
  { bg: "bg-violet-950/60", border: "border-violet-700/50", header: "bg-violet-900/80", text: "text-violet-300", badge: "bg-violet-800/60 text-violet-200", lider: "text-violet-300", auxiliar: "text-purple-300" },
  { bg: "bg-amber-950/60", border: "border-amber-700/50", header: "bg-amber-900/80", text: "text-amber-300", badge: "bg-amber-800/60 text-amber-200", lider: "text-amber-300", auxiliar: "text-yellow-300" },
  { bg: "bg-rose-950/60", border: "border-rose-700/50", header: "bg-rose-900/80", text: "text-rose-300", badge: "bg-rose-800/60 text-rose-200", lider: "text-rose-300", auxiliar: "text-pink-300" },
  { bg: "bg-cyan-950/60", border: "border-cyan-700/50", header: "bg-cyan-900/80", text: "text-cyan-300", badge: "bg-cyan-800/60 text-cyan-200", lider: "text-cyan-300", auxiliar: "text-sky-300" },
]

// Cores para impressão (estilo inline para print)
const PRINT_COLORS = [
  { header: "#1e3a5f", headerText: "#93c5fd", border: "#2d6a9f", lider: "#93c5fd", auxiliar: "#7dd3fc" },
  { header: "#14532d", headerText: "#6ee7b7", border: "#16a34a", lider: "#6ee7b7", auxiliar: "#5eead4" },
  { header: "#2e1065", headerText: "#c4b5fd", border: "#7c3aed", lider: "#c4b5fd", auxiliar: "#d8b4fe" },
  { header: "#451a03", headerText: "#fcd34d", border: "#d97706", lider: "#fcd34d", auxiliar: "#fde68a" },
  { header: "#4c0519", headerText: "#fda4af", border: "#e11d48", lider: "#fda4af", auxiliar: "#f9a8d4" },
  { header: "#083344", headerText: "#67e8f9", border: "#0891b2", lider: "#67e8f9", auxiliar: "#7dd3fc" },
]

export default function ImpressaoGrupoEstudosPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [publicadores, setPublicadores] = useState<PublicadorGrupo[]>([])
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Grupos de Estudos",
  })

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      try {
        const [gruposData, publicadoresData] = await Promise.all([
          getGrupos(),
          getPublicadores(),
        ])
        setGrupos(gruposData)
        setPublicadores(publicadoresData)
      } catch {
        /* silencioso */
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  function getPublicadoresDoGrupo(grupoId: string) {
    return publicadores
      .filter((p) => p.grupo_id === grupoId)
      .sort((a, b) => {
        if (a.is_lider && !b.is_lider) return -1
        if (!a.is_lider && b.is_lider) return 1
        if (a.is_auxiliar && !b.is_auxiliar) return -1
        if (!a.is_auxiliar && b.is_auxiliar) return 1
        return a.nome.localeCompare(b.nome)
      })
  }

  const totalPublicadores = publicadores.filter((p) => p.grupo_id).length

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30">
            <BookOpen className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Grupos de Estudos</h1>
            <p className="text-sm text-muted-foreground">
              {grupos.length} grupo{grupos.length !== 1 ? "s" : ""} &middot; {totalPublicadores} publicador{totalPublicadores !== 1 ? "es" : ""}
            </p>
          </div>
        </div>
        <Button onClick={() => handlePrint()} className="gap-2">
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
      </div>

      {/* Preview da impressão */}
      {grupos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-muted-foreground gap-3">
          <Users className="h-12 w-12 opacity-30" />
          <p className="text-sm">Nenhum grupo cadastrado ainda.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Preview visual na tela */}
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {grupos.map((grupo, idx) => {
                const cor = GROUP_COLORS[idx % GROUP_COLORS.length]
                const pubs = getPublicadoresDoGrupo(grupo.id)
                return (
                  <div
                    key={grupo.id}
                    className={`rounded-xl border ${cor.border} ${cor.bg} overflow-hidden`}
                  >
                    {/* Header do grupo */}
                    <div className={`${cor.header} px-4 py-3 flex items-center justify-between`}>
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-widest ${cor.text} opacity-70`}>
                          Grupo {grupo.numero}
                        </p>
                        <h3 className={`font-bold text-sm ${cor.text}`}>{grupo.nome}</h3>
                      </div>
                      <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cor.badge}`}>
                        <Users className="h-3 w-3" />
                        {pubs.length}
                      </div>
                    </div>

                    {/* Local */}
                    {grupo.local && (
                      <div className={`px-4 py-1.5 border-b ${cor.border} flex items-center gap-1.5`}>
                        <MapPin className={`h-3 w-3 ${cor.text} opacity-60`} />
                        <span className={`text-xs ${cor.text} opacity-70`}>{grupo.local}</span>
                      </div>
                    )}

                    {/* Lista de publicadores */}
                    <div className="px-4 py-3 space-y-1.5">
                      {pubs.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic py-2 text-center">
                          Sem publicadores
                        </p>
                      ) : (
                        pubs.map((pub) => (
                          <div key={pub.id} className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                              pub.is_lider ? "bg-current " + cor.lider : pub.is_auxiliar ? "bg-current " + cor.auxiliar : "bg-zinc-500"
                            }`} />
                            <span className={`text-sm ${
                              pub.is_lider
                                ? `font-bold ${cor.lider}`
                                : pub.is_auxiliar
                                ? `font-semibold ${cor.auxiliar}`
                                : "text-zinc-300"
                            }`}>
                              {pub.nome}
                              {pub.is_lider && (
                                <span className={`ml-1.5 text-[10px] font-normal opacity-70`}>(Dirigente)</span>
                              )}
                              {pub.is_auxiliar && (
                                <span className={`ml-1.5 text-[10px] font-normal opacity-70`}>(Auxiliar)</span>
                              )}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Layout para impressão (oculto na tela) */}
      <div className="hidden">
        <div ref={printRef} className="print-container">
          <style>{`
            @media print {
              body { background: white !important; color: black !important; }
              .print-container { padding: 16px; font-family: Arial, sans-serif; }
            }
          `}</style>

          {/* Título */}
          <div style={{ textAlign: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: "2px solid #ddd" }}>
            <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0, color: "#111" }}>
              Grupos de Estudos
            </h1>
            <p style={{ fontSize: "12px", color: "#555", margin: "4px 0 0" }}>
              Congregação Pq. Sabará &mdash; {grupos.length} grupo{grupos.length !== 1 ? "s" : ""} &middot; {totalPublicadores} publicador{totalPublicadores !== 1 ? "es" : ""}
            </p>
          </div>

          {/* Grid de grupos na impressão */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
          }}>
            {grupos.map((grupo, idx) => {
              const pc = PRINT_COLORS[idx % PRINT_COLORS.length]
              const pubs = getPublicadoresDoGrupo(grupo.id)
              return (
                <div
                  key={grupo.id}
                  style={{
                    border: `1px solid ${pc.border}`,
                    borderRadius: "8px",
                    overflow: "hidden",
                    breakInside: "avoid",
                  }}
                >
                  {/* Header */}
                  <div style={{
                    backgroundColor: pc.header,
                    padding: "8px 12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontSize: "9px", color: pc.headerText, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Grupo {grupo.numero}
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: "bold", color: pc.headerText }}>
                        {grupo.nome}
                      </div>
                    </div>
                    <div style={{
                      backgroundColor: "rgba(255,255,255,0.12)",
                      borderRadius: "999px",
                      padding: "2px 8px",
                      fontSize: "11px",
                      color: pc.headerText,
                      fontWeight: "600",
                    }}>
                      {pubs.length}
                    </div>
                  </div>

                  {/* Local */}
                  {grupo.local && (
                    <div style={{
                      fontSize: "10px",
                      color: "#555",
                      padding: "4px 12px",
                      borderBottom: `1px solid ${pc.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}>
                      📍 {grupo.local}
                    </div>
                  )}

                  {/* Publicadores */}
                  <div style={{ padding: "8px 12px" }}>
                    {pubs.length === 0 ? (
                      <p style={{ fontSize: "10px", color: "#999", textAlign: "center", margin: "8px 0", fontStyle: "italic" }}>
                        Sem publicadores
                      </p>
                    ) : (
                      pubs.map((pub) => (
                        <div key={pub.id} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                          <span style={{
                            display: "inline-block",
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: pub.is_lider ? pc.lider : pub.is_auxiliar ? pc.auxiliar : "#aaa",
                            flexShrink: 0,
                          }} />
                          <span style={{
                            fontSize: "11px",
                            color: pub.is_lider ? pc.lider : pub.is_auxiliar ? pc.auxiliar : "#222",
                            fontWeight: pub.is_lider ? "700" : pub.is_auxiliar ? "600" : "400",
                          }}>
                            {pub.nome}
                            {pub.is_lider && <span style={{ fontWeight: 400, fontSize: "9px", opacity: 0.7, marginLeft: "4px" }}>(Dirigente)</span>}
                            {pub.is_auxiliar && <span style={{ fontWeight: 400, fontSize: "9px", opacity: 0.7, marginLeft: "4px" }}>(Auxiliar)</span>}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
