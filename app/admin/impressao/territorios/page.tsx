"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Printer, MapPin, ChevronDown, Loader2, Map, CheckCircle2, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { PrintActionButtons } from "@/components/impressao/print-action-buttons"
import "@/app/impressao/print-styles.css"

interface Territorio {
  id: string
  numero: string
  nome: string
  bairro: string | null
  cidade: string
  estado: string
  descricao: string | null
  latitude: number | null
  longitude: number | null
  foto_url: string | null
  status: "disponivel" | "em_campo" | "concluido"
  ultimo_trabalho: string | null
  publicador_responsavel: string | null
  observacoes: string | null
}

const STATUS_LABEL: Record<string, string> = {
  disponivel: "Disponível",
  em_campo: "Em Campo",
  concluido: "Concluído",
}

const STATUS_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  disponivel: { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7" },
  em_campo: { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
  concluido: { bg: "#dbeafe", text: "#1e3a8a", border: "#93c5fd" },
}

// ── Componente de impressão: lista completa ──────────────────────────────────
function PrintTerritoriosLista({ territorios }: { territorios: Territorio[] }) {
  return (
    <div style={{
      backgroundColor: "white",
      color: "#111827",
      padding: "12mm 14mm 10mm 14mm",
      width: "210mm",
      minHeight: "297mm",
      margin: "0 auto",
      boxSizing: "border-box",
      fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
    }}>
      {/* Cabeçalho */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        borderBottom: "3px solid #111827", paddingBottom: "8px", marginBottom: "12px",
      }}>
        <div>
          <div style={{ fontSize: "16px", fontWeight: "800", letterSpacing: "-0.3px" }}>
            Congregação Parque Sabará
          </div>
          <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "2px" }}>
            Testemunhas de Jeová — Taubaté, SP
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.8px" }}>
            Relação de Territórios
          </div>
          <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "2px" }}>
            Total: {territorios.length} territórios
          </div>
        </div>
      </div>

      {/* Tabela */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
        <thead>
          <tr style={{ backgroundColor: "#1e3a5f", color: "white" }}>
            {["Nº", "Nome / Bairro", "Publicador Resp.", "Último Trabalho", "Status", "Coord. GPS"].map((h) => (
              <th key={h} style={{
                padding: "6px 8px", textAlign: "left",
                fontWeight: "700", fontSize: "9px",
                textTransform: "uppercase", letterSpacing: "0.5px",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {territorios.map((t, i) => {
            const sc = STATUS_COLOR[t.status]
            return (
              <tr key={t.id} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f8faff" }}>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb", fontWeight: "700", fontSize: "12px" }}>
                  #{t.numero}
                </td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb" }}>
                  <div style={{ fontWeight: "700", lineHeight: 1.3 }}>{t.nome}</div>
                  {t.bairro && <div style={{ fontSize: "9.5px", color: "#6b7280" }}>{t.bairro} — {t.cidade}/{t.estado}</div>}
                  {t.descricao && <div style={{ fontSize: "9px", color: "#9ca3af", marginTop: "1px" }}>{t.descricao}</div>}
                </td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb", color: t.publicador_responsavel ? "#111827" : "#9ca3af", fontStyle: t.publicador_responsavel ? "normal" : "italic" }}>
                  {t.publicador_responsavel || "—"}
                </td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb", color: t.ultimo_trabalho ? "#111827" : "#9ca3af", fontStyle: t.ultimo_trabalho ? "normal" : "italic" }}>
                  {t.ultimo_trabalho
                    ? new Date(t.ultimo_trabalho + "T12:00:00").toLocaleDateString("pt-BR")
                    : "—"}
                </td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb" }}>
                  <span style={{
                    display: "inline-block", padding: "2px 7px", borderRadius: "10px",
                    fontSize: "9px", fontWeight: "700",
                    backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                  }}>
                    {STATUS_LABEL[t.status]}
                  </span>
                </td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb", fontFamily: "monospace", fontSize: "9px", color: "#6b7280" }}>
                  {t.latitude && t.longitude
                    ? `${t.latitude.toFixed(5)}, ${t.longitude.toFixed(5)}`
                    : "—"}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Rodapé */}
      <div style={{
        marginTop: "auto", paddingTop: "8px", borderTop: "1px solid #e5e7eb",
        display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px",
      }}>
        <span style={{ fontSize: "8.5px", color: "#9ca3af" }}>Congregação Pq. Sabará — Relação de Territórios</span>
        <span style={{ fontSize: "8.5px", color: "#9ca3af" }}>Impresso em {new Date().toLocaleDateString("pt-BR")}</span>
      </div>
    </div>
  )
}

// ── Componente de impressão: cartões individuais ─────────────────────────────
function PrintTerritoriosCartoes({ territorios }: { territorios: Territorio[] }) {
  const POR_PAGINA = 6
  const paginas: Territorio[][] = []
  for (let i = 0; i < territorios.length; i += POR_PAGINA) {
    paginas.push(territorios.slice(i, i + POR_PAGINA))
  }

  return (
    <div>
      {paginas.map((pagina, pi) => (
        <div key={pi} style={{
          backgroundColor: "white",
          padding: "12mm 14mm",
          width: "210mm",
          minHeight: "297mm",
          margin: "0 auto",
          boxSizing: "border-box",
          fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
          pageBreakAfter: pi < paginas.length - 1 ? "always" : "auto",
        }}>
          {/* Cabeçalho */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-end",
            borderBottom: "3px solid #111827", paddingBottom: "7px", marginBottom: "12px",
          }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "800" }}>Congregação Parque Sabará</div>
              <div style={{ fontSize: "9px", color: "#6b7280" }}>Testemunhas de Jeová — Taubaté, SP</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                Cartões de Território
              </div>
              <div style={{ fontSize: "9px", color: "#6b7280" }}>
                Página {pi + 1} de {paginas.length}
              </div>
            </div>
          </div>

          {/* Grid de cartões — 2 colunas x 3 linhas */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {pagina.map((t) => {
              const sc = STATUS_COLOR[t.status]
              return (
                <div key={t.id} style={{
                  border: "1.5px solid #d1d5db", borderRadius: "6px",
                  overflow: "hidden",
                  pageBreakInside: "avoid",
                }}>
                  {/* Cabeçalho do cartão */}
                  <div style={{
                    backgroundColor: "#1e3a5f", color: "white",
                    padding: "7px 10px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{ fontWeight: "800", fontSize: "14px" }}>#{t.numero}</span>
                    <span style={{
                      fontSize: "9px", fontWeight: "700", padding: "2px 8px",
                      borderRadius: "10px", backgroundColor: sc.bg, color: sc.text,
                    }}>
                      {STATUS_LABEL[t.status]}
                    </span>
                  </div>

                  {/* Foto do território */}
                  {t.foto_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.foto_url}
                      alt={`Território ${t.numero}`}
                      crossOrigin="anonymous"
                      style={{ width: "100%", height: "110px", objectFit: "cover", display: "block" }}
                    />
                  )}

                  {/* Informações */}
                  <div style={{ padding: "8px 10px", fontSize: "11px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ fontWeight: "700", fontSize: "12px", color: "#111827" }}>{t.nome}</div>
                    {t.bairro && (
                      <div style={{ color: "#6b7280", fontSize: "10px" }}>
                        {t.bairro} — {t.cidade}/{t.estado}
                      </div>
                    )}
                    {t.descricao && (
                      <div style={{ color: "#6b7280", fontSize: "10px", fontStyle: "italic" }}>{t.descricao}</div>
                    )}
                    <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "5px", marginTop: "2px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#9ca3af", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.4px" }}>Publicador</span>
                        <span style={{ fontWeight: "600", fontSize: "10px" }}>{t.publicador_responsavel || "—"}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                        <span style={{ color: "#9ca3af", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.4px" }}>Último Trab.</span>
                        <span style={{ fontSize: "10px" }}>
                          {t.ultimo_trabalho
                            ? new Date(t.ultimo_trabalho + "T12:00:00").toLocaleDateString("pt-BR")
                            : "—"}
                        </span>
                      </div>
                      {t.latitude && t.longitude && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                          <span style={{ color: "#9ca3af", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.4px" }}>GPS</span>
                          <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#6b7280" }}>
                            {t.latitude.toFixed(5)}, {t.longitude.toFixed(5)}
                          </span>
                        </div>
                      )}
                    </div>
                    {t.observacoes && (
                      <div style={{
                        marginTop: "3px", padding: "4px 6px",
                        backgroundColor: "#fffbeb", borderLeft: "2px solid #f59e0b",
                        fontSize: "9px", color: "#92400e",
                      }}>
                        {t.observacoes}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Componente de impressão: mapa / foto grande ──────────────────────────────
function PrintTerritoriosFotos({ territorios }: { territorios: Territorio[] }) {
  const comFoto = territorios.filter((t) => t.foto_url)
  const semFoto = territorios.filter((t) => !t.foto_url)

  return (
    <div>
      {comFoto.map((t, i) => {
        const sc = STATUS_COLOR[t.status]
        return (
          <div key={t.id} style={{
            backgroundColor: "white",
            padding: "12mm 14mm",
            width: "210mm",
            minHeight: "297mm",
            margin: "0 auto",
            boxSizing: "border-box",
            fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
            pageBreakAfter: i < comFoto.length - 1 || semFoto.length > 0 ? "always" : "auto",
          }}>
            {/* Cabeçalho */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              borderBottom: "3px solid #111827", paddingBottom: "7px", marginBottom: "14px",
            }}>
              <div>
                <span style={{ fontSize: "11px", color: "#6b7280" }}>Congregação Pq. Sabará</span>
                <div style={{ fontSize: "18px", fontWeight: "800" }}>
                  Território #{t.numero} — {t.nome}
                </div>
              </div>
              <span style={{
                padding: "4px 12px", borderRadius: "12px",
                backgroundColor: sc.bg, color: sc.text,
                fontSize: "11px", fontWeight: "700", border: `1px solid ${sc.border}`,
              }}>
                {STATUS_LABEL[t.status]}
              </span>
            </div>

            {/* Foto grande */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={t.foto_url!}
              alt={`Mapa Território ${t.numero}`}
              crossOrigin="anonymous"
              style={{
                width: "100%", height: "180mm", objectFit: "cover",
                borderRadius: "6px", border: "1.5px solid #d1d5db",
                display: "block", marginBottom: "12px",
              }}
            />

            {/* Informações abaixo da foto */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {[
                { label: "Bairro", value: t.bairro ? `${t.bairro} — ${t.cidade}/${t.estado}` : `${t.cidade}/${t.estado}` },
                { label: "Publicador Responsável", value: t.publicador_responsavel || "—" },
                { label: "Último Trabalho", value: t.ultimo_trabalho ? new Date(t.ultimo_trabalho + "T12:00:00").toLocaleDateString("pt-BR") : "—" },
              ].map((item) => (
                <div key={item.label} style={{ padding: "7px 10px", backgroundColor: "#f8faff", borderRadius: "5px", border: "1px solid #e5e7eb" }}>
                  <div style={{ fontSize: "9px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.4px" }}>{item.label}</div>
                  <div style={{ fontSize: "11.5px", fontWeight: "700", marginTop: "2px" }}>{item.value}</div>
                </div>
              ))}
            </div>

            {t.latitude && t.longitude && (
              <div style={{ marginTop: "8px", padding: "6px 10px", backgroundColor: "#f0fdf4", borderRadius: "5px", border: "1px solid #bbf7d0", fontSize: "10px" }}>
                <span style={{ color: "#6b7280" }}>Coordenadas GPS: </span>
                <span style={{ fontFamily: "monospace", fontWeight: "600" }}>{t.latitude.toFixed(7)}, {t.longitude.toFixed(7)}</span>
              </div>
            )}
            {t.observacoes && (
              <div style={{ marginTop: "8px", padding: "7px 10px", backgroundColor: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "5px", fontSize: "10px" }}>
                <span style={{ fontWeight: "700", color: "#92400e" }}>Observações: </span>
                <span style={{ color: "#78350f" }}>{t.observacoes}</span>
              </div>
            )}
            {t.descricao && (
              <div style={{ marginTop: "6px", fontSize: "10px", color: "#6b7280", fontStyle: "italic" }}>{t.descricao}</div>
            )}
          </div>
        )
      })}

      {/* Página extra para territórios sem foto */}
      {semFoto.length > 0 && (
        <div style={{
          backgroundColor: "white", padding: "12mm 14mm", width: "210mm",
          minHeight: "auto", margin: "0 auto", boxSizing: "border-box",
          fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
        }}>
          <div style={{ borderBottom: "2px solid #111827", paddingBottom: "6px", marginBottom: "10px" }}>
            <div style={{ fontSize: "13px", fontWeight: "800" }}>Territórios sem foto cadastrada</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                {["Nº", "Nome", "Bairro", "Publicador", "Status"].map((h) => (
                  <th key={h} style={{ padding: "5px 8px", textAlign: "left", fontSize: "9px", fontWeight: "700", textTransform: "uppercase", borderBottom: "1.5px solid #d1d5db" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {semFoto.map((t, i) => (
                <tr key={t.id} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f9fafb" }}>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb", fontWeight: "700" }}>#{t.numero}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb" }}>{t.nome}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb", color: "#6b7280" }}>{t.bairro || "—"}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb" }}>{t.publicador_responsavel || "—"}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid #e5e7eb" }}>
                    <span style={{ padding: "2px 7px", borderRadius: "8px", fontSize: "9px", fontWeight: "700", backgroundColor: STATUS_COLOR[t.status].bg, color: STATUS_COLOR[t.status].text }}>
                      {STATUS_LABEL[t.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Página principal ─────────────────────────────────────────────────────────
export default function ImpressaoTerritoriosPage() {
  const [territorios, setTerritorios] = useState<Territorio[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [modo, setModo] = useState<"lista" | "cartoes" | "fotos">("lista")
  const printRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const carregar = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from("territorios")
      .select("*")
      .order("numero", { ascending: true })
    setTerritorios(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { carregar() }, [carregar])

  const filtrados = territorios.filter((t) =>
    filtroStatus === "todos" || t.status === filtroStatus
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Barra de ações — oculta na impressão */}
      <div className="no-print sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 mr-auto">
            <MapPin className="h-5 w-5 text-orange-400" />
            <span className="font-semibold text-sm">Impressão de Territórios</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {filtrados.length} território{filtrados.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Filtro de status */}
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="text-sm border border-border rounded-md px-3 py-1.5 bg-background text-foreground"
          >
            <option value="todos">Todos os status</option>
            <option value="disponivel">Disponíveis</option>
            <option value="em_campo">Em Campo</option>
            <option value="concluido">Concluídos</option>
          </select>

          {/* Modo de impressão */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {([
              { key: "lista", label: "Lista" },
              { key: "cartoes", label: "Cartões" },
              { key: "fotos", label: "Fotos/Mapas" },
            ] as const).map((m) => (
              <button
                key={m.key}
                onClick={() => setModo(m.key)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  modo === m.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <PrintActionButtons printRef={printRef} />
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-auto bg-muted/30 p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <Map className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">Nenhum território encontrado.</p>
          </div>
        ) : (
          <div ref={printRef} className="shadow-xl shadow-black/20">
            {modo === "lista" && <PrintTerritoriosLista territorios={filtrados} />}
            {modo === "cartoes" && <PrintTerritoriosCartoes territorios={filtrados} />}
            {modo === "fotos" && <PrintTerritoriosFotos territorios={filtrados} />}
          </div>
        )}
      </div>
    </div>
  )
}
