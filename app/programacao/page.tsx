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
  MapPin,
  Sun,
  Church,
  UserCheck,
  Headphones,
  CalendarDays,
  Sparkles,
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

interface CampoCartas {
  id: string
  descricao: string
  responsavel_nome: string
  periodo: string
  horario: string
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
    presidente: string
    leitor_sentinela: string
  } | null
  discurso: {
    tema: string
    orador_nome: string | null
    orador_congregacao: string | null
  } | null
}

interface LimpezaSalao {
  grupo_nome: string | null
  limpeza_semanal_grupo_nome: string | null
  semana: number
  grupos?: { local: string | null } | null
}

interface ProgramacaoDia {
  data: string
  diaSemana: number
  nomeDia: string
  campo: {
    semana: CampoSemana[]
    cartas: CampoCartas[]
    sabado: CampoSabado[]
    domingo: CampoDomingo[]
  }
  equipe: EquipeTecnica | null
  vidaMinisterio: {
    semana: VidaSemana | null
    partes: Parte[]
  }
  reuniaoPublica: ReuniaoPublica
  limpezaSalao: LimpezaSalao | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DIAS_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
const DIAS_CURTO  = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function formatarDataLonga(dataStr: string): string {
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

const periodoLabel: Record<string, string> = { manha: "Manhã", tarde: "Tarde" }
const tipoLabel: Record<string, string>    = { individual: "Individual", grupo: "Grupo", salao: "No Salão" }

const SECOES: Record<string, { label: string; cor: string; Icon: React.ElementType }> = {
  tesouros:  { label: "Tesouros da Palavra de Deus",    cor: "#b45309", Icon: Gem },
  ministerio:{ label: "Faça Seu Melhor no Ministério",  cor: "#d97706", Icon: MessageSquare },
  vida:      { label: "Nossa Vida Cristã",               cor: "#3b82f6", Icon: Heart },
}

// ─── Componentes base ─────────────────────────────────────────────────────────

function InfoRow({ label, value, Icon }: { label: string; value: string | null | undefined; Icon?: React.ElementType }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/10 last:border-0">
      {Icon && <Icon size={14} className="mt-0.5 shrink-0 opacity-60" />}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-[10px] uppercase tracking-wider opacity-50 font-bold">{label}</span>
        <span className="text-[14px] font-medium leading-snug">{value}</span>
      </div>
    </div>
  )
}

// Card com borda lateral colorida
function Card({
  corBorda,
  corFundo,
  corTexto,
  titulo,
  badge,
  badgeCor,
  Icon,
  children,
}: {
  corBorda: string
  corFundo: string
  corTexto: string
  titulo: string
  badge?: string
  badgeCor?: string
  Icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-md"
      style={{ background: corFundo, color: corTexto, borderLeft: `4px solid ${corBorda}` }}
    >
      {/* Header do card */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Icon size={16} className="shrink-0 opacity-80" />
          <span className="font-bold text-[13px] uppercase tracking-wide">{titulo}</span>
        </div>
        {badge && (
          <span
            className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full"
            style={{ background: badgeCor ?? corBorda, color: "white" }}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  )
}

function Empty({ mensagem }: { mensagem: string }) {
  return <p className="text-[13px] opacity-40 py-1 text-center italic">{mensagem}</p>
}

// ─── Blocos de conteúdo ───────────────────────────────────────────────────────

function BlocoCampoSemana({ campo }: { campo: CampoSemana[] }) {
  if (campo.length === 0) return <Empty mensagem="Nenhuma saída cadastrada" />
  return (
    <div className="flex flex-col">
      {campo.map((c, i) => (
        <div key={i} className="flex items-center justify-between gap-2 py-2.5 border-b border-white/10 last:border-0">
          <div>
            <p className="text-[10px] opacity-50 uppercase tracking-wider font-bold">{periodoLabel[c.periodo] ?? c.periodo}{c.horario ? ` · ${c.horario}` : ""}</p>
            <p className="text-[14px] font-semibold">{c.dirigente_nome || "—"}</p>
          </div>
          <Sun size={15} className="opacity-30 shrink-0" />
        </div>
      ))}
    </div>
  )
}

function BlocoCampoSabado({ campo }: { campo: CampoSabado[] }) {
  if (campo.length === 0) return <Empty mensagem="Nenhuma saída cadastrada" />
  return (
    <div className="flex flex-col">
      {campo.map((c, i) => (
        <div key={i} className="py-2.5 border-b border-white/10 last:border-0">
          <p className="text-[10px] opacity-50 uppercase tracking-wider font-bold">{periodoLabel[c.periodo] ?? c.periodo}{c.horario ? ` · ${c.horario}` : ""}</p>
          <p className="text-[14px] font-semibold">{c.dirigente_nome || "—"}</p>
        </div>
      ))}
    </div>
  )
}

function BlocoCampoCartas({ cartas }: { cartas: CampoCartas[] }) {
  if (cartas.length === 0) return <Empty mensagem="Nenhuma carta cadastrada" />
  return (
    <div className="flex flex-col">
      {cartas.map((c, i) => (
        <div key={i} className="py-2.5 border-b border-white/10 last:border-0">
          <p className="text-[10px] opacity-50 uppercase tracking-wider font-bold">{periodoLabel[c.periodo] ?? c.periodo}{c.horario ? ` · ${c.horario}` : ""}</p>
          {c.descricao && <p className="text-[12px] opacity-60 mb-0.5">{c.descricao}</p>}
          <p className="text-[14px] font-semibold">{c.responsavel_nome || "—"}</p>
        </div>
      ))}
    </div>
  )
}

function BlocoCampoDomingo({ campo }: { campo: CampoDomingo[] }) {
  if (campo.length === 0) return <Empty mensagem="Nenhuma saída cadastrada" />
  return (
    <div className="flex flex-col">
      {campo.map((c, i) => (
        <div key={i} className="py-2.5 border-b border-white/10 last:border-0">
          <p className="text-[10px] opacity-50 uppercase tracking-wider font-bold">{c.horario ? `${c.horario} · ` : ""}{tipoLabel[c.tipo] ?? c.tipo}</p>
          {c.tipo === "salao" && c.dirigente_nome && <p className="text-[14px] font-semibold">{c.dirigente_nome}</p>}
        </div>
      ))}
    </div>
  )
}

function BlocoLimpeza({ limpeza }: { limpeza: LimpezaSalao }) {
  const grupo = limpeza.grupo_nome || limpeza.limpeza_semanal_grupo_nome
  const local = limpeza.grupos?.local
  const valor = local ? `${grupo || "Grupo não definido"} — ${local}` : (grupo || "Grupo não definido")
  return (
    <div>
      <InfoRow label={`Semana ${limpeza.semana}`} value={valor} Icon={Users} />
    </div>
  )
}

function BlocoEquipe({ equipe }: { equipe: EquipeTecnica }) {
  const mv1NoPalco = equipe.microvolante_palco === 1
  const mv2NoPalco = equipe.microvolante_palco === 2
  return (
    <div>
      <InfoRow label="Áudio e Vídeo" value={equipe.som_nome} Icon={Volume2} />
      <InfoRow label="Indicadores" value={[equipe.indicador1_nome, equipe.indicador2_nome].filter(Boolean).join(" / ")} Icon={Users} />
      {equipe.microvolante1_nome && (
        <div className="flex items-start gap-3 py-2.5 border-b border-white/10 last:border-0">
          <Mic size={14} className={`mt-0.5 shrink-0 ${mv1NoPalco ? "opacity-80" : "opacity-30"}`} />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider opacity-50 font-bold">Microvolante{mv1NoPalco ? " · Palco" : ""}</span>
            <span className="text-[14px] font-medium">{equipe.microvolante1_nome}</span>
          </div>
        </div>
      )}
      {equipe.microvolante2_nome && (
        <div className="flex items-start gap-3 py-2.5 border-b border-white/10 last:border-0">
          <Mic size={14} className={`mt-0.5 shrink-0 ${mv2NoPalco ? "opacity-80" : "opacity-30"}`} />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider opacity-50 font-bold">Microvolante{mv2NoPalco ? " · Palco" : ""}</span>
            <span className="text-[14px] font-medium">{equipe.microvolante2_nome}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function BlocoVidaMinisterio({ semana, partes }: { semana: VidaSemana; partes: Parte[] }) {
  if (semana.sem_reuniao) {
    return (
      <p className="text-[14px] text-center py-3 font-semibold opacity-70">
        Sem reunião{semana.motivo_sem_reuniao ? ` — ${semana.motivo_sem_reuniao}` : ""}
      </p>
    )
  }

  const grupos = Object.entries(SECOES).map(([key, meta]) => ({
    key, meta, partes: partes.filter((p) => p.secao === key),
  }))

  return (
    <div className="flex flex-col gap-3">
      <InfoRow label="Presidente" value={semana.presidente} Icon={UserCheck} />
      <InfoRow label="Oração inicial" value={semana.oracao_inicial} Icon={BookOpen} />
      {semana.cantico_inicial && (
        <InfoRow label={`Cântico ${semana.cantico_inicial}`} value={semana.cantico_inicial_nome ?? `Cântico ${semana.cantico_inicial}`} Icon={Music} />
      )}

      {grupos.map(({ key, meta, partes: ps }) =>
        ps.length === 0 ? null : (
          <div key={key}>
            <div className="flex items-center gap-1.5 mb-2 mt-1">
              <div className="h-px flex-1 opacity-20" style={{ background: meta.cor }} />
              <div className="flex items-center gap-1">
                <meta.Icon size={11} style={{ color: meta.cor }} />
                <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: meta.cor }}>{meta.label}</span>
              </div>
              <div className="h-px flex-1 opacity-20" style={{ background: meta.cor }} />
            </div>
            {ps.map((p) => (
              <div key={p.id} className="py-2 border-b border-white/10 last:border-0">
                <p className="text-[10px] opacity-45 uppercase tracking-wider font-bold">{p.titulo}{p.tempo ? ` · ${p.tempo}` : ""}</p>
                <p className="text-[14px] font-semibold">{p.participante_nome || "—"}</p>
                {p.ajudante_nome  && <p className="text-[12px] opacity-55 mt-0.5">Ajudante: {p.ajudante_nome}</p>}
                {p.leitor_nome    && <p className="text-[12px] opacity-55 mt-0.5">Leitor: {p.leitor_nome}</p>}
                {p.oracao_final_nome && <p className="text-[12px] opacity-55 mt-0.5">Oração final: {p.oracao_final_nome}</p>}
              </div>
            ))}
          </div>
        )
      )}

      {semana.cantico_meio && (
        <InfoRow label={`Cântico ${semana.cantico_meio}`} value={semana.cantico_meio_nome ?? `Cântico ${semana.cantico_meio}`} Icon={Music} />
      )}
      {semana.cantico_final && (
        <InfoRow label={`Cântico ${semana.cantico_final}`} value={semana.cantico_final_nome ?? `Cântico ${semana.cantico_final}`} Icon={Music} />
      )}
    </div>
  )
}

function BlocoReuniaoDomingo({ reuniao }: { reuniao: ReuniaoPublica }) {
  const { designacao, discurso } = reuniao
  return (
    <div>
      <InfoRow label="Presidente" value={designacao?.presidente || "—"} Icon={UserCheck} />
      {discurso?.tema              && <InfoRow label="Tema do Discurso" value={discurso.tema} Icon={BookOpen} />}
      {discurso?.orador_nome       && <InfoRow label="Orador" value={discurso.orador_nome} Icon={UserCheck} />}
      {discurso?.orador_congregacao && <InfoRow label="Congregação" value={discurso.orador_congregacao} Icon={Church} />}
      <InfoRow label="Dirigente — A Sentinela" value="Júnior Silva" Icon={UserCheck} />
      <InfoRow label="Leitor — A Sentinela" value={designacao?.leitor_sentinela || "—"} Icon={BookOpen} />
    </div>
  )
}

// ─── Pílulas de resumo do dia ─────────────────────────────────────────────────

function PilulasDia({ programacao, isQuinta, isDomingo, isSabado, isSegSex }: {
  programacao: ProgramacaoDia
  isQuinta: boolean
  isDomingo: boolean
  isSabado: boolean
  isSegSex: boolean
}) {
  const pilulas: { label: string; cor: string }[] = []

  if (isQuinta && programacao.vidaMinisterio.semana && !programacao.vidaMinisterio.semana.sem_reuniao)
    pilulas.push({ label: "Reunião", cor: "#1d4ed8" })
  if (isDomingo)
    pilulas.push({ label: "Reunião", cor: "#b45309" })
  if ((isSegSex && programacao.campo.semana.length > 0) || (isSabado && programacao.campo.sabado.length > 0) || (isDomingo && programacao.campo.domingo.length > 0))
    pilulas.push({ label: "Campo", cor: "#15803d" })
  if ((isQuinta || isDomingo) && programacao.equipe)
    pilulas.push({ label: "Equipe Técnica", cor: "#6d28d9" })
  if ((isQuinta || isDomingo) && programacao.limpezaSalao)
    pilulas.push({ label: "Limpeza", cor: "#0f766e" })

  if (pilulas.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {pilulas.map((p, i) => (
        <span
          key={i}
          className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white"
          style={{ background: p.cor }}
        >
          {p.label}
        </span>
      ))}
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
      setProgramacao(await res.json())
    } catch {
      setErro("Não foi possível carregar a programação.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { buscarProgramacao(dataAtual) }, [dataAtual, buscarProgramacao])

  const irParaDia = (n: number) => setDataAtual((prev) => adicionarDias(prev, n))

  const dSemana  = programacao?.diaSemana ?? new Date(dataAtual + "T12:00:00").getDay()
  const isQuinta  = dSemana === 4
  const isDomingo = dSemana === 0
  const isSabado  = dSemana === 6
  const isSegSex  = dSemana >= 1 && dSemana <= 5

  // Badge do tipo de reunião no dia
  const badgeReuniao = isQuinta ? { label: "QUINTA-FEIRA", cor: "#2563eb" }
    : isDomingo ? { label: "DOMINGO", cor: "#b45309" }
    : null

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>

      {/* ── Header fixo ── */}
      <header className="sticky top-0 z-30 bg-sidebar shadow-xl">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-3 flex flex-col gap-1">

          {/* Identidade */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sidebar-primary/20">
              <CalendarDays size={13} className="text-sidebar-primary" />
            </div>
            <span className="text-[14px] font-black tracking-tight text-sidebar-foreground">
              Info<span className="text-sidebar-primary">Flow</span>
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-sidebar-foreground/40 text-center">
            Congregação Parque Sabará — Taubaté SP
          </p>

          {/* Navegação por dia */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => irParaDia(-1)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-sidebar-accent/60 active:scale-95 transition-transform"
              aria-label="Dia anterior"
            >
              <ChevronLeft size={20} className="text-sidebar-foreground" />
            </button>

            <div className="flex-1 text-center">
              {/* Badge do dia de reunião */}
              {badgeReuniao && (
                <div className="flex justify-center mb-0.5">
                  <span
                    className="text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full text-white"
                    style={{ background: badgeReuniao.cor }}
                  >
                    {badgeReuniao.label}
                  </span>
                </div>
              )}
              <p className="text-sidebar-primary font-black text-[19px] capitalize leading-tight">
                {DIAS_SEMANA[dSemana]}
              </p>
              <p className="text-sidebar-foreground/50 text-[12px]">{formatarDataLonga(dataAtual)}</p>
            </div>

            <button
              onClick={() => irParaDia(1)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-sidebar-accent/60 active:scale-95 transition-transform"
              aria-label="Próximo dia"
            >
              <ChevronRight size={20} className="text-sidebar-foreground" />
            </button>
          </div>

          {/* Mini-calendário semanal */}
          <div className="flex justify-between mt-2.5 gap-1">
            {Array.from({ length: 7 }).map((_, i) => {
              const base = new Date(dataAtual + "T12:00:00")
              const inicio = new Date(base)
              inicio.setDate(base.getDate() - base.getDay() + i)
              const dStr = toDateStr(inicio)
              const isAtivo = dStr === dataAtual
              // destaca Qui (4) e Dom (0) como dias de reunião
              const isReuniaoDay = i === 4 || i === 0
              return (
                <button
                  key={i}
                  onClick={() => setDataAtual(dStr)}
                  className="flex-1 flex flex-col items-center rounded-xl py-1.5 gap-0.5 transition-all active:scale-95"
                  style={{
                    background: isAtivo
                      ? "rgba(255,255,255,0.20)"
                      : "transparent",
                  }}
                >
                  <span className={`text-[9px] font-bold uppercase ${isAtivo ? "text-sidebar-foreground" : "text-sidebar-foreground/40"}`}>
                    {DIAS_CURTO[i]}
                  </span>
                  <span className={`text-[15px] font-black ${isAtivo ? "text-sidebar-foreground" : isReuniaoDay ? "text-sidebar-primary/70" : "text-sidebar-foreground/50"}`}>
                    {inicio.getDate()}
                  </span>
                  {/* ponto indicador de dia de reunião */}
                  <span className={`w-1 h-1 rounded-full ${isReuniaoDay ? (isAtivo ? "bg-sidebar-primary" : "bg-sidebar-primary/40") : "bg-transparent"}`} />
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* ── Conteúdo ── */}
      <main className="max-w-lg mx-auto px-4 pt-5 pb-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm opacity-40">Carregando...</p>
          </div>
        ) : erro ? (
          <div className="text-center py-16">
            <p className="text-red-400 font-semibold text-sm">{erro}</p>
          </div>
        ) : programacao ? (
          <div className="flex flex-col gap-3.5">

            {/* Pílulas resumo */}
            <PilulasDia
              programacao={programacao}
              isQuinta={isQuinta}
              isDomingo={isDomingo}
              isSabado={isSabado}
              isSegSex={isSegSex}
            />

            {/* ── Campo de serviço (Seg–Sex) ── */}
            {isSegSex && programacao.campo.semana.length > 0 && (
              <Card titulo="Serviço de Campo" corBorda="#16a34a" corFundo="#14532d" corTexto="#f0fdf4" Icon={MapPin}>
                <BlocoCampoSemana campo={programacao.campo.semana} />
              </Card>
            )}

            {/* ── Cartas (segunda-feira) ── */}
            {dSemana === 1 && programacao.campo.cartas.length > 0 && (
              <Card titulo="Serviço de Cartas" corBorda="#0891b2" corFundo="#0e7490" corTexto="#ecfeff" Icon={MapPin}>
                <BlocoCampoCartas cartas={programacao.campo.cartas} />
              </Card>
            )}

            {/* ── Campo Sábado ── */}
            {isSabado && (
              <Card titulo="Serviço de Campo — Sábado" corBorda="#16a34a" corFundo="#14532d" corTexto="#f0fdf4" Icon={MapPin}>
                <BlocoCampoSabado campo={programacao.campo.sabado} />
              </Card>
            )}

            {/* ── Campo Domingo ── */}
            {isDomingo && programacao.campo.domingo.length > 0 && (
              <Card titulo="Serviço de Campo" corBorda="#16a34a" corFundo="#14532d" corTexto="#f0fdf4" Icon={MapPin}>
                <BlocoCampoDomingo campo={programacao.campo.domingo} />
              </Card>
            )}

            {/* ── Reunião Quinta ── */}
            {isQuinta && (
              <>
                {programacao.vidaMinisterio.semana ? (
                  <Card
                    titulo="Reunião — Vida e Ministério"
                    badge="Quinta-feira"
                    badgeCor="#1d4ed8"
                    corBorda="#3b82f6"
                    corFundo="#1e3a8a"
                    corTexto="#eff6ff"
                    Icon={BookOpen}
                  >
                    <BlocoVidaMinisterio
                      semana={programacao.vidaMinisterio.semana}
                      partes={programacao.vidaMinisterio.partes as Parte[]}
                    />
                  </Card>
                ) : (
                  <Card titulo="Reunião — Vida e Ministério" badge="Quinta-feira" badgeCor="#1d4ed8" corBorda="#3b82f6" corFundo="#1e3a8a" corTexto="#eff6ff" Icon={BookOpen}>
                    <Empty mensagem="Nenhuma informação cadastrada para esta semana" />
                  </Card>
                )}

                {programacao.equipe && (
                  <Card titulo="Equipe Técnica" corBorda="#7c3aed" corFundo="#4c1d95" corTexto="#f5f3ff" Icon={Headphones}>
                    <BlocoEquipe equipe={programacao.equipe} />
                  </Card>
                )}

                {programacao.limpezaSalao && (
                  <Card titulo="Limpeza do Salão" corBorda="#14b8a6" corFundo="#134e4a" corTexto="#f0fdfa" Icon={Sparkles}>
                    <BlocoLimpeza limpeza={programacao.limpezaSalao} />
                  </Card>
                )}
              </>
            )}

            {/* ── Reunião Domingo ── */}
            {isDomingo && (
              <>
                <Card
                  titulo="Reunião — Discurso Público"
                  badge="Domingo"
                  badgeCor="#b45309"
                  corBorda="#f59e0b"
                  corFundo="#78350f"
                  corTexto="#fffbeb"
                  Icon={Church}
                >
                  <BlocoReuniaoDomingo reuniao={programacao.reuniaoPublica ?? { designacao: null, discurso: null }} />
                </Card>

                {programacao.equipe && (
                  <Card titulo="Equipe Técnica" corBorda="#7c3aed" corFundo="#4c1d95" corTexto="#f5f3ff" Icon={Headphones}>
                    <BlocoEquipe equipe={programacao.equipe} />
                  </Card>
                )}

                {programacao.limpezaSalao && (
                  <Card titulo="Limpeza do Salão" corBorda="#14b8a6" corFundo="#134e4a" corTexto="#f0fdfa" Icon={Sparkles}>
                    <BlocoLimpeza limpeza={programacao.limpezaSalao} />
                  </Card>
                )}
              </>
            )}

            {/* Fallback: sem informações */}
            {!isQuinta && !isDomingo && !isSabado && programacao.campo.semana.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <CalendarDays size={36} className="opacity-15" />
                <div>
                  <p className="font-semibold opacity-30 text-[15px]">Nenhuma atividade registrada</p>
                  <p className="opacity-20 text-[13px] mt-1">Use as setas para navegar para um dia com programação</p>
                </div>
              </div>
            )}

          </div>
        ) : null}
      </main>
    </div>
  )
}
