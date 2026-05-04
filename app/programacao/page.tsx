"use client"

import { useState, useEffect, useCallback } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  Volume2,
  Users,
  BookOpen,
  Music,
  Heart,
  MessageSquare,
  Gem,
  Map,
  Sun,
  Church,
  UserCheck,
  Headphones,
  CalendarDays,
} from "lucide-react"

// ─── Tipos ──────────────────────────────────────────────────────────────────

interface CampoSemana {
  id: string
  dia_semana: string
  dirigente_nome: string
  periodo: string
  horario: string
}

interface CampoSabado {
  id: string
  periodo: string
  horario: string
  dirigente_nome: string
}

interface CampoDomingo {
  id: string
  horario: string
  dirigente_nome: string | null
  tipo: "individual" | "grupo" | "salao"
}

interface EquipeTecnica {
  indicador1_nome: string | null
  indicador2_nome: string | null
  microvolante1_nome: string | null
  microvolante2_nome: string | null
  microvolante_palco: 1 | 2 | null
  som_nome: string | null
}

interface VidaSemana {
  presidente: string | null
  oracao_inicial: string | null
  cantico_inicial: number | null
  cantico_inicial_nome: string | null
  cantico_meio: number | null
  cantico_meio_nome: string | null
  cantico_final: number | null
  cantico_final_nome: string | null
  leitura_semanal: string | null
  sem_reuniao: boolean
  motivo_sem_reuniao: string | null
}

interface Parte {
  id: string
  secao: string
  titulo: string
  tempo: string | null
  participante_nome: string | null
  ajudante_nome: string | null
  sala: string
  ordem: number
  leitor_nome: string | null
  oracao_final_nome: string | null
}

interface ReuniaoPublica {
  designacao: {
    presidente_nome: string
    leitor_sentinela_nome: string
  } | null
  discurso: {
    tema: string
    orador_nome: string | null
    orador_congregacao: string | null
  } | null
}

interface ProgramacaoDia {
  data: string
  diaSemana: number
  nomeDia: string
  campo: {
    semana: CampoSemana[]
    sabado: CampoSabado[]
    domingo: CampoDomingo[]
  }
  equipe: EquipeTecnica | null
  vidaMinisterio: {
    semana: VidaSemana | null
    partes: Parte[]
  }
  reuniaoPublica: ReuniaoPublica
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DIAS_SEMANA = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
const DIAS_CURTO = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function formatarData(dataStr: string): string {
  const d = new Date(dataStr + "T12:00:00")
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
}

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0]
}

function adicionarDias(dataStr: string, n: number): string {
  const d = new Date(dataStr + "T12:00:00")
  d.setDate(d.getDate() + n)
  return toDateStr(d)
}

const periodoLabel: Record<string, string> = {
  manha: "Manhã",
  tarde: "Tarde",
}

const tipoLabel: Record<string, string> = {
  individual: "Individual",
  grupo: "Grupo",
  salao: "No Salão",
}

const secaoLabel: Record<string, { label: string; cor: string; Icon: React.ElementType }> = {
  tesouros: { label: "Tesouros da Palavra de Deus", cor: "#b45309", Icon: Gem },
  ministerio: { label: "Faça Seu Melhor no Ministério", cor: "#d97706", Icon: MessageSquare },
  vida: { label: "Nossa Vida Cristã", cor: "#dc2626", Icon: Heart },
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function InfoRow({ label, value, Icon }: { label: string; value: string | null | undefined; Icon?: React.ElementType }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/10 last:border-0">
      {Icon && <Icon size={15} className="mt-0.5 shrink-0 opacity-70" />}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[11px] uppercase tracking-wider opacity-60 font-semibold">{label}</span>
        <span className="text-[15px] font-medium leading-snug">{value}</span>
      </div>
    </div>
  )
}

function Bloco({
  titulo,
  corFundo,
  corTexto,
  Icon,
  children,
}: {
  titulo: string
  corFundo: string
  corTexto: string
  Icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-lg"
      style={{ background: corFundo, color: corTexto }}
    >
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/15">
        <Icon size={18} className="shrink-0" />
        <span className="font-bold text-[14px] uppercase tracking-wide">{titulo}</span>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  )
}

function EmptyBloco({ mensagem }: { mensagem: string }) {
  return (
    <p className="text-[13px] opacity-50 py-1 text-center italic">{mensagem}</p>
  )
}

