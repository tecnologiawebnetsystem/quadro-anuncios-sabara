"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Lock, ChevronRight, Delete, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

const SENHA_ADMIN = "123456"

export default function Home() {
  const router = useRouter()
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDigito = (digito: string) => {
    if (senha.length < 6) {
      const novaSenha = senha + digito
      setSenha(novaSenha)
      setErro(false)
      
      // Verifica automaticamente quando tiver 6 dígitos
      if (novaSenha.length === 6) {
        if (novaSenha === SENHA_ADMIN) {
          router.push("/admin")
        } else {
          setErro(true)
          setTimeout(() => {
            setSenha("")
            setErro(false)
          }, 1000)
        }
      }
    }
  }

  const handleApagar = () => {
    setSenha(senha.slice(0, -1))
    setErro(false)
  }

  const handleConsulta = () => {
    router.push("/consulta")
  }

  // Evita problemas de hidratação - renderiza skeleton no servidor
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="absolute -inset-[1px] bg-gradient-to-br from-red-600/40 via-red-800/20 to-red-600/40 rounded-3xl" />
          <div className="relative bg-gradient-to-b from-zinc-900/95 via-zinc-900 to-zinc-950 rounded-3xl p-8 backdrop-blur-sm border border-zinc-800/50 shadow-2xl shadow-red-950/20 min-h-[500px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center p-4">
      {/* Moldura Principal */}
      <div className="relative w-full max-w-md">
        {/* Borda externa com gradiente vermelho sutil */}
        <div className="absolute -inset-[1px] bg-gradient-to-br from-red-600/40 via-red-800/20 to-red-600/40 rounded-3xl" />
        
        {/* Card principal com fundo escuro diferenciado */}
        <div className="relative bg-gradient-to-b from-zinc-900/95 via-zinc-900 to-zinc-950 rounded-3xl p-8 backdrop-blur-sm border border-zinc-800/50 shadow-2xl shadow-red-950/20">
          
          {/* Efeito de brilho no topo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
          
          {/* Logo InfoFlow - Preto, Branco e Vermelho */}
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 rounded-2xl bg-zinc-950 border-2 border-red-600 flex items-center justify-center shadow-xl shadow-red-600/20 relative overflow-hidden">
              {/* Efeito de gradiente sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent" />
              <div className="text-center z-10">
                <div className="text-white text-2xl font-black tracking-tight">
                  Info<span className="text-red-500">Flow</span>
                </div>
                <div className="w-12 h-0.5 bg-red-500 mx-auto mt-1" />
              </div>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-black text-white mb-1 text-center">
            Quadro de <span className="text-red-500">Anúncios</span>
          </h1>
          <p className="text-zinc-500 text-sm tracking-[0.3em] mb-8 text-center">CONGREGAÇÃO SABARÀ</p>

          {!mostrarSenha ? (
            // Card com opções
            <Card className="w-full bg-zinc-800/50 border-zinc-700/50 shadow-lg">
              <CardContent className="p-0">
                {/* Informações da Congregação */}
                <button
                  onClick={handleConsulta}
                  className="w-full flex items-center gap-4 p-4 hover:bg-zinc-700/50 transition-colors border-b border-zinc-700/50 rounded-t-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
                    <Info className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-semibold">Informações da Congregação</p>
                    <p className="text-zinc-400 text-sm">Consultar designações e grupos</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-500" />
                </button>

                {/* Administrador */}
                <button
                  onClick={() => setMostrarSenha(true)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-zinc-700/50 transition-colors rounded-b-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-700 flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-6 h-6 text-zinc-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-semibold">Administrador</p>
                    <p className="text-zinc-400 text-sm">Acesso completo ao sistema</p>
                  </div>
                  <Lock className="w-4 h-4 text-zinc-500 mr-1" />
                  <ChevronRight className="w-5 h-5 text-zinc-500" />
                </button>
              </CardContent>
            </Card>
          ) : (
            // Teclado numérico para senha
            <Card className="w-full bg-zinc-800/50 border-zinc-700/50 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-zinc-700 flex items-center justify-center mx-auto mb-4 shadow-md">
                    <ShieldCheck className="w-6 h-6 text-zinc-300" />
                  </div>
                  <p className="text-white font-semibold mb-1">Administrador</p>
                  <p className="text-zinc-400 text-sm">Digite a senha de acesso</p>
                </div>
                
                {/* Indicadores de dígitos */}
                <div className="flex justify-center gap-3 mb-6">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-all ${
                        erro 
                          ? "bg-red-500" 
                          : i < senha.length 
                            ? "bg-amber-500" 
                            : "bg-zinc-600"
                      }`}
                    />
                  ))}
                </div>
                
                {erro && (
                  <p className="text-red-500 text-sm text-center mb-4">Senha incorreta</p>
                )}

                {/* Teclado numérico */}
                <div className="grid grid-cols-3 gap-2">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                    <Button
                      key={num}
                      onClick={() => handleDigito(num)}
                      variant="outline"
                      className="h-14 text-xl font-bold border-zinc-600 bg-zinc-800/50 hover:bg-zinc-700 hover:border-zinc-500"
                    >
                      {num}
                    </Button>
                  ))}
                  
                  {/* Linha inferior: Voltar, 0, Apagar */}
                  <Button
                    onClick={() => {
                      setMostrarSenha(false)
                      setSenha("")
                      setErro(false)
                    }}
                    variant="ghost"
                    className="h-14 text-xs text-zinc-400 hover:text-white"
                  >
                    Voltar
                  </Button>
                  
                  <Button
                    onClick={() => handleDigito("0")}
                    variant="outline"
                    className="h-14 text-xl font-bold border-zinc-600 bg-zinc-800/50 hover:bg-zinc-700 hover:border-zinc-500"
                  >
                    0
                  </Button>
                  
                  <Button
                    onClick={handleApagar}
                    variant="ghost"
                    className="h-14 text-zinc-400 hover:text-white"
                  >
                    <Delete className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rodapé com versão - dentro da moldura */}
          <p className="text-zinc-600 text-xs tracking-[0.2em] mt-6 text-center">INFOFLOW v1.0</p>
          
          {/* Efeito de brilho no fundo */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
        </div>
      </div>
    </div>
  )
}
