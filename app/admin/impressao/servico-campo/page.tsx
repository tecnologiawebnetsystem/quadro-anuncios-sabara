"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Printer, ArrowLeft, ArrowRight, Calendar, Clock, Mail, Sun, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

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

// ---------- Cores das seções ----------
const cores = {
  semana:  { header: "#1e3a5f", headerText: "#93c5fd", badge: "#1e40af", badgeText: "#bfdbfe" },
  cartas:  { header: "#3b2800", headerText: "#fcd34d", badge: "#92400e", badgeText: "#fde68a" },
  sabado:  { header: "#1a2e1a", headerText: "#86efac", badge: "#166534", badgeText: "#bbf7d0" },
  domingo: { header: "#2d1b00", headerText: "#fb923c", badge: "#9a3412", badgeText: "#fed7aa" },
}

// ---------- Componente principal ----------
export default function ImpressaoServicoCampoPage() {
  const [mesIdx, setMesIdx] = useState(3) // Abril 2026
  const [campoSemana, setCampoSemana] = useState<CampoSemana[]>([])
  const [campoCartas, setCampoCartas] = useState<CampoCartas[]>([])
  const [campoSabado, setCampoSabado] = useState<CampoSabado[]>([])
  const [campoDomingo, setCampoDomingo] = useState<CampoDomingo[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()
  const mes = meses[mesIdx]

  const carregarFixos = useCallback(async () => {
    const { data: semana } = await supabase.from("servico_campo_semana").select("*").eq("ativo", true).not("dia_semana", "is", null).neq("dia_semana", "")
    const { data: cartas } = await supabase.from("servico_campo_cartas").select("*").eq("ativo", true)
    if (semana) setCampoSemana(semana)
    if (cartas) setCampoCartas(cartas)
  }, [])

  const carregarMes = useCallback(async () => {
    setLoading(true)
    const { data: sabado } = await supabase.from("servico_campo_sabado").select("*").eq("mes", mes.valor).order("data")
    const { data: domingo } = await supabase.from("servico_campo_domingo").select("*").eq("mes", mes.valor).order("data")
    if (sabado) setCampoSabado(sabado)
    if (domingo) setCampoDomingo(domingo)
    setLoading(false)
  }, [mes.valor])

  useEffect(() => { carregarFixos() }, [carregarFixos])
  useEffect(() => { carregarMes() }, [carregarMes])

  const semanaOrdenada = useMemo(() =>
    [...campoSemana]
      .filter(i => ordemDias.includes(i.dia_semana))
      .sort((a, b) => ordemDias.indexOf(a.dia_semana) - ordemDias.indexOf(b.dia_semana)),
    [campoSemana]
  )
  const sabadosManha = campoSabado.filter(s => s.periodo === "manha")
  const sabadosTarde  = campoSabado.filter(s => s.periodo === "tarde")

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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMesIdx(i => Math.max(0, i - 1))}
              disabled={mesIdx === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-base font-semibold min-w-[130px] text-center">{mes.label}</span>
            <button
              onClick={() => setMesIdx(i => Math.min(meses.length - 1, i + 1))}
              disabled={mesIdx === meses.length - 1}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent disabled:opacity-30"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <Button onClick={() => window.print()} className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
      </div>

      {/* Área de visualização */}
      <div className="p-6 max-w-5xl mx-auto space-y-6 print:p-0 print:max-w-none print:space-y-0">

        {/* ===== LAYOUT DE IMPRESSÃO ===== */}
        <div className="hidden print:block" id="print-area">
          <PrintServicoCampo
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

        {/* ===== LAYOUT DE VISUALIZAÇÃO (tela) ===== */}
        <div className="print:hidden space-y-5">
          {/* Cabeçalho visual */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-400" />
              Serviço de Campo — {mes.label}
            </h1>
          </div>

          {/* Durante a semana */}
          <Section cor={cores.semana} titulo="Programa de Ministério Durante a Semana" icon={<Calendar className="h-4 w-4" />}>
            {semanaOrdenada.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center">Nenhum programa cadastrado</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Dia</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Dirigente</th>
                    <th className="text-center py-2 px-3 text-muted-foreground font-medium">Horário</th>
                  </tr>
                </thead>
                <tbody>
                  {semanaOrdenada.map(item => (
                    <tr key={item.id} className="border-b border-border/40">
                      <td className="py-2.5 px-3 font-medium">{diasSemanaLabel[item.dia_semana]}</td>
                      <td className="py-2.5 px-3">{item.dirigente_nome || "—"}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-blue-500/15 text-blue-400">
                          <Clock className="h-3 w-3" />
                          {item.periodo === "manha" ? "Manhã" : "Tarde"} {item.horario}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Section>

          {/* Arranjo de Cartas */}
          {campoCartas.length > 0 && (
            <Section cor={cores.cartas} titulo="Arranjo de Cartas" icon={<Mail className="h-4 w-4" />}>
              <div className="space-y-2">
                {campoCartas.map(carta => (
                  <div key={carta.id} className="flex flex-wrap items-center gap-2 text-sm py-1">
                    <span className="font-medium">{diasSemanaLabel[carta.dia_semana]}</span>
                    {carta.descricao && <><span className="text-muted-foreground">–</span><span>{carta.descricao}</span></>}
                    <span className="text-muted-foreground">–</span>
                    <span className="text-amber-400 font-medium">{carta.responsavel_nome}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-amber-500/15 text-amber-400">
                      <Clock className="h-3 w-3" />
                      {carta.periodo === "manha" ? "Manhã" : "Tarde"} {carta.horario}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Sábado Manhã */}
          <Section cor={cores.sabado} titulo={`Dirigentes de Campo aos Sábados — Manhã`} icon={<Sun className="h-4 w-4" />}>
            {sabadosManha.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center">Nenhum dirigente cadastrado</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sabadosManha.map(s => (
                  <DiaCard key={s.id} data={formatarData(s.data)} horario={s.horario} nome={s.dirigente_nome} />
                ))}
              </div>
            )}
          </Section>

          {/* Sábado Tarde */}
          <Section cor={cores.sabado} titulo={`Dirigentes de Campo aos Sábados — Tarde`} icon={<Sun className="h-4 w-4" />}>
            {sabadosTarde.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center">Nenhum dirigente cadastrado</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sabadosTarde.map(s => (
                  <DiaCard key={s.id} data={formatarData(s.data)} horario={s.horario} nome={s.dirigente_nome} />
                ))}
              </div>
            )}
          </Section>

          {/* Domingos */}
          <Section cor={cores.domingo} titulo="Dirigentes de Campo aos Domingos" icon={<MapPin className="h-4 w-4" />}>
            {campoDomingo.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center">Nenhum dirigente cadastrado</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {campoDomingo.map(d => {
                  const isSegundo = d.data === segundoDomingo
                  return (
                    <div key={d.id} className="p-3 rounded-lg bg-zinc-800/30 text-center space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xs text-muted-foreground">{formatarData(d.data)} — {d.horario}</span>
                        {isSegundo && <span className="text-[10px] bg-blue-600/20 text-blue-400 rounded px-1 py-0.5 leading-none">2º Dom.</span>}
                      </div>
                      {d.tipo === "grupo" ? (
                        <div className="text-xs font-semibold text-green-400 flex items-center justify-center gap-1">
                          <Users className="h-3 w-3" /> Saída em grupo
                        </div>
                      ) : d.tipo === "salao" ? (
                        <>
                          <div className="text-[11px] font-semibold text-blue-400 uppercase">No Salão</div>
                          <div className="text-sm font-medium">{d.dirigente_nome || "—"}</div>
                        </>
                      ) : (
                        <div className="text-sm font-medium">{d.dirigente_nome || "—"}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  )
}

// ---- Componentes auxiliares de tela ----
function Section({ cor, titulo, icon, children }: {
  cor: typeof cores.semana
  titulo: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 font-semibold text-sm" style={{ backgroundColor: cor.header, color: cor.headerText }}>
        {icon}
        {titulo}
      </div>
      <div className="bg-card p-4">{children}</div>
    </div>
  )
}

function DiaCard({ data, horario, nome }: { data: string; horario: string; nome: string }) {
  return (
    <div className="p-3 rounded-lg bg-zinc-800/30 text-center">
      <div className="text-xs text-muted-foreground mb-1">{data} — {horario}</div>
      <div className="text-sm font-medium">{nome || "—"}</div>
    </div>
  )
}

// ---- Layout de impressão ----
function PrintServicoCampo({
  mesNome, mesLabel, semanaOrdenada, campoCartas,
  sabadosManha, sabadosTarde, campoDomingo, segundoDomingo
}: {
  mesNome: string
  mesLabel: string
  semanaOrdenada: CampoSemana[]
  campoCartas: CampoCartas[]
  sabadosManha: CampoSabado[]
  sabadosTarde: CampoSabado[]
  campoDomingo: CampoDomingo[]
  segundoDomingo: string | null
}) {
  const cell = (extra?: React.CSSProperties): React.CSSProperties => ({
    border: "1px solid #ccc",
    padding: "4px 8px",
    fontSize: "11px",
    color: "#111",
    ...extra,
  })

  const headerBar = (bg: string): React.CSSProperties => ({
    backgroundColor: bg,
    color: "#fff",
    padding: "5px 10px",
    fontSize: "11px",
    fontWeight: "bold",
    marginBottom: "6px",
  })

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", color: "#111", width: "100%" }}>
      {/* Título */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "15px", fontWeight: "bold", textTransform: "uppercase" }}>
          Serviço de Campo — {mesLabel}
        </div>
      </div>

      {/* DURANTE A SEMANA */}
      {semanaOrdenada.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <div style={headerBar("#1e3a5f")}>Programa de Ministério Durante a Semana</div>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={cell({ backgroundColor: "#e5e7eb", fontWeight: "bold", width: "180px" })}>Dia</th>
                <th style={cell({ backgroundColor: "#e5e7eb", fontWeight: "bold" })}>Dirigente</th>
                <th style={cell({ backgroundColor: "#e5e7eb", fontWeight: "bold", width: "110px" })}>Horário</th>
              </tr>
            </thead>
            <tbody>
              {semanaOrdenada.map(item => (
                <tr key={item.id}>
                  <td style={cell()}>{diasSemanaLabel[item.dia_semana]}</td>
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
                <th style={cell({ backgroundColor: "#e5e7eb", fontWeight: "bold", width: "140px" })}>Dia</th>
                <th style={cell({ backgroundColor: "#e5e7eb", fontWeight: "bold" })}>Descrição</th>
                <th style={cell({ backgroundColor: "#e5e7eb", fontWeight: "bold" })}>Responsável</th>
                <th style={cell({ backgroundColor: "#e5e7eb", fontWeight: "bold", width: "110px" })}>Horário</th>
              </tr>
            </thead>
            <tbody>
              {campoCartas.map(carta => (
                <tr key={carta.id}>
                  <td style={cell()}>{diasSemanaLabel[carta.dia_semana]}</td>
                  <td style={cell()}>{carta.descricao || "—"}</td>
                  <td style={cell()}>{carta.responsavel_nome}</td>
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
                  <th key={s.id} style={cell({ backgroundColor: "#e5e7eb", textAlign: "center", fontWeight: "bold" })}>
                    {formatarData(s.data)}
                  </th>
                ))}
              </tr>
              <tr>
                {sabadosManha.map(s => (
                  <td key={s.id} style={cell({ textAlign: "center" })}>{s.horario}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {sabadosManha.map(s => (
                  <td key={s.id} style={cell({ textAlign: "center", minHeight: "22px" })}>{s.dirigente_nome || "—"}</td>
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
                  <th key={s.id} style={cell({ backgroundColor: "#e5e7eb", textAlign: "center", fontWeight: "bold" })}>
                    {formatarData(s.data)}
                  </th>
                ))}
              </tr>
              <tr>
                {sabadosTarde.map(s => (
                  <td key={s.id} style={cell({ textAlign: "center" })}>{s.horario}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {sabadosTarde.map(s => (
                  <td key={s.id} style={cell({ textAlign: "center" })}>{s.dirigente_nome || "—"}</td>
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
                  <th key={d.id} style={cell({ backgroundColor: "#e5e7eb", textAlign: "center", fontWeight: "bold" })}>
                    {formatarData(d.data)}{d.data === segundoDomingo ? "*" : ""}
                  </th>
                ))}
              </tr>
              <tr>
                {campoDomingo.map(d => (
                  <td key={d.id} style={cell({ textAlign: "center", fontSize: "10px" })}>{d.horario}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {campoDomingo.map(d => (
                  <td key={d.id} style={cell({ textAlign: "center" })}>
                    {d.tipo === "grupo"
                      ? "Saída em Grupo"
                      : d.tipo === "salao"
                      ? <>No Salão{d.dirigente_nome ? <><br /><span style={{ fontWeight: "bold" }}>{d.dirigente_nome}</span></> : ""}</>
                      : d.dirigente_nome || "—"
                    }
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          {campoDomingo.some(d => d.data === segundoDomingo) && (
            <div style={{ fontSize: "10px", marginTop: "4px", color: "#555" }}>* 2º Domingo do mês — Serviço no Salão</div>
          )}
        </div>
      )}
    </div>
  )
}
