"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Bell, Lock, ChevronRight } from "lucide-react"

interface Anuncio {
  id: string
  titulo: string
  texto: string
  imagem_url: string | null
  data_evento: string | null
}

interface EquipeTecnica {
  data: string
  indicador_1: string | null
  indicador_2: string | null
  mic_volante_1: string | null
  mic_volante_2: string | null
  audio_video: string | null
  palco: string | null
}

interface SobreContentProps {
  anuncios: Anuncio[]
  proximasDatas: string[]
  equipeTecnica: EquipeTecnica[]
}

function isQuinta(d: string) {
  return new Date(d + "T12:00:00").getDay() === 4
}

function formatarDataLonga(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long",
  })
}

function formatarDataCurta(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "short", day: "2-digit", month: "2-digit",
  })
}

function useContagem(data: string | null) {
  const [texto, setTexto] = useState("")
  useEffect(() => {
    if (!data) return
    const calc = () => {
      const agora = new Date()
      const alvo = new Date(data + "T12:00:00")
      alvo.setHours(isQuinta(data) ? 19 : 9, 30, 0, 0)
      const ms = alvo.getTime() - agora.getTime()
      if (ms <= 0) { setTexto("Hoje!"); return }
      const dias = Math.floor(ms / 86400000)
      const horas = Math.floor((ms % 86400000) / 3600000)
      const min = Math.floor((ms % 3600000) / 60000)
      if (dias > 0) setTexto(`em ${dias}d ${horas}h`)
      else if (horas > 0) setTexto(`em ${horas}h ${min}min`)
      else setTexto(`em ${min}min`)
    }
    calc()
    const id = setInterval(calc, 60000)
    return () => clearInterval(id)
  }, [data])
  return texto
}

export function SobreContent({ anuncios, proximasDatas, equipeTecnica }: SobreContentProps) {
  const proxima = proximasDatas[0] ?? null
  const contagem = useContagem(proxima)
  const quinta = proxima ? isQuinta(proxima) : false

  const eq = proxima ? equipeTecnica.find(e => e.data === proxima) : null
  const equipeLinha = eq
    ? [
        [eq.indicador_1, eq.indicador_2].filter(Boolean).join(" / ") && `Indicadores: ${[eq.indicador_1, eq.indicador_2].filter(Boolean).join(" / ")}`,
        eq.audio_video && `Áudio/Vídeo: ${eq.audio_video}`,
        eq.palco && `Palco: ${eq.palco}`,
      ].filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-background">

      {/* ── Header ── */}
      <header className="border-b border-border bg-card">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-foreground text-base leading-none">Pq. Sabará</p>
            <p className="text-xs text-muted-foreground mt-0.5">Testemunhas de Jeová · Taubaté SP</p>
          </div>
          <Link href="/login">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Lock className="h-3 w-3" />
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">

        {/* ── Próxima reunião ── */}
        {proxima && (
          <div className={`rounded-2xl border overflow-hidden ${quinta ? "border-blue-500/30" : "border-amber-500/30"}`}>
            {/* Topo colorido */}
            <div className={`px-5 py-2.5 flex items-center justify-between ${quinta ? "bg-blue-600 text-white" : "bg-amber-500 text-white"}`}>
              <span className="text-sm font-bold uppercase tracking-wide">
                {quinta ? "Quinta-feira" : "Domingo"}
              </span>
              <span className="text-sm font-medium opacity-90">
                {quinta ? "19h30" : "09h30"}
              </span>
            </div>

            <div className="px-5 py-4 bg-card flex flex-col gap-3">
              {/* Data e contagem */}
              <div className="flex items-start justify-between gap-3">
                <p className="text-base font-semibold text-foreground capitalize leading-snug">
                  {formatarDataLonga(proxima)}
                </p>
                {contagem && (
                  <span className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    contagem === "Hoje!" ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"
                  }`}>
                    <Clock className="h-3 w-3" />
                    {contagem}
                  </span>
                )}
              </div>

              {/* Equipe técnica resumida */}
              {equipeLinha.length > 0 && (
                <div className="border-t border-border pt-3 flex flex-col gap-1">
                  {equipeLinha.map((item, i) => (
                    <p key={i} className="text-xs text-muted-foreground">{item}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Próximas datas ── */}
        {proximasDatas.length > 1 && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
              <p className="text-xs font-bold text-foreground uppercase tracking-wide">Próximas reuniões</p>
              <Link href="/programacao" className="text-xs text-primary flex items-center gap-0.5 hover:underline">
                Ver mais <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            {proximasDatas.slice(1).map((d) => (
              <div key={d} className="px-4 py-3 flex items-center justify-between border-b border-border last:border-0">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2 w-2 rounded-full flex-shrink-0 ${isQuinta(d) ? "bg-blue-500" : "bg-amber-500"}`} />
                  <span className="text-sm text-foreground capitalize">{formatarDataCurta(d)}</span>
                </div>
                <span className="text-xs text-muted-foreground">{isQuinta(d) ? "19h30" : "09h30"}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Anúncios ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
              Anúncios
            </h2>
            {anuncios.length > 0 && (
              <span className="ml-auto text-xs text-muted-foreground">
                {anuncios.length} ativo{anuncios.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {anuncios.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border py-12 flex flex-col items-center gap-2 text-center">
              <Bell className="h-7 w-7 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Nenhum anúncio no momento</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {anuncios.map((anuncio) => (
              <div key={anuncio.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                {anuncio.imagem_url && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={anuncio.imagem_url}
                      alt={anuncio.titulo}
                      fill
                      className="object-cover"
                      sizes="(max-width: 512px) 100vw, 512px"
                      unoptimized
                    />
                  </div>
                )}
                <div className="px-5 py-4">
                  {anuncio.data_evento && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium mb-3">
                      <Calendar className="h-3 w-3" />
                      <span className="capitalize">
                        {new Date(anuncio.data_evento).toLocaleDateString("pt-BR", {
                          weekday: "long", day: "numeric", month: "long",
                        })}
                      </span>
                    </div>
                  )}
                  <h3 className="text-base font-bold text-foreground mb-2 text-balance leading-snug">
                    {anuncio.titulo}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                    {anuncio.texto}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Link para programação ── */}
        <Link href="/programacao">
          <Button variant="outline" className="w-full gap-2 justify-between group">
            <span>Ver programação completa</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-6 px-4 text-center mt-4">
        <p className="text-xs text-muted-foreground">
          Congregação Parque Sabará · Testemunhas de Jeová · Taubaté SP
        </p>
      </footer>

    </div>
  )
}
