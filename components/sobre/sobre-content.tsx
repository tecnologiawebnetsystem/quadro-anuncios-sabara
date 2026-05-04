"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  ChevronRight,
  Clock,
  BookOpen,
  Users,
  Bell,
  Lock,
  MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Anuncio {
  id: string
  titulo: string
  texto: string
  imagem_url: string | null
  data_evento: string | null
  created_at: string
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

function useCountdown(targetDate: string | null) {
  const [diff, setDiff] = useState<{ dias: number; horas: number; minutos: number } | null>(null)

  useEffect(() => {
    if (!targetDate) return
    const calc = () => {
      const now = new Date()
      // Reunião de quinta: 19h30 | domingo: 09h30
      const target = new Date(targetDate + "T12:00:00")
      const diaSem = target.getDay()
      target.setHours(diaSem === 4 ? 19 : 9, 30, 0, 0)
      const ms = target.getTime() - now.getTime()
      if (ms <= 0) { setDiff({ dias: 0, horas: 0, minutos: 0 }); return }
      const dias = Math.floor(ms / 86400000)
      const horas = Math.floor((ms % 86400000) / 3600000)
      const minutos = Math.floor((ms % 3600000) / 60000)
      setDiff({ dias, horas, minutos })
    }
    calc()
    const id = setInterval(calc, 60000)
    return () => clearInterval(id)
  }, [targetDate])

  return diff
}

function formatarDataReuniaoExibicao(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00")
  return d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })
}

function formatarDataCurta(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00")
  return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" })
}

function isQuinta(dateStr: string) {
  return new Date(dateStr + "T12:00:00").getDay() === 4
}

