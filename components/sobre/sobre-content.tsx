"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Lock } from "lucide-react"
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

export function SobreContent({ anuncios }: SobreContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const anunciosComImagem = anuncios.filter((a) => a.imagem_url)

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
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">
              Congregação Pq. Sabará
            </h1>
            <p className="text-xs text-muted-foreground">Taubaté — SP</p>
          </div>
          <Link href="/login">
            <Button variant="outline" size="sm" className="gap-2">
              <Lock className="h-3.5 w-3.5" />
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      {/* Carousel principal */}
      <main className="flex-1">
        {anunciosComImagem.length > 0 ? (
          <div
            className="relative w-full bg-black overflow-hidden"
            style={{ height: "calc(100vh - 64px)" }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Slides */}
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

                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Texto do anúncio */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pb-16">
                  <h2 className="text-white text-2xl font-bold leading-tight mb-2 text-balance">
                    {anuncio.titulo}
                  </h2>
                  {anuncio.texto && (
                    <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
                      {anuncio.texto}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Botões de navegação */}
            {anunciosComImagem.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                  aria-label="Próximo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Indicadores */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {anunciosComImagem.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`rounded-full transition-all ${
                        i === currentIndex
                          ? "w-6 h-2 bg-white"
                          : "w-2 h-2 bg-white/50 hover:bg-white/70"
                      }`}
                      aria-label={`Ir para anúncio ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          /* Estado vazio */
          <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Lock className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Congregação Parque Sabará
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Nenhum anúncio ativo no momento.
              </p>
            </div>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Acessar o sistema
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
