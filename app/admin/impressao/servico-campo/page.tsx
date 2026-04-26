"use client"

import { useState, useEffect, useCallback, useMemo, useRef, forwardRef } from "react"
import { ArrowLeft, ArrowRight, MapPin, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { PrintActionButtons } from "@/components/impressao/print-action-buttons"
import "@/app/impressao/print-styles.css"

// ---------- Tipos ----------
interface CampoSemana {
  id: string
  data: string
  mes: string
  dia_semana: string
  dirigente_nome: string
  periodo: string
  horario: string
}

interface CampoCartas {
  id: string
  data: string
  mes: string
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
    // Não há mais dados fixos - tudo é mensal agora
  }, [supabase])

  const carregarMes = useCallback(async () => {
    setLoading(true)
    // Carregar Durante a Semana do mês
    const { data: semana } = await supabase.from("servico_campo_semana").select("*").eq("mes", mes.valor).eq("ativo", true).not("dia_semana", "is", null).neq("dia_semana", "")
    const { data: sabado } = await supabase.from("servico_campo_sabado").select("*").eq("mes", mes.valor).order("data")
    const { data: domingo } = await supabase.from("servico_campo_domingo").select("*").eq("mes", mes.valor).order("data")
    const { data: cartas } = await supabase.from("servico_campo_cartas").select("*").eq("mes", mes.valor).eq("ativo", true).order("data")
    if (semana) setCampoSemana(semana)
    if (sabado) setCampoSabado(sabado)
    if (domingo) setCampoDomingo(domingo)
    if (cartas) setCampoCartas(cartas)
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
    // Conta quantas seções temos para distribuir o espaço
    const totalSecoes = [
      semanaOrdenada.length > 0,
      campoCartas.length > 0,
      sabadosManha.length > 0,
      sabadosTarde.length > 0,
      campoDomingo.length > 0
    ].filter(Boolean).length

    const cell = (extra?: React.CSSProperties): React.CSSProperties => ({
      border: "1px solid #999",
      padding: "10px 12px",
      fontSize: "14px",
      color: "#111",
      ...extra,
    })

    const headerBar = (bg: string): React.CSSProperties => ({
      backgroundColor: bg,
      color: "#fff",
      padding: "10px 14px",
      fontSize: "15px",
      fontWeight: "bold",
      marginBottom: "0",
      borderRadius: "4px 4px 0 0",
    })

    return (
      <div ref={ref} style={{ 
        fontFamily: "Arial, sans-serif", 
        padding: "10mm 12mm", 
        color: "#111", 
        width: "210mm",
        height: "297mm",
        maxHeight: "297mm",
        backgroundColor: "white",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Cabeçalho */}
        <div style={{ 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "3px solid #374151",
          paddingBottom: "10px",
          marginBottom: "12px",
          flexShrink: 0
        }}>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#111827" }}>
            Parque Sabará - Taubaté SP
          </div>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#111827", textAlign: "right" }}>
            Serviço de Campo - {mesLabel}
          </div>
        </div>

        {/* Container flexível para as seções */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "12px" }}>

          {/* DURANTE A SEMANA */}
          {semanaOrdenada.length > 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={headerBar("#1e3a5f")}>Programa de Ministério Durante a Semana</div>
              <table style={{ borderCollapse: "collapse", width: "100%", flex: 1 }}>
                <thead>
                  <tr>
                    <th style={cell({ backgroundColor: "#e5e7eb", fontWeight: "bold", width: "30%" })}>Dia</th>
                    <th style={cell({ backgroundColor: "#e5e7eb", fontWeight: "bold" })}>Dirigente</th>
                    <th style={cell({ backgroundColor: "#e5e7eb", fontWeight: "bold", width: "25%" })}>Horário</th>
                  </tr>
                </thead>
                <tbody>
                  {semanaOrdenada.map(item => (
                    <tr key={item.id}>
                      <td style={cell({ fontWeight: "600" })}>{diasSemanaLabel[item.dia_semana]}</td>
                      <td style={cell({ fontSize: "14px", fontWeight: "500" })}>{item.dirigente_nome || "—"}</td>
                      <td style={cell({ textAlign: "center", fontWeight: "500" })}>{item.periodo === "manha" ? "Manhã" : "Tarde"} {item.horario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ARRANJO DE CARTAS */}
          {campoCartas.length > 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={headerBar("#92400e")}>Arranjo de Cartas — Segundas-feiras</div>
              <table style={{ borderCollapse: "collapse", width: "100%", flex: 1 }}>
                <thead>
                  <tr>
                    {campoCartas.map(c => (
                      <th key={c.id} style={cell({ backgroundColor: "#e5e7eb", textAlign: "center", fontWeight: "bold", fontSize: "15px" })}>
                        {formatarData(c.data)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {campoCartas.map(c => (
                      <td key={c.id} style={cell({ textAlign: "center", fontSize: "12px", color: "#555", padding: "6px" })}>{c.horario}</td>
                    ))}
                  </tr>
                  <tr>
                    {campoCartas.map(c => (
                      <td key={c.id} style={cell({ textAlign: "center", fontWeight: "600", fontSize: "15px" })}>{c.responsavel_nome || "—"}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* SÁBADOS MANHÃ */}
          {sabadosManha.length > 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={headerBar("#166534")}>Dirigentes de Campo aos Sábados — Manhã</div>
              <table style={{ borderCollapse: "collapse", width: "100%", flex: 1 }}>
                <thead>
                  <tr>
                    {sabadosManha.map(s => (
                      <th key={s.id} style={cell({ backgroundColor: "#e5e7eb", textAlign: "center", fontWeight: "bold", fontSize: "15px" })}>
                        {formatarData(s.data)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {sabadosManha.map(s => (
                      <td key={s.id} style={cell({ textAlign: "center", fontSize: "12px", color: "#555", padding: "6px" })}>{s.horario}</td>
                    ))}
                  </tr>
                  <tr>
                    {sabadosManha.map(s => (
                      <td key={s.id} style={cell({ textAlign: "center", fontWeight: "600", fontSize: "15px" })}>{s.dirigente_nome || "—"}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* SÁBADOS TARDE */}
          {sabadosTarde.length > 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={headerBar("#166534")}>Dirigentes de Campo aos Sábados — Tarde</div>
              <table style={{ borderCollapse: "collapse", width: "100%", flex: 1 }}>
                <thead>
                  <tr>
                    {sabadosTarde.map(s => (
                      <th key={s.id} style={cell({ backgroundColor: "#e5e7eb", textAlign: "center", fontWeight: "bold", fontSize: "15px" })}>
                        {formatarData(s.data)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {sabadosTarde.map(s => (
                      <td key={s.id} style={cell({ textAlign: "center", fontSize: "12px", color: "#555", padding: "6px" })}>{s.horario}</td>
                    ))}
                  </tr>
                  <tr>
                    {sabadosTarde.map(s => (
                      <td key={s.id} style={cell({ textAlign: "center", fontWeight: "600", fontSize: "15px" })}>{s.dirigente_nome || "—"}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* DOMINGOS */}
          {campoDomingo.length > 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={headerBar("#9a3412")}>Dirigentes de Campo aos Domingos</div>
              <table style={{ borderCollapse: "collapse", width: "100%", flex: 1 }}>
                <thead>
                  <tr>
                    {campoDomingo.map(d => (
                      <th key={d.id} style={cell({ backgroundColor: "#e5e7eb", textAlign: "center", fontWeight: "bold", fontSize: "15px" })}>
                        {formatarData(d.data)}{d.data === segundoDomingo ? " (2º)" : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {campoDomingo.map(d => (
                      <td key={d.id} style={cell({ textAlign: "center", fontSize: "12px", color: "#555", padding: "6px" })}>{d.horario}</td>
                    ))}
                  </tr>
                  <tr>
                    {campoDomingo.map(d => (
                      <td key={d.id} style={cell({ textAlign: "center", fontWeight: "600", fontSize: "15px" })}>
                        {d.tipo === "grupo" ? (
                          <span style={{ color: "#166534", fontWeight: "bold" }}>Saída em Grupo</span>
                        ) : d.tipo === "salao" ? (
                          <span><span style={{ color: "#1e40af", fontWeight: "bold", fontSize: "13px" }}>No Salão</span><br/>{d.dirigente_nome || "—"}</span>
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
        </div>

        {/* Rodapé */}
        <div style={{ 
          paddingTop: "10px", 
          borderTop: "2px solid #e5e7eb",
          textAlign: "center",
          fontSize: "13px",
          color: "#555",
          flexShrink: 0,
          marginTop: "12px"
        }}>
          Congregação Pq. Sabará - Serviço de Campo
        </div>
      </div>
    )
  }
)
PrintServicoCampo.displayName = "PrintServicoCampo"
