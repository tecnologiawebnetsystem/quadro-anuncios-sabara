"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Download, 
  Smartphone, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  BookOpen,
  Heart,
  ChevronRight,
  Share2
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

interface SobreContentProps {
  anuncios: Anuncio[]
}

export function SobreContent({ anuncios }: SobreContentProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  useEffect(() => {
    // Detectar plataforma
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent)
    const isAndroidDevice = /android/.test(userAgent)
    
    setIsIOS(isIOSDevice)
    setIsAndroid(isAndroidDevice)

    // Escutar evento de instalação PWA (funciona no Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true)
      return
    }

    if (deferredPrompt) {
      const promptEvent = deferredPrompt as BeforeInstallPromptEvent
      promptEvent.prompt()
      const { outcome } = await promptEvent.userChoice
      if (outcome === "accepted") {
        setDeferredPrompt(null)
        setIsInstallable(false)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-xs">IF</span>
            </div>
            <span className="font-semibold text-sm">InfoFlow</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <Heart className="h-3 w-3" />
            <span>Testemunhas de Jeová</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
            Congregação <span className="text-primary">Sabará</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto text-pretty">
            Bem-vindo ao quadro de anúncios oficial da nossa congregação. Aqui você encontra todas as informações e eventos importantes.
          </p>
        </div>
      </section>

      {/* Quem Somos */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Imagem */}
                <div className="relative h-48 md:h-auto bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-20 h-20 rounded-2xl bg-card/50 backdrop-blur flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Desde 1985</p>
                  </div>
                </div>
                
                {/* Conteúdo */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-3">Quem Somos</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    A Congregação Sabará é uma comunidade de Testemunhas de Jeová dedicada ao estudo da Bíblia e ao serviço cristão. 
                    Nos reunimos regularmente para adorar a Jeová e fortalecer nossa fé.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">Sabará, Minas Gerais</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 text-accent" />
                      </div>
                      <span className="text-muted-foreground">Reuniões às terças e aos domingos</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Anúncios e Eventos */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Anúncios e Eventos
            </h2>
            {anuncios.length > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {anuncios.length} {anuncios.length === 1 ? "anúncio" : "anúncios"}
              </span>
            )}
          </div>

          {anuncios.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">Nenhum anúncio no momento</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Volte em breve para novidades</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {anuncios.map((anuncio) => (
                <Card key={anuncio.id} className="bg-card border-border overflow-hidden hover:border-primary/30 transition-colors">
                  <CardContent className="p-0">
                    <div className={cn("flex", anuncio.imagem_url ? "flex-col md:flex-row" : "")}>
                      {/* Imagem do anúncio */}
                      {anuncio.imagem_url && (
                        <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0">
                          <Image
                            src={anuncio.imagem_url}
                            alt={anuncio.titulo}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Conteúdo */}
                      <div className="flex-1 p-5">
                        <h3 className="text-base font-semibold text-foreground mb-2">{anuncio.titulo}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                          {anuncio.texto}
                        </p>
                        
                        {anuncio.data_evento && (
                          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border">
                            <div className="flex items-center gap-1.5 text-xs text-primary">
                              <Calendar className="h-3.5 w-3.5" />
                              <span className="capitalize">{formatDate(anuncio.data_evento)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{formatTime(anuncio.data_evento)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Download do App */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Ícone do App */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg">
                    <Smartphone className="h-10 w-10 text-primary" />
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl font-bold text-foreground mb-2">Baixe o App InfoFlow</h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    Tenha acesso rápido às informações da congregação direto no seu celular. 
                    Funciona offline e receba notificações importantes.
                  </p>

                  {/* Botões de Download */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    {/* Android */}
                    {(isAndroid || (!isIOS && !isAndroid)) && (
                      <Button
                        onClick={handleInstallClick}
                        disabled={!isInstallable && !isAndroid}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Baixar para Android</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}

                    {/* iOS */}
                    {(isIOS || (!isIOS && !isAndroid)) && (
                      <Button
                        onClick={() => setShowIOSInstructions(true)}
                        variant="outline"
                        className="border-border hover:bg-muted gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Baixar para iPhone</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Nota */}
                  <p className="text-xs text-muted-foreground/70 mt-3">
                    App leve e seguro. Não ocupa espaço no seu dispositivo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Modal de instruções iOS */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-md bg-card border-border animate-in slide-in-from-bottom-4 duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 text-center">
                Como instalar no iPhone
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold text-sm">1</span>
                  </div>
                  <p className="text-sm text-muted-foreground pt-1">
                    Toque no ícone de <strong className="text-foreground">Compartilhar</strong> na barra inferior do Safari
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold text-sm">2</span>
                  </div>
                  <p className="text-sm text-muted-foreground pt-1">
                    Role para baixo e toque em <strong className="text-foreground">Adicionar à Tela de Início</strong>
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold text-sm">3</span>
                  </div>
                  <p className="text-sm text-muted-foreground pt-1">
                    Toque em <strong className="text-foreground">Adicionar</strong> no canto superior direito
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setShowIOSInstructions(false)}
                className="w-full mt-6"
              >
                Entendi
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">
            InfoFlow v1.0 - Congregação Sabará
          </p>
        </div>
      </footer>
    </div>
  )
}

// Tipo para o evento de instalação do PWA
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}
