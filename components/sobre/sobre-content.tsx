"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Smartphone, 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight,
  Share2,
  CheckCircle2,
  Bell,
  Zap,
  Shield,
  Globe,
  Menu,
  X
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
  const [activeSection, setActiveSection] = useState("inicio")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const heroRef = useRef<HTMLElement>(null)
  
  const anunciosRef = useRef<HTMLElement>(null)
  const appRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent)
    const isAndroidDevice = /android/.test(userAgent)
    
    setIsIOS(isIOSDevice)
    setIsAndroid(isAndroidDevice)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("scroll", handleScroll)
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

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false)
    const refs: { [key: string]: React.RefObject<HTMLElement | null> } = {
      inicio: heroRef,
      
      anuncios: anunciosRef,
      app: appRef
    }
    refs[sectionId]?.current?.scrollIntoView({ behavior: "smooth" })
    setActiveSection(sectionId)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

const navItems = [
  { id: "inicio", label: "Home" },
  { id: "anuncios", label: "Anúncios" },
  { id: "app", label: "Baixar App", highlight: true },
  ]

  const features = [
    {
      icon: Bell,
      title: "Notificações",
      description: "Receba avisos importantes em tempo real"
    },
    {
      icon: Zap,
      title: "Acesso Rápido",
      description: "Informações na palma da sua mão"
    },
    {
      icon: Shield,
      title: "Seguro",
      description: "Seus dados protegidos sempre"
    },
    {
      icon: Globe,
      title: "Funciona Offline",
      description: "Acesse mesmo sem internet"
    }
  ]

  

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Fixed */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg" 
          : "bg-transparent"
      )}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                <span className="text-primary-foreground font-bold text-sm">IF</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-foreground text-sm">InfoFlow</p>
                <p className="text-[10px] text-muted-foreground -mt-0.5">Congregação Sabará</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    item.highlight 
                      ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                      : activeSection === item.id
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button size="sm" className="gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                  Acessar Sistema
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-b border-border animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "w-full px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors",
                    item.highlight
                      ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                      : activeSection === item.id
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2 border-t border-border mt-2">
                <Link href="/login">
                  <Button className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                    Acessar Sistema
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_var(--border)_1px,_transparent_1px),_linear-gradient(to_bottom,_var(--border)_1px,_transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Testemunhas de Jeová</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Congregação{" "}
            <span className="text-primary relative">
              Sabará
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M1 5.5C47.6667 2.16667 141 -2.4 199 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary/40"/>
              </svg>
            </span>
          </h1>

          
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Anúncios Section */}
      <section ref={anunciosRef} className="py-20 sm:py-32 px-4 sm:px-6 bg-card/50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/3 via-transparent to-transparent" />
        
        <div className="max-w-6xl mx-auto relative">
          

          {/* Anúncios Grid */}
          {anuncios.length === 0 ? (
            <Card className="bg-background border-border">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum anúncio no momento</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Volte em breve para conferir as novidades da congregação
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {anuncios.map((anuncio, index) => (
                <Card 
                  key={anuncio.id} 
                  className={cn(
                    "bg-background border-border overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group",
                    index === 0 && anuncios.length > 2 && "md:col-span-2 lg:col-span-1"
                  )}
                >
                  <CardContent className="p-0">
                    {/* Image */}
                    {anuncio.imagem_url && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={anuncio.imagem_url}
                          alt={anuncio.titulo}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        {anuncio.data_evento && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border text-xs">
                            <Calendar className="h-3 w-3 text-primary" />
                            <span className="text-foreground capitalize">{formatDate(anuncio.data_evento)}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-6">
                      {!anuncio.imagem_url && anuncio.data_evento && (
                        <div className="flex items-center gap-2 text-xs text-primary mb-3">
                          <Calendar className="h-3 w-3" />
                          <span className="capitalize">{formatDate(anuncio.data_evento)}</span>
                          <span className="text-muted-foreground">•</span>
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{formatTime(anuncio.data_evento)}</span>
                        </div>
                      )}
                      
                      <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {anuncio.titulo}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {anuncio.texto}
                      </p>
                      
                      {anuncio.imagem_url && anuncio.data_evento && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(anuncio.data_evento)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* App Download Section */}
      <section ref={appRef} className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content Side */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
                <Smartphone className="h-3 w-3" />
                <span>App Disponível</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                Baixe o App{" "}
                <span className="text-primary">InfoFlow</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                Tenha acesso rápido às informações da congregação direto no seu celular. 
                Funciona offline e é super leve.
              </p>

              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-0.5">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Android */}
                <Button
                  onClick={handleInstallClick}
                  size="lg"
                  className="gap-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all h-14 px-6"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                    <Download className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] opacity-80 leading-tight">Baixar para</p>
                    <p className="font-semibold text-sm leading-tight">Android</p>
                  </div>
                  <ChevronRight className="h-5 w-5 ml-auto" />
                </Button>

                {/* iOS */}
                <Button
                  onClick={() => setShowIOSInstructions(true)}
                  variant="outline"
                  size="lg"
                  className="gap-3 border-border hover:bg-muted h-14 px-6"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Share2 className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground leading-tight">Baixar para</p>
                    <p className="font-semibold text-sm leading-tight">iPhone / iPad</p>
                  </div>
                  <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-border">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-muted-foreground">100% Gratuito</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-muted-foreground">Sem anúncios</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-muted-foreground">Leve e rápido</span>
                </div>
              </div>
            </div>

            {/* Phone Mockup Side */}
            <div className="relative order-first lg:order-last">
              <div className="relative max-w-xs mx-auto">
                {/* Phone Frame */}
                <div className="relative bg-card rounded-[3rem] p-3 border border-border shadow-2xl">
                  {/* Screen */}
                  <div className="bg-background rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                    {/* Status Bar */}
                    <div className="h-12 bg-card border-b border-border flex items-center justify-center">
                      <div className="w-20 h-5 bg-muted rounded-full" />
                    </div>
                    
                    {/* App Content Preview */}
                    <div className="p-4 space-y-4">
                      {/* Logo */}
                      <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                          <span className="text-primary-foreground font-bold text-xs">IF</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">InfoFlow</p>
                          <p className="text-[10px] text-muted-foreground">Congregação Sabará</p>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="space-y-2">
                        {["Informações", "Quadro de Anúncios", "Administrador"].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              i === 0 && "bg-accent/20",
                              i === 1 && "bg-primary/20",
                              i === 2 && "bg-destructive/20"
                            )}>
                              <div className={cn(
                                "w-3 h-3 rounded",
                                i === 0 && "bg-accent",
                                i === 1 && "bg-primary",
                                i === 2 && "bg-destructive"
                              )} />
                            </div>
                            <span className="text-xs text-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center animate-float">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-accent/10 rounded-xl border border-accent/20 flex items-center justify-center animate-float-delayed">
                  <Bell className="h-5 w-5 text-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          {/* Seção Baixar Aplicativo */}
          <div className="flex flex-col items-center justify-center mb-10 pb-10 border-b border-border">
            <h3 className="text-lg font-bold text-foreground mb-2">Baixar o Aplicativo</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center">Acesse o sistema em seu dispositivo móvel</p>
            
            <div className="flex items-center gap-4">
              {/* Android */}
              <Link href="/login">
                <button className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                  <svg className="w-8 h-8 text-[#3DDC84] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.341a.998.998 0 0 0 .498-.868V9.516a.998.998 0 0 0-.498-.867l-5.025-2.9a.998.998 0 0 0-.996 0l-5.025 2.9a.998.998 0 0 0-.5.867v4.957a.998.998 0 0 0 .5.868l5.025 2.9a1 1 0 0 0 .996 0l5.025-2.9z"/>
                    <path d="M15.99 3.61a.75.75 0 0 1 1.02.25l.85 1.47a.75.75 0 0 1-1.3.75l-.84-1.47a.75.75 0 0 1 .27-1zm-7.98 0a.75.75 0 0 0-1.02.25l-.85 1.47a.75.75 0 0 0 1.3.75l.84-1.47a.75.75 0 0 0-.27-1z"/>
                    <rect x="5" y="7" width="14" height="10" rx="2" fill="currentColor"/>
                    <circle cx="8.5" cy="10.5" r="1" fill="white"/>
                    <circle cx="15.5" cy="10.5" r="1" fill="white"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground leading-tight">Baixar para</p>
                    <p className="font-semibold text-sm text-foreground leading-tight">Android</p>
                  </div>
                </button>
              </Link>

              {/* iOS */}
              <Link href="/login">
                <button className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                  <svg className="w-8 h-8 text-foreground group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground leading-tight">Baixar para</p>
                    <p className="font-semibold text-sm text-foreground leading-tight">iOS</p>
                  </div>
                </button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">IF</span>
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">InfoFlow</p>
                <p className="text-[10px] text-muted-foreground">Congregação Sabará</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-xs text-muted-foreground text-center md:text-right">
              {new Date().getFullYear()} InfoFlow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de instruções iOS */}
      {showIOSInstructions && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowIOSInstructions(false)}
        >
          <Card 
            className="w-full max-w-md bg-card border-border animate-in slide-in-from-bottom-4 duration-300 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">
                  Como instalar no iPhone
                </h3>
                <button 
                  onClick={() => setShowIOSInstructions(false)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm mb-1">Abra o menu de compartilhamento</p>
                    <p className="text-xs text-muted-foreground">
                      Toque no ícone de <Share2 className="inline h-3 w-3" /> na barra do Safari
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm mb-1">Adicionar à Tela de Início</p>
                    <p className="text-xs text-muted-foreground">
                      Role para baixo e toque nessa opção
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm mb-1">Confirme a instalação</p>
                    <p className="text-xs text-muted-foreground">
                      Toque em Adicionar no canto superior direito
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowIOSInstructions(false)}
                className="w-full mt-6 h-12"
              >
                Entendi
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite 1s;
        }
      `}</style>
    </div>
  )
}

// Tipo para o evento de instalação do PWA
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}
