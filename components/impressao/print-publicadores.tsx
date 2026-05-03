"use client"

import { forwardRef } from "react"

export interface PublicadorImpressao {
  id: string
  nome: string
  anciao: boolean
  servo_ministerial: boolean
  pioneiro_regular: boolean
  ativo: boolean
}

interface PrintPublicadoresProps {
  publicadores: PublicadorImpressao[]
}

// Ícone: Ancião (coroa / chapéu de ancião)
function IconeAnciao() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ display: "inline", verticalAlign: "middle", color: "#1e40af" }}>
      <path d="M5 16l-2-8 5 4 4-7 4 7 5-4-2 8H5zm0 2h14v2H5v-2z"/>
    </svg>
  )
}

// Ícone: Servo Ministerial (escudo)
function IconeServo() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ display: "inline", verticalAlign: "middle", color: "#065f46" }}>
      <path d="M12 2L4 5v6c0 5.25 3.5 10.15 8 11.5C17.5 21.15 21 16.25 21 11V5l-9-3z"/>
    </svg>
  )
}

// Ícone: Pioneiro Regular (bandeira)
function IconePioneiro() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ display: "inline", verticalAlign: "middle", color: "#92400e" }}>
      <path d="M4 3h16l-4 7 4 7H4V3z"/>
    </svg>
  )
}

type Cargo = { label: string; cor: string; bg: string; Icone: () => JSX.Element }

function getCargos(p: PublicadorImpressao): Cargo[] {
  const cargos: Cargo[] = []
  if (p.anciao)
    cargos.push({ label: "Ancião", cor: "#1e40af", bg: "#dbeafe", Icone: IconeAnciao })
  if (p.servo_ministerial)
    cargos.push({ label: "Servo Min.", cor: "#065f46", bg: "#d1fae5", Icone: IconeServo })
  if (p.pioneiro_regular)
    cargos.push({ label: "Pio. Regular", cor: "#92400e", bg: "#fef3c7", Icone: IconePioneiro })
  return cargos
}

export const PrintPublicadores = forwardRef<HTMLDivElement, PrintPublicadoresProps>(
  ({ publicadores }, ref) => {
    const hoje = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })

    // Ordena alfabeticamente
    const lista = [...publicadores].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))

    return (
      <div ref={ref} className="print-preview" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>

        {/* Cabeçalho */}
        <div style={{
          textAlign: "center",
          paddingBottom: "10px",
          marginBottom: "14px",
          borderBottom: "2px solid #1e40af",
        }}>
          <h1 style={{ fontSize: "17px", fontWeight: "bold", margin: "0 0 3px 0", color: "#1e40af", letterSpacing: "0.5px" }}>
            LISTA DE PUBLICADORES
          </h1>
          <p style={{ margin: 0, fontSize: "10.5px", color: "#555" }}>
            Congregação Parque Sabará &nbsp;|&nbsp; {hoje}
          </p>
        </div>

        {/* Grade de publicadores: 3 colunas */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2px 10px",
        }}>
          {lista.map((p, i) => {
            const cargos = getCargos(p)
            return (
              <div key={p.id} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px 2px",
                borderBottom: "1px dotted #d1d5db",
                gap: "6px",
              }}>
                {/* Número e nome */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px", minWidth: 0 }}>
                  <span style={{ fontSize: "9px", color: "#9ca3af", minWidth: "16px", flexShrink: 0 }}>
                    {i + 1}.
                  </span>
                  <span style={{
                    fontSize: "11px",
                    color: "#111827",
                    fontWeight: cargos.length > 0 ? "600" : "400",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {p.nome}
                  </span>
                </div>

                {/* Badges de cargo — pode ter mais de um */}
                <div style={{ display: "flex", alignItems: "center", gap: "3px", flexShrink: 0 }}>
                  {cargos.map(({ label, cor, bg, Icone }) => (
                    <span
                      key={label}
                      title={label}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "2px",
                        backgroundColor: bg,
                        color: cor,
                        fontSize: "8.5px",
                        fontWeight: "700",
                        padding: "1px 4px",
                        borderRadius: "3px",
                        border: `1px solid ${cor}30`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Icone />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legenda */}
        <div style={{
          marginTop: "18px",
          paddingTop: "8px",
          borderTop: "1px solid #d1d5db",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          justifyContent: "center",
        }}>
          <span style={{ fontSize: "9px", fontWeight: "700", color: "#6b7280", letterSpacing: "0.5px" }}>
            LEGENDA:
          </span>
          {[
            { Icone: IconeAnciao, label: "Ancião", cor: "#1e40af" },
            { Icone: IconeServo, label: "Servo Ministerial", cor: "#065f46" },
            { Icone: IconePioneiro, label: "Pioneiro Regular", cor: "#92400e" },
          ].map(({ Icone, label, cor }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Icone />
              <span style={{ fontSize: "9px", color: cor, fontWeight: "600" }}>{label}</span>
            </div>
          ))}
          <span style={{ fontSize: "9px", color: "#6b7280" }}>
            — Sem badge: Publicador
          </span>
        </div>
      </div>
    )
  }
)

PrintPublicadores.displayName = "PrintPublicadores"
