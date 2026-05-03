"use client"

import { forwardRef } from "react"

export interface PublicadorImpressao {
  id: string
  nome: string
  anciao: boolean
  servo_ministerial: boolean
  pioneiro_regular: boolean
  pioneiro_auxiliar: boolean
  ativo: boolean
}

interface PrintPublicadoresProps {
  publicadores: PublicadorImpressao[]
}

// SVG simples para cada cargo (funciona em print sem dependência de lucide)
function IconeAnciao() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle", color: "#1e3a8a" }}>
      <circle cx="12" cy="8" r="4"/>
      <path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
      <path d="M9 11l-4 9h14l-4-9"/>
    </svg>
  )
}

function IconeServo() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle", color: "#065f46" }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}

function IconePioneiroRegular() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle", color: "#92400e" }}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  )
}

function IconePioneiroAuxiliar() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle", color: "#9a3412" }}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
      <circle cx="19" cy="20" r="3" fill="#9a3412" stroke="none"/>
      <path d="M19 18v4M17 20h4" stroke="white" strokeWidth="1.5"/>
    </svg>
  )
}

function obterCargoPrincipal(p: PublicadorImpressao): string {
  if (p.anciao) return "Ancião"
  if (p.servo_ministerial) return "Servo Min."
  if (p.pioneiro_regular) return "Pio. Regular"
  if (p.pioneiro_auxiliar) return "Pio. Auxiliar"
  return "Publicador"
}

export const PrintPublicadores = forwardRef<HTMLDivElement, PrintPublicadoresProps>(
  ({ publicadores }, ref) => {
    const anciaos = publicadores.filter(p => p.anciao)
    const servos = publicadores.filter(p => !p.anciao && p.servo_ministerial)
    const pioneirosRegulares = publicadores.filter(p => !p.anciao && !p.servo_ministerial && p.pioneiro_regular)
    const pioneirosAuxiliares = publicadores.filter(p => !p.anciao && !p.servo_ministerial && !p.pioneiro_regular && p.pioneiro_auxiliar)
    const somentePub = publicadores.filter(p => !p.anciao && !p.servo_ministerial && !p.pioneiro_regular && !p.pioneiro_auxiliar)

    const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })

    return (
      <div ref={ref} className="print-preview" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>

        {/* Cabeçalho */}
        <div className="print-header" style={{ textAlign: "center", paddingBottom: "12px", marginBottom: "16px", borderBottom: "2px solid #1e3a8a" }}>
          <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 4px 0", color: "#1e3a8a", letterSpacing: "0.5px" }}>
            LISTA DE PUBLICADORES
          </h1>
          <p style={{ margin: 0, fontSize: "11px", color: "#555" }}>
            Congregação Parque Sabará &nbsp;|&nbsp; Gerado em {hoje}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#555" }}>
            Total de publicadores ativos: <strong>{publicadores.length}</strong>
          </p>
        </div>

        {/* Grid de 3 colunas por cargo */}
        {[
          { titulo: "ANCIÃOS", lista: anciaos, cor: "#1e3a8a", bgCor: "#dbeafe", Icone: IconeAnciao },
          { titulo: "SERVOS MINISTERIAIS", lista: servos, cor: "#065f46", bgCor: "#d1fae5", Icone: IconeServo },
          { titulo: "PIONEIROS REGULARES", lista: pioneirosRegulares, cor: "#92400e", bgCor: "#fef3c7", Icone: IconePioneiroRegular },
          { titulo: "PIONEIROS AUXILIARES", lista: pioneirosAuxiliares, cor: "#9a3412", bgCor: "#ffedd5", Icone: IconePioneiroAuxiliar },
        ].map(({ titulo, lista, cor, bgCor, Icone }) =>
          lista.length > 0 ? (
            <div key={titulo} style={{ marginBottom: "14px", breakInside: "avoid" }}>
              <div style={{
                backgroundColor: bgCor,
                borderLeft: `4px solid ${cor}`,
                padding: "5px 10px",
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}>
                <Icone />
                <span style={{ fontSize: "11px", fontWeight: "bold", color: cor, letterSpacing: "0.8px" }}>
                  {titulo} ({lista.length})
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3px 12px", paddingLeft: "4px" }}>
                {lista.map((p, i) => (
                  <div key={p.id} style={{
                    fontSize: "11px",
                    padding: "3px 0",
                    borderBottom: "1px dotted #ccc",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    color: "#111",
                  }}>
                    <span style={{ color: "#888", fontSize: "9px", minWidth: "16px" }}>{i + 1}.</span>
                    <span>{p.nome}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}

        {/* Publicadores sem cargo especial */}
        {somentePub.length > 0 && (
          <div style={{ marginBottom: "14px" }}>
            <div style={{
              backgroundColor: "#f3f4f6",
              borderLeft: "4px solid #6b7280",
              padding: "5px 10px",
              marginBottom: "6px",
            }}>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: "#374151", letterSpacing: "0.8px" }}>
                PUBLICADORES ({somentePub.length})
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3px 12px", paddingLeft: "4px" }}>
              {somentePub.map((p, i) => (
                <div key={p.id} style={{
                  fontSize: "11px",
                  padding: "3px 0",
                  borderBottom: "1px dotted #ccc",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  color: "#111",
                }}>
                  <span style={{ color: "#888", fontSize: "9px", minWidth: "16px" }}>{i + 1}.</span>
                  <span>{p.nome}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legenda */}
        <div style={{
          marginTop: "20px",
          borderTop: "1px solid #ccc",
          paddingTop: "10px",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "center",
        }}>
          <span style={{ fontSize: "10px", color: "#555", fontWeight: "bold", marginRight: "4px" }}>LEGENDA:</span>
          {[
            { Icone: IconeAnciao, label: "Ancião", cor: "#1e3a8a" },
            { Icone: IconeServo, label: "Servo Ministerial", cor: "#065f46" },
            { Icone: IconePioneiroRegular, label: "Pioneiro Regular", cor: "#92400e" },
            { Icone: IconePioneiroAuxiliar, label: "Pioneiro Auxiliar", cor: "#9a3412" },
          ].map(({ Icone, label, cor }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Icone />
              <span style={{ fontSize: "10px", color: cor }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
)

PrintPublicadores.displayName = "PrintPublicadores"