// ─── Blocos por tipo de dia ───────────────────────────────────────────────────

function BlocoCampoSemana({ campo }: { campo: CampoSemana[] }) {
  if (campo.length === 0) return <EmptyBloco mensagem="Nenhuma saída cadastrada" />
  return (
    <div className="flex flex-col gap-2">
      {campo.map((c, i) => (
        <div key={i} className="flex items-center justify-between gap-2 py-2 border-b border-white/10 last:border-0">
          <div>
            <p className="text-[11px] opacity-60 uppercase tracking-wider font-semibold">{periodoLabel[c.periodo] ?? c.periodo} — {c.horario}</p>
            <p className="text-[15px] font-medium">{c.dirigente_nome || "—"}</p>
          </div>
          <Sun size={16} className="opacity-50 shrink-0" />
        </div>
      ))}
    </div>
  )
}

function BlocoCampoSabado({ campo }: { campo: CampoSabado[] }) {
  if (campo.length === 0) return <EmptyBloco mensagem="Nenhuma saída cadastrada" />
  return (
    <div className="flex flex-col gap-2">
      {campo.map((c, i) => (
        <div key={i} className="py-2 border-b border-white/10 last:border-0">
          <p className="text-[11px] opacity-60 uppercase tracking-wider font-semibold">{periodoLabel[c.periodo] ?? c.periodo} — {c.horario}</p>
          <p className="text-[15px] font-medium">{c.dirigente_nome || "—"}</p>
        </div>
      ))}
    </div>
  )
}

function BlocoCampoDomingo({ campo }: { campo: CampoDomingo[] }) {
  if (campo.length === 0) return <EmptyBloco mensagem="Nenhuma saída cadastrada" />
  return (
    <div className="flex flex-col gap-2">
      {campo.map((c, i) => (
        <div key={i} className="py-2 border-b border-white/10 last:border-0">
          <p className="text-[11px] opacity-60 uppercase tracking-wider font-semibold">{tipoLabel[c.tipo] ?? c.tipo} — {c.horario}</p>
          <p className="text-[15px] font-medium">{c.dirigente_nome || "—"}</p>
        </div>
      ))}
    </div>
  )
}

function BlocoEquipe({ equipe }: { equipe: EquipeTecnica }) {
  const volante =
    equipe.microvolante_palco === 1
      ? equipe.microvolante1_nome
      : equipe.microvolante_palco === 2
      ? equipe.microvolante2_nome
      : null
  return (
    <div>
      <InfoRow label="Som" value={equipe.som_nome} Icon={Volume2} />
      <InfoRow label="Indicador" value={[equipe.indicador1_nome, equipe.indicador2_nome].filter(Boolean).join(" / ")} Icon={Users} />
      <InfoRow label="Microvolante (palco)" value={volante} Icon={Mic} />
      {equipe.microvolante1_nome && <InfoRow label="Microvolante 1" value={equipe.microvolante1_nome} Icon={Mic} />}
      {equipe.microvolante2_nome && <InfoRow label="Microvolante 2" value={equipe.microvolante2_nome} Icon={Mic} />}
    </div>
  )
}

