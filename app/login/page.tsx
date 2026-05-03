"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Delete, Info, ArrowLeft, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

const SENHAS_PADRAO: Record<string, string> = {
  anciao: "123456",
  administrador: "080754",
}

const DESTINOS: Record<string, string> = {
  anciao: "/anciao",
  administrador: "/admin",
}

type Perfil = "anciao" | "administrador" | null

export default function LoginPage() {
  const router = useRouter()
  const [perfil, setPerfil] = useState<Perfil>(null)
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [senhas, setSenhas] = useState<Record<string, string>>(SENHAS_PADRAO)

  useEffect(() => {
    setMounted(true)
    fetch("/api/senhas")
      .then(res => res.json())
      .then(data => {
        if (data.administrador && data.anciao) setSenhas(data)
      })
      .catch(() => {})
  }, [])

  const handleDigito = (digito: string) => {
    if (senha.length >= 6) return
    const novaSenha = senha + digito
    setSenha(novaSenha)
    setErro(false)

    if (novaSenha.length === 6 && perfil) {
      const senhaCorreta = senhas[perfil]
      if (novaSenha === senhaCorreta) {
        router.push(DESTINOS[perfil])
      } else {
        setErro(true)
        setTimeout(() => { setSenha(""); setErro(false) }, 1000)
      }
    }
  }

  const handleApagar = () => {
    setSenha(senha.slice(0, -1))
    setErro(false)
  }

  if (!mounted) {
    return <div className="min-h-screen bg-[#1a3a6e] flex items-center justify-center" />
  }

  const perfilConfig = {
    anciao: {
      label: "Ancião",
      descricao: "Acesso ao quadro de anúncios da congregação.",
      cor: "text-amber-500",
      bgCor: "bg-amber-500/15",
      borderCor: "border-amber-500/30",
      icon: UserCheck,
    },
    administrador: {
      label: "Administrador",
      descricao: "Acesso completo ao sistema",
      cor: "text-sky-400",
      bgCor: "bg-sky-500/15",
      borderCor: "border-sky-500/30",
      icon: ShieldCheck,
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #0f2550 0%, #1a3a6e 50%, #0f2550 100%)" }}
    >
      <Link href="/" className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-sky-200/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </Link>

      <div className="w-full max-w-sm relative">
        {/* Glow sutil */}
        <div className="absolute inset-0 rounded-2xl bg-sky-400/10 blur-2xl pointer-events-none" />

        <Card className="relative bg-[#1c3d77]/90 border-sky-700/40 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />

          <CardContent className="p-8">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative w-12 h-12 rounded-xl bg-[#0f2550] border border-sky-500/40 flex items-center justify-center overflow-hidden">
                <span className="relative text-white font-black text-sm">IF</span>
              </div>
              <div>
                <p className="text-white font-bold text-base leading-none">InfoFlow</p>
                <p className="text-sky-300/60 text-xs mt-0.5">Congregação Parque Sabará</p>
              </div>
            </div>

            {/* Título */}
            <div className="mb-8">
              <h1 className="text-3xl font-black text-white leading-tight">
                Quadro de <span className="text-amber-400">Anúncios</span>
              </h1>
              <p className="text-sky-300/50 text-xs uppercase tracking-widest mt-1">
                Congregação Parque Sabará
              </p>
            </div>

            {/* Seleção de perfil */}
            {!perfil ? (
              <div className="rounded-xl border border-sky-700/40 overflow-hidden divide-y divide-sky-700/30">
                {/* Público */}
                <button
                  onClick={() => router.push("/consulta")}
                  className="w-full flex items-center gap-4 p-4 hover:bg-sky-600/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center flex-shrink-0">
                    <Info className="h-5 w-5 text-sky-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">Publicador</p>
                    <p className="text-sky-300/60 text-xs mt-0.5">Consultar o quadro de anúncios.</p>
                  </div>
                  <svg className="w-4 h-4 text-sky-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Ancião */}
                <button
                  onClick={() => setPerfil("anciao")}
                  className="w-full flex items-center gap-4 p-4 hover:bg-amber-500/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">Ancião</p>
                    <p className="text-sky-300/60 text-xs mt-0.5">Acesso ao quadro de anúncios da congregação.</p>
                  </div>
                  <svg className="w-4 h-4 text-sky-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Administrador */}
                <button
                  onClick={() => setPerfil("administrador")}
                  className="w-full flex items-center gap-4 p-4 hover:bg-sky-500/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-sky-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">Administrador</p>
                    <p className="text-sky-300/60 text-xs mt-0.5">Acesso completo ao sistema</p>
                  </div>
                  <svg className="w-4 h-4 text-sky-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ) : (
              /* Teclado numérico */
              <div>
                {(() => {
                  const cfg = perfilConfig[perfil]
                  const Icon = cfg.icon
                  return (
                    <div className="text-center mb-6">
                      <div className={cn("w-12 h-12 rounded-xl border flex items-center justify-center mx-auto mb-3", cfg.bgCor, cfg.borderCor)}>
                        <Icon className={cn("w-6 h-6", cfg.cor)} />
                      </div>
                      <p className="text-white font-semibold text-sm">{cfg.label}</p>
                      <p className="text-sky-300/60 text-xs mt-1">Digite a senha de acesso</p>
                    </div>
                  )
                })()}

                {/* Indicadores */}
                <div className="flex justify-center gap-3 mb-5">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-150",
                        erro
                          ? "bg-red-400"
                          : i < senha.length
                            ? "bg-amber-400"
                            : "bg-sky-700/60"
                      )}
                    />
                  ))}
                </div>

                {erro && (
                  <p className="text-red-400 text-xs text-center mb-4">Senha incorreta</p>
                )}

                {/* Teclado */}
                <div className="grid grid-cols-3 gap-2">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                    <Button
                      key={num}
                      onClick={() => handleDigito(num)}
                      variant="outline"
                      className="h-14 text-xl font-bold border-sky-600/40 bg-sky-800/30 hover:bg-sky-600/30 hover:border-sky-400/60 text-white"
                    >
                      {num}
                    </Button>
                  ))}

                  <Button
                    onClick={() => { setPerfil(null); setSenha(""); setErro(false) }}
                    variant="ghost"
                    className="h-14 text-xs text-sky-300/60 hover:text-white hover:bg-sky-600/20"
                  >
                    Voltar
                  </Button>

                  <Button
                    onClick={() => handleDigito("0")}
                    variant="outline"
                    className="h-14 text-xl font-bold border-sky-600/40 bg-sky-800/30 hover:bg-sky-600/30 hover:border-sky-400/60 text-white"
                  >
                    0
                  </Button>

                  <Button
                    onClick={handleApagar}
                    variant="ghost"
                    className="h-14 text-sky-300/60 hover:text-white hover:bg-sky-600/20 flex items-center justify-center"
                  >
                    <Delete className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            <p className="text-sky-600/50 text-[10px] text-center uppercase tracking-widest mt-8">
              InfoFlow v1.0
            </p>
          </CardContent>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
        </Card>
      </div>
    </div>
  )
}
