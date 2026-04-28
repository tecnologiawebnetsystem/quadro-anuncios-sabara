"use client"

import { useState, useEffect, useRef } from "react"
import { Users, MapPin, Loader2, BookOpen } from "lucide-react"
import { PrintActionButtons } from "@/components/impressao/print-action-buttons"
import {
  getGrupos,
  getPublicadores,
  type Grupo,
  type PublicadorGrupo,
} from "@/lib/actions/grupos"

import "@/app/impressao/print-styles.css"

// Cores para impressão (estilo inline para print)
const PRINT_COLORS = [
  { header: "#1e3a5f", headerText: "#ffffff", border: "#2d6a9f" },
  { header: "#14532d", headerText: "#ffffff", border: "#16a34a" },
  { header: "#2e1065", headerText: "#ffffff", border: "#7c3aed" },
  { header: "#451a03", headerText: "#ffffff", border: "#d97706" },
  { header: "#4c0519", headerText: "#ffffff", border: "#e11d48" },
  { header: "#083344", headerText: "#ffffff", border: "#0891b2" },
]

export default function ImpressaoGrupoEstudosPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [publicadores, setPublicadores] = useState<PublicadorGrupo[]>([])
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra de controle — não imprime */}
      <div className="print:hidden sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30">
              <BookOpen className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-base font-bold">Grupos de Serviço de Campo</h1>
              <p className="text-xs text-muted-foreground">Visualização para impressão</p>
            </div>
          </div>
        </div>
        <PrintActionButtons
          printRef={printRef}
          documentTitle="Grupos de Serviço de Campo - Congregação Pq. Sabará"
          colorScheme="emerald"
        />
      </div>

      {/* Área de conteúdo */}
      <div className="p-6 max-w-4xl mx-auto print:p-0 print:max-w-none">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : grupos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-muted-foreground gap-3">
            <Users className="h-12 w-12 opacity-30" />
            <p className="text-sm">Nenhum grupo cadastrado ainda.</p>
          </div>
        ) : (
          <>
            {/* Preview na tela */}
            <div className="print:hidden rounded-xl border border-border bg-card p-6">
              <PrintGrupoEstudos
                ref={printRef}
                grupos={grupos}
                publicadores={publicadores}
                getPublicadoresDoGrupo={getPublicadoresDoGrupo}
                totalPublicadores={totalPublicadores}
              />
            </div>

            {/* Conteúdo oculto para impressão */}
            <div className="hidden print:block">
              <PrintGrupoEstudos
                ref={printRef}
                grupos={grupos}
                publicadores={publicadores}
                getPublicadoresDoGrupo={getPublicadoresDoGrupo}
                totalPublicadores={totalPublicadores}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Componente de impressão
import { forwardRef } from "react"

interface PrintGrupoEstudosProps {
  grupos: Grupo[]
  publicadores: PublicadorGrupo[]
  getPublicadoresDoGrupo: (grupoId: string) => PublicadorGrupo[]
  totalPublicadores: number
}

const PrintGrupoEstudos = forwardRef<HTMLDivElement, PrintGrupoEstudosProps>(
  ({ grupos, getPublicadoresDoGrupo }, ref) => {
    return (
      <div ref={ref} style={{
        backgroundColor: "white",
        padding: "8mm 8mm",
        color: "black",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        lineHeight: "1.4",
        width: "210mm",
        height: "297mm",
        maxHeight: "297mm",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Cabeçalho */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #374151",
          paddingBottom: "6px",
          marginBottom: "10px",
          flexShrink: 0,
        }}>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "#111827" }}>
            Parque Sabará - Taubaté SP
          </div>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "#111827", textAlign: "right" }}>
            Grupos de Serviço de Campo
          </div>
        </div>

        {/* Grid de grupos - 3 colunas x 2 linhas */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: "9px",
          flex: 3,
        }}>
          {grupos.slice(0, 6).map((grupo, idx) => {
            const pc = PRINT_COLORS[idx % PRINT_COLORS.length]
            const pubs = getPublicadoresDoGrupo(grupo.id)
            return (
              <div
                key={grupo.id}
                style={{
                  border: `2px solid ${pc.border}`,
                  borderRadius: "4px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header */}
                <div style={{
                  backgroundColor: pc.header,
                  padding: "6px 10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexShrink: 0,
                }}>
                  <div>

                    <div style={{ fontSize: "14px", fontWeight: "bold", color: pc.headerText }}>
                      {grupo.nome} - {grupo.local}
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: "rgba(255,255,255,0.25)",
                    borderRadius: "999px",
                    padding: "3px 8px",
                    fontSize: "13px",
                    color: pc.headerText,
                    fontWeight: "700",
                  }}>
                    {pubs.length}
                  </div>
                </div>
                {/* Publicadores */}
                <div style={{ padding: "8px 10px", backgroundColor: "white", flex: 1 }}>
                  {pubs.length === 0 ? (
                    <p style={{ fontSize: "14px", color: "#999", textAlign: "center", margin: "10px 0", fontStyle: "italic" }}>
                      Sem publicadores
                    </p>
                  ) : (
                    pubs.map((pub) => (
                      <div key={pub.id} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px", lineHeight: "1.4" }}>
                        <span style={{
                          display: "inline-block",
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          backgroundColor: "#666",
                          flexShrink: 0,
                        }} />
                        <span style={{ fontSize: "12px", color: "#111" }}>
                          {pub.nome}
                          {pub.is_lider && <span style={{ fontWeight: 700, fontSize: "11px", marginLeft: "3px", color: pc.header }}>(Dirigente)</span>}
                          {pub.is_auxiliar && <span style={{ fontWeight: 700, fontSize: "11px", marginLeft: "3px", color: "#666" }}>(Ajudante)</span>}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Rodapé */}
        <div style={{
          paddingTop: "8px",
          borderTop: "0px solid #e5e7eb",
          textAlign: "center",
          fontSize: "12px",
          color: "#666",
          flexShrink: 0,
          marginTop: "10px",
        }}>
          Congregação Pq. Sabará - Grupos de Serviço de Campo
        </div>
      </div>
    )
  }
)
PrintGrupoEstudos.displayName = "PrintGrupoEstudos"
