"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CenteredLoader } from "@/components/ui/page-loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Music,
  Gem,
  MessageSquare,
  Heart,
  Loader2,
  Sparkles,
  X,
  AlertTriangle,
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const meses = [
  { valor: 1, nome: "Janeiro" },
  { valor: 2, nome: "Fevereiro" },
  { valor: 3, nome: "Março" },
  { valor: 4, nome: "Abril" },
  { valor: 5, nome: "Maio" },
  { valor: 6, nome: "Junho" },
  { valor: 7, nome: "Julho" },
  { valor: 8, nome: "Agosto" },
  { valor: 9, nome: "Setembro" },
  { valor: 10, nome: "Outubro" },
  { valor: 11, nome: "Novembro" },
  { valor: 12, nome: "Dezembro" },
]

const secoes = [
  { id: "tesouros", nome: "Tesouros da Palavra de Deus", cor: "text-amber-500", icon: Gem },
  { id: "ministerio", nome: "Faça Seu Melhor no Ministério", cor: "text-yellow-500", icon: MessageSquare },
  { id: "vida", nome: "Nossa Vida Cristã", cor: "text-red-500", icon: Heart },
]

// Índice (ordem) das partes fixas dentro da seção "tesouros"
// ordem 1 = Discurso principal, ordem 2 = Joias espirituais, ordem 3 = Leitura da Bíblia
const TESOUROS_ORDEM = { DISCURSO: 1, JOIAS: 2, LEITURA: 3 }

interface Mes {
  id: string
  mes: number
  ano: number
  cor_tema: string
}

interface Semana {
  id: string
  mes_id: string
  data_inicio: string
  data_fim: string
  leitura_semanal: string
  livro_biblia: string | null
  cantico_inicial: number | null
  cantico_inicial_nome: string | null
  cantico_meio: number | null
  cantico_meio_nome: string | null
  cantico_final: number | null
  cantico_final_nome: string | null
  presidente: string | null
  oracao_inicial: string | null
  sem_reuniao: boolean
  motivo_sem_reuniao: string | null
}

interface Parte {
  id: string
  semana_id: string
  secao: string
  titulo: string
  tempo: string | null
  participante_id: string | null
  participante_nome: string | null
  ajudante_id: string | null
  ajudante_nome: string | null
  sala: string
  ordem: number
  // Campos extras Tesouros
  textos: string[]
  texto_biblia: string | null
  licao: string | null
  // Campo ministério
  descricao: string | null
  // Campos estudo bíblico de congregação
  leitor_id: string | null
  leitor_nome: string | null
  oracao_final_id: string | null
  oracao_final_nome: string | null
}

interface Publicador {
  id: string
  nome: string
}

