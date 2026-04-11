"use client"

import { useState, useEffect, useCallback, useMemo, useRef, forwardRef } from "react"
import { ArrowLeft, ArrowRight, MapPin, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { PrintActionButtons } from "@/components/impressao/print-action-buttons"
import "@/app/impressao/print-styles.css"

// ---------- Tipos ----------
interface CampoSemana {
  id: string
  dia_semana: string
  dirigente_nome: string
  periodo: string
  horario: string
}

interface CampoCartas {
  id: string
  dia_semana: string
  descricao: string
  responsavel_nome: string
  periodo: string
  horario: string
}

interface CampoSabado {
  id: string
  data: string
  mes: string
  periodo: string
  horario: string
  dirigente_nome: string
}

interface CampoDomingo {
  id: string
  data: string
  mes: string
  horario: string
  dirigente_nome: string | null
  tipo: "individual" | "grupo" | "salao"
}

// ---------- Constantes ----------
const meses = [
  { valor: "2026-01", label: "Janeiro 2026" },
  { valor: "2026-02", label: "Fevereiro 2026" },
  { valor: "2026-03", label: "Março 2026" },
  { valor: "2026-04", label: "Abril 2026" },
  { valor: "2026-05", label: "Maio 2026" },
  { valor: "2026-06", label: "Junho 2026" },
  { valor: "2026-07", label: "Julho 2026" },
  { valor: "2026-08", label: "Agosto 2026" },
  { valor: "2026-09", label: "Setembro 2026" },
  { valor: "2026-10", label: "Outubro 2026" },
  { valor: "2026-11", label: "Novembro 2026" },
  { valor: "2026-12", label: "Dezembro 2026" },
]

const ordemDias = ["segunda", "terca", "quarta", "quinta", "sexta"]
const diasSemanaLabel: Record<string, string> = {
  segunda: "Segunda-feira",
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
}

function formatarData(dataStr: string): string {
  const [, m, d] = dataStr.split("-")
  return `${d}/${m}`
}

// ---------- Componente principal ----------
export default function ImpressaoServicoCampoPage() {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const initialMesIdx = meses.findIndex(m => m.valor === `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`)
  
  const [mesIdx, setMesIdx] = useState(initialMesIdx >= 0 ? initialMesIdx : 0)
  const [campoSemana, setCampoSemana] = useState<CampoSemana[]>([])
  const [campoCartas, setCampoCartas] = useState<CampoCartas[]>([])
  const [campoSabado, setCampoSabado] = useState<CampoSabado[]>([])
  const [campoDomingo, setCampoDomingo] = useState<CampoDomingo[]>([])
  const [loading, setLoading] = useState(true)

  const printRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const mes = meses[mesIdx]

  const carregarFixos = useCallback(async () => {
    const { data: semana } = await supabase.from("servico_campo_semana").select("*").eq("ativo", true).not("dia_semana", "is", null).neq("dia_semana", "")
    const { data: cartas } = await supabase.from("servico_campo_cartas").select("*").eq("ativo", true)
    if (semana) setCampoSemana(semana)
    if (cartas) setCampoCartas(cartas)
  }, [supabase])

  const carregarMes = useCallback(async () => {
    setLoading(true)
    const { data: sabado } = await supabase.from("servico_campo_sabado").select("*").eq("mes", mes.valor).order("data")
    const { data: domingo } = await supabase.from("servico_campo_domingo").select("*").eq("mes", mes.valor).order("data")
    if (sabado) setCampoSabado(sabado)
    if (domingo) setCampoDomingo(domingo)
    setLoading(false)
  }, [mes.valor, supabase])

  useEffect(() => { carregarFixos() }, [carregarFixos])
  useEffect(() => { carregarMes() }, [carregarMes])

  const semanaOrdenada = useMemo(() =>
    [...campoSemana]
      .filter(i => ordemDias.includes(i.dia_semana))
      .sort((a, b) => ordemDias.indexOf(a.dia_semana) - ordemDias.indexOf(b.dia_semana)),
    [campoSemana]
  )
  const sabadosManha = campoSabado.filter(s => s.periodo === "manha")
  const sabadosTarde = campoSabado.filter(s => s.periodo === "tarde")

  // segundo domingo do mês
  const segundoDomingo = useMemo(() => {
    const [ano, m] = mes.valor.split("-").map(Number)
    const domingos: string[] = []
    const last = new Date(ano, m, 0).getDate()
    for (let d = 1; d <= last; d++) {
      const dt = new Date(ano, m - 1, d)
      if (dt.getDay() === 0) domingos.push(dt.toISOString().split("T")[0])
    }
    return domingos[1] ?? null
  }, [mes.valor])

  const [mesNome] = mes.label.split(" ")

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra de controle — não imprime */}
      <div className="print:hidden sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/30">
              <MapPin className="h-4 w-4 text-orange-400" />
            </div>
            <div>
              <h1 className="text-base font-bold">Serviço de Campo</h1>
              <p className="text-xs text-muted-foreground">Visualização para impressão</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => setMesIdx(i => Math.max(0, i - 1))}
              disabled={mesIdx === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold min-w-[130px] text-center">{mes.label}</span>
            <button
              onClick={() => setMesIdx(i => Math.min(meses.length - 1, i + 1))}
              disabled={mesIdx === meses.length - 1}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent disabled:opacity-30"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <PrintActionButtons 
          printRef={printRef}
          documentTitle={`Serviço de Campo - ${mes.label}`}
          colorScheme="orange"
        />
      </div>

      {/* Área de conteúdo */}
      <div className="p-6 max-w-4xl mx-auto print:p-0 print:max-w-none">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Preview na tela */}
            <div className="print:hidden rounded-xl border border-border bg-card p-6">
              <PrintServicoCampo
                ref={printRef}
                mesNome={mesNome}
                mesLabel={mes.label}
                semanaOrdenada={semanaOrdenada}
                campoCartas={campoCartas}
                sabadosManha={sabadosManha}
                sabadosTarde={sabadosTarde}
                campoDomingo={campoDomingo}
                segundoDomingo={segundoDomingo}
              />
            </div>

            {/* Conteúdo oculto para impressão */}
            <div className="hidden print:block">
              <PrintServicoCampo
                ref={printRef}
                mesNome={mesNome}
                mesLabel={mes.label}
                semanaOrdenada={semanaOrdenada}
                campoCartas={campoCartas}
                sabadosManha={sabadosManha}
                sabadosTarde={sabadosTarde}
                campoDomingo={campoDomingo}
                segundoDomingo={segundoDomingo}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ---- Layout de impressão ----
