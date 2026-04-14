"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CenteredLoader } from "@/components/ui/page-loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ChevronLeft, ChevronRight, BookOpen, Music, Gem, MessageSquare, Heart, X, AlertTriangle, Printer, Share2 } from "lucide-react"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { PrintVidaMinisterio } from "@/components/impressao/print-layouts"
import "@/app/impressao/print-styles.css"

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
  licao: string | null
  // Campo ministério
  descricao: string | null
  // Campos extras Ministério (Parte 3 Tesouros e seção Ministério)
  texto_ministerio: string | null
  licao_ministerio: string | null
  ponto_ministerio: string | null
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
  const [canticos, setCanticos] = useState<{ id: string; numero: number; descricao: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [semanaAtiva, setSemanaAtiva] = useState<string | null>(null)

  // Referência para impressão
  const printRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Vida_Ministerio_${meses.find((m) => m.valor === mesAtual)?.nome}_${anoAtual}`,
  })

  const supabase = createClient()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    try {
      const { data: pubs } = await supabase
        .from("publicadores")
        .select("id, nome")
        .order("nome")
      setPublicadores(pubs || [])
      
      // Carregar cânticos
      const { data: canticosData } = await supabase
        .from("canticos")
        .select("id, numero, descricao")
        .order("numero")
      setCanticos(canticosData || [])

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

  // ────────────────���─────────────────────────────
  // Partes genéricas
  // ────���───────���─────────────────────────────────
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
  // WhatsApp - Formatar e compartilhar parte
  // ──────────────────────────────────────────────
  const formatarMensagemWhatsApp = (parte: Parte, numeroParte?: number) => {
    const semana = semanas.find(s => s.id === parte.semana_id)
    const dataReuniao = semana ? formatarData(semana.data_inicio) : ""
    
    let mensagem = `*DESIGNACAO - VIDA E MINISTERIO*\n`
    mensagem += `Data: ${dataReuniao}\n\n`
    
    // Nome da seção
    const secaoNome = secoes.find(s => s.id === parte.secao)?.nome || parte.secao
    mensagem += `*${secaoNome}*\n`
    
    // Número da parte e título
    if (numeroParte) {
      mensagem += `Parte ${numeroParte}: ${parte.titulo || "Sem título"}\n`
    } else if (parte.secao === "tesouros") {
      const ordemLabel = parte.ordem === 1 ? "Discurso" 
        : parte.ordem === 2 ? "Joias Espirituais" 
        : "Leitura da Biblia"
      // Evita redundância: se o título for igual ao label, mostra só o label
      const titulo = parte.titulo || ""
      const tituloNormalizado = titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const labelNormalizado = ordemLabel.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      if (tituloNormalizado === labelNormalizado || !titulo) {
        mensagem += `${ordemLabel}\n`
      } else {
        mensagem += `${ordemLabel}: ${titulo}\n`
      }
    } else {
      mensagem += `${parte.titulo || "Sem título"}\n`
    }
    
    // Tempo
    if (parte.tempo) {
      mensagem += `Duracao: ${parte.tempo} minutos\n`
    }
    
    // Participante
    if (parte.participante_nome) {
      mensagem += `\n*Designado(a):* ${parte.participante_nome}\n`
    }
    
    // Ajudante (para partes do Ministério)
    if (parte.ajudante_nome) {
      mensagem += `*Ajudante:* ${parte.ajudante_nome}\n`
    }
    
    // Texto bíblico (para Leitura da Bíblia ou partes do Ministério)
    if (parte.texto_ministerio) {
      mensagem += `\n*Texto:* ${parte.texto_ministerio}\n`
    }
    
    // Lição
    if (parte.licao_ministerio) {
      mensagem += `*Licao:* ${parte.licao_ministerio}\n`
    }
    
    // Ponto (para Ministério)
    if (parte.ponto_ministerio) {
      mensagem += `*Ponto:* ${parte.ponto_ministerio}\n`
    }
    
    // Leitor do Estudo (para Estudo Bíblico de Congregação)
    if (parte.leitor_nome) {
      mensagem += `*Leitor:* ${parte.leitor_nome}\n`
    }
    
    // Oração Final
    if (parte.oracao_final_nome) {
      mensagem += `*Oracao Final:* ${parte.oracao_final_nome}\n`
    }
    
    // Mensagem de encorajamento
    mensagem += `\n_Que Jeova abencoe sua preparacao!_`
    
    return mensagem
  }

  const compartilharWhatsApp = (parte: Parte, numeroParte?: number) => {
    const mensagem = formatarMensagemWhatsApp(parte, numeroParte)
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`
    window.open(url, "_blank")
  }

  // Componente do botão WhatsApp
  const BotaoWhatsApp = ({ parte, numeroParte }: { parte: Parte; numeroParte?: number }) => (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
      onClick={(e) => {
        e.stopPropagation()
        compartilharWhatsApp(parte, numeroParte)
      }}
      title="Enviar por WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </Button>
  )

  // ──────────────────────────────────���───────────
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
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={parte.tempo || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "")
                    atualizarParte(parte.id, "tempo", val)
                  }}
                  className="bg-zinc-900 border-zinc-700 text-sm w-16 text-center"
                />
                <span className="text-zinc-500 text-xs whitespace-nowrap">min</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-5">
            <BotaoWhatsApp parte={parte} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => removerParte(parte.id)}
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          </div>
        </div>

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

        {/* Campos extras para Parte 3 - Leitura da Bíblia */}
        {parte.ordem === TESOUROS_ORDEM.LEITURA && (
          <div className="space-y-3 pt-3 border-t border-zinc-700/50">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Texto</Label>
              <Input
                value={parte.texto_ministerio || ""}
                onChange={(e) => atualizarParte(parte.id, "texto_ministerio", e.target.value)}
                placeholder="Ex: Mateus 5:1-16"
                className="bg-zinc-900 border-zinc-700 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Lição</Label>
              <Input
                value={parte.licao_ministerio || ""}
                onChange={(e) => atualizarParte(parte.id, "licao_ministerio", e.target.value)}
                placeholder="Ex: Lição 2, Ponto 2"
                className="bg-zinc-900 border-zinc-700 text-sm"
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  // ────────────────────────────────────���─────────
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
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={parte.tempo || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "")
                    atualizarParte(parte.id, "tempo", val)
                  }}
                  className="bg-zinc-900 border-zinc-700 text-sm w-16 text-center"
                />
                <span className="text-zinc-500 text-xs whitespace-nowrap">min</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <BotaoWhatsApp parte={parte} numeroParte={numeroParte} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => removerParte(parte.id)}
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          </div>
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

        {/* Campos extras para Faça Seu Melhor no Ministério */}
        <div className="space-y-3 pt-3 border-t border-zinc-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Lição</Label>
              <Input
                value={parte.licao_ministerio || ""}
                onChange={(e) => atualizarParte(parte.id, "licao_ministerio", e.target.value)}
                placeholder="Ex: Lição 5"
                className="bg-zinc-900 border-zinc-700 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Ponto</Label>
              <Input
                value={parte.ponto_ministerio || ""}
                onChange={(e) => atualizarParte(parte.id, "ponto_ministerio", e.target.value)}
                placeholder="Ex: Ponto 3"
                className="bg-zinc-900 border-zinc-700 text-sm"
              />
            </div>
          </div>
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
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={parte.tempo || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "")
                    atualizarParte(parte.id, "tempo", val)
                  }}
                  className="bg-zinc-900 border-zinc-700 text-sm w-16 text-center"
                />
                <span className="text-zinc-500 text-xs whitespace-nowrap">min</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <BotaoWhatsApp parte={parte} numeroParte={numeroParte} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => removerParte(parte.id)}
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          </div>
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
  // ──────────────────────────────��───────────────
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
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePrint()}
                disabled={semanas.length === 0}
                className="border-zinc-700 hover:bg-zinc-800"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir Mês
              </Button>
              <Button variant="ghost" size="icon" onClick={mesProximo}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
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

      {/* Componente de Impressão (oculto) */}
      <div className="hidden">
        <PrintVidaMinisterio
          ref={printRef}
          mes={mesAtual}
          ano={anoAtual}
          semanas={semanas}
          partes={partes}
          canticos={canticos}
        />
      </div>
    </div>
  )
}
