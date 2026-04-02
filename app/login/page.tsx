"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Delete, Info, ArrowLeft, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

const SENHAS: Record<string, { senha: string; destino: string }> = {
  anciao:        { senha: "123456", destino: "/anciao" },
  administrador: { senha: "080754", destino: "/admin" },
}

type Perfil = "anciao" | "administrador" | null

export default function LoginPage() {
  const router = useRouter()
  const [perfil, setPerfil] = useState<Perfil>(null)
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleDigito = (digito: string) => {
    if (senha.length >= 6) return
    const novaSenha = senha + digito
    setSenha(novaSenha)
    setErro(false)

    if (novaSenha.length === 6 && perfil) {
      const config = SENHAS[perfil]
      if (novaSenha === config.senha) {
        router.push(config.destino)
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
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center" />
  }

  const perfilConfig = {
    anciao: {
      label: "Ancião",
      descricao: "Acesso às designações da congregação",
      cor: "text-amber-400",
      bgCor: "bg-amber-600/20",
      borderCor: "border-amber-600/30",
      icon: UserCheck,
    },
    administrador: {
      label: "Administrador",
      descricao: "Acesso completo ao sistema",
      cor: "text-red-400",
      bgCor: "bg-red-600/20",
      borderCor: "border-red-600/30",
      icon: ShieldCheck,
    },
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Link href="/" className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </Link>

      <div className="w-full max-w-sm relative">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-red-600/20 to-transparent pointer-events-none" />

        <Card className="relative bg-zinc-900 border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          <CardContent className="p-8">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 to-transparent" />
                <span className="relative text-white font-black text-sm">IF</span>
              </div>
              <div>
                <p className="text-white font-bold text-base leading-none">InfoFlow</p>
                <p className="text-zinc-500 text-xs mt-0.5">Congregação Sabarà</p>
              </div>
            </div>

            {/* Título */}
            <div className="mb-8">
              <h1 className="text-3xl font-black text-white leading-tight">
                Quadro de <span className="text-red-500">Anúncios</span>
              </h1>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">
                Congregação Sabarà
              </p>
            </div>

            {/* Seleção de perfil */}
            {!perfil ? (
              <div className="rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800">
                {/* Público */}
                <button
                  onClick={() => router.push("/consulta")}
                  className="w-full flex items-center gap-4 p-4 hover:bg-zinc-800/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-600/30 flex items-center justify-center flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">Publicador</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Consultar designações e grupos</p>
                  </div>
                  <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Ancião */}
                <button
                  onClick={() => setPerfil("anciao")}
                  className="w-full flex items-center gap-4 p-4 hover:bg-zinc-800/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-600/20 border border-amber-600/30 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">Ancião</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Acesso às designações da congregação</p>
                  </div>
                  <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Administrador */}
                <button
                  onClick={() => setPerfil("administrador")}
                  className="w-full flex items-center gap-4 p-4 hover:bg-zinc-800/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-600/30 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">Administrador</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Acesso completo ao sistema</p>
                  </div>
                  <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      <p className="text-zinc-500 text-xs mt-1">Digite a senha de acesso</p>
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
                          ? "bg-red-500"
                          : i < senha.length
                          ? "bg-white"
                          : "bg-zinc-700"
                      )}
                    />
                  ))}
                </div>

                {erro && (
                  <p className="text-red-500 text-xs text-center mb-4">Senha incorreta</p>
                )}

                {/* Teclado */}
                <div className="grid grid-cols-3 gap-2">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                    <Button
                      key={num}
                      onClick={() => handleDigito(num)}
                      variant="outline"
                      className="h-14 text-xl font-bold border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 hover:border-zinc-500 text-white"
                    >
                      {num}
                    </Button>
                  ))}

                  <Button
                    onClick={() => { setPerfil(null); setSenha(""); setErro(false) }}
                    variant="ghost"
                    className="h-14 text-xs text-zinc-400 hover:text-white"
                  >
                    Voltar
                  </Button>

                  <Button
                    onClick={() => handleDigito("0")}
                    variant="outline"
                    className="h-14 text-xl font-bold border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 hover:border-zinc-500 text-white"
                  >
                    0
                  </Button>

                  <Button
                    onClick={handleApagar}
                    variant="ghost"
                    className="h-14 text-zinc-400 hover:text-white flex items-center justify-center"
                  >
                    <Delete className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            <p className="text-zinc-700 text-[10px] text-center uppercase tracking-widest mt-8">
              InfoFlow v1.0
            </p>
          </CardContent>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
        </Card>
      </div>
    </div>
  )
}
