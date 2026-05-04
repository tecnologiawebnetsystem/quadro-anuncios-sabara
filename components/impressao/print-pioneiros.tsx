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

function formatarData(data: string | null): string {
  if (!data) return "—"
  const [ano, mes, dia] = data.split("-")
  const meses = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."]
  return `${dia} ${meses[parseInt(mes) - 1]} ${ano}`
}

function calcularAnosServico(dataBatismo: string | null): string {
  if (!dataBatismo) return ""
  const batismo = new Date(dataBatismo)
  const hoje = new Date()
  const anos = hoje.getFullYear() - batismo.getFullYear()
  const m = hoje.getMonth() - batismo.getMonth()
  const ajuste = m < 0 || (m === 0 && hoje.getDate() < batismo.getDate()) ? 1 : 0
  const total = anos - ajuste
  if (total <= 0) return "< 1 ano"
  return `${total} ${total === 1 ? "ano" : "anos"}`
}

// Ícone bandeira (Pioneiro Regular)
function IconeBandeira() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#92400e" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M4 3h16l-4 7 4 7H4V3z"/>
    </svg>
  )
}

export const PrintPioneiros = forwardRef<HTMLDivElement, PrintPioneirosProps>(
  ({ pioneiros }, ref) => {
    const hoje = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
    })

    const lista = [...pioneiros].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
    const total = lista.length

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
        {/* ── Cabeçalho com faixa âmbar ── */}
        <div style={{
          backgroundColor: "#1e3a5f",
          color: "#ffffff",
          padding: "14mm 14mm 10mm 14mm",
          position: "relative",
          flexShrink: 0,
        }}>
          {/* Faixa dourada decorativa no topo */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "4px",
            backgroundColor: "#d97706",
          }} />

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            {/* Esquerda */}
            <div>
              <div style={{
                fontSize: "9px", fontWeight: "600", color: "#d97706",
                letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px",
              }}>
                Congregação Parque Sabará · Taubaté, SP
              </div>
              <div style={{
                fontSize: "22px", fontWeight: "800", color: "#ffffff",
                letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: "4px",
              }}>
                Pioneiros Regulares
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                <IconeBandeira />
                <span style={{ fontSize: "11px", color: "#fbbf24", fontWeight: "500" }}>
                  {total} {total === 1 ? "pioneiro cadastrado" : "pioneiros cadastrados"}
                </span>
              </div>
            </div>

            {/* Direita — data */}
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: "9px", color: "#93c5fd", letterSpacing: "0.5px",
                textTransform: "uppercase", marginBottom: "3px",
              }}>
                Emitido em
              </div>
              <div style={{ fontSize: "11px", color: "#e2e8f0", fontWeight: "600" }}>
                {hoje}
              </div>
            </div>
          </div>
        </div>

        {/* ── Faixa de legenda das colunas ── */}
        <div style={{
          backgroundColor: "#f8fafc",
          borderBottom: "2px solid #1e3a5f",
          padding: "5px 14mm",
          display: "grid",
          gridTemplateColumns: "32px 1fr 120px 95px 70px",
          gap: "0 8px",
          flexShrink: 0,
        }}>
          {["Nº", "Nome", "Telefone", "Batismo", "Serviço"].map((col) => (
            <div key={col} style={{
              fontSize: "8px", fontWeight: "700", color: "#1e3a5f",
              textTransform: "uppercase", letterSpacing: "0.8px",
            }}>
              {col}
            </div>
          ))}
        </div>

        {/* ── Lista de pioneiros ── */}
        <div style={{ flex: 1, overflow: "hidden", padding: "0 14mm" }}>
          {lista.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "30px",
              fontSize: "12px", color: "#9ca3af", fontStyle: "italic",
            }}>
              Nenhum pioneiro regular cadastrado.
            </div>
          ) : (
            lista.map((p, i) => {
              const isEven = i % 2 === 0
              const isLast = i === lista.length - 1
              const anosServico = calcularAnosServico(p.data_batismo)

              return (
                <div
                  key={p.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "32px 1fr 120px 95px 70px",
                    gap: "0 8px",
                    alignItems: "center",
                    backgroundColor: isEven ? "#ffffff" : "#f0f7ff",
                    borderBottom: isLast ? "none" : "1px solid #e2e8f0",
                    padding: "7px 0",
                    minHeight: "34px",
                  }}
                >
                  {/* Número */}
                  <div style={{
                    fontSize: "10px", fontWeight: "700",
                    color: "#94a3b8", textAlign: "center",
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {i + 1}
                  </div>

                  {/* Nome + badges */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{
                        fontSize: "12px", fontWeight: "700", color: "#111827",
                        lineHeight: 1.2,
                      }}>
                        {p.nome}
                      </span>
                      {p.anciao && (
                        <span style={{
                          fontSize: "7.5px", fontWeight: "700",
                          backgroundColor: "#1e3a5f", color: "#ffffff",
                          padding: "1px 5px", borderRadius: "3px",
                          letterSpacing: "0.3px", flexShrink: 0,
                        }}>
                          ANCIÃO
                        </span>
                      )}
                      {p.servo_ministerial && (
                        <span style={{
                          fontSize: "7.5px", fontWeight: "700",
                          backgroundColor: "#14532d", color: "#ffffff",
                          padding: "1px 5px", borderRadius: "3px",
                          letterSpacing: "0.3px", flexShrink: 0,
                        }}>
                          SERVO
                        </span>
                      )}
                    </div>
                    {p.grupo_nome && (
                      <div style={{ fontSize: "9px", color: "#64748b", marginTop: "1px" }}>
                        {p.grupo_nome}
                      </div>
                    )}
                  </div>

                  {/* Telefone */}
                  <div style={{ fontSize: "11px", color: "#374151" }}>
                    {p.telefone || "—"}
                  </div>

                  {/* Data de Batismo */}
                  <div style={{ fontSize: "10.5px", color: "#374151" }}>
                    {formatarData(p.data_batismo)}
                  </div>

                  {/* Anos de serviço */}
                  <div style={{
                    fontSize: "10px", color: "#d97706",
                    fontWeight: "600",
                  }}>
                    {anosServico}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* ── Rodapé ── */}
        <div style={{
          marginTop: "auto",
          padding: "6px 14mm",
          borderTop: "2px solid #1e3a5f",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f8fafc",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "8px", height: "8px",
              backgroundColor: "#d97706", borderRadius: "50%",
              flexShrink: 0,
            }} />
            <span style={{ fontSize: "8.5px", color: "#64748b" }}>
              Congregação Parque Sabará — Lista de Pioneiros Regulares
            </span>
          </div>
          <span style={{ fontSize: "8.5px", color: "#94a3b8" }}>
            {total} {total === 1 ? "pioneiro" : "pioneiros"} · {hoje}
          </span>
        </div>
      </div>
    )
  }
)
PrintPioneiros.displayName = "PrintPioneiros"
