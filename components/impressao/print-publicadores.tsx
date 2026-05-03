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

// Ícone: Ancião — coroa azul-marinho
function IconeAnciao({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1e40af" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
      <path d="M5 16l-2-8 5 4 4-7 4 7 5-4-2 8H5zm0 2h14v2H5v-2z"/>
    </svg>
  )
}

// Ícone: Servo Ministerial — escudo verde
function IconeServo({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#065f46" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
      <path d="M12 2L4 5v6c0 5.25 3.5 10.15 8 11.5C17.5 21.15 21 16.25 21 11V5l-9-3z"/>
    </svg>
  )
}

// Ícone: Pioneiro Regular — bandeira âmbar
function IconePioneiro({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#b45309" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
      <path d="M4 3h16l-4 7 4 7H4V3z"/>
    </svg>
  )
}

function getCargos(p: PublicadorImpressao) {
  const cargos: Array<{ key: string; Icone: typeof IconeAnciao; title: string }> = []
  if (p.anciao)            cargos.push({ key: "a", Icone: IconeAnciao,   title: "Ancião" })
  if (p.servo_ministerial) cargos.push({ key: "s", Icone: IconeServo,    title: "Servo Ministerial" })
  if (p.pioneiro_regular)  cargos.push({ key: "p", Icone: IconePioneiro, title: "Pioneiro Regular" })
  return cargos
}

export const PrintPublicadores = forwardRef<HTMLDivElement, PrintPublicadoresProps>(
  ({ publicadores }, ref) => {
    const hoje = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })

    const lista = [...publicadores].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))

    // Distribui a lista em 4 colunas, preenchendo de cima para baixo em cada coluna
    const NUM_COLUNAS = 4
    const linhasPorColuna = Math.ceil(lista.length / NUM_COLUNAS)
    const colunas: PublicadorImpressao[][] = Array.from({ length: NUM_COLUNAS }, (_, ci) =>
      lista.slice(ci * linhasPorColuna, (ci + 1) * linhasPorColuna)
    )

    // Altura útil disponível para as linhas: 297mm - 8mm*2 padding - ~28mm (header+legenda) ≈ 253mm
    // Convertendo para px a 96dpi: 253mm * 3.7795 ≈ 956px — dividimos pelas linhas
    const ALTURA_UTIL_PX = 930
    const alturaPorLinha = Math.floor(ALTURA_UTIL_PX / linhasPorColuna)
    // Clamp entre 14px e 30px para não ficar nem minúsculo nem gigante
    const rowH = Math.min(30, Math.max(14, alturaPorLinha))
    const fontSize = Math.min(13, Math.max(9, Math.floor(rowH * 0.58)))
    const numSize = Math.max(7, fontSize - 2)
    const iconSize = Math.min(13, Math.max(9, Math.floor(rowH * 0.52)))

    return (
      <div
        ref={ref}
        className="print-preview publicadores-preview"
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: `${fontSize}px`,
          width: "100%",
          minHeight: "277mm",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Cabeçalho */}
        <div style={{
          textAlign: "center",
          paddingBottom: "6px",
          marginBottom: "8px",
          borderBottom: "2px solid #1e40af",
          flexShrink: 0,
        }}>
          <h1 style={{
            fontSize: "16px",
            fontWeight: "bold",
            margin: "0 0 2px 0",
            color: "#1e40af",
            letterSpacing: "0.5px",
          }}>
            LISTA DE PUBLICADORES
          </h1>
          <p style={{ margin: 0, fontSize: "10px", color: "#555" }}>
            Congregação Parque Sabará &nbsp;|&nbsp; {hoje} &nbsp;|&nbsp; {lista.length} publicadores
          </p>
        </div>

        {/* Grade 4 colunas — distribui de cima para baixo em cada coluna */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          columnGap: "10px",
          flex: 1,
          alignContent: "start",
        }}>
          {colunas.map((coluna, ci) => (
            <div key={ci} style={{ display: "flex", flexDirection: "column" }}>
              {coluna.map((p, i) => {
                const cargos = getCargos(p)
                const numGlobal = ci * linhasPorColuna + i + 1
                return (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: `${rowH}px`,
                      borderBottom: "1px dotted #e5e7eb",
                      gap: "3px",
                      overflow: "hidden",
                      padding: "0 2px",
                    }}
                  >
                    {/* Número + Nome */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                      minWidth: 0,
                      flex: 1,
                    }}>
                      <span style={{
                        fontSize: `${numSize}px`,
                        color: "#9ca3af",
                        minWidth: "16px",
                        flexShrink: 0,
                        textAlign: "right",
                      }}>
                        {numGlobal}.
                      </span>
                      <span style={{
                        fontSize: `${fontSize}px`,
                        color: "#111827",
                        fontWeight: cargos.length > 0 ? "700" : "400",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                        {p.nome}
                      </span>
                    </div>

                    {/* Ícones de cargo */}
                    {cargos.length > 0 && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                        flexShrink: 0,
                      }}>
                        {cargos.map(({ key, Icone, title }) => (
                          <span key={key} title={title} style={{ lineHeight: 0 }}>
                            <Icone size={iconSize} />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legenda */}
        <div style={{
          marginTop: "10px",
          paddingTop: "6px",
          borderTop: "1.5px solid #d1d5db",
          display: "flex",
          alignItems: "center",
          gap: "18px",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "9px", fontWeight: "700", color: "#6b7280", letterSpacing: "0.5px" }}>
            LEGENDA:
          </span>
          {[
            { Icone: IconeAnciao,   label: "Ancião",             cor: "#1e40af" },
            { Icone: IconeServo,    label: "Servo Ministerial",  cor: "#065f46" },
            { Icone: IconePioneiro, label: "Pioneiro Regular",   cor: "#b45309" },
          ].map(({ Icone, label, cor }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Icone size={12} />
              <span style={{ fontSize: "9px", color: cor, fontWeight: "600" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
)

PrintPublicadores.displayName = "PrintPublicadores"
