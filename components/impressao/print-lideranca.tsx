"use client"

import { forwardRef } from "react"

export interface MembroLideranca {
  id: string
  nome: string
  telefone: string | null
  data_batismo: string | null
  anciao: boolean
  servo_ministerial: boolean
}

interface PrintLiderancaProps {
  anciaos: MembroLideranca[]
  servos: MembroLideranca[]
}

function formatarData(data: string | null): string {
  if (!data) return ""
  const [ano, mes, dia] = data.split("-")
  return `${dia}/${mes}/${ano}`
}

function dividirEmColunas<T>(arr: T[], numColunas: number): T[][] {
  const colunas: T[][] = Array.from({ length: numColunas }, () => [])
  arr.forEach((item, i) => colunas[i % numColunas].push(item))
  return colunas
}

interface GrupoListaProps {
  titulo: string
  subtitulo: string
  corBg: string
  corAccent: string
  corStripe: string
  corTexto: string
  membros: MembroLideranca[]
  mostrarBatismo: boolean
}

function GrupoLista({
  titulo, subtitulo, corBg, corAccent, corStripe, corTexto, membros, mostrarBatismo,
}: GrupoListaProps) {
  const numColunas = membros.length > 12 ? 3 : membros.length > 6 ? 2 : 1
  const colunas = dividirEmColunas(membros, numColunas)

  return (
    <div style={{ marginBottom: "10mm" }}>
      {/* Cabeçalho do grupo */}
      <div style={{
        backgroundColor: corBg,
        color: "#ffffff",
        padding: "5px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "4px 4px 0 0",
      }}>
        <div>
          <div style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "1.2px", textTransform: "uppercase" }}>
            {titulo}
          </div>
          <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.65)", marginTop: "1px" }}>
            {subtitulo}
          </div>
        </div>
        <div style={{
          backgroundColor: corAccent,
          color: "#ffffff",
          fontSize: "15px",
          fontWeight: "800",
          padding: "2px 10px",
          borderRadius: "3px",
          lineHeight: 1.3,
        }}>
          {membros.length}
        </div>
      </div>

      {/* Linhas de separação do cabeçalho */}
      <div style={{ height: "2px", backgroundColor: corAccent }} />

      {membros.length === 0 ? (
        <div style={{
          padding: "10px",
          textAlign: "center",
          fontSize: "10px",
          color: "#9ca3af",
          fontStyle: "italic",
          border: "1px solid #e5e7eb",
          borderTop: "none",
          borderRadius: "0 0 4px 4px",
        }}>
          Nenhum cadastrado.
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numColunas}, 1fr)`,
          gap: "0 8mm",
          border: "1px solid #e5e7eb",
          borderTop: "none",
          borderRadius: "0 0 4px 4px",
          overflow: "hidden",
          padding: "0 4px",
        }}>
          {colunas.map((coluna, ci) => (
            <div key={ci}>
              {/* Cabeçalho da coluna */}
              <div style={{
                display: "grid",
                gridTemplateColumns: mostrarBatismo ? "18px 1fr 85px 72px" : "18px 1fr 90px",
                gap: "0 4px",
                padding: "4px 0",
                borderBottom: `1.5px solid ${corBg}`,
                marginTop: "4px",
              }}>
                {(mostrarBatismo
                  ? ["Nº", "Nome", "Telefone", "Batismo"]
                  : ["Nº", "Nome", "Telefone"]
                ).map((h) => (
                  <div key={h} style={{
                    fontSize: "7px", fontWeight: "700", color: corTexto,
                    textTransform: "uppercase", letterSpacing: "0.6px",
                  }}>
                    {h}
                  </div>
                ))}
              </div>

              {coluna.map((m, i) => {
                const idxReal = ci + i * numColunas + 1
                const isEven = i % 2 === 0
                return (
                  <div
                    key={m.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: mostrarBatismo ? "18px 1fr 85px 72px" : "18px 1fr 90px",
                      gap: "0 4px",
                      alignItems: "center",
                      backgroundColor: isEven ? "#ffffff" : corStripe,
                      borderBottom: "1px solid #f1f5f9",
                      padding: "5px 0",
                    }}
                  >
                    <div style={{ fontSize: "8.5px", fontWeight: "700", color: "#94a3b8", textAlign: "center" }}>
                      {idxReal}
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#111827", lineHeight: 1.25 }}>
                      {m.nome}
                    </div>
                    <div style={{ fontSize: "10px", color: "#374151", fontVariantNumeric: "tabular-nums" }}>
                      {m.telefone || "—"}
                    </div>
                    {mostrarBatismo && (
                      <div style={{ fontSize: "9.5px", color: "#6b7280", fontVariantNumeric: "tabular-nums" }}>
                        {formatarData(m.data_batismo) || "—"}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const PrintLideranca = forwardRef<HTMLDivElement, PrintLiderancaProps>(
  ({ anciaos, servos }, ref) => {
    const hoje = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
    })

    const listaAnciaos = [...anciaos].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
    const listaServos = [...servos].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))

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
          padding: "9mm 14mm 7mm 14mm",
          flexShrink: 0,
          position: "relative",
        }}>
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
                Corpo de Anciãos e Servos Ministeriais
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginBottom: "4px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    backgroundColor: "#1e3a5f", color: "#ffffff",
                    border: "1.5px solid #d97706",
                    fontSize: "15px", fontWeight: "800",
                    padding: "2px 10px", borderRadius: "3px", lineHeight: 1.3,
                  }}>
                    {listaAnciaos.length}
                  </div>
                  <div style={{ fontSize: "7.5px", color: "#93c5fd", marginTop: "2px", letterSpacing: "0.5px" }}>ANCIÃOS</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    backgroundColor: "#14532d", color: "#ffffff",
                    fontSize: "15px", fontWeight: "800",
                    padding: "2px 10px", borderRadius: "3px", lineHeight: 1.3,
                  }}>
                    {listaServos.length}
                  </div>
                  <div style={{ fontSize: "7.5px", color: "#86efac", marginTop: "2px", letterSpacing: "0.5px" }}>SERVOS</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtítulo */}
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
            Lista de Liderança da Congregação
          </span>
          <span style={{ fontSize: "8px", color: "#64748b" }}>Emitido em {hoje}</span>
        </div>

        {/* ── Conteúdo ── */}
        <div style={{ flex: 1, padding: "7mm 14mm 4mm 14mm", overflow: "hidden" }}>
          <GrupoLista
            titulo="Anciãos"
            subtitulo="Corpo de Anciãos da Congregação"
            corBg="#1e3a5f"
            corAccent="#d97706"
            corStripe="#eff6ff"
            corTexto="#1e3a5f"
            membros={listaAnciaos}
            mostrarBatismo={true}
          />
          <GrupoLista
            titulo="Servos Ministeriais"
            subtitulo="Servos Ministeriais da Congregação"
            corBg="#14532d"
            corAccent="#16a34a"
            corStripe="#f0fdf4"
            corTexto="#14532d"
            membros={listaServos}
            mostrarBatismo={true}
          />
        </div>

        {/* ── Rodapé ── */}
        <div style={{
          marginTop: "auto",
          padding: "4px 14mm",
          borderTop: "2px solid #1e3a5f",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f1f5f9",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "8px", color: "#64748b" }}>
            Congregação Parque Sabará — Corpo de Anciãos e Servos Ministeriais
          </span>
          <span style={{ fontSize: "8px", color: "#94a3b8" }}>
            {listaAnciaos.length + listaServos.length} membros · {hoje}
          </span>
        </div>
      </div>
    )
  }
)
PrintLideranca.displayName = "PrintLideranca"
