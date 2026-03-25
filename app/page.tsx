"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ShieldCheck, ChevronRight, Delete, Info, Calendar, Mic, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, addDays, startOfWeek, endOfWeek } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

const SENHA_ADMIN = "123456"

interface ProximoEvento {
  tipo: "reuniao" | "discurso"
  titulo: string
  data: string
  subtitulo?: string
}

export default function Home() {
  const router = useRouter()
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [proximoEvento, setProximoEvento] = useState<ProximoEvento | null>(null)
  const [hora, setHora] = useState("")

  useEffect(() => {
    setMounted(true)

    // Atualiza hora a cada segundo
    const tick = () => {
      const agora = new Date()
      setHora(format(agora, "HH:mm"))
    }
    tick()
    const interval = setInterval(tick, 1000)

    // Busca próximo evento
    const supabase = createClient()
    const buscarProximoEvento = async () => {
      const hoje = format(new Date(), "yyyy-MM-dd")
      const em30dias = format(addDays(new Date(), 30), "yyyy-MM-dd")

      // Tenta discurso público primeiro
      const { data: discurso } = await supabase
        .from("discursos_publicos")
        .select("data, tema, orador_nome")
        .gte("data", hoje)
        .lte("data", em30dias)
        .order("data", { ascending: true })
        .limit(1)
        .single()

      if (discurso) {
        setProximoEvento({
          tipo: "discurso",
          titulo: discurso.tema || "Discurso Público",
          subtitulo: discurso.orador_nome,
          data: discurso.data,
        })
        return
      }

      // Fallback: próxima equipe técnica (reunião)
      const inicioSemana = format(startOfWeek(new Date(), { weekStartsOn: 0 }), "yyyy-MM-dd")
      const fimSemana = format(endOfWeek(new Date(), { weekStartsOn: 0 }), "yyyy-MM-dd")
      const { data: equipe } = await supabase
        .from("equipe_tecnica")
        .select("data, dia_semana")
        .gte("data", hoje)
        .lte("data", fimSemana)
        .order("data", { ascending: true })
        .limit(1)
        .single()

      if (equipe) {
        const diaLabel = equipe.dia_semana === "quinta" ? "Quinta-Feira" : "Domingo"
        setProximoEvento({
          tipo: "reuniao",
          titulo: `Reunião de ${diaLabel}`,
          data: equipe.data,
        })
      }
    }

    buscarProximoEvento()
    return () => clearInterval(interval)
  }, [])

  const handleDigito = (digito: string) => {
    if (senha.length < 6) {
      const novaSenha = senha + digito
      setSenha(novaSenha)
      setErro(false)
      if (novaSenha.length === 6) {
        if (novaSenha === SENHA_ADMIN) {
          router.push("/admin")
        } else {
          setErro(true)
          setTimeout(() => { setSenha(""); setErro(false) }, 1000)
        }
      }
    }
  }

  const handleApagar = () => {
    setSenha(senha.slice(0, -1))
    setErro(false)
  }

  if (!mounted) {
    return <div className="min-h-screen bg-[#09090b]" />
  }

  const dataFormatada = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col md:flex-row">

      {/* ── Painel Esquerdo: Identidade ── */}
      <div className="flex flex-col justify-between md:w-[45%] p-8 md:p-12 border-b md:border-b-0 md:border-r border-zinc-800 md:min-h-screen">
        {/* Logo */}
        <div>
          <div className="inline-flex items-center gap-3 mb-10 md:mb-14">
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">IF</span>
            </div>
            <div>
              <p className="text-white font-bold leading-none">InfoFlow</p>
              <p className="text-zinc-500 text-xs leading-none mt-0.5">Administração</p>
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight text-balance mb-3">
            Quadro de<br />
            <span className="text-red-500">Anúncios</span>
          </h1>
          <p className="text-zinc-400 text-sm uppercase tracking-[0.25em] mb-10 lg:mb-14">
            Congregação Sabarà
          </p>

          {/* Próximo evento */}
          {proximoEvento && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="flex items-center gap-2 mb-3">
                {proximoEvento.tipo === "discurso"
                  ? <Mic className="h-4 w-4 text-amber-400" />
                  : <Calendar className="h-4 w-4 text-purple-400" />
                }
                <span className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  proximoEvento.tipo === "discurso" ? "text-amber-400" : "text-purple-400"
                )}>
                  {proximoEvento.tipo === "discurso" ? "Próximo Discurso Público" : "Próxima Reunião"}
                </span>
              </div>
              <p className="text-white font-semibold text-base leading-snug text-balance mb-1">
                {proximoEvento.titulo}
              </p>
              {proximoEvento.subtitulo && (
                <p className="text-zinc-400 text-sm">{proximoEvento.subtitulo}</p>
              )}
              <div className="mt-3 pt-3 border-t border-zinc-800">
                <p className="text-zinc-500 text-xs capitalize">
                  {format(new Date(proximoEvento.data + "T12:00:00"), "EEEE, d 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé esquerdo */}
        <div className="mt-10 lg:mt-0">
          <p className="text-zinc-600 text-xs capitalize">{dataFormatada}</p>
          <p className="text-zinc-700 text-xs mt-1">InfoFlow v1.0</p>
        </div>
      </div>

      {/* ── Painel Direito: Acesso ── */}
      <div className="flex flex-col items-center justify-center md:w-[55%] p-8 md:p-12 flex-1">

        {/* Hora */}
        <div className="mb-10 text-center">
          <p className="text-5xl md:text-6xl font-black text-white tabular-nums tracking-tight">{hora}</p>
        </div>

        {!mostrarSenha ? (
          <div className="w-full max-w-sm space-y-3">
            {/* Botão Consulta */}
            <button
              onClick={() => router.push("/consulta")}
              className="group w-full flex items-center gap-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 transition-all"
            >
              <div className="w-11 h-11 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-semibold text-sm">Consulta Pública</p>
                <p className="text-zinc-500 text-xs mt-0.5">Designações, grupos e eventos</p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Botão Admin */}
            <button
              onClick={() => setMostrarSenha(true)}
              className="group w-full flex items-center gap-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 transition-all"
            >
              <div className="w-11 h-11 rounded-lg bg-zinc-700 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-zinc-300" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-semibold text-sm">Área Administrativa</p>
                <p className="text-zinc-500 text-xs mt-0.5">Acesso restrito com senha</p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        ) : (
          <div className="w-full max-w-sm">
            {/* Header teclado */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6 text-zinc-300" />
              </div>
              <p className="text-white font-semibold">Área Administrativa</p>
              <p className="text-zinc-500 text-sm mt-1">Digite a senha de acesso</p>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center gap-3 mb-7">
              {[0,1,2,3,4,5].map((i) => (
                <div key={i} className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-150",
                  erro ? "bg-red-500 scale-125" :
                  i < senha.length ? "bg-white scale-110" : "bg-zinc-700"
                )} />
              ))}
            </div>

            {erro && (
              <p className="text-red-500 text-xs text-center mb-5">Senha incorreta. Tente novamente.</p>
            )}

            {/* Teclado */}
            <div className="grid grid-cols-3 gap-2.5">
              {["1","2","3","4","5","6","7","8","9"].map((num) => (
                <button
                  key={num}
                  onClick={() => handleDigito(num)}
                  className="h-14 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xl font-bold hover:bg-zinc-700 hover:border-zinc-500 active:scale-95 transition-all"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => { setMostrarSenha(false); setSenha(""); setErro(false) }}
                className="h-14 rounded-xl text-zinc-500 text-xs hover:text-zinc-300 active:scale-95 transition-all"
              >
                Voltar
              </button>
              <button
                onClick={() => handleDigito("0")}
                className="h-14 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xl font-bold hover:bg-zinc-700 hover:border-zinc-500 active:scale-95 transition-all"
              >
                0
              </button>
              <button
                onClick={handleApagar}
                className="h-14 rounded-xl text-zinc-500 hover:text-zinc-300 flex items-center justify-center active:scale-95 transition-all"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
