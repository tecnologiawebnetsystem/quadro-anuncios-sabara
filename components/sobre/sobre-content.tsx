"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
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
  const [activeSection, setActiveSection] = useState("inicio")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const heroRef = useRef<HTMLElement>(null)
  const anunciosRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false)
    const refs: { [key: string]: React.RefObject<HTMLElement | null> } = {
      inicio: heroRef,
      anuncios: anunciosRef,
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

  const navItems: { id: string; label: string; highlight?: boolean }[] = []

  

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
                <p className="text-[10px] text-muted-foreground -mt-0.5">Congregação Pq. Sabará</p>
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
                      ? "text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
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
                <Button size="sm" className="gap-2 bg-amber-500 hover:bg-amber-400 text-[#0f2550] font-semibold shadow-md hover:shadow-amber-400/30 transition-all">
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
                      ? "text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
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
                  <Button className="w-full gap-2 bg-amber-500 hover:bg-amber-400 text-[#0f2550] font-semibold shadow-md hover:shadow-amber-400/30 transition-all">
                    Acessar Sistema
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative flex items-center justify-center overflow-hidden pt-24 pb-12">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_var(--border)_1px,_transparent_1px),_linear-gradient(to_bottom,_var(--border)_1px,_transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Testemunhas de Jeová</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Congregação{" "}
            <span className="text-primary relative">
              Pq. Sabará
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M1 5.5C47.6667 2.16667 141 -2.4 199 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary/40"/>
              </svg>
            </span>
          </h1>

          
        </div>

        
      </section>

      {/* Anúncio em destaque — centralizado, um por vez */}
      <section ref={anunciosRef} className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {anuncios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
                <Calendar className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Nenhum anúncio no momento</h3>
              <p className="text-muted-foreground max-w-xs">
                Volte em breve para conferir as novidades da congregação
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-10">
              {anuncios.map((anuncio) => (
                <div
                  key={anuncio.id}
                  className="w-full rounded-3xl border border-border bg-card shadow-xl shadow-primary/5 overflow-hidden"
                >
                  {/* Imagem de destaque */}
                  {anuncio.imagem_url && (
                    <div className="relative w-full h-72 sm:h-96">
                      <Image
                        src={anuncio.imagem_url}
                        alt={anuncio.titulo}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 672px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    </div>
                  )}

                  {/* Conteúdo */}
                  <div className={cn("px-8 py-10 text-center", !anuncio.imagem_url && "pt-12")}>
                    {anuncio.data_evento && (
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium mb-6">
                        <Calendar className="h-4 w-4" />
                        <span className="capitalize">{formatDate(anuncio.data_evento)}</span>
                      </div>
                    )}

                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-5 text-balance leading-tight">
                      {anuncio.titulo}
                    </h2>

                    <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                      {anuncio.texto}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">IF</span>
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">InfoFlow</p>
                <p className="text-[10px] text-muted-foreground">Congregação Pq. Sabará</p>
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
    </div>
  )
}