// Card com contagem regressiva para próxima reunião
function ProximaReuniaoCard({ data }: { data: string }) {
  const countdown = useCountdown(data)
  const quinta = isQuinta(data)

  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden",
      quinta
        ? "border-blue-500/30 bg-blue-950/30"
        : "border-amber-500/30 bg-amber-950/20"
    )}>
      {/* Header colorido */}
      <div className={cn(
        "px-5 py-3 flex items-center justify-between",
        quinta ? "bg-blue-600/20" : "bg-amber-500/20"
      )}>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs font-800 uppercase tracking-widest font-bold",
            quinta ? "text-blue-300" : "text-amber-300"
          )}>
            {quinta ? "Quinta-feira" : "Domingo"}
          </span>
          <span className={cn(
            "h-1.5 w-1.5 rounded-full animate-pulse",
            quinta ? "bg-blue-400" : "bg-amber-400"
          )} />
        </div>
        <span className="text-xs text-muted-foreground">
          {quinta ? "19h30" : "09h30"}
        </span>
      </div>

      <div className="px-5 py-4">
        <p className="text-base font-semibold text-foreground capitalize mb-3">
          {formatarDataReuniaoExibicao(data)}
        </p>

        {/* Contagem regressiva */}
        {countdown && (
          <div className="flex items-center gap-3">
            <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            {countdown.dias > 0 ? (
              <span className="text-sm text-muted-foreground">
                Em <span className="text-foreground font-semibold">{countdown.dias}d {countdown.horas}h</span>
              </span>
            ) : countdown.horas > 0 ? (
              <span className="text-sm text-muted-foreground">
                Em <span className="text-foreground font-semibold">{countdown.horas}h {countdown.minutos}min</span>
              </span>
            ) : (
              <span className="text-sm font-semibold text-green-400">Hoje!</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function SobreContent({ anuncios, proximasDatas, equipeTecnica }: SobreContentProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  const proximaReuniao = proximasDatas[0] ?? null
  const proximasApos = proximasDatas.slice(1)

  return (
    <div className="min-h-screen bg-background">

      {/* ── Navbar ── */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg"
          : "bg-transparent"
      )}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-15">
            {/* Identidade */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="leading-tight">
                <p className="font-bold text-foreground text-sm leading-none">Pq. Sabará</p>
                <p className="text-[10px] text-muted-foreground">Testemunhas de Jeová</p>
              </div>
            </Link>

            {/* Ações */}
            <div className="flex items-center gap-2">
              <Link href="/programacao">
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground hidden sm:flex">
                  <Calendar className="h-4 w-4" />
                  Programação
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  <Lock className="h-3.5 w-3.5" />
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-24 pb-8 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">

          {/* Coluna esquerda — identidade + anúncios */}
          <div className="flex-1 min-w-0">
            {/* Cabeçalho institucional */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium mb-5">
                <MapPin className="h-3.5 w-3.5" />
                Taubaté, SP
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight text-balance mb-3">
                Congregação<br />
                <span className="text-primary">Parque Sabará</span>
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                Acompanhe os anúncios, a programação de reuniões e a escala de atividades da nossa congregação.
              </p>
            </div>

            {/* Atalhos rápidos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
              {[
                { href: "/programacao", icon: Calendar, label: "Programação", desc: "Ver o dia a dia" },
                { href: "/login", icon: Users, label: "Sistema", desc: "Acesso restrito" },
                { href: "/programacao", icon: Bell, label: "Anúncios", desc: `${anuncios.length} ativos`, scroll: true },
              ].map((item) => (
                <Link key={item.label} href={item.href}>
                  <div className="group rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all p-3.5 cursor-pointer">
                    <item.icon className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Anúncios */}
            {anuncios.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="h-4 w-4 text-accent" />
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
                    Anúncios
                  </h2>
                  <span className="ml-auto text-xs text-muted-foreground">{anuncios.length} ativo{anuncios.length !== 1 ? "s" : ""}</span>
                </div>

                <div className="flex flex-col gap-4">
                  {anuncios.map((anuncio) => (
                    <div
                      key={anuncio.id}
                      className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-colors"
                    >
                      {anuncio.imagem_url && (
                        <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                          <Image
                            src={anuncio.imagem_url}
                            alt={anuncio.titulo}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 600px"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="px-5 py-5">
                        {anuncio.data_evento && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium mb-3">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="capitalize">{formatDate(anuncio.data_evento)}</span>
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-foreground mb-2 text-balance leading-snug">
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
            )}

            {anuncios.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3 rounded-2xl border border-dashed border-border">
                <Bell className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Nenhum anúncio no momento</p>
              </div>
            )}
          </div>

          {/* Coluna direita — próximas reuniões */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0 mt-10 lg:mt-0 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
                Próximas Reuniões
              </h2>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {proximaReuniao && (
                <ProximaReuniaoCard data={proximaReuniao} />
              )}
              {proximasApos.map((d) => (
                <div key={d} className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2.5">
                    <span className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      isQuinta(d) ? "bg-blue-500" : "bg-amber-500"
                    )} />
                    <span className="text-sm text-foreground capitalize">{formatarDataCurta(d)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {isQuinta(d) ? "19h30" : "09h30"}
                  </span>
                </div>
              ))}
            </div>

            {/* Botão para programação completa */}
            <Link href="/programacao" className="block">
              <Button variant="outline" className="w-full gap-2 justify-between group">
                <span>Ver programação completa</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>

            {/* Equipe técnica da próxima reunião */}
            {proximaReuniao && equipeTecnica.length > 0 && (() => {
              const eq = equipeTecnica.find(e => e.data === proximaReuniao)
              if (!eq) return null
              const itens = [
                { label: "Indicadores", valor: [eq.indicador_1, eq.indicador_2].filter(Boolean).join(" / ") },
                { label: "Mic. Volante", valor: [eq.mic_volante_1, eq.mic_volante_2].filter(Boolean).join(" / ") },
                { label: "Áudio e Vídeo", valor: eq.audio_video },
                { label: "Palco", valor: eq.palco },
              ].filter(i => i.valor)

              if (itens.length === 0) return null

              return (
                <div className="mt-4 rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                    Equipe Técnica — {formatarDataCurta(proximaReuniao)}
                  </p>
                  <div className="flex flex-col gap-2">
                    {itens.map(i => (
                      <div key={i.label} className="flex items-start justify-between gap-2">
                        <span className="text-xs text-muted-foreground flex-shrink-0">{i.label}</span>
                        <span className="text-xs text-foreground font-medium text-right">{i.valor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <BookOpen className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-foreground text-xs">Pq. Sabará</p>
              <p className="text-[10px] text-muted-foreground">Testemunhas de Jeová — Taubaté, SP</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()} Congregação Parque Sabará
          </p>
        </div>
      </footer>
    </div>
  )
}
