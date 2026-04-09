"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useReactToPrint } from "react-to-print"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Printer, 
  ChevronLeft, 
  ChevronRight,
  Gem,
  BookMarked,
  Mic,
  Wrench,
  Users,
  Sparkles,
  MapPin,
  FileText,
  Save,
  Share2
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { usePublicadoresSupabase } from "@/lib/hooks/use-publicadores-supabase"
import {
  PrintVidaMinisterio,
  PrintSentinela,
  PrintReunioesPublicas,
  PrintEquipeTecnica,
  PrintGruposEstudo,
  PrintLimpezaSalao,
  PrintServicoCampo
} from "@/components/impressao/print-layouts"
import "./print-styles.css"

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

const tiposImpressao = [
  { id: "vida-ministerio", nome: "Vida e Ministério", icon: Gem, cor: "bg-blue-600" },
  { id: "sentinela", nome: "Estudo Sentinela", icon: BookMarked, cor: "bg-purple-600" },
  { id: "reunioes-publicas", nome: "Reuniões Públicas", icon: Mic, cor: "bg-amber-600" },
  { id: "equipe-tecnica", nome: "Equipe Técnica", icon: Wrench, cor: "bg-orange-600" },
  { id: "grupos-estudo", nome: "Grupos de Estudo", icon: Users, cor: "bg-emerald-600" },
  { id: "limpeza-salao", nome: "Limpeza do Salão", icon: Sparkles, cor: "bg-cyan-600" },
  { id: "servico-campo", nome: "Serviço de Campo", icon: MapPin, cor: "bg-green-600" },
]

