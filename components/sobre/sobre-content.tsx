"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Lock, Calendar, Megaphone, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Anuncio {
  id: string
  titulo: string
  texto: string
  imagem_url: string | null
  data_evento: string | null
}

interface SobreContentProps {
  anuncios: Anuncio[]
}

function formatarData(data: string | null) {
  if (!data) return null
  const d = new Date(data + "T12:00:00")
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "")
}

export function SobreContent({ anuncios }: SobreContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const anunciosComImagem = anuncios.filter((a) => a.imagem_url)
  const todos = anuncios

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % anunciosComImagem.length)
  }, [anunciosComImagem.length])

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + anunciosComImagem.length) % anunciosComImagem.length)
  }, [anunciosComImagem.length])

  useEffect(() => {
    if (!isAutoPlaying || anunciosComImagem.length <= 1) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, next, anunciosComImagem.length])

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Megaphone className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground leading-tight">Pq. Sabará</p>
              <p className="text-[10px] text-muted-foreground leading-none">Taubaté — SP</p>
            </div>
          </div>
          <Link href="/login">
            <Button size="sm" className="gap-1.5 text-xs h-8">
              <Lock className="h-3 w-3" />
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 flex flex-col gap-6">

        {/* Carousel compacto */}
        {anunciosComImagem.length > 0 ? (
          <section
            className="relative w-full rounded-2xl overflow-hidden bg-black"
            style={{ height: "220px" }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {anunciosComImagem.map((anuncio, index) => (
              <div
                key={anuncio.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <Image
                  src={anuncio.imagem_url!}
                  alt={anuncio.titulo}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-white text-sm font-bold leading-tight text-balance line-clamp-2">
                    {anuncio.titulo}
                  </h2>
                </div>
              </div>
            ))}

            {anunciosComImagem.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                  aria-label="Próximo"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 right-3 flex gap-1">
                  {anunciosComImagem.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`rounded-full transition-all ${
                        i === currentIndex ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                      }`}
                      aria-label={`Ir para anúncio ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        ) : null}

        {/* Seção de anúncios em cards */}
        {todos.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Megaphone className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Anúncios
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              {todos.map((anuncio) => (
                <div
                  key={anuncio.id}
                  className="flex gap-3 p-3.5 rounded-xl border border-border bg-card"
                >
                  {anuncio.imagem_url && (
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={anuncio.imagem_url}
                        alt={anuncio.titulo}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight line-clamp-1">
                      {anuncio.titulo}
                    </p>
                    {anuncio.texto && (
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                        {anuncio.texto}
                      </p>
                    )}
                    {anuncio.data_evento && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <Calendar className="h-3 w-3 text-primary" />
                        <span className="text-[11px] font-medium text-primary">
                          {formatarData(anuncio.data_evento)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Estado vazio */}
        {todos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <Megaphone className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Nenhum anúncio ativo</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Em breve novidades para a congregação.
              </p>
            </div>
          </div>
        )}

        {/* Botão de acesso à programação */}
        <Link href="/programacao" className="block">
          <div className="flex items-center justify-between p-4 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-foreground">Programação da Semana</p>
              <p className="text-xs text-muted-foreground mt-0.5">Designações, reuniões e campo</p>
            </div>
            <ArrowRight className="h-4 w-4 text-primary flex-shrink-0" />
          </div>
        </Link>

      </main>
    </div>
  )
}