function BlocoVidaMinisterio({ semana, partes }: { semana: VidaSemana; partes: Parte[] }) {
  if (semana.sem_reuniao) {
    return (
      <p className="text-[14px] text-center py-2 font-semibold opacity-80">
        Sem reunião{semana.motivo_sem_reuniao ? ` — ${semana.motivo_sem_reuniao}` : ""}
      </p>
    )
  }

  const grupos = Object.entries(secaoLabel).map(([key, meta]) => ({
    key,
    meta,
    partes: partes.filter((p) => p.secao === key),
  }))

  return (
    <div className="flex flex-col gap-3">
      <InfoRow label="Presidente" value={semana.presidente} Icon={UserCheck} />
      <InfoRow label="Oração inicial" value={semana.oracao_inicial} Icon={BookOpen} />
      {semana.cantico_inicial && (
        <InfoRow label={`Cântico ${semana.cantico_inicial}`} value={semana.cantico_inicial_nome ?? "—"} Icon={Music} />
      )}

      {grupos.map(({ key, meta, partes: ps }) =>
        ps.length === 0 ? null : (
          <div key={key} className="mt-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <meta.Icon size={13} style={{ color: meta.cor }} />
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-70" style={{ color: meta.cor }}>
                {meta.label}
              </span>
            </div>
            {ps.map((p) => (
              <div key={p.id} className="py-2 border-b border-white/10 last:border-0 pl-1">
                <p className="text-[11px] opacity-50 uppercase tracking-wider font-semibold">{p.titulo}{p.tempo ? ` · ${p.tempo}` : ""}</p>
                <p className="text-[15px] font-medium">{p.participante_nome || "—"}</p>
                {p.ajudante_nome && <p className="text-[12px] opacity-60">Ajudante: {p.ajudante_nome}</p>}
                {p.leitor_nome && <p className="text-[12px] opacity-60">Leitor: {p.leitor_nome}</p>}
                {p.oracao_final_nome && <p className="text-[12px] opacity-60">Oração final: {p.oracao_final_nome}</p>}
              </div>
            ))}
          </div>
        )
      )}

      {semana.cantico_meio && (
        <InfoRow label={`Cântico ${semana.cantico_meio}`} value={semana.cantico_meio_nome ?? "—"} Icon={Music} />
      )}
      {semana.cantico_final && (
        <InfoRow label={`Cântico ${semana.cantico_final}`} value={semana.cantico_final_nome ?? "—"} Icon={Music} />
      )}
    </div>
  )
}