interface PrintServicoCampoProps {
  mesNome: string
  mesLabel: string
  semanaOrdenada: CampoSemana[]
  campoCartas: CampoCartas[]
  sabadosManha: CampoSabado[]
  sabadosTarde: CampoSabado[]
  campoDomingo: CampoDomingo[]
  segundoDomingo: string | null
}

const PrintServicoCampo = forwardRef<HTMLDivElement, PrintServicoCampoProps>(
  ({ mesLabel, semanaOrdenada, campoCartas, sabadosManha, sabadosTarde, campoDomingo, segundoDomingo }, ref) => {
    const cell = (extra?: React.CSSProperties): React.CSSProperties => ({
      border: "1px solid #d1d5db",
      padding: "6px 10px",
      fontSize: "10px",
      color: "#111",
      ...extra,
    })

    const headerBar = (bg: string): React.CSSProperties => ({
      backgroundColor: bg,
      color: "#fff",
      padding: "8px 12px",
      fontSize: "11px",
      fontWeight: "bold",
      marginBottom: "1px",
      borderRadius: "4px 4px 0 0",
    })

    return (
      <div ref={ref} style={{ fontFamily: "Arial, sans-serif", padding: "16px", color: "#111", width: "100%", backgroundColor: "white" }}>
        {/* Cabeçalho */}
        <div style={{ 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #374151",
          paddingBottom: "8px",
          marginBottom: "12px"
        }}>
          <div style={{ fontSize: "14px", fontWeight: "bold", color: "#111827" }}>
            Parque Sabará - Taubaté SP
          </div>
          <div style={{ fontSize: "14px", fontWeight: "bold", color: "#111827", textAlign: "right" }}>
            Serviço de Campo
          </div>
        </div>

        {/* Título */}
        <div style={{ 
          backgroundColor: "#1f2937", 
          color: "white", 
          padding: "10px 14px",
          marginBottom: "16px",
          borderRadius: "4px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase" }}>
            Serviço de Campo — {mesLabel}
          </div>
        </div>

        {/* DURANTE A SEMANA */}
        {semanaOrdenada.length > 0 && (
          <div style={{ marginBottom: "14px" }}>
            <div style={headerBar("#1e3a5f")}>Programa de Ministério Durante a Semana</div>
            <table style={{ borderCollapse: "collapse", width: "100%", borderRadius: "0 0 4px 4px", overflow: "hidden" }}>
              <thead>
                <tr>
                  <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold", width: "180px" })}>Dia</th>
                  <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold" })}>Dirigente</th>
                  <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold", width: "130px" })}>Horário</th>
                </tr>
              </thead>
              <tbody>
                {semanaOrdenada.map(item => (
                  <tr key={item.id}>
                    <td style={cell({ fontWeight: "500" })}>{diasSemanaLabel[item.dia_semana]}</td>
                    <td style={cell()}>{item.dirigente_nome || "—"}</td>
                    <td style={cell({ textAlign: "center" })}>{item.periodo === "manha" ? "Manhã" : "Tarde"} {item.horario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ARRANJO DE CARTAS */}
        {campoCartas.length > 0 && (
          <div style={{ marginBottom: "14px" }}>
            <div style={headerBar("#92400e")}>Arranjo de Cartas</div>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold", width: "140px" })}>Dia</th>
                  <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold" })}>Descrição</th>
                  <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold" })}>Responsável</th>
                  <th style={cell({ backgroundColor: "#f3f4f6", fontWeight: "bold", width: "130px" })}>Horário</th>
                </tr>
              </thead>
              <tbody>
                {campoCartas.map(carta => (
                  <tr key={carta.id}>
                    <td style={cell({ fontWeight: "500" })}>{diasSemanaLabel[carta.dia_semana]}</td>
                    <td style={cell()}>{carta.descricao || "—"}</td>
                    <td style={cell({ fontWeight: "600" })}>{carta.responsavel_nome}</td>
                    <td style={cell({ textAlign: "center" })}>{carta.periodo === "manha" ? "Manhã" : "Tarde"} {carta.horario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SÁBADOS MANHÃ */}
        {sabadosManha.length > 0 && (
          <div style={{ marginBottom: "14px" }}>
            <div style={headerBar("#166534")}>Dirigentes de Campo aos Sábados — Manhã</div>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  {sabadosManha.map(s => (
                    <th key={s.id} style={cell({ backgroundColor: "#f3f4f6", textAlign: "center", fontWeight: "bold" })}>
                      {formatarData(s.data)}
                    </th>
                  ))}
                </tr>
                <tr>
                  {sabadosManha.map(s => (
                    <td key={s.id} style={cell({ textAlign: "center", fontSize: "9px", color: "#666" })}>{s.horario}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {sabadosManha.map(s => (
                    <td key={s.id} style={cell({ textAlign: "center", fontWeight: "500" })}>{s.dirigente_nome || "—"}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* SÁBADOS TARDE */}
        {sabadosTarde.length > 0 && (
          <div style={{ marginBottom: "14px" }}>
            <div style={headerBar("#166534")}>Dirigentes de Campo aos Sábados — Tarde</div>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  {sabadosTarde.map(s => (
                    <th key={s.id} style={cell({ backgroundColor: "#f3f4f6", textAlign: "center", fontWeight: "bold" })}>
                      {formatarData(s.data)}
                    </th>
                  ))}
                </tr>
                <tr>
                  {sabadosTarde.map(s => (
                    <td key={s.id} style={cell({ textAlign: "center", fontSize: "9px", color: "#666" })}>{s.horario}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {sabadosTarde.map(s => (
                    <td key={s.id} style={cell({ textAlign: "center", fontWeight: "500" })}>{s.dirigente_nome || "—"}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* DOMINGOS */}
        {campoDomingo.length > 0 && (
          <div style={{ marginBottom: "14px" }}>
            <div style={headerBar("#9a3412")}>Dirigentes de Campo aos Domingos</div>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  {campoDomingo.map(d => (
                    <th key={d.id} style={cell({ backgroundColor: "#f3f4f6", textAlign: "center", fontWeight: "bold" })}>
                      {formatarData(d.data)}{d.data === segundoDomingo ? " (2º)" : ""}
                    </th>
                  ))}
                </tr>
                <tr>
                  {campoDomingo.map(d => (
                    <td key={d.id} style={cell({ textAlign: "center", fontSize: "9px", color: "#666" })}>{d.horario}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {campoDomingo.map(d => (
                    <td key={d.id} style={cell({ textAlign: "center", fontWeight: "500" })}>
                      {d.tipo === "grupo" ? (
                        <span style={{ color: "#166534", fontWeight: "bold" }}>Saída em Grupo</span>
                      ) : d.tipo === "salao" ? (
                        <span><span style={{ color: "#1e40af", fontWeight: "bold", fontSize: "9px" }}>No Salão</span><br/>{d.dirigente_nome || "—"}</span>
                      ) : (
                        d.dirigente_nome || "—"
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Rodapé */}
        <div style={{ 
          marginTop: "20px", 
          paddingTop: "10px", 
          borderTop: "1px solid #e5e7eb",
          textAlign: "center",
          fontSize: "9px",
          color: "#666"
        }}>
          Congregação Pq. Sabará - Serviço de Campo
        </div>
      </div>
    )
  }
)
PrintServicoCampo.displayName = "PrintServicoCampo"