export default function ImpressaoPage() {
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1)
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)

  // Refs para impressão
  const printRef = useRef<HTMLDivElement>(null)

  // Dados para impressão
  const [semanas, setSemanas] = useState<any[]>([])
  const [partes, setPartes] = useState<any[]>([])
  const [estudos, setEstudos] = useState<any[]>([])
  const [reunioesPublicas, setReunioesPublicas] = useState<any[]>([])
  const [equipeTecnica, setEquipeTecnica] = useState<any[]>([])
  const [limpezaSalao, setLimpezaSalao] = useState<any[]>([])
  const [servicoCampo, setServicoCampo] = useState<any[]>([])

  // Hook de publicadores para grupos
  const { publicadores, grupos, getDirigente, getAuxiliar } = usePublicadoresSupabase()

  const supabase = createClient()

  // Carregar dados baseado no tipo selecionado
  const carregarDados = useCallback(async (tipo: string) => {
    setLoading(true)
    try {
      const mesStr = `${anoAtual}-${String(mesAtual).padStart(2, "0")}`

      switch (tipo) {
        case "vida-ministerio": {
          const { data: mes } = await supabase
            .from("vida_ministerio_meses")
            .select("id")
            .eq("mes", mesAtual)
            .eq("ano", anoAtual)
            .single()

          if (mes) {
            const { data: semanasData } = await supabase
              .from("vida_ministerio_semanas")
              .select("*")
              .eq("mes_id", mes.id)
              .order("data_inicio")

            setSemanas(semanasData || [])

            if (semanasData && semanasData.length > 0) {
              const { data: partesData } = await supabase
                .from("vida_ministerio_partes")
                .select("*")
                .in("semana_id", semanasData.map((s) => s.id))
                .order("ordem")

              setPartes(partesData || [])
            }
          }
          break
        }

        case "sentinela": {
          const { data: mes } = await supabase
            .from("sentinela_meses")
            .select("id")
            .eq("mes", mesAtual)
            .eq("ano", anoAtual)
            .single()

          if (mes) {
            const { data: estudosData } = await supabase
              .from("sentinela_estudos")
              .select("*")
              .eq("mes_id", mes.id)
              .order("numero_estudo")

            setEstudos(estudosData || [])
          }
          break
        }

        case "reunioes-publicas": {
          const ultimoDia = new Date(Number(anoAtual), Number(mesAtual), 0).getDate()
          const dataFim = `${mesStr}-${String(ultimoDia).padStart(2, "0")}`
          const { data } = await supabase
            .from("reunioes_publicas")
            .select("*")
            .gte("data", `${mesStr}-01`)
            .lte("data", dataFim)
            .order("data", { ascending: true })

          setReunioesPublicas(data || [])
          break
        }

        case "equipe-tecnica": {
          const response = await fetch(`/api/equipe-tecnica?mes=${mesStr}`)
          if (response.ok) {
            const data = await response.json()
            setEquipeTecnica(data)
          }
          break
        }

        case "limpeza-salao": {
          const ultimoDia = new Date(Number(anoAtual), Number(mesAtual), 0).getDate()
          const dataFim = `${mesStr}-${String(ultimoDia).padStart(2, "0")}`
          const { data } = await supabase
            .from("limpeza_salao")
            .select("*")
            .gte("data", `${mesStr}-01`)
            .lte("data", dataFim)
            .order("data", { ascending: true })

          setLimpezaSalao(data || [])
          break
        }

        case "servico-campo": {
          const ultimoDia = new Date(Number(anoAtual), Number(mesAtual), 0).getDate()
          const dataFim = `${mesStr}-${String(ultimoDia).padStart(2, "0")}`
          const { data } = await supabase
            .from("servico_campo")
            .select("*")
            .gte("data", `${mesStr}-01`)
            .lte("data", dataFim)
            .order("data", { ascending: true })

          setServicoCampo(data || [])
          break
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
      setPreviewVisible(true)
    }
  }, [mesAtual, anoAtual, supabase])

  // Função de impressão
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${tipoSelecionado}-${mesAtual}-${anoAtual}`,
  })

  const handleSelecionarTipo = (tipo: string) => {
    setTipoSelecionado(tipo)
    if (tipo === "grupos-estudo") {
      setPreviewVisible(true)
    } else {
      carregarDados(tipo)
    }
  }

  const mesAnterior = () => {
    if (mesAtual === 1) {
      setMesAtual(12)
      setAnoAtual(anoAtual - 1)
    } else {
      setMesAtual(mesAtual - 1)
    }
    setPreviewVisible(false)
    setTipoSelecionado(null)
  }

  const mesProximo = () => {
    if (mesAtual === 12) {
      setMesAtual(1)
      setAnoAtual(anoAtual + 1)
    } else {
      setMesAtual(mesAtual + 1)
    }
    setPreviewVisible(false)
    setTipoSelecionado(null)
  }

  const mesLabel = `${meses[mesAtual - 1].nome} ${anoAtual}`

  // Renderizar preview baseado no tipo
  const renderPreview = () => {
    if (!tipoSelecionado) return null

    switch (tipoSelecionado) {
      case "vida-ministerio":
        return (
          <PrintVidaMinisterio
            ref={printRef}
            mes={mesAtual}
            ano={anoAtual}
            semanas={semanas}
            partes={partes}
          />
        )
      case "sentinela":
        return (
          <PrintSentinela
            ref={printRef}
            mes={mesAtual}
            ano={anoAtual}
            estudos={estudos}
          />
        )
      case "reunioes-publicas":
        return (
          <PrintReunioesPublicas
            ref={printRef}
            mes={mesAtual}
            ano={anoAtual}
            reunioes={reunioesPublicas}
          />
        )
      case "equipe-tecnica":
        return (
          <PrintEquipeTecnica
            ref={printRef}
            mes={`${anoAtual}-${String(mesAtual).padStart(2, "0")}`}
            mesLabel={mesLabel}
            designacoes={equipeTecnica}
          />
        )
      case "grupos-estudo":
        return (
          <PrintGruposEstudo
            ref={printRef}
            grupos={grupos}
            publicadores={publicadores}
            getDirigente={getDirigente}
            getAuxiliar={getAuxiliar}
          />
        )
      case "limpeza-salao":
        return (
          <PrintLimpezaSalao
            ref={printRef}
            mes={mesAtual}
            ano={anoAtual}
            escalas={limpezaSalao}
          />
        )
      case "servico-campo":
        return (
          <PrintServicoCampo
            ref={printRef}
            mes={mesAtual}
            ano={anoAtual}
            escalas={servicoCampo}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/consulta">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Printer className="h-6 w-6 text-blue-500" />
            Central de Impressão
          </h1>
          <p className="text-zinc-400 text-sm">Gere e imprima escalas e programações mensais</p>
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
              <h2 className="text-xl font-bold text-white">{mesLabel}</h2>
              <p className="text-xs text-zinc-500">Selecione o que deseja imprimir</p>
            </div>
            <Button variant="ghost" size="icon" onClick={mesProximo}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tipos de Impressão */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tiposImpressao.map((tipo) => {
          const Icon = tipo.icon
          const isSelected = tipoSelecionado === tipo.id

          return (
            <button
              key={tipo.id}
              onClick={() => handleSelecionarTipo(tipo.id)}
              className={`group flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? "bg-zinc-800 border-blue-500"
                  : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700"
              }`}
            >
              <div className={`rounded-lg p-3 ${tipo.cor}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className={`text-sm font-medium ${isSelected ? "text-blue-400" : "text-white"}`}>
                {tipo.nome}
              </span>
            </button>
          )
        })}
      </div>

      {/* Preview e Botão de Impressão */}
      {tipoSelecionado && (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              Pré-visualização
            </CardTitle>
            <TooltipProvider delayDuration={0}>
              <div className="flex items-center gap-1.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => handlePrint()} 
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 border-blue-600/50 text-blue-400 hover:bg-blue-600/10 hover:text-blue-300 transition-colors"
                      disabled={loading}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-zinc-800 border-zinc-700">
                    <p>Salvar como PDF</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => handlePrint()} 
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 border-blue-600/50 text-blue-400 hover:bg-blue-600/10 hover:text-blue-300 transition-colors"
                      disabled={loading}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-zinc-800 border-zinc-700">
                    <p>Imprimir</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => {
                        const tipoNome = tiposImpressao.find(t => t.id === tipoSelecionado)?.nome || ''
                        const texto = `${tipoNome} - ${meses[mesAtual - 1].nome} ${anoAtual}`
                        const url = `https://wa.me/?text=${encodeURIComponent(texto)}`
                        window.open(url, '_blank')
                      }} 
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 border-green-600/50 text-green-400 hover:bg-green-600/10 hover:text-green-300 transition-colors"
                      disabled={loading}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-zinc-800 border-zinc-700">
                    <p>Enviar por WhatsApp</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : previewVisible ? (
              <div className="bg-zinc-950 rounded-lg p-4 overflow-auto max-h-[600px] modal-scrollbar scrollbar-blue">
                {renderPreview()}
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