function BlocoReuniaoDomingo({ reuniao }: { reuniao: ReuniaoPublica }) {
  const { designacao, discurso } = reuniao
  if (!designacao && !discurso) return <EmptyBloco mensagem="Nenhuma informação cadastrada" />
  return (
    <div>
      {discurso && (
        <>
          <InfoRow label="Tema do discurso" value={discurso.tema} Icon={BookOpen} />
          <InfoRow label="Orador" value={discurso.orador_nome} Icon={UserCheck} />
          <InfoRow label="Congregação" value={discurso.orador_congregacao} Icon={Church} />
        </>
      )}
      {designacao && (
        <>
          <InfoRow label="Presidente" value={designacao.presidente_nome} Icon={UserCheck} />
          <InfoRow label="Leitor A Sentinela" value={designacao.leitor_sentinela_nome} Icon={BookOpen} />
        </>
      )}
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ProgramacaoPage() {
  const [dataAtual, setDataAtual] = useState<string>(() => toDateStr(new Date()))
  const [programacao, setProgramacao] = useState<ProgramacaoDia | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const buscarProgramacao = useCallback(async (data: string) => {
    setLoading(true)
    setErro(null)
    try {
      const res = await fetch(`/api/programacao?data=${data}`)
      if (!res.ok) throw new Error("Erro ao buscar programação")
      const json = await res.json()
      setProgramacao(json)
    } catch {
      setErro("Não foi possível carregar a programação.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    buscarProgramacao(dataAtual)
  }, [dataAtual, buscarProgramacao])

  const irParaDia = (n: number) => {
    setDataAtual((prev) => adicionarDias(prev, n))
  }

  const dSemana = programacao?.diaSemana ?? new Date(dataAtual + "T12:00:00").getDay()
  const isQuinta = dSemana === 4
  const isDomingo = dSemana === 0
  const isSabado = dSemana === 6
  const isSegSex = dSemana >= 1 && dSemana <= 5

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>

      {/* Header fixo */}
      <header
        className="sticky top-0 z-30 shadow-md"
        style={{ background: "var(--primary)" }}
      >
        <div className="max-w-lg mx-auto px-4 py-4 flex flex-col gap-1">
          <p className="text-[11px] uppercase tracking-widest opacity-70 font-semibold text-white text-center">
            Congregação Parque Sabará
          </p>
          <h1 className="text-white text-xl font-bold text-center leading-tight tracking-tight">
            Quadro de Programação
          </h1>

          {/* Navegação por dia */}
          <div className="flex items-center justify-between mt-3 gap-2">
            <button
              onClick={() => irParaDia(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 active:bg-white/30 transition-colors"
              aria-label="Dia anterior"
            >
              <ChevronLeft size={22} className="text-white" />
            </button>

            <div className="flex-1 text-center">
              <p className="text-white font-bold text-[17px] capitalize leading-tight">
                {DIAS_SEMANA[dSemana]}
              </p>
              <p className="text-white/70 text-[13px]">{formatarData(dataAtual)}</p>
            </div>

            <button
              onClick={() => irParaDia(1)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 active:bg-white/30 transition-colors"
              aria-label="Próximo dia"
            >
              <ChevronRight size={22} className="text-white" />
            </button>
          </div>

          {/* Mini-calendário semanal */}
          <div className="flex justify-between mt-3 gap-1">
            {Array.from({ length: 7 }).map((_, i) => {
              const base = new Date(dataAtual + "T12:00:00")
              const inicio = new Date(base)
              inicio.setDate(base.getDate() - base.getDay() + i)
              const dStr = toDateStr(inicio)
              const isAtivo = dStr === dataAtual
              return (
                <button
                  key={i}
                  onClick={() => setDataAtual(dStr)}
                  className="flex-1 flex flex-col items-center rounded-xl py-1.5 transition-colors"
                  style={{
                    background: isAtivo ? "rgba(255,255,255,0.25)" : "transparent",
                  }}
                >
                  <span className="text-[10px] text-white/60 font-medium uppercase">{DIAS_CURTO[i]}</span>
                  <span className="text-white text-[14px] font-bold">{inicio.getDate()}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-lg mx-auto px-4 py-5 flex flex-col gap-4 pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm opacity-50">Carregando programação...</p>
          </div>
        ) : erro ? (
          <div className="text-center py-16">
            <p className="text-red-400 font-semibold">{erro}</p>
          </div>
        ) : programacao ? (
          <>
            {/* ── Campo de serviço ── */}
            {isSegSex && programacao.campo.semana.length > 0 && (
              <Bloco titulo="Serviço de Campo" corFundo="#166534" corTexto="#f0fdf4" Icon={Map}>
                <BlocoCampoSemana campo={programacao.campo.semana} />
              </Bloco>
            )}

            {isSabado && (
              <Bloco titulo="Serviço de Campo — Sábado" corFundo="#166534" corTexto="#f0fdf4" Icon={Map}>
                <BlocoCampoSabado campo={programacao.campo.sabado} />
              </Bloco>
            )}

            {isDomingo && programacao.campo.domingo.length > 0 && (
              <Bloco titulo="Serviço de Campo" corFundo="#166534" corTexto="#f0fdf4" Icon={Map}>
                <BlocoCampoDomingo campo={programacao.campo.domingo} />
              </Bloco>
            )}

            {/* ── Reunião de Quinta ── */}
            {isQuinta && (
              <>
                {programacao.vidaMinisterio.semana ? (
                  <Bloco titulo="Reunião — Vida e Ministério" corFundo="#1e3a6e" corTexto="#e8f0fe" Icon={BookOpen}>
                    <BlocoVidaMinisterio
                      semana={programacao.vidaMinisterio.semana}
                      partes={programacao.vidaMinisterio.partes as Parte[]}
                    />
                  </Bloco>
                ) : (
                  <Bloco titulo="Reunião — Vida e Ministério" corFundo="#1e3a6e" corTexto="#e8f0fe" Icon={BookOpen}>
                    <EmptyBloco mensagem="Nenhuma informação cadastrada para esta semana" />
                  </Bloco>
                )}

                {programacao.equipe && (
                  <Bloco titulo="Equipe Técnica" corFundo="#4c1d95" corTexto="#f5f3ff" Icon={Headphones}>
                    <BlocoEquipe equipe={programacao.equipe} />
                  </Bloco>
                )}
              </>
            )}

            {/* ── Reunião de Domingo ── */}
            {isDomingo && (
              <>
                <Bloco titulo="Reunião — Discurso Público" corFundo="#7c2d12" corTexto="#fff7ed" Icon={Church}>
                  <BlocoReuniaoDomingo reuniao={programacao.reuniaoPublica} />
                </Bloco>

                {programacao.equipe && (
                  <Bloco titulo="Equipe Técnica" corFundo="#4c1d95" corTexto="#f5f3ff" Icon={Headphones}>
                    <BlocoEquipe equipe={programacao.equipe} />
                  </Bloco>
                )}
              </>
            )}

            {/* Fallback: dia sem informações */}
            {!isQuinta && !isDomingo && !isSabado &&
              programacao.campo.semana.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <CalendarDays size={40} className="opacity-20" />
                <p className="opacity-40 text-[15px]">Nenhuma atividade registrada para este dia.</p>
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  )
}