export default function AdminVidaMinisterioPage() {
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [mesData, setMesData] = useState<Mes | null>(null)
  const [semanas, setSemanas] = useState<Semana[]>([])
  const [partes, setPartes] = useState<Parte[]>([])
  const [publicadores, setPublicadores] = useState<Publicador[]>([])
  const [loading, setLoading] = useState(true)
  const [semanaAtiva, setSemanaAtiva] = useState<string | null>(null)
  const [gerandoDescricao, setGerandoDescricao] = useState<string | null>(null)

  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      const { data: pubs } = await supabase
        .from("publicadores")
        .select("id, nome")
        .order("nome")
      setPublicadores(pubs || [])

      let { data: mes } = await supabase
        .from("vida_ministerio_meses")
        .select("*")
        .eq("mes", mesAtual)
        .eq("ano", anoAtual)
        .single()

      if (!mes) {
        const { data: novoMes } = await supabase
          .from("vida_ministerio_meses")
          .insert({ mes: mesAtual, ano: anoAtual })
          .select()
          .single()
        mes = novoMes
      }

      setMesData(mes)

      if (mes) {
        const { data: semanasData } = await supabase
          .from("vida_ministerio_semanas")
          .select("*")
          .eq("mes_id", mes.id)
          .order("data_inicio")

        setSemanas(semanasData || [])

        if (semanasData && semanasData.length > 0) {
          setSemanaAtiva(semanasData[0].id)

          const { data: partesData } = await supabase
            .from("vida_ministerio_partes")
            .select("*")
            .in("semana_id", semanasData.map((s) => s.id))
            .order("ordem")

          setPartes(
            (partesData || []).map((p) => ({
              ...p,
              textos: Array.isArray(p.textos) ? p.textos : [],
            }))
          )
        } else {
          setPartes([])
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }, [mesAtual, anoAtual, supabase])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  // ──────────────────────────────────────────────
  // Semanas
  // ──────────────────────────────────────────────
  const adicionarSemana = async () => {
    if (!mesData) return
    const ultimaSemana = semanas[semanas.length - 1]
    let dataInicio: Date

    if (ultimaSemana) {
      dataInicio = new Date(ultimaSemana.data_fim)
      dataInicio.setDate(dataInicio.getDate() + 1)
    } else {
      dataInicio = new Date(anoAtual, mesAtual - 1, 1)
      while (dataInicio.getDay() !== 1) {
        dataInicio.setDate(dataInicio.getDate() + 1)
      }
    }

    const dataFim = new Date(dataInicio)
    dataFim.setDate(dataFim.getDate() + 6)

    const { data: novaSemana, error } = await supabase
      .from("vida_ministerio_semanas")
      .insert({
        mes_id: mesData.id,
        data_inicio: dataInicio.toISOString().split("T")[0],
        data_fim: dataFim.toISOString().split("T")[0],
        leitura_semanal: "",
      })
      .select()
      .single()

    if (!error && novaSemana) {
      setSemanas([...semanas, novaSemana])
      setSemanaAtiva(novaSemana.id)
    }
  }

  const removerSemana = async (semanaId: string) => {
    const { error } = await supabase.from("vida_ministerio_semanas").delete().eq("id", semanaId)
    if (!error) {
      setSemanas(semanas.filter((s) => s.id !== semanaId))
      setPartes(partes.filter((p) => p.semana_id !== semanaId))
      if (semanaAtiva === semanaId) {
        setSemanaAtiva(semanas[0]?.id || null)
      }
    }
  }

  const atualizarSemana = async (semanaId: string, campo: string, valor: string | number | null) => {
    const { error } = await supabase
      .from("vida_ministerio_semanas")
      .update({ [campo]: valor })
      .eq("id", semanaId)
    if (!error) {
      setSemanas(semanas.map((s) => (s.id === semanaId ? { ...s, [campo]: valor } : s)))
    }
  }

  // ──────────────────────────────────────────────
  // Partes genéricas
  // ──────────────────────────────────────────────
  const adicionarParte = async (semanaId: string, secao: string) => {
    const partesSecao = partes.filter((p) => p.semana_id === semanaId && p.secao === secao)
    const ordem = partesSecao.length + 1

    const { data: novaParte, error } = await supabase
      .from("vida_ministerio_partes")
      .insert({ semana_id: semanaId, secao, titulo: "", ordem, sala: "principal", textos: [] })
      .select()
      .single()

    if (!error && novaParte) {
      setPartes([...partes, { ...novaParte, textos: [] }])
    }
  }

  const atualizarParte = async (parteId: string, campo: string, valor: unknown) => {
    const { error } = await supabase
      .from("vida_ministerio_partes")
      .update({ [campo]: valor })
      .eq("id", parteId)
    if (!error) {
      setPartes((prev) => prev.map((p) => (p.id === parteId ? { ...p, [campo]: valor } : p)))
    }
  }

  const atualizarParteLote = async (parteId: string, campos: Partial<Parte>) => {
    const { error } = await supabase
      .from("vida_ministerio_partes")
      .update(campos)
      .eq("id", parteId)
    if (!error) {
      setPartes((prev) => prev.map((p) => (p.id === parteId ? { ...p, ...campos } : p)))
    }
  }

  const removerParte = async (parteId: string) => {
    const { error } = await supabase.from("vida_ministerio_partes").delete().eq("id", parteId)
    if (!error) {
      setPartes(partes.filter((p) => p.id !== parteId))
    }
  }

  // ──────────────────────────────────────────────
  // IA – Gerar descrição do Ministério
  // ──────────────────────────────────────���───────
  const gerarDescricaoMinisterio = async (parte: Parte) => {
    if (!parte.titulo) {
      toast.error("Preencha o título da parte antes de gerar a descrição")
      return
    }
    setGerandoDescricao(parte.id)
    const temAjudante = !!parte.ajudante_id
    const tipo = temAjudante ? "duas pessoas conversando" : "discurso"
    try {
      const response = await fetch("/api/ia/descricao-ministerio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: parte.titulo, tipo }),
      })
      if (response.ok) {
        const data = await response.json()
        if (data.descricao) await atualizarParte(parte.id, "descricao", data.descricao)
        toast.success("Descrição gerada com sucesso!")
      } else {
        toast.error("Erro ao gerar descrição")
      }
    } catch (error) {
      console.error("Erro ao gerar descrição ministerio:", error)
      toast.error("Erro ao gerar descrição")
    } finally {
      setGerandoDescricao(null)
    }
  }

  // ──────────────────────────────────────────────
  // Navegação de mês
  // ───────────────────────────────��──────────────
  const mesAnterior = () => {
    if (mesAtual === 1) { setMesAtual(12); setAnoAtual(anoAtual - 1) }
    else setMesAtual(mesAtual - 1)
  }
  const mesProximo = () => {
    if (mesAtual === 12) { setMesAtual(1); setAnoAtual(anoAtual + 1) }
    else setMesAtual(mesAtual + 1)
  }

  const semanaAtualData = semanas.find((s) => s.id === semanaAtiva)
  const partesAtuais = partes.filter((p) => p.semana_id === semanaAtiva)

  const formatarData = (data: string) =>
    new Date(data + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })

  // ──────────────────────────────────────────────
  // Renderização de parte: Tesouros
  // ──────────────────────────────────────────────
  const renderParteTesouro = (parte: Parte) => {
    const ordemLabel =
      parte.ordem === TESOUROS_ORDEM.DISCURSO
        ? "Parte 1 – Discurso"
        : parte.ordem === TESOUROS_ORDEM.JOIAS
        ? "Parte 2 – Joias Espirituais"
        : "Parte 3 – Leitura da Bíblia"

    return (
      <div key={parte.id} className="bg-zinc-800/50 rounded-lg p-4 space-y-4">
        {/* Cabeçalho */}
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-1">
            <Label className="text-zinc-500 text-xs block">{ordemLabel}</Label>
            <div className="flex items-center gap-2">
              <Input
                value={parte.titulo || ""}
                onChange={(e) => atualizarParte(parte.id, "titulo", e.target.value)}
                placeholder="Título da parte"
                className="bg-zinc-900 border-zinc-700 text-sm flex-1"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <Input
                  value={parte.tempo || ""}
                  onChange={(e) => atualizarParte(parte.id, "tempo", e.target.value)}
                  placeholder="min"
                  className="bg-zinc-900 border-zinc-700 text-sm w-16 text-center"
                />
                <span className="text-zinc-500 text-xs whitespace-nowrap">min</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mt-5"
            onClick={() => removerParte(parte.id)}
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </Button>
        </div>

        {/* ── PARTE 3: Leitura da Bíblia ── */}
        {parte.ordem === TESOUROS_ORDEM.LEITURA && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-zinc-500 text-xs">Texto da Bíblia a ser lido</Label>
                <Input
                  value={parte.texto_biblia || ""}
                  onChange={(e) => atualizarParte(parte.id, "texto_biblia", e.target.value)}
                  placeholder="Ex: Isa. 45:1-11"
                  className="bg-zinc-900 border-zinc-700 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-zinc-500 text-xs">Lição (publicação)</Label>
                <Input
                  value={parte.licao || ""}
                  onChange={(e) => atualizarParte(parte.id, "licao", e.target.value)}
                  placeholder="Ex: th lição 5"
                  className="bg-zinc-900 border-zinc-700 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Participante (sem sala, sem ajudante) */}
        <div className="space-y-2">
          <Select
            value={parte.participante_id || "none"}
            onValueChange={(value) => {
              const pub = publicadores.find((p) => p.id === value)
              atualizarParteLote(parte.id, {
                participante_id: value === "none" ? null : value,
                participante_nome: value === "none" ? null : (pub?.nome || null),
              })
            }}
          >
            <SelectTrigger className="bg-zinc-900 border-zinc-700 text-sm">
              <SelectValue placeholder="Selecione o participante" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Selecione o participante</SelectItem>
              {publicadores.map((pub) => (
                <SelectItem key={pub.id} value={pub.id}>
                  {pub.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  // ──────────────────────────────────────────────
  // Renderização de parte: Faça Seu Melhor no Ministério
  // ──────────────────────────────────────────────
  const renderParteMinisterio = (parte: Parte, numeroParte?: number) => {
    const temAjudante = !!parte.ajudante_id
    const tipoLabel = temAjudante ? "Duas pessoas conversando" : "Discurso"

    return (
      <div key={parte.id} className="bg-zinc-800/50 rounded-lg p-4 space-y-4">
        {/* Título + Tempo */}
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-1">
            {numeroParte && (
              <span className="text-zinc-500 text-xs">Parte {numeroParte}</span>
            )}
            <div className="flex items-center gap-2">
              <Input
                value={parte.titulo || ""}
                onChange={(e) => atualizarParte(parte.id, "titulo", e.target.value)}
                placeholder="Título da parte (ex: Iniciando conversas)"
                className="bg-zinc-900 border-zinc-700 text-sm flex-1"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <Input
                  value={parte.tempo || ""}
                  onChange={(e) => atualizarParte(parte.id, "tempo", e.target.value)}
                  placeholder="min"
                  className="bg-zinc-900 border-zinc-700 text-sm w-16 text-center"
                />
                <span className="text-zinc-500 text-xs whitespace-nowrap">min</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => removerParte(parte.id)}
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </Button>
        </div>

        {/* Participante + Ajudante */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Participante */}
          <div className="space-y-1">
            <Select
              value={parte.participante_id || "none"}
              onValueChange={(value) => {
                const pub = publicadores.find((p) => p.id === value)
                atualizarParteLote(parte.id, {
                  participante_id: value === "none" ? null : value,
                  participante_nome: value === "none" ? null : (pub?.nome || null),
                })
              }}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-sm">
                <SelectValue placeholder="Selecione o participante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Selecione o participante</SelectItem>
                {publicadores.map((pub) => (
                  <SelectItem key={pub.id} value={pub.id}>
                    {pub.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ajudante */}
          <div className="space-y-1">
            <Select
              value={parte.ajudante_id || "none"}
              onValueChange={(value) => {
                const pub = publicadores.find((p) => p.id === value)
                atualizarParteLote(parte.id, {
                  ajudante_id: value === "none" ? null : value,
                  ajudante_nome: value === "none" ? null : (pub?.nome || null),
                })
              }}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-sm">
                <SelectValue placeholder="Ajudante (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem ajudante</SelectItem>
                {publicadores.map((pub) => (
                  <SelectItem key={pub.id} value={pub.id}>
                    {pub.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Badge do tipo determinado pelo ajudante */}
            <p className="text-xs text-zinc-500 pl-1">
              Tipo:{" "}
              <span className={cn("font-medium", temAjudante ? "text-yellow-400" : "text-zinc-300")}>
                {tipoLabel}
              </span>
            </p>
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-zinc-400 text-xs">Descrição / Instrução da parte</Label>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 border-amber-600/30 bg-amber-600/10 hover:bg-amber-600/20 text-amber-400"
              onClick={() => gerarDescricaoMinisterio(parte)}
              disabled={gerandoDescricao === parte.id}
            >
              {gerandoDescricao === parte.id ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3 mr-1" />
              )}
              Gerar por IA
            </Button>
          </div>
          <Textarea
            value={parte.descricao || ""}
            onChange={(e) => atualizarParte(parte.id, "descricao", e.target.value)}
            placeholder={
              temAjudante
                ? "Ex: DE CASA EM CASA. Ofereça um estudo bíblico para uma pessoa que aceitou o convite. (lmd lição 9 ponto 5)"
                : "Ex: TESTEMUNHO PÚBLICO. Explique para uma pessoa como é a Celebração. (lmd lição 5 ponto 3)"
            }
            className="bg-zinc-900 border-zinc-700 text-sm min-h-[70px] resize-none"
          />
        </div>
      </div>
    )
  }

  // ──────────────────────────────────────────────
  // Renderização de parte genérica (Nossa Vida Cristã)
  // ──────────────────────────────────────────────
  const renderParteGenerica = (parte: Parte, secaoId: string, numeroParte?: number) => (
    <div key={parte.id} className="bg-zinc-800/50 rounded-lg p-3 space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-1">
          {numeroParte && (
            <span className="text-zinc-500 text-xs">Parte {numeroParte}</span>
          )}
          <div className="flex items-center gap-2">
            <Input
              value={parte.titulo || ""}
              onChange={(e) => atualizarParte(parte.id, "titulo", e.target.value)}
              placeholder="Título da parte"
              className="bg-zinc-900 border-zinc-700 text-sm flex-1"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              <Input
                value={parte.tempo || ""}
                onChange={(e) => atualizarParte(parte.id, "tempo", e.target.value)}
                placeholder="min"
                className="bg-zinc-900 border-zinc-700 text-sm w-16 text-center"
              />
              <span className="text-zinc-500 text-xs whitespace-nowrap">min</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => removerParte(parte.id)}
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </Button>
      </div>

      {/* Participante */}
      <div className="space-y-2">
        <Select
          value={parte.participante_id || "none"}
          onValueChange={(value) => {
            const pub = publicadores.find((p) => p.id === value)
            atualizarParteLote(parte.id, {
              participante_id: value === "none" ? null : value,
              participante_nome: value === "none" ? null : (pub?.nome || null),
            })
          }}
        >
          <SelectTrigger className="bg-zinc-900 border-zinc-700 text-sm">
            <SelectValue placeholder="Selecione o participante" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Selecione o participante</SelectItem>
            {publicadores.map((pub) => (
              <SelectItem key={pub.id} value={pub.id}>
                {pub.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Campos extras para Estudo Bíblico de Congregação */}
        {parte.titulo?.toLowerCase().includes("estudo bíblico") && (
          <div className="space-y-2 pt-1 border-t border-zinc-700/50">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-400">Leitor do Estudo</Label>
              <Select
                value={parte.leitor_id || "none"}
                onValueChange={(value) => {
                  const pub = publicadores.find((p) => p.id === value)
                  atualizarParteLote(parte.id, {
                    leitor_id: value === "none" ? null : value,
                    leitor_nome: value === "none" ? null : (pub?.nome || null),
                  })
                }}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-700 text-sm">
                  <SelectValue placeholder="Selecione o leitor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecione o leitor</SelectItem>
                  {publicadores.map((pub) => (
                    <SelectItem key={pub.id} value={pub.id}>
                      {pub.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-zinc-400">Oração Final</Label>
              <Select
                value={parte.oracao_final_id || "none"}
                onValueChange={(value) => {
                  const pub = publicadores.find((p) => p.id === value)
                  atualizarParteLote(parte.id, {
                    oracao_final_id: value === "none" ? null : value,
                    oracao_final_nome: value === "none" ? null : (pub?.nome || null),
                  })
                }}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-700 text-sm">
                  <SelectValue placeholder="Selecione quem fará a oração final" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecione quem fará a oração final</SelectItem>
                  {publicadores.map((pub) => (
                    <SelectItem key={pub.id} value={pub.id}>
                      {pub.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // ──────────────────────────────────────────────
  // JSX principal
  // ──────────────────────────────────────────────
  if (loading) return <CenteredLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Vida e Ministério</h1>
          <p className="text-zinc-400">Gerencie as designações da reunião de meio de semana</p>
        </div>
      </div>

      {/* Navegação de Mês */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={mesAnterior}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">
                {meses.find((m) => m.valor === mesAtual)?.nome} {anoAtual}
              </h2>
              <p className="text-sm text-zinc-500">{semanas.length} semana(s) cadastrada(s)</p>
            </div>
            <Button variant="ghost" size="icon" onClick={mesProximo}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center text-zinc-500 py-12">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lista de Semanas */}
          <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">Semanas</CardTitle>
                <Button size="sm" onClick={adicionarSemana}>
                  <Plus className="w-4 h-4 mr-1" /> Nova
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {semanas.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-4">Nenhuma semana cadastrada</p>
              ) : (
                semanas.map((semana, index) => (
                  <div
                    key={semana.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between group",
                      semanaAtiva === semana.id
                        ? "bg-blue-600/20 border border-blue-500/50"
                        : "bg-zinc-800/50 hover:bg-zinc-800"
                    )}
                    onClick={() => setSemanaAtiva(semana.id)}
                  >
                    <div>
                      <p className="text-sm font-medium text-white">Semana {index + 1}</p>
                      <p className="text-xs text-zinc-400">
                        {formatarData(semana.data_inicio)} - {formatarData(semana.data_fim)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        removerSemana(semana.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Detalhes da Semana */}
          <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-3">
            {semanaAtualData ? (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      {formatarData(semanaAtualData.data_inicio)} -{" "}
                      {formatarData(semanaAtualData.data_fim)}
                    </CardTitle>
                    <div className="flex flex-col gap-1 min-w-[200px]">
                      <Label className="text-zinc-400 text-xs">Livro e Capítulos</Label>
                      <Input
                        value={semanaAtualData.livro_biblia || ""}
                        onChange={(e) =>
                          atualizarSemana(semanaAtualData.id, "livro_biblia", e.target.value)
                        }
                        placeholder="Ex: Salmos 10-15"
                        className="bg-zinc-800 border-zinc-700 h-8 text-sm"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Checkbox Sem Reunião */}
                  <div className="space-y-3 p-4 rounded-lg border border-zinc-700 bg-zinc-800/50">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`sem-reuniao-${semanaAtualData.id}`}
                        checked={semanaAtualData.sem_reuniao || false}
                        onCheckedChange={(checked) =>
                          atualizarSemana(semanaAtualData.id, "sem_reuniao", checked === true)
                        }
                      />
                      <Label 
                        htmlFor={`sem-reuniao-${semanaAtualData.id}`}
                        className="text-amber-400 font-medium cursor-pointer flex items-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Semana especial (sem reunião)
                      </Label>
                    </div>
                    
                    {semanaAtualData.sem_reuniao && (
                      <div className="space-y-2 pt-2">
                        <Label className="text-zinc-400 text-sm">Motivo</Label>
                        <Textarea
                          value={semanaAtualData.motivo_sem_reuniao || ""}
                          onChange={(e) =>
                            atualizarSemana(semanaAtualData.id, "motivo_sem_reuniao", e.target.value)
                          }
                          placeholder="Ex: Assembleia de Circuito, Congresso Regional, Celebração da Morte de Cristo..."
                          className="bg-zinc-900 border-zinc-600 min-h-[60px]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Cânticos */}
                  {!semanaAtualData.sem_reuniao && (
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { campo: "cantico_inicial", label: "Cântico Inicial" },
                      { campo: "cantico_meio", label: "Cântico Meio" },
                      { campo: "cantico_final", label: "Cântico Final" },
                    ].map(({ campo, label }) => (
                      <div key={campo} className="space-y-2">
                        <Label className="text-zinc-400 text-xs">{label}</Label>
                        <Input
                          type="number"
                          value={(semanaAtualData as Record<string, unknown>)[campo] as number || ""}
                          onChange={(e) =>
                            atualizarSemana(
                              semanaAtualData.id,
                              campo,
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                          placeholder="Número"
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>
                    ))}
                  </div>
                  )}

                  {/* Presidente e Oração Inicial */}
                  {!semanaAtualData.sem_reuniao && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-zinc-400 text-xs">Presidente</Label>
                      <select
                        value={semanaAtualData.presidente || ""}
                        onChange={(e) =>
                          atualizarSemana(semanaAtualData.id, "presidente", e.target.value || null)
                        }
                        className="w-full h-9 rounded-md border border-zinc-700 bg-zinc-800 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecionar...</option>
                        {publicadores.map((p) => (
                          <option key={p.id} value={p.nome}>{p.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400 text-xs">Oração Inicial</Label>
                      <select
                        value={semanaAtualData.oracao_inicial || ""}
                        onChange={(e) =>
                          atualizarSemana(semanaAtualData.id, "oracao_inicial", e.target.value || null)
                        }
                        className="w-full h-9 rounded-md border border-zinc-700 bg-zinc-800 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecionar...</option>
                        {publicadores.map((p) => (
                          <option key={p.id} value={p.nome}>{p.nome}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  )}

                  {/* Seções */}
                  {!semanaAtualData.sem_reuniao && (() => {
                    // Calcula offset global de numeração por seção
                    // Tesouros: sempre 3 partes (1,2,3); Ministério começa em 4; Vida começa após Ministério
                    const numTesouros = partesAtuais.filter(p => p.secao === "tesouros").length
                    const numMinisterio = partesAtuais.filter(p => p.secao === "ministerio").length
                    const offsetMinisterio = numTesouros + 1           // sempre começa após tesouros (geralmente 4)
                    const offsetVida = numTesouros + numMinisterio + 1 // começa após ministério

                    return secoes.map((secao) => {
                      const partesSecao = partesAtuais.filter((p) => p.secao === secao.id)
                      const Icon = secao.icon
                      const offset =
                        secao.id === "ministerio" ? offsetMinisterio
                        : secao.id === "vida" ? offsetVida
                        : 1 // tesouros começa em 1, mas usa label próprio

                      return (
                        <div key={secao.id} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className={cn("font-semibold flex items-center gap-2", secao.cor)}>
                              <Icon className="w-4 h-4" />
                              {secao.nome}
                            </h3>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => adicionarParte(semanaAtualData.id, secao.id)}
                            >
                              <Plus className="w-3 h-3 mr-1" /> Parte
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {partesSecao.length === 0 ? (
                              <p className="text-zinc-500 text-sm py-2">Nenhuma parte cadastrada</p>
                            ) : (
                              partesSecao.map((parte, idx) =>
                                secao.id === "tesouros"
                                  ? renderParteTesouro(parte)
                                  : secao.id === "ministerio"
                                  ? renderParteMinisterio(parte, offset + idx)
                                  : renderParteGenerica(parte, secao.id, offset + idx)
                              )
                            )}
                          </div>
                        </div>
                      )
                    })
                  })()}
                </CardContent>
              </>
            ) : (
              <CardContent className="py-12 text-center text-zinc-500">
                Selecione ou crie uma semana para editar
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
