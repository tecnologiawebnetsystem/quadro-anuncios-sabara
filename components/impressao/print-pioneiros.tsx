"use client"

import { forwardRef } from "react"

export interface PioneiroImpressao {
  id: string
  nome: string
  telefone: string | null
  email: string | null
  endereco: string | null
  data_batismo: string | null
  data_nascimento: string | null
  anciao: boolean
  servo_ministerial: boolean
  grupo_nome: string | null
}

interface PrintPioneirosProps {
  pioneiros: PioneiroImpressao[]
}

// Divide array em N colunas balanceadas
function dividirEmColunas<T>(arr: T[], numColunas: number): T[][] {
  const colunas: T[][] = Array.from({ length: numColunas }, () => [])
  arr.forEach((item, i) => colunas[i % numColunas].push(item))
  return colunas
}

export const PrintPioneiros = forwardRef<HTMLDivElement, PrintPioneirosProps>(
  ({ pioneiros }, ref) => {
    const hoje = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
    })

    const lista = [...pioneiros].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
    const total = lista.length

    // Escolhe 2 ou 3 colunas dependendo da quantidade
    const numColunas = total > 14 ? 3 : 2
    const colunas = dividirEmColunas(lista, numColunas)

    return (
      <div
        ref={ref}
        style={{
          fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
          backgroundColor: "#ffffff",
          color: "#111827",
          width: "210mm",
          minHeight: "297mm",
          maxHeight: "297mm",
          margin: "0 auto",
          padding: "0",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Cabeçalho ── */}
        <div style={{
          backgroundColor: "#1e3a5f",
          color: "#ffffff",
          padding: "10mm 14mm 8mm 14mm",
          flexShrink: 0,
          position: "relative",
        }}>
          {/* Faixa âmbar no topo */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: "4px", backgroundColor: "#d97706",
          }} />

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div style={{
                fontSize: "8.5px", fontWeight: "700", color: "#d97706",
                letterSpacing: "2px", textTransform: "uppercase", marginBottom: "5px",
              }}>
                Congregação Parque Sabará · Taubaté, SP
              </div>
              <div style={{
                fontSize: "20px", fontWeight: "800", color: "#ffffff",
                letterSpacing: "-0.5px", lineHeight: 1.1,
              }}>
                Pioneiros Regulares
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                display: "inline-block",
                backgroundColor: "#d97706",
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: "800",
                padding: "4px 12px",
                borderRadius: "4px",
                lineHeight: 1.2,
                marginBottom: "3px",
              }}>
                {total}
              </div>
              <div style={{ fontSize: "8.5px", color: "#93c5fd", letterSpacing: "0.5px" }}>
                {total === 1 ? "pioneiro" : "pioneiros"}
              </div>
            </div>
          </div>
        </div>

        {/* ── Subtítulo com data ── */}
        <div style={{
          backgroundColor: "#f1f5f9",
          borderBottom: "1.5px solid #1e3a5f",
          padding: "4px 14mm",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "8px", fontWeight: "700", color: "#1e3a5f", letterSpacing: "1px", textTransform: "uppercase" }}>
            Lista de Pioneiros Regulares
          </span>
          <span style={{ fontSize: "8px", color: "#64748b" }}>
            Emitido em {hoje}
          </span>
        </div>

        {/* ── Conteúdo em colunas ── */}
        <div style={{
          flex: 1,
          padding: "8mm 14mm 6mm 14mm",
          display: "grid",
          gridTemplateColumns: `repeat(${numColunas}, 1fr)`,
          gap: "0 10mm",
          alignContent: "start",
          overflow: "hidden",
        }}>
          {colunas.map((coluna, ci) => (
            <div key={ci}>
              {/* Cabeçalho da coluna */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "18px 1fr 90px",
                gap: "0 5px",
                padding: "4px 0",
                borderBottom: "1.5px solid #1e3a5f",
                marginBottom: "2px",
              }}>
                {["Nº", "Nome", "Telefone"].map((h) => (
                  <div key={h} style={{
                    fontSize: "7.5px", fontWeight: "700", color: "#1e3a5f",
                    textTransform: "uppercase", letterSpacing: "0.8px",
                  }}>
                    {h}
                  </div>
                ))}
              </div>

              {/* Linhas de cada pioneiro */}
              {coluna.map((p, i) => {
                // índice real na lista total para numeração correta
                const idxReal = ci + i * numColunas + 1
                const isEven = i % 2 === 0
                const isLast = i === coluna.length - 1
                return (
                  <div
                    key={p.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "18px 1fr 90px",
                      gap: "0 5px",
                      alignItems: "center",
                      backgroundColor: isEven ? "#ffffff" : "#f0f7ff",
                      borderBottom: isLast ? "1px solid #e2e8f0" : "1px solid #e2e8f0",
                      padding: "5px 0",
                    }}
                  >
                    {/* Número */}
                    <div style={{
                      fontSize: "9px", fontWeight: "700",
                      color: "#94a3b8", textAlign: "center",
                    }}>
                      {idxReal}
                    </div>

                    {/* Nome */}
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#111827", lineHeight: 1.25 }}>
                        {p.nome}
                      </div>
                      {(p.anciao || p.servo_ministerial) && (
                        <div style={{ display: "flex", gap: "3px", marginTop: "1px" }}>
                          {p.anciao && (
                            <span style={{
                              fontSize: "6.5px", fontWeight: "700",
                              backgroundColor: "#1e3a5f", color: "#ffffff",
                              padding: "0px 4px", borderRadius: "2px",
                              letterSpacing: "0.3px",
                            }}>
                              ANCIÃO
                            </span>
                          )}
                          {p.servo_ministerial && (
                            <span style={{
                              fontSize: "6.5px", fontWeight: "700",
                              backgroundColor: "#14532d", color: "#ffffff",
                              padding: "0px 4px", borderRadius: "2px",
                              letterSpacing: "0.3px",
                            }}>
                              SERVO
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Telefone */}
                    <div style={{
                      fontSize: "10px", color: "#374151",
                      fontVariantNumeric: "tabular-nums",
                    }}>
                      {p.telefone || "—"}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* ── Rodapé ── */}
        <div style={{
          marginTop: "auto",
          padding: "5px 14mm",
          borderTop: "2px solid #1e3a5f",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f1f5f9",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "8px", color: "#64748b" }}>
            Congregação Parque Sabará — Pioneiros Regulares
          </span>
          <span style={{ fontSize: "8px", color: "#94a3b8" }}>
            {total} {total === 1 ? "pioneiro" : "pioneiros"} · {hoje}
          </span>
        </div>
      </div>
    )
  }
)
PrintPioneiros.displayName = "PrintPioneiros"
